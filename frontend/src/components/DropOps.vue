<template>
  <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="navbar-nav pull-right" v-bind="attrs" v-on="on">
            <strong>Operações <v-icon size="16">mdi-arrow-down</v-icon></strong>
          </div>
        </template>
        <v-list style="padding:0">
          <router-link class="opcao" :to="'/backup'">
            <v-list-item class="opcao">
              <strong>Backup</strong>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao'">
            <v-list-item class="opcao">
              <strong>Gestão de backups</strong>
            </v-list-item>
          </router-link>            
          <router-link class="opcao" :to="'/importacao'">
            <v-list-item class="opcao">
              <strong>Importação</strong>
            </v-list-item>
          </router-link>        
        </v-list>
    </v-menu>
</template>

<script>
export default {

}
</script>

<style>
.ops {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  align-self: flex-end;
  align-content: flex-end;
  justify-content: flex-end;
}

.opcao {
  text-decoration: none !important;
}

.opcao b{
  color:#595959 !important
}

.opcao:hover{
  background-color: #ddd !important;
}
</style>