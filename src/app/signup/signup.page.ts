import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ لازم هذا

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule], // ✅ زيد هنا
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = '';
  email: string = '';
  phone: string = '';
  deviceId: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  signup() {
    this.loading = true;
    this.errorMessage = '';

    const userData = {
      fullName: this.username,
      email: this.email,
      phone: this.phone,
      deviceId: this.deviceId,
      password: this.password
    };

    this.http.post('https://avico-api.onrender.com/api/users/signup', userData)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            // ✅ بعد إرسال الكود نوجّه المستخدم لصفحة verify
            this.router.navigate(['/verify'], { queryParams: { email: this.email } });
          } else {
            this.errorMessage = res.message;
          }
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.errorMessage = 'فشل إرسال الكود';
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
