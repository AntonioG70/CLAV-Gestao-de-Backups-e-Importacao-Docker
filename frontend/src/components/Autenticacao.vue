<template>
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
      </modal>
      <modal style="margin-top: 20px" v-if="showLogin">
        <label class="label">Username</label>
        <input type="text" class="input" v-model="login.username">
        <label class="label">password</label>
        <input type="password" class="input" v-model="login.password">
      </modal>
      <div style="margin-top: 70px">
        <label class="label">Diretoria</label>
        <input type="text" class="input" v-model="path">
      </div>     
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipoAut: "",
      apikey: "",
      login: {
        username: "",
        password: ""
      },
      path: "",
      showApk: "",
      showLogin: ""
    } 
  }
}   
/*       <div>
          <v-btn style="margin-top: 10px; background-color: #1976D2; color: white" @click="authLogin()">Submeter</v-btn>
        </div> */
</script>

<style>
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
  align-content: center;
  align-items: center;
  width: 100%;
  height:30px;
  box-sizing: border-box;
  border: 1px solid #96918F;
}
</style>