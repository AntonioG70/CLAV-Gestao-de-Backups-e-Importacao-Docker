<template>
  <div class="wrapper">
    <div class="title-area">
      <h1>Plataforma de Gestão de Backups</h1>
    </div>
    <div class="form-area">
      <label class="label">Escolha o tipo de autenticação que pretende</label>
      <div class="check">
        <label class="label" for="Apikey">Apikey</label>
        <input style="margin-left: 5px" type="radio" class="input-radio" @click="showApk = true; showLogin = false" required v-model="tipoAut" value="apikey">
        <label class="label" for="Login">Login</label>
        <input style="margin-left: 5px" type="radio"  class="input-radio" @click="showLogin = true; showApk = false" required v-model="tipoAut" value="login">
      </div>
      <modal style="margin-top: 20px" v-if="showApk">
        <label class="label">Insira a apikey</label>
        <input type="text" class="input" v-model="apikey">
        <div>
          <v-btn style="margin-top: 10px; background-color: #1976D2; color: white" @click="authApk">Submeter</v-btn>
        </div> 
      </modal>
      <modal style="margin-top: 20px" v-if="showLogin">
        <label class="label">Username</label>
        <input type="text" class="input" v-model="login.username">
        <label class="label">password</label>
        <input type="password" class="input" v-model="login.password">
        <div>
          <v-btn style="margin-top: 10px; background-color: #1976D2; color: white" @click="authLogin()">Submeter</v-btn>
        </div> 
      </modal>     
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      tipoAut: "",
      apikey: "",
      login: {
        username: "",
        password: ""
      },
      showApk: "",
      showLogin: ""
    }  
  },
  methods: {
    authLogin: function (){
      axios({
        method: 'post',
        url: "http://clav-api.di.uminho.pt/v2/users/login",
        data: {
          username: this.login.username,
          password: this.login.password
        }
      })
      .then(user => {
        console.log(user.data.token)
      })
      .catch(err => {console.log(err); alert("Credenciais inválidas")})
    }
  }
}
</script>

<style>
.wrapper{
  display: flex;
  align-content: center;
  flex-direction: column;
  width: 100%;
}
.title-area{
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
  align-self: center;
  width: 50vw !important;
}
.form-area{
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-end;
  margin-top: 50px;
  width: 50vw !important;
}
.check{
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
}
.label{
  display: inline-block;
  margin-left: 10px;
  font-size: 1em;
  letter-spacing: 0.5px;
  font-weight: bold;
}
.input {
  display: block;
  padding: 10px 6px;
  width: 96%;
  height:30px;
  box-sizing: border-box;
  border: 1px solid #96918F;
}
</style>