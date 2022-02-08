<template>
 <v-app-bar
        app
        fixed
        color="#2d364e"
        dark
        hide-on-scroll
        :src="require('../assets/barbg.jpg')"
        fade-img-on-scroll>
        <template v-slot:img="{ props }">
            <v-img
                v-bind="props"
                gradient="to top right, rgba(10,20,60,.85), rgba(21,25,45,.75)"
            />
        </template>

        <a href="/">
          <v-img
              :src="require('../assets/logo.svg')"
              class="margin-0 padding-0"
              contain
              height="50"
              max-width="70"
          />
        </a>

        <div>
          <v-toolbar-title class='bar-title'>CLAV: Plataforma de Gestão de Backups e de Importação de dados</v-toolbar-title>
        </div>

      <v-spacer></v-spacer>

      <div class="dropdown" style="color: white">
          <DropOps/>
      </div>
    </v-app-bar>
</template>

<script>
import DropOps from '@/components/DropOps.vue';
export default {
  components: {
    DropOps
  }
}
</script>

<style>

</style>