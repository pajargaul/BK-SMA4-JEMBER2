<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import BaseModal from '../../components/BaseModal.vue'
import type { User, Role, AturanSanksi, AturanPelanggaran, KategoriPelanggaran, TingkatKeparahan } from '../../types'

const data = useDataStore()
const auth = useAuthStore()

const activeTab = ref<'rules' | 'backup' | 'users'>('rules')

// ==================== RULES TAB ====================

// --- Sanksi rules (Forward Chaining rule base) ---
const showSanksiModal = ref(false)
const editingSanksiId = ref<string | null>(null)
const sanksiToDelete = ref<AturanSanksi | null>(null)
const showDeleteSanksiModal = ref(false)

const sanksiForm = ref({
  kodeRule: '',
  nama: '',
  thresholdMin: 0,
  thresholdMax: 0,
  tindakan: '',
  deskripsi: '',
})

function resetSanksiForm() {
  sanksiForm.value = { kodeRule: '', nama: '', thresholdMin: 0, thresholdMax: 0, tindakan: '', deskripsi: '' }
  editingSanksiId.value = null
}

function openAddSanksi() {
  resetSanksiForm()
  const nextNum = data.sanksi.length + 1
  sanksiForm.value.kodeRule = `F-${String(nextNum).padStart(2, '0')}`
  showSanksiModal.value = true
}

function openEditSanksi(s: AturanSanksi) {
  editingSanksiId.value = s.id
  sanksiForm.value = {
    kodeRule: s.kodeRule,
    nama: s.nama,
    thresholdMin: s.thresholdMin,
    thresholdMax: s.thresholdMax,
    tindakan: s.tindakan,
    deskripsi: s.deskripsi,
  }
  showSanksiModal.value = true
}

function saveSanksi() {
  if (!sanksiForm.value.kodeRule || !sanksiForm.value.nama) return
  if (editingSanksiId.value) {
    data.updateAturanSanksi(editingSanksiId.value, { ...sanksiForm.value })
  } else {
    data.addAturanSanksi({ ...sanksiForm.value })
  }
  showSanksiModal.value = false
  resetSanksiForm()
}

function confirmDeleteSanksi(s: AturanSanksi) {
  sanksiToDelete.value = s
  showDeleteSanksiModal.value = true
}

function executeDeleteSanksi() {
  if (sanksiToDelete.value) {
    data.deleteAturanSanksi(sanksiToDelete.value.id)
    showDeleteSanksiModal.value = false
    sanksiToDelete.value = null
  }
}

// --- Pelanggaran rules (kategori & tingkat) ---
const showAturanModal = ref(false)
const editingAturanId = ref<string | null>(null)
const aturanToDelete = ref<AturanPelanggaran | null>(null)
const showDeleteAturanModal = ref(false)
const filterKategori = ref('')
const filterTingkat = ref('')

const aturanForm = ref({
  nama: '',
  kategori: 'Kedisiplinan' as KategoriPelanggaran,
  tingkat: 'Ringan' as TingkatKeparahan,
  poin: 5,
  deskripsi: '',
})

function resetAturanForm() {
  aturanForm.value = { nama: '', kategori: 'Kedisiplinan', tingkat: 'Ringan', poin: 5, deskripsi: '' }
  editingAturanId.value = null
}

function openAddAturan() {
  resetAturanForm()
  showAturanModal.value = true
}

function openEditAturan(a: AturanPelanggaran) {
  editingAturanId.value = a.id
  aturanForm.value = {
    nama: a.nama,
    kategori: a.kategori,
    tingkat: a.tingkat,
    poin: a.poin,
    deskripsi: a.deskripsi,
  }
  showAturanModal.value = true
}

function saveAturan() {
  if (!aturanForm.value.nama) return
  if (editingAturanId.value) {
    data.updateAturanPelanggaran(editingAturanId.value, { ...aturanForm.value })
  } else {
    data.addAturanPelanggaran({ ...aturanForm.value })
  }
  showAturanModal.value = false
  resetAturanForm()
}

function confirmDeleteAturan(a: AturanPelanggaran) {
  aturanToDelete.value = a
  showDeleteAturanModal.value = true
}

function executeDeleteAturan() {
  if (aturanToDelete.value) {
    data.deleteAturanPelanggaran(aturanToDelete.value.id)
    showDeleteAturanModal.value = false
    aturanToDelete.value = null
  }
}

