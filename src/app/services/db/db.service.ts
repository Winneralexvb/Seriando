import { Injectable } from '@angular/core';
import {get, getDatabase, onValue, ref, remove, runTransaction, set, update} from 'firebase/database'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  addFavoriteMovie(userId: string | undefined, mediaId: string | undefined, mediaTitle: string | undefined) {
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${userId}/favoritesMovies`);
  
    runTransaction(userFavoritesRef, (favoritesMovies) => {
      if (favoritesMovies === null) {
        // Se a lista de favoritos for null ou não existir, inicializamos um objeto vazio
        favoritesMovies = {};
      }
  
      // Verifica se o filme/série já está na lista de favoritos
      if (!favoritesMovies[mediaId!]) {
        // Adiciona o item com o mediaId como chave e dados do filme como valor
        favoritesMovies[mediaId!] = {
          mediaType: 'movie',  // Pode adicionar 'tv' ou qualquer outra informação
          mediaTitle,       // Adiciona o título da série
        };
      }
      return favoritesMovies;
    })
      .then(() => {
        console.log(`Mídia ${mediaId} com título "${mediaTitle}" adicionada aos favoritos do usuário ${userId}!`);
      })
      .catch((error) => {
        console.error("Erro ao adicionar mídia aos favoritos:", error.message);
      });
  }

  addFavoriteTV(userId: string | undefined, mediaId: string | undefined, mediaTitle: string | undefined) {
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${userId}/favoritesTvs`);
  
    runTransaction(userFavoritesRef, (favoritesTvs) => {
      if (favoritesTvs === null) {
        // Se a lista de favoritos for null ou não existir, inicializamos um objeto vazio
        favoritesTvs = {};
      }
  
      // Verifica se o filme/série já está na lista de favoritos
      if (!favoritesTvs[mediaId!]) {
        // Adiciona o item com o mediaId como chave e dados do filme como valor
        favoritesTvs[mediaId!] = {
          mediaType: 'tv',  // Pode adicionar 'tv' ou qualquer outra informação
          mediaTitle,       // Adiciona o título da série
        };
      }
      return favoritesTvs;
    })
      .then(() => {
        console.log(`Mídia ${mediaId} com título "${mediaTitle}" adicionada aos favoritos do usuário ${userId}!`);
      })
      .catch((error) => {
        console.error("Erro ao adicionar mídia aos favoritos:", error.message);
      });
  }
  

  addList(
    userId: string | undefined,
    mediaId: string | undefined,
    mediaTitle: string | undefined,
    mediaType: 'movie' | 'tv' // Adicionando o parâmetro para tipo de mídia
  ) {
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${userId}/list`);
  
    runTransaction(userFavoritesRef, (list) => {
      if (list === null) {
        // Se a lista for null ou não existir, criamos um objeto vazio
        list = {};
      }
  
      // Verifica se o item já está na lista
      if (!list[mediaId!]) {
        // Adiciona o item com o mediaId como chave
        list[mediaId!] = {
          mediaTitle,
          mediaType // Salva o tipo de mídia
        };
      }
      return list;
    })
      .then(() => {
        console.log(
          `Mídia ${mediaId} com título "${mediaTitle}" e tipo "${mediaType}" adicionada à lista do usuário ${userId}!`
        );
      })
      .catch((error) => {
        console.error("Erro ao adicionar mídia à lista:", error.message);
      });
  }
  
  
  getFavoritesMovies(userId: string | undefined) {
    const db = getDatabase();
    const userFavoritesMoviesRef = ref(db, `users/${userId}/favoritesMovies`);
  
    return new Observable<any[]>((observer) => {
      onValue(userFavoritesMoviesRef, (snapshot) => {
        if (snapshot.exists()) {
          const favoritesMoviesObj = snapshot.val();
          console.log(favoritesMoviesObj);  // Verifique o que está vindo do banco
  
          // Verifica se os dados são um objeto
          if (typeof favoritesMoviesObj === 'object') {
            const favoritesMovies = Object.keys(favoritesMoviesObj).map(movieId => {
              const movieData = favoritesMoviesObj[movieId];
              return {
                id: movieId,
                mediaTitle: movieData.mediaTitle,
                mediaType: movieData.mediaType
              };
            });
  
            observer.next(favoritesMovies);
          } else {
            observer.next([]);  // Caso os dados não sejam um objeto, retorna vazio
          }
        } else {
          observer.next([]);  // Caso não existam dados
        }
      }, (error) => {
        observer.error(error);  // Emite um erro caso ocorra
      });
    });
  }

  getFavoritesTv(userId: string | undefined) {
    const db = getDatabase();
    const userFavoritesTvRef = ref(db, `users/${userId}/favoritesTvs`);
  
    return new Observable<any[]>((observer) => {
      onValue(userFavoritesTvRef, (snapshot) => {
        if (snapshot.exists()) {
          const favoritesTvs = snapshot.val();
  
          console.log(favoritesTvs);  // Verificando o conteúdo retornado
  
          // Se houver dados, transforma o objeto em um array
          const favoritesArray = Object.keys(favoritesTvs).map(key => {
            return { ...favoritesTvs[key], id: key };  // Adiciona o id como chave para cada série
          });
  
          observer.next(favoritesArray);  // Envia o array de séries favoritas
        } else {
          observer.next([]);  // Caso não existam dados
        }
      }, (error) => {
        observer.error(error);  // Emite um erro caso ocorra
      });
    });
  }
  
  getList(userId: string | undefined) {
    const db = getDatabase();
    const userListRef = ref(db, `users/${userId}/list`);
  
    return new Observable<any[]>((observer) => {
      onValue(userListRef, (snapshot) => {
        if (snapshot.exists()) {
          const list = snapshot.val();
  
          console.log('list', list);  // Verificando o conteúdo retornado
  
          // Se houver dados, transforma o objeto em um array
          const listArray = Object.keys(list).map(key => {
            return { ...list[key], id: key };  // Adiciona o id como chave para cada item
          });
  
          observer.next(listArray);  // Envia o array de itens
        } else {
          observer.next([]);  // Caso não existam dados
        }
      }, (error) => {
        observer.error(error);  // Emite um erro caso ocorra
      });
    });
  }
  


  async  removeFromList(userId: string, mediaId: number) {
    const db = getDatabase();
    const userListRef = ref(db, `users/${userId}/list`);
  
    try {
      // Obtendo a lista de itens do usuário
      const snapshot = await get(userListRef);
      if (snapshot.exists()) {
        const list = snapshot.val(); // Recupera o array de objetos da lista
  
        // Encontrar o índice do item que queremos remover
        const itemIndex = list.findIndex((item: any) => item.mediaId === mediaId);
  
        if (itemIndex !== -1) {
          // Item encontrado, remover da lista
          list.splice(itemIndex, 1); // Remove o item do array
  
          // Atualiza o banco de dados com a lista modificada
          await set(userListRef, list);
          console.log(`Item com mediaId ${mediaId} removido com sucesso.`);
        } else {
          console.log('Item não encontrado na lista.');
        }
      } else {
        console.log('A lista do usuário está vazia.');
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  }

  async removeFromFavoriteMovies(userId: string | undefined, mediaId: string) {
    const db = getDatabase();
    const userListRef = ref(db, `users/${userId}/favoritesMovies/${mediaId}`); // Usando crase para interpolação
  
    try {
      await remove(userListRef);  // Usando await para aguardar a remoção
      console.log(`Item ${mediaId} removido com sucesso da lista do usuário ${userId}`);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  }
  
  
}
