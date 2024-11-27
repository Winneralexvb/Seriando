import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService, private navCtrl: NavController, private router: Router
  ) { }

  ngOnInit() {
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`${tab}`);
  }

  goBack() {
    this.navCtrl.back();
  }

  /* Code */

  // Enviar o formulário de cadastro
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    this.authService.signUp(this.email, this.password).subscribe({
      next: () => {
        // Navegar para a página de login após o cadastro
        this.router.navigate(['tabs/tab1']);
      },
      error: (err) => {
        // Tratar erro (exibir mensagem para o usuário)
        alert(err.message);
      }
    });
  }

}