const kategoriList: KategoriPelanggaran[] = ['Tata Tertib', 'Kedisiplinan', 'Akademik', 'Sosial', 'Lingkungan']
const tingkatList: TingkatKeparahan[] = ['Ringan', 'Sedang', 'Berat']

const kategoriColor: Record<string, string> = {
  'Tata Tertib': 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  'Kedisiplinan': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Akademik': 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Sosial': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'Lingkungan': 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
}

const tingkatColor: Record<string, string> = {
  'Ringan': 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Sedang': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Berat': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
}

const filteredAturan = computed(() => {
  return data.aturan.filter(a => {
    const matchKategori = !filterKategori.value || a.kategori === filterKategori.value
    const matchTingkat = !filterTingkat.value || a.tingkat === filterTingkat.value
    return matchKategori && matchTingkat
  })
})

// Category stats
const kategoriStats = computed(() => {
  return kategoriList.map(k => ({
    nama: k,
    jumlah: data.aturan.filter(a => a.kategori === k).length,
    ringan: data.aturan.filter(a => a.kategori === k && a.tingkat === 'Ringan').length,
    sedang: data.aturan.filter(a => a.kategori === k && a.tingkat === 'Sedang').length,
    berat: data.aturan.filter(a => a.kategori === k && a.tingkat === 'Berat').length,
  }))
})

// ==================== BACKUP TAB ====================

const tables = [
  { name: 'siswa', rows: 487, size: '2.4 MB', status: 'Aktif' },
  { name: 'kelas', rows: 14, size: '0.1 MB', status: 'Aktif' },
  { name: 'pelanggaran', rows: 156, size: '1.2 MB', status: 'Aktif' },
  { name: 'prestasi', rows: 89, size: '0.8 MB', status: 'Aktif' },
  { name: 'konseling', rows: 234, size: '1.5 MB', status: 'Aktif' },
  { name: 'kampus', rows: 6, size: '0.05 MB', status: 'Aktif' },
  { name: 'lowongan_kerja', rows: 12, size: '0.1 MB', status: 'Aktif' },
  { name: 'pengumuman', rows: 45, size: '0.3 MB', status: 'Aktif' },
  { name: 'lomba', rows: 8, size: '0.05 MB', status: 'Aktif' },
  { name: 'notifikasi', rows: 312, size: '0.9 MB', status: 'Aktif' },
]

const backupMsg = ref('')
const optimizing = ref(false)

function exportBackup(format: string) {
  backupMsg.value = `Backup ${format.toUpperCase()} berhasil diunduh (${new Date().toLocaleString('id-ID')}).`
  setTimeout(() => backupMsg.value = '', 4000)
}

function optimizeTables() {
  optimizing.value = true
  setTimeout(() => {
    optimizing.value = false
    backupMsg.value = 'Optimasi basis data selesai. Storage dikompresi 12%.'
    setTimeout(() => backupMsg.value = '', 4000)
  }, 1500)
}

// ==================== USERS TAB ====================

const showUserModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const editingUserId = ref<string | null>(null)
const searchQuery = ref('')
const filterRole = ref('')

const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  guru_bk: 'Guru BK',
  kepala_sekolah: 'Kepala Sekolah',
  siswa: 'Siswa',
}

const roleColor: Record<Role, string> = {
  admin: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  guru_bk: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  kepala_sekolah: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  siswa: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
}

const defaultAvatar = 'https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=200'

const userForm = ref({
  name: '',
  role: 'siswa' as Role,
  nipNis: '',
  email: '',
  phone: '',
  avatar: defaultAvatar,
})

function resetUserForm() {
  userForm.value = { name: '', role: 'siswa', nipNis: '', email: '', phone: '', avatar: defaultAvatar }
  editingUserId.value = null
}

function openAddUser() {
  resetUserForm()
  showUserModal.value = true
}

function openEditUser(u: User) {
  editingUserId.value = u.id
  userForm.value = { name: u.name, role: u.role, nipNis: u.nipNis, email: u.email, phone: u.phone || '', avatar: u.avatar }
  showUserModal.value = true
}

function saveUser() {
  if (!userForm.value.name || !userForm.value.email) return
  if (editingUserId.value) {
    data.updateUser(editingUserId.value, { ...userForm.value })
  } else {
    data.addUser({ ...userForm.value })
  }
  showUserModal.value = false
  resetUserForm()
}

