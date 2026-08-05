---
name: proxy
description: >
  Skill untuk mem-provision host publik lewat Nginx Proxy Manager
  (192.168.1.150:81) — membuat DNS record di Cloudflare, menerbitkan sertifikat
  Let's Encrypt via DNS-01, dan membuat proxy host yang meneruskan ke upstream
  lokal. Aktifkan setiap kali user minta "expose app ke domain", "buat subdomain",
  "tambah proxy host", "pasang SSL", atau menyebut Nginx Proxy Manager/NPM.
trigger: >
  Aktif saat user menyebut "nginx proxy manager", "NPM", "proxy host",
  "192.168.1.150:81", "buat subdomain", "expose ke domain", "pasang sertifikat",
  "Let's Encrypt", "Cloudflare DNS", atau minta sebuah app di port lokal
  diakses lewat URL publik.
---

Skill ini mengotomatiskan tiga langkah yang selama ini dikerjakan manual di UI
Nginx Proxy Manager: **DNS record → sertifikat → proxy host**.

Berlaku di atas root `CLAUDE.md`. Perhatikan §4.1 (UFW) — port upstream harus
sudah dibuka sebelum host bisa diakses dari luar.

## 1. Parameter

Skill menerima tiga parameter inti:

| Parameter  | Wajib | Contoh                | Keterangan |
| ---------- | ----- | --------------------- | ---------- |
| `--domain` | ya    | `hr.fr-labs.my.id`    | FQDN publik yang akan dibuat |
| `--port`   | ya    | `3209`                | Port upstream lokal |
| `--host`   | tidak | `192.168.1.150`       | Host upstream; default `192.168.1.150` |

Opsional: `--scheme` (default `http`), `--dns-type` (default `A`),
`--dns-content` (default: IP publik hasil deteksi otomatis), `--proxied`
(aktifkan orange-cloud Cloudflare), `--no-dns` (lewati langkah DNS bila record
sudah ada), `--propagation` (detik tunggu DNS-01, default `30`).

## 2. Kredensial — Vault, bukan file plain

Rahasia **tidak pernah** ditulis ke repo. Sebelum menjalankan skill:

```bash
npm run vault:render:proxy          # render ke .env.proxy (gitignored)
set -a && . .env.proxy && set +a    # export ke shell
```

Secret yang harus ada di path Vault `sentient-factory/dev/proxy`:

| Key                    | Isi |
| ---------------------- | --- |
| `NPM_BASE_URL`         | `http://192.168.1.150:81` |
| `NPM_IDENTITY`         | email admin NPM |
| `NPM_SECRET`           | password admin NPM |
| `CLOUDFLARE_API_TOKEN` | token dengan scope `Zone:Read` + `DNS:Edit` pada zone terkait |
| `LETSENCRYPT_EMAIL`    | email pendaftaran Let's Encrypt |

Token Cloudflare dipakai dua kali: membuat DNS record, dan menyelesaikan
DNS-01 challenge saat penerbitan sertifikat. Beri scope seminimal mungkin —
`DNS:Edit` pada zone yang dipakai saja, bukan `All zones`.

## 3. Menjalankan

```bash
# kasus umum: subdomain baru ke app lokal
scripts/proxy-provision.sh --domain hr.fr-labs.my.id --port 3209

# upstream di host lain
scripts/proxy-provision.sh --domain app.senti.id --host 192.168.1.42 --port 8080

# DNS sudah ada, cukup cert + proxy host
scripts/proxy-provision.sh --domain x.fr-labs.my.id --port 3101 --no-dns
```

Script **idempoten**: DNS record, sertifikat, dan proxy host yang sudah ada akan
di-update, bukan diduplikasi. Menjalankan ulang perintah yang sama aman.

**SSL wajib untuk setiap domain.** Provisioning tidak dianggap selesai hanya karena
proxy host berstatus Online. Domain harus memakai sertifikat yang mencakup FQDN
tersebut, `ssl_forced` dan HTTP/2 harus aktif, serta verifikasi HTTPS harus lolos
tanpa `-k` (`ssl_verify_result = 0`). Jangan tinggalkan host dalam kondisi
**HTTP Only**.

## 4. Yang dilakukan skill, berurutan

1. **Login NPM** — `POST /api/tokens` menukar identity/secret jadi bearer token.
2. **DNS Cloudflare** — cari zone yang cocok sebagai suffix domain, lalu
   `POST`/`PUT /zones/{id}/dns_records`. Default `proxied: false` (DNS only),
   supaya Let's Encrypt dan NPM bicara langsung ke origin.
3. **Sertifikat wajib** — cari sertifikat yang benar-benar mencakup FQDN target.
   Jika belum ada, `POST /api/nginx/certificates` menggunakan DNS-01 Cloudflare
   dengan metadata yang didukung NPM aktif: `dns_challenge`, `dns_provider`,
   `dns_provider_credentials`, dan `propagation_seconds`. DNS-01 tidak menuntut
   port 80 publik dan mendukung wildcard.
4. **Proxy host HTTPS** — `POST`/`PUT /api/nginx/proxy-hosts` dengan sertifikat
   tersebut, `ssl_forced`, `http2_support`, `block_exploits`, dan
   `allow_websocket_upgrade` menyala. WebSocket penting untuk app Next.js dan
   dev server. Host **HTTP Only tidak boleh dianggap selesai**.
5. **Verifikasi wajib** — `curl` tanpa `-k` ke `https://<domain>/`; pastikan
   respons reachable dan `ssl_verify_result = 0`. Provisioning harus gagal
   (exit non-zero) bila HTTPS atau validasi sertifikat gagal.

## 5. Setelah provisioning

- **Buka port di UFW** bila upstream perlu dijangkau dari LAN — lihat root
  `CLAUDE.md` §4.1. Tanpa ini `ping` jalan tapi `curl` timeout.
- **Status `000` pada verifikasi** berarti belum reachable: cek propagasi DNS
  (`dig +short <domain>`), UFW, dan apakah service di port upstream benar-benar
  hidup (`npm run ports:active`).
- **Sertifikat gagal terbit**: buka Audit Log di NPM. Penyebab tersering adalah
  scope token Cloudflare kurang, atau `propagation_seconds` terlalu pendek —
  naikkan dengan `--propagation 60`.

## 6. Batasan yang disengaja

- Skill ini **tidak menghapus** DNS record, sertifikat, atau proxy host. Operasi
  destruktif dikerjakan manual lewat UI supaya tidak ada penghapusan tak sengaja
  atas host produksi.
- Skill tidak menyentuh `config/ports.json`. Alokasi port tetap lewat
  `npm run ports:*` sesuai root `CLAUDE.md` §2.
- Wildcard (`*.domain`) didukung oleh DNS-01, tetapi perlu dijalankan manual
  dengan `--domain '*.fr-labs.my.id'` dan dipertimbangkan baik-baik: satu
  sertifikat wildcard yang bocor berdampak ke seluruh subdomain.
