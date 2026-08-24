#!/usr/bin/env python3
"""Make a pink heart-shaped QR and a square backup QR."""
from __future__ import annotations

import argparse
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw
from qrcode.constants import ERROR_CORRECT_H

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "qr"


def heart_mask(size: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    s = size * 0.30
    cx, cy = size / 2, size * 0.38
    d.ellipse((cx - s * 1.2, cy - s, cx + 2, cy + s * 0.45), fill=255)
    d.ellipse((cx - 2, cy - s, cx + s * 1.2, cy + s * 0.45), fill=255)
    d.polygon(
        [(cx - s * 1.18, cy + s * 0.05), (cx + s * 1.18, cy + s * 0.05), (cx, cy + s * 2.15)],
        fill=255,
    )
    return mask


def make_qr_img(url: str, box: int = 12) -> Image.Image:
    qr = qrcode.QRCode(
        error_correction=ERROR_CORRECT_H,
        box_size=box,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill_color=(196, 61, 92), back_color=(255, 255, 255)).convert("RGB")


def make_square(url: str, dest: Path) -> None:
    img = make_qr_img(url, box=14)
    pad = Image.new("RGB", (img.width + 48, img.height + 48), (255, 247, 244))
    pad.paste(img, (24, 24))
    pad.save(dest)
    print("wrote", dest)


def make_heart(url: str, dest: Path) -> None:
    qr = make_qr_img(url, box=10)
    canvas = 900
    bg = Image.new("RGB", (canvas, canvas), (255, 247, 244))
    mask = heart_mask(canvas)
    heart_fill = Image.new("RGB", (canvas, canvas), (255, 230, 236))
    bg.paste(heart_fill, mask=mask)

    inner = 620
    qr_fit = qr.resize((inner, inner), Image.Resampling.NEAREST)
    ox = (canvas - inner) // 2
    oy = (canvas - inner) // 2 + 20
    crop = Image.new("RGB", (canvas, canvas), (255, 247, 244))
    crop.paste(qr_fit, (ox, oy))
    bg.paste(crop, mask=mask)

    bg.save(dest)
    print("wrote", dest)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    args = parser.parse_args()
    OUT.mkdir(exist_ok=True)
    make_square(args.url, OUT / "qr-square.png")
    make_heart(args.url, OUT / "qr-heart.png")


if __name__ == "__main__":
    main()
