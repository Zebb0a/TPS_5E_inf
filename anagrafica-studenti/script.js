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

	dati.forEach(function(il) {
		var riga = tabella.insertRow();
		riga.insertCell().textContent = il.nome;
		riga.insertCell().textContent = il.cognome;
		riga.insertCell().textContent = il.eta;
	});
}