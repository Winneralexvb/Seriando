import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.scss'],
})
export class EntrarComponent implements OnInit {
  form!: FormGroup; // Formulário reativo
  isLoggingIn = false;
  isRecoveringPassword = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Inicializa o formulário
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Navegar para uma aba específica
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/${tab}`);
  }

  navigateback(tab: string) {
    this.navCtrl.navigateRoot(`${tab}`);
  }


  // Método de login
  login() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
      return;
    }

    const { email, password } = this.form.value;
    this.isLoggingIn = true;

    this.authService.signIn(email, password).subscribe({
      next: () => {
        this.authService.getProfile().then((user) => {
          this.authService.User$.next(user);
          this.router.navigateByUrl('/'); // Redireciona para a home
        });
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err.message); // Log detalhado do erro
        this.snackBar.open(err.message, 'Fechar', { duration: 3000 });
        this.isLoggingIn = false;
      },
      complete: () => {
        this.isLoggingIn = false;
      },
    });
  }

  // Método para recuperação de senha
  recoverPassword() {
    if (!this.form.value.email) {
      this.snackBar.open('Digite um e-mail para recuperação.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isRecoveringPassword = true;

    this.authService.recoverPassword(this.form.value.email).subscribe({
      next: () => {
        this.snackBar.open('E-mail de recuperação enviado com sucesso.', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.message, 'Fechar', { duration: 3000 });
        this.isRecoveringPassword = false;
      },
      complete: () => {
        this.isRecoveringPassword = false;
      },
    });
  }
}
