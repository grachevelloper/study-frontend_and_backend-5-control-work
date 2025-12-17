import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/HomeView.vue')
    },
    {
        path: '/generator',
        name: 'Generator',
        component: () => import('./views/GeneratorView.vue')
    },
    {
        path: '/library',
        name: 'Library',
        component: () => import('./views/LibraryView.vue')
    },
    {
        path: '/analyzer',
        name: 'Analyzer',
        component: () => import('./views/AnalyzerView.vue')
    },
    {
        path: '/export',
        name: 'Export',
        component: () => import('./views/ExportView.vue')
    }
]

const router = createRouter({
    history: createWebHistory('/study-frontend_and_backend-5-control-work/'),
    routes
})

export default router