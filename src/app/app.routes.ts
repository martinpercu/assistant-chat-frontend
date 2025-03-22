import { Routes } from '@angular/router';
import { AdminComponent } from '@pages/admin/admin.component';
import { AssistantsComponent } from '@pages/assistants/assistants.component';
import { ChatComponent } from '@components/chat/chat.component';
import { AssistantChatComponent } from '@components/assistant-chat/assistant-chat.component'

import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { LogoutComponent } from '@components/logout/logout.component';
import { ModalRegisterLoginComponent } from '@components/modal-register-login/modal-register-login.component';

import { DocsComponent } from '@pages/docs/docs.component';

import { ChatoComponent } from '@components/chato/chato.component';
import { AgentComponent } from '@components/agent/agent.component';
import { MessageWaitingComponent } from '@components/message-waiting/message-waiting.component';


export const routes: Routes = [
  {
    path:'docs',
    component: DocsComponent
  },
  {
    path:'admin',
    component: AdminComponent
  },
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
  },
  {
    path:'modal',
    component: ModalRegisterLoginComponent
  },
  {
    path:'chato',
    component: ChatoComponent
  },
  {
    path:'agent',
    component: AgentComponent
  },
  {
    path:'waiter',
    component: MessageWaitingComponent
  },
];
