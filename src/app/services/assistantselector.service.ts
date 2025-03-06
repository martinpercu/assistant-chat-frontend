import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantselectorService {

  assistant_id = signal('asst_YPuH1T2frcyhAlXJZ0ibz2lg');

  setAssistantId(assistId: any) {
    console.log('the idReseived =  ', assistId);
    console.log(this.assistant_id());
    this.assistant_id.set(assistId);
    console.log(this.assistant_id());
  }



}
