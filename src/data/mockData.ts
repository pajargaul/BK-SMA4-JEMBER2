import type {
  User, Kelas, Siswa, AturanPelanggaran, Pelanggaran, Prestasi,
  SesiKonseling, Kampus, LowonganKerja, Pengumuman, Lomba,
  Absensi, NilaiAkademik, Notifikasi, AturanSanksi, TindakLanjut,
} from '../types'

export const users: User[] = [
  { id: 'u1', name: 'Drs. Bambang Sutrisno, M.Pd.', role: 'kepala_sekolah', nipNis: '196504121990031005', email: 'kepsek@sman4jember.sch.id', avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '081234567890' },
  { id: 'u2', name: 'Dra. Siti Rahmawati, M.Psi.', role: 'guru_bk', nipNis: '197003151995042002', email: 'gurubk@sman4jember.sch.id', avatar: 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '081334455667' },
  { id: 'u3', name: 'Ahmad Fauzi, S.Kom.', role: 'admin', nipNis: '198506202010011003', email: 'admin@sman4jember.sch.id', avatar: 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '081556677889' },
  { id: 'u4', name: 'Aisyah Putri Lestari', role: 'siswa', nipNis: '20210045', email: 'aisyah.putri@siswa.sch.id', avatar: 'https://images.pexels.com/photos/5210660/pexels-photo-5210660.jpeg?auto=compress&cs=tinysrgb&w=200', phone: '081788990011' },
]

export const kelasList: Kelas[] = [
  { id: 'k1', nama: 'X-MIPA 1', tingkat: 'X', jurusan: 'MIPA', waliKelas: 'Drs. Hendro', jumlahSiswa: 36 },
  { id: 'k2', nama: 'X-MIPA 2', tingkat: 'X', jurusan: 'MIPA', waliKelas: 'Rina Wijaya, S.Pd.', jumlahSiswa: 35 },
  { id: 'k3', nama: 'X-IPS 1', tingkat: 'X', jurusan: 'IPS', waliKelas: 'Joko Susilo, S.Pd.', jumlahSiswa: 34 },
  { id: 'k4', nama: 'X-Bahasa 1', tingkat: 'X', jurusan: 'Bahasa', waliKelas: 'Dewi Anggraini, S.Pd.', jumlahSiswa: 30 },
  { id: 'k5', nama: 'XI-MIPA 1', tingkat: 'XI', jurusan: 'MIPA', waliKelas: 'Budi Santoso, M.Pd.', jumlahSiswa: 36 },
  { id: 'k6', nama: 'XI-MIPA 2', tingkat: 'XI', jurusan: 'MIPA', waliKelas: 'Maya Sari, S.Pd.', jumlahSiswa: 35 },
  { id: 'k7', nama: 'XI-IPS 1', tingkat: 'XI', jurusan: 'IPS', waliKelas: 'Agus Prasetyo, S.Pd.', jumlahSiswa: 33 },
  { id: 'k8', nama: 'XI-IPS 2', tingkat: 'XI', jurusan: 'IPS', waliKelas: 'Nur Hidayah, S.Pd.', jumlahSiswa: 32 },
  { id: 'k9', nama: 'XI-Bahasa 1', tingkat: 'XI', jurusan: 'Bahasa', waliKelas: 'Ratna Dewi, S.Pd.', jumlahSiswa: 28 },
  { id: 'k10', nama: 'XII-MIPA 1', tingkat: 'XII', jurusan: 'MIPA', waliKelas: 'Drs. Suparman', jumlahSiswa: 34 },
  { id: 'k11', nama: 'XII-MIPA 2', tingkat: 'XII', jurusan: 'MIPA', waliKelas: 'Lestari Wulandari, M.Pd.', jumlahSiswa: 33 },
  { id: 'k12', nama: 'XII-IPS 1', tingkat: 'XII', jurusan: 'IPS', waliKelas: 'Eko Prasetyo, S.Pd.', jumlahSiswa: 31 },
  { id: 'k13', nama: 'XII-IPS 2', tingkat: 'XII', jurusan: 'IPS', waliKelas: 'Wahyu Ramadhan, S.Pd.', jumlahSiswa: 30 },
  { id: 'k14', nama: 'XII-Bahasa 1', tingkat: 'XII', jurusan: 'Bahasa', waliKelas: 'Indah Permata, S.Pd.', jumlahSiswa: 27 },
]

const namaDepan = ['Ahmad', 'Aisyah', 'Budi', 'Citra', 'Dimas', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Indah', 'Joko', 'Kartika', 'Lina', 'Made', 'Nisa', 'Oki', 'Putri', 'Rizki', 'Sari', 'Tono', 'Umar', 'Vina', 'Wahyu', 'Yuni', 'Zaki', 'Bayu', 'Dewi', 'Eko', 'Fitri', 'Galih']
const namaBelakang = ['Saputra', 'Lestari', 'Pratama', 'Wijaya', 'Santoso', 'Anggraini', 'Hidayat', 'Maulana', 'Permata', 'Ramadhan', 'Kusuma', 'Wulandari', 'Saputri', 'Firmansyah', 'Ningrum', 'Setiawan', 'Pertiwi', 'Hartono', 'Yulianti', 'Bagus']
const kelasIds = kelasList.map(k => k.id)

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length] }

