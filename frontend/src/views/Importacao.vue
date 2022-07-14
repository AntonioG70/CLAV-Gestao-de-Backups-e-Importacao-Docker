<template>
  <div>
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
          @click="dialogErr = false; redirect()">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogImpTotal"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Aviso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Este tipo de importação deve apenas ser utilizado quando a base de dados do CLAV se encontra totalmente vazia. Pretende continuar com a operação?</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpTotal = false; sendFile()">
          Sim
          </v-btn>          
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpTotal = false">
          Não
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogImpOverwrite"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Aviso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Este tipo de importação remove a informação existente na base de dados do CLAV e adiciona a presente na pacote. Pretende continuar com a operação?</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpOverwrite = false; sendFile()">
          Sim
          </v-btn>          
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpOverwrite = false">
          Não
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogImpAdicionar"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Aviso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Este tipo de importação apenas adiciona os elementos presentes no pacote que não estejam presentes na base de dados do CLAV. Pretende continuar com a operação?</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpAdicionar = false; sendFile()">
          Sim
          </v-btn>          
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogImpAdicionar = false">
          Não
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>            
    <v-dialog
      v-model="dialogWrongFile"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Ficheiro Inválido</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Por favor insira um ficheiro ZIP criado nesta plataforma.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogWrongFile = false">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    
    <v-dialog
      v-model="dialogEmpty"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Pedido Inválido</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Por favor certifique-se que preencheu todos os campos do formulário.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogEmpty = false">
          Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    
    <v-dialog
      v-model="dialogSucess"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Sucesso</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Informação importada com sucesso.</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          style="color: #2d364e !important"
          text
          @click="dialogSucess = false; redirect()">
          Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogLoad"
      :retain-focus="false"
      max-width="550">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Informação</v-card-title> <br/>
        <v-col style="margin: auto; padding: 0px 50px;">
          <p style="margin-bottom: 5px; color:#2d364e">
            Importação em curso. Este processo pode demorar alguns minutos, por favor aguarde...</p>
        </v-col>           
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
        <div>
          <h1 class="titulo">Importar BagIt</h1>
        </div>
          <form enctype="multipart/form-data" class="form-area">
              <input type="file" @change="selectFile" ref="file">          
              <div class="select-area">
                <v-select
                :items= opcoes
                v-model="opcao"
                label="Tipo de Importação"
                color= "#2d364e"
                dense
                outlined
              ></v-select>
            </div>
            <div class="field">
              <v-btn :loading="loading" style="margin-top: 20px; background-color: #2d364e; color: white" @click="check">Submeter</v-btn>
            </div>
          </form>
    </div>
  </div>    
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      dialog: true,
      dialogErr: false,
      dialogSucess: false,
      dialogLoad: false,
      dialogEmpty: false,
      dialogWrongFile: false,
      dialogImpTotal: false,
      dialogImpOverwrite: false,
      dialogImpAdicionar: false,
      email: "",
      password: "",
      valueLogin: String,
      loading: false,
      file: "",
      tipoImport: "",
      opcoes: ["Importação total", "Overwrite", "Adicionar"],
      opcao: ""
    }
  },
  methods: {
    redirect(){
      this.$router.push('/')
    },
    selectFile(){
      this.file = this.$refs.file.files[0]
    },
    check(){
      if(this.opcao == "Importação total"){
        this.dialogImpTotal = true
      }
      else if(this.opcao == "Overwrite"){
        this.dialogImpOverwrite = true
      }
      else if(this.opcao == "Adicionar"){
        this.dialogImpAdicionar = true
      }
      else {
        this.dialogEmpty = true
      }
    },
    sendFile(){
      if(this.opcao == '' || this.file == ''){
        this.dialogEmpty = true
      }
      else {
        if(this.file.name.split(".")[1] != "zip" || this.file.name.split("-")[0] != "bagit"){
          this.dialogWrongFile = true
        }
        else {
          this.loading = true
          this.dialogLoad = true
          this.opcao = this.opcao.toLowerCase()
          if(this.opcao == 'importação total'){
            this.opcao = 'total'
          }
          let formData = new FormData();
          formData.append('file', this.file);
          axios.post('/api/import?opcao=' + this.opcao + '&token=' + $cookies.get("token") ,
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          ).then(dados =>{
            this.dialogSucess = true
            this.dialogLoad = false
            this.loading = false
            this.file = ""
          })
          .catch(err => {
            this.dialogLoad = false
            this.dialogErr = true
            this.loading = false
            this.file = ""
            console.log(err);
          }) 
        }
      } 
    } 
  }
}
</script>

<style>
.form-area{
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  flex-wrap: wrap;
  margin-left: 25% !important;
}
.select-area{
  margin-top:20px;
}
.titulo {
  display: flex;
  justify-content: center;
  color: #2d364e;
  margin-top: 20px;
}
</style>