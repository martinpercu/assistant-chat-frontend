import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { LightdarkthemeService } from '@services/lightdarktheme.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-top-right',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './top-right.component.html',
  styleUrl: './top-right.component.css'
})
export class TopRightComponent {

  themeService = inject(LightdarkthemeService);
  authService = inject(AuthService);

  showlist: boolean = false

  switchShowList() {
    this.showlist = !this.showlist
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  changeTheme(){
    this.themeService.toggleDarkMode();
  }

}
