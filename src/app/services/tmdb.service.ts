import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '5bbe8fabd611329f7d73f010a4929c6a';
  private apiKeyTmdb = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Yjg2ZTQ3ODM3MTlkOGEyYTZhMzUxYWY4NjRmZGYzMSIsIm5iZiI6MTcyOTY1MTIxMi4zNzU3NDEsInN1YiI6IjY3MGIyYjdjZjU4YTkyMDZhYTQwYmQwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LoLl3rEIop-Fk98nx_CnN5-VK1ExGBis0uuPnqFsxX0';  // Sua chave da API TMDB

  constructor(private http: HttpClient) { }

  // Função para gerar os parâmetros comuns
  private getCommonParams() {
    return {
      api_key: this.apiKey,
      language: 'pt-BR',
      include_adult: 'false', // Exclui conteúdo adulto
    };
  }

  // Reutiliza os parâmetros para fazer chamadas get
  private getRequest(endpoint: string, params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}${endpoint}`, {
      params: { ...this.getCommonParams(), ...params }
    });
  }

  // Filmes

  // Método para obter filmes populares
  getPopularMovies(): Observable<any> {
    return this.getRequest('/movie/popular');
  }

  // Método para pesquisar filmes por nome
  searchMovies(query: string): Observable<any> {
    return this.getRequest('/search/movie', { query });
  }

  // Método para obter filmes em alta (trending)
  getTrendingMovies(): Observable<any> {
    return this.getRequest('/trending/movie/week');
  }

  // Método para obter filmes por gênero
  getMoviesByGenre(genreId: number): Observable<any> {
    return this.getRequest('/discover/movie', { with_genres: genreId });
  }

  // Método para obter filmes em alta por gênero
  getTrendingMoviesByGenre(genreId: number): Observable<any> {
    return this.getRequest('/discover/movie', { 
      with_genres: genreId.toString(), 
      sort_by: 'popularity.desc' 
    });
  }

  // Séries

  // Método para obter séries populares
  getPopularSeries(): Observable<any> {
    return this.getRequest('/tv/popular');
  }

  // Método para obter séries em alta por gênero
  getTrendingSeriesByGenre(genreId: number): Observable<any> {
    return this.getRequest('/discover/tv', { 
      with_genres: genreId.toString(), 
      sort_by: 'popularity.desc' 
    });
  }

  // Método para pesquisar séries por nome
  searchShows(query: string): Observable<any> {
    return this.getRequest('/search/tv', { query });
  }

  // Método para obter a lista de gêneros de filmes
  getGenres(): Observable<any> {
    return this.getRequest('/genre/movie/list');
  }

  // Método para obter a lista de gêneros de séries
  getTvGenres(): Observable<any> {
    return this.getRequest('/genre/tv/list');
  }

  // Método para obter séries por gênero
  getSeriesByGenre(genreId: number): Observable<any> {
    return this.getRequest('/discover/tv', { with_genres: genreId.toString() });
  }

  // Método para obter o backdrop de filmes e séries
  getBackdropImages(mediaType: 'movie' | 'tv', id: number): Observable<any> {
    return this.getRequest(`/${mediaType}/${id}/images`);
  }

  // Método de pesquisa unificada para filmes e séries
  searchMoviesAndSeries(query: string): Observable<any> {
    return this.getRequest('/search/multi', { query, media_type: 'movie,tv' });
  }

  getMediaDetails(id: number, mediaType: 'movie' | 'tv'): Observable<any> {
    // Parâmetros comuns da API
    const params = {
      api_key: this.apiKey,
      language: 'pt-BR',
      include_adult: 'false', // Exclui conteúdo adulto
    };
  
    // Fazendo a requisição
    return this.http.get(`${this.apiUrl}/${mediaType}/${id}`, { params });
  }
  
  getCredits(mediaType: 'movie' | 'tv', id: number): Observable<any> {
    return this.getRequest(`/${mediaType}/${id}/credits`);
  }

  getRecommendations(mediaType: 'movie' | 'tv', id: number): Observable<any> {
    return this.getRequest(`/${mediaType}/${id}/recommendations`);
  }

  getWatchProviders(mediaType: 'movie' | 'tv', id: number): Observable<any> {
    return this.getRequest(`/${mediaType}/${id}/watch/providers`);
  }

  getMovieDetails(movieId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.apiKeyTmdb,
      'accept': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}?language=pt-BR`, { headers})
  }

/* 24/11 */
  
  // Filmes que irão lançar
getUpcomingMovies(): Observable<any> {
  return this.getRequest('/movie/upcoming', { region: 'BR' });
}

// Séries que irão lançar (baseado no critério de "primeira exibição futura")
getUpcomingSeries(): Observable<any> {
  return this.getRequest('/discover/tv', {
    'first_air_date.gte': new Date().toISOString().split('T')[0],
    sort_by: 'first_air_date.asc'
  });
}

getMovies(params: any = {}): Observable<any> {
  return this.getRequest('/discover/movie', params);
}

// Método genérico para buscar séries com filtros opcionais
getTvShows(params: any = {}): Observable<any> {
  return this.getRequest('/discover/tv', params);
}

}

