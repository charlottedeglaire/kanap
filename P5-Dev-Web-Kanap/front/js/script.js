class Article{
    constructor(jsonArticle){
        jsonArticle && Object.assign(this, jsonArticle);
    }
}
  
//------------------------------------------------------------------------
// Récupération des produits de l'api
//------------------------------------------------------------------------ 
  fetch("http://localhost:3000/api/products")
  // quand tu as la réponse donne le résultat en json.
  .then( data => data.json())
  // ce que l'on a reçu et qui a été traité en json sera appelé jsonListArticle
  .then(jsonListArticle => {
    // boucle pour chaque indice(nommé 'jsonArticle') dans jsonListArticle
    for (let jsonArticle of jsonListArticle) {
        let article = new Article(jsonArticle);
      document.querySelector("#items").innerHTML += `<a href="./product.html?id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
      </article>
    </a>`;
  }
  })
  