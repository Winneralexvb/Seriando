import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
})
export class RecoverPage implements OnInit {
  email: string = '';
  errorMessage: string | null = null;


  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  /* Utility */
  goBack() {
    this.navCtrl.navigateBack('/login');
  }


  /* Codes */
  // Função para recuperar a senha
  onRecoverPassword() {
    if (!this.email) {
      this.errorMessage = 'Por favor, insira um e-mail.';
      return;
    }

    this.authService.recoverPassword(this.email).subscribe({
      next: () => {
        // Se o e-mail for enviado com sucesso, exibe uma mensagem de sucesso ou navega
        this.navCtrl.navigateBack('/login');  // Volta para a página de login
      },
      error: (error) => {
        // Exibe a mensagem de erro se houver
        this.errorMessage = error.message;
      },
    });
  }


}
