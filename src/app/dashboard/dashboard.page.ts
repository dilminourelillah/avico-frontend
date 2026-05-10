import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonButton, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, menuOutline } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/local-notifications';

interface CycleNotification {
  id: number;
  title: string;
  body: string;
  type: 'week' | 'end';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButton, IonIcon, IonButtons
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  autoModeActive: boolean = false;
  deviceId: string = 'ESP32-123456';
  temperature: number = 0;
  humidity: number = 0;
  nh3: number = 0;
  light: number = 0;
  alerts: any[] = [];
  notifications: CycleNotification[] = [];

  constructor(private router: Router, private http: HttpClient) {
    addIcons({ settingsOutline, menuOutline });
  }

  ngOnInit() {
    this.loadMetrics();
    this.loadAlerts();
    this.listenToNotifications();

    setInterval(() => {
      this.loadMetrics();
      this.loadAlerts();
    }, 2000);
  }

  // ✅ تسمع للإشعارات اللي تجي وتعرضها في الداشبورد
  async listenToNotifications() {
    // اقرأ الإشعارات المحفوظة من قبل (اللي ما تنحاتش)
    const saved = localStorage.getItem('cycle_notifications');
    if (saved) {
      this.notifications = JSON.parse(saved);
    }

    // استمع للإشعارات الجديدة اللي تجي وقت التطبيق مفتوح
    await LocalNotifications.addListener('localNotificationReceived', (notif) => {
      const isLastWeek = notif.extra?.isLastWeek;
      const newNotif: CycleNotification = {
        id: notif.id,
        title: notif.title ?? '',
        body: notif.body ?? '',
        type: isLastWeek ? 'end' : 'week'
      };

      // تحقق ما يتكررش
      const exists = this.notifications.find(n => n.id === newNotif.id);
      if (!exists) {
        this.notifications = [newNotif, ...this.notifications];
        this.saveNotifications();
      }
    });

    // استمع كذلك لما يكون التطبيق مغلق وتفتحه من الإشعار
    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const notif = action.notification;
      const isLastWeek = notif.extra?.isLastWeek;
      const newNotif: CycleNotification = {
        id: notif.id,
        title: notif.title ?? '',
        body: notif.body ?? '',
        type: isLastWeek ? 'end' : 'week'
      };

      const exists = this.notifications.find(n => n.id === newNotif.id);
      if (!exists) {
        this.notifications = [newNotif, ...this.notifications];
        this.saveNotifications();
      }
    });
  }

  // ✅ حذف إشعار واحد بالـ X
  dismissNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  // ✅ حفظ الإشعارات في localStorage باش تبقى بعد الإغلاق
  saveNotifications() {
    localStorage.setItem('cycle_notifications', JSON.stringify(this.notifications));
  }

  loadMetrics() {
    this.http.get(`https://avico-api.onrender.com/api/metrics/${this.deviceId}`)
      .subscribe((res: any) => {
        if (res.success && res.metrics.length > 0) {
          const m = res.metrics[0];
          this.temperature = m.temperature;
          this.humidity = m.humidity;
          this.nh3 = m.nh3;
          this.light = m.light;
        }
      });
  }

  loadAlerts() {
    this.http.get(`https://avico-api.onrender.com/api/alerts/${this.deviceId}`)
      .subscribe((res: any) => {
        if (res.success) {
          this.alerts = res.alerts;
        }
      });
  }

  setVentilation(state: boolean) {
    if (!this.autoModeActive) {
      this.http.post(`https://avico-api.onrender.com/api/control/${this.deviceId}`, { fanStatus: state })
        .subscribe(res => console.log('Ventilation updated:', res));
    }
  }

  setHeating(state: boolean) {
    if (!this.autoModeActive) {
      this.http.post(`https://avico-api.onrender.com/api/control/${this.deviceId}`, { heaterStatus: state })
        .subscribe(res => console.log('Heating updated:', res));
    }
  }

  setLights(state: boolean) {
    if (!this.autoModeActive) {
      this.http.post(`https://avico-api.onrender.com/api/control/${this.deviceId}`, { lightsStatus: state })
        .subscribe(res => console.log('Lights updated:', res));
    }
  }

  toggleAutoMode() {
    this.autoModeActive = !this.autoModeActive;
    this.http.post(`https://avico-api.onrender.com/api/control/${this.deviceId}`, { autoMode: this.autoModeActive })
      .subscribe(res => console.log('Auto Mode updated:', res));
  }

  goToNewCycle() {
    this.router.navigate(['/new-cycle']);
  }

  goToHistory() {
    this.router.navigate(['/daily-history']);
  }
}