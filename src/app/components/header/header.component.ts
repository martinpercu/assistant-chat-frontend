import { Component, inject } from '@angular/core';

import { AssistantselectorService } from '@services/assistantselector.service';

import { RegisterComponent } from '@components/register/register.component';
import { LoginComponent } from '@components/login/login.component';
import { LogoutComponent } from '@components/logout/logout.component';

import { AuthService } from '@services/auth.service';

import {ButtonThemeComponent } from '@components/button-theme/button-theme.component'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterComponent, LoginComponent, LogoutComponent, ButtonThemeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private assistSelector = inject(AssistantselectorService);

  authService = inject(AuthService);

  showRegisterOrLogin: boolean = false


  setAssistant(assistId: string) {
    console.log('in header assisID  ', assistId);
    this.assistSelector.setAssistantId(assistId);
  }

  changeViewRegisterOrLogin() {
    this.showRegisterOrLogin = !this.showRegisterOrLogin
  }


}