export const siswaList: Siswa[] = Array.from({ length: 48 }, (_, i) => {
  const kelasId = kelasIds[i % kelasIds.length]
  const isP = i % 2 === 0
  const poinPel = [0, 0, 0, 5, 10, 15, 25, 35, 45, 60, 75, 90][i % 12]
  const poinPres = [0, 0, 10, 20, 30, 50][i % 6]
  const poinAktif = Math.max(0, poinPel - poinPres)
  let status: Siswa['status'] = 'Aktif'
  if (poinAktif >= 100) status = 'Dikeluarkan'
  else if (poinAktif >= 75) status = 'SP-3'
  else if (poinAktif >= 50) status = 'SP-2'
  else if (poinAktif >= 25) status = 'SP-1'
  else if (poinAktif >= 10) status = 'Pembinaan'
  return {
    id: `s${i + 1}`,
    nama: `${pick(namaDepan, i)} ${pick(namaBelakang, i + 3)}`,
    nis: `2021${String(1000 + i).padStart(4, '0')}`,
    kelasId,
    jenisKelamin: isP ? 'P' : 'L',
    poinPelanggaran: poinPel,
    poinPrestasi: poinPres,
    poinAktif,
    status,
    avatar: isP
      ? `https://images.pexels.com/photos/52123${(i % 9) + 45}/pexels-photo-52123${(i % 9) + 45}.jpeg?auto=compress&cs=tinysrgb&w=200`
      : `https://images.pexels.com/photos/52126${(i % 7) + 95}/pexels-photo-52126${(i % 7) + 95}.jpeg?auto=compress&cs=tinysrgb&w=200`,
    kontakOrtu: `0812${String(34567890 + i).slice(-8)}`,
  }
})

export const aturanPelanggaran: AturanPelanggaran[] = [
  { id: 'a1', nama: 'Terlambat masuk sekolah', kategori: 'Kedisiplinan', tingkat: 'Ringan', poin: 5, deskripsi: 'Terlambat masuk sekolah tanpa alasan jelas setelah bel masuk berbunyi.' },
  { id: 'a2', nama: 'Tidak mengikuti upacara', kategori: 'Tata Tertib', tingkat: 'Ringan', poin: 10, deskripsi: 'Tidak mengikuti upacara bendera tanpa izin.' },
  { id: 'a3', nama: 'Tidak memakai seragam lengkap', kategori: 'Tata Tertib', tingkat: 'Ringan', poin: 5, deskripsi: 'Tidak memakai seragam sesuai ketentuan hari dan tidak rapi.' },
  { id: 'a4', nama: 'Membolos jam pelajaran', kategori: 'Kedisiplinan', tingkat: 'Sedang', poin: 15, deskripsi: 'Tidak masuk kelas saat jam pelajaran berlangsung tanpa izin.' },
  { id: 'a5', nama: 'Membawa HP saat ujian', kategori: 'Akademik', tingkat: 'Berat', poin: 25, deskripsi: 'Membawa atau menggunakan perangkat elektronik saat ujian/ulangan.' },
  { id: 'a6', nama: 'Menyontek saat ujian', kategori: 'Akademik', tingkat: 'Sedang', poin: 20, deskripsi: 'Menyontek atau memberi contekan saat ujian/ulangan.' },
  { id: 'a7', nama: 'Berkelahi di lingkungan sekolah', kategori: 'Sosial', tingkat: 'Berat', poin: 50, deskripsi: 'Terlibat perkelahian fisik di lingkungan sekolah.' },
  { id: 'a8', nama: 'Merokok di area sekolah', kategori: 'Lingkungan', tingkat: 'Berat', poin: 35, deskripsi: 'Merokok atau membawa rokok di lingkungan sekolah.' },
  { id: 'a9', nama: 'Bolos sekolah seharian', kategori: 'Kedisiplinan', tingkat: 'Sedang', poin: 20, deskripsi: 'Tidak masuk sekolah seharian tanpa izin/keterangan.' },
  { id: 'a10', nama: 'Membawa senjata tajam', kategori: 'Sosial', tingkat: 'Berat', poin: 75, deskripsi: 'Membawa senjata tajam atau benda berbahaya ke sekolah.' },
  { id: 'a11', nama: 'Tidak mengerjakan tugas', kategori: 'Akademik', tingkat: 'Ringan', poin: 5, deskripsi: 'Tidak mengerjakan tugas sekolah secara berulang.' },
  { id: 'a12', nama: 'Berkata kasar pada guru', kategori: 'Sosial', tingkat: 'Sedang', poin: 30, deskripsi: 'Berkata tidak sopan kepada guru atau staf sekolah.' },
  { id: 'a13', nama: 'Membuang sampah sembarangan', kategori: 'Lingkungan', tingkat: 'Ringan', poin: 3, deskripsi: 'Membuang sampah tidak pada tempatnya.' },
  { id: 'a14', nama: 'Membawa kendaraan tanpa SIM/helm', kategori: 'Tata Tertib', tingkat: 'Ringan', poin: 10, deskripsi: 'Membawa kendaraan tanpa kelengkapan dan dokumen yang berlaku.' },
  { id: 'a15', nama: 'Tidak lapor ketika sakit', kategori: 'Kedisiplinan', tingkat: 'Ringan', poin: 5, deskripsi: 'Tidak memberitahu sekolah ketika tidak masuk karena sakit.' },
]

