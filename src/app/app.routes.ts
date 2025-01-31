import { Routes } from '@angular/router';
import { AssistantsComponent } from './../app/pages/assistants/assistants.component'
import { ChatComponent } from './../app/components/chat/chat.component'

export const routes: Routes = [
  {
    path:'chat',
    component: ChatComponent
  },
  {
    path:'',
    component: AssistantsComponent
  }
];
