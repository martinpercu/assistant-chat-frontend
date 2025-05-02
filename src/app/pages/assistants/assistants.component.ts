import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { AssistantChatComponent } from '@components/assistant-chat/assistant-chat.component';

import { AgentComponent } from '@components/agent/agent.component';
import { AdminComponent } from "../admin/admin.component";

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [HeaderComponent, ChatComponent, AssistantChatComponent, AgentComponent, AdminComponent],
  templateUrl: './assistants.component.html',
  styleUrl: './assistants.component.css'
})
export class AssistantsComponent {

}
