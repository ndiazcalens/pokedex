const pokemonList = document.querySelector("#pokemon-list");
const headerButtons = document.querySelectorAll(".btn-header"); 
let api_url = "https://pokeapi.co/api/v2/pokemon/"; 

for (let i=1; i <= 151; i++){
    fetch(api_url + i)                        // .then() ejecuta una función cuando una promesa se cumple (es decir, cuando una operación asíncrona se completa con éxito).
        .then( (response)=> response.json() ) //Cuando la API responde, convierte la respuesta a formato JSON.
        .then(data => showPokemon (data)) // Cuando los datos JSON están listos, muestra los datos del Pokémon en la página.
}

function showPokemon(data){

    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p> `); //`type` es la variable de iteración del `.map()` que accede al objeto dentro de `data.types`.
    types = types.join(''); // `.join('')` une todos los elementos del array en una sola string sin separadores.


    let dataId = (data.id).toString();
    if (dataId.length === 1){
        dataId = "00" + dataId;
    } else if (dataId.length === 2){
        dataId = "0" + dataId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${dataId}</p>
        <div class="pokemon-img">
            <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
        </div>
        <div class="pokemon-info">
            <div class="name-container">
                <p class="pokemon-id">#${dataId}</p>
                <h2 class="pokemon-name">${data.name}</h2>
            </div>
            <div class="pokemon-types">
                ${types}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${data.height}m</p>
                <p class="stat">${data.weight}kg</p>
            </div>
        </div>
    `;
    pokemonList.append(div); 
};


headerButtons.forEach(button => button.addEventListener("click", async (event) => {
    const buttonId = event.currentTarget.id;
  
    pokemonList.innerHTML = "";
  
    for (let i = 1; i <= 151; i++) {
      try{
        const response = await fetch(api_url + i); // feth hace la peticion a la api, await espera la respuesta antes de continuar
        const data = await response.json(); // transforma la data en json
  
        if (buttonId === "see-all") {
          showPokemon(data);
        } else {
          const types = data.types.map(type => type.type.name); // map crea un nuevo array con los nombres de los tipos de pokemon
          if (types.includes(buttonId)) {  // includes verifica si buttonId esta adentro del array de types 
            showPokemon(data);
          }
        }
      } catch(error){
        console.error("Error fetching pokemon", error); // maneja errores
      }
    }
  }));