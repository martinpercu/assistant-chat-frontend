import { Component, inject } from '@angular/core';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  authService = inject(AuthService);

  logout(){
    this.authService.logout();
  }

}
