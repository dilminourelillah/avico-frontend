import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonContent, IonButton, IonButtons,
  IonItem, IonInput, IonIcon, IonDatetime
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eggOutline } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-new-cycle',
  templateUrl: './new-cycle.page.html',
  styleUrls: ['./new-cycle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    IonHeader, IonToolbar, IonContent, IonButton, IonButtons,
    IonItem, IonInput, IonIcon, IonDatetime
  ]
})
export class NewCyclePage {
  deviceId: string = 'ESP32-123456';
  numChickens: number = 0;
  startDate: string = '';
  duration: number = 6;

  constructor(private router: Router, private http: HttpClient) {
    addIcons({ eggOutline });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  onDateChange(event: any) {
    const raw = event.detail.value;
    console.log('📅 Date selected raw:', raw);
    this.startDate = raw?.split('T')[0] ?? '';
    console.log('📅 startDate saved:', this.startDate);
  }

  async beginCycle() {
    if (!this.startDate) {
      alert('Please select a start date.');
      return;
    }

    this.http.post(`https://avico-api.onrender.com/api/cycle/${this.deviceId}`, {
      chickensCount: this.numChickens,
      startDate: this.startDate,
      durationWeeks: this.duration
    }).subscribe({
      next: async (res) => {
        console.log('✅ Cycle started:', res);
        await this.scheduleWeeklyNotifications();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Error starting cycle:', err);
        alert('Failed to start cycle, check server connection.');
      }
    });
  }

  async scheduleWeeklyNotifications() {
    console.log('🔍 Raw startDate:', this.startDate);

    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const [year, month, day] = this.startDate.split('-').map(Number);
    const start = new Date(year, month - 1, day);

    console.log('📅 Start date parsed:', start.toDateString());

    if (isNaN(start.getTime())) {
      alert('Invalid start date, please select a valid date.');
      return;
    }

    const notifications = [];

    for (let week = 1; week <= this.duration; week++) {
      const weekEndDate = new Date(year, month - 1, day + week * 7);
      const isLastWeek = week === this.duration;

      notifications.push({
        id: week,
        title: isLastWeek ? '🎉 Cycle Complete!' : `📅 Week ${week} Done!`,
        body: isLastWeek
          ? 'The farming cycle has ended. You can start a new cycle.'
          : `Week ${week} of the cycle is over. Starting week ${week + 1}!`,
        schedule: { at: weekEndDate },
        sound: 'default',
        smallIcon: 'ic_stat_icon_config_sample',
        actionTypeId: '',
        extra: { week, isLastWeek }
      });

      console.log(`📅 Notification scheduled for week ${week}:`, weekEndDate.toDateString());
    }

    await LocalNotifications.schedule({ notifications });
    console.log('✅ All notifications scheduled');
  }
}