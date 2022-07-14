import Vue from 'vue'
import VueRouter from 'vue-router'
import Backup from '../views/Backup.vue'
import Importacao from '../views/Importacao.vue'
import Gestao from '../views/Gestao.vue'
import Autenticacao from '../views/Autenticacao.vue'
import PaginaInicial from '../views/PaginaInicial.vue'
import Forbidden from '../views/Forbidden.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'PaginaInicial',
    component: PaginaInicial
  },
  {
    path: '/autenticacao',
    name: 'Autenticacao',
    component: Autenticacao
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
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: Forbidden
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

router.beforeEach((to, from, next) => {  
  if($cookies.isKey('token')){
    if(to.name == 'Autenticacao') next({ name: 'Forbidden' })
    else next()
  }
  else if($cookies.isKey('apikey')){
    if(to.name == 'Autenticacao' || to.name == 'Importacao' || to.name == 'Gestao') next({ name: 'Forbidden' })
    else next()
  }
  else if(!$cookies.isKey('apikey') && !$cookies.isKey('token')){
    if(to.name == 'Backup' || to.name == 'Importacao' || to.name == 'Gestao') next({ name: 'Forbidden' })
    else next()
  }
  else next()
  
})

export default router
