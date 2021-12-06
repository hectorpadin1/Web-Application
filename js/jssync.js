"use strict"

var modal = document.getElementById("myModal");
var btn = document.querySelector(".specificbutton");
var span = document.getElementsByClassName("close")[0];


window.onload = (e) => {
    getDataSync('https://pokeapi.co/api/v2/type')
    .then(response => {
      typeDataLoaded(response);
    }).catch(error => {
      console.log(error.message);
    });
    document.querySelector("#submit").onclick = searchClicked;
};

span.onclick = async function() {
  modal.style.display = "none";
  document.getElementById("pokemon-image").src = "img/pokeball_PNG21.png";
  document.getElementById("pokemon-image").alt = "Pokéball";
  document.getElementById("national-pokedex").innerHTML = "";
  document.getElementById("pokemon-region").innerHTML = "";
  document.getElementById("pokemon-type").innerHTML = "";
  document.getElementById("pokemon-abilities").innerHTML = "";
  document.getElementById("total-base-stats").innerHTML = "";
  document.querySelector(".pokemon-base-label").innerHTML = "";;
  document.querySelector(".stat-hp-gauge").innerHTML = "";;
  document.querySelector(".stat-attack-gauge").innerHTML = "";;
  document.querySelector(".stat-defense-gauge").innerHTML = "";;
  document.querySelector(".stat-special-attack-gauge").innerHTML = "";;
  document.querySelector(".stat-special-defense-gauge").innerHTML = "";;
  document.querySelector(".stat-speed-gauge").innerHTML = "";;
}


function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function typeDataLoaded(data) {
  let types = data['results'];
  let html = '';
  let aux = '';
  var x = 1;

  types.forEach(type =>{
    let name = type['name'];
    html += "<option label=\"" + jsUcfirst(name) +"\" value=\"" + x++ +"\">" + jsUcfirst(name) + "</option>";
  });
  html += "<option label='All' value=\"" + x++ + "\">All</option>";
  let typesList = document.querySelector("#type");
  typesList.innerHTML += html;
}


async function renderImages(array) {
  let htmlSegment;

  if (array[0] != null) {
    
    var pokedata = await getDataSync(array[0])
      .then(json => {
        return json;
      }).catch(error => {
        throw new Error(error.message);
    });

    pokedata.sprites.front_default != null ?
    htmlSegment = `<img src='${pokedata.sprites.front_default}' alt='${array[1]}'/>`
    : htmlSegment = `<img src='img/not_avaliable.png' width="100" height="100" alt='Image not avaliable'/>`;
  } else {
    htmlSegment = `<img src='img/not_avaliable.png' width="100" height="100" alt='Image not avaliable'/>`;
  }
  htmlSegment += `<p>${array[1]}</p>`;
  htmlSegment += `<button id='${array[1]}' class="specificbutton" onClick='entryClicked(this.id);'>More Info</button>`;
  let sm = document.querySelector("." + array[1]);
  sm.innerHTML += htmlSegment;
}

function renderPokemonNames(pokemons) {
    let html = '';
    let urlList = [];

    pokemons.forEach(object => {
      let htmlSegment =`
        <div class="pokemon">   
        <div class="${object.pokemon.name}">
        </div>     
        </div>
        `;
      urlList.push([object.pokemon.url, object.pokemon.name]);
      html += htmlSegment;
    });
    let info = document.querySelector('.info');
    info.innerHTML = html;

    return urlList;
}

async function getDataSync(url) {
  var response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.status);
  }

  const json = await response.json();
  return json;
}

async function renderAllPokemonNames(pokemons) {
  let html = '';
    let urlList = [];

    pokemons.forEach(pokemon => {
      let htmlSegment =`
        <div class="pokemon">   
        <div class="${pokemon.name}">
        </div>     
        </div>
        `;
      urlList.push([pokemon.url, pokemon.name]);
      html += htmlSegment;
    });
    let info = document.querySelector('.info');
    info.innerHTML = html;

    return urlList;
}

async function searchClicked() {
  let types = document.querySelector("#type");
  let typeValue = types[types.selectedIndex].value;

  if (typeValue != 21) {
    var urlList = await getDataSync("https://pokeapi.co/api/v2/type/" + typeValue)
      .then(json => {
        return renderPokemonNames(json['pokemon']);
      }).then(urlList => {
        urlList.forEach(pokemon => {
          renderImages(pokemon);
        });
      }).catch(error => {
        let info = document.querySelector('.info');
        info.innerHTML = '';
        manageError(error.message);
    });

  } else {
    
    var count = await getDataSync("https://pokeapi.co/api/v2/pokemon")
      .then(json => {
        return json['count'];
      }).catch(error => {
        let info = document.querySelector('.info');
        info.innerHTML = '';
        manageError(error.message);
        return;
    });

    var urlList = await getDataSync("https://pokeapi.co/api/v2/pokemon?offset=0&limit=" + count)
      .then(json => {
        return renderAllPokemonNames(json['results']);
      }).then(urlList => {
        urlList.forEach(pokemon => {
          renderImages(pokemon);
        });
      }).catch(error => {
        let info = document.querySelector('.info');
        info.innerHTML = '';
        manageError(error.message);
    });
  }
}

function manageError(status) {

  if (status=='404') {
    let html = `<center>
      <p class="error">¡Vaya...! parece que no hemos podido encontrar ningún pokémon para el tipo indicado.</p>
      <img src='img/pikachu_sad.png' width="150" height="100" alt='Error 404'/>
      </center>`;
    let response_error = document.querySelector('.info');
    response_error.innerHTML = html;
  } else if (status=='500') {
    let html = `<center>
      <p class="error">Parece que algo no ha ido bien. El recurso al que estás intentando acceder no está disponible.</p>
      <img src='img/img/pokemons_not_found.jpg' width="100" height="100" alt='Error 404'/>
      </center>`;
    let response_error = document.querySelector('.info');
    response_error.innerHTML = html;
  }
}


async function renderPokemonData(data) {
  const pokemon = {};

  pokemon['artwork'] = data.sprites.other['official-artwork']['front_default'];
  pokemon['name'] = data.name;
  pokemon['pokedex'] = data.id;

  document.getElementById("pokemon-image").alt = pokemon['name'];

  document.getElementById("national-pokedex").innerHTML = pokemon.pokedex;

  let pokemonRegion = document.getElementById("pokemon-region");
  
  if (pokemon.pokedex >= 1 && pokemon.pokedex <= 151){
    pokemonRegion.innerHTML = " Kanto, Generation I";
  } else if (pokemon.pokedex >= 152 && pokemon.pokedex <= 251){
    pokemonRegion.innerHTML = " Johto, Generation II";
  } else if (pokemon.pokedex >= 252 && pokemon.pokedex <= 386){
    pokemonRegion.innerHTML = " Hoenn, Generation III";
  } else if (pokemon.pokedex >= 387 && pokemon.pokedex <= 493){
    pokemonRegion.innerHTML = " Sinnoh, Generation IV";
  } else if (pokemon.pokedex >= 494 && pokemon.pokedex <= 649){
    pokemonRegion.innerHTML = " Unova, Generation V";
  } else if (pokemon.pokedex >= 650 && pokemon.pokedex <= 721){
    pokemonRegion.innerHTML = " Kalos, Generation VI";
  } else if (pokemon.pokedex >= 722 && pokemon.pokedex <= 808){
    pokemonRegion.innerHTML = " Alola, Generation VII";
  }

  pokemon['type'] = data.types.map(type => type.type.name).join(", ");
  document.getElementById("pokemon-type").innerHTML = pokemon.type;

  pokemon['abilities'] = data.abilities.map(ability => ability.ability.name).join(", ");
  document.getElementById("pokemon-abilities").innerHTML = pokemon.abilities;


  pokemon["baseHp"] = data.stats[0].base_stat;
  pokemon["baseAttack"] = data.stats[1].base_stat;
  pokemon["baseDefense"] = data.stats[2].base_stat;
  pokemon["baseSpecialAttack"] = data.stats[3].base_stat;
  pokemon["baseSpecialDefense"] = data.stats[4].base_stat;
  pokemon["baseSpeed"] = data.stats[5].base_stat;
      
  let sumOfBaseStats = pokemon.baseHp + pokemon.baseAttack + pokemon.baseDefense + pokemon.baseSpecialAttack + pokemon.baseSpecialDefense + pokemon.baseSpeed;
  let totalBaseStats = document.getElementById("total-base-stats");
  totalBaseStats.innerHTML = parseInt(sumOfBaseStats);

  let pokemonBaseLabel = document.querySelector(".pokemon-base-label");
  if (sumOfBaseStats == 600){
    pokemonBaseLabel.innerHTML = "Pseudo-Legendary";
    pokemonBaseLabel.style.color = "black";
    pokemonBaseLabel.style.backgroundColor = "rgb(0, 0, 0, 0.1)";
    pokemonBaseLabel.style.border = "1px solid #aaa";
  } else if (sumOfBaseStats >= 601){
    pokemonBaseLabel.innerHTML = "Legendary";
    pokemonBaseLabel.style.color = "white";
    pokemonBaseLabel.style.backgroundColor = "rgb(0, 0, 0, 0.6)";
    pokemonBaseLabel.style.border = "1px solid #aaa";
  } else {
    pokemonBaseLabel.innerHTML = "";
    pokemonBaseLabel.style.color = "";
    pokemonBaseLabel.style.backgroundColor = "";
    pokemonBaseLabel.style.border = "";
  }

  const hpGauge = document.querySelector(".stat-hp-gauge");
  const attackGauge = document.querySelector(".stat-attack-gauge");
  const defenseGauge = document.querySelector(".stat-defense-gauge");
  const specialAttackGauge = document.querySelector(".stat-special-attack-gauge");
  const specialDefenseGauge = document.querySelector(".stat-special-defense-gauge");
  const speedGauge = document.querySelector(".stat-speed-gauge");

  if (pokemon.baseHp <= "60"){
    hpGauge.style.backgroundColor = "#f52727";
    hpGauge.style.borderRadius = "0.3125em";
    hpGauge.innerHTML = "Low";
  } else if (pokemon.baseHp >= "61" && pokemon.baseHp < "90" ){
    hpGauge.style.backgroundColor = "#edcd40"
    hpGauge.style.borderRadius = "0.3125em";
    hpGauge.innerHTML = "Average";
  } else if (pokemon.baseHp >= "90" && pokemon.baseHp < "120"){
    hpGauge.style.backgroundColor = "#08c486";
    hpGauge.style.borderRadius = "0.3125em";
    hpGauge.innerHTML = "High";
  } else if(pokemon.baseHp >= "120"){
    hpGauge.style.backgroundColor = "#74a1a3";
    hpGauge.style.borderRadius = "0.3125em";
    hpGauge.innerHTML = "Extreme";
  } else{
    hpGauge.style.display = "none";
    hpGauge.innerHTML = "";
  }

  if (pokemon.baseAttack <= "60"){
    attackGauge.style.backgroundColor = "#f52727";
    attackGauge.style.borderRadius = "0.3125em";
    attackGauge.innerHTML = "Low";
  } else if (pokemon.baseAttack >= "61" && pokemon.baseAttack < "90" ){
    attackGauge.style.backgroundColor = "#edcd40"
    attackGauge.style.borderRadius = "0.3125em";
    attackGauge.innerHTML = "Average";
  } else if (pokemon.baseAttack >= "90" && pokemon.baseAttack < "120"){
    attackGauge.style.backgroundColor = "#08c486";
    attackGauge.style.borderRadius = "0.3125em";
    attackGauge.innerHTML = "High";
  } else if(pokemon.baseAttack >= "120"){
    attackGauge.style.backgroundColor = "#74a1a3";
    attackGauge.style.borderRadius = "0.3125em";
    attackGauge.innerHTML = "Extreme";
  } else{
    attackGauge.style.display = "none";
    attackGauge.innerHTML = "";
  }

  if (pokemon.baseDefense <= "60"){
    defenseGauge.style.backgroundColor = "#f52727";
    defenseGauge.style.borderRadius = "0.3125em";
    defenseGauge.innerHTML = "Low";
  } else if (pokemon.baseDefense >= "61" && pokemon.baseDefense < "90" ){
    defenseGauge.style.backgroundColor = "#edcd40"
    defenseGauge.style.borderRadius = "0.3125em";
    defenseGauge.innerHTML = "Average";
  } else if (pokemon.baseDefense >= "90" && pokemon.baseDefense < "120"){
    defenseGauge.style.backgroundColor = "#08c486";
    defenseGauge.style.borderRadius = "0.3125em";
    defenseGauge.innerHTML = "High";
  } else if(pokemon.baseDefense >= "120"){
    defenseGauge.style.backgroundColor = "#74a1a3";
    defenseGauge.style.borderRadius = "0.3125em";
    defenseGauge.innerHTML = "Extreme";
  } else{
    defenseGauge.style.display = "none";
    defenseGauge.innerHTML = "";
  }

  if (pokemon.baseSpecialAttack <= "60"){
    specialAttackGauge.style.backgroundColor = "#f52727";
    specialAttackGauge.style.borderRadius = "0.3125em";
    specialAttackGauge.innerHTML = "Low";
  } else if (pokemon.baseSpecialAttack >= "61" && pokemon.baseSpecialAttack < "90" ){
    specialAttackGauge.style.backgroundColor = "#edcd40"
    specialAttackGauge.style.borderRadius = "0.3125em";
    specialAttackGauge.innerHTML = "Average";
  } else if (pokemon.baseSpecialAttack >= "90" && pokemon.baseSpecialAttack < "120"){
    specialAttackGauge.style.backgroundColor = "#08c486";
    specialAttackGauge.style.borderRadius = "0.3125em";
    specialAttackGauge.innerHTML = "High";
  } else if(pokemon.baseSpecialAttack >= "120"){
    specialAttackGauge.style.backgroundColor = "#74a1a3";
    specialAttackGauge.style.borderRadius = "0.3125em";
    specialAttackGauge.innerHTML = "Extreme";
  } else{
    specialAttackGauge.style.display = "none";
    specialAttackGauge.innerHTML = "";
  }

  if (pokemon.baseSpecialDefense <= "60"){
    specialDefenseGauge.style.backgroundColor = "#f52727";
    specialDefenseGauge.style.borderRadius = "0.3125em";
    specialDefenseGauge.innerHTML = "Low";
  } else if (pokemon.baseSpecialDefense >= "61" && pokemon.baseSpecialDefense < "90" ){
    specialDefenseGauge.style.backgroundColor = "#edcd40"
    specialDefenseGauge.style.borderRadius = "0.3125em";
    specialDefenseGauge.innerHTML = "Average";
  } else if (pokemon.baseSpecialDefense >= "90" && pokemon.baseSpecialDefense < "120"){
    specialDefenseGauge.style.backgroundColor = "#08c486";
    specialDefenseGauge.style.borderRadius = "0.3125em";
    specialDefenseGauge.innerHTML = "High";
  } else if(pokemon.baseSpecialDefense >= "120"){
    specialDefenseGauge.style.backgroundColor = "#74a1a3";
    specialDefenseGauge.style.borderRadius = "0.3125em";
    specialDefenseGauge.innerHTML = "Extreme";
  } else{
    specialDefenseGauge.style.display = "none";
    specialDefenseGauge.innerHTML = "";
  }

  if (pokemon.baseSpeed <= "60"){
    speedGauge.style.backgroundColor = "#f52727";
    speedGauge.style.borderRadius = "0.3125em";
    speedGauge.innerHTML = "Low";
  } else if (pokemon.baseSpeed >= "61" && pokemon.baseSpeed < "90" ){
    speedGauge.style.backgroundColor = "#edcd40"
    speedGauge.style.borderRadius = "0.3125em";
    speedGauge.innerHTML = "Average";
  } else if (pokemon.baseSpeed >= "90" && pokemon.baseSpeed < "120"){
    speedGauge.style.backgroundColor = "#08c486";
    speedGauge.style.borderRadius = "0.3125em";
    speedGauge.innerHTML = "High";
  } else if(pokemon.baseSpeed >= "120"){
    speedGauge.style.backgroundColor = "#74a1a3";
    speedGauge.style.borderRadius = "0.3125em";
    speedGauge.innerHTML = "Extreme";
  } else{
    speedGauge.style.display = "none";
    speedGauge.innerHTML = "";
  }

}

async function entryClicked(pokemon) {
  modal.style.display = "block";
  var url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;

  let imageUrl = await getDataSync(url)
  .then(json => {
    renderPokemonData(json);
    return json['sprites']['other']['official-artwork']['front_default'];
  }).catch(error => {
    if (error.mensaje=='404') {
      let html = `<center>
        <p class="error">¡Vaya...! parece que no hemos podido encontrar el pokémon que estás buscando.</p>
        <img src='img/pikachu_sad.png' width="100" height="150" alt='Error 404'/>
        </center>`;
      let response_error = document.querySelector('.info');
      response_error.innerHTML = html;
    } else if (status=='500') {
      let html = `<center>
        <p class="error">Parece que algo no ha ido bien. El recurso al que estás intentando acceder no está disponible.</p>
        <img src='img/pokemons_not_found.jpg' width="100" height="100" alt='Error 404'/>
        </center>`;
      let response_error = document.querySelector('.info');
      response_error.innerHTML = html;
    }
  });
  if (imageUrl==null) {
  	document.getElementById("pokemon-image").src = 'img/pokemons_not_found.jpg';
  	return;
  }
  getDataSync(imageUrl)
  .then(data =>{
  	document.getElementById("pokemon-image").src = imageUrl;
  }).catch(error => {
  	if (error.message=='404') {
      document.getElementById("pokemon-image").src = 'img/pokemons_not_found.jpg';
      console.log(error.message);
    } else document.getElementById("pokemon-image").src = imageUrl;
  });
}












