import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  IonContent, IonButton, IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonContent, IonButton, IonSpinner
  ],
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage {
  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';
  code5: string = '';
  code6: string = '';

  email: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  onInput(event: any, nextInput: any) {
    const value = event.target.value;
    if (value.length >= 1 && nextInput) {
      nextInput.focus();
    }
  }

  verifyCode() {
    const code = `${this.code1}${this.code2}${this.code3}${this.code4}${this.code5}${this.code6}`;
    this.loading = true;

    this.http.post('https://avico-api.onrender.com/api/users/verify-email', {
      email: this.email,
      code: code
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          alert('✅ Email verified successfully!');
          this.navCtrl.navigateRoot('/dashboard');
        } else {
          this.errorMessage = '❌ Invalid code, try again.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = 'فشل التحقق، حاول مرة أخرى';
      }
    });
  }
}