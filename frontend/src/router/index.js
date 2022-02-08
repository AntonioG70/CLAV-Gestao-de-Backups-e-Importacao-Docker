import Vue from 'vue'
import VueRouter from 'vue-router'
import Backup from '../views/Backup.vue'
import Importacao from '../views/Importacao.vue'
import Gestao from '../views/Gestao.vue'
import PaginaInicial from '../views/PaginaInicial.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'PaginaInicial',
    component: PaginaInicial
  },
  {
    path: '/backup',
    name: 'Backup',
    component: Backup
  },
  {
    path: '/importacao',
    name: 'Importacao',
    component: Importacao
  },
  {
    path: '/gestao',
    name: 'Gestao',
    component: Gestao
  }  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
})

export default router
