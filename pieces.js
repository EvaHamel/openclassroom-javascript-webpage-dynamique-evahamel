/* global Chart */
//On importe le fichier json qui contient la liste des pièces
//import pieces from './pieces-autos.json' assert {type: 'json'};
let  pieces = window.localStorage.getItem("pieces");
if (pieces == null){
	const reponse = await fetch("http://localhost:8081/pieces");
	pieces = await reponse.json();
	//Transformation des pièces en JSON
	const valeurPieces = JSON.stringify(pieces);
	//Stockage des informations dans le localStorage
	window.localStorage.setItem("pieces", valeurPieces);
}
else{
	pieces = JSON.parse(pieces);
}
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis } from "./avis.js";


//Ajout du listener pour mettre à jour les données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function (){
	window.localStorage.removeItem("pieces");
});


//Boucle sur l'ensemble des produits
function genererPieces(pieces){
	for (let i = 0; i < pieces.length ; i++){
		//On lit la première pièce (qui correspond à l'ampoule)
		const item = pieces[i];
		const imageElement = document.createElement("img");
		imageElement.src = item.image;
		const nomElement = document.createElement("h2");
		nomElement.innerText = item.nom ?? "(aucune catégorie)";
		const prixElement = document.createElement("p");
		prixElement.innerText = "Prix : "
               + item.prix
               + " € ("
               + (item.prix < 35 ? "€" : "€€€")
               + ")";
		const categorieElement = document.createElement("p");
		categorieElement.innerText = item.categorie;
		const descriptionElement = document.createElement("p");
		descriptionElement.innerText = item.description ?? "(aucune description pour le moment)";
		const stockElement = document.createElement("p");
		stockElement.innerText = (item.disponibilite ? "En stock" : "En rupture de stock");
     
		//On créé un objet "article" et on lui attribue l'ensemble des éléments
		const article = document.createElement("article");   
		article.id = i+1; //On attribue un id à l'article
		article.appendChild(imageElement);
		article.appendChild(nomElement);
		article.appendChild(prixElement);
		article.appendChild(categorieElement);
		article.appendChild(descriptionElement);
		article.appendChild(stockElement);
		//Code ajouté
		const avisBouton = document.createElement("button");
		avisBouton.dataset.id = article.id; //Le bouton partage le même id que l'article
		avisBouton.textContent = "Afficher les avis";
		article.appendChild(avisBouton);
		//On rattache l'article à la page HTML (classe "fiches")
		const sectionFiches = document.querySelector(".fiches");
		sectionFiches.appendChild(article);
	}
	ajoutListenersAvis();
	ajoutListenerEnvoyerAvis();
}

//Premier affichage de la page
genererPieces(pieces);

//Ajout listener pour trier les pièces par ordre décroissant
const boutonTrierDecroissant = document.querySelector(".btn-trier-decroissant");
boutonTrierDecroissant.addEventListener("click", function(){
	const piecesReordonneesDecroissantes = Array.from(pieces);
	piecesReordonneesDecroissantes.sort(function(a,b){
		return b.prix - a.prix ;
	});
	//Effacement de l'écran et régénration de la page
	document.querySelector(".fiches").innerHTML="";
	genererPieces(piecesReordonneesDecroissantes);
});

//Ajout listener pour trier les pièces par ordre croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function(){
	const piecesReordonnees = Array.from(pieces);
	piecesReordonnees.sort(function(a,b){
		return a.prix - b.prix ;
	});
	//Effacement de l'écran et régénration de la page
	document.querySelector(".fiches").innerHTML="";
	genererPieces(piecesReordonnees);
});

//Ajout listener pour filtrer les pièces trop cher
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
	const piecesFiltrees = pieces.filter(function (piece) {
		return piece.prix <= 35;
	});
	//Effacement de l'écran et régénration de la page
	document.querySelector(".fiches").innerHTML="";
	genererPieces(piecesFiltrees);
});


