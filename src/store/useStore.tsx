import {
  createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type ReactNode,
} from 'react';
import type { Product } from '../data/products';
import { burstPetals, bumpBag } from '../lib/petals';

/* ─── Cart ─── */
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: Product; quantity?: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'TOGGLE' }
  | { type: 'CLOSE' }
  | { type: 'OPEN' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = action.quantity || 1;
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + qty } : i,
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: qty }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i,
        ),
      };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'OPEN':
      return { ...state, isOpen: true };
    default:
      return state;
  }
}

/* ─── Wishlist ─── */
interface WishlistState {
  ids: number[];
}
type WishlistAction = { type: 'TOGGLE_WISH'; productId: number };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  if (action.type === 'TOGGLE_WISH') {
    const has = state.ids.includes(action.productId);
    return { ids: has ? state.ids.filter((id) => id !== action.productId) : [...state.ids, action.productId] };
  }
  return state;
}

/* ─── Search overlay ─── */
interface SearchState {
  isOpen: boolean;
  query: string;
}
type SearchAction = { type: 'OPEN_SEARCH' } | { type: 'CLOSE_SEARCH' } | { type: 'SET_QUERY'; query: string };

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'OPEN_SEARCH':
      return { ...state, isOpen: true };
    case 'CLOSE_SEARCH':
      return { isOpen: false, query: '' };
    case 'SET_QUERY':
      return { ...state, query: action.query };
    default:
      return state;
  }
}

/* ─── Press-and-hold preview + toast ─── */
export interface PreviewState {
  product: Product;
  x: number;
  y: number;
}
interface ToastState {
  id: number;
  text: string;
}

/* ─── Storage helpers ─── */
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) */
  }
}

/* ─── Context ─── */
interface StoreContextType {
  cart: CartState;
  cartDispatch: React.Dispatch<CartAction>;
  cartTotal: number;
  cartCount: number;
  /** Adds to the bag, releases petals from `origin` and shows a toast. */
  addToBag: (product: Product, opts?: { quantity?: number; origin?: { x: number; y: number } | Element | null }) => void;
  wishlist: WishlistState;
  wishlistDispatch: React.Dispatch<WishlistAction>;
  isWished: (id: number) => boolean;
  search: SearchState;
  searchDispatch: React.Dispatch<SearchAction>;
  preview: PreviewState | null;
  openPreview: (p: PreviewState) => void;
  closePreview: () => void;
  toast: ToastState | null;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, cartDispatch] = useReducer(
    cartReducer,
    undefined,
    (): CartState => ({ items: readJSON<CartItem[]>('vannam-cart', []), isOpen: false }),
  );
  const [wishlist, wishlistDispatch] = useReducer(
    wishlistReducer,
    undefined,
    (): WishlistState => ({ ids: readJSON<number[]>('vannam-wishlist', []) }),
  );
  const [search, searchDispatch] = useReducer(searchReducer, { isOpen: false, query: '' });
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => writeJSON('vannam-cart', cart.items), [cart.items]);
  useEffect(() => writeJSON('vannam-wishlist', wishlist.ids), [wishlist.ids]);

  const cartTotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const isWished = (id: number) => wishlist.ids.includes(id);

  const addToBag = useCallback<StoreContextType['addToBag']>((product, opts) => {
    cartDispatch({ type: 'ADD', product, quantity: opts?.quantity });
    const o = opts?.origin;
    if (o && 'getBoundingClientRect' in o) {
      const r = o.getBoundingClientRect();
      burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    } else if (o) {
      burstPetals(o);
    } else {
      bumpBag();
    }
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text: `${product.name} is in your bag` });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const openPreview = useCallback((p: PreviewState) => setPreview(p), []);
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <StoreContext.Provider
      value={{
        cart, cartDispatch, cartTotal, cartCount, addToBag,
        wishlist, wishlistDispatch, isWished,
        search, searchDispatch,
        preview, openPreview, closePreview,
        toast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
