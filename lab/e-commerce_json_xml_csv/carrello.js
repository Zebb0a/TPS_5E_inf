window.onload = function () {
  mostra();
};

function mostra() {
  var scatola = document.getElementById("oggetti");
  var totaleDoc = document.getElementById("prezzoTot");
  var dati = localStorage.getItem("carrello");
  var lista = [];

  if (dati != null) {
    lista = JSON.parse(dati);
  }

  scatola.innerHTML = "";
  var somma = 0;

  if (lista.length == 0) {
    scatola.innerHTML = "<p>Il carrello è vuoto.</p>";
  } else {
    var raggruppati = [];

    for (var i = 0; i < lista.length; i++) {
      var oggetto = lista[i];
      var id = oggetto.codice;
      if (id == null) { id = oggetto.id; }

      var trovato = false;
      for (var j = 0; j < raggruppati.length; j++) {
        var idEsistente = raggruppati[j].codice;
        if (idEsistente == null) { idEsistente = raggruppati[j].id; }

        if (idEsistente == id) {
          raggruppati[j].quantita = raggruppati[j].quantita + 1;
          trovato = true;
          break;
        }
      }

      if (!trovato) {
        oggetto.quantita = 1;
        raggruppati.push(oggetto);
      }

      var costo = oggetto.prezzo;
      if (costo == null) { costo = oggetto.price; }
      somma += parseFloat(costo);
    }

    for (var k = 0; k < raggruppati.length; k++) {
      var p = raggruppati[k];

      var nome = p.titolo;
      if (nome == null) { nome = p.title; }

      var prezzo = p.prezzo;
      if (prezzo == null) { prezzo = p.price; }

      var riga = document.createElement("div");
      riga.className = "cart-item";

      var info = document.createElement("span");
      info.textContent = nome + " - €" + prezzo;
      riga.appendChild(info);

      var bottoni = document.createElement("div");
      bottoni.className = "cart-actions";

      var meno = document.createElement("button");
      meno.textContent = "-";
      meno.onclick = (function(prod) {
        return function() { cambia(prod, -1); };
      })(p);

      var numero = document.createElement("span");
      numero.className = "qty-number";
      numero.textContent = p.quantita;
      numero.style.margin = "0 10px";
      numero.style.fontWeight = "bold";

      var piu = document.createElement("button");
      piu.textContent = "+";
      piu.onclick = (function(prod) {
        return function() { cambia(prod, 1); };
      })(p);

      bottoni.appendChild(meno);
      bottoni.appendChild(numero);
      bottoni.appendChild(piu);
      riga.appendChild(bottoni);

      scatola.appendChild(riga);
    }
  }
  totaleDoc.innerText = somma.toFixed(2);
}

function cambia(prodotto, azione) {
  var dati = JSON.parse(localStorage.getItem("carrello"));
  var id = prodotto.codice;
  if (id == null) { id = prodotto.id; }

  if (azione == 1) {
    dati.push(prodotto);
  } else {
    for (var i = 0; i < dati.length; i++) {
      var idItem = dati[i].codice;
      if (idItem == null) { idItem = dati[i].id; }
      if (idItem == id) {
        dati.splice(i, 1);
        break;
      }
    }
  }
  localStorage.setItem("carrello", JSON.stringify(dati));
  mostra();
}

function svuota() {
  localStorage.removeItem("carrello");
  mostra();
}

function stampa() {
  var dati = localStorage.getItem("carrello");
  if (dati == null || JSON.parse(dati).length == 0) {
    alert("Il carrello è vuoto!");
    return;
  }

  var lista = JSON.parse(dati);
  var unici = [];
  var totale = 0;

  for (var i = 0; i < lista.length; i++) {
    var item = lista[i];
    var id = item.codice;
    if (id == null) { id = item.id; }

    var trovato = false;
    for (var j = 0; j < unici.length; j++) {
      var idU = unici[j].codice;
      if (idU == null) { idU = unici[j].id; }
      if (idU == id) {
        unici[j].quantita++;
        trovato = true;
        break;
      }
    }
    if (!trovato) {
      item.quantita = 1;
      unici.push(item);
    }
    var val = item.prezzo;
    if (val == null) { val = item.price; }
    totale += parseFloat(val);
  }

  var foglio = "<h1>Scontrino Store</h1><hr>";
  for (var k = 0; k < unici.length; k++) {
    var p = unici[k];
    var n = p.titolo;
    if (n == null) { n = p.title; }
    var pr = p.prezzo;
    if (pr == null) { pr = p.price; }
    foglio += "<p>" + n + " x" + p.quantita + " - €" + (parseFloat(pr) * p.quantita).toFixed(2) + "</p>";
  }
  foglio += "<hr><h3>Totale: €" + totale.toFixed(2) + "</h3>";

  var popup = window.open("", "PRINT", "height=600,width=400");
  popup.document.write("<html><head><title>Scontrino</title></head><body>");
  popup.document.write(foglio);
  popup.document.write("</body></html>");
  popup.document.close();
  popup.focus();
  popup.print();
  popup.close();
}