"""
Regenerates the sticker-style cut-outs in public/cutouts/ from each product's studio photo.

  pip install rembg onnxruntime pillow numpy scipy
  python scripts/make_cutouts.py

Then add the new product's ground colour and cut-out ratio to src/data/visuals.ts.
"""
import json, os
import numpy as np
from PIL import Image
from rembg import remove, new_session
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public')
session = new_session('isnet-general-use')


def cutout(path):
    im = Image.open(path).convert('RGB')
    cut = remove(im, session=session)
    a = np.array(cut)[:, :, 3].astype(np.float32) / 255.0
    mask = a > 0.5
    lab, n = ndi.label(mask)
    if n > 1:
        sizes = ndi.sum(mask, lab, range(1, n + 1))
        mask = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.04])
    mask = ndi.binary_fill_holes(mask)
    alpha = np.clip((ndi.gaussian_filter(mask.astype(np.float32), 1.2) - 0.3) / 0.4, 0, 1)
    arr = np.array(cut)
    arr[:, :, 3] = (alpha * 255).astype(np.uint8)
    cut = Image.fromarray(arr, 'RGBA')
    cut = cut.crop(cut.getbbox())
    sc = 1000 / max(cut.size)
    cut = cut.resize((max(1, round(cut.width * sc)), max(1, round(cut.height * sc))), Image.LANCZOS)

    pad, r = 34, 14  # white sticker outline
    canvas = Image.new('RGBA', (cut.width + pad * 2, cut.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(cut, (pad, pad), cut)
    solid = np.array(canvas)[:, :, 3] > 40
    yy, xx = np.ogrid[-r:r + 1, -r:r + 1]
    grown = ndi.binary_dilation(solid, structure=(xx * xx + yy * yy) <= r * r)
    grown = ndi.binary_closing(grown, structure=np.ones((9, 9)))
    grown = np.clip((ndi.gaussian_filter(grown.astype(np.float32), 1.0) - 0.35) / 0.3, 0, 1)
    outline = np.zeros(canvas.size[::-1] + (4,), dtype=np.uint8)
    outline[:, :, :3] = 255
    outline[:, :, 3] = (grown * 255).astype(np.uint8)
    out = Image.alpha_composite(Image.fromarray(outline, 'RGBA'), canvas)
    return out.crop(out.getbbox())


if __name__ == '__main__':
    data = json.load(open(os.path.join(ROOT, 'products.json')))
    os.makedirs(os.path.join(ROOT, 'cutouts'), exist_ok=True)
    for p in data['products']:
        out = cutout(os.path.join(ROOT, p['images'][0]['file']))
        out.save(os.path.join(ROOT, 'cutouts', p['slug'] + '.webp'), 'WEBP', quality=88, method=6)
        print(p['slug'], out.size)  # width / height goes into CUTOUT_RATIO in src/data/visuals.ts
