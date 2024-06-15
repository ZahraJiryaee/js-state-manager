import StateManager from "./stateManager.js";

async function getPlanetsWithReptileResidents() {
  const baseUrl = "https://swapi.dev/api";
  const speciesUrl = `${baseUrl}/species`;
  const planetsUrl = `${baseUrl}/planets`;

  async function fetchAllPages(url) {
    let results = [];
    while (url) {
      const response = await fetch(url);
      const data = await response.json();
      results = results.concat(data.results);
      url = data.next;
    }
    return results;
  }

  const [species, planets] = await Promise.all([
    fetchAllPages(speciesUrl),
    fetchAllPages(planetsUrl),
  ]);

  const reptileSpecies = species.filter(
    (specie) => specie.classification.toLowerCase() === "reptile"
  );

  const reptilePeopleUrls = new Set(
    reptileSpecies.flatMap((specie) => specie.people)
  );

  //  const planetsWithMovies = planets.filter(planet => planet.films.length > 0);

  async function hasReptileResidents(planet) {
    for (const residentUrl of planet.residents) {
      if (reptilePeopleUrls.has(residentUrl)) {
        return true;
      }
    }
    return false;
  }

  const promises = planets.map(async (planet) => {
    const hasReptiles = await hasReptileResidents(planet);
    if (hasReptiles) {
      const filmTitles = await Promise.all(
        planet.films.map(async (filmUrl) => {
          const response = await fetch(filmUrl);
          const filmData = await response.json();
          return filmData.title;
        })
      );
      return { ...planet, filmTitles };
    }
  });

  return (await Promise.all(promises)).filter(Boolean);
}

const stateManager = new StateManager({ planets: [] });

stateManager.subscribe((state) => {
  const planetList = document.getElementById("planet-list");
  planetList.innerHTML = "";
  state.planets.forEach((planet) => {
    const li = document.createElement("li");

    const createdDate = new Date(planet.created);
    const formattedDate = createdDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

    li.innerHTML = `
    <div class="hidden md:flex justify-between items-center m-5 p-5 bg-[#27262a] text-white rounded-md">
        <div>
            <p class="mb-2 text-[#f1e04090]">${createdDate.toLocaleDateString()}</p>
            <div class="flex gap-3">
                <div class="w-[3rem] h-[3rem] rounded-lg bg-[#403d46] flex justify-center items-center">
                    <i class="fa-solid fa-earth-americas" style="color: #f1e040; font-size: 2rem"></i>
                </div>
                <div>
                    <p>${planet.name}</p>
                    <p class="text-[#ffffff85]">${planet.filmTitles.join(
                      ", "
                    )}</p>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-end">
            <p class="text-[#f1e04090]">${formattedDate}</p>
            <p class="text-[#ffffff85]">${planet.climate}</p>
        </div>
    </div>
    <div class="block md:hidden m-5 p-5 bg-[#403f45] text-white rounded-md">
        <div class="flex justify-between items-center w-100">
            <div>
                <p class="mb-2 text-[#f1e04090]">${createdDate.toLocaleDateString()}</p>
                <div class="flex gap-3">
                    <div class="w-[3rem] h-[3rem] flex justify-center items-center rounded-full p-1 from-[#7f7e81] to-[#605f64] bg-gradient-to-b">
                        B
                    </div>
                    <div>
                        <p>${planet.name}</p>
                        <p class="text-[#ffffff85]">${planet.climate}</p>
                    </div>
                </div>
            </div>
            <i class="fa-solid fa-earth-americas" style="color: #f1e040; font-size: 2rem"></i>
        </div>
        <p class="mt-2 text-[#ffffff90]">${planet.filmTitles.join(", ")}</p>
    </div>
`;
    planetList.appendChild(li);
  });
});

getPlanetsWithReptileResidents().then((planets) => {
  stateManager.setState({ planets });
});
