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

  setAssistant(assistName: string) {
    this.assistSelector.setAssistantId(assistName)
    // if (assistName == 'Napoleon') {
    //   console.log('in header assisID  ', assistName);
    //   this.assistSelector.setAssistantId('asst_YPuH1T2frcyhAlXJZ0ibz2lg');
    // }
    // if (assistName == 'President') {
    //   console.log('in header assisID  ', assistName);
    //   this.assistSelector.setAssistantId('asst_L0n8MIqjkbPJpgvqpEKUt1Hw');
    // }
    // if (assistName == 'Lisa') {
    //   console.log('in header assisID  ', assistName);
    //   this.assistSelector.setAssistantId('asst_l5hYAePrPlv2IenUeAcH9tWE');
    // }else {
    //   console.log('ALTO QUILOMBO');
    // }
  }

  changeViewRegisterOrLogin() {
    this.showRegisterOrLogin = !this.showRegisterOrLogin
  }


}
