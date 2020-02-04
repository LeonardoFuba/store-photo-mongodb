const express = require('express'); //comunicacao

const routes = require('./routes');  //importa rotas

const app = express(); //inicializa express

app.use(express.json());   // Para o express entender requisicoes no formato JSON
app.use(routes);           //importa rotas e depende da linha de cima

//porta de teste
app.listen(3333);    //definir explicitamente a porta
