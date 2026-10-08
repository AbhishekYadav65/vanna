export interface ProductImage {
  file: string;
  kind: string;
  alt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  discountPercent: number;
  currency: string;
  fabric: string;
  tags: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  details: Record<string, string>;
  images: ProductImage[];
  amazonTitle: string;
  amazonUrl: string;
  dimensions: string;
}

export interface ProductData {
  brand: string;
  instagram: string;
  currency: string;
  products: Product[];
}

export const CATEGORIES = [
  { slug: 'hair-tool-pouches', name: 'Hair Tool Pouches', label: 'Hair Tools' },
  { slug: 'makeup-pouches', name: 'Makeup Pouches', label: 'Makeup' },
  { slug: 'napkin-small-pouches', name: 'Napkin & Small Pouches', label: 'Napkins & Small' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

export function getCategorySlug(categoryName: string): CategorySlug {
  if (categoryName.includes('Hair')) return 'hair-tool-pouches';
  if (categoryName.includes('Makeup')) return 'makeup-pouches';
  return 'napkin-small-pouches';
}

export function getCategoryName(slug: string): string {
  return CATEGORIES.find(c => c.slug === slug)?.name || 'All Products';
}

export function getImageUrl(file: string): string {
  // file is like "images/filename.jpg"
  return `/${file}`;
}

const productsData: ProductData = {
  brand: "Vannam",
  instagram: "https://www.instagram.com/vannam.ig",
  currency: "INR",
  products: [
    {
      id: 1,
      name: "Airwrap Pouch · Pink Gingham Ruffle",
      slug: "dyson-airwrap-pouch-pink-gingham-ruffle",
      category: "Hair Tool Pouches",
      price: 1790,
      mrp: 1990,
      discountPercent: 10,
      currency: "INR",
      fabric: "Pink gingham, quilted, ruffle trim, pink interior with 4 compartments",
      tags: ["Pinteresty", "gingham", "ruffle", "dyson", "compartments"],
      shortDescription: "Quilted pink gingham pouch with 4 fitted compartments for your Dyson Airwrap curls.",
      description: "A custom-made hair tool pouch for the Dyson Airwrap in soft pink gingham with a ruffled top edge. Four fitted compartments keep each curling barrel and attachment snug and protected, and the quilted cotton keeps everything safe in transit. Handcrafted in Coimbatore.",
      highlights: [
        "4 compartments for Dyson curls",
        "Premium quilted cotton, hand-washable",
        "Smooth, durable YKK zipper",
        "Ruffle detail, handcrafted with love"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "YKK zipper" },
      images: [
        { file: "images/dyson-airwrap-pouch-pink-gingham-ruffle__1790__1990.jpg", kind: "studio", alt: "Airwrap Pouch · Pink Gingham Ruffle, on white background" },
        { file: "images/dyson-airwrap-pouch-pink-gingham-ruffle__2.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Pink Gingham Ruffle, styled lifestyle shot" },
        { file: "images/dyson-airwrap-pouch-pink-gingham-ruffle__3.jpg", kind: "infographic", alt: "Airwrap Pouch · Pink Gingham Ruffle, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 2,
      name: "Airwrap Pouch · Polka & Lace",
      slug: "dyson-airwrap-pouch-polka-lace",
      category: "Hair Tool Pouches",
      price: 1690,
      mrp: 1990,
      discountPercent: 15,
      currency: "INR",
      fabric: "Black and white polka dots, pink eyelet lace trim, pink interior with compartments",
      tags: ["Pinteresty", "polka", "lace", "dyson", "compartments"],
      shortDescription: "Polka-dot Airwrap pouch with pink eyelet lace and smart compartments.",
      description: "A custom-made hair tool pouch for the Dyson Airwrap in classic black-and-white polka dots, finished with a pink eyelet lace trim and a soft pink interior. Smart compartments give the Airwrap and its attachments a perfect fit with soft, safe protection. Handmade with love.",
      highlights: [
        "Perfect fit for your tools",
        "Soft and safe protection",
        "Smart compartments",
        "Made with love in Coimbatore"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/dyson-airwrap-pouch-polka-lace__1690__1990.jpg", kind: "studio", alt: "Airwrap Pouch · Polka & Lace, on white background" },
        { file: "images/dyson-airwrap-pouch-polka-lace__2.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Polka & Lace, styled lifestyle shot" },
        { file: "images/dyson-airwrap-pouch-polka-lace__3.jpg", kind: "infographic", alt: "Airwrap Pouch · Polka & Lace, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 3,
      name: "Airwrap Pouch · Blue Stripe & Bows",
      slug: "dyson-airwrap-pouch-blue-stripe-bow",
      category: "Hair Tool Pouches",
      price: 1690,
      mrp: 1990,
      discountPercent: 15,
      currency: "INR",
      fabric: "Pale blue stripe with tiny embroidered red bows, quilted, red interior with compartments",
      tags: ["Pinteresty", "stripe", "bows", "dyson", "compartments"],
      shortDescription: "Quilted blue-stripe pouch with red bow embroidery and a bright red compartmental lining.",
      description: "A spacious, compartmental Dyson Airwrap pouch in pale blue stripes dotted with tiny red bows. Quilted soft cotton outside, a vivid red lining inside, and a smooth YKK zipper. Each attachment has its own slot, so the whole kit travels safe.",
      highlights: [
        "Spacious compartmental design",
        "Premium YKK zipper, smooth and long lasting",
        "Soft, quilted and padded cotton",
        "Stylish and functional"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "YKK zipper" },
      images: [
        { file: "images/dyson-airwrap-pouch-blue-stripe-bow__1690__1990.jpg", kind: "studio", alt: "Airwrap Pouch · Blue Stripe & Bows, on white background" },
        { file: "images/dyson-airwrap-pouch-blue-stripe-bow__2.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Blue Stripe & Bows, styled lifestyle shot" },
        { file: "images/dyson-airwrap-pouch-blue-stripe-bow__3.jpg", kind: "infographic", alt: "Airwrap Pouch · Blue Stripe & Bows, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 4,
      name: "Airwrap Pouch · Navy Quilted",
      slug: "dyson-airwrap-pouch-navy-quilted",
      category: "Hair Tool Pouches",
      price: 1690,
      mrp: 1990,
      discountPercent: 15,
      currency: "INR",
      fabric: "Navy denim-look cotton, vertical quilting, pink zipper and lining",
      tags: ["Pinteresty", "navy", "denim", "quilted", "dyson", "compartments"],
      shortDescription: "Navy quilted Airwrap pouch with a pop of pink at the zip.",
      description: "Make your Dyson attachments safe in a handmade navy quilted pouch with a contrasting pink zipper and lining. Smart compartments, soft and safe protection, and a perfect fit for your tools.",
      highlights: [
        "Smart compartments",
        "Soft and safe protection",
        "Handmade hair tool pouch",
        "Pink zip and lining for contrast"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/dyson-airwrap-pouch-navy-quilted__1690__1990.jpg", kind: "studio", alt: "Airwrap Pouch · Navy Quilted, on white background" },
        { file: "images/dyson-airwrap-pouch-navy-quilted__2.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Navy Quilted, styled lifestyle shot" },
        { file: "images/dyson-airwrap-pouch-navy-quilted__3.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Navy Quilted, styled lifestyle shot" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 5,
      name: "Airwrap Pouch · Pink Stripe Ruffle",
      slug: "dyson-airwrap-pouch-pink-stripe-ruffle",
      category: "Hair Tool Pouches",
      price: 1790,
      mrp: 1990,
      discountPercent: 10,
      currency: "INR",
      fabric: "Pink and white stripe, quilted, ruffle trim, periwinkle blue compartments",
      tags: ["Pinteresty", "stripe", "ruffle", "dyson", "compartments"],
      shortDescription: "Pink-stripe ruffle Airwrap pouch with periwinkle compartments.",
      description: "A dyson hair tool pouch in pink-and-white stripes with a beautiful ruffle edge and periwinkle blue compartments that hold each attachment in place. Spacious, lightweight and travel friendly, in premium hand-washable cotton with a smooth YKK zipper.",
      highlights: [
        "Spacious storage, lightweight and travel friendly",
        "Premium cotton, durable and hand washable",
        "Beautiful ruffle detail",
        "Premium YKK zipper"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "YKK zipper" },
      images: [
        { file: "images/dyson-airwrap-pouch-pink-stripe-ruffle__1790__1990.jpg", kind: "studio", alt: "Airwrap Pouch · Pink Stripe Ruffle, on white background" },
        { file: "images/dyson-airwrap-pouch-pink-stripe-ruffle__2.jpg", kind: "lifestyle", alt: "Airwrap Pouch · Pink Stripe Ruffle, styled lifestyle shot" },
        { file: "images/dyson-airwrap-pouch-pink-stripe-ruffle__3.jpg", kind: "infographic", alt: "Airwrap Pouch · Pink Stripe Ruffle, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 6,
      name: "Hair Tool Pouch · Red Gingham Ruffle",
      slug: "hairtool-wrap-pouch-red-gingham-ruffle",
      category: "Hair Tool Pouches",
      price: 1190,
      mrp: 1490,
      discountPercent: 20,
      currency: "INR",
      fabric: "Red and white gingham, quilted, ruffle trim, deep red interior, no inner compartments",
      tags: ["Pinteresty", "gingham", "ruffle", "hair tools", "no compartments"],
      shortDescription: "Open-plan quilted gingham pouch for a straightener, brush, comb and serums.",
      description: "A roomy, compartment-free hair tool pouch in red gingham with a ruffled edge and a rich red lining. Fits a straightener, hair dryer, hairbrush, comb, hair serum and other hair essentials, and doubles as a makeup and travel organiser.",
      highlights: [
        "Fits straightener, hair dryer, brush, comb and serums",
        "Quilted, ruffle-trimmed gingham",
        "Deep red lining",
        "Makeup and hair tool storage"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/hairtool-wrap-pouch-red-gingham-ruffle__1190__1490.jpg", kind: "studio", alt: "Hair Tool Pouch · Red Gingham Ruffle, on white background" },
        { file: "images/hairtool-wrap-pouch-red-gingham-ruffle__2.jpg", kind: "lifestyle", alt: "Hair Tool Pouch · Red Gingham Ruffle, styled lifestyle shot" },
        { file: "images/hairtool-wrap-pouch-red-gingham-ruffle__3.jpg", kind: "lifestyle", alt: "Hair Tool Pouch · Red Gingham Ruffle, styled lifestyle shot" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 7,
      name: "Napkin Pouch · Pink Hearts",
      slug: "napkin-pouch-pink-hearts",
      category: "Napkin & Small Pouches",
      price: 375,
      mrp: 475,
      discountPercent: 21,
      currency: "INR",
      fabric: "Pink cotton with red hearts, magnetic button closure",
      tags: ["Pinteresty", "hearts", "napkin", "small pouch", "cotton"],
      shortDescription: "Cotton napkin pouch with a magnet button, holds 5 to 6 napkins.",
      description: "A pocket-sized cotton napkin pouch in heart-print pink with a secure magnet button closure. Holds 5 to 6 napkins, stays fresh, hand washable, and easy to reuse. Carry napkins beautifully.",
      highlights: [
        "Holds 5 to 6 napkins",
        "Magnet button closure",
        "Premium cotton fabric",
        "Hand washable, fine stitching"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "Magnet button" },
      images: [
        { file: "images/napkin-pouch-pink-hearts__375__475.jpg", kind: "studio", alt: "Napkin Pouch · Pink Hearts, on white background" },
        { file: "images/napkin-pouch-pink-hearts__2.jpg", kind: "lifestyle", alt: "Napkin Pouch · Pink Hearts, styled lifestyle shot" },
        { file: "images/napkin-pouch-pink-hearts__3.jpg", kind: "infographic", alt: "Napkin Pouch · Pink Hearts, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 8,
      name: "Makeup Pouch · Pink Chess",
      slug: "makeup-pouch-pink-chess",
      category: "Makeup Pouches",
      price: 675,
      mrp: 775,
      discountPercent: 13,
      currency: "INR",
      fabric: "Red and pink checkerboard-stripe cotton, red zipper",
      tags: ["Pinteresty", "checker", "makeup", "travel"],
      shortDescription: "Lightweight checkerboard makeup pouch, sturdy and travel friendly.",
      description: "The Pink Chess makeup pouch: a bold red-and-pink checker print on premium cotton with a smooth YKK zipper and a sturdy structure. Lightweight, travel friendly, and perfect for everyday essentials.",
      highlights: [
        "Smooth YKK zipper",
        "Premium cotton fabric",
        "Sturdy structure",
        "Lightweight and travel friendly"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "YKK zipper" },
      images: [
        { file: "images/makeup-pouch-pink-chess__675__775.jpg", kind: "studio", alt: "Makeup Pouch · Pink Chess, on white background" },
        { file: "images/makeup-pouch-pink-chess__2.jpg", kind: "lifestyle", alt: "Makeup Pouch · Pink Chess, styled lifestyle shot" },
        { file: "images/makeup-pouch-pink-chess__3.jpg", kind: "infographic", alt: "Makeup Pouch · Pink Chess, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 9,
      name: "Makeup Pouch · Cheetah",
      slug: "makeup-pouch-cheetah",
      category: "Makeup Pouches",
      price: 675,
      mrp: 775,
      discountPercent: 13,
      currency: "INR",
      fabric: "Quilted leopard-print fabric, black zipper and lining",
      tags: ["Pinteresty", "leopard", "cheetah", "makeup", "quilted"],
      shortDescription: "Quilted cheetah-print makeup pouch for everyday essentials.",
      description: "The Cheetah makeup pouch in soft quilted leopard print with a black zipper and lining. Perfect for your everyday essentials, at home or on the go.",
      highlights: [
        "Quilted cheetah print",
        "Black zipper and lining",
        "Perfect for everyday essentials",
        "Travel organiser"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/makeup-pouch-cheetah__675__775.jpg", kind: "studio", alt: "Makeup Pouch · Cheetah, on white background" },
        { file: "images/makeup-pouch-cheetah__2.jpg", kind: "lifestyle", alt: "Makeup Pouch · Cheetah, styled lifestyle shot" },
        { file: "images/makeup-pouch-cheetah__3.jpg", kind: "infographic", alt: "Makeup Pouch · Cheetah, details and 360 views" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 10,
      name: "Makeup Pouch · Meadow Gingham",
      slug: "makeup-pouch-green-gingham-floral",
      category: "Makeup Pouches",
      price: 675,
      mrp: 775,
      discountPercent: 13,
      currency: "INR",
      fabric: "Lime green gingham with lilac flowers, lilac zipper and lining",
      tags: ["Pinteresty", "gingham", "floral", "makeup", "travel"],
      shortDescription: "Lime gingham with lilac flowers and a lilac lining.",
      description: "A cheerful makeup pouch in lime-green gingham scattered with lilac flowers, finished with a lilac zipper and lining. Made for your daily essentials.",
      highlights: [
        "Lilac zipper and lining",
        "Made for daily essentials",
        "Easy to carry",
        "Handmade in Coimbatore"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/makeup-pouch-green-gingham-floral__675__775.jpg", kind: "studio", alt: "Makeup Pouch · Meadow Gingham, on white background" },
        { file: "images/makeup-pouch-green-gingham-floral__2.jpg", kind: "lifestyle", alt: "Makeup Pouch · Meadow Gingham, styled lifestyle shot" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 11,
      name: "Makeup Pouch · Polka Ruffle",
      slug: "makeup-pouch-polka-ruffle",
      category: "Makeup Pouches",
      price: 795,
      mrp: 895,
      discountPercent: 11,
      currency: "INR",
      fabric: "Black and white polka dots, ruffled top",
      tags: ["Pinteresty", "polka", "ruffle", "makeup"],
      shortDescription: "Polka-dot makeup pouch with a ruffled top and a soft puffy shape.",
      description: "The Polka Dot pouch: crisp black dots on white with a ruffled, scrunchy top that opens into a roomy cosmetic organiser. Pretty, puffy and perfectly practical.",
      highlights: [
        "Ruffled, puffy shape",
        "Roomy cosmetic storage",
        "Travel organiser",
        "Handcrafted"
      ],
      details: { made: "Handcrafted in Coimbatore" },
      images: [
        { file: "images/makeup-pouch-polka-ruffle__795__895.jpg", kind: "studio", alt: "Makeup Pouch · Polka Ruffle, on white background" },
        { file: "images/makeup-pouch-polka-ruffle__2.jpg", kind: "lifestyle", alt: "Makeup Pouch · Polka Ruffle, styled lifestyle shot" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    },
    {
      id: 12,
      name: "Makeup Pouch · Cherry Cream",
      slug: "makeup-pouch-cherry-cream-ruffle",
      category: "Makeup Pouches",
      price: 795,
      mrp: 995,
      discountPercent: 20,
      currency: "INR",
      fabric: "Cream quilted cotton with cherry print, ruffle detail, red interior, YKK zipper",
      tags: ["Pinteresty", "cherry", "ruffle", "makeup", "cotton"],
      shortDescription: "Cream quilted cotton with cherries, ruffles and a red lining.",
      description: "A handcrafted cotton makeup pouch in cream quilting printed with juicy red cherries, with ruffle detailing, a red interior and a YKK zipper. Made for your daily essentials.",
      highlights: [
        "Cotton fabric, quilted",
        "Ruffle detailing",
        "YKK zipper",
        "Handcrafted, red lining"
      ],
      details: { made: "Handcrafted in Coimbatore", closure: "YKK zipper" },
      images: [
        { file: "images/makeup-pouch-cherry-cream-ruffle__795__995.jpg", kind: "studio", alt: "Makeup Pouch · Cherry Cream, on white background" },
        { file: "images/makeup-pouch-cherry-cream-ruffle__2.jpg", kind: "lifestyle", alt: "Makeup Pouch · Cherry Cream, styled lifestyle shot" }
      ],
      amazonTitle: "", amazonUrl: "", dimensions: ""
    }
  ]
};

export default productsData;
