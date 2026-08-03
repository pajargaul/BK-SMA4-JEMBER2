<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useDataStore } from '../stores/data'
import NotificationPanel from '../components/NotificationPanel.vue'

const auth = useAuthStore()
const theme = useThemeStore()
const data = useDataStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const notifOpen = ref(false)

const unreadCount = computed(() => auth.currentUser ? data.getUnreadCount(auth.currentUser.id) : 0)

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    admin: 'Administrator Sistem',
    guru_bk: 'Guru BK / Konselor',
    kepala_sekolah: 'Kepala Sekolah',
    siswa: 'Siswa',
  }
  return map[auth.role || ''] || ''
})

interface NavItem { name: string; label: string; icon: string; roles?: string[] }

const navItems: NavItem[] = [
  { name: 'dashboard-home', label: 'Beranda', icon: 'home' },
  { name: 'pelanggaran', label: 'Basis Data Pelanggaran', icon: 'warning', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'prestasi', label: 'Poin Prestasi Siswa', icon: 'star', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'konseling', label: 'Log Pembinaan & Konseling', icon: 'chat', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'tindak-lanjut', label: 'Kelola Tindak Lanjut', icon: 'clipboard', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'siswa-saya', label: 'Poin & Bimbingan Saya', icon: 'user', roles: ['siswa'] },
  { name: 'riwayat', label: 'Riwayat Poin & Pelanggaran', icon: 'history' },
  { name: 'karir', label: 'Bimbingan Karir & Kampus', icon: 'briefcase' },
  { name: 'statistik', label: 'Rekap Statistik & Akademik', icon: 'chart', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'lomba', label: 'Lomba & Ekstrakurikuler', icon: 'trophy', roles: ['admin', 'guru_bk', 'kepala_sekolah'] },
  { name: 'pengumuman', label: 'Papan Pengumuman', icon: 'bell' },
  { name: 'sistem', label: 'Konfigurasi Sistem', icon: 'cog', roles: ['admin'] },
  { name: 'pengaturan', label: 'Pengaturan Profil', icon: 'settings' },
]

const visibleNav = computed(() => {
  return navItems.filter(item => !item.roles || (auth.role && item.roles.includes(auth.role)))
})

function navigate(name: string) {
  router.push({ name })
  sidebarOpen.value = false
}

function logout() {
  auth.logout()
  router.push('/')
}

const iconPaths: Record<string, string> = {
  home: 'M2.25 12l8.954 8.954c.44.439 1.152.439 1.591 0L21 12M4.5 9.75v10.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V9.75M8.25 21h8.25',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.482 20.4a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  chat: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.176 48.176 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  briefcase: 'M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15m16.5 0a3 3 0 00-3-3h-10.5a3 3 0 00-3 3m16.5 0v-3.654a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v3.654',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m4.5 0a48.024 48.024 0 00-3.878-.306l-.112-.014a48 48 0 00-3.878-.306m6.018 0a23.901 23.901 0 00-3.878-.306l-.112-.014a23.875 23.875 0 00-3.878-.306m6.018 0h-.003v0m0 0h.003',
  bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  clipboard: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
  history: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  cog: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.241.437-.613.43-.992a7.716 7.716 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  settings: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.241.437-.613.43-.992a7.716 7.716 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-navy-700 text-white shadow-glow">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M5.25 9v11a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V9" /></svg>
          </div>
          <div>
            <h1 class="font-display text-base font-bold leading-tight text-slate-800 dark:text-slate-100">SIBK</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">SMAN 4 Jember</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <button
            v-for="item in visibleNav"
            :key="item.name"
            @click="navigate(item.name)"
            class="nav-link w-full"
            :class="route.name === item.name ? 'nav-link-active' : 'nav-link-inactive'"
          >
            <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[item.icon]" /></svg>
            <span class="truncate">{{ item.label }}</span>
          </button>
        </nav>

        <!-- User -->
        <div class="border-t border-slate-200 p-4 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <img :src="auth.currentUser?.avatar" :alt="auth.currentUser?.name" class="h-10 w-10 rounded-full object-cover ring-2 ring-brand-500/20" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ auth.currentUser?.name }}</p>
              <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ roleLabel }}</p>
            </div>
            <button @click="logout" class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" title="Keluar">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="lg:pl-72">
      <!-- Topbar -->
      <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <button @click="sidebarOpen = true" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 lg:hidden">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>

          <div class="hidden flex-1 lg:block">
            <p class="text-sm text-slate-500 dark:text-slate-400">Selamat datang kembali,</p>
            <p class="font-display text-sm font-bold text-slate-800 dark:text-slate-100">{{ auth.currentUser?.name }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button @click="theme.toggle()" class="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" :title="theme.isDark ? 'Mode Terang' : 'Mode Gelap'">
              <svg v-if="theme.isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            </button>

            <button @click="notifOpen = true" class="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths.bell" /></svg>
              <span v-if="unreadCount > 0" class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{{ unreadCount }}</span>
            </button>

            <img :src="auth.currentUser?.avatar" :alt="auth.currentUser?.name" class="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/20" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>

    <NotificationPanel :show="notifOpen" @close="notifOpen = false" />
  </div>
</template>
