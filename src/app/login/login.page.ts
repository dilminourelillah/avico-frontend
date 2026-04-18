import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, HttpClientModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    const loginData = { email: this.email, password: this.password };

    this.http.post('https://avico-api.onrender.com/api/users/login', loginData)
      .subscribe({
        next: (res: any) => {
          console.log('✅ Login success:', res);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ Login error:', err);
          this.loading = false;
          this.errorMessage = 'البريد أو كلمة المرور غير صحيحة';
        }
      });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
