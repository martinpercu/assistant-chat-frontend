import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';

import { ChatMessage } from '@models/chatMessage';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from '@components/header/header.component';
import { DropdowntitleComponent } from '@components/dropdowntitle/dropdowntitle.component'

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, DropdowntitleComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  userMessage: string = '';
  botResponse: string = '';
  isLoading: boolean = false;

  messages: string[] = [];

  currentUserMessage!: string;
  chatMessages: ChatMessage[] = [];
  loadingResponse: boolean = false;

  showArrowDown: boolean = false;
  userScrolled: boolean = false; // Nueva bandera para controlar el scroll manual

  showHeader = signal(false);

  threadId!: any;

  private http = inject(HttpClient);

  constructor(
    // private chatService: ChatService,

    private renderer: Renderer2,

    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    // Escuchar el evento de scroll en el contenedor de los mensajes
    this.messagesContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngAfterViewChecked(): void {
    // Este hook se asegura de que el scroll se mueva solo después de que el DOM se haya actualizado.
    this.scrollToBottom();
  }

  onScroll(): void {
    const container = this.messagesContainer.nativeElement;
    const isAtBottom = container.scrollHeight === container.scrollTop + container.clientHeight;
    if (!isAtBottom) {
      this.userScrolled = true; // El usuario ha hecho scroll manualmente
      this.showArrowDown = true; // Muestra la flecha para volver abajo
    } else {
      this.userScrolled = false; // Usuario ha llegado al final, reanudar auto-scroll
      this.showArrowDown = false;
    }
  }


  sendMessage_old() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    this.chatMessages.push({ message: this.userMessage });
    // this.userMessage= "";
    const responseMessage = {
      role: "assistant",
      // message: "", // Add this property
      content: "…",
    };
    this.chatMessages.push(responseMessage);
    console.log(responseMessage);
    console.log(this.chatMessages);
    console.log(this.userMessage);
    // this.userMessage = "";


    this.http
      .post("http://localhost:3000/chatwip", { message: this.userMessage }, {
        observe: "events",
        responseType: "text",
        reportProgress: true,
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            responseMessage.content = (
              event as HttpDownloadProgressEvent
            ).partialText + "…";
          } else if (event.type === HttpEventType.Response) {
            responseMessage.content = event.body ?? '';
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });
    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  };


  sendMessage_assistant() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    this.chatMessages.push({ message: this.userMessage });

    const responseMessage = {
      role: "assistant",
      content: "…",
    };
    this.chatMessages.push(responseMessage);

    // Enviar el mensaje al backend de FastAPI
    this.http
      .post<{ thread_id: string; response: string }>(
        "http://localhost:3000/chat_a", // Asegúrate de que la URL coincide con la del backend FastAPI
        {
          message: this.userMessage,
          thread_id: this.threadId || null, // Si hay un thread_id previo, se reutiliza
        }
      )
      .subscribe({
        next: (data) => {
          this.threadId = data.thread_id; // Guardar el thread_id para futuras interacciones
          responseMessage.content = data.response;
          this.loadingResponse = false;
        },
        error: () => {
          this.loadingResponse = false;
        },
      });

    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  }


  // sendMessage_stream_01() {
  //   if (this.userMessage.trim() === "") return;

  //   this.loadingResponse = true;
  //   this.chatMessages.push({ message: this.userMessage });

  //   const responseMessage = {
  //     role: "assistant",
  //     content: "…",
  //   };
  //   this.chatMessages.push(responseMessage);

  //   // Enviar el mensaje al backend de FastAPI con un observable
  //   const formData = {
  //     message: this.userMessage,
  //     thread_id: this.threadId || null, // Si hay un thread_id previo, se reutiliza
  //   };

  //   this.http
  //     .post("http://localhost:3000/chat_a", formData, {
  //       headers: { "Content-Type": "application/json" },
  //       responseType: "text",  // Esto es importante, ya que estamos esperando un stream de texto
  //       observe: "response"  // Necesitamos observar la respuesta completa para manipular el cuerpo del stream
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         const reader = response.body?.getReader();
  //         if (!reader) return;

  //         const decoder = new TextDecoder();
  //         let done = false;
  //         let content = '';

  //         // Leer el stream
  //         reader.read().then(function processText({ done, value }) {
  //           if (done) {
  //             console.log("Stream finished");
  //             return;
  //           }
  //           content += decoder.decode(value, { stream: true });
  //           responseMessage.content = content;  // Actualizamos el contenido mientras llega
  //           this.loadingResponse = false;
  //           this.changeDetectorRef.detectChanges(); // Forzamos la actualización de la vista

  //           reader.read().then(processText);  // Continuamos leyendo
  //         }.bind(this)); // Usamos bind para mantener el contexto de `this`
  //       },
  //       error: () => {
  //         this.loadingResponse = false;
  //       },
  //     });

  //   this.userMessage = "";
  //   setTimeout(() => {
  //     this.userMessage = "";
  //   }, 100);
  // }


  // sendMessage_stream_nofunca() {
  //   if (this.userMessage.trim() === '') return;

  //   this.loadingResponse = true;
  //   this.chatMessages.push({ message: this.userMessage });

  //   const responseMessage = {
  //     role: 'assistant',
  //     content: '…',
  //   };
  //   this.chatMessages.push(responseMessage);

  //   // Preparar el cuerpo del mensaje
  //   const formData = {
  //     message: this.userMessage,
  //     thread_id: this.threadId || null, // Si hay un thread_id previo, se reutiliza
  //   };

  //   // Enviar el mensaje al backend de FastAPI con un observable
  //   this.http
  //     .post('http://localhost:3000/chat_a', formData, {
  //       headers: { 'Content-Type': 'application/json' },
  //       responseType: 'text', // Especificamos que esperamos un texto
  //       observe: 'response', // Necesitamos observar la respuesta
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         if (response.body) {
  //           // Usamos el método `getReader` solo cuando trabajamos con un stream
  //           const reader = new TextEncoder().encode(response.body).getReader();
  //           const decoder = new TextDecoder();
  //           let done = false;
  //           let content = '';

  //           // Función para procesar el stream
  //           const processText = ({ done, value }: { done: boolean, value: Uint8Array }) => {
  //             if (done) {
  //               console.log('Stream finished');
  //               return;
  //             }

  //             content += decoder.decode(value, { stream: true });
  //             responseMessage.content = content; // Actualizamos el contenido mientras llega
  //             this.loadingResponse = false;
  //             this.changeDetectorRef.detectChanges(); // Forzamos la actualización de la vista

  //             // Continuamos leyendo el siguiente fragmento
  //             reader.read().then(processText);
  //           };

  //           // Empezar a leer el stream
  //           reader.read().then(processText);
  //         }
  //       },
  //       error: () => {
  //         this.loadingResponse = false;
  //       },
  //     });

  //   // Limpiar el mensaje del usuario
  //   this.userMessage = '';
  //   setTimeout(() => {
  //     this.userMessage = '';
  //   }, 100);
  // }


  // sendMessage_streal_caca() {
  //   if (this.userMessage.trim() === '') return;

  //   this.loadingResponse = true;
  //   this.chatMessages.push({ message: this.userMessage });

  //   const responseMessage = {
  //     role: 'assistant',
  //     content: '…',
  //   };
  //   this.chatMessages.push(responseMessage);

  //   const formData = {
  //     message: this.userMessage,
  //     thread_id: this.threadId || null, // Si hay un thread_id previo, se reutiliza
  //   };

  //   // Usamos `fetch` para manejar el stream de datos
  //   fetch('http://localhost:3000/chat_a', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   })
  //     .then((response) => {
  //       const reader = response.body?.getReader();
  //       if (!reader) {
  //         throw new Error('No reader found on response body');
  //       }

  //       const decoder = new TextDecoder();
  //       let done = false;
  //       let content = '';

  //       // Función para procesar el stream
  //       const processText = ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
  //         if (done) {
  //           console.log('Stream finished');
  //           return;
  //         }

  //         // Verificamos que `value` no sea undefined
  //         if (value) {
  //           content += decoder.decode(value, { stream: true });
  //           responseMessage.content = content; // Actualizamos el contenido mientras llega
  //           this.loadingResponse = false;
  //           this.changeDetectorRef.detectChanges(); // Forzamos la actualización de la vista
  //         }

  //         // Continuamos leyendo el siguiente fragmento
  //         reader.read().then(processText);
  //       };

  //       // Empezar a leer el stream
  //       reader.read().then(processText);
  //     })
  //     .catch((error) => {
  //       console.error('Error reading stream:', error);
  //       this.loadingResponse = false;
  //     });

  //   // Limpiar el mensaje del usuario
  //   this.userMessage = '';
  //   setTimeout(() => {
  //     this.userMessage = '';
  //   }, 100);
  // }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
    console.log(this.userMessage);


    this.loadingResponse = true;
    this.chatMessages.push({ message: this.userMessage });

    const responseMessage = {
      role: 'assistant',
      content: '…',
    };
    this.chatMessages.push(responseMessage);


    // Enviar el mensaje al backend con el método POST
    const formData = {
      message: this.userMessage,
      thread_id: this.threadId || null, // Si tienes un thread_id, lo reutilizas
    };

    this.http
      .post('http://localhost:3000/chat_a_stream', formData, {
        responseType: 'text',  // Aquí es donde se configura el tipo de respuesta
        observe: 'events',     // Observamos los eventos de la respuesta
        reportProgress: true,  // Permite el seguimiento del progreso
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Aquí, cada fragmento de texto parcial se concatena al contenido de la respuesta
            responseMessage.content += (event as HttpDownloadProgressEvent).partialText;
            this.loadingResponse = false;
            this.changeDetectorRef.detectChanges(); // Actualizamos la vista
          } else if (event.type === HttpEventType.Response) {
            // Cuando la respuesta está completa, podemos procesarla
            responseMessage.content += event.body ?? '';
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });

    // Limpiar el mensaje del usuario
    this.userMessage = '';
    setTimeout(() => {
      this.userMessage = '';  // Limpiar el mensaje del input después de un pequeño retardo
    }, 100);
  }




  sendMessage_assistant_stream() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    this.chatMessages.push({ message: this.userMessage });
    // this.userMessage= "";
    const responseMessage = {
      role: "assistant",
      // message: "", // Add this property
      content: "…",
    };
    this.chatMessages.push(responseMessage);
    console.log(responseMessage);
    console.log(this.chatMessages);
    console.log(this.userMessage);
    // this.userMessage = "";

    const formData = {
      message: this.userMessage,
      thread_id: this.threadId || null, // Si tienes un thread_id, lo reutilizas
    };

    this.http
      .post("http://localhost:3000/chat_a_stream_last", formData, {
        responseType: 'text',  // Aquí es donde se configura el tipo de respuesta
        observe: 'events',     // Observamos los eventos de la respuesta
        reportProgress: true,  // Permite el seguimiento del progreso
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            responseMessage.content = (
              event as HttpDownloadProgressEvent
            ).partialText + "…";
          } else if (event.type === HttpEventType.Response) {
            responseMessage.content = event.body ?? '';
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });
    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  };




  sendMessage_assistant_stream_b() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    // Agregar el mensaje del usuario
    this.chatMessages.push({ message: this.userMessage });

    // Crear un objeto para la respuesta del asistente (inicialmente vacío)
    const responseMessage = {
      role: "assistant",
      content: ""
    };
    this.chatMessages.push(responseMessage);
    console.log(responseMessage);
    console.log(this.chatMessages);
    console.log(this.userMessage);

    const formData = {
      message: this.userMessage,
      thread_id: this.threadId || null, // Si ya existe, se reutiliza
    };

    this.http
      .post("http://localhost:3000/chat_a_stream_last", formData, {
        responseType: 'text',       // La respuesta es texto
        observe: 'events',          // Se observan los eventos de la respuesta
        reportProgress: true,       // Se permite el seguimiento del progreso
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Cada evento SSE se separa por "\n\n"
            const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";
            const sseEvents = rawText.split(/\n\n/).filter(e => e.trim() !== "");

            sseEvents.forEach(sseEvent => {
              // Si es el evento que contiene el thread_id:
              if (sseEvent.startsWith("event: thread_id")) {
                // Buscar la línea que contiene el thread_id
                const match = sseEvent.match(/data:\s*(.+)/);
                if (match && match[1]) {
                  this.threadId = match[1].trim();
                }
              } else if (sseEvent.startsWith("data:")) {
                // Para eventos de datos, extraemos el contenido
                // (Si se quieren separar las palabras, se puede procesar aquí)
                const data = sseEvent.substring("data:".length).trim();
                // Acumulamos el texto en la respuesta del asistente
                responseMessage.content += data + " ";
              }
            });
          } else if (event.type === HttpEventType.Response) {
            // Cuando finaliza la respuesta completa, detenemos el loading
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });

    // Limpiar el campo de mensaje
    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  };



  sendMessage_assistant_stream_c() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    // Agregar el mensaje del usuario
    this.chatMessages.push({ message: this.userMessage });

    // Objeto para la respuesta del asistente
    const responseMessage = {
      role: "assistant",
      content: ""
    };
    this.chatMessages.push(responseMessage);

    const formData = {
      message: this.userMessage,
      thread_id: this.threadId || null, // Si ya existe, se reutiliza
    };

    // Variable para llevar el seguimiento del largo del texto ya procesado
    let processedLength = 0;

    this.http
      .post("http://localhost:3000/chat_a_stream_last", formData, {
        responseType: 'text',       // La respuesta es texto
        observe: 'events',          // Se observan los eventos de la respuesta
        reportProgress: true,       // Se permite el seguimiento del progreso
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Asegurarse de tener un valor en partialText
            const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";
            // Solo procesamos el texto nuevo que aún no se ha procesado
            const newText = rawText.substring(processedLength);
            // Actualizamos el índice de lo ya procesado
            processedLength = rawText.length;

            // Separamos los eventos SSE en el fragmento nuevo
            const sseEvents = newText.split(/\n\n/).filter(e => e.trim() !== "");

            sseEvents.forEach(sseEvent => {
              // Si es el evento que contiene el thread_id, lo extraemos y guardamos
              if (sseEvent.startsWith("event: thread_id")) {
                const match = sseEvent.match(/data:\s*(.+)/);
                if (match && match[1]) {
                  this.threadId = match[1].trim();
                }
              } else if (sseEvent.startsWith("data:")) {
                // Para eventos de datos, extraemos el contenido y lo acumulamos
                const data = sseEvent.substring("data:".length).trim();
                responseMessage.content += data + " ";
              }
            });
          } else if (event.type === HttpEventType.Response) {
            // Cuando la respuesta completa se ha recibido, detenemos el loading
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });

    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  };




  sendMessage_assistant_stream_last_last() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    // Agregar el mensaje del usuario
    this.chatMessages.push({ message: this.userMessage });

    // Objeto para la respuesta del asistente
    const responseMessage = {
      role: "assistant",
      content: ""
    };
    this.chatMessages.push(responseMessage);

    const formData = {
      message: this.userMessage,
      thread_id: this.threadId || null, // Si ya existe, se reutiliza
    };

    // Variable para llevar el seguimiento del largo del texto ya procesado
    let processedLength = 0;

    this.http
      .post("https://fastapi-chat-5ewd.onrender.com/chat_a_stream_last", formData, {
        responseType: 'text',       // La respuesta es texto
        observe: 'events',          // Se observan los eventos de la respuesta
        reportProgress: true,       // Se permite el seguimiento del progreso
      })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Asegurarse de tener un valor en partialText
            const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";
            // Solo procesamos el texto nuevo que aún no se ha procesado
            const newText = rawText.substring(processedLength);
            // Actualizamos el índice de lo ya procesado
            processedLength = rawText.length;

            // Separamos los eventos SSE en el fragmento nuevo
            const sseEvents = newText.split(/\n\n/).filter(e => e.trim() !== "");

            sseEvents.forEach(sseEvent => {
              // Si es el evento que contiene el thread_id, lo extraemos y guardamos
              if (sseEvent.startsWith("event: thread_id")) {
                const match = sseEvent.match(/data:\s*(.+)/);
                if (match && match[1]) {
                  this.threadId = match[1].trim();
                }
              } else if (sseEvent.startsWith("data:")) {
                // Para eventos de datos, extraemos el contenido y lo acumulamos
                // Extraemos el contenido del evento
                const data = sseEvent.substring("data:".length).trim();
                // Aplicamos una expresión regular para eliminar los marcadores de citas
                const cleanedData = data.replace(/【\d+:\d+†source】/g, "");
                responseMessage.content += cleanedData + " ";
              }
            });
          } else if (event.type === HttpEventType.Response) {
            this.loadingResponse = false;
          }
        },
        error: () => {
          this.loadingResponse = false;
        },
      });

    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
    }, 100);
  };

  scrollToBottom(): void {
    if (!this.userScrolled && this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;  // Solo hacer scroll si el usuario no lo ha detenido
    }
  }

  scrollToBottomFromArrow(): void {
    console.log('hello');
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  toggleShowHeader() {
    this.showHeader.update(prevState => !prevState)
  }


  adjustHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // Reinicia la altura para reducir si es necesario
  }


  testApi() {
    this.http.get('https://fastapi-chat-5ewd.onrender.com')
      .subscribe({
        next: (response) => {
          console.log('Respuesta del GET:', response);
        },
        error: (error) => {
          console.error('Error en la solicitud GET:', error);
        },
      });
  }

}
