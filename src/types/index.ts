export type Role = 'admin' | 'guru_bk' | 'kepala_sekolah' | 'siswa'

export interface User {
  id: string
  name: string
  role: Role
  nipNis: string
  email: string
  avatar: string
  phone?: string
}

export type Major = 'MIPA' | 'IPS' | 'Bahasa'

export interface Kelas {
  id: string
  nama: string
  tingkat: 'X' | 'XI' | 'XII'
  jurusan: Major
  waliKelas: string
  jumlahSiswa: number
}

export interface Siswa {
  id: string
  nama: string
  nis: string
  kelasId: string
  jenisKelamin: 'L' | 'P'
  poinPelanggaran: number
  poinPrestasi: number
  poinAktif: number
  status: 'Aktif' | 'Pembinaan' | 'SP-1' | 'SP-2' | 'SP-3' | 'Dikeluarkan'
  avatar: string
  kontakOrtu: string
}

export type KategoriPelanggaran = 'Tata Tertib' | 'Kedisiplinan' | 'Akademik' | 'Sosial' | 'Lingkungan'
export type TingkatKeparahan = 'Ringan' | 'Sedang' | 'Berat'

export interface AturanPelanggaran {
  id: string
  nama: string
  kategori: KategoriPelanggaran
  tingkat: TingkatKeparahan
  poin: number
  deskripsi: string
}

export interface Pelanggaran {
  id: string
  siswaId: string
  siswaNama: string
  kelasNama: string
  aturanId: string
  aturanNama: string
  poin: number
  tanggal: string
  catatan: string
  dicatatOleh: string
  rekomendasi?: string
}

export type TingkatPrestasi = 'Sekolah' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional'

export interface Prestasi {
  id: string
  siswaId: string
  siswaNama: string
  kelasNama: string
  namaLomba: string
  kategori: string
  tingkat: TingkatPrestasi
  poin: number
  tanggal: string
  hasil: string
}

export type StatusKonseling = 'Terjadwal' | 'Selesai' | 'Dalam Proses' | 'Dibatalkan'
export type JenisKonseling = 'Personal' | 'Karir' | 'Akademik' | 'Sosial'

export interface SesiKonseling {
  id: string
  siswaId: string
  siswaNama: string
  kelasNama: string
  jenis: JenisKonseling
  topik: string
  tanggal: string
  waktu: string
  status: StatusKonseling
  catatan: string
  konselor: string
  privat: boolean
}

export type JenisKampus = 'Negeri' | 'Swasta'

export interface Kampus {
  id: string
  nama: string
  jenis: JenisKampus
  lokasi: string
  akreditasi: string
  deskripsi: string
  fakultas: string[]
  gelombang: { nama: string; tanggalMulai: string; tanggalSelesai: string; jalur: string }[]
  nilaiPotong: { prodi: string; nilai: string; tahun: string }[]
  logo: string
}

export interface LowonganKerja {
  id: string
  judul: string
  perusahaan: string
  jenis: 'Magang' | 'Kerja' | 'Pelatihan' | 'Sertifikasi'
  lokasi: string
  deskripsi: string
  persyaratan: string[]
  deadline: string
  durasi?: string
}

export type KategoriPengumuman = 'Karir' | 'Universitas' | 'Lomba' | 'Umum' | 'Pengumuman'

export interface Pengumuman {
  id: string
  judul: string
  kategori: KategoriPengumuman
  isi: string
  tanggal: string
  prioritas: 'Tinggi' | 'Sedang' | 'Rendah'
  pinned: boolean
}

export interface Lomba {
  id: string
  nama: string
  kategori: string
  tingkat: TingkatPrestasi
  tanggal: string
  deadlineDaftar: string
  persyaratan: string[]
  kandidatRekomendasi: string[]
  hasil?: string
  status: 'Pendaftaran' | 'Berlangsung' | 'Selesai'
}

export interface Absensi {
  siswaId: string
  siswaNama: string
  kelasNama: string
  sakit: number
  izin: number
  alpha: number
  bulan: string
}

export interface NilaiAkademik {
  siswaId: string
  siswaNama: string
  kelasNama: string
  semester: string
  uts: number
  uas: number
  ulanganHarian: number
  rataRata: number
}

export interface Notifikasi {
  id: string
  userId: string
  judul: string
  pesan: string
  kategori: 'Pelanggaran' | 'Prestasi' | 'Konseling' | 'Pengumuman' | 'Sanksi'
  tanggal: string
  dibaca: boolean
}

export interface AturanSanksi {
  id: string
  kodeRule: string
  nama: string
  thresholdMin: number
  thresholdMax: number
  tindakan: string
  deskripsi: string
}

export type StatusTindakLanjut = 'Direkomendasikan' | 'Dalam Proses' | 'Selesai' | 'Dibatalkan'

export interface TindakLanjut {
  id: string
  siswaId: string
  siswaNama: string
  kelasNama: string
  pelanggaranId: string
  pelanggaranNama: string
  poinSaatItu: number
  rekomendasiSanksi: string
  kodeRule: string
  status: StatusTindakLanjut
  catatanPembinaan: string
  tanggalRekomendasi: string
  tanggalPelaksanaan: string
  ditanganiOleh: string
}
