<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import BaseModal from '../../components/BaseModal.vue'
import type { JenisKonseling, StatusKonseling } from '../../types'

const data = useDataStore()
const auth = useAuthStore()

const showAdd = ref(false)
const showDetail = ref<string | null>(null)
const filterJenis = ref('')
const filterStatus = ref('')

const form = ref({
  siswaId: '',
  jenis: 'Personal' as JenisKonseling,
  topik: '',
  tanggal: new Date().toISOString().slice(0, 10),
  waktu: '09:00',
  catatan: '',
  privat: true,
})

const filteredKonseling = computed(() => {
  return data.konseling.filter(k => {
    const matchJenis = !filterJenis.value || k.jenis === filterJenis.value
    const matchStatus = !filterStatus.value || k.status === filterStatus.value
    return matchJenis && matchStatus
  })
})

const detailKonseling = computed(() => data.konseling.find(k => k.id === showDetail.value))
const editingCatatan = ref('')

function openDetail(id: string) {
  const k = data.konseling.find(x => x.id === id)
  if (k) editingCatatan.value = k.catatan
  showDetail.value = id
}

function saveCatatan() {
  if (showDetail.value) {
    data.updateKonselingCatatan(showDetail.value, editingCatatan.value)
  }
}

function submitKonseling() {
  if (!form.value.siswaId || !form.value.topik) return
  const siswa = data.getSiswaById(form.value.siswaId)
  if (!siswa) return
  const kelas = data.getKelasById(siswa.kelasId)
  data.addKonseling({
    siswaId: siswa.id,
    siswaNama: siswa.nama,
    kelasNama: kelas?.nama || '',
    jenis: form.value.jenis,
    topik: form.value.topik,
    tanggal: form.value.tanggal,
    waktu: form.value.waktu,
    status: 'Terjadwal',
    catatan: form.value.catatan,
    konselor: auth.currentUser?.name || 'Guru BK',
    privat: form.value.privat,
  })
  showAdd.value = false
  form.value = { siswaId: '', jenis: 'Personal', topik: '', tanggal: new Date().toISOString().slice(0, 10), waktu: '09:00', catatan: '', privat: true }
}

const statusColor: Record<string, string> = {
  Terjadwal: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const jenisColor: Record<string, string> = {
  Personal: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Karir: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Akademik: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Sosial: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Log Pembinaan & Konseling</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola sesi konseling personal, akademik, dan karir siswa dengan dokumentasi yang aman.</p>
      </div>
      <button @click="showAdd = true" class="btn-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Jadwalkan Sesi Baru
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select v-model="filterJenis" class="input">
          <option value="">Semua Jenis Konseling</option>
          <option>Personal</option>
          <option>Karir</option>
          <option>Akademik</option>
          <option>Sosial</option>
        </select>
        <select v-model="filterStatus" class="input">
          <option value="">Semua Status</option>
          <option>Terjadwal</option>
          <option>Dalam Proses</option>
          <option>Selesai</option>
          <option>Dibatalkan</option>
        </select>
      </div>
    </div>

    <!-- Konseling list -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div v-for="k in filteredKonseling" :key="k.id" class="card p-5 transition hover:shadow-card">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="badge" :class="jenisColor[k.jenis]">{{ k.jenis }}</span>
            <span class="badge" :class="statusColor[k.status]">{{ k.status }}</span>
            <span v-if="k.privat" class="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75v4.5zm0 0a3 3 0 013 3v6a3 3 0 01-3 3h-9a3 3 0 01-3-3v-6a3 3 0 013-3m9 0V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v3.75m9 0H7.5" /></svg>
              Privat
            </span>
          </div>
          <span class="text-xs text-slate-400">{{ k.tanggal }} · {{ k.waktu }}</span>
        </div>
        <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ k.siswaNama }}</h3>
        <p class="text-xs text-slate-400">{{ k.kelasNama }}</p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ k.topik }}</p>
        <p v-if="k.catatan" class="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500 dark:bg-slate-700/40 dark:text-slate-400 line-clamp-2">{{ k.catatan }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <p class="text-xs text-slate-400">Konselor: {{ k.konselor }}</p>
          <button @click="openDetail(k.id)" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Kelola Sesi</button>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <BaseModal :show="showAdd" @close="showAdd = false" title="Jadwalkan Sesi Konseling" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Siswa</label>
          <select v-model="form.siswaId" class="input">
            <option value="">Pilih siswa...</option>
            <option v-for="s in data.siswa" :key="s.id" :value="s.id">{{ s.nama }} - {{ data.getKelasById(s.kelasId)?.nama }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Jenis Konseling</label>
            <select v-model="form.jenis" class="input">
              <option>Personal</option>
              <option>Karir</option>
              <option>Akademik</option>
              <option>Sosial</option>
            </select>
          </div>
          <div>
            <label class="label">Privat?</label>
            <select v-model="form.privat" class="input">
              <option :value="true">Ya - Data Sensitif</option>
              <option :value="false">Tidak - Dapat Dibagikan</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">Topik / Permasalahan</label>
          <input v-model="form.topik" type="text" class="input" placeholder="cth: Kesulitan fokus belajar & tekanan orang tua" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Tanggal</label>
            <input v-model="form.tanggal" type="date" class="input" />
          </div>
          <div>
            <label class="label">Waktu</label>
            <input v-model="form.waktu" type="time" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Catatan Awal (Opsional)</label>
          <textarea v-model="form.catatan" class="input" rows="3" placeholder="Catatan awal sesi..."></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAdd = false" class="btn-ghost">Batal</button>
          <button @click="submitKonseling" :disabled="!form.siswaId || !form.topik" class="btn-primary">Jadwalkan Sesi</button>
        </div>
      </div>
    </BaseModal>

    <!-- Detail Modal -->
    <BaseModal :show="!!showDetail" @close="showDetail = null" title="Kelola Sesi Konseling" size="lg">
      <div v-if="detailKonseling" class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="badge" :class="jenisColor[detailKonseling.jenis]">{{ detailKonseling.jenis }}</span>
          <span class="badge" :class="statusColor[detailKonseling.status]">{{ detailKonseling.status }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p class="text-xs text-slate-400">Siswa</p>
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ detailKonseling.siswaNama }}</p>
            <p class="text-xs text-slate-400">{{ detailKonseling.kelasNama }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p class="text-xs text-slate-400">Jadwal</p>
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ detailKonseling.tanggal }}</p>
            <p class="text-xs text-slate-400">Pukul {{ detailKonseling.waktu }} WIB</p>
          </div>
        </div>
        <div>
          <p class="label">Topik</p>
          <p class="text-sm text-slate-700 dark:text-slate-200">{{ detailKonseling.topik }}</p>
        </div>
        <div>
          <label class="label">Catatan Perkembangan Kasus</label>
          <textarea v-model="editingCatatan" class="input" rows="5" placeholder="Dokumentasikan perkembangan kasus, observasi, dan tindak lanjut..."></textarea>
        </div>
        <div>
          <label class="label">Ubah Status Sesi</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="st in ['Terjadwal','Dalam Proses','Selesai','Dibatalkan'] as StatusKonseling[]"
              :key="st"
              @click="data.updateKonselingStatus(detailKonseling.id, st); detailKonseling.status = st"
              class="btn text-xs"
              :class="detailKonseling.status === st ? 'btn-primary' : 'btn-outline'"
            >{{ st }}</button>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showDetail = null" class="btn-ghost">Tutup</button>
          <button @click="saveCatatan" class="btn-primary">Simpan Catatan</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