//Ajout listener pour filtrer les pièces sans description
const boutonFiltrerDesc = document.querySelector(".btn-filtrer-desc");
boutonFiltrerDesc.addEventListener("click", function(){
	const piecesFiltreesDesc = pieces.filter(function (piece){
		return piece.description == null ? false : piece.description == "" ? false : true;
	});
	//Effacement de l'écran et régénration de la page
	document.querySelector(".fiches").innerHTML="";
	genererPieces(piecesFiltreesDesc);
});

//Ajout listener sur le filtre par prix (slider interactif)
const filtrePrix = document.querySelector(".filtre-prix");
filtrePrix.addEventListener("input", function(){
	const piecesFiltrees = pieces.filter(function(piece){
		return piece.prix < filtrePrix.value;
	});
	//Effacement de l'écran et régénration de la page
	document.querySelector(".fiches").innerHTML="";
	genererPieces(piecesFiltrees);     
});

///////////////////////
//Partie 2 - Chapitre 2
//Fonction lambda =>
//Fonction map
//Fonction splice
///////////////////////
//Exo 1 Liste des pièces abordables

//On récupère les noms des pièces
const noms= pieces.map(piece => piece.nom);
//Si le prix de la pièce est trop cher, on la retire du tableam de noms
for(let i = pieces.length - 1 ; i >=0;i--){
	if(pieces[i].prix>35){
		noms.splice(i,1);
	}
}

//Création de la liste des pièces abordables
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
	const nomElement = document.createElement("li");
	nomElement.innerText = noms[i];
	abordablesElements.appendChild(nomElement);
}
//Ajout de l'entête puis de la liste au bloc résutats filtres
const elementsabordables = document.querySelector(".abordables");
elementsabordables.appendChild(abordablesElements);

//Exo 2 Liste des pièces disponibles

//On récupère le nom des pièces et du prix
const nomEtPrix=pieces.map(piece => piece.nom+" - "+piece.prix+" €");
//Si la pièce n'est pas disponible, on la retire de la liste
for(let i = pieces.length - 1 ; i >=0 ; i--){
	if(pieces[i].disponibilite==false){
		nomEtPrix.splice(i,1);
	}
}

//Création de la liste des pièces disponibles
const disponiblesElements = document.createElement("ul");
//Ajout de chaque entrée à la liste
for(let i = 0 ; i < noms.length ; i++){
	const nomElement=document.createElement("li");
	nomElement.innerText=nomEtPrix[i];
	disponiblesElements.appendChild(nomElement);
}

//Ajout de l'entête puis de la liste au bloc résutats filtres
const elementsDisponibles = document.querySelector(".disponible");
elementsDisponibles.appendChild(disponiblesElements);

await afficherGraphiqueAvis();


//Construction du graphique pour les pièces disponibles
async function afficherGraphiquePiecesDispo(){

	//Calcul du nombre de pièces
	const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());
	var nbPiecesDispo = 0;
	var nbPiecesNonDispo = 0;
	for (let piece of pieces){
		if(piece.disponibilite){
			nbPiecesDispo++; 
		}
		else{
			nbPiecesNonDispo++;
		}
	} 
	const nbPiecesTab = [nbPiecesDispo, nbPiecesNonDispo];

	//Légende
	const labels = ["disponible", "Non disponible"];

	// Données et personnalisation du graphique
	const data = {
		labels: labels,
		datasets: [{
			label: "nombre de pièces",
			data: nbPiecesTab,
			backgroundColor: "rgba(0, 0, 230, 1)", // couleur jaune
		}],
	};

	// Objet de configuration final
	const config = {
		type: "bar",
		data: data,
		options: {
			indexAxis: "x",
		},
	};
 
	// Rendu du graphique dans l'élément canvas
	const graphiquePiecesDispo = new Chart(
		document.querySelector("#graphique-pieces_dispo"),
		config,
	);
	//document.appendChild(graphiquePiecesDispo);
 
}

await afficherGraphiquePiecesDispo();