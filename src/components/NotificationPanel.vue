<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../stores/data'
import { useAuthStore } from '../stores/auth'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const data = useDataStore()
const auth = useAuthStore()

const notifs = computed(() => {
  if (!auth.currentUser) return []
  return data.getNotifikasiForUser(auth.currentUser.id)
})

const unread = computed(() => notifs.value.filter(n => !n.dibaca).length)

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d} hari lalu`
  if (h > 0) return `${h} jam lalu`
  const m = Math.floor(diff / 60000)
  return `${m} menit lalu`
}

const catColor: Record<string, string> = {
  Sanksi: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Pelanggaran: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  Prestasi: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Konseling: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Pengumuman: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
}

function markAll() {
  if (auth.currentUser) data.markAllNotifikasiRead(auth.currentUser.id)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="show" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="emit('close')"></div>
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-slate-800">
          <div class="flex h-full flex-col">
            <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">Notifikasi</h3>
                <span v-if="unread > 0" class="badge bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">{{ unread }} baru</span>
              </div>
              <div class="flex items-center gap-2">
                <button v-if="unread > 0" @click="markAll" class="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Tandai semua dibaca</button>
                <button @click="emit('close')" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
              <div v-if="notifs.length === 0" class="flex h-full flex-col items-center justify-center text-slate-400">
                <svg class="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                <p class="text-sm">Tidak ada notifikasi</p>
              </div>
              <div
                v-for="n in notifs"
                :key="n.id"
                class="rounded-xl border p-4 transition cursor-pointer hover:shadow-soft"
                :class="n.dibaca ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800' : 'border-brand-200 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/5'"
                @click="data.markNotifikasiRead(n.id)"
              >
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <span class="badge" :class="catColor[n.kategori]">{{ n.kategori }}</span>
                  <span class="text-xs text-slate-400">{{ timeAgo(n.tanggal) }}</span>
                </div>
                <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ n.judul }}</h4>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ n.pesan }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
</style>
