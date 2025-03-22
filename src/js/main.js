const pokemonList = document.querySelector("#pokemon-list");
const headerButtons = document.querySelectorAll(".btn-header");
const detailPokemons = document.querySelector(".detail-view");

let api_url = "https://pokeapi.co/api/v2/pokemon/"; 

async function fetchAllPokemon() {
  const promises = [];
  for (let i = 1; i <= 151; i++) {
      promises.push(fetch(api_url + i).then(response => response.json()));  // Realiza una petición fetch a la API y agrega la promesa al array
  }
  
  const pokemonData = await Promise.all(promises);  // Espera a que todas las promesas se resuelvan y obtiene los datos de los Pokémon
  pokemonData.forEach(data => showPokemon(data));   // Itera sobre los datos de los Pokémon y llama a la función showPokemon para cada uno
}

fetchAllPokemon();

function showPokemon(data){

    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p> `);      //`type` es la variable de iteración del `.map()` que accede al objeto dentro de `data.types`.
    types = types.join('');                                         // `.join('')` une todos los elementos del array en una sola string sin separadores.


    let dataId = (data.id).toString();
    if (dataId.length === 1){
        dataId = "00" + dataId;
    } else if (dataId.length === 2){
        dataId = "0" + dataId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.setAttribute("data-name", data.name);  // Le agregamos un atributo para identificarlo
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

    div.addEventListener("click", ()=>{
      const nameId = div.getAttribute("data-name")

      pokemonList.innerHTML = "";
      
      const detailView= `
        <div class="pokemon-detail">
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
        </div>  
      `
      detailPokemons.innerHTML = detailView;

    })
    pokemonList.append(div);
  
};

headerButtons.forEach(button => button.addEventListener("click", async (event) => {

  const buttonId = event.currentTarget.id;                  // Obtiene el ID del botón clickeado

  detailPokemons.innerHTML = "";
  pokemonList.innerHTML = "";                             // Limpia la lista de Pokémon

  const promises = [];                                      // Crea un array para almacenar las promesas de las peticiones fetch
  for (let i = 1; i <= 151; i++) {
    promises.push(fetch(api_url + i).then(response => response.json())); // Agrega promesas al array
  }

  try {
    const pokemonData = await Promise.all(promises);            // Espera a que todas las promesas se resuelvan

    pokemonData.forEach(data => {                               // Itera sobre los datos de los Pokémon
      if (buttonId === "see-all") {                             // Si el botón es "see-all"
        showPokemon(data);                                      // Muestra todos los Pokémon
      } else {                                                  // Si el botón es un tipo de Pokémon
        const types = data.types.map(type => type.type.name);   // Obtiene los nombres de los tipos del Pokémon
        if (types.includes(buttonId)) {                         // Si el Pokémon tiene el tipo del botón
          showPokemon(data);                                    // Muestra el Pokémon
        }
      }
    });
  } catch (error) {                                             // Maneja errores
    console.error("Error fetching pokemon", error);
  }
}));
