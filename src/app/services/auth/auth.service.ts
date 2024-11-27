import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, catchError, from, Observable, throwError } from 'rxjs';
import { getAuth, User } from 'firebase/auth';
import { UserInterface } from 'src/interfaces/user.interface';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  User$ = new BehaviorSubject<User | null | undefined>(undefined);
  router: any;

  constructor(private auth: AngularFireAuth, private navCtrl: NavController) { }

  signIn(email: string, password: string): Observable<any> {
    return from(
      this.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      catchError((error: FirebaseError) => {
        const errorMsg = this.translateFirebaseErrorMessage(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }


  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "User not found.";
    }
    return message;
  }

  async getProfile(): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          resolve(user as User);
        } else {
          resolve(null);
        }
      }, reject);
    })
  }

  async logOut() {
    return this.auth.signOut().then(() => {
      location.reload();
    })
  };


  // Função de Cadastro
  signUp(email: string, password: string): Observable<any> {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      catchError((error: FirebaseError) => {
        const errorMsg = this.translateFirebaseErrorMessage(error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  recoverPassword(email: string): Observable<void> {
    // Verificação para garantir que o email não está vazio
    if (!email) {
      return throwError(() => new Error('Por favor, insira um e-mail válido.'));
    }


    return from(this.auth.sendPasswordResetEmail(email)).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  // Função para obter o ID do usuário logado
  getUserId(): Observable<string | null> {
    const auth = getAuth(); // Obtemos a instância do Auth
    return new Observable<string | null>((observer) => {
      const user = auth.currentUser;  // Verifica o usuário autenticado

      if (user) {
        observer.next(user.uid);  // Retorna o 'uid'
      } else {
        observer.next(null);  // Caso não haja usuário autenticado
      }
    });
  }


}
