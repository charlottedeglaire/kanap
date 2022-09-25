const page = document.location.href;
//----------------------------------------------------------------
// Récupération des produits de l'api
//----------------------------------------------------------------
// appel de la ressource api product (voir script.js) si on est sur la page panier
if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
  .then((data) => data.json())
  .then((productObject) => {
      // appel de la fonction cartsDisplay
      cartsDisplay(productObject);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
  });
} else {
  console.log("sur page confirmation");
}
//--------------------------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function cartsDisplay(index) {
  // on récupère le panier converti
  let carts = JSON.parse(localStorage.getItem("cartsDisplay"));
  // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
   if (carts && carts.length != 0) {
    // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
    for (let choice of carts) {
      console.log(choice);
      for (let g = 0, h = index.length; g < h; g++) {
        if (choice.id === index[g]._id) {
          // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
          choice.name = index[g].name;
          choice.price = index[g].price;
          choice.image = index[g].imageUrl;
          choice.description = index[g].description;
          choice.alt = index[g].altTxt;
        }
      }
    }
    // ici panier à les valeurs du local storage + les valeurs définies au dessus
    //on demande à display() de jouer avec les données carts 
    display(carts);
  } else {
    // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  // reste à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
  quantityModif();
  deleted();
}


//--------------------------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------
function display(indexe) {
  // on déclare et on pointe la zone d'affichage
  let cartsZone = document.querySelector("#cart__items");
  // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
  cartsZone.innerHTML += indexe.map((choice) => 
  `<article class="cart__item" data-id="${choice.id}" data-color="${choice.color}" data-quantity="${choice.quantity}" data-price="${choice.price}"> 
    <div class="cart__item__img">
      <img src="${choice.image}" alt="${choice.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choice.name}</h2>
        <span>color : ${choice.color}</span>
        <p data-price="${choice.price}">${choice.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choice.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choice.id}" data-color="${choice.color}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join("");
    // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
    totalProduct();
}


//--------------------------------------------------------------
// fonction quantityModif on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------
function quantityModif() {
    const cart = document.querySelectorAll(".cart__item");
    /* manière de regarder ce que l'on a d'affiché dynamiquement grace au dataset
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné */
    cart.forEach((cart) => {
      cart.addEventListener("change", (eq) => {
        // vérification d'information de la valeur du clic et son positionnement dans les articles
        let carts = JSON.parse(localStorage.getItem("cartsDisplay"));
        // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
        for (article of carts)
          if (
            article.id === cart.dataset.id &&
            cart.dataset.color === article.color
          ) {
            article.quantity = eq.target.value;
            localStorage.cartsDisplay = JSON.stringify(carts);
            // on met à jour le dataset quantité
            cart.dataset.quantity = eq.target.value;
            // on joue la fonction pour actualiser les données
            totalProduct();
          }
      });
    });
  }



  //--------------------------------------------------------------
  // fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
  //--------------------------------------------------------------
  function deleted() {
    // déclaration de variables
    const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
    // pour chaque élément cartdelet
    cartdelete.forEach((cartdelete) => {
      // On écoute s'il y a un clic dans l'article concerné
      cartdelete.addEventListener("click", () => {
        // appel de la ressource du local storage
        let carts = JSON.parse(localStorage.getItem("cartsDisplay"));
        for (let d = 0, c = carts.length; d < c; d++)
          if (
            carts[d].id === cartdelete.dataset.id &&
            carts[d].color === cartdelete.dataset.color
          ) {
            // déclaration de variable utile pour la suppression
            const num = [d];
            let newCarts = JSON.parse(localStorage.getItem("cartsDisplay"));
            //suppression de 1 élément à l'indice num
            newCarts.splice(num, 1);
            //affichage informatif
            if (newCarts && newCarts.length == 0) {
              // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
              document.querySelector("#totalQuantity").innerHTML = "0";
              document.querySelector("#totalPrice").innerHTML = "0";
              document.querySelector("h1").innerHTML =
                "Vous n'avez pas d'article dans votre panier";
            }
            // on renvoit le nouveau panier converti dans le local storage et on joue la fonction
            localStorage.cartsDisplay = JSON.stringify(newCarts);
            totalProduct();
            // on recharge la page qui s'affiche sans le produit grace au nouveau panier
            return location.reload();
          }
      });
    });
  }

//--------------------------------------------------------------
// fonction ajout nombre total produit et coût total
//--------------------------------------------------------------
  function totalProduct() {
    // déclaration variable en tant que nombre
    let totalArticle = 0;
    // déclaration variable en tant que nombre
    let totalPrice = 0;
    // on pointe l'élément
    const cart = document.querySelectorAll(".cart__item");
    // pour chaque élément cart
    cart.forEach((cart) => {
      //je récupère les quantités des produits grâce au dataset
      totalArticle += JSON.parse(cart.dataset.quantity);
      // je créais un opérateur pour le total produit grâce au dataset
      totalPrice += cart.dataset.quantity * cart.dataset.price;
    });
    // je pointe l'endroit d'affichage nombre d'article
    document.getElementById("totalQuantity").textContent = totalArticle;
    // je pointe l'endroit d'affichage du prix total
    document.getElementById("totalPrice").textContent = totalPrice;
  }


//--------------------------------------------------------------
//  formulaire
//--------------------------------------------------------------
// les données du client seront stockées dans ce tableau pour la commande sur page panier
  if (page.match("cart")) {
    var contactClient = {};
    localStorage.contactClient = JSON.stringify(contactClient);
    // on pointe des éléments input, on attribut à certains la même classe, ils régiront pareil aux différantes regex
    // on pointe les input nom prénom et ville
    var firstName = document.querySelector("#firstName");
    firstName.classList.add("regex_texte");
    var lastName = document.querySelector("#lastName");
    lastName.classList.add("regex_texte");
    var city = document.querySelector("#city");
    city.classList.add("regex_texte");
    // on pointe l'input adresse
    var adress = document.querySelector("#address");
    adress.classList.add("regex_adress");
    // on pointe l'input email
    var email = document.querySelector("#email");
    email.classList.add("regex_email");
    // on pointe les élément qui ont la classe .regex_texte
    var regexTexte = document.querySelectorAll(".regex_texte");
    // modification du type de l'input type email à text
    document.querySelector("#email").setAttribute("type", "text");
  }


//--------------------------------------------------------------
//regex 
//--------------------------------------------------------------
// /^ début regex qui valide les caratères
  let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
  let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
  let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//--------------------------------------------------------------
// Ecoute et attribution de point si ces champs sont ok d'après la regex
//--------------------------------------------------------------
  if (page.match("cart")) {
    regexTexte.forEach((regexTexte) =>
      regexTexte.addEventListener("input", (e) => {
        // value sera la valeur de l'input en dynamique
        value = e.target.value;
        // regNormal sera la valeur de la réponse regex, 0 ou -1
        let regNormal = value.search(regexLettre);
        if (regNormal === 0) {
          contactClient.firstName = firstName.value;
          contactClient.lastName = lastName.value;
          contactClient.city = city.value;
        }
        if (
          contactClient.city !== "" &&
          contactClient.lastName !== "" &&
          contactClient.firstName !== "" &&
          regNormal === 0
        ) {
          contactClient.regexNormal = 3;
        } else {
          contactClient.regexNormal = 0;
        }
        localStorage.contactClient = JSON.stringify(contactClient);
        valideClic();
      })
    );
  }
//------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
  texteInfo(regexLettre, "#firstNameErrorMsg", firstName);
  texteInfo(regexLettre, "#lastNameErrorMsg", lastName);
  texteInfo(regexLettre, "#cityErrorMsg", city);
//--------------------------------------------------------------
// Ecoute et attribution de point si ces champs sont ok d'après la regex
//--------------------------------------------------------------
  if (page.match("cart")) {
    let regexAdress = document.querySelector(".regex_adress");
    regexAdress.addEventListener("input", (e) => {
      // value sera la valeur de l'input en dynamique
      value = e.target.value;
      // regNormal sera la valeur de la réponse regex, 0 ou -1
      let regAdress = value.search(regexChiffreLettre);
      if (regAdress == 0) {
        contactClient.address = adress.value;
      }
      if (contactClient.address !== "" && regAdress === 0) {
        contactClient.regexAdress = 1;
      } else {
        contactClient.regexAdress = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      valideClic();
    });
  }

//------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
  texteInfo(regexChiffreLettre, "#addressErrorMsg", adress);
//--------------------------------------------------------------
// Ecoute et attribution de point si ce champ est ok d'après les regex
//--------------------------------------------------------------
  if (page.match("cart")) {
    let regexEmail = document.querySelector(".regex_email");
    regexEmail.addEventListener("input", (e) => {
      // value sera la valeur de l'input en dynamique
      value = e.target.value;
      // mon adresse doit avoir cette forme pour que je puisse la valider
      let regMatch = value.match(regMatchEmail);
      // regValide sera la valeur de la réponse regex, 0 ou -1
      let regValide = value.search(regValideEmail);
      if (regValide === 0 && regMatch !== null) {
        contactClient.email = email.value;
        contactClient.regexEmail = 1;
      } else {
        contactClient.regexEmail = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      valideClic();
    });
  }

//------------------------------------
// texte sous champ email
//------------------------------------
  if (page.match("cart")) {
    email.addEventListener("input", (e) => {
      // value sera la valeur de l'input en dynamique
      value = e.target.value;
      let regMatch = value.match(regMatchEmail);
      let regValide = value.search(regValideEmail);
      // si value est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
      if (value === "" && regMatch === null) {
        document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
      } 
    });
  }

//--------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//--------------------------------------------------------------
  function texteInfo(regex, pointage, zoneEcoute) {
        if (page.match("cart")) {
        zoneEcoute.addEventListener("input", (e) => {
        // value sera la valeur de l'input en dynamique
        valeur = e.target.value;
        index = valeur.search(regex);
        // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
        if (valeur === "" && index != 0) {
          document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
          document.querySelector(pointage).style.color = "white";
          // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
        } else if (valeur !== "" && index != 0) {
          document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
          document.querySelector(pointage).style.color = "white";
        } 
      });
    }
  }


//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------
  let order = document.querySelector("#order");
  // la fonction sert à valider le clic de commande de manière interactive
  function valideClic() {
    let contactRef = JSON.parse(localStorage.getItem("contactClient"));
    let somme =
      contactRef.regexNormal + contactRef.regexAdress + contactRef.regexEmail;
    if (somme === 5) {
      order.removeAttribute("disabled", "disabled");
      document.querySelector("#order").setAttribute("value", "Commander !");
    } else {
      order.setAttribute("disabled", "disabled");
      document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
    }
  }

//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
  if (page.match("cart")) {
    order.addEventListener("click", (e) => {
      // empeche de recharger la page on prévient le reload du bouton
      e.preventDefault();
      valideClic();
      sendPack();
    });
  }

//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------
// définition du panier qui ne comportera que les id des produits choisi du local storage
  let cartsId = [];
  function tableId() {
  // appel des ressources
  let carts = JSON.parse(localStorage.getItem("cartsDisplay"));
  // récupération des id produit dans cartsId
  if (carts && carts.length > 0) {
    for (let indice of carts) {
      cartsId.push(indice.id);
    }
  } else {
    console.log("le panier est vide");
    document.querySelector("#order").setAttribute("value", "Panier vide !");
  }
  }

//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------
  let contactRef;
  let finalOrder;
  function pack() {
    contactRef = JSON.parse(localStorage.getItem("contactClient"));
    // définition de l'objet commande
    finalOrder = {
      contact: {
        firstName: contactRef.firstName,
        lastName: contactRef.lastName,
        address: contactRef.address,
        city: contactRef.city,
        email: contactRef.email,
      },
      products: cartsId,
    };
  }

//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
  function sendPack() {
    tableId();
  // vision sur le paquet que l'on veut envoyer
    pack();
    console.log(finalOrder);
    let somme = contactRef.regexNormal + contactRef.regexAdress + contactRef.regexEmail;
    // si le cartsId contient des articles et que le clic est autorisé
    if (cartsId.length != 0 && somme === 5) {
      // envoi à la ressource api
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalOrder),
      })
        .then((res) => res.json())
        .then((data) => {
          // envoyé à la page confirmation
          window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
        })
        .catch(function (err) {
          console.log(err);
          alert("erreur");
        });
    }
  }

//------------------------------------------------------------
// fonction affichage autoinvoquée du numéro de commande et vide du storage lorsque l'on est sur la page confirmation
//------------------------------------------------------------
  (function Order() {
    if (page.match("confirmation")) {
      sessionStorage.clear();
      localStorage.clear();
      // valeur du numero de commande
      let numCom = new URLSearchParams(document.location.search).get("commande");
      // merci et mise en page
      document.querySelector("#orderId").innerHTML = `<br>${numCom}<br>Merci pour votre achat`;
      console.log("valeur de l'orderId venant de l'url: " + numCom);
      //réinitialisation du numero de commande
      numCom = undefined;
    } else {
      console.log("sur page cart");
    }
  })();
