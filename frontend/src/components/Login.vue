<template>
      <v-dialog persistent
        v-model="dialog"
        :retain-focus="false"
        max-width="550">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2 justify-center">Autenticação CLAV</v-card-title> <br/>
            <v-card-text>
              <v-container pa-0>
                <v-col cols="12">
                  <v-text-field 
                  color=#2d364e
                  type="text" 
                  v-model="username" 
                  label="Email">
                  </v-text-field>
                </v-col>
                                    
                <v-col cols="12">
                  <v-text-field  
                    color=#2d364e
                    :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
                    :type="valueLogin ? 'password' : 'text'" 
                    v-model="password" 
                    label="Password"
                    @click:append="() => (valueLogin = !valueLogin)">
                  </v-text-field>
                </v-col>
              </v-container>
          </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn 
                v-ripple="{ class: 'primary--text' }" 
                width="150"
                style="height:40px; background-color: #2d364e; color: white" 
                elevation="1"
                :loading= loading 
                @click="loading=true; login() " 
                >Iniciar Sessão</v-btn>            
              <v-btn 
                v-ripple="{ class: 'primary--text' }" 
                width="150"
                style="height:40px; background-color: #9e9595; color: white" 
                elevation="1"
                @click="dialog=false" 
                >Cancelar</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>  
</template>

<script>
export default {
  data(){
    return{
      username: "",
      password: "",
      loading: false,
      valueLogin: String,
      dialog: true      
    }
  },
  props: {
    isOpen: Boolean
  },  
  methods:{
    login(){
      axios({
        method: 'post',
        url: "http://clav-api.di.uminho.pt/v2/users/login", 
        data: {
          username: this.username,
          password: this.password,
        }
      })
      .then(dados => {  
        this.$cookies.set("token", dados.data.token, 60 * 60 * 12)
        this.$cookies.set("username", this.username, 60 * 60 * 12) 
        this.$cookies.set("password", this.password, 60 * 60 * 12)
        this.isOpen = false    
        this.loading = false
      })
      .catch(e => {
        console.log(e)
        this.dialogErrAut = true
        this.loading = false
      })       
    }
  }
}
</script>

<style>

</style>