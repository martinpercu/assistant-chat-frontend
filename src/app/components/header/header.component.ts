import { Component, inject } from '@angular/core';

import { AssistantselectorService } from '@services/assistantselector.service';

import { RegisterComponent } from '@components/register/register.component';
import { LoginComponent } from '@components/login/login.component';
import { LogoutComponent } from '@components/logout/logout.component';

import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterComponent, LoginComponent, LogoutComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private assistSelector = inject(AssistantselectorService);

  authService = inject(AuthService);

  showRegisterOrLogin: boolean = false;

  assistant_id = this.assistSelector.assistant_id;

  setAssistant(assistId: string) {
    console.log('in header assisID  ', assistId);
    this.assistSelector.setAssistantId(assistId);
  }

  changeViewRegisterOrLogin() {
    this.showRegisterOrLogin = !this.showRegisterOrLogin
  }


}
