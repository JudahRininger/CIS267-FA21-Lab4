const getPokemon = async function (id) {
    // get pokemon data from pokeapi
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    return data;
    //createPokemonCard( data );
  };
  

const app = Vue.createApp({
  data() {
    return {
      allPokemon: [
      ],
      partyPokemon: [],
      // filteredPokemon: [],
      maxPartySize: 6,
      partyShowing: false,
      partyString: "▲",
      searchString: "",
      pokemonCount: 100,
      colors: {
        fire: '#fd7d24',
        grass: '#9bcc50',
        electric: '#eed535',
        water: '#4592c4',
        ground: '#ab9842',
        rock: '#a38c21',
        fairy: '#fdb9e9',
        poison: '#b97fc9',
        bug: '#729f3f',
        dragon: '#7038f8',
        psychic: '#f366b9',
        flying: '#3dc7ef',
        fighting: '#d56723',
        normal: '#a4acaf',
        ice: '#51c4e7',
        ghost: '#7b62a3',
        dark: '#707070',
        steel: '#9eb7b8'
      }
      
    };
  },
  methods: {
    async loadPokemon() {
      // load all pokemon from API and save into all pokemon
      let pokemon = [];
      for (let i = 1; i <= this.pokemonCount; i++) {
        let p = await getPokemon(i);
        if (p.name === "mr-mime") {
          p.name = "Mr. Mime";
        }
        p.isFavorite = false;

        pokemon.push(p);
      }

      pokemon.forEach( p => {
          this.allPokemon.push(p);
      });
    },
    filterPokemon() {
      // set filteredPokemon to matching pokemon based on search query
      filteredPokemon = allPokemon.filter(pokemon => {
        if (pokemon.name.includes(searchQuery.toLowerCase()) || pokemon.id.toString().padStart(3, '0').includes(searchQuery)) {
            return true;
        }
    });
    },
    addPokemonToParty(pokemon) 
    {
      if (this.partyPokemon.length  < 6) {
        const pokemonCopy = {...pokemon};
      pokemonCopy.guid = this.getGUID();
      console.log(pokemonCopy.guid);
      this.partyPokemon.push(  pokemonCopy );
      }
      
    },
    removePokemonFromParty(pokemon) {      
      this.partyPokemon = this.partyPokemon
                            .filter( p => p.guid != pokemon.guid);
    },
    pokemonTypeString(pokemon) {
      if (pokemon.types.length > 1) {
        return `${pokemon.types[0].type.name} / ${pokemon.types[1].type.name}`;
      } else {
        return `${pokemon.types[0].type.name}`;
      }
    },
    getGUID() {
      return Math.floor(Math.random()* 1000000);
    },
    toggleParty() {
      if (this.partyString == "▼") {
        this.partyString = "▲";
        this.partyShowing = false;
      }
      else {
        this.partyString = "▼"
        this.partyShowing = true;
      }
    },
    async addMore() {
      // load all pokemon from API and save into all pokemon
      let pokemon = [];
      let oldCount = this.pokemonCount;
      this.pokemonCount += 100;
      for (let i = oldCount+1; i <= this.pokemonCount; i++) {
        let p = await getPokemon(i);
        p.isFavorite = false;

        pokemon.push(p);
      }

      pokemon.forEach( p => {
          this.allPokemon.push(p);
      });
    },
    backgroundColor(pokemon) {
      const type1 = pokemon.types[0].type.name;
      const type2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
      const color = this.colors[type1];
      if (type2 != null) {
          const color2 = this.colors[type2];
          return `linear-gradient(to right, ${color} , ${color2})`;
      }
      else {
          return color;
      }
    },
    typeText(pokemon) {
      const type1 = pokemon.types[0].type.name;
      const type2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
      if (type2 != null) {
        return `${type1} / ${type2}`;
      }
      else {
        return `${type1}`;
      }

    }
  },
  mounted() {
    this.loadPokemon();
  },
  computed: {
    filteredPokemon() {
      let filtered = this.allPokemon.filter(pokemon => {
        let type2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
        if (pokemon.name.includes(this.searchString.toLowerCase()) || pokemon.id.toString().padStart(3, '0').includes(this.searchString) || pokemon.types[0].type.name.includes(this.searchString)) {
            return true;
        }
        if (type2 != null) {
          if (pokemon.types[1].type.name.includes(this.searchString)) {
              return true;
          }
      }
    });;
      return filtered

    },
    partyLength() {
      return this.partyPokemon.length;
    },
    allPokemonHeight() {
      if (this.partyString == "▼") {
        if (this.partyPokemon.length != 0) {
          return "43vh";
        }
        else {
          return "66.4vh";
        }
      }
      else {
        return "74.4vh"
      }
    }
    
}
}).mount("#app");

