<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import { getRekomendasiSanksi } from '../../data/mockData'
import BaseModal from '../../components/BaseModal.vue'
import type { AturanSanksi } from '../../types'

const data = useDataStore()
const auth = useAuthStore()

const showAdd = ref(false)
const searchQuery = ref('')
const filterKelas = ref('')
const filterStatus = ref('')

const filteredSiswa = computed(() => {
  return data.siswa.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || s.nis.includes(searchQuery.value)
    const matchKelas = !filterKelas.value || s.kelasId === filterKelas.value
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    return matchSearch && matchKelas && matchStatus
  })
})

// Add form
const form = ref({
  siswaId: '',
  aturanId: '',
  catatan: '',
  tanggal: new Date().toISOString().slice(0, 10),
})

const selectedSiswa = computed(() => data.siswa.find(s => s.id === form.value.siswaId))
const selectedAturan = computed(() => data.aturan.find(a => a.id === form.value.aturanId))
const previewRek = computed<AturanSanksi | null>(() => {
  if (!selectedSiswa.value || !selectedAturan.value) return null
  const newPoin = selectedSiswa.value.poinAktif + selectedAturan.value.poin
  return getRekomendasiSanksi(newPoin)
})

const lastRek = ref<AturanSanksi | null>(null)
const showRekModal = ref(false)

function submitPelanggaran() {
  if (!form.value.siswaId || !form.value.aturanId) return
  const siswa = data.getSiswaById(form.value.siswaId)
  const aturan = data.aturan.find(a => a.id === form.value.aturanId)
  if (!siswa || !aturan) return
  const kelas = data.getKelasById(siswa.kelasId)

  const rek = data.addPelanggaran({
    siswaId: siswa.id,
    siswaNama: siswa.nama,
    kelasNama: kelas?.nama || '',
    aturanId: aturan.id,
    aturanNama: aturan.nama,
    poin: aturan.poin,
    tanggal: form.value.tanggal,
    catatan: form.value.catatan,
    dicatatOleh: auth.currentUser?.name || 'Guru BK',
  })

  lastRek.value = rek
  showRekModal.value = true
  showAdd.value = false
  form.value = { siswaId: '', aturanId: '', catatan: '', tanggal: new Date().toISOString().slice(0, 10) }
}

const statusColor: Record<string, string> = {
  Aktif: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Pembinaan: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'SP-1': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'SP-2': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  'SP-3': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Dikeluarkan: 'bg-red-900 text-red-200 dark:bg-red-900/40 dark:text-red-200',
}

const kategoriColor: Record<string, string> = {
  'Tata Tertib': 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  'Kedisiplinan': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'Akademik': 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Sosial': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'Lingkungan': 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
}

