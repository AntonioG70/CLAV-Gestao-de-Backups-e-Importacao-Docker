<template>
  <div class="wrapper">
    <div class="container mt-5">
      <div class="row mb-5">
        <div class="col-md-3">
          <div style="width: 110%;" class="p-2 alert alert-primary">
            <h3>Informação disponível</h3>
            <draggable class="list-group columns" :list="lista" group=tasks>
              <div class="list-group-item" v-for="elem in lista" :key="elem">
                {{elem}}
              </div>
            </draggable>
          </div>
        </div>
        <div class="col-md-3 ml-15">
          <div style="width: 110%" class="p-2 alert alert-secondary">
            <h3>Informação para Backup</h3>
            <draggable class="list-group columns" :list="listaBackup" group=tasks>
              <div class="list-group-item" v-for="elem in listaBackup" :key="elem">
                {{elem}}
              </div>
            </draggable>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-area">
            <label style="font-size: 1.5em;letter-spacing: 0.5px;font-weight: bold;">Escolha o tipo de autenticação que pretende:</label>
            <div class="check mt-3">
              <label class="label" for="Apikey">Apikey</label>
              <input style="margin-left: 5px; margin-bottom: 5px" type="radio" class="input-radio" @click="showApk = true; showLogin = false; getListaApiKey()" required v-model="tipoAut" value="apikey">
              <label class="label" for="Login">Login</label>
              <input style="margin-left: 5px; margin-bottom: 5px" type="radio"  class="input-radio" @click="showLogin = true; showApk = false; getLista()" required v-model="tipoAut" value="login">
            </div>
            <div style="margin-top: 20px" v-if="showApk">
              <label class="label">Insira a apikey</label>
              <input type="text" class="input" v-model="apikey" @click="noAPK = false" @input="noAPK = false">
            </div>
            <div style="margin-top: 20px" v-if="showLogin">
              <label class="label">Username</label>
              <input type="text" class="input" v-model="login.username" @click="noUser = false" @input="noUser = false">
              <label class="label mt-3">Password</label>
              <input type="password" class="input" v-model="login.password" @click="noPass = false" @input="noPass = false">
            </div>
            <div>
              <v-btn style="margin-top: 30px; background-color: #2d364e; color: white" @click="start" :loading="loading" :disabled="tipoAut == ''">Submeter</v-btn>
            </div>
            <div style="width: 50%" class="mt-14">
            <v-card
            color="#2d364e"
            dark>
              <v-card-title class="text-h5">
                Informação de Utilização
              </v-card-title>
              <v-card-subtitle>Preencha a área de autenticação, escolha a diretoria e arraste a informação que pretende 
                fazer backup para a caixa "Informação para Backup".</v-card-subtitle>
            </v-card>
            </div>     
          </div>  
        </div>      
      </div>
      <v-dialog
        v-model="dialogConfirm"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:#2d364e">
              Backup executado com sucesso!</p>
          </v-col>           
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            style="color: #2d364e !important"
            text
            @click="dialogConfirm = false; download()">
            Transferir <v-icon>mdi-download</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogErr2"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:#2d364e">
              Erro na autenticação! Verifique as suas <b>credenciais</b> ou assegure-se que a sua <b>apikey</b> é válida e permite acesso à informação à qual pretende fazer backup.</p>
          </v-col>           
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            style="color: #2d364e !important"
            text
            @click="dialogErr2 = false">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogListaVazia"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:#2d364e">
              Por favor selecione a informação para fazer backup.</p>
          </v-col>           
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            style="color: #2d364e !important"
            text
            @click="dialogListaVazia = false">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>                                    
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  data() {
    return {
      tipoAut: "",
      apikey: "",
      login: {
        username: "",
        password: ""
      },
      lista: null,
      listaBackup: null,
      showApk: "",
      showLogin: "",
      loading: false,
      dialogConfirm: false,
      dialogErr2: false,
      dialogListaVazia: false,
      bagName: null,
      
    } 
  },
  created() {
    axios.get('http://localhost:8080/api/lista/')
      .then(dados => {
        this.lista = dados.data
        this.listaBackup = []
      })
      .catch(err => console.log(err))
  },
  methods: {
    getListaApiKey(){
      this.lista = []
      axios.get('http://localhost:8080/api/lista/apikey')  
        .then(dados => {
          this.listaBackup.forEach(e => {
            if(dados.data.includes(e)){
              dados.data = dados.data.filter(i => i != e)
            }
            else{
              this.listaBackup = this.listaBackup.filter(i => i != e)
            }
          })          
          this.lista = dados.data
        })
        .catch(err => console.log(err))      
    },
    getLista(){
      this.lista = []
      axios.get('http://localhost:8080/api/lista/')
        .then(dados => {
          this.listaBackup.forEach(e => {
            if(dados.data.includes(e)){
              dados.data = dados.data.filter(i => i != e)
            }
          })
          this.lista = dados.data
        })
        .catch(err => console.log(err))        
    },
    download(){
      axios.get('http://localhost:8080/api/bagit/download/' + this.bagName,
      {
        responseType: 'blob'
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.bagName + '.zip'); //or any other extension
          document.body.appendChild(link);
          link.click();
          this.$router.push('/')
        })
        .catch(err => console.log(err))      
    },
    start(){
      this.loading = true
      this.submeter()
    },
    submeter(){
      let listaSub = []
      this.listaBackup.forEach(l => {
        listaSub.push(l)
      })
      console.log(listaSub)
      if(listaSub.length == 0){
        this.loading = false
        this.dialogListaVazia = true
      }
      else {
        if(this.tipoAut == 'login'){
          axios({
          method: 'post',
          url: "http://localhost:8080/api/backup", 
          data: {
            username: this.login.username,
            password: this.login.password,
            col: listaSub,
          }
          })
          .then(dados => {
            this.loading = false
            this.bagName = dados.data
            this.dialogConfirm = true
          })
          .catch(e => {
            console.log(e)
            this.dialogErr2 = true
            this.loading = false
          })
        }
        else if(this.tipoAut == 'apikey'){
          axios({
          method: 'post',
          url: "http://localhost:8080/api/backup", 
          data: {
            apikey: this.apikey,
            col: listaSub,
          }
          })
          .then(dados => {
            this.loading = false
            this.bagName = dados.data
            this.dialogConfirm = true
          })
          .catch(e => {
            console.log(e)
            this.dialogErr2 = true
            this.loading = false
          })        
        }
      }
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
  width: 150%;
  height:30px;
  box-sizing: border-box;
  border: 1px solid #96918F;
}
.columns{
  min-height: 750px;
  width: 100%;
}

</style>