const express = require('express'); //importazione libreria express
const app = express(); //oggetto 
const porta = 8001;

app.get('/camion-store/home', (req, res) => {
  res.sendFile( __dirname + '/camion-store/home.html');
});

app.get('/camion-store/chi-siamo', (req, res) => {
  res.sendFile( __dirname + '/camion-store/chi-siamo.html');
});

app.get('/camion-store/cosa-facciamo', (req, res) => {
  res.sendFile( __dirname + '/camion-store/cosa-facciamo.html');
});

app.get('/camion-store/modulo-messaggio', (req, res) => {
  res.sendFile( __dirname + '/camion-store/modulo-messaggio.html');
});


app.listen(porta, () => {
  console.log(`Ti sto aspettando nel localhost:${porta}`);
});