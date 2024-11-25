import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  isLoggingIn = false;
  isRecoveringPassword = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`${tab}`);
  }


  login() {
    const rawFrom = this.form.value;
    this.authService.signIn(rawFrom.email!, rawFrom.password!).subscribe(() => {
      this.authService.getProfile().then(user => {
        this.authService.User$.next(user);
      });
      this.router.navigateByUrl('/');
    });
  }

  recoverPassword() {
    this.isRecoveringPassword = true;

    this.authService.recoverPassword(
      this.form.value.email
    )
  }



}
