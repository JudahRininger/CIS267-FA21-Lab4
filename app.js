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
      pokemonCount: 100
      
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
      if (this.partyString == "▼") {
        let allPokemonHeight = document.getElementById('all-pokemon')
        allPokemonHeight.style.height="43vh";
      }
      
    },
    removePokemonFromParty(pokemon) {      
      this.partyPokemon = this.partyPokemon
                            .filter( p => p.guid != pokemon.guid);
      if (this.partyPokemon.length == 0) {
        let allPokemonHeight = document.getElementById('all-pokemon')
        allPokemonHeight.style.height="66.4vh";
      }
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
      let allPokemonHeight = document.getElementById('all-pokemon');
      if (this.partyString == "▼") {
        this.partyString = "▲";
        this.partyShowing = false;
        allPokemonHeight.style.height="74.4vh";
      }
      else {
        this.partyString = "▼"
        this.partyShowing = true;
        if (this.partyPokemon.length != 0) {
          allPokemonHeight.style.height="43vh";
        }
        if (this.partyPokemon.length == 0) {
          allPokemonHeight.style.height="66.4vh";
        }
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
    }
}
}).mount("#app");

