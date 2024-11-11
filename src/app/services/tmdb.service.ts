import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '5bbe8fabd611329f7d73f010a4929c6a';  // Sua chave da API TMDB

  constructor(private http: HttpClient) { }

  // Método para obter filmes populares
  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Método para pesquisar filmes por nome
  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: query,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter filmes em alta (trending)
  getTrendingMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trending/movie/week`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter filmes por gênero
  getMoviesByGenre(genreId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        with_genres: genreId,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter filmes em alta por gênero
  getTrendingMoviesByGenre(genreId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        with_genres: genreId.toString(),
        sort_by: 'popularity.desc',
        language: 'pt-BR'
      }
    });
  }

  // Método para obter a lista de gêneros de filmes
  getGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genre/movie/list`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Novos Métodos para Séries
  // Método para obter séries populares
  getPopularSeries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter séries em alta por gênero
  getTrendingSeriesByGenre(genreId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/discover/tv`, {
      params: {
        api_key: this.apiKey,
        with_genres: genreId.toString(),
        sort_by: 'popularity.desc',
        language: 'pt-BR'
      }
    });
  }


  // Método para obter séries populares
  getPopularShows(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/popular`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter séries em alta (trending)
  getTrendingShows(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trending/tv/week`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  // Método para pesquisar séries por nome
  searchShows(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/tv`, {
      params: {
        api_key: this.apiKey,
        query: query,
        language: 'pt-BR'
      }
    });
  }

  // Método para obter a lista de gêneros de séries
  getTvGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genre/tv/list`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR'
      }
    });
  }

  getSeriesGenres(): Observable<any> {
    return this.http.get(`${this.apiUrl}/genre/tv/list?api_key=${this.apiKey}&language=pt-BR`);
  }

  getSeriesByGenre(genreId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/discover/tv?api_key=${this.apiKey}&with_genres=${genreId}&language=pt-BR`);
  }

  getSerieGenres() {
    return this.http.get(`${this.apiUrl}/genre/tv/list?api_key=${this.apiKey}`).pipe(
      map((res: any) => res.genres)
    );
  }

  // No arquivo tmdb.service.ts
  getBackdropImages(mediaType: 'movie' | 'tv', id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${mediaType}/${id}/images`, {
      params: {
        api_key: this.apiKey,
        language: 'pt-BR',
        include_image_language: 'en,null' // Inclui imagens sem textos promocionais
      }
    });
  }

  searchMoviesAndSeries(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/multi`, {
      params: {
        api_key: this.apiKey,
        query,
      },
    });
  }
}

