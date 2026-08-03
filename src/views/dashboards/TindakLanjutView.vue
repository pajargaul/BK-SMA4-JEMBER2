<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import BaseModal from '../../components/BaseModal.vue'
import type { TindakLanjut, StatusTindakLanjut } from '../../types'

const data = useDataStore()

const searchQuery = ref('')
const filterStatus = ref('')
const showDetailModal = ref(false)
const selectedTlId = ref<string | null>(null)

const editForm = ref({
  status: 'Direkomendasikan' as StatusTindakLanjut,
  catatanPembinaan: '',
  tanggalPelaksanaan: '',
})

const filteredTl = computed(() => {
  return data.tindakLanjut.filter(t => {
    const matchSearch = t.siswaNama.toLowerCase().includes(searchQuery.value.toLowerCase()) || t.kodeRule.toLowerCase().includes(searchQuery.value.toLowerCase()) || t.rekomendasiSanksi.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !filterStatus.value || t.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const selectedTl = computed(() => data.tindakLanjut.find(t => t.id === selectedTlId.value))

function openDetail(tl: TindakLanjut) {
  selectedTlId.value = tl.id
  editForm.value = {
    status: tl.status,
    catatanPembinaan: tl.catatanPembinaan,
    tanggalPelaksanaan: tl.tanggalPelaksanaan,
  }
  showDetailModal.value = true
}

function saveTindakLanjut() {
  if (!selectedTlId.value) return
  data.updateTindakLanjut(selectedTlId.value, {
    status: editForm.value.status,
    catatanPembinaan: editForm.value.catatanPembinaan,
    tanggalPelaksanaan: editForm.value.tanggalPelaksanaan,
  })
  showDetailModal.value = false
}

const statusColor: Record<string, string> = {
  Direkomendasikan: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const statusList: StatusTindakLanjut[] = ['Direkomendasikan', 'Dalam Proses', 'Selesai', 'Dibatalkan']

const stats = computed(() => [
  { label: 'Total Tindak Lanjut', value: data.tindakLanjut.length, color: 'from-navy-500 to-navy-700', icon: 'list' },
  { label: 'Direkomendasikan', value: data.tindakLanjut.filter(t => t.status === 'Direkomendasikan').length, color: 'from-navy-500 to-navy-700', icon: 'clock' },
  { label: 'Dalam Proses', value: data.tindakLanjut.filter(t => t.status === 'Dalam Proses').length, color: 'from-amber-400 to-amber-600', icon: 'refresh' },
  { label: 'Selesai', value: data.tindakLanjut.filter(t => t.status === 'Selesai').length, color: 'from-brand-500 to-brand-700', icon: 'check' },
])

const iconPaths: Record<string, string> = {
  list: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Kelola Tindak Lanjut</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Daftar kasus pelanggaran yang telah memiliki rekomendasi sistem beserta status pelaksanaan dan catatan pembinaan.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ s.label }}</p>
            <p class="mt-1 font-display text-2xl font-bold text-slate-800 dark:text-slate-100">{{ s.value }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white" :class="s.color">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[s.icon]" /></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input v-model="searchQuery" type="text" class="input" placeholder="Cari nama siswa, kode rule, atau sanksi..." />
        <select v-model="filterStatus" class="input">
          <option value="">Semua Status</option>
          <option>Direkomendasikan</option>
          <option>Dalam Proses</option>
          <option>Selesai</option>
          <option>Dibatalkan</option>
        </select>
      </div>
    </div>

    <!-- Tindak Lanjut list -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
            <tr>
              <th class="table-th">Siswa</th>
              <th class="table-th">Pelanggaran</th>
              <th class="table-th">Kode Rule</th>
              <th class="table-th">Rekomendasi</th>
              <th class="table-th">Poin Saat Itu</th>
              <th class="table-th">Status</th>
              <th class="table-th">Tanggal</th>
              <th class="table-th">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-for="t in filteredTl" :key="t.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td class="table-td">
                <p class="font-medium text-slate-800 dark:text-slate-100">{{ t.siswaNama }}</p>
                <p class="text-xs text-slate-400">{{ t.kelasNama }}</p>
              </td>
              <td class="table-td text-sm text-slate-600 dark:text-slate-300">{{ t.pelanggaranNama }}</td>
              <td class="table-td"><span class="font-mono font-semibold text-navy-700 dark:text-navy-300">{{ t.kodeRule }}</span></td>
              <td class="table-td text-sm font-medium text-slate-700 dark:text-slate-200">{{ t.rekomendasiSanksi }}</td>
              <td class="table-td"><span class="font-bold text-red-600 dark:text-red-400">{{ t.poinSaatItu }}</span></td>
              <td class="table-td"><span class="badge" :class="statusColor[t.status]">{{ t.status }}</span></td>
              <td class="table-td text-xs text-slate-400">{{ t.tanggalRekomendasi }}</td>
              <td class="table-td">
                <button @click="openDetail(t)" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Kelola</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredTl.length === 0" class="p-8 text-center text-sm text-slate-400">Tidak ada data tindak lanjut yang cocok.</div>
    </div>

    <!-- Detail / Edit Modal -->
    <BaseModal :show="showDetailModal" @close="showDetailModal = false" title="Kelola Tindak Lanjut" size="lg">
      <div v-if="selectedTl" class="space-y-4">
        <!-- Info header -->
        <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ selectedTl.siswaNama }}</p>
              <p class="text-xs text-slate-400">{{ selectedTl.kelasNama }}</p>
            </div>
            <span class="font-mono text-sm font-semibold text-navy-700 dark:text-navy-300">{{ selectedTl.kodeRule }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <p class="text-xs text-slate-400">Pelanggaran</p>
              <p class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTl.pelanggaranNama }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Poin Saat Itu</p>
              <p class="font-bold text-red-600 dark:text-red-400">{{ selectedTl.poinSaatItu }} poin</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Rekomendasi Sanksi</p>
              <p class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTl.rekomendasiSanksi }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Tanggal Rekomendasi</p>
              <p class="font-medium text-slate-700 dark:text-slate-200">{{ selectedTl.tanggalRekomendasi }}</p>
            </div>
          </div>
        </div>

        <!-- Status update -->
        <div>
          <label class="label">Status Pelaksanaan</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="st in statusList"
              :key="st"
              @click="editForm.status = st"
              class="btn text-xs"
              :class="editForm.status === st ? 'btn-primary' : 'btn-outline'"
            >{{ st }}</button>
          </div>
        </div>

        <!-- Tanggal pelaksanaan -->
        <div>
          <label class="label">Tanggal Pelaksanaan</label>
          <input v-model="editForm.tanggalPelaksanaan" type="date" class="input" />
        </div>

        <!-- Catatan pembinaan -->
        <div>
          <label class="label">Catatan Pembinaan</label>
          <textarea v-model="editForm.catatanPembinaan" class="input" rows="5" placeholder="Dokumentasikan proses pembinaan, progres, dan hasil tindak lanjut..."></textarea>
        </div>

        <!-- Existing info -->
        <div v-if="selectedTl.ditanganiOleh" class="text-xs text-slate-400">
          Ditangani oleh: {{ selectedTl.ditanganiOleh }}
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showDetailModal = false" class="btn-ghost">Batal</button>
          <button @click="saveTindakLanjut" class="btn-primary">Simpan Pembaruan</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
