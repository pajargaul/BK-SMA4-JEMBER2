import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  siswaList, kelasList, aturanPelanggaran, aturanSanksi, pelanggaranList,
  prestasiList, sesiKonseling, kampusList, lowonganKerja, pengumumanList,
  lombaList, absensiList, nilaiAkademikList, notifikasiList, getRekomendasiSanksi,
  tindakLanjutList,
} from '../data/mockData'
import type {
  User, Siswa, Kelas, AturanPelanggaran, Pelanggaran, Prestasi, SesiKonseling,
  Kampus, LowonganKerja, Pengumuman, Lomba, Absensi, NilaiAkademik,
  Notifikasi, AturanSanksi, TindakLanjut,
} from '../types'
import { users as initialUsers } from '../data/mockData'

export const useDataStore = defineStore('data', () => {
  const siswa = ref<Siswa[]>([...siswaList])
  const kelas = ref<Kelas[]>([...kelasList])
  const users = ref<User[]>([...initialUsers])
  const aturan = ref<AturanPelanggaran[]>([...aturanPelanggaran])
  const sanksi = ref<AturanSanksi[]>([...aturanSanksi])
  const pelanggaran = ref<Pelanggaran[]>([...pelanggaranList])
  const prestasi = ref<Prestasi[]>([...prestasiList])
  const konseling = ref<SesiKonseling[]>([...sesiKonseling])
  const kampus = ref<Kampus[]>([...kampusList])
  const lowongan = ref<LowonganKerja[]>([...lowonganKerja])
  const pengumuman = ref<Pengumuman[]>([...pengumumanList])
  const lomba = ref<Lomba[]>([...lombaList])
  const absensi = ref<Absensi[]>([...absensiList])
  const nilaiAkademik = ref<NilaiAkademik[]>([...nilaiAkademikList])
  const notifikasi = ref<Notifikasi[]>([...notifikasiList])
  const tindakLanjut = ref<TindakLanjut[]>([...tindakLanjutList])

  // Stats
  const totalSiswaAktif = computed(() => siswa.value.length)
  const totalKasusSelesai = computed(() => konseling.value.filter(k => k.status === 'Selesai').length)
  const totalPoinPrestasi = computed(() => siswa.value.reduce((sum, s) => sum + s.poinPrestasi, 0))
  const totalPelanggaranBulan = computed(() => pelanggaran.value.length)

  // Recommendation engine: recompute a student's active points and status
  function recomputeSiswa(siswaId: string) {
    const s = siswa.value.find(x => x.id === siswaId)
    if (!s) return
    const pel = pelanggaran.value.filter(p => p.siswaId === siswaId).reduce((sum, p) => sum + p.poin, 0)
    const pres = prestasi.value.filter(p => p.siswaId === siswaId).reduce((sum, p) => sum + p.poin, 0)
    const aktif = Math.max(0, pel - pres)
    s.poinPelanggaran = pel
    s.poinPrestasi = pres
    s.poinAktif = aktif
    const rek = getRekomendasiSanksi(aktif)
    if (aktif >= 100) s.status = 'Dikeluarkan'
    else if (aktif >= 75) s.status = 'SP-3'
    else if (aktif >= 50) s.status = 'SP-2'
    else if (aktif >= 25) s.status = 'SP-1'
    else if (aktif >= 10) s.status = 'Pembinaan'
    else s.status = 'Aktif'
    return rek
  }

  function addPelanggaran(data: Omit<Pelanggaran, 'id'>): AturanSanksi {
    const id = `p${Date.now()}`
    const newPel: Pelanggaran = { ...data, id }
    pelanggaran.value.unshift(newPel)
    const rek = recomputeSiswa(data.siswaId)
    // Auto-generate tindak lanjut entry
    if (rek) {
      addTindakLanjut({
        siswaId: data.siswaId,
        siswaNama: data.siswaNama,
        kelasNama: data.kelasNama,
        pelanggaranId: id,
        pelanggaranNama: data.aturanNama,
        poinSaatItu: data.poin,
        rekomendasiSanksi: rek.nama,
        kodeRule: rek.kodeRule,
        status: 'Direkomendasikan',
        catatanPembinaan: '',
        tanggalRekomendasi: data.tanggal,
        tanggalPelaksanaan: '',
        ditanganiOleh: data.dicatatOleh,
      })
    }
    // Generate notification
    addNotifikasi({
      userId: 'u4',
      judul: 'Rekomendasi Tindak Lanjut Otomatis',
      pesan: `Pelanggaran "${data.aturanNama}" (+${data.poin} poin) telah dicatat. ${rek ? 'Rekomendasi: ' + rek.nama + ' - ' + rek.tindakan : ''}`,
      kategori: 'Sanksi',
    })
    return rek || sanksi.value[0]
  }

  function addPrestasi(data: Omit<Prestasi, 'id'>) {
    const id = `pr${Date.now()}`
    prestasi.value.unshift({ ...data, id })
    recomputeSiswa(data.siswaId)
    addNotifikasi({
      userId: 'u4',
      judul: 'Poin Prestasi Ditambahkan',
      pesan: `Prestasi "${data.namaLomba}" (+${data.poin} poin) telah dicatat. Poin ini mengurangi poin pelanggaran aktif Anda.`,
      kategori: 'Prestasi',
    })
  }

  function addKonseling(data: Omit<SesiKonseling, 'id'>) {
    const id = `ks${Date.now()}`
    konseling.value.unshift({ ...data, id })
    addNotifikasi({
      userId: 'u4',
      judul: 'Sesi Konseling Terjadwal',
      pesan: `Sesi konseling ${data.jenis} dijadwalkan pada ${data.tanggal} pukul ${data.waktu}. Topik: ${data.topik}.`,
      kategori: 'Konseling',
    })
  }

  function updateKonselingStatus(id: string, status: SesiKonseling['status']) {
    const k = konseling.value.find(x => x.id === id)
    if (k) k.status = status
  }

  function updateKonselingCatatan(id: string, catatan: string) {
    const k = konseling.value.find(x => x.id === id)
    if (k) k.catatan = catatan
  }

  function addPengumuman(data: Omit<Pengumuman, 'id'>) {
    const id = `pg${Date.now()}`
    pengumuman.value.unshift({ ...data, id })
    addNotifikasi({
      userId: 'u4',
      judul: 'Pengumuman Baru: ' + data.judul,
      pesan: data.isi,
      kategori: 'Pengumuman',
    })
  }

  function addLomba(data: Omit<Lomba, 'id'>) {
    const id = `lb${Date.now()}`
    lomba.value.unshift({ ...data, id })
  }

  function addNotifikasi(data: Omit<Notifikasi, 'id' | 'tanggal' | 'dibaca'>) {
    const id = `n${Date.now()}`
    notifikasi.value.unshift({
      ...data,
      id,
      tanggal: new Date().toISOString(),
      dibaca: false,
    })
  }

  function markNotifikasiRead(id: string) {
    const n = notifikasi.value.find(x => x.id === id)
    if (n) n.dibaca = true
  }

  function markAllNotifikasiRead(userId: string) {
    notifikasi.value.forEach(n => {
      if (n.userId === userId) n.dibaca = true
    })
  }

  function getNotifikasiForUser(userId: string) {
    return notifikasi.value.filter(n => n.userId === userId)
  }

  function getUnreadCount(userId: string) {
    return notifikasi.value.filter(n => n.userId === userId && !n.dibaca).length
  }

  function getSiswaById(id: string) {
    return siswa.value.find(s => s.id === id)
  }

  function getKelasById(id: string) {
    return kelas.value.find(k => k.id === id)
  }

  function updateAturanSanksi(id: string, data: Partial<AturanSanksi>) {
    const s = sanksi.value.find(x => x.id === id)
    if (s) Object.assign(s, data)
  }

  function addAturanSanksi(data: Omit<AturanSanksi, 'id'>) {
    const id = `sk${Date.now()}`
    sanksi.value.push({ ...data, id })
    sanksi.value.sort((a, b) => a.thresholdMin - b.thresholdMin)
  }

  function deleteAturanSanksi(id: string) {
    sanksi.value = sanksi.value.filter(s => s.id !== id)
  }

  function updateAturanPelanggaran(id: string, data: Partial<AturanPelanggaran>) {
    const a = aturan.value.find(x => x.id === id)
    if (a) Object.assign(a, data)
  }

  function addAturanPelanggaran(data: Omit<AturanPelanggaran, 'id'>) {
    const id = `a${Date.now()}`
    aturan.value.push({ ...data, id })
  }

  function deleteAturanPelanggaran(id: string) {
    aturan.value = aturan.value.filter(a => a.id !== id)
  }

  // Tindak Lanjut CRUD
  function addTindakLanjut(data: Omit<TindakLanjut, 'id'>) {
    const id = `tl${Date.now()}`
    tindakLanjut.value.unshift({ ...data, id })
    addNotifikasi({
      userId: 'u4',
      judul: 'Rekomendasi Tindak Lanjut Baru',
      pesan: `Rekomendasi "${data.rekomendasiSanksi}" (${data.kodeRule}) telah dibuat untuk ${data.siswaNama}. Status: ${data.status}.`,
      kategori: 'Sanksi',
    })
  }

  function updateTindakLanjut(id: string, data: Partial<TindakLanjut>) {
    const tl = tindakLanjut.value.find(x => x.id === id)
    if (tl) Object.assign(tl, data)
  }

  function deleteTindakLanjut(id: string) {
    tindakLanjut.value = tindakLanjut.value.filter(t => t.id !== id)
  }

  function getTindakLanjutBySiswa(siswaId: string) {
    return tindakLanjut.value.filter(t => t.siswaId === siswaId)
  }

  // User CRUD
  function addUser(data: Omit<User, 'id'>) {
    const id = `u${Date.now()}`
    users.value.push({ ...data, id })
  }

  function updateUser(id: string, data: Partial<User>) {
    const u = users.value.find(x => x.id === id)
    if (u) Object.assign(u, data)
  }

  function deleteUser(id: string) {
    users.value = users.value.filter(u => u.id !== id)
  }

  return {
    siswa, kelas, users, aturan, sanksi, pelanggaran, prestasi, konseling,
    kampus, lowongan, pengumuman, lomba, absensi, nilaiAkademik, notifikasi,
    tindakLanjut,
    totalSiswaAktif, totalKasusSelesai, totalPoinPrestasi, totalPelanggaranBulan,
    recomputeSiswa, addPelanggaran, addPrestasi, addKonseling,
    updateKonselingStatus, updateKonselingCatatan, addPengumuman, addLomba,
    addNotifikasi, markNotifikasiRead, markAllNotifikasiRead,
    getNotifikasiForUser, getUnreadCount, getSiswaById, getKelasById,
    updateAturanSanksi, addAturanSanksi, deleteAturanSanksi,
    updateAturanPelanggaran, addAturanPelanggaran, deleteAturanPelanggaran,
    addTindakLanjut, updateTindakLanjut, deleteTindakLanjut, getTindakLanjutBySiswa,
    addUser, updateUser, deleteUser,
  }
})
