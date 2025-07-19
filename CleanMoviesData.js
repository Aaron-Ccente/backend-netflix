export function transformarPeliculas(rows) {
  const peliculasMap = new Map();

  for (const row of rows) {
    const id = row.movie_id;

    if (!peliculasMap.has(id)) {
      peliculasMap.set(id, {
        id: row.movie_id,
        title: row.title,
        description: row.description,
        release_year: row.release_year,
        photo_url: row.photo_url,
        background_url: row.background_url,
        trailer_url: row.trailer_url,
        movie_actors: [],
        movie_genre: new Set(),
        movie_production_company: new Set()
      });
    }

    const pelicula = peliculasMap.get(id);

    // Agregar actor si no está ya
    const actorKey = `${row.id_actor}-${row.character_name}`;
    const yaExisteActor = pelicula.movie_actors.some(
      (a) => `${a.id_actor}-${a.character_name}` === actorKey
    );
    if (!yaExisteActor) {
      pelicula.movie_actors.push({
        id_actor: row.id_actor,
        character_name: row.character_name,
        name: row.actor_name
      })
    }

    // Agregar género y productora sin duplicados
    if (row.id_genre) pelicula.movie_genre.add(row.id_genre, row.genre_name);
    if (row.id_company) pelicula.movie_production_company.add(row.id_company, row.company_name);
  }

  // Convertimos Sets a arrays
  const peliculasFinal = Array.from(peliculasMap.values()).map((p) => ({
    ...p,
    movie_genre: Array.from(p.movie_genre, p.genre_name),
    movie_production_company: Array.from(p.movie_production_company, p.company_name)
  }));

  return peliculasFinal;
}
