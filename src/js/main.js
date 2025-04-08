const pokemonList = document.querySelector("#pokemon-list");
const headerButtons = document.querySelectorAll(".btn-header");
const detailPokemons = document.querySelector(".detail-view");
const pokemons = document.querySelectorAll(".pokemon");
const backButton = document.querySelector(".back-button");


let pokemonData =  [];
let evolutionsData = [];


let api_url = "https://pokeapi.co/api/v2/pokemon/"; 
let evolutions = "../data/evolutions.json";




fetch(evolutions).then(response => response.json()) // respuesta con informacion sobre la peticion ej si esta ok(200)
  .then(data =>{                                    //respuesta con los datos reales, tanto "response" como "data" son variables para almacenar las respuestas
    evolutionsData = data;
});

async function fetchAllPokemon() {
  const promises = [];
  for (let i = 1; i <= 151; i++) {
      promises.push(fetch(api_url + i).then(response => response.json()));  // Realiza una petición fetch a la API y agrega la promesa al array
  }
  
  pokemonData = await Promise.all(promises);  // Espera a que todas las promesas se resuelvan y obtiene los datos de los Pokémon
  pokemonData.forEach(data => showPokemon(data));   // Itera sobre los datos de los Pokémon y llama a la función showPokemon para cada uno
}

fetchAllPokemon();

