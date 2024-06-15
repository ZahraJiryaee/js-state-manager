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
      return planet;
    }
  });

  const result = (await Promise.all(promises)).filter(Boolean);
  return result;
}

getPlanetsWithReptileResidents().then((planets) => {
  const planetList = document.getElementById("planet-list");
  planetList.innerHTML = "";
  planets.forEach((planet) => {
    const li = document.createElement("li");
    li.textContent = JSON.stringify(planet);
    planetList.appendChild(li);
  });
});
