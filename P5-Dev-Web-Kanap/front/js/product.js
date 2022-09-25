const params = new URLSearchParams(document.location.search); 
const id = params.get("id");
console.log(id);

fetch("http://localhost:3000/api/products/" + id) 
  .then( data => data.json())
  .then( product => {
    console.log(product);
    displayProduct(product);
  })

//------------------------------------------------------------------------
// fonction d'affichage du produit de l'api
//------------------------------------------------------------------------
function displayProduct(product) {
  // déclaration des variables pointage des éléments
  const itemImage = document.querySelector(".item__img");
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const colorsOptions = document.querySelector("#colors");

  title.textContent = product.name;
  price.textContent = product.price;
  description.textContent = product.description;
  itemImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  console.log(itemImage);

  for (let color of product.colors) {
    console.log(color);
    colorsOptions.innerHTML += `<option value="${color.toLowerCase()}">${color}</option>`;
  }
}
//------------------------------------------------------------------------
// Création d'objet articleClient
//------------------------------------------------------------------------
// déclaration objet articleClient prêt à être modifiée par les fonctions suivantes d'évènements
let articleClient = {};
// id du procuit
articleClient.id = id;
//------------------------------------------------------------------------
// choix couleur dynamique
//------------------------------------------------------------------------
// définition des variables
const colorChoice = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
colorChoice.addEventListener("input", (ec) => {
  let itemColor;
  // on récupère la valeur de la cible de l'évenement dans couleur
  itemColor = ec.target.value;
  // on ajoute la couleur à l'objet panierClient
  articleClient.color = itemColor;
  //ça reset le texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(itemColor);
});

//-------------------------------------------------------------------------
// choix quantité dynamique
//------------------------------------------------------------------------
// définition des variables
const quantityChoice = document.querySelector('input[id="quantity"]');
let itemQuantity;
// On écoute ce qu'il se passe dans input[name="itemQuantity"]
quantityChoice.addEventListener("input", (eq) => {
  // on récupère la valeur de la cible de l'évenement dans couleur
  itemQuantity = eq.target.value;
  // on ajoute la quantité à l'objet articleClient
  articleClient.quantity = itemQuantity;
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(itemQuantity);
});


//------------------------------------------------------------------------
// conditions de validation du clic via le bouton ajouter au panier
//------------------------------------------------------------------------
// déclaration variable
const itemChoice = document.querySelector("#addToCart");
// On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :
itemChoice.addEventListener("click", () => {
  //conditions de validation du bouton ajouter au panier
  if (
    // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
    articleClient.quantity < 1 ||
    articleClient.quantity > 100 ||
    articleClient.quantity === undefined ||
    articleClient.color === "" ||
    articleClient.color === undefined
  ) {
    // joue l'alerte
    alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
    // si ça passe le controle
  } else {
    // joue panier
    carts();
    console.log("clic effectué");
    //effet visuel d'ajout de produit
    document.querySelector("#addToCart").textContent = "Produit ajouté !";
  }
});


//------------------------------------------------------------------------
// Déclaration de tableaux
//------------------------------------------------------------------------
// déclaration tableau qui sera le 1er, unique et destiné à initialiser le panier
let clientItemChoice = [];
// déclaration tableau qui sera ce qu'on récupère du local storage appelé cartsDisplay et qu'on convertira en JSon
let savedItem = [];
// déclaration tableau qui sera un choix d'article/couleur non effectué donc non présent dans le cartsDisplay
let temporaryItem = [];
// déclaration tableau qui sera la concaténation des savedItem et de temporaryItem
let itemToPush = [];
//-------------------------------------------------------------------------
// fonction addFirstItem qui ajoute l'article choisi dans le tableau vierge
//-------------------------------------------------------------------------
function addFirstItem() {
  console.log(savedItem);
  //si savedItem est null c'est qu'il n'a pas été créé
  if (savedItem === null) {
    // pousse le produit choisit dans clientItemChoice
    clientItemChoice.push(articleClient);
    console.log(articleClient);
     // dernière commande, envoit clientItemChoice dans le local storage sous le nom de cartsDisplay de manière JSON stringifié
    return (localStorage.cartsDisplay = JSON.stringify(clientItemChoice));
  }
}

//-------------------------------------------------------------------------
// fonction addOtherItem qui ajoute l'article dans le tableau non vierge et fait un tri
//------------------------------------------------------------------------- 
function addOtherItem() {
  // vide/initialise itemToPush pour recevoir les nouvelles données
  itemToPush = [];
  // pousse le produit choisit dans temporaryItem
  temporaryItem.push(articleClient);
  // combine temporaryItem et/dans savedItem, ça s'appele itemToPush
  itemToPush = [...savedItem, ...temporaryItem];
  //fonction pour trier et classer les id puis les couleurs 
  itemToPush.sort(function triage(a, b) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    if (a.id = b.id){
      if (a.color < b.color) return -1;
      if (a.color > b.color) return 1;
    }
    return 0;
  });
  // vide/initialise temporaryItem maintenant qu'il a été utilisé
  temporaryItem = [];
  // dernière commande, envoit itemToPush dans le local storage sous le nom de cartsDisplay de manière JSON stringifié
  return (localStorage.cartsDisplay = JSON.stringify(itemToPush));
}


//--------------------------------------------------------------------
// fonction Panier qui ajuste la quantité si le produit est déja dans le tableau, sinon le rajoute si tableau il y a, ou créait le tableau avec un premier article choisi 
//--------------------------------------------------------------------
function carts() {
  // variable qui sera ce qu'on récupère du local storage appelé cartsDisplay et qu'on a convertit en JSon
  savedItem = JSON.parse(localStorage.getItem("cartsDisplay"));
  // si savedItem existe (si des articles ont déja été choisis et enregistrés par le client)
  if (savedItem) {
    for (let choice of savedItem) {
      //comparateur d'égalité des articles actuellement choisis et ceux déja choisis
      if (choice.id === id && choice.color === articleClient.color) {
        //information client
        alert("RAPPEL: Vous aviez déja choisit cet article.");
        // on modifie la quantité d'un produit existant dans le panier du localstorage
        //définition de quantityAdd qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
        const quantityadd = parseInt(choice.quantity) + parseInt(itemQuantity);
        // on convertit en JSON le résultat précédent dans la zone voulue
        choice.quantity = JSON.stringify(quantityadd);
        // dernière commande, on renvoit un nouveau cartsDisplay dans le localStorage
        return (localStorage.cartsDisplay = JSON.stringify(savedItem));
      }
    }
    // appel fonction addOtherItem si la boucle au dessus ne retourne rien donc n'a pas d'égalité
    return addOtherItem();
  }
  // appel fonction addFirstItem si savedItem n'existe pas
  return addFirstItem();
}