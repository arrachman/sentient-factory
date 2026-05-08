# ADR 004: WhatsApp Provider — Fonnte (Indonesian Gateway)

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

PRD mensyaratkan integrasi WA dengan:
- 18 templates × 4 categories (pengingat, jadwal, onboarding, bayar)
- 4 status delivery: terkirim, sampai, dibaca, gagal
- Retry: 3× max, 5-min interval
- Trigger events: confirmation, H-1, 30-min reminder, follow-up, reschedule, cancel, welcome, OTP

User memilih **Fonnte** (https://fonnte.com) sebagai provider.

## Decision

Pakai **Fonnte** untuk send WA:
- API base: `https://api.fonnte.com/`
- Auth: Token-based (header `Authorization: <TOKEN>`)
- Endpoint utama: `POST /send` dengan body form-data
- Webhook untuk delivery status (configurable di dashboard Fonnte)

### Architecture

```
api-gateway/src/clinic-wa/
├── wa.interface.ts           # WAProvider abstraction
├── providers/
│   ├── fonnte.provider.ts    # Fonnte implementation (Slice 8)
│   └── mock.provider.ts      # MockWAProvider (Slice 0, testing)
├── wa.service.ts             # Domain service (template render + dispatch)
├── wa.controller.ts          # Webhook receiver dari Fonnte
├── wa.module.ts
└── dto/
    ├── send-message.dto.ts
    └── webhook-payload.dto.ts
```

### Config
Env vars di api-gateway:
- `FONNTE_API_TOKEN` — token dari dashboard Fonnte (per-device)
- `FONNTE_DEVICE_ID` — kalau multi-device (optional)
- `FONNTE_WEBHOOK_SECRET` — untuk validate webhook signature
- `FONNTE_API_URL` — default `https://api.fonnte.com`

Di `clinic_settings`:
- `wa_default_country_code` — default `+62`
- `wa_send_enabled` — global toggle untuk dev/staging

### Retry strategy
1. Fire-and-forget queue (Bull + Redis di api-gateway)
2. Worker consume job → call `FonnteProvider.send()`
3. Error (4xx/5xx atau timeout): re-enqueue dengan delay 5 min, max 3 retry
4. After 3 fail: status `gagal`, log error reason ke `clinic_wa_log`
5. Webhook callback Fonnte update status: `terkirim` → `sampai` → `dibaca`

### Template management
Fonnte tidak butuh approval template (bukan Meta Business API). Template stored di `clinic_wa_template`:
- `body` pakai Mustache-style: `Hai {{nama}}, sesi kamu {{tanggal}}...`
- Render variables di app side, send rendered text ke Fonnte
- Admin self-service edit template

## Consequences

### Positive
- Setup cepat (signup → token → kirim)
- Pricing transparan (~Rp 50-200/msg, cek dashboard saat onboard)
- No template approval flow
- Indonesian phone friendly (+62 native)
- Webhook reliable

### Negative
- Risk blokir: pakai nomor WA biasa (volume tinggi/spam → blokir)
- Vendor lock: spec spesifik Fonnte (mitigated via interface)
- Less reliable than Meta Business API (acceptable untuk volume <300/hari)

### Mitigation
- Pakai nomor dedicated khusus Althea
- Greeting natural per template (not spammy)
- Rate limit 1 msg/sec per number
- Opt-out mechanism: `wa_opted_out` flag di `clinic_client`
- Monitor `wa_log.gagal` rate, alert kalau > 5%

## Implementation timeline

- **Slice 0**: bikin `WAProvider` interface + `MockProvider`, register di module
- **Slice 8**: implement `FonnteProvider` + retry queue (Bull) + webhook receiver
- **Slice 9**: hook ke booking lifecycle (auto-trigger pada event)

## Open implementation details (resolve di Slice 8)

- Pricing aktual per pesan (cek dashboard Fonnte saat onboard)
- Beli paket bulanan atau pay-per-msg
- Sandbox vs production token
- Webhook URL prod: `https://althea.<domain>/api/clinic/wa/webhook`

## Reference

- Fonnte docs: https://docs.fonnte.com/
- `apps/psychology-design/AdminNotifWA.jsx` — UI mockup template management
- `apps/psychology-design/JAWABAN-PERTANYAAN-KLIEN-2026-05-07.md`
