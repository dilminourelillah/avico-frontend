import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, HttpClientModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  autoModeActive: boolean = false;
  deviceId: string = 'ESP32-123456'; // مؤقتاً ثابت
  temperature: number = 0;
  humidity: number = 0;
  nh3: number = 0;
  alerts: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadMetrics();
    this.loadAlerts();
    this.loadChart();

    // تحديث تلقائي كل 10 ثواني
    setInterval(() => {
      this.loadMetrics();
      this.loadAlerts();
    }, 10000);
  }

  loadMetrics() {
    this.http.get(`https://avico-api.onrender.com/api/metrics/${this.deviceId}`)
      .subscribe((res: any) => {
        if (res.success && res.metrics.length > 0) {
          const m = res.metrics[0];
          this.temperature = m.temperature;
          this.humidity = m.humidity;
          this.nh3 = m.nh3;
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

  loadChart() {
    new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Temp', data: [30, 31, 29, 30, 32, 31, 30], borderColor: 'red', fill: false },
          { label: 'Humidity', data: [65, 64, 66, 63, 65, 64, 65], borderColor: 'blue', fill: false },
          { label: 'NH3', data: [12, 13, 11, 14, 12, 13, 12], borderColor: 'green', fill: false },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });
  }
}
