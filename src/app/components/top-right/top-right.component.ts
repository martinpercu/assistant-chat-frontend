import { Component, inject, signal, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { LightdarkthemeService } from '@services/lightdarktheme.service';
import { AuthService } from '@services/auth.service';
import { ModalinfoService } from '@services/modalinfo.service'

import { RegisterComponent } from '@components/register/register.component';
import { LoginComponent } from '@components/login/login.component';


@Component({
  selector: 'app-top-right',
  standalone: true,
  imports: [MatIconModule, RegisterComponent, LoginComponent],
  templateUrl: './top-right.component.html',
  styleUrl: './top-right.component.css'
})
export class TopRightComponent {

  themeService = inject(LightdarkthemeService);
  authService = inject(AuthService);
  modalinfoService = inject(ModalinfoService);

  showlist: boolean = false;
  // showRegisterOrLogin: boolean = false;
  showRegisterOrLogin = signal<boolean | undefined>(undefined);

  switchShowList() {
    this.showlist = !this.showlist
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  changeTheme() {
    this.themeService.toggleDarkMode();
  }


  changeViewRegisterOrLogin() {
    this.showRegisterOrLogin.set(!this.showRegisterOrLogin());
  }

  setShowLoginAndSwitch() {
    if (this.showRegisterOrLogin()) {
      this.changeViewRegisterOrLogin();
    } else {
      this.showRegisterOrLogin.set(true);
    }
  }

  logout() {
    if (confirm('Sure to logout?')) {
      console.log('joya');
      this.authService.logout();
    } else {
      console.log('naranja');
    }
  }

  showModalInfo() {
    this.modalinfoService.showModalInfo.set(true);
  }

}
