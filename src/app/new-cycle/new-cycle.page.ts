import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-new-cycle',
  templateUrl: './new-cycle.page.html',
  styleUrls: ['./new-cycle.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule]
})
export class NewCyclePage {
  deviceId: string = 'ESP32-123456';
  numChickens: number = 0;
  startDate: string = '';
  duration: number = 6;

  constructor(private router: Router, private http: HttpClient) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  beginCycle() {
    this.http.post(`https://avico-api.onrender.com/api/cycle/${this.deviceId}`, {
      chickensCount: this.numChickens,
      startDate: this.startDate,
      durationWeeks: this.duration
    }).subscribe({
      next: (res) => {
        console.log('✅ Cycle started:', res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Error starting cycle:', err);
        alert('Failed to start cycle, check server connection.');
      }
    });
  }
}
