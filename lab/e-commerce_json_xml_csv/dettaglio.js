window.onload = function() {
    // Aggiorna contatore
    var carrelloGre = localStorage.getItem("carrello");
    var n = 0;
    if (carrelloGre != null) { 
        n = JSON.parse(carrelloGre).length; 
    }
    var el = document.getElementById("cart-count");
    if (el != null) { 
        el.innerText = n; 
    }

    // Recupera dati prodotto
    var dati = localStorage.getItem("prodotto_corrente");
    
    if (dati != null) {
        var p = JSON.parse(dati);
        var divContenuto = document.getElementById("contenuto");

        var img = p.immagine || p.image;
        var tit = p.titolo || p.title;
        var prz = p.prezzo || p.price;

        var html = "";
        
        // Parte Immagine
        html += "<div class='foto'>";
        html += "<img src='" + img + "' alt='" + tit + "'>";
        html += "</div>";

        // Parte Testi
        html += "<div class='testi'>";
        html += "<h2>" + tit + "</h2>";
        html += "<div class='prezzo'>" + prz + " €</div>";
        html += "<p class='info'>Questo prodotto rappresenta l'eccellenza della nostra selezione. Ogni chicco viene scelto con cura per offrirti un'esperienza sensoriale unica, tipica della tradizione del nostro Coffee Shop. La tostatura artigianale ne esalta le note aromatiche, rendendolo ideale per chi cerca un gusto intenso e persistente.</p>";
        html += "</div>";

        divContenuto.innerHTML = html;
    } else {
        document.getElementById("contenuto").innerHTML = "<h2>Dati non trovati.</h2>";
    }
};