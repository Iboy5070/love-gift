# Love gift (heart QR)

Mobile website you send as a heart QR on WhatsApp. WhatsApp is only the envelope. The QR opens this site.

## Customize

Edit `config.js`:

- `herName`, `myName`
- Love lines, gift notes, timeline captions
- `youtubeUrl` or `audioSrc` (only a track you have the right to use)
- Replace images in `photos/` (`us.jpg`, `m1.png` through `m5.png`)

## Run locally

```bash
python3 -m http.server 8080
```

Open http://127.0.0.1:8080

## Heart QR

After the GitHub Pages URL is live:

```bash
python3 -m pip install -r requirements.txt
python3 scripts/make_heart_qr.py --url "https://YOURUSER.github.io/love-gift/"
```

- `qr/qr-heart.png` — heart shape (pretty; some cameras fail)
- `qr/qr-square.png` — backup, scans reliably

## WhatsApp send

1. Short line to her
2. Send `qr/qr-heart.png`
3. Tell her to open it when she is alone

If the heart will not scan, send `qr/qr-square.png`.
