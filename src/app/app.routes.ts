import { Routes } from '@angular/router';
import { AssistantsComponent } from '@pages/assistants/assistants.component'
import { ChatComponent } from '@components/chat/chat.component';
import { AssistantChatComponent } from '@components/assistant-chat/assistant-chat.component'

import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { LogoutComponent } from '@components/logout/logout.component';

export const routes: Routes = [
  {
    path:'chat',
    component: ChatComponent
  },
  {
    path:'',
    component: AssistantsComponent
  },
  {
    path:'assist',
    component: AssistantChatComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'logout',
    component: LogoutComponent
  }
];
