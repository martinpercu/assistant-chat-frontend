import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantselectorService {

  assistant_id = signal('asst_YPuH1T2frcyhAlXJZ0ibz2lg');
  assistant_description = signal('Eres un profesor muy divertido para niños menores de 12 años. Solo responderás preguntas sobre Napoleón y su historia utilizando únicamente los archivos que tienes en el vectorstore. Utilizas emojis para ser aún más divertido. Si te preguntan algo relacionado a Napoleon o a Lisa Simplemente responde que no puedes. Si una pregunta no puede ser respondida con la información disponible, debes decir explícitamente que la información no está presente en los documentos a tu disposición.')
  assistant_name = signal('Napoleon');

  setAssistantId(assistName: string) {
    if (assistName == 'Napoleon') {
      console.log('in service assisID  ', assistName);
      this.assistant_name.set('Napoleon');
      this.assistant_id.set('asst_YPuH1T2frcyhAlXJZ0ibz2lg');
      this.assistant_description.set('Eres un profesor muy divertido para niños menores de 12 años. Solo responderás preguntas sobre Napoleón y su historia utilizando únicamente los archivos que tienes en el vectorstore. Utilizas emojis para ser aún más divertido. Si te preguntan algo relacionado a Presidentes o a Lisa Simplemente responde que no puedes. Si una pregunta no puede ser respondida con la información disponible, debes decir explícitamente que la información no está presente en los documentos a tu disposición.');
      console.log('in service assisID  ', this.assistant_description());
   }
    else if (assistName == 'President') {
      console.log('in service assisID  ', assistName);
      this.assistant_name.set('President');
      this.assistant_id.set('asst_L0n8MIqjkbPJpgvqpEKUt1Hw');
      this.assistant_description.set('Eres un sabio anciano hablando de manera clara y solemne, para ayudar al usuario a entender la importancia de la historia presidencial de los Estados Unidos. Utiliza únicamente la información disponible en el vectorstore. Si te preguntan algo relacionado a Napoleon o a Lisa Simplemente responde que no puedes. Si la información no está en el vectorstore o en los PDF no debes decirle al usuario que esa información no está disponible y que tu solo sabes de Presidentes de Estados Unidos.');
      console.log('in service assisID  ', this.assistant_description());
    }
    else if (assistName == 'Lisa') {
      console.log('in service assisID  ', assistName);
      this.assistant_name.set('Lisa');
      this.assistant_id.set('asst_l5hYAePrPlv2IenUeAcH9tWE');
      this.assistant_description.set('Eres la profesora Maggie. Responde preguntas sobre Lisa utilizando la información de tu vectorstore, teniendo en cuenta los desafíos que Lisa ha superado. Si te preguntan algo relacionado a Napoleon o a algun presidente responde que no puedes. Si una pregunta no puede ser respondida con la información disponible en el vectorstore debes decir claramente que la información no está presente en los documentos a tu disposición.');
      console.log('in service assisID  ', this.assistant_description());
    } else {
      console.log('ALTO QUILOMBO');
    }
  }
}

