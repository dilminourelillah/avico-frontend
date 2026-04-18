import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule],
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

    // ✅ شروط التحقق
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Email لازم يكون @gmail.com أو @hotmail.com أو @yahoo.com';
      this.loading = false;
      return;
    }

    const phonePattern = /^0\d{9}$/; // يبدأ بـ0 ومجموع 10 أرقام
    if (!phonePattern.test(this.phone)) {
      this.errorMessage = 'رقم الهاتف لازم يكون 10 أرقام ويبدأ بصفر';
      this.loading = false;
      return;
    }

    const deviceIdPattern = /^\d+$/; // أرقام فقط
    if (!deviceIdPattern.test(this.deviceId)) {
      this.errorMessage = 'Device ID لازم يكون أرقام فقط';
      this.loading = false;
      return;
    }

    const userData = {
      fullName: this.username,
      email: this.email,
      phone: this.phone,
      deviceId: this.deviceId,
      password: this.password
    };

    this.http.post('https://avico-api.onrender.com/api/users/signup', userData)
      .subscribe({
        next: (res) => {
          console.log('✅ User registered:', res);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ Error registering user:', err);
          this.loading = false;
          this.errorMessage = 'فشل التسجيل، تأكد من البيانات';
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
