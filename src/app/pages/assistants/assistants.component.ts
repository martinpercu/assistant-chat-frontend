import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [HeaderComponent, ChatComponent],
  templateUrl: './assistants.component.html',
  styleUrl: './assistants.component.css'
})
export class AssistantsComponent {

}