export const aturanSanksi: AturanSanksi[] = [
  { id: 'sk1', kodeRule: 'F-01', nama: 'Teguran Lisan', thresholdMin: 1, thresholdMax: 9, tindakan: 'Teguran lisan oleh Guru BK', deskripsi: 'Pembinaan langsung oleh guru BK untuk pelanggaran ringan.' },
  { id: 'sk2', kodeRule: 'F-02', nama: 'Teguran Tertulis', thresholdMin: 10, thresholdMax: 24, tindakan: 'Surat Teguran Tertulis + pemanggilan wali', deskripsi: 'Teguran tertulis disertai pemanggilan orang tua/wali.' },
  { id: 'sk3', kodeRule: 'F-03', nama: 'Surat Peringatan 1 (SP-1)', thresholdMin: 25, thresholdMax: 49, tindakan: 'Surat Peringatan Pertama + konseling wajib', deskripsi: 'Surat peringatan pertama disertai kewajiban mengikuti sesi konseling.' },
  { id: 'sk4', kodeRule: 'F-04', nama: 'Surat Peringatan 2 (SP-2)', thresholdMin: 50, thresholdMax: 74, tindakan: 'Surat Peringatan Kedua + skorsing 3 hari', deskripsi: 'Surat peringatan kedua disertai skorsing selama 3 hari.' },
  { id: 'sk5', kodeRule: 'F-05', nama: 'Surat Peringatan 3 (SP-3)', thresholdMin: 75, thresholdMax: 99, tindakan: 'Surat Peringatan Ketiga + skorsing 6 hari', deskripsi: 'Surat peringatan ketiga disertai skorsing dan rapat wali.' },
  { id: 'sk6', kodeRule: 'F-06', nama: 'Dikeluarkan dari Sekolah', thresholdMin: 100, thresholdMax: 999, tindakan: 'Pemecatan/siswa dikembalikan ke orang tua', deskripsi: 'Tindakan terberat berupa pengembalian siswa kepada orang tua.' },
]

export function getRekomendasiSanksi(poinAktif: number): AturanSanksi {
  return aturanSanksi.find(s => poinAktif >= s.thresholdMin && poinAktif <= s.thresholdMax) || aturanSanksi[0]
}

export const pelanggaranList: Pelanggaran[] = [
  { id: 'p1', siswaId: 's1', siswaNama: 'Ahmad Saputra', kelasNama: 'X-MIPA 1', aturanId: 'a1', aturanNama: 'Terlambat masuk sekolah', poin: 5, tanggal: '2026-06-15', catatan: 'Terlambat 20 menit, sudah kedua kalinya minggu ini.', dicatatOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'p2', siswaId: 's5', siswaNama: 'Eka Wijaya', kelasNama: 'XI-MIPA 1', aturanId: 'a4', aturanNama: 'Membolos jam pelajaran', poin: 15, tanggal: '2026-06-18', catatan: 'Membolos jam Matematika, terlihat di kantin.', dicatatOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'p3', siswaId: 's7', siswaNama: 'Hadi Pratama', kelasNama: 'XI-MIPA 1', aturanId: 'a6', aturanNama: 'Menyontek saat ujian', poin: 20, tanggal: '2026-06-20', catatan: 'Menyontek saat UTS Fisika menggunakan catatan kecil.', dicatatOleh: 'Budi Santoso, M.Pd.' },
  { id: 'p4', siswaId: 's10', siswaNama: 'Lina Kusuma', kelasNama: 'XII-IPS 1', aturanId: 'a2', aturanNama: 'Tidak mengikuti upacara', poin: 10, tanggal: '2026-06-22', catatan: 'Tidak hadir upacara bendera Senin tanpa keterangan.', dicatatOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'p5', siswaId: 's3', siswaNama: 'Budi Santoso', kelasNama: 'X-MIPA 1', aturanId: 'a8', aturanNama: 'Merokok di area sekolah', poin: 35, tanggal: '2026-06-25', catatan: 'Diketahui merokok di toilet belakang saat istirahat.', dicatatOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'p6', siswaId: 's12', siswaNama: 'Nisa Anggraini', kelasNama: 'XII-IPS 1', aturanId: 'a1', aturanNama: 'Terlambat masuk sekolah', poin: 5, tanggal: '2026-06-28', catatan: 'Terlambat 15 menit.', dicatatOleh: 'Eko Prasetyo, S.Pd.' },
  { id: 'p7', siswaId: 's15', siswaNama: 'Putri Permata', kelasNama: 'XII-MIPA 2', aturanId: 'a5', aturanNama: 'Membawa HP saat ujian', poin: 25, tanggal: '2026-07-01', catatan: 'Menggunakan HP saat Ulangan Harian Biologi.', dicatatOleh: 'Lestari Wulandari, M.Pd.' },
  { id: 'p8', siswaId: 's20', siswaNama: 'Wahyu Setiawan', kelasNama: 'XI-IPS 2', aturanId: 'a7', aturanNama: 'Berkelahi di lingkungan sekolah', poin: 50, tanggal: '2026-07-03', catatan: 'Berkelahi dengan siswa kelas lain saat istirahat.', dicatatOleh: 'Dra. Siti Rahmawati, M.Psi.' },
]

