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
        riga.insertCell().textContent = utente.nome;
        riga.insertCell().textContent = utente.cognome;
        riga.insertCell().textContent = utente.eta;
    });
}

function filtraPerIniziale() {
    var lettera = document.getElementById('lettera').value.toUpperCase();
    var filtrati = anagraficaUtenti.filter(function(utente) {
        return lettera == "" || utente.cognome.toUpperCase().startsWith(lettera);
    });
    stampaTabella(filtrati, 'tabellaUtenti');
}


