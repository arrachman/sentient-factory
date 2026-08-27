import type { Entity } from './types';
import { FIELD_PERAN, daftarkanPeran } from './peran-orang';

const text = (name: string, label: string, required = true) => ({ name, label, type: 'text' as const, required });
const number = (name: string, label: string, required = false) => ({ name, label, type: 'number' as const, required, step: 1 });
const date = (name: string, label: string, required = true) => ({ name, label, type: 'date' as const, required });
const columns = (...items: Array<[string, string]>) => items.map(([name, label]) => ({ name, label }));

export const ENTITIES: Entity[] = [
  {
    key: 'orang',
    menu: 'induk',
    model: 'orang',
    label: 'Identitas orang',
    // Satu identitas dipakai ulang oleh modul lain; jelaskan agar operator tidak
    // membuat baris ganda untuk orang yang sama.
    deskripsi: 'Data dasar satu orang, dipakai ulang oleh modul Santri, Kepegawaian, Wali, dan akun login. Buat satu baris per orang — jangan digandakan per peran.',
    idType: 'bigint',
    fields: [
      { ...text('nama', 'Nama lengkap'), group: 'Identitas', span: 2, hint: 'Sesuai dokumen resmi, tanpa gelar.', placeholder: 'Windu Winarti' },
      { name: 'jk', label: 'Jenis kelamin', type: 'select', options: ['L', 'P'], optionLabels: { L: 'Laki-laki', P: 'Perempuan' }, optionIcons: { L: 'lelaki', P: 'perempuan' }, required: true, group: 'Identitas' },
      { ...text('nik', 'NIK', false), group: 'Identitas', hint: '16 digit KTP/KK. Harus unik — kosongkan bila belum punya.', placeholder: '3573xxxxxxxxxxxx' },
      { ...text('hp', 'No. HP', false), group: 'Kontak', hint: 'Nomor WhatsApp aktif; dipakai modul notifikasi.', placeholder: '081234567890' },
      { ...text('email', 'Email', false), group: 'Kontak', hint: 'Harus unik. Dipakai sebagai identitas login bila orang ini diberi akun.', placeholder: 'nama@contoh.com' },
      { name: 'alamat', label: 'Jalan / dusun & no. rumah', type: 'textarea', group: 'Alamat', span: 3, placeholder: 'Jl. Mergosono Gg. 4 No. 17' },
      { ...text('rt', 'RT', false), group: 'Alamat', placeholder: '03' },
      { ...text('rw', 'RW', false), group: 'Alamat', placeholder: '05' },
      { ...text('kelurahan', 'Kelurahan / desa', false), group: 'Alamat', placeholder: 'Mergosono' },
      { ...text('kecamatan', 'Kecamatan', false), group: 'Alamat', placeholder: 'Kedungkandang' },
      { ...text('kabupaten', 'Kota / kabupaten', false), group: 'Alamat', placeholder: 'Kota Malang' },
      { name: 'aktif', label: 'Status keaktifan', type: 'boolean', labelYa: 'Aktif', group: 'Status', span: 3, hint: 'Nonaktifkan alih-alih menghapus bila orang ini sudah tidak berkegiatan — riwayat di modul lain tetap utuh.' },
      ...FIELD_PERAN,
    ],
    columns: columns(['nama', 'Nama'], ['jk', 'JK'], ['hp', 'HP'], ['email', 'Email'], ['aktif', 'Aktif']),
    orderBy: { nama: 'asc' },
    sesudahBuat: daftarkanPeran,
  },
  { key: 'santri', menu: 'induk', model: 'santri', label: 'Santri', idType: 'bigint', fields: [number('orangId', 'ID Orang (buat dulu di menu Identitas Orang)', true), text('nis', 'NIS', false), text('nisn', 'NISN', false), { ...number('unitId', 'Unit'), ref: { model: 'unit', label: 'nama', orderBy: { nama: 'asc' } } }, { ...number('kelasId', 'Kelas'), ref: { model: 'kelas', label: 'nama', orderBy: { nama: 'asc' } } }, { ...number('kamarId', 'Kamar'), ref: { model: 'kamar', label: 'kode', orderBy: { kode: 'asc' } } }, { name: 'status', label: 'Status', type: 'select', options: ['Mukim', 'Kalong', 'Alumni', 'Keluar'], required: true }, text('program', 'Program', false), text('tahunMasuk', 'Tahun masuk', false)], columns: columns(['orangId', 'ID Orang'], ['nis', 'NIS'], ['nisn', 'NISN'], ['status', 'Status'], ['tahunMasuk', 'Tahun masuk']), orderBy: { createdAt: 'desc' } },
  { key: 'unit', menu: 'pengaturan', model: 'unit', label: 'Unit pendidikan', idType: 'int', fields: [text('key', 'Kode'), text('nama', 'Nama'), text('deskripsi', 'Deskripsi', false), { name: 'aktif', label: 'Aktif', type: 'boolean' }], columns: columns(['key', 'Kode'], ['nama', 'Nama'], ['deskripsi', 'Deskripsi'], ['aktif', 'Aktif']), orderBy: { nama: 'asc' } },
  { key: 'asrama', menu: 'pesantren', model: 'asrama', label: 'Asrama', idType: 'int', fields: [text('nama', 'Nama'), { name: 'jk', label: 'Jenis kelamin', type: 'select', options: ['L', 'P'], required: true }, number('kapasitas', 'Kapasitas'), text('musyrif', 'Musyrif', false)], columns: columns(['nama', 'Nama'], ['jk', 'JK'], ['kapasitas', 'Kapasitas'], ['musyrif', 'Musyrif']), orderBy: { nama: 'asc' } },
  { key: 'halaqah', menu: 'pesantren', model: 'halaqah', label: 'Halaqah', idType: 'int', fields: [text('nama', 'Nama'), text('ustadz', 'Ustadz'), text('waktu', 'Waktu'), text('tempat', 'Tempat'), text('jenjang', 'Jenjang'), number('anggota', 'Anggota')], columns: columns(['nama', 'Nama'], ['ustadz', 'Ustadz'], ['waktu', 'Waktu'], ['tempat', 'Tempat'], ['anggota', 'Anggota']), orderBy: { nama: 'asc' } },
  { key: 'kegiatan', menu: 'pesantren', model: 'kegiatanHarian', label: 'Kegiatan harian', idType: 'int', fields: [text('jam', 'Jam'), text('nama', 'Nama'), text('ket', 'Keterangan', false), number('urutan', 'Urutan')], columns: columns(['jam', 'Jam'], ['nama', 'Nama'], ['ket', 'Keterangan'], ['urutan', 'Urutan']), orderBy: { urutan: 'asc' } },
  { key: 'mapel', menu: 'akademik', model: 'mataPelajaran', label: 'Mata pelajaran', idType: 'int', fields: [text('kode', 'Kode'), text('nama', 'Nama'), number('jp', 'Jam pelajaran'), text('kelompok', 'Kelompok'), text('guru', 'Guru', false), number('kkm', 'KKM'), text('kurikulum', 'Kurikulum', false)], columns: columns(['kode', 'Kode'], ['nama', 'Nama'], ['kelompok', 'Kelompok'], ['guru', 'Guru'], ['kkm', 'KKM']), orderBy: { nama: 'asc' } },
  { key: 'perangkat', menu: 'kurikulum', model: 'perangkatAjar', label: 'Perangkat ajar', idType: 'int', fields: [text('kode', 'Kode'), text('mapel', 'Mapel'), text('kelas', 'Kelas'), text('jenis', 'Jenis'), text('topik', 'Topik'), number('pertemuan', 'Pertemuan'), text('guru', 'Guru'), text('status', 'Status')], columns: columns(['kode', 'Kode'], ['mapel', 'Mapel'], ['kelas', 'Kelas'], ['jenis', 'Jenis'], ['status', 'Status']), orderBy: { kode: 'asc' } },
  { key: 'bank-soal', menu: 'kurikulum', model: 'bankSoal', label: 'Bank soal', idType: 'int', fields: [text('kode', 'Kode'), text('mapel', 'Mapel'), text('topik', 'Topik'), text('tipe', 'Tipe'), text('level', 'Level'), number('butir', 'Butir'), number('dipakai', 'Dipakai'), text('penulis', 'Penulis')], columns: columns(['kode', 'Kode'], ['mapel', 'Mapel'], ['topik', 'Topik'], ['tipe', 'Tipe'], ['butir', 'Butir']), orderBy: { kode: 'asc' } },
  { key: 'obat', menu: 'poskestren', model: 'obat', label: 'Obat', idType: 'int', fields: [text('nama', 'Nama'), text('satuan', 'Satuan'), text('kategori', 'Kategori', false), number('stok', 'Stok'), number('stokMin', 'Stok minimum'), text('kadaluarsa', 'Kadaluarsa', false)], columns: columns(['nama', 'Nama'], ['satuan', 'Satuan'], ['kategori', 'Kategori'], ['stok', 'Stok'], ['stokMin', 'Min. stok']), orderBy: { nama: 'asc' } },
  { key: 'kas', menu: 'keuangan', model: 'transaksiKas', label: 'Transaksi kas', idType: 'bigint', fields: [text('kode', 'Kode'), date('tgl', 'Tanggal'), text('uraian', 'Uraian'), text('kategori', 'Kategori'), text('metode', 'Metode'), { name: 'arah', label: 'Arah', type: 'select', options: ['Masuk', 'Keluar'], required: true }, number('nominal', 'Nominal', true)], columns: columns(['kode', 'Kode'], ['tgl', 'Tanggal'], ['uraian', 'Uraian'], ['arah', 'Arah'], ['nominal', 'Nominal']), orderBy: { tgl: 'desc' } },
  { key: 'pendaftar', menu: 'ppdb', model: 'pendaftar', label: 'Pendaftar PPDB', idType: 'bigint', fields: [text('noReg', 'No. registrasi'), text('nama', 'Nama'), text('pilihan', 'Pilihan'), text('asalSekolah', 'Asal sekolah', false), text('hpWali', 'HP wali', false), date('tglDaftar', 'Tanggal daftar'), number('nilai', 'Nilai', false), { name: 'status', label: 'Status', type: 'select', options: ['Baru', 'Verifikasi', 'Seleksi', 'Lulus', 'TidakLulus', 'DaftarUlang'], required: true }], columns: columns(['noReg', 'No. Reg'], ['nama', 'Nama'], ['pilihan', 'Pilihan'], ['asalSekolah', 'Asal sekolah'], ['status', 'Status']), orderBy: { createdAt: 'desc' } },
  { key: 'template-wa', menu: 'wa', model: 'templateWa', label: 'Template WhatsApp', idType: 'int', fields: [text('kode', 'Kode'), text('role', 'Penerima'), text('judul', 'Judul'), text('pemicu', 'Pemicu'), text('waktu', 'Waktu', false), { name: 'isi', label: 'Isi pesan', type: 'textarea', required: true }, { name: 'aktif', label: 'Aktif', type: 'boolean' }], columns: columns(['kode', 'Kode'], ['role', 'Penerima'], ['judul', 'Judul'], ['pemicu', 'Pemicu'], ['aktif', 'Aktif']), orderBy: { kode: 'asc' } },
  { key: 'pengumuman', menu: 'dashboard', model: 'pengumuman', label: 'Pengumuman', idType: 'bigint', fields: [date('tgl', 'Tanggal'), text('judul', 'Judul'), { name: 'isi', label: 'Isi', type: 'textarea', required: true }, text('target', 'Target')], columns: columns(['tgl', 'Tanggal'], ['judul', 'Judul'], ['target', 'Target']), orderBy: { tgl: 'desc' } },
  { key: 'agenda', menu: 'dashboard', model: 'agenda', label: 'Agenda', idType: 'bigint', fields: [date('tgl', 'Tanggal'), text('jam', 'Jam', false), text('judul', 'Judul'), text('unit', 'Unit', false)], columns: columns(['tgl', 'Tanggal'], ['jam', 'Jam'], ['judul', 'Judul'], ['unit', 'Unit']), orderBy: { tgl: 'desc' } },
  { key: 'pegawai', menu: 'kepegawaian', model: 'pegawai', label: 'Kepegawaian', idType: 'bigint', fields: [number('orangId', 'ID Orang (buat dulu di menu Identitas Orang)', true), text('nip', 'NIP'), { ...number('unitId', 'Unit', false), ref: { model: 'unit', label: 'nama', orderBy: { nama: 'asc' } } }, text('jabatan', 'Jabatan'), text('status', 'Status'), text('rekening', 'Rekening', false), text('pendidikanTerakhir', 'Pendidikan terakhir', false), text('mapelDiampu', 'Mapel diampu', false), text('tugasTambahan', 'Tugas tambahan', false), number('jamMengajar', 'Jam mengajar', false), text('tmpTglLahir', 'Tempat/tgl lahir', false)], columns: columns(['nip', 'NIP'], ['jabatan', 'Jabatan'], ['status', 'Status'], ['mapelDiampu', 'Mapel diampu'], ['jamMengajar', 'Jam mengajar']), orderBy: { nip: 'asc' } },
  { key: 'tahun-ajaran', menu: 'pengaturan', model: 'tahunAjaran', label: 'Tahun pelajaran', idType: 'int', fields: [text('kode', 'Kode (mis. 2026/2027)'), text('semester', 'Semester (Gasal/Genap)'), { name: 'aktif', label: 'Aktif', type: 'boolean' }], columns: columns(['kode', 'Kode'], ['semester', 'Semester'], ['aktif', 'Aktif']), orderBy: { kode: 'desc' } },
  { key: 'kelas', menu: 'kurikulum', model: 'kelas', label: 'Kelas', idType: 'int', fields: [{ ...number('unitId', 'Unit', true), ref: { model: 'unit', label: 'nama', orderBy: { nama: 'asc' } } }, text('nama', 'Nama kelas'), text('tingkat', 'Tingkat'), number('waliKelasId', 'ID Pegawai wali kelas', false), number('tahunAjaranId', 'ID Tahun pelajaran', false)], columns: columns(['nama', 'Nama'], ['tingkat', 'Tingkat'], ['unitId', 'ID Unit'], ['waliKelasId', 'ID Wali kelas'], ['tahunAjaranId', 'ID Tahun pelajaran']), orderBy: { nama: 'asc' } },
];

export const getEntity = (key: string) => ENTITIES.find((entity) => entity.key === key);