export const tindakLanjutList: TindakLanjut[] = [
  { id: 'tl1', siswaId: 's1', siswaNama: 'Ahmad Saputra', kelasNama: 'X-MIPA 1', pelanggaranId: 'p1', pelanggaranNama: 'Terlambat masuk sekolah', poinSaatItu: 5, rekomendasiSanksi: 'Teguran Lisan', kodeRule: 'F-01', status: 'Selesai', catatanPembinaan: 'Siswa telah ditegur lisan oleh Guru BK. Menyadari kesalahan dan berjanji tidak mengulangi. Wali kelas sudah diberi info.', tanggalRekomendasi: '2026-06-15', tanggalPelaksanaan: '2026-06-16', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl2', siswaId: 's5', siswaNama: 'Eka Wijaya', kelasNama: 'XI-MIPA 1', pelanggaranId: 'p2', pelanggaranNama: 'Membolos jam pelajaran', poinSaatItu: 15, rekomendasiSanksi: 'Teguran Tertulis', kodeRule: 'F-02', status: 'Dalam Proses', catatanPembinaan: 'Surat teguran tertulis sudah diterbitkan. Pemanggilan wali dijadwalkan minggu depan. Sesi konseling pertama sudah dilakukan.', tanggalRekomendasi: '2026-06-18', tanggalPelaksanaan: '2026-06-20', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl3', siswaId: 's7', siswaNama: 'Hadi Pratama', kelasNama: 'XI-MIPA 1', pelanggaranId: 'p3', pelanggaranNama: 'Menyontek saat ujian', poinSaatItu: 20, rekomendasiSanksi: 'Teguran Tertulis', kodeRule: 'F-02', status: 'Dalam Proses', catatanPembinaan: 'Siswa sedang dalam proses pembinaan. Wali sudah datang ke sekolah. Sesi konseling akademik dijadwalkan rutin.', tanggalRekomendasi: '2026-06-20', tanggalPelaksanaan: '2026-06-22', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl4', siswaId: 's10', siswaNama: 'Lina Kusuma', kelasNama: 'XII-IPS 1', pelanggaranId: 'p4', pelanggaranNama: 'Tidak mengikuti upacara', poinSaatItu: 10, rekomendasiSanksi: 'Teguran Tertulis', kodeRule: 'F-02', status: 'Selesai', catatanPembinaan: 'Teguran tertulis diberikan. Siswa meminta maaf dan berjanji hadir upacara berikutnya. Kasus ditutup.', tanggalRekomendasi: '2026-06-22', tanggalPelaksanaan: '2026-06-23', ditanganiOleh: 'Eko Prasetyo, S.Pd.' },
  { id: 'tl5', siswaId: 's3', siswaNama: 'Budi Santoso', kelasNama: 'X-MIPA 1', pelanggaranId: 'p5', pelanggaranNama: 'Merokok di area sekolah', poinSaatItu: 35, rekomendasiSanksi: 'Surat Peringatan 1 (SP-1)', kodeRule: 'F-03', status: 'Dalam Proses', catatanPembinaan: 'SP-1 sudah diterbitkan. Siswa wajib mengikuti 3 sesi konseling. Sesi pertama selesai, 2 sesi tersisa. Orang tua sudah datang.', tanggalRekomendasi: '2026-06-25', tanggalPelaksanaan: '2026-06-26', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl6', siswaId: 's15', siswaNama: 'Putri Permata', kelasNama: 'XII-MIPA 2', pelanggaranId: 'p7', pelanggaranNama: 'Membawa HP saat ujian', poinSaatItu: 25, rekomendasiSanksi: 'Surat Peringatan 1 (SP-1)', kodeRule: 'F-03', status: 'Direkomendasikan', catatanPembinaan: '', tanggalRekomendasi: '2026-07-01', tanggalPelaksanaan: '', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl7', siswaId: 's20', siswaNama: 'Wahyu Setiawan', kelasNama: 'XI-IPS 2', pelanggaranId: 'p8', pelanggaranNama: 'Berkelahi di lingkungan sekolah', poinSaatItu: 50, rekomendasiSanksi: 'Surat Peringatan 2 (SP-2)', kodeRule: 'F-04', status: 'Direkomendasikan', catatanPembinaan: '', tanggalRekomendasi: '2026-07-03', tanggalPelaksanaan: '', ditanganiOleh: 'Dra. Siti Rahmawati, M.Psi.' },
  { id: 'tl8', siswaId: 's12', siswaNama: 'Nisa Anggraini', kelasNama: 'XII-IPS 1', pelanggaranId: 'p6', pelanggaranNama: 'Terlambat masuk sekolah', poinSaatItu: 5, rekomendasiSanksi: 'Teguran Lisan', kodeRule: 'F-01', status: 'Selesai', catatanPembinaan: 'Teguran lisan dilakukan. Siswa menjelaskan alasan kemacetan. Diberi toleransi dengan catatan tidak berulang lebih dari 3x.', tanggalRekomendasi: '2026-06-28', tanggalPelaksanaan: '2026-06-29', ditanganiOleh: 'Eko Prasetyo, S.Pd.' },
]

export const prestasiList: Prestasi[] = [
  { id: 'pr1', siswaId: 's2', siswaNama: 'Aisyah Lestari', kelasNama: 'X-MIPA 1', namaLomba: 'Olimpiade Matematika Tingkat Provinsi', kategori: 'Akademik', tingkat: 'Provinsi', poin: 30, tanggal: '2026-05-10', hasil: 'Juara 2' },
  { id: 'pr2', siswaId: 's8', siswaNama: 'Indah Maulana', kelasNama: 'XI-MIPA 1', namaLomba: 'Lomba Debat Bahasa Inggris', kategori: 'Bahasa', tingkat: 'Kabupaten', poin: 20, tanggal: '2026-05-15', hasil: 'Juara 1' },
  { id: 'pr3', siswaId: 's14', siswaNama: 'Zaki Firmansyah', kelasNama: 'XII-MIPA 1', namaLomba: 'Karya Ilmiah Remaja', kategori: 'Sains', tingkat: 'Provinsi', poin: 30, tanggal: '2026-05-20', hasil: 'Juara 3' },
  { id: 'pr4', siswaId: 's25', siswaNama: 'Yuni Pertiwi', kelasNama: 'XI-Bahasa 1', namaLomba: 'Festival Seni Tradisional', kategori: 'Seni', tingkat: 'Nasional', poin: 50, tanggal: '2026-06-01', hasil: 'Juara 1' },
  { id: 'pr5', siswaId: 's30', siswaNama: 'Bayu Hartono', kelasNama: 'XII-IPS 2', namaLomba: 'Lomba Cerdas Cermat Ekonomi', kategori: 'Akademik', tingkat: 'Kabupaten', poin: 20, tanggal: '2026-06-05', hasil: 'Juara 2' },
  { id: 'pr6', siswaId: 's4', siswaNama: 'Dimas Wijaya', kelasNama: 'X-MIPA 1', namaLomba: 'Turnamen Futsal Antar Sekolah', kategori: 'Olahraga', tingkat: 'Provinsi', poin: 30, tanggal: '2026-06-12', hasil: 'Juara 1' },
]

export const sesiKonseling: SesiKonseling[] = [
  { id: 'ks1', siswaId: 's5', siswaNama: 'Eka Wijaya', kelasNama: 'XI-MIPA 1', jenis: 'Personal', topik: 'Kesulitan fokus belajar & tekanan orang tua', tanggal: '2026-07-05', waktu: '09:00', status: 'Terjadwal', catatan: 'Siswa mengaku tertekan dengan ekspektasi tinggi orang tua. Akan dilakukan pendekatan bertahap.', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: true },
  { id: 'ks2', siswaId: 's20', siswaNama: 'Wahyu Setiawan', kelasNama: 'XI-IPS 2', jenis: 'Sosial', topik: 'Konflik dengan teman & pengendalian emosi', tanggal: '2026-07-04', waktu: '10:30', status: 'Dalam Proses', catatan: 'Pasca insiden perkelahian. Sesi pertama berjalan baik, siswa kooperatif. Lanjut sesi kedua pekan depan.', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: true },
  { id: 'ks3', siswaId: 's12', siswaNama: 'Nisa Anggraini', kelasNama: 'XII-IPS 1', jenis: 'Karir', topik: 'Konsultasi pemilihan jurusan kuliah', tanggal: '2026-07-02', waktu: '13:00', status: 'Selesai', catatan: 'Siswa tertarik dengan Manajemen & Akuntansi. Direkomendasikan untuk mengikuti tryout SNBT.', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: false },
  { id: 'ks4', siswaId: 's7', siswaNama: 'Hadi Pratama', kelasNama: 'XI-MIPA 1', jenis: 'Akademik', topik: 'Penurunan nilai & motivasi belajar', tanggal: '2026-06-28', waktu: '11:00', status: 'Selesai', catatan: 'Nilai menurun drastis semester ini. Ternyata ada masalah keluarga. Akan koordinasi dengan wali kelas.', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: true },
  { id: 'ks5', siswaId: 's15', siswaNama: 'Putri Permata', kelasNama: 'XII-MIPA 2', jenis: 'Karir', topik: 'Eksplorasi minat prodi Kedokteran', tanggal: '2026-07-08', waktu: '14:00', status: 'Terjadwal', catatan: '', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: false },
  { id: 'ks6', siswaId: 's3', siswaNama: 'Budi Santoso', kelasNama: 'X-MIPA 1', jenis: 'Personal', topik: 'Pembinaan pasca pelanggaran merokok', tanggal: '2026-06-26', waktu: '10:00', status: 'Selesai', catatan: 'Siswa menyadari kesalahan. Berjanji tidak mengulangi. Wali sudah diberi info.', konselor: 'Dra. Siti Rahmawati, M.Psi.', privat: true },
]

export const kampusList: Kampus[] = [
  {
    id: 'kp1', nama: 'Universitas Jember', jenis: 'Negeri', lokasi: 'Jember, Jawa Timur', akreditasi: 'Unggul',
    deskripsi: 'Universitas negeri terbesar di kawasan Tapal Kuda dengan keunggulan di bidang pertanian, kedokteran, dan teknik.',
    fakultas: ['Kedokteran', 'Teknik', 'Pertanian', 'Ekonomi & Bisnis', 'Hukum', 'FISIP', 'MIPA', 'Keguruan & Ilmu Pendidikan'],
    gelombang: [
      { nama: 'SNBP', tanggalMulai: '2026-02-05', tanggalSelesai: '2026-02-28', jalur: 'Prestasi Rapor' },
      { nama: 'SNBT', tanggalMulai: '2026-03-10', tanggalSelesai: '2026-04-15', jalur: 'Tes Tertulis UTBK' },
      { nama: 'Mandiri Gel. 1', tanggalMulai: '2026-06-01', tanggalSelesai: '2026-06-20', jalur: 'Tes Mandiri' },
    ],
    nilaiPotong: [
      { prodi: 'Kedokteran', nilai: '582.3', tahun: '2025' },
      { prodi: 'Teknik Informatika', nilai: '521.8', tahun: '2025' },
      { prodi: 'Manajemen', nilai: '445.2', tahun: '2025' },
      { prodi: 'Hukum', nilai: '467.1', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kp2', nama: 'Universitas Brawijaya', jenis: 'Negeri', lokasi: 'Malang, Jawa Timur', akreditasi: 'Unggul',
    deskripsi: 'Salah satu universitas negeri terkemuka di Indonesia, dikenal dengan program studi unggulan di bidang bisnis, hukum, dan teknik.',
    fakultas: ['Ekonomi & Bisnis', 'Hukum', 'Teknik', 'Kedokteran', 'Ilmu Komputer', 'Pertanian', 'FISIP', 'Farmasi'],
    gelombang: [
      { nama: 'SNBP', tanggalMulai: '2026-02-05', tanggalSelesai: '2026-02-28', jalur: 'Prestasi Rapor' },
      { nama: 'SNBT', tanggalMulai: '2026-03-10', tanggalSelesai: '2026-04-15', jalur: 'Tes Tertulis UTBK' },
      { nama: 'Mandiri Gel. 1', tanggalMulai: '2026-05-20', tanggalSelesai: '2026-06-10', jalur: 'Tes Mandiri' },
    ],
    nilaiPotong: [
      { prodi: 'Manajemen', nilai: '612.4', tahun: '2025' },
      { prodi: 'Ilmu Komputer', nilai: '645.7', tahun: '2025' },
      { prodi: 'Teknik Sipil', nilai: '534.2', tahun: '2025' },
      { prodi: 'Hukum', nilai: '578.9', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kp3', nama: 'Universitas Airlangga', jenis: 'Negeri', lokasi: 'Surabaya, Jawa Timur', akreditasi: 'Unggul',
    deskripsi: 'Universitas negeri dengan reputasi nasional, unggul di bidang kesehatan, hukum, dan ekonomi.',
    fakultas: ['Kedokteran', 'Kedokteran Gigi', 'Hukum', 'Ekonomi & Bisnis', 'Farmasi', 'Vokasi', 'Psikologi', 'FISIP'],
    gelombang: [
      { nama: 'SNBP', tanggalMulai: '2026-02-05', tanggalSelesai: '2026-02-28', jalur: 'Prestasi Rapor' },
      { nama: 'SNBT', tanggalMulai: '2026-03-10', tanggalSelesai: '2026-04-15', jalur: 'Tes Tertulis UTBK' },
    ],
    nilaiPotong: [
      { prodi: 'Kedokteran', nilai: '678.1', tahun: '2025' },
      { prodi: 'Psikologi', nilai: '598.4', tahun: '2025' },
      { prodi: 'Hukum', nilai: '567.2', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kp4', nama: 'Universitas Muhammadiyah Jember', jenis: 'Swasta', lokasi: 'Jember, Jawa Timur', akreditasi: 'Baik Sekali',
    deskripsi: 'Universitas swasta terkemuka di Jember dengan keunggulan di bidang kesehatan dan pendidikan berbasis nilai Islami.',
    fakultas: ['Keguruan & Ilmu Pendidikan', 'Kesehatan Masyarakat', 'Ekonomi', 'Teknik', 'Psikologi', 'Hukum'],
    gelombang: [
      { nama: 'Reguler Gel. 1', tanggalMulai: '2026-05-01', tanggalSelesai: '2026-05-31', jalur: 'Tes Mandiri' },
      { nama: 'Reguler Gel. 2', tanggalMulai: '2026-06-15', tanggalSelesai: '2026-07-15', jalur: 'Tes Mandiri' },
    ],
    nilaiPotong: [
      { prodi: 'Pendidikan Matematika', nilai: '410.5', tahun: '2025' },
      { prodi: 'Manajemen', nilai: '385.2', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/159775/books-in-library-159775.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kp5', nama: 'Politeknik Negeri Jember', jenis: 'Negeri', lokasi: 'Jember, Jawa Timur', akreditasi: 'Unggul',
    deskripsi: 'Perguruan tinggi vokasi unggulan dengan fokus pada keterampilan praktis dan kesiapan kerja industri.',
    fakultas: ['Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro', 'Akuntansi', 'Manajemen Informatika', 'Agroindustri'],
    gelombang: [
      { nama: 'SNBT', tanggalMulai: '2026-03-10', tanggalSelesai: '2026-04-15', jalur: 'Tes Tertulis' },
      { nama: 'Mandiri', tanggalMulai: '2026-05-10', tanggalSelesai: '2026-06-05', jalur: 'Tes Mandiri' },
    ],
    nilaiPotong: [
      { prodi: 'Manajemen Informatika', nilai: '478.3', tahun: '2025' },
      { prodi: 'Teknik Mesin', nilai: '412.6', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kp6', nama: 'Institut Teknologi Sepuluh Nopember', jenis: 'Negeri', lokasi: 'Surabaya, Jawa Timur', akreditasi: 'Unggul',
    deskripsi: 'Institut teknologi terbaik di Indonesia timur, unggul di bidang teknik, sains data, dan sistem informasi.',
    fakultas: ['Teknik Sipil', 'Teknik Industri', 'Teknik Informatika', 'Sistem Informasi', 'Teknik Mesin', 'Kelautan', 'Bisnis & Manajemen Teknologi'],
    gelombang: [
      { nama: 'SNBP', tanggalMulai: '2026-02-05', tanggalSelesai: '2026-02-28', jalur: 'Prestasi Rapor' },
      { nama: 'SNBT', tanggalMulai: '2026-03-10', tanggalSelesai: '2026-04-15', jalur: 'Tes Tertulis UTBK' },
    ],
    nilaiPotong: [
      { prodi: 'Teknik Informatika', nilai: '698.5', tahun: '2025' },
      { prodi: 'Sistem Informasi', nilai: '654.2', tahun: '2025' },
      { prodi: 'Teknik Industri', nilai: '612.8', tahun: '2025' },
    ],
    logo: 'https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

export const lowonganKerja: LowonganKerja[] = [
  { id: 'lk1', judul: 'Magang Industri Manufaktur', perusahaan: 'PT Sinar Mas Tbk', jenis: 'Magang', lokasi: 'Jember, Jawa Timur', deskripsi: 'Program magang 3 bulan untuk siswa kelas XII di bidang produksi dan quality control.', persyaratan: ['Minimal kelas XII', 'Rata-rata nilai 75+', 'Berkomitmen 3 bulan'], deadline: '2026-07-25', durasi: '3 bulan' },
  { id: 'lk2', judul: 'Pelatihan Sertifikasi Komputer', perusahaan: 'Digital Skill Academy', jenis: 'Sertifikasi', lokasi: 'Online', deskripsi: 'Pelatihan gratis sertifikasi IT untuk lulusan SMA: Web Development, Data Entry, dan Office.', persyaratan: ['Siswa kelas XII', 'Minat bidang IT', 'Memiliki laptop'], deadline: '2026-08-10', durasi: '2 bulan' },
  { id: 'lk3', judul: 'Apprenticeship Perbankan', perusahaan: 'Bank Jatim', jenis: 'Magang', lokasi: 'Jember, Jawa Timur', deskripsi: 'Program apprenticeship di cabang Bank Jatim untuk belajar operasional perbankan dan customer service.', persyaratan: ['Kelas XII IPS', 'Komunikatif', 'Raport minimal 80'], deadline: '2026-07-30', durasi: '4 bulan' },
  { id: 'lk4', judul: 'Lowongan Staff Administrasi', perusahaan: 'CV Karya Mandiri', jenis: 'Kerja', lokasi: 'Jember, Jawa Timur', deskripsi: 'Lowongan kerja untuk lulusan SMA di bidang administrasi dan keuangan kantor.', persyaratan:['Lulusan SMA', 'Menguasai MS Office', 'Teliti'], deadline: '2026-08-15' },
  { id: 'lk5', judul: 'Pelatihan Otomotif Gratis', perusahaan: 'Toyota Auto Body Jember', jenis: 'Pelatihan', lokasi: 'Jember, Jawa Timur', deskripsi: 'Pelatihan teknisi otomotif dengan sertifikat resmi dan peluang direkrut.', persyaratan: ['Minat otomotif', 'Sehat jasmani', 'Bersedia shift'], deadline: '2026-07-20', durasi: '6 bulan' },
  { id: 'lk6', judul: 'Magang Digital Marketing', perusahaan: 'Jember Creative Hub', jenis: 'Magang', lokasi: 'Jember, Jawa Timur', deskripsi: 'Belah digital marketing, social media management, dan content creation di startup lokal.', persyaratan: ['Kreatif', 'Aktif media sosial', 'Kelas XI/XII'], deadline: '2026-08-05', durasi: '2 bulan' },
]

export const pengumumanList: Pengumuman[] = [
  { id: 'pg1', judul: 'Pendaftaran SNBP 2026 Resmi Dibuka', kategori: 'Universitas', isi: 'Pendaftaran jalur SNBP (Seleksi Nasional Berdasarkan Prestasi) resmi dibuka mulai 5 Februari 2026. Siswa kelas XII dapat mengakses panduan lengkap di ruang BK atau portal LTMPT.', tanggal: '2026-07-08', prioritas: 'Tinggi', pinned: true },
  { id: 'pg2', judul: 'Tryout UTBK Gratis untuk Siswa Kelas XII', kategori: 'Universitas', isi: 'BK SMAN 4 Jember mengadakan tryout UTBK gratis setiap Sabtu pukul 08.00. Pendaftaran via Google Form yang dibagikan di grup kelas.', tanggal: '2026-07-06', prioritas: 'Tinggi', pinned: true },
  { id: 'pg3', judul: 'Pendaftaran Olimpiade Sains Nasional', kategori: 'Lomba', isi: 'Dibuka pendaftaran tim olimpiade sains (Matematika, Fisika, Biologi, Kimia) tingkat nasional. Seleksi internal pada 20 Juli 2026.', tanggal: '2026-07-05', prioritas: 'Sedang', pinned: false },
  { id: 'pg4', judul: 'Workshop Karir: Menjadi Pengusaha Muda', kategori: 'Karir', isi: 'Workshop kewirausahaan bersama alumni sukses SMAN 4 Jember. Sabtu, 15 Juli 2026 di Aula Utama. Wajib hadir untuk siswa IPS kelas XII.', tanggal: '2026-07-03', prioritas: 'Sedang', pinned: false },
  { id: 'pg5', judul: 'Jadwal Konseling Bulan Juli 2026', kategori: 'Umum', isi: 'Jadwal konseling personal dan karir untuk bulan Juli sudah tersedia. Siswa dapat melakukan pemesanan sesi melalui sistem atau langsung ke ruang BK.', tanggal: '2026-07-01', prioritas: 'Rendah', pinned: false },
  { id: 'pg6', judul: 'Beasiswa Prestasi Bupati Jember 2026', kategori: 'Umum', isi: 'Beasiswa untuk siswa berprestasi akademik dan non-akademik. Pengumpulan berkas paling lambat 25 Juli 2026 di ruang BK.', tanggal: '2026-06-28', prioritas: 'Tinggi', pinned: false },
]

export const lombaList: Lomba[] = [
  { id: 'lb1', nama: 'Olimpiade Sains Nasional (OSN) 2026', kategori: 'Sains', tingkat: 'Nasional', tanggal: '2026-09-15', deadlineDaftar: '2026-07-20', persyaratan: ['Raport matematika/sains min 85', 'Surat rekomendasi guru', 'Esai motivasi 500 kata'], kandidatRekomendasi: ['Aisyah Lestari (X-MIPA 1)', 'Zaki Firmansyah (XII-MIPA 1)'], status: 'Pendaftaran' },
  { id: 'lb2', nama: 'Lomba Debat Bahasa Inggris Antar SMA', kategori: 'Bahasa', tingkat: 'Provinsi', tanggal: '2026-08-10', deadlineDaftar: '2026-07-15', persyaratan: ['Nilai Bahasa Inggris min 80', 'Pengalaman debat (diutamakan)'], kandidatRekomendasi: ['Indah Maulana (XI-MIPA 1)'], status: 'Pendaftaran' },
  { id: 'lb3', nama: 'Festival Seni Tradisional Jawa Timur', kategori: 'Seni', tingkat: 'Provinsi', tanggal: '2026-08-20', deadlineDaftar: '2026-07-25', persyaratan: ['Tim 5-8 orang', 'Pengalaman pentas seni'], kandidatRekomendasi: ['Yuni Pertiwi (XI-Bahasa 1)'], status: 'Pendaftaran' },
  { id: 'lb4', nama: 'Turnamen Futsal Pelajar Jember', kategori: 'Olahraga', tingkat: 'Kabupaten', tanggal: '2026-07-25', deadlineDaftar: '2026-07-12', persyaratan: ['Sehat jasmani', 'SKMC', 'Tim 10 orang'], kandidatRekomendasi: ['Bayu Hartono (XII-IPS 2)', 'Dimas Wijaya (X-MIPA 1)'], status: 'Berlangsung' },
  { id: 'lb5', nama: 'Karya Ilmiah Remaja (KIR) Tingkat Provinsi', kategori: 'Sains', tingkat: 'Provinsi', tanggal: '2026-06-15', deadlineDaftar: '2026-05-01', persyaratan: ['Karya tulis ilmiah', 'Pembimbing guru'], kandidatRekomendasi: ['Zaki Firmansyah (XII-MIPA 1)'], hasil: 'Juara 3', status: 'Selesai' },
]

export const absensiList: Absensi[] = siswaList.slice(0, 24).map((s, i) => ({
  siswaId: s.id,
  siswaNama: s.nama,
  kelasNama: kelasList.find(k => k.id === s.kelasId)!.nama,
  sakit: i % 5,
  izin: i % 3,
  alpha: i % 4,
  bulan: 'Juni 2026',
}))

export const nilaiAkademikList: NilaiAkademik[] = siswaList.slice(0, 24).map((s, i) => {
  const uts = 60 + (i * 7) % 35
  const uas = 58 + (i * 5) % 38
  const ulanganHarian = 62 + (i * 3) % 33
  return {
    siswaId: s.id,
    siswaNama: s.nama,
    kelasNama: kelasList.find(k => k.id === s.kelasId)!.nama,
    semester: 'Ganjil 2025/2026',
    uts,
    uas,
    ulanganHarian,
    rataRata: Math.round((uts + uas + ulanganHarian) / 3 * 10) / 10,
  }
})

export const notifikasiList: Notifikasi[] = [
  { id: 'n1', userId: 'u4', judul: 'Rekomendasi Tindak Lanjut Otomatis', pesan: 'Berdasarkan akumulasi poin pelanggaran Anda, sistem menghasilkan rekomendasi: Teguran Lisan. Silakan hubungi Guru BK.', kategori: 'Sanksi', tanggal: '2026-07-08T08:30:00', dibaca: false },
  { id: 'n2', userId: 'u4', judul: 'Sesi Konseling Terjadwal', pesan: 'Sesi konseling karir Anda dijadwalkan pada 8 Juli 2026 pukul 14.00. Mohol hadir tepat waktu.', kategori: 'Konseling', tanggal: '2026-07-06T10:00:00', dibaca: false },
  { id: 'n3', userId: 'u4', judul: 'Pengumuman: Tryout UTBK Gratis', pesan: 'Tryout UTBK gratis setiap Sabtu pukul 08.00. Daftar via Google Form.', kategori: 'Pengumuman', tanggal: '2026-07-06T09:00:00', dibaca: true },
  { id: 'n4', userId: 'u2', judul: 'Pelanggaran Baru Tercatat', pesan: 'Pelanggaran baru atas nama Wahyu Setiawan (XI-IPS 2) - Berkelahi di lingkungan sekolah (50 poin).', kategori: 'Pelanggaran', tanggal: '2026-07-03T13:00:00', dibaca: false },
  { id: 'n5', userId: 'u2', judul: 'Rekomendasi Sanksi Diperbarui', pesan: 'Putri Permata (XII-MIPA 2) mencapai 25 poin aktif. Rekomendasi otomatis: Surat Peringatan 1 (SP-1).', kategori: 'Sanksi', tanggal: '2026-07-01T15:00:00', dibaca: false },
  { id: 'n6', userId: 'u1', judul: 'Laporan Bulanan BK Siap', pesan: 'Laporan rekapitulasi BK bulan Juni 2026 sudah tersedia untuk ditinjau.', kategori: 'Pengumuman', tanggal: '2026-07-01T07:00:00', dibaca: true },
]
