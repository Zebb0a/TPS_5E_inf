var carrello = [];

// --- Caricamento CSV ---
function caricaCSV(callback) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.csv", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      callback(richiesta.responseText);
    }
  };
  richiesta.send();
}

function convertiCSV(testoCSV) {
  var righe = testoCSV.trim().split(/\r?\n/);
  var intestazioni = righe[0].split(",");
  var prodotti = [];
  for (var i = 1; i < righe.length; i++) {
    var valori = righe[i].split(",");
    var prodotto = {};
    for (var j = 0; j < intestazioni.length; j++) {
      prodotto[intestazioni[j]] = (valori[j]).trim();
    }
    prodotti.push(prodotto);
  }
  return prodotti;
}

// --- Caricamento JSON ---
function caricaJSON(callback) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.json", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      callback(JSON.parse(richiesta.responseText));
    }
  };
  richiesta.send();
}

// --- Caricamento XML ---
function caricaXML(callback) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.xml", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      var documentoXML = richiesta.responseXML;
      var elementi = documentoXML.getElementsByTagName("product");
      var prodotti = [];
      for (var i = 0; i < elementi.length; i++) {
        var prodotto = {
            codice: elementi[i].getElementsByTagName("id")[0].textContent,
            titolo: elementi[i].getElementsByTagName("title")[0].textContent,
            categoria: elementi[i].getElementsByTagName("type")[0].textContent,
            prezzo: elementi[i].getElementsByTagName("price")[0].textContent,
            immagine: elementi[i].getElementsByTagName("image")[0].textContent
        };
        prodotti.push(prodotto);
      }
      callback(prodotti);
    }
  };
  richiesta.send();
}

// --- Creazione card prodotto ---
function creaCard(prodotto) {
  var card = document.createElement("div");
  card.className = "card";

  var immagine = document.createElement("img");
  immagine.src = prodotto.immagine || prodotto.image;
  card.appendChild(immagine);

  var titolo = document.createElement("h3");
  titolo.textContent = prodotto.titolo || prodotto.title;
  card.appendChild(titolo);

  var prezzo = document.createElement("p");
  prezzo.textContent = (prodotto.prezzo || prodotto.price) + " €";
  card.appendChild(prezzo);

  var bottone = document.createElement("button");
  bottone.textContent = "Aggiungi al carrello";
  bottone.onclick = function () {
    carrello.push(prodotto);
    aggiornaCarrello();
  };
  card.appendChild(bottone);

  return card;
}

// --- Mostra prodotti ---
function mostraProdotti(listaProdotti, idContenitore) {
  var contenitore = document.getElementById(idContenitore);
  contenitore.innerHTML = "";
  for (var i = 0; i < listaProdotti.length; i++) {
    var card = creaCard(listaProdotti[i]);
    contenitore.appendChild(card);
  }
}

// --- Aggiorna carrello ---
function aggiornaCarrello() {
  var lista = document.getElementById("lista-carrello");
  var totaleEl = document.getElementById("totale");
  lista.innerHTML = "";
  var totale = 0;

  for (var i = 0; i < carrello.length; i++) {
    var item = document.createElement("p");
    item.textContent = (carrello[i].titolo || carrello[i].title) + " - " + (carrello[i].prezzo || carrello[i].price) + " €";
    lista.appendChild(item);
    totale += parseFloat(carrello[i].prezzo || carrello[i].price);
  }

  totaleEl.textContent = "Totale: " + totale.toFixed(2) + " €";
}

function svuotaCarrello() {
  carrello = [];
  aggiornaCarrello();
}

// --- Stampa con window.print ---
function stampaScontrino() {
  var contenuto = "<h1>Scontrino</h1>";
  var totale = 0;

  for (var i = 0; i < carrello.length; i++) {
    var titolo = carrello[i].titolo || carrello[i].title;
    var prezzo = carrello[i].prezzo || carrello[i].price;
    contenuto += "<p>" + titolo + " - " + prezzo + " €</p>";
    totale += parseFloat(prezzo);
  }

  contenuto += "<h3>Totale: " + totale.toFixed(2) + " €</h3>";

  var finestraStampa = window.open("", "", "width=600,height=400");
  finestraStampa.document.write("<html><head><title>Scontrino</title></head><body>");
  finestraStampa.document.write(contenuto);
  finestraStampa.document.write("</body></html>");
  finestraStampa.document.close();
  finestraStampa.print();
}

// --- Avvio diretto ---
window.onload = function () {
  caricaJSON(function (prodottiJSON) {
    mostraProdotti(prodottiJSON, "json-container");
  });

  caricaCSV(function (testoCSV) {
    var prodottiCSV = convertiCSV(testoCSV);
    mostraProdotti(prodottiCSV, "csv-container");
  });

  caricaXML(function (prodottiXML) {
    mostraProdotti(prodottiXML, "xml-container");
  });
};
