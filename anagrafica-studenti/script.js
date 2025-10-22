var anagraficaUtenti = [];

function caricaDatiJSON() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'file.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            anagraficaUtenti = JSON.parse(xhr.responseText);
            stampaTabella(anagraficaUtenti, 'tabellaUtenti');
        }
    };
    xhr.send();
}

function stampaTabella(dati, id) {
    var tabella = document.getElementById(id);
    tabella.innerHTML = "";

    var intestazioni = ["Nome", "Cognome", "Età"];
    var rigaIntestazioni = tabella.insertRow();
    intestazioni.forEach(function(testo) {
        var th = document.createElement("th");
        th.textContent = testo;
        rigaIntestazioni.appendChild(th);
    });

    dati.forEach(function(utente) {
    var riga = tabella.insertRow();

    var cellaNome = document.createElement("td");
    cellaNome.textContent = utente.nome;
    riga.appendChild(cellaNome);

    var cellaCognome = document.createElement("td");
    cellaCognome.textContent = utente.cognome;
    riga.appendChild(cellaCognome);

    var cellaEta = document.createElement("td");
    cellaEta.textContent = utente.eta;
    riga.appendChild(cellaEta);
    });
}

function filtraPerIniziale() {
    var lettera = document.getElementById('lettera').value.toUpperCase();
    var filtrati = [];
    for (var i = 0; i < anagraficaUtenti.length; i++) {
        var utente = anagraficaUtenti[i];
        if (lettera == "" || utente.cognome.toUpperCase().startsWith(lettera)) {
            filtrati.push(utente);
        }
    }
    stampaTabella(filtrati, 'tabellaUtenti');
}

function filtraPerEta() {
    var eta = document.getElementById('eta').value;
    var filtrati = [];
    for (var i = 0; i < anagraficaUtenti.length; i++) {
        var utente = anagraficaUtenti[i];
        if (eta == "" || Number(utente.eta) === Number(eta)) {
            filtrati.push(utente);
        }
    }
    stampaTabella(filtrati, 'tabellaUtenti');
}




