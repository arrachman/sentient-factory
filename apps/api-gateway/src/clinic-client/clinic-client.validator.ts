import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientValidator {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validasi serviceIds yang dikirim user:
   * - dedup,
   * - pastikan semua existing & belum di-soft-delete (deletedAt null),
   * - minimal 1 (DTO sudah enforce, ini defense in depth).
   * Return ids ter-dedup urut asc.
   */
  async validateServiceIds(ids: number[]): Promise<number[]> {
    const unique = Array.from(new Set(ids)).sort((a, b) => a - b);
    if (unique.length === 0) {
      throw new ConflictException('Minimal 1 layanan harus dipilih.');
    }
    const found = await this.prisma.clinicService.findMany({
      where: { id: { in: unique }, deletedAt: null },
      select: { id: true },
    });
    if (found.length !== unique.length) {
      const foundSet = new Set(found.map((s) => s.id));
      const missing = unique.filter((id) => !foundSet.has(id));
      throw new ConflictException(
        `Layanan tidak ditemukan / sudah dihapus: ${missing.join(', ')}`,
      );
    }
    return unique;
  }

  /**
   * Resolve nama service "utama" untuk diisi ke kolom legacy
   * `clinic_client.preferred_service_type`. Ambil service pertama urut by id asc
   * supaya stabil (deterministik) dan tidak depend ke urutan kirim user.
   */
  async resolvePrimaryServiceName(ids: number[]): Promise<string | null> {
    if (ids.length === 0) return null;
    const first = await this.prisma.clinicService.findUnique({
      where: { id: ids[0] },
      select: { name: true },
    });
    return first?.name ?? null;
  }
}