const recentPelanggaran = computed(() => [...data.pelanggaran].slice(0, 8))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Basis Data Pelanggaran</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Catat pelanggaran siswa dan sistem akan menghasilkan rekomendasi tindak lanjut otomatis.</p>
      </div>
      <button @click="showAdd = true" class="btn-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Catat Pelanggaran Baru
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input v-model="searchQuery" type="text" class="input" placeholder="Cari nama atau NIS siswa..." />
        <select v-model="filterKelas" class="input">
          <option value="">Semua Kelas</option>
          <option v-for="k in data.kelas" :key="k.id" :value="k.id">{{ k.nama }}</option>
        </select>
        <select v-model="filterStatus" class="input">
          <option value="">Semua Status</option>
          <option>Aktif</option>
          <option>Pembinaan</option>
          <option>SP-1</option>
          <option>SP-2</option>
          <option>SP-3</option>
        </select>
      </div>
    </div>

    <!-- Student table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
            <tr>
              <th class="table-th">Siswa</th>
              <th class="table-th">Kelas</th>
              <th class="table-th">Poin Pelanggaran</th>
              <th class="table-th">Poin Prestasi</th>
              <th class="table-th">Poin Aktif</th>
              <th class="table-th">Status</th>
              <th class="table-th">Rekomendasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-for="s in filteredSiswa" :key="s.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td class="table-td">
                <div class="flex items-center gap-3">
                  <img :src="s.avatar" :alt="s.nama" class="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p class="font-medium text-slate-800 dark:text-slate-100">{{ s.nama }}</p>
                    <p class="text-xs text-slate-400">{{ s.nis }}</p>
                  </div>
                </div>
              </td>
              <td class="table-td">{{ data.getKelasById(s.kelasId)?.nama }}</td>
              <td class="table-td"><span class="font-semibold text-red-600 dark:text-red-400">{{ s.poinPelanggaran }}</span></td>
              <td class="table-td"><span class="font-semibold text-brand-600 dark:text-brand-400">{{ s.poinPrestasi }}</span></td>
              <td class="table-td"><span class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ s.poinAktif }}</span></td>
              <td class="table-td"><span class="badge" :class="statusColor[s.status]">{{ s.status }}</span></td>
              <td class="table-td text-xs text-slate-500 dark:text-slate-400">{{ getRekomendasiSanksi(s.poinAktif).nama }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent violations -->
    <div class="card overflow-hidden">
      <div class="border-b border-slate-200 p-5 dark:border-slate-700">
        <h3 class="section-title">Pelanggaran Terbaru Tercatat</h3>
      </div>
      <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
        <div v-for="p in recentPelanggaran" :key="p.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge" :class="kategoriColor[data.aturan.find(a => a.id === p.aturanId)?.kategori || '']">{{ data.aturan.find(a => a.id === p.aturanId)?.kategori }}</span>
                <span v-if="data.aturan.find(a => a.id === p.aturanId)?.tingkat" class="badge" :class="data.aturan.find(a => a.id === p.aturanId)?.tingkat === 'Berat' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : data.aturan.find(a => a.id === p.aturanId)?.tingkat === 'Sedang' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'">{{ data.aturan.find(a => a.id === p.aturanId)?.tingkat }}</span>
                <span class="text-xs text-slate-400">{{ p.tanggal }}</span>
              </div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.siswaNama }} · {{ p.kelasNama }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ p.aturanNama }}</p>
              <p v-if="p.catatan" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ p.catatan }}</p>
            </div>
            <div class="text-right">
              <span class="font-display text-lg font-bold text-red-600 dark:text-red-400">+{{ p.poin }}</span>
              <p class="text-xs text-slate-400">dicatat oleh<br />{{ p.dicatatOleh }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <BaseModal :show="showAdd" @close="showAdd = false" title="Catat Pelanggaran Baru" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Siswa</label>
          <select v-model="form.siswaId" class="input">
            <option value="">Pilih siswa...</option>
            <option v-for="s in data.siswa" :key="s.id" :value="s.id">{{ s.nama }} - {{ data.getKelasById(s.kelasId)?.nama }} ({{ s.nis }})</option>
          </select>
        </div>
        <div v-if="selectedSiswa" class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
          <p class="text-sm text-slate-600 dark:text-slate-300">Poin aktif saat ini: <span class="font-bold text-slate-800 dark:text-slate-100">{{ selectedSiswa.poinAktif }}</span></p>
        </div>
        <div>
          <label class="label">Jenis Pelanggaran</label>
          <select v-model="form.aturanId" class="input">
            <option value="">Pilih pelanggaran...</option>
            <optgroup v-for="kat in ['Tata Tertib','Kedisiplinan','Akademik','Sosial','Lingkungan']" :key="kat" :label="kat">
              <option v-for="a in data.aturan.filter(x => x.kategori === kat)" :key="a.id" :value="a.id">{{ a.nama }} ({{ a.poin }} poin - {{ a.tingkat }})</option>
            </optgroup>
          </select>
        </div>
        <div v-if="selectedAturan" class="rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
          <p class="text-sm text-amber-700 dark:text-amber-300">{{ selectedAturan.deskripsi }}</p>
          <p class="mt-1 text-sm font-semibold text-amber-800 dark:text-amber-200">Poin yang ditambahkan: +{{ selectedAturan.poin }}</p>
        </div>
        <div>
          <label class="label">Tanggal Kejadian</label>
          <input v-model="form.tanggal" type="date" class="input" />
        </div>
        <div>
          <label class="label">Catatan / Keterangan</label>
          <textarea v-model="form.catatan" class="input" rows="3" placeholder="Deskripsikan kejadian..."></textarea>
        </div>

        <!-- Preview recommendation -->
        <div v-if="previewRek" class="rounded-xl border-2 border-brand-200 bg-brand-50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 11.715l.18.566.566.18-.566.18-.18.566-.18-.566-.566-.18.566-.18.18-.566z" /></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-brand-700 dark:text-brand-300">Rekomendasi Tindak Lanjut Otomatis</p>
              <p class="mt-1 text-sm text-brand-600 dark:text-brand-400">{{ previewRek.nama }}: {{ previewRek.tindakan }}</p>
              <p class="mt-1 text-xs text-brand-500 dark:text-brand-400/70">Berdasarkan akumulasi poin setelah pelanggaran ini dicatat.</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAdd = false" class="btn-ghost">Batal</button>
          <button @click="submitPelanggaran" :disabled="!form.siswaId || !form.aturanId" class="btn-primary">Catat & Hasilkan Rekomendasi</button>
        </div>
      </div>
    </BaseModal>

    <!-- Recommendation result modal -->
    <BaseModal :show="showRekModal" @close="showRekModal = false" title="Rekomendasi Tindak Lanjut Otomatis" size="md">
      <div v-if="lastRek" class="text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 class="font-display text-xl font-bold text-slate-800 dark:text-slate-100">{{ lastRek.nama }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ lastRek.tindakan }}</p>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">{{ lastRek.deskripsi }}</p>
        <p class="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
          Notifikasi otomatis telah dikirim ke panel siswa terkait.
        </p>
        <button @click="showRekModal = false" class="btn-primary mt-6 w-full">Selesai</button>
      </div>
    </BaseModal>
  </div>
</template>
