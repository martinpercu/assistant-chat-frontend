import { Component, inject } from '@angular/core';

import { AssistantselectorService } from '@services/assistantselector.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private assistSelector = inject(AssistantselectorService);


  setAssistant(assistId: string) {
    console.log('in header assisID  ', assistId);

    this.assistSelector.setAssistantId(assistId);

  }


}
