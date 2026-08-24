#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = ROOT / "photos"
PHOTOS.mkdir(exist_ok=True)

PALETTES = [
    ((255, 214, 224), (255, 122, 146), "m1"),
    ((210, 236, 210), (90, 160, 110), "m2"),
    ((210, 220, 255), (90, 110, 190), "m3"),
    ((255, 236, 200), (230, 150, 80), "m4"),
    ((255, 210, 230), (196, 61, 92), "m5"),
]


def gradient(size, c1, c2):
    img = Image.new("RGB", size)
    px = img.load()
    w, h = size
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img


def heart(draw, cx, cy, s, fill):
    draw.ellipse((cx - s, cy - s * 0.7, cx, cy + s * 0.3), fill=fill)
    draw.ellipse((cx, cy - s * 0.7, cx + s, cy + s * 0.3), fill=fill)
    draw.polygon([(cx - s, cy), (cx + s, cy), (cx, cy + s * 1.15)], fill=fill)


def hills():
    img = Image.new("RGB", (720, 900), (168, 214, 255))
    d = ImageDraw.Draw(img)
    d.ellipse((80, 70, 200, 190), fill=(255, 255, 255))
    d.ellipse((160, 90, 260, 190), fill=(255, 255, 255))
    d.ellipse((420, 50, 560, 170), fill=(255, 255, 255))
    d.polygon([(0, 900), (0, 560), (220, 420), (420, 580), (720, 460), (720, 900)], fill=(96, 168, 108))
    d.polygon([(0, 900), (80, 640), (300, 720), (520, 600), (720, 700), (720, 900)], fill=(70, 140, 88))
    heart(d, 360, 300, 46, (232, 90, 122))
    return img


def main():
    us = hills()
    us.save(PHOTOS / "us.jpg", quality=90)
    for c1, c2, name in PALETTES:
        img = gradient((640, 640), c1, c2)
        d = ImageDraw.Draw(img)
        heart(d, 320, 300, 90, (255, 255, 255))
        heart(d, 320, 300, 70, c2)
        img.save(PHOTOS / f"{name}.png")
    print("wrote", list(PHOTOS.iterdir()))


if __name__ == "__main__":
    main()
