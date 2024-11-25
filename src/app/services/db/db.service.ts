import { Injectable } from '@angular/core';
import {getDatabase, onValue, ref, runTransaction} from 'firebase/database'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  addFavorite(userId: string, mediaId: Number) {
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${userId}/favorites`);
  
    runTransaction(userFavoritesRef, (favorites) => {
      if (Array.isArray(favorites)) {
        if (!favorites.includes(mediaId)) {
          favorites.push(mediaId);
        }
      } else {
        favorites = [mediaId];
      }
      return favorites;
    })
      .then(() => {
        console.log(`Mídia ${mediaId} adicionada aos favoritos do usuário ${userId}!`);
      })
      .catch((error) => {
        console.error("Erro ao adicionar mídia aos favoritos:", error.message);
      });
  }

  getFavorites(userId: string | undefined) {
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${userId}/favorites`);

    return new Observable<any[]>((observer) => {
      onValue(userFavoritesRef, (snapshot) => {
        if (snapshot.exists()) {
          const favorites = snapshot.val();
          console.log(snapshot.val())
          if (Array.isArray(favorites)) {
            observer.next(favorites);
          } else {
            observer.next([]);  // Caso não seja um array, retorna vazio
          }
        } else {
          observer.next([]);  // Caso não existam dados
        }
      }, (error) => {
        observer.error(error);  // Emite um erro caso ocorra
      });
    });
  
  }

}
