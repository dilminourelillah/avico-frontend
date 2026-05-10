import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonSegment, IonSegmentButton,
  IonModal, IonDatetime, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-daily-history',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonSegment, IonSegmentButton,
    IonModal, IonDatetime, IonList, IonItem, IonLabel
  ],
  templateUrl: './daily-history.page.html',
  styleUrls: ['./daily-history.page.scss'],
})
export class DailyHistoryPage implements OnInit {
  history: any[] = [];
  deviceId: string = 'ESP32-123456';
  selectedDate: string = new Date().toISOString();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadHistory(this.selectedDate);
    setInterval(() => {
      this.loadHistory(this.selectedDate);
    }, 5000);
  }

  loadHistory(date: any) {
    const chosenDate = new Date(date);
    const day = chosenDate.toISOString().split('T')[0];
    this.http.get(`https://avico-api.onrender.com/api/history/${this.deviceId}?date=${day}`)
      .subscribe((res: any) => {
        if (res.success && res.history) {
          this.history = res.history;
        } else if (Array.isArray(res)) {
          this.history = res;
        } else {
          this.history = [];
        }
      });
  }

  previousDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = d.toISOString();
    this.loadHistory(this.selectedDate);
  }

  nextDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    this.selectedDate = d.toISOString();
    this.loadHistory(this.selectedDate);
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.loadHistory(this.selectedDate);
  }

  getEmoji(event: string): string {
    const e = event.toLowerCase();
    if (e.includes('fan')) return '🍃';
    else if (e.includes('light')) return '💡';
    else if (e.includes('temperature') || e.includes('temp')) return '🌡';
    else if (e.includes('humidity')) return '💧';
    else if (e.includes('system') || e.includes('auto')) return '⚙️';
    return '⚠️';
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}