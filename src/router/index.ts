import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: () => import('../views/LandingPage.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginPage.vue') },
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      children: [
        { path: '', redirect: { name: 'dashboard-home' } },
        { path: 'home', name: 'dashboard-home', component: () => import('../views/dashboards/HomeView.vue') },
        { path: 'pelanggaran', name: 'pelanggaran', component: () => import('../views/dashboards/PelanggaranView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'prestasi', name: 'prestasi', component: () => import('../views/dashboards/PrestasiView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'konseling', name: 'konseling', component: () => import('../views/dashboards/KonselingView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'tindak-lanjut', name: 'tindak-lanjut', component: () => import('../views/dashboards/TindakLanjutView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'riwayat', name: 'riwayat', component: () => import('../views/dashboards/RiwayatView.vue') },
        { path: 'karir', name: 'karir', component: () => import('../views/dashboards/KarirView.vue') },
        { path: 'statistik', name: 'statistik', component: () => import('../views/dashboards/StatistikView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'lomba', name: 'lomba', component: () => import('../views/dashboards/LombaView.vue'), meta: { roles: ['admin', 'guru_bk', 'kepala_sekolah'] } },
        { path: 'siswa-saya', name: 'siswa-saya', component: () => import('../views/dashboards/SiswaSayaView.vue'), meta: { roles: ['siswa'] } },
        { path: 'pengumuman', name: 'pengumuman', component: () => import('../views/dashboards/PengumumanView.vue') },
        { path: 'pengaturan', name: 'pengaturan', component: () => import('../views/dashboards/PengaturanView.vue') },
        { path: 'sistem', name: 'sistem', component: () => import('../views/dashboards/SistemView.vue'), meta: { roles: ['admin'] } },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.path.startsWith('/dashboard') && !auth.isLoggedIn) {
    next('/login')
  } else if (to.meta.roles && auth.role && !(to.meta.roles as string[]).includes(auth.role)) {
    next({ name: 'dashboard-home' })
  } else {
    next()
  }
})

export default router
