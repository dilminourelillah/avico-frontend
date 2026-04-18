import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SplashPage implements OnInit {

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // بعد 5 ثواني يروح مباشرة للوغين
    setTimeout(() => {
      this.navCtrl.navigateRoot('/login');
    }, 5000);
  }
}
