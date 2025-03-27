import { Routes } from '@angular/router';
import { AssistantsComponent } from './../app/pages/assistants/assistants.component'
import { ChatComponent } from '@components/chat/chat.component';
import { AssistantChatComponent } from '@components/assistant-chat/assistant-chat.component'


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
  }
];
