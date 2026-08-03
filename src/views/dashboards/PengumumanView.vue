<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import BaseModal from '../../components/BaseModal.vue'
import type { KategoriPengumuman } from '../../types'

const data = useDataStore()
const auth = useAuthStore()

const showAdd = ref(false)
const filterKategori = ref('')

const form = ref({
  judul: '',
  kategori: 'Umum' as KategoriPengumuman,
  isi: '',
  prioritas: 'Sedang' as 'Tinggi' | 'Sedang' | 'Rendah',
  pinned: false,
})

const canManage = computed(() => auth.role === 'admin' || auth.role === 'guru_bk' || auth.role === 'kepala_sekolah')

const filteredPengumuman = computed(() => {
  let list = [...data.pengumuman].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.tanggal.localeCompare(a.tanggal)
  })
  if (filterKategori.value) list = list.filter(p => p.kategori === filterKategori.value)
  return list
})

function submitPengumuman() {
  if (!form.value.judul || !form.value.isi) return
  data.addPengumuman({
    judul: form.value.judul,
    kategori: form.value.kategori,
    isi: form.value.isi,
    tanggal: new Date().toISOString().slice(0, 10),
    prioritas: form.value.prioritas,
    pinned: form.value.pinned,
  })
  showAdd.value = false
  form.value = { judul: '', kategori: 'Umum', isi: '', prioritas: 'Sedang', pinned: false }
}

const catColor: Record<string, string> = {
  Karir: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Universitas: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Lomba: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Umum: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Pengumuman: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
}

const prioritasColor: Record<string, string> = {
  Tinggi: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Sedang: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Rendah: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Papan Pengumuman</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Informasi terbaru seputar karir, pendaftaran perguruan tinggi, lomba, dan pengumuman sekolah.</p>
      </div>
      <button v-if="canManage" @click="showAdd = true" class="btn-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Buat Pengumuman
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button @click="filterKategori = ''" class="btn text-xs" :class="!filterKategori ? 'btn-primary' : 'btn-outline'">Semua</button>
      <button @click="filterKategori = 'Karir'" class="btn text-xs" :class="filterKategori === 'Karir' ? 'btn-primary' : 'btn-outline'">Karir</button>
      <button @click="filterKategori = 'Universitas'" class="btn text-xs" :class="filterKategori === 'Universitas' ? 'btn-primary' : 'btn-outline'">Universitas</button>
      <button @click="filterKategori = 'Lomba'" class="btn text-xs" :class="filterKategori === 'Lomba' ? 'btn-primary' : 'btn-outline'">Lomba</button>
      <button @click="filterKategori = 'Umum'" class="btn text-xs" :class="filterKategori === 'Umum' ? 'btn-primary' : 'btn-outline'">Umum</button>
    </div>

    <div class="space-y-4">
      <div v-for="p in filteredPengumuman" :key="p.id" class="card p-5 transition hover:shadow-card">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="badge" :class="catColor[p.kategori]">{{ p.kategori }}</span>
            <span class="badge" :class="prioritasColor[p.prioritas]">Prioritas {{ p.prioritas }}</span>
            <span v-if="p.pinned" class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 3v2h-1v6l2 3v2h-5v4l-1 1-1-1v-4H5v-2l2-3V5H6V3h10z" /></svg>
              Disematkan
            </span>
          </div>
          <span class="text-xs text-slate-400">{{ new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
        </div>
        <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ p.judul }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ p.isi }}</p>
      </div>
    </div>

    <BaseModal :show="showAdd" @close="showAdd = false" title="Buat Pengumuman Baru" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Judul</label>
          <input v-model="form.judul" type="text" class="input" placeholder="cth: Pendaftaran SNBP 2026 Dibuka" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Kategori</label>
            <select v-model="form.kategori" class="input">
              <option>Karir</option>
              <option>Universitas</option>
              <option>Lomba</option>
              <option>Umum</option>
              <option>Pengumuman</option>
            </select>
          </div>
          <div>
            <label class="label">Prioritas</label>
            <select v-model="form.prioritas" class="input">
              <option>Tinggi</option>
              <option>Sedang</option>
              <option>Rendah</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">Isi Pengumuman</label>
          <textarea v-model="form.isi" class="input" rows="5" placeholder="Tulis isi pengumuman..."></textarea>
        </div>
        <label class="flex items-center gap-2">
          <input v-model="form.pinned" type="checkbox" class="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          <span class="text-sm text-slate-700 dark:text-slate-300">Sematkan di papan atas</span>
        </label>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAdd = false" class="btn-ghost">Batal</button>
          <button @click="submitPengumuman" :disabled="!form.judul || !form.isi" class="btn-primary">Publikasikan</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
