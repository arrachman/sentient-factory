---
sidebar_position: 1
---

# Sentient Factory Documentation

Selamat datang di dokumentasi resmi **Sentient Factory** - platform manufaktur cerdas berbasis AI dengan arsitektur microservices modern.

## Apa itu Sentient Factory?

Sentient Factory adalah platform manufaktur cerdas yang memungkinkan smart factory dengan:

- **Monitoring real-time** jalur produksi
- **Predictive maintenance** menggunakan machine learning
- **Quality control otomatis** dengan computer vision
- **Optimisasi supply chain** melalui algoritma AI

## Arsitektur Modern

Sentient Factory dibangun dengan:

- **Monorepo** menggunakan pnpm workspaces dan TurboRepo
- **Frontend**: Next.js 14 + React + TypeScript dengan Metronic UI
- **Backend**: Fastify (Node.js) + TypeScript untuk API Gateway
- **AI Engine**: Node.js + LangChain untuk pemrosesan AI
- **Database**: PostgreSQL dengan koneksi khusus
- **Infrastructure**: Docker Compose untuk development, Kubernetes untuk production

## Quick Start

### Prerequisites

- Node.js 20.0 atau lebih tinggi
- pnpm 8+ (`npm install -g pnpm`)
- Docker & Docker Compose (untuk service dependencies)
- PostgreSQL 14+ (atau gunakan Docker)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd sentient-factory

# Install dependencies menggunakan pnpm
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Start service dependencies (PostgreSQL, Redis, dll)
pnpm docker:up

# Start semua aplikasi development
pnpm dev
```

### First Steps

1. **Konfigurasi environment** - Update `.env` dengan credentials database:

   ```
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=PasswordSuperRahasia123!
   DB_NAME=myerpplus
   ```

2. **Jalankan migrations** - Setup database schema:

   ```bash
   pnpm db:migrate
   ```

3. **Start services** - Launch platform:

   ```bash
   pnpm dev
   ```

4. **Akses dashboard** - Buka http://localhost:3101

### Port Configuration

| Application   | Port | URL                   |
| ------------- | ---- | --------------------- |
| Web Dashboard | 3101 | http://localhost:3101 |
| Landing Page  | 3102 | http://localhost:3102 |
| API Gateway   | 3103 | http://localhost:3103 |
| AI Engine     | 3104 | http://localhost:3104 |
| Documentation | 3105 | http://localhost:3105 |

## Getting Help

- **Dokumentasi**: Jelajahi sidebar untuk panduan detail
- **Community**: Bergabung dengan [Discord server](https://discord.gg/sentient-factory)
- **Issues**: Laporkan bugs di [GitHub Issues](https://github.com/sentient-factory/sentient-factory/issues)
- **Contributing**: Lihat [Contributing Guide](/docs/contributing)
