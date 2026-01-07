let carrello = [];

// --- Caricamento CSV ---
function caricaCSV(it) {
  let richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.csv", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      it(richiesta.responseText);
    }
  };
  richiesta.send();
}

function convertiCSV(CSV) {
  let righe = CSV.trim().split(/\r?\n/);
  let intestazioni = righe[0].split(",");
  let prodotti = [];
  for (let i = 1; i < righe.length; i++) {
    let valori = righe[i].split(",");
    let prodotto = {};
    for (let j = 0; j < intestazioni.length; j++) {
      prodotto[intestazioni[j]] = (valori[j]).trim();
    }
    prodotti.push(prodotto);
  }
  return prodotti;
}

// --- Caricamento JSON ---
function caricaJSON(it) {
  let richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.json", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      it(JSON.parse(richiesta.responseText));
    }
  };
  richiesta.send();
}

// --- Caricamento XML ---
function caricaXML(it) {
  let richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.xml", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      let documentoXML = richiesta.responseXML;
      let elementi = documentoXML.getElementsByTagName("product");
      let prodotti = [];
      for (let i = 0; i < elementi.length; i++) {
        let prodotto = {
          codice: elementi[i].getElementsByTagName("id")[0].textContent,
          titolo: elementi[i].getElementsByTagName("title")[0].textContent,
          categoria: elementi[i].getElementsByTagName("type")[0].textContent,
          prezzo: elementi[i].getElementsByTagName("price")[0].textContent,
          immagine: elementi[i].getElementsByTagName("image")[0].textContent
        };
        prodotti.push(prodotto);
      }
      it(prodotti);
    }
  };
  richiesta.send();
}

// --- Creazione card prodotto ---
function creaCard(prodotto) {
  let card = document.createElement("div");
  card.className = "card";

  let immagine = document.createElement("img");
  immagine.src = prodotto.immagine || prodotto.image;
  card.appendChild(immagine);

  let titolo = document.createElement("h3");
  titolo.textContent = prodotto.titolo || prodotto.title;
  card.appendChild(titolo);

  let prezzo = document.createElement("p");
  prezzo.textContent = (prodotto.prezzo || prodotto.price) + " €";
  card.appendChild(prezzo);

  let bottone = document.createElement("button");
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
  let contenitore = document.getElementById(idContenitore);
  contenitore.innerHTML = "";
  for (let i = 0; i < listaProdotti.length; i++) {
    let card = creaCard(listaProdotti[i]);
    contenitore.appendChild(card);
  }
}

// --- Aggiorna carrello ---
function aggiornaCarrello() {
  let lista = document.getElementById("lista-carrello");
  let totaleEl = document.getElementById("totale");
  lista.innerHTML = "";
  let totale = 0;

  for (let i = 0; i < carrello.length; i++) {
    let item = document.createElement("p");
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
  let contenuto = "<h1>Scontrino</h1>";
  let totale = 0;

  for (let i = 0; i < carrello.length; i++) {
    let titolo = carrello[i].titolo || carrello[i].title;
    let prezzo = carrello[i].prezzo || carrello[i].price;
    contenuto += "<p>" + titolo + " - " + prezzo + " €</p>";
    totale += parseFloat(prezzo);
  }

  contenuto += "<h3>Totale: " + totale.toFixed(2) + " €</h3>";

  let finestraStampa = window.open("", "", "width=600,height=400");
  finestraStampa.document.write("<html><head><title>Scontrino</title></head><body>");
  finestraStampa.document.write(contenuto);
  finestraStampa.document.write("</body></html>");
  finestraStampa.document.close();
  finestraStampa.print();
}


window.onload = function () {
  caricaJSON(function (prodottiJSON) {
    mostraProdotti(prodottiJSON, "json-container");
  });

  caricaCSV(function (CSV) {
    let prodottiCSV = convertiCSV(CSV);
    mostraProdotti(prodottiCSV, "csv-container");
  });

  caricaXML(function (prodottiXML) {
    mostraProdotti(prodottiXML, "xml-container");
  });
};