function confirmDeleteUser(u: User) {
  userToDelete.value = u
  showDeleteModal.value = true
}

function executeDeleteUser() {
  if (userToDelete.value) {
    data.deleteUser(userToDelete.value.id)
    showDeleteModal.value = false
    userToDelete.value = null
  }
}

const filteredUsers = computed(() => {
  return data.users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) || u.nipNis.includes(searchQuery.value)
    const matchRole = !filterRole.value || u.role === filterRole.value
    return matchSearch && matchRole
  })
})

const isSelf = (u: User) => auth.currentUser?.id === u.id
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Konfigurasi Sistem</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola kategori pelanggaran, aturan poin, basis data, dan pengguna sistem.</p>
    </div>

    <div class="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button @click="activeTab = 'rules'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'rules' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Kategori & Aturan Poin</button>
      <button @click="activeTab = 'backup'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'backup' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Basis Data & Backup</button>
      <button @click="activeTab = 'users'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'users' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Pengguna Sistem</button>
    </div>

    <!-- ==================== RULES TAB ==================== -->
    <div v-if="activeTab === 'rules'" class="space-y-6">
      <!-- Category overview cards -->
      <div>
        <h3 class="section-title mb-3">Ringkasan Kategori Pelanggaran</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div v-for="k in kategoriStats" :key="k.nama" class="card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="badge" :class="kategoriColor[k.nama]">{{ k.nama }}</span>
              <span class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ k.jumlah }}</span>
            </div>
            <div class="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span class="text-brand-600 dark:text-brand-400">R: {{ k.ringan }}</span>
              <span class="text-amber-600 dark:text-amber-400">S: {{ k.sedang }}</span>
              <span class="text-red-600 dark:text-red-400">B: {{ k.berat }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sanksi rules table (Forward Chaining rule base) -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <div>
            <h3 class="section-title">Tabel Aturan Rekomendasi Tindak Lanjut</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Sistem akan otomatis merekomendasikan sanksi berdasarkan rentang akumulasi poin aktif siswa.</p>
          </div>
          <button @click="openAddSanksi" class="btn-primary shrink-0">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Tambah Aturan
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
              <tr>
                <th class="table-th">Kode Rule</th>
                <th class="table-th">Nama Sanksi</th>
                <th class="table-th">Rentang Poin</th>
                <th class="table-th">Tindak Lanjut</th>
                <th class="table-th">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr v-for="s in data.sanksi" :key="s.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="table-td">
                  <span class="font-mono font-semibold text-navy-700 dark:text-navy-300">{{ s.kodeRule }}</span>
                </td>
                <td class="table-td font-medium text-slate-800 dark:text-slate-100">{{ s.nama }}</td>
                <td class="table-td">
                  <span class="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ s.thresholdMin }} - {{ s.thresholdMax }}</span>
                </td>
                <td class="table-td text-sm text-slate-600 dark:text-slate-300">{{ s.tindakan }}</td>
                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <button @click="openEditSanksi(s)" class="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-brand-500/10" title="Edit">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z M19.5 14.25v4.875a2.625 2.625 0 01-2.625 2.625H5.625a2.625 2.625 0 01-2.625-2.625V7.875A2.625 2.625 0 015.625 5.25H9.75" /></svg>
                    </button>
                    <button @click="confirmDeleteSanksi(s)" class="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10" title="Hapus">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pelanggaran rules table -->
      <div class="card overflow-hidden">
        <div class="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="section-title">Daftar Aturan Pelanggaran & Bobot Poin</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola setiap jenis pelanggaran, kategori, tingkat keparahan, dan bobot poin.</p>
          </div>
          <button @click="openAddAturan" class="btn-primary shrink-0">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Tambah Aturan
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 border-b border-slate-100 p-4 dark:border-slate-700/50">
          <select v-model="filterKategori" class="input max-w-xs">
            <option value="">Semua Kategori</option>
            <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
          </select>
          <select v-model="filterTingkat" class="input max-w-xs">
            <option value="">Semua Tingkat</option>
            <option>Ringan</option>
            <option>Sedang</option>
            <option>Berat</option>
          </select>
          <button v-if="filterKategori || filterTingkat" @click="filterKategori = ''; filterTingkat = ''" class="btn-ghost text-sm">Reset Filter</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
              <tr>
                <th class="table-th">Nama Pelanggaran</th>
                <th class="table-th">Kategori</th>
                <th class="table-th">Tingkat</th>
                <th class="table-th">Poin</th>
                <th class="table-th">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr v-for="a in filteredAturan" :key="a.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="table-td">
                  <p class="font-medium text-slate-800 dark:text-slate-100">{{ a.nama }}</p>
                  <p class="text-xs text-slate-400">{{ a.deskripsi }}</p>
                </td>
                <td class="table-td"><span class="badge" :class="kategoriColor[a.kategori]">{{ a.kategori }}</span></td>
                <td class="table-td"><span class="badge" :class="tingkatColor[a.tingkat]">{{ a.tingkat }}</span></td>
                <td class="table-td"><span class="font-bold text-red-600 dark:text-red-400">{{ a.poin }}</span></td>
                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <button @click="openEditAturan(a)" class="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-brand-500/10" title="Edit">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z M19.5 14.25v4.875a2.625 2.625 0 01-2.625 2.625H5.625a2.625 2.625 0 01-2.625-2.625V7.875A2.625 2.625 0 015.625 5.25H9.75" /></svg>
                    </button>
                    <button @click="confirmDeleteAturan(a)" class="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10" title="Hapus">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredAturan.length === 0" class="p-8 text-center text-sm text-slate-400">Tidak ada aturan yang cocok dengan filter.</div>
      </div>
    </div>

    <!-- ==================== BACKUP TAB ==================== -->
    <div v-if="activeTab === 'backup'" class="space-y-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="stat-card">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tabel Aktif</p>
          <p class="mt-2 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">{{ tables.length }}</p>
        </div>
        <div class="stat-card">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Baris Data</p>
          <p class="mt-2 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">{{ tables.reduce((s, t) => s + t.rows, 0).toLocaleString('id-ID') }}</p>
        </div>
        <div class="stat-card">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Ukuran Storage</p>
          <p class="mt-2 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">7.4 MB</p>
        </div>
      </div>

      <div class="card p-5">
        <h3 class="section-title mb-4">Operasi Backup & Ekspor</h3>
        <div class="flex flex-wrap gap-3">
          <button @click="exportBackup('sql')" class="btn-secondary">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Export Backup SQL
          </button>
          <button @click="exportBackup('json')" class="btn-outline">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Export Backup JSON
          </button>
          <button @click="optimizeTables" :disabled="optimizing" class="btn-primary">
            <svg v-if="!optimizing" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
            {{ optimizing ? 'Mengoptimasi...' : 'Optimasi Tabel' }}
          </button>
        </div>
        <p v-if="backupMsg" class="mt-3 text-sm font-medium text-brand-600 dark:text-brand-400">{{ backupMsg }}</p>
      </div>

      <div class="card overflow-hidden">
        <div class="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Status Tabel Basis Data</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
              <tr>
                <th class="table-th">Nama Tabel</th>
                <th class="table-th">Jumlah Baris</th>
                <th class="table-th">Ukuran</th>
                <th class="table-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr v-for="t in tables" :key="t.name" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="table-td font-mono text-sm">{{ t.name }}</td>
                <td class="table-td">{{ t.rows.toLocaleString('id-ID') }}</td>
                <td class="table-td">{{ t.size }}</td>
                <td class="table-td"><span class="badge bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">{{ t.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================== USERS TAB ==================== -->
    <div v-if="activeTab === 'users'" class="space-y-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="section-title">Manajemen Pengguna Sistem</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Tambah, ubah, atau hapus data pengguna - Kepala Sekolah, Guru BK, Administrator, dan Siswa.</p>
        </div>
        <button @click="openAddUser" class="btn-primary">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah Pengguna
        </button>
      </div>

      <div class="card p-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input v-model="searchQuery" type="text" class="input" placeholder="Cari nama, email, atau NIP/NIS..." />
          <select v-model="filterRole" class="input">
            <option value="">Semua Peran</option>
            <option value="kepala_sekolah">Kepala Sekolah</option>
            <option value="guru_bk">Guru BK</option>
            <option value="admin">Administrator</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
              <tr>
                <th class="table-th">Pengguna</th>
                <th class="table-th">Peran</th>
                <th class="table-th">NIP / NIS</th>
                <th class="table-th">Email</th>
                <th class="table-th">Telepon</th>
                <th class="table-th">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="table-td">
                  <div class="flex items-center gap-3">
                    <img :src="u.avatar" :alt="u.name" class="h-9 w-9 rounded-full object-cover" />
                    <p class="font-medium text-slate-800 dark:text-slate-100">{{ u.name }}<span v-if="isSelf(u)" class="ml-1 text-xs text-brand-500">(Anda)</span></p>
                  </div>
                </td>
                <td class="table-td"><span class="badge" :class="roleColor[u.role]">{{ roleLabels[u.role] }}</span></td>
                <td class="table-td text-sm text-slate-500 dark:text-slate-400">{{ u.nipNis }}</td>
                <td class="table-td text-sm text-slate-500 dark:text-slate-400">{{ u.email }}</td>
                <td class="table-td text-sm text-slate-500 dark:text-slate-400">{{ u.phone || '-' }}</td>
                <td class="table-td">
                  <div class="flex items-center gap-2">
                    <button @click="openEditUser(u)" class="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-brand-500/10" title="Edit">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z M19.5 14.25v4.875a2.625 2.625 0 01-2.625 2.625H5.625a2.625 2.625 0 01-2.625-2.625V7.875A2.625 2.625 0 015.625 5.25H9.75" /></svg>
                    </button>
                    <button @click="confirmDeleteUser(u)" :disabled="isSelf(u)" class="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-red-500/10" title="Hapus">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredUsers.length === 0" class="p-8 text-center text-sm text-slate-400">Tidak ada pengguna yang cocok dengan pencarian.</div>
      </div>
    </div>

    <!-- ===== SAKSI MODAL ===== -->
    <BaseModal :show="showSanksiModal" @close="showSanksiModal = false" :title="editingSanksiId ? 'Edit Aturan Sanksi' : 'Tambah Aturan Sanksi Baru'" size="lg">
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="label">Kode Rule <span class="text-red-500">*</span></label>
            <input v-model="sanksiForm.kodeRule" type="text" class="input font-mono" placeholder="F-03" />
          </div>
          <div>
            <label class="label">Nama Sanksi <span class="text-red-500">*</span></label>
            <input v-model="sanksiForm.nama" type="text" class="input" placeholder="cth: Surat Peringatan 1 (SP-1)" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Rentang Poin Minimum</label>
            <input v-model="sanksiForm.thresholdMin" type="number" class="input" />
          </div>
          <div>
            <label class="label">Rentang Poin Maksimum</label>
            <input v-model="sanksiForm.thresholdMax" type="number" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Tindak Lanjut</label>
          <input v-model="sanksiForm.tindakan" type="text" class="input" placeholder="cth: Surat Peringatan + konseling wajib" />
        </div>
        <div>
          <label class="label">Deskripsi</label>
          <textarea v-model="sanksiForm.deskripsi" class="input" rows="3" placeholder="Penjelasan aturan sanksi..."></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showSanksiModal = false" class="btn-ghost">Batal</button>
          <button @click="saveSanksi" :disabled="!sanksiForm.kodeRule || !sanksiForm.nama" class="btn-primary">{{ editingSanksiId ? 'Simpan Perubahan' : 'Tambah Aturan' }}</button>
        </div>
      </div>
    </BaseModal>

    <!-- ===== DELETE SAKSI MODAL ===== -->
    <BaseModal :show="showDeleteSanksiModal" @close="showDeleteSanksiModal = false" title="Konfirmasi Hapus Aturan" size="sm">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Hapus aturan:</p>
        <p class="mt-1 font-display font-bold text-slate-800 dark:text-slate-100">{{ sanksiToDelete?.kodeRule }} - {{ sanksiToDelete?.nama }}</p>
        <p class="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Tindakan ini tidak dapat dibatalkan.</p>
        <div class="mt-5 flex gap-3">
          <button @click="showDeleteSanksiModal = false" class="btn-ghost flex-1">Batal</button>
          <button @click="executeDeleteSanksi" class="btn-danger flex-1">Hapus</button>
        </div>
      </div>
    </BaseModal>

    <!-- ===== ATURAN MODAL ===== -->
    <BaseModal :show="showAturanModal" @close="showAturanModal = false" :title="editingAturanId ? 'Edit Aturan Pelanggaran' : 'Tambah Aturan Pelanggaran Baru'" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Nama Pelanggaran <span class="text-red-500">*</span></label>
          <input v-model="aturanForm.nama" type="text" class="input" placeholder="cth: Terlambat masuk sekolah" />
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label class="label">Kategori</label>
            <select v-model="aturanForm.kategori" class="input">
              <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
          <div>
            <label class="label">Tingkat Keparahan</label>
            <select v-model="aturanForm.tingkat" class="input">
              <option v-for="t in tingkatList" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div>
            <label class="label">Bobot Poin</label>
            <input v-model="aturanForm.poin" type="number" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Deskripsi</label>
          <textarea v-model="aturanForm.deskripsi" class="input" rows="3" placeholder="Penjelasan aturan pelanggaran..."></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAturanModal = false" class="btn-ghost">Batal</button>
          <button @click="saveAturan" :disabled="!aturanForm.nama" class="btn-primary">{{ editingAturanId ? 'Simpan Perubahan' : 'Tambah Aturan' }}</button>
        </div>
      </div>
    </BaseModal>

    <!-- ===== DELETE ATURAN MODAL ===== -->
    <BaseModal :show="showDeleteAturanModal" @close="showDeleteAturanModal = false" title="Konfirmasi Hapus Aturan" size="sm">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Hapus aturan pelanggaran:</p>
        <p class="mt-1 font-display font-bold text-slate-800 dark:text-slate-100">{{ aturanToDelete?.nama }}</p>
        <p class="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Tindakan ini tidak dapat dibatalkan.</p>
        <div class="mt-5 flex gap-3">
          <button @click="showDeleteAturanModal = false" class="btn-ghost flex-1">Batal</button>
          <button @click="executeDeleteAturan" class="btn-danger flex-1">Hapus</button>
        </div>
      </div>
    </BaseModal>

    <!-- ===== USER MODAL ===== -->
    <BaseModal :show="showUserModal" @close="showUserModal = false" :title="editingUserId ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'" size="lg">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <img :src="userForm.avatar" :alt="userForm.name" class="h-16 w-16 rounded-2xl object-cover ring-2 ring-brand-500/20" />
          <div class="flex-1">
            <label class="label">URL Foto Profil</label>
            <input v-model="userForm.avatar" type="text" class="input" placeholder="https://..." />
          </div>
        </div>
        <div>
          <label class="label">Nama Lengkap <span class="text-red-500">*</span></label>
          <input v-model="userForm.name" type="text" class="input" placeholder="cth: Drs. Bambang Sutrisno, M.Pd." />
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="label">Peran <span class="text-red-500">*</span></label>
            <select v-model="userForm.role" class="input">
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="guru_bk">Guru BK / Konselor</option>
              <option value="admin">Administrator Sistem</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div>
            <label class="label">NIP / NIS</label>
            <input v-model="userForm.nipNis" type="text" class="input" placeholder="Nomor Induk Pegawai/Siswa" />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="label">Email <span class="text-red-500">*</span></label>
            <input v-model="userForm.email" type="email" class="input" placeholder="nama@sman4jember.sch.id" />
          </div>
          <div>
            <label class="label">Nomor Telepon</label>
            <input v-model="userForm.phone" type="text" class="input" placeholder="08xxxxxxxxxx" />
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showUserModal = false" class="btn-ghost">Batal</button>
          <button @click="saveUser" :disabled="!userForm.name || !userForm.email" class="btn-primary">{{ editingUserId ? 'Simpan Perubahan' : 'Tambah Pengguna' }}</button>
        </div>
      </div>
    </BaseModal>

    <!-- ===== DELETE USER MODAL ===== -->
    <BaseModal :show="showDeleteModal" @close="showDeleteModal = false" title="Konfirmasi Hapus Pengguna" size="sm">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Apakah Anda yakin ingin menghapus pengguna:</p>
        <p class="mt-1 font-display font-bold text-slate-800 dark:text-slate-100">{{ userToDelete?.name }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ userToDelete?.email }}</p>
        <p class="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Tindakan ini tidak dapat dibatalkan.</p>
        <div class="mt-5 flex gap-3">
          <button @click="showDeleteModal = false" class="btn-ghost flex-1">Batal</button>
          <button @click="executeDeleteUser" class="btn-danger flex-1">Hapus</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
