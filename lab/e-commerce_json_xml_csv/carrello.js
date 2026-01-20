window.onload = function () {
  mostraCarrello();
};

function mostraCarrello() {
  var contenitore = document.getElementById("oggetti");
  var totaleElemento = document.getElementById("prezzoTot");
  var carrelloGre = localStorage.getItem("carrello");
  var carrello = [];

  if (carrelloGre != null) {
    carrello = JSON.parse(carrelloGre);
  }

  contenitore.innerHTML = "";
  var totale = 0;

  if (carrello.length == 0) {
    contenitore.innerHTML = "<p>Il carrello è vuoto.</p>";
  } else {
    var prodotti = [];

    for (var i = 0; i < carrello.length; i++) {
      var articolo = carrello[i];
      var codice = articolo.codice;
      if (codice == null) { codice = articolo.id; }

      var trovato = false;
      for (var j = 0; j < prodotti.length; j++) {
        var codiceProdotto = prodotti[j].codice;
        if (codiceProdotto == null) { codiceProdotto = prodotti[j].id; }

        if (codiceProdotto == codice) {
          prodotti[j].quantita = prodotti[j].quantita + 1;
          trovato = true;
          break;
        }
      }

      if (!trovato) {
        articolo.quantita = 1;
        prodotti.push(articolo);
      }

      var prezzo = articolo.prezzo;
      if (prezzo == null) { prezzo = articolo.price; }
      totale += parseFloat(prezzo);
    }

    for (var k = 0; k < prodotti.length; k++) {
      var p = prodotti[k];

      var nome = p.titolo;
      if (nome == null) { nome = p.title; }

      var prezzo = p.prezzo;
      if (prezzo == null) { prezzo = p.price; }

      var riga = document.createElement("div");
      riga.className = "cart-item";

      var info = document.createElement("span");
      info.textContent = nome + " - €" + prezzo;
      riga.appendChild(info);

      var azioni = document.createElement("div");
      azioni.className = "cart-actions";

      var meno = document.createElement("button");
      meno.textContent = "-";
      meno.onclick = (function(prodotto) {
        return function() { cambiaQuantita(prodotto, -1); };
      })(p);

      var quantita = document.createElement("span");
      quantita.className = "qty-number";
      quantita.textContent = p.quantita;
      quantita.style.margin = "0 10px";
      quantita.style.fontWeight = "bold";

      var piu = document.createElement("button");
      piu.textContent = "+";
      piu.onclick = (function(prodotto) {
        return function() { cambiaQuantita(prodotto, 1); };
      })(p);

      azioni.appendChild(meno);
      azioni.appendChild(quantita);
      azioni.appendChild(piu);
      riga.appendChild(azioni);

      contenitore.appendChild(riga);
    }
  }
  totaleElemento.innerText = totale.toFixed(2);
}

function cambiaQuantita(prodotto, operazione) {
  var carrello = JSON.parse(localStorage.getItem("carrello"));
  var codice = prodotto.codice;
  if (codice == null) { codice = prodotto.id; }

  if (operazione == 1) {
    carrello.push(prodotto);
  } else {
    for (var i = 0; i < carrello.length; i++) {
      var codiceItem = carrello[i].codice;
      if (codiceItem == null) { codiceItem = carrello[i].id; }
      if (codiceItem == codice) {
        carrello.splice(i, 1);
        break;
      }
    }
  }
  localStorage.setItem("carrello", JSON.stringify(carrello));
  mostraCarrello();
}

function svuotaCarrello() {
  localStorage.removeItem("carrello");
  mostraCarrello();
}

function stampaScontrino() {
  var carrelloGre = localStorage.getItem("carrello");
  if (carrelloGre == null || JSON.parse(carrelloGre).length == 0) {
    alert("Il carrello è vuoto!");
    return;
  }

  var carrello = JSON.parse(carrelloGre);
  var prodotti = [];
  var totale = 0;

  for (var i = 0; i < carrello.length; i++) {
    var item = carrello[i];
    var codice = item.codice;
    if (codice == null) { codice = item.id; }

    var trovato = false;
    for (var j = 0; j < prodotti.length; j++) {
      var codiceP = prodotti[j].codice;
      if (codiceP == null) { codiceP = prodotti[j].id; }
      if (codiceP == codice) {
        prodotti[j].quantita++;
        trovato = true;
        break;
      }
    }
    if (!trovato) {
      item.quantita = 1;
      prodotti.push(item);
    }
    var pz = item.prezzo;
    if (pz == null) { pz = item.price; }
    totale += parseFloat(pz);
  }

  var contenuto = "<h1>Scontrino Store</h1><hr>";
  for (var k = 0; k < prodotti.length; k++) {
    var p = prodotti[k];
    var n = p.titolo;
    if (n == null) { n = p.title; }
    var pr = p.prezzo;
    if (pr == null) { pr = p.price; }
    contenuto += "<p>" + n + " x" + p.quantita + " - €" + (parseFloat(pr) * p.quantita).toFixed(2) + "</p>";
  }
  contenuto += "<hr><h3>Totale: €" + totale.toFixed(2) + "</h3>";

  var finestra = window.open("", "PRINT", "height=600,width=400");
  finestra.document.write("<html><head><title>Scontrino</title></head><body>");
  finestra.document.write(contenuto);
  finestra.document.write("</body></html>");
  finestra.document.close();
  finestra.focus();
  finestra.print();
  finestra.close();
}  