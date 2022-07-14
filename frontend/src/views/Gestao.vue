<template>
  <div>
    <v-dialog
      v-model="dialogLoad"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Aviso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            A carregar bagits...</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>    
    <v-dialog
      v-model="dialogErr"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Ocorreu um erro na operação.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogErr = false">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Informação</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            A eliminar bagit...</p>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>           
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogConfirmDel"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Pretende eliminar o {{bagName}}?</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #9e9595 !important"
          text
          @click="dialogConfirmDel = false">
          Cancelar
          </v-btn>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogConfirmDel = false; eliminar()">
          Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>      
    <v-dialog
      v-model="dialogDelDone"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Sucesso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Bagit eliminado com sucesso!</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogDelDone = false">
          Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>               
    <div v-if="!dialog">
      <h1 class="titulo">Lista de backups</h1> 
        <v-container>
            <v-row justify="center">
              <v-col class="text-center">
                <v-btn depressed @click="color1=true; color2=false;" v-bind:color="color1 === true ? '#2d364e' : '#9e9595'" style="color: white; margin:0 10px 0 0;">Tabela</v-btn>
                <v-btn depressed @click="color1=false; color2=true;" v-bind:color="color2 === true ? '#2d364e' : '#9e9595'" style="color: white; margin:0 10px 0 0;">Mosaico</v-btn>
              </v-col>
            </v-row>
        </v-container>             
      <div v-if="color2" class="lista">
        <div class="child" v-for="elem in bagits" :key="elem.nome">
          <v-card
            class="mx-auto my-12"
            style="max-width: 400px;"
          >

            <v-card-title>{{elem.nome}}</v-card-title>

            <v-card-text>
              <div class="my-4 text-subtitle-1">
                Criador: {{elem.criador}}
              </div>
              <div class="my-4 text-subtitle-1">
                Data de criação: {{elem.data_criacao}}
              </div>
              <div class="my-4 text-subtitle-1">
                Tamanho: {{elem.tamanho}}
              </div>
              <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="my-4 text-subtitle-1">
                Ficheiros: {{elem.ficheiros}}
              </div>

            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                text
                @click="bagName=elem.nome; dialogConfirmDel=true"
              >
                Eliminar <v-icon style="color: red">mdi-close</v-icon>
              </v-btn>              
              <v-btn
                color="#2d364e"
                text
                @click="bagName=elem.nome; download()"
              >
                Transferir <v-icon>mdi-download</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>    
        </div>
      </div>
      <div class="tabela" v-if="color1">
        <v-card style="width: 90%;">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Procurar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>    
          <v-data-table
          :headers="headers"
          :items="bagits"
          :search="search">
        <template v-slot:item="row">
          <tr>
            <td>{{row.item.nome}}</td>
            <td>{{row.item.criador}}</td>
            <td>{{row.item.data_criacao}}</td>
            <td>{{row.item.tamanho}}</td>
            <td>{{row.item.ficheiros}}</td>
            <td>
              <v-btn icon @click="bagName=row.item.nome; download()">
                  <v-icon style="color: #2d364e">mdi-download</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn icon @click="bagName=row.item.nome; dialogConfirmDel=true">
                  <v-icon style="color: red">mdi-close</v-icon>
              </v-btn>
            </td>            
          </tr>
      </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </div>      
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      color1: true,
      color2:false,
      dialogErrAut: false,
      dialogDelDone: false,
      dialogConfirmDel: false,
      dialogErr: false,
      dialogDelete: false,
      dialog: true,
      dialogLoad: false,
      email: "",
      password: "",
      valueLogin: String,
      bagits: null,
      loading: false,
      bagName: "",
      search: "",
      headers: [
        {text: 'Nome', align: 'start', value: 'nome'},
        { text: 'Criador', value: 'criador' },
        { text: 'Data de criação', value: 'data_criacao' },
        { text: 'Tamanho', value: 'tamanho' },
        { text: 'Ficheiros', value: 'ficheiros' },
      ]      
    }
  },
  created(){
    this.dialogLoad = true
    axios({
      method: 'post',
      url: "/api/bagit", 
      data: {
        username: $cookies.get('user'),
        password: $cookies.get('password'),
      }
    })
      .then(dados => {
        this.bagits = dados.data.bagit.map(b => {
          return {
            nome: b.nome,
            criador: b.criador,
            data_criacao: b.data_criacao,
            tamanho: b.tamanho,
            ficheiros: b.ficheiros.toString().replace('"', '').replace("[", "").replace("]", "")
          }
        })
        this.dialogLoad = false        
        this.loading = false
        this.dialog = false
      })
      .catch(e => {
        console.log(e)
        this.dialogErrAut = true
        this.loading = false
      })  
  },
  methods: {
    redirect(){
      this.$router.push('/')
    },
    download(){
      axios.get('/api/bagit/download/' + this.bagName,
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
        })
        .catch(err => {
          console.log(err)
          this.dialogErr = true
          })      
    },
    eliminar(){
      this.dialogDelete = true
      axios.delete('/api/bagit/' + this.bagName, {data:{username: $cookies.get('user'), password:$cookies.get('password')}})
        .then(() =>{
          axios({
          method: 'post',
          url: "/api/bagit", 
          data: {
            username: $cookies.get('user'),
            password: $cookies.get('password'),
          }
          })
          .then(dados => {
            this.dialogDelete = false
            this.dialogDelDone = true
            this.bagits = dados.data.bagit.map(b => {
              return {
                nome: b.nome,
                criador: b.criador,
                data_criacao: b.data_criacao,
                tamanho: b.tamanho,
                ficheiros: b.ficheiros.toString().replace('"', '').replace("[", "").replace("]", "")
              }
            })
          })
          .catch(e => {
            console.log(e)
            this.dialogErrAut = true
          })            
        })
        .catch(err => {
            console.log(err)
            this.dialogErr = true
        })
    }   
  }
}
</script>

<style>
.lista {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
}
.titulo {
  display: flex;
  justify-content: center;
  color: #2d364e;
  margin-top: 20px;
}
.tabela {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.child {
  flex: 0 0 21%; /* explanation below */
}
</style>