import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantselectorService {

  assistant_id = signal('');

  setAssistantId(assistId: any) {
    console.log('the idReseived =  ', assistId);
    console.log(this.assistant_id());
    this.assistant_id.set(assistId);
    console.log(this.assistant_id());
  }



}
