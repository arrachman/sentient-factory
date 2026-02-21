# Rendered ERD Output

Folder ini untuk hasil render `.mmd` menjadi `.svg` dan `.png`.

## Cara generate
```bash
cd /home/rania/apps/sentient-factory/apps/myerpplus-db-mapping
./scripts/render_erd.sh
```

## Jika error Chromium libraries
Pada host Linux minimal install:
- `libatk1.0-0`
- `libgtk-3-0`
- `libnss3`
- `libxss1`
- `libasound2`
- `libgbm1`

Contoh Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y libatk1.0-0 libgtk-3-0 libnss3 libxss1 libasound2 libgbm1
```