function showPokemon(data){

    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p> `); //`type` es la variable de iteración del `.map()` que accede al objeto dentro de `data.types`.
    types = types.join('');                                         // `.join('')` une todos los elementos del array en una sola string sin separadores.


    let dataId = (data.id).toString();  //convierte el id de numero a string

    if (dataId.length === 1){           //le agrega los ceros correspondientes para el formato
        dataId = "00" + dataId;       
    } else if (dataId.length === 2){
        dataId = "0" + dataId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.setAttribute("data-key", dataId);  // Le agregamos un atributo para identificarlo
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
      
      const dataKey = div.getAttribute("data-key")

      pokemonList.innerHTML = "";

      let detailView = "";
      
      if (evolutionsData[dataKey.replace(/^0+/, "")] != null){

        detailView= `
            
              <div class="back-button">
                <button class="btn btn-header arrow-btn" id="see-all2"></button>
              </div>
              
              <div class= "evolution-chain">
                <div class= "original">
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
                  
                </div>`

        let evolutionTo= evolutionsData[data.id].evolves_to;  //datakey elimina los ceros a la izquierda, ej 001-->1
        let evolutionFrom = evolutionsData[data.id].evolves_from;
        console.log(data.id, evolutionTo, evolutionFrom);

        
        
        for (let i=0; i<151; i++){

              //api                   //json
          if(pokemonData[i].name == evolutionsData[data.id].name){

            console.log(pokemonData[i].name, evolutionsData[data.id].name, i+1, data.id);//para checkear que datos estoy usando

            if(evolutionTo != null && evolutionFrom == null){     console.log("b1")
              console.log(evolutionTo.length)
              detailView += `
                <div class="evolutions-tittle">EVOLUTIONS</div>
                `
              for(let x=0; x < evolutionTo.length; x++){ 
                console.log(pokemonData[2], evolutionTo[0], evolutionTo[1])
                //se le resta 1 unidad asi se ajusta con el indice del for, teniendo en cuenta que el indice del for arranca de 0 y el id en los datos arranca de 1
                
                detailView +=` 
                
                <div class="evolutions">
              
                    <div class="pokemon-detail">
                      <p class="pokemon-id-back">#${pokemonData[(evolutionTo[x])-1].id.toString().padStart(3, "0")}</p>
                      <div class="pokemon-img">
                          <img src="${pokemonData[(evolutionTo[x])-1].sprites.other["official-artwork"].front_default}" alt="${pokemonData[(evolutionTo[x]-1)].name}">
                      </div>
                      <div class="pokemon-info">
                          <div class="name-container">
                              <p class="pokemon-id">#${pokemonData[(evolutionTo[x])-1].id.toString().padStart(3, "0")}</p>
                              <h2 class="pokemon-name">${pokemonData[(evolutionTo[x])-1].name}</h2>
                          </div>
                          <div class="pokemon-types">
                              ${types}
                          </div>
                          <div class="pokemon-stats">
                              <p class="stat">${pokemonData[(evolutionTo[x])-1].height}m</p>
                              <p class="stat">${pokemonData[(evolutionTo[x])-1].weight}kg</p>
                          </div>
                      </div>
                    </div>
                  
                
              `
            }
            }


            if(evolutionTo != null && evolutionFrom != null){
              console.log("b2")
              detailView += ` 
                  <div class= chain-section>
                    <div class="evolutions-container-from">
                      <div class="evolutions-tittle-from">EVOLVES FROM</div>`
              
              for(let x=0; x < evolutionFrom.length; x++){
                detailView += `
                  <div class="evolutions">
              
                  <div class="pokemon-detail">
                    <p class="pokemon-id-back">#${pokemonData[(evolutionFrom[x])-1].id.toString().padStart(3, "0")}</p>
                    <div class="pokemon-img">
                        <img src="${pokemonData[(evolutionFrom[x])-1].sprites.other["official-artwork"].front_default}" alt="${pokemonData[(evolutionFrom[x])-1].name}">
                    </div>
                    <div class="pokemon-info">
                        <div class="name-container">
                            <p class="pokemon-id">#${pokemonData[(evolutionFrom[x])-1].id.toString().padStart(3, "0")}</p>
                            <h2 class="pokemon-name">${pokemonData[(evolutionFrom[x])-1].name}</h2>
                        </div>
                        <div class="pokemon-types">
                            ${types}
                        </div>
                        <div class="pokemon-stats">
                            <p class="stat">${pokemonData[(evolutionFrom[x])-1].height}m</p>
                            <p class="stat">${pokemonData[(evolutionFrom[x])-1].weight}kg</p>
                        </div>
                    </div>
                  </div>
                  `
                }
              detailView += ` 
                  </div>
                </div>
                <div class="evolutions-container-to">
                <div class="evolutions-tittle-to">EVOLVES TO</div>
                `
              for(let x=0; x < evolutionTo.length; x++){
                detailView += `
                  <div class="evolutions">
              
                    <div class="pokemon-detail">
                      <p class="pokemon-id-back">#${pokemonData[(evolutionTo[x])-1].id.toString().padStart(3, "0")}</p>
                      <div class="pokemon-img">
                          <img src="${pokemonData[(evolutionTo[x])-1].sprites.other["official-artwork"].front_default}" alt="${pokemonData[(evolutionTo[x]-1)].name}">
                      </div>
                      <div class="pokemon-info">
                          <div class="name-container">
                              <p class="pokemon-id">#${pokemonData[(evolutionTo[x])-1].id.toString().padStart(3, "0")}</p>
                              <h2 class="pokemon-name">${pokemonData[(evolutionTo[x])-1].name}</h2>
                          </div>
                          <div class="pokemon-types">
                              ${types}
                          </div>
                          <div class="pokemon-stats">
                              <p class="stat">${pokemonData[(evolutionTo[x])-1].height}m</p>
                              <p class="stat">${pokemonData[(evolutionTo[x])-1].weight}kg</p>
                          </div>
                      </div>
                    </div>
      
                </div>
                `
              }
              detailView += `
                </div>
                </div>
                </div>
                `
            
            }


            if(evolutionTo == null && evolutionFrom != null){
              console.log("b3", evolutionFrom)

              detailView += `
                <div class="evolutions-tittle">EVOLVES FROM</div>
                `

              for(let x=0; x < evolutionFrom.length; x++){
                detailView += `
                  <div class="evolutions">
              
                  <div class="pokemon-detail">
                    <p class="pokemon-id-back">#${pokemonData[(evolutionFrom[x])-1].id.toString().padStart(3, "0")}</p>
                    <div class="pokemon-img">
                        <img src="${pokemonData[(evolutionFrom[x])-1].sprites.other["official-artwork"].front_default}" alt="${pokemonData[(evolutionFrom[x])-1].name}">
                    </div>
                    <div class="pokemon-info">
                        <div class="name-container">
                            <p class="pokemon-id">#${pokemonData[(evolutionFrom[x])-1].id.toString().padStart(3, "0")}</p>
                            <h2 class="pokemon-name">${pokemonData[(evolutionFrom[x])-1].name}</h2>
                        </div>
                        <div class="pokemon-types">
                            ${types}
                        </div>
                        <div class="pokemon-stats">
                            <p class="stat">${pokemonData[(evolutionFrom[x])-1].height}m</p>
                            <p class="stat">${pokemonData[(evolutionFrom[x])-1].weight}kg</p>
                        </div>
                    </div>
                  </div>
                  `
              }
            
            }



             
          };
          
        
        }
      }

      detailPokemons.innerHTML = detailView; 

      const backButton = document.getElementById("see-all2");
      if (backButton) {                                             // Verifica que el botón exista
        backButton.addEventListener("click", () => {  
          detailPokemons.innerHTML = "";                            // Limpia el contenedor de detalles del Pokémon y la lista
          pokemonList.innerHTML = "";
          pokemonData.forEach(data => showPokemon(data));           // Vuelve a mostrar todos los Pokémon recorriendo el array
        });
      }

      
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


