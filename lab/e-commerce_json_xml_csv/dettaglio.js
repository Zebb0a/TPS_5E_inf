window.onload = function() {
    var carrelloGre = localStorage.getItem("carrello");
    var n = 0;
    if (carrel != null) { 
        n = JSON.parse(carrel).length; 
    }
    var el = document.getElementById("cart-count");
    if (el != null) { 
        el.innerText = n; 
    }

    var dati = localStorage.getItem("prodotto_corrente");
    
    if (dati != null) {
        var p = JSON.parse(dati);
        var divContenuto = document.getElementById("contenuto");

        var img = p.immagine || p.image;
        var tit = p.titolo || p.title;
        var prz = p.prezzo || p.price;

        var html = "";
            
        html += "<div class='foto'>";
        html += "<img src='" + img + "' alt='" + tit + "'>";
        html += "</div>";

        html += "<div class='testi'>";
        html += "<h2>" + tit + "</h2>";
        html += "<div class='prezzo'>" + prz + " €</div>";
        html += "<p class='info'>questa è un esempio di descrizione che descrive il prodotto</p>";
        html += "</div>";

        divContenuto.innerHTML = html;
    } else {
        document.getElementById("contenuto").innerHTML = "<h2>Dati non trovati.</h2>";
    }

};

