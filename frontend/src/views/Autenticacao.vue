<template>
  <div>
    <v-container>

      <div class="auth-area">
        <v-img
            :src="require('../assets/logo.svg')"
            class="my-3"
            contain
            height="150"
          />
        <label style="font-size: 1.5em;letter-spacing: 0.5px;font-weight: bold;">Escolha o tipo de autenticação que pretende:</label>
        <div class="check mt-3">
          <label class="label" for="Apikey">Apikey</label>
          <input style="margin-left: 5px; margin-bottom: 5px" type="radio" class="input-radio" @click="showApk = true; showLogin = false;" required v-model="tipoAut" value="apikey">
          <label class="label" for="Login">Login</label>
          <input style="margin-left: 5px; margin-bottom: 5px" type="radio"  class="input-radio" @click="showLogin = true; showApk = false;" required v-model="tipoAut" value="login">
        </div>
        <div style="margin-top: 20px" v-if="showApk">
          <v-text-field
            class="apikey" 
            color=#2d364e
            type="text" 
            v-model="apikey" 
            label="Apikey"
            >
          </v-text-field>
          <v-btn 
            v-ripple="{ class: 'primary--text' }" 
            width="150"
            style="height:40px; background-color: #2d364e; color: white; margin-left:35%; margin-top:10px" 
            elevation="1"
            :loading= loading 
            @click="loading=true; validar() " 
          >Validar</v-btn>                   
        </div>
        <div style="margin-top: 20px" v-if="showLogin">
          <v-text-field
            class="login"
            color=#2d364e
            type="text" 
            v-model="username" 
            label="Email"
            >
          </v-text-field>
          <v-text-field  
            color=#2d364e
            :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
            :type="valueLogin ? 'password' : 'text'" 
            v-model="password" 
            label="Password"
            @click:append="() => (valueLogin = !valueLogin)">
          </v-text-field>
          <v-btn 
            v-ripple="{ class: 'primary--text' }" 
            width="150"
            style="height:40px; background-color: #2d364e; color: white; margin-left:20%; margin-top:10px" 
            elevation="1"
            :loading= loading 
            @click="loading=true; login() " 
          >Iniciar Sessão</v-btn>                                              
        </div>         
      </div>
    <v-dialog
      v-model="dialogErrAut"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Erro na autenticação! Verifique as suas credenciais.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogErrAut = false">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogErrVal"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            APIkey inválida.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogErrVal = false">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>           
           
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data(){
      return{
        showApk: false,
        loading: false,
        showLogin: false,
        dialogErrAut: false,
        dialogErrVal: false,
        valueLogin: String,
        tipoAut: "",
        apikey: "",
        username: "",
        password: ""
      }
    },
    methods: {
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
          this.$cookies.set("user", this.username, 60 * 60 * 12)
          this.$cookies.set("nome", dados.data.name, 60 * 60 * 12)  
          this.$cookies.set("password", this.password, 60 * 60 * 12)  
          this.loading = false
          this.$router.push('/')
        })
        .catch(e => {
          console.log(e.message)
          this.dialogErrAut = true
          this.loading = false
        })         
      },
      validar(){
        axios.get("http://clav-api.di.uminho.pt/v2/documentacaoApoio?apikey=" + this.apikey)
          .then(() => {
            this.$cookies.set("apikey", this.apikey, 60 * 60 * 12)
            this.loading = false
            this.$router.push('/')
          })
          .catch(e => {
            this.dialogErrVal = true
            this.loading = false
          })
      }
    }
  }
</script>

<style>
.auth-area{
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  margin-left: 12% !important;
  margin-top: 50px;
  width: 50vw !important;
}
.apikey{
  width: 500px
}
.login{
  width: 300px
}
</style>
