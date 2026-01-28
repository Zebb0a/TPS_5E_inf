function caricaCSV(it) {
  Papa.parse("./prodotti/prodotti.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      it(results.data);
    }
  });
}

function caricaJSON(it) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.json", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      it(JSON.parse(richiesta.responseText));
    }
  };
  richiesta.send();
}

function caricaXML(it) {
  var richiesta = new XMLHttpRequest();
  richiesta.open("GET", "./prodotti/prodotti.xml", true);
  richiesta.onreadystatechange = function () {
    if (richiesta.readyState == 4) {
      var doc = richiesta.responseXML;
      var elementi = doc.getElementsByTagName("product");
      var prodotti = [];
      for (var i = 0; i < elementi.length; i++) {
        prodotti.push({
          codice: elementi[i].getElementsByTagName("id")[0].textContent,
          titolo: elementi[i].getElementsByTagName("title")[0].textContent,
          categoria: elementi[i].getElementsByTagName("type")[0].textContent,
          prezzo: elementi[i].getElementsByTagName("price")[0].textContent,
          immagine: elementi[i].getElementsByTagName("image")[0].textContent
        });
      }
      it(prodotti);
    }
  };
  richiesta.send();
}

function creaCard(prodotto) {
  var card = document.createElement("div");
  card.className = "card";

  var info = document.createElement("div");
  info.style.cursor = "pointer";
  info.onclick = function() {
    localStorage.setItem("prodotto_corrente", JSON.stringify(prodotto));
    window.location.href = "./dettaglio.html";
  };

  var img = document.createElement("img");
  img.src = prodotto.immagine || prodotto.image;
  info.appendChild(img);

  var tit = document.createElement("h3");
  tit.textContent = prodotto.titolo || prodotto.title;
  info.appendChild(tit);

  var pre = document.createElement("p");
  pre.className = "price";
  pre.textContent = (prodotto.prezzo || prodotto.price) + " €";
  info.appendChild(pre);

  card.appendChild(info);

  var bottone = document.createElement("button");
  bottone.textContent = "Aggiungi al carrello";
  bottone.onclick = function() {
    var carrel = localStorage.getItem("carrello");
    var carrello = [];
    if (carrel != null) { 
      carrello = JSON.parse(carrel); 
    }
    carrello.push(prodotto);
    localStorage.setItem("carrello", JSON.stringify(carrello));
    aggiornaContatore();
    alert("Aggiunto!");
  };
  card.appendChild(bottone);

  return card;
}

function mostraProdotti(lista, id) {
  var cont = document.getElementById(id);
  if (cont != null) {
    cont.innerHTML = "";
    for (var i = 0; i < lista.length; i++) {
      cont.appendChild(creaCard(lista[i]));
    }
  }
}

function aggiornaContatore() {
  var carrel = localStorage.getItem("carrello");
  var n = 0;
  if (carrel != null) { 
    n = JSON.parse(carrel).length; 
  }
  var el = document.getElementById("cart-count");
  if (el != null) { 
    el.innerText = n; 
  }
}

window.onload = function () {
  aggiornaContatore();

  caricaJSON(function(d) { 
    mostraProdotti(d, "json-container"); 
  });

  caricaCSV(function(d) { 
    mostraProdotti(d, "csv-container"); 
  });

  caricaXML(function(d) { 
    mostraProdotti(d, "xml-container"); 
  });
};