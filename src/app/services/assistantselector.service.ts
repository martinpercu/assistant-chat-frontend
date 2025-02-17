import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantselectorService {

  // assistant_id = signal<string>('dfdf');
  assistant_id = signal('');

  // assistant_id_computed = computed(() => {
  //   const assistantIdentificator = this.assistant_id_signal();
  //   return assistantIdentificator;
  // });

  constructor() {
  }


  setAssistantId(idreseived: any) {
    console.log('the idReseived =  ', idreseived  );
    console.log(this.assistant_id());
    this.assistant_id.set(idreseived);
    console.log(this.assistant_id());
  }



}
