function caricaCSV(varr) {
  Papa.parse("./prodotti/prodotti.csv", {
    download: true,       // Scarica il file automaticamente
    header: true,         // Usa la prima riga come titolo
    skipEmptyLines: true, // Balza le righe vuote
    complete: function(results) {// 'results' contiene il risultato dell'operazione
      varr(results.data);// Passa i dati contenuti in 'results.data' alla funzione 'varr' per l'elaborazione
    }
  });
}

function caricaJSON(varr) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.json", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      varr(JSON.parse(richiesta.responseText));
    }
  };
  richiesta.send();
}

function caricaXML(varr) {
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
      varr(prodotti);
    }
  };
  richiesta.send();
}

function creaCard(prodotto) {
  var card = document.createElement("div");
  card.className = "card";

  var immagine = document.createElement("img");
  var srcImmagine = prodotto.immagine;
  if (srcImmagine == null) {
    srcImmagine = prodotto.image;
  }
  immagine.src = srcImmagine;
  card.appendChild(immagine);

  var titolo = document.createElement("h3");
  var testoTitolo = prodotto.titolo;
  if (testoTitolo == null) {
    testoTitolo = prodotto.title;
  }
  titolo.textContent = testoTitolo;
  card.appendChild(titolo);

  var prezzo = document.createElement("p");
  var valorePrezzo = prodotto.prezzo;
  if (valorePrezzo == null) {
    valorePrezzo = prodotto.price;
  }
  prezzo.textContent = valorePrezzo + " €";
  card.appendChild(prezzo);

  var bottone = document.createElement("button");
  bottone.textContent = "Aggiungi al carrello";
  bottone.onclick = function () {
    var carrelloGrezzo = localStorage.getItem("carrello");
    var carrello = [];
    if (carrelloGrezzo != null) {
      carrello = JSON.parse(carrelloGrezzo);
    }
    carrello.push(prodotto);
    localStorage.setItem("carrello", JSON.stringify(carrello));
    aggiornaContatore();
    alert(testoTitolo + " aggiunto al carrello!");
  };
  card.appendChild(bottone);

  return card;
}

function mostraProdotti(listaProdotti, idContenitore) {
  var contenitore = document.getElementById(idContenitore);
  if (contenitore != null) {
    contenitore.innerHTML = "";
    for (var i = 0; i < listaProdotti.length; i++) {
      var card = creaCard(listaProdotti[i]);
      contenitore.appendChild(card);
    }
  }
}

function aggiornaContatore() {
  var carrelloGrezzo = localStorage.getItem("carrello");
  var conteggio = 0;
  if (carrelloGrezzo != null) {
    conteggio = JSON.parse(carrelloGrezzo).length;
  }
  var elementoContatore = document.getElementById("cart-count");
  if (elementoContatore != null) {
    elementoContatore.innerText = conteggio;
  }
}

window.onload = function () {
  aggiornaContatore();

  caricaJSON(function (prodottiJSON) {
    mostraProdotti(prodottiJSON, "json-container");
  });

  caricaCSV(function (prodottiCSV) {
    mostraProdotti(prodottiCSV, "csv-container");
  });

  caricaXML(function (prodottiXML) {
    mostraProdotti(prodottiXML, "xml-container");
  });
};