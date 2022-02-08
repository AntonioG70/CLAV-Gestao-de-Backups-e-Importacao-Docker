#Imagem Base
FROM node:15
#Criar pasta de trabalho dentro da imagem
WORKDIR /api
#Copiamos a app para lá
COPY package.json /api
COPY package-lock.json /api
RUN npm install
COPY . /api
#Expomos a porta que irá correr
EXPOSE 7777
#Indicamos como arrancar a aplicação

CMD [ "npm", "start" ]