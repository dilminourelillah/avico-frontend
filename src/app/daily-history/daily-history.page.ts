import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ نضيف Router للتنقل

@Component({
  selector: 'app-daily-history',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './daily-history.page.html',
  styleUrls: ['./daily-history.page.scss'],
})
export class DailyHistoryPage implements OnInit {
  history: any[] = [];
  deviceId: string = 'ESP32-123456';
  selectedDate: Date = new Date();

  constructor(private http: HttpClient, private router: Router) {} // ✅ نضيف Router هنا

  ngOnInit() {
    this.loadHistory(this.selectedDate);

    // ✅ تحديث دوري كل 5 ثواني
    setInterval(() => {
      this.loadHistory(this.selectedDate);
    }, 5000);
  }

  loadHistory(date: Date) {
    const day = date.toISOString().split('T')[0];

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
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1));
    this.loadHistory(this.selectedDate);
  }

  nextDay() {
    this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1));
    this.loadHistory(this.selectedDate);
  }

  // ✅ إيموجي بدل الأيقونات
  getEmoji(event: string): string {
    const e = event.toLowerCase();

    if (e.includes('fan')) {
      return '🍃';        // مروحة / تهوية
    } else if (e.includes('light')) {
      return '💡';        // الضوء
    } else if (e.includes('temperature') || e.includes('temp')) {
      return '🌡';        // الحرارة
    } else if (e.includes('humidity')) {
      return '💧';        // الرطوبة
    } else if (e.includes('system') || e.includes('auto')) {
      return '⚙️';        // النظام / الوضع الآلي
    }
    return '⚠️';          // افتراضي (تحذير)
  }

  // ✅ دالة الرجوع للـ Dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
