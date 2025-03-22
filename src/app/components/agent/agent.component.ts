import { Component, signal, computed, inject, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';

import { ChatMessage } from '@models/chatMessage';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from '@components/header/header.component';
import { DropdowntitleComponent } from '@components/dropdowntitle/dropdowntitle.component';
import { TopRightComponent } from '@components/top-right/top-right.component';
import { TopLeftComponent } from '@components/top-left/top-left.component';
import { MessageWaitingComponent } from '@components/message-waiting/message-waiting.component';

// import { ChangeDetectorRef } from '@angular/core';

import { AssistantselectorService } from '@services/assistantselector.service';
import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, DropdowntitleComponent, TopRightComponent, TopLeftComponent, MatIconModule, MessageWaitingComponent],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css'
})
export class AgentComponent {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private http = inject(HttpClient);
  private assistSelector = inject(AssistantselectorService);
  private authService = inject(AuthService);


  userMessage: string = '';
  botResponse: string = '';
  isLoading: boolean = false;

  messages: string[] = [];

  currentUserMessage!: string;
  chatMessages: ChatMessage[] = [];
  loadingResponse: boolean = false;
  startingResponse: boolean = false;

  showArrowDown: boolean = false;
  userScrolled: boolean = false; // Nueva bandera para controlar el scroll manual

  showHeader = signal(false);

  threadId!: any;
  // assistant_id: string = 'asst_L0n8MIqjkbPJpgvqpEKUt1Hw';
  // assistant_id = signal<string>('asst_L0n8MIqjkbPJpgvqpEKUt1Hw');
  assistant_id = this.assistSelector.assistant_id;
  // assistant_description = this.assistSelector.assistant_description();

  // userAuthEmail = this.authService.currentUserSig()?.email

  combinedUserEmailAndAssistant = computed(() => {
    const currentUser = this.authService.currentUserSig();
    const assistantName = this.assistSelector.assistant_name();
    // Verifica si el usuario actual existe
    if (currentUser) {
      return currentUser.email+'-'+assistantName
    } else {
      // Valor alternativo cuando no hay usuario
      return 'NoEmailNoUser'+'-'+assistantName
    }
  });


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

  sendMessage_stream() {
    if (this.userMessage.trim() === "") return;

    this.loadingResponse = true;
    this.chatMessages.push({ role: "user", message: this.userMessage });

    const responseMessage = { role: "assistant", message: "" };
    this.chatMessages.push(responseMessage);

    let completeResponse = "";
    let displayedChars = 0;
    let typingInterval: any = null;

    // Velocidad dinámica basada en la longitud
    const charsPerTick = Math.max(3, Math.floor(completeResponse.length / 80));

    // Función para simular la escritura gradual
    const simulateTyping = () => {
      if (displayedChars < completeResponse.length) {
        const nextChunk = Math.min(displayedChars + charsPerTick, completeResponse.length);
        responseMessage.message = completeResponse.substring(0, nextChunk);
        displayedChars = nextChunk;
        this.loadingResponse = false;
        setTimeout(() => this.scrollToBottom(), 10);
      }
      if (displayedChars >= completeResponse.length) {
        clearInterval(typingInterval);
        this.loadingResponse = false;
        this.startingResponse = false;
      }
    };

    const formData = {
      message: this.userMessage,
      // session_id: this.authService.currentUserSig()?.email + '-' + this.assistSelector.assistant_name(),
      session_id: this.combinedUserEmailAndAssistant(),
      system_prompt_text: this.assistSelector.assistant_description()
    };

    const timeout = setTimeout(() => {
      clearInterval(typingInterval);
      responseMessage.message = completeResponse;
      this.loadingResponse = false;
    }, 10000); // 10 segundos de timeout

    this.http.post("https://assistant-chat-backend-production.up.railway.app/stream_chat", formData, {
    // this.http.post("http://127.0.0.1:8000/stream_chat", formData, {
      responseType: 'text',
      observe: 'events',
      reportProgress: true,
    })
      .subscribe({
        next: (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";
            completeResponse = rawText.trim();

            if (!typingInterval) {
              typingInterval = setInterval(simulateTyping, 80);
            }
          }
          else if (event.type === HttpEventType.Response) {
            // Guarda el texto completo pero **NO lo muestra directamente**
            completeResponse = (event.body as string)?.trim() || completeResponse;

            // Si el simulador sigue activo, permite que termine naturalmente
          }
        },
        error: (err) => {
          console.error('Error:', err);
          clearInterval(typingInterval);
          clearTimeout(timeout);
          responseMessage.message = "Error al obtener la respuesta. Intenta de nuevo.";
          this.loadingResponse = false;
        },
        complete: () => {
          // El simulador se encargará de completar el mensaje
          clearTimeout(timeout);
        }
      });

    // Clear input
    this.userMessage = "";
    setTimeout(() => {
      this.userMessage = "";
      // if (this.chatInput) {
      //   this.chatInput.nativeElement.style.height = 'auto';
      // }
    }, 100);
  }



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




  // // Este parece que controla mejor pero al final manda todo de golpe.
  //   sendMessage_stream() {
  //     if (this.userMessage.trim() === "") return;

  //     this.loadingResponse = true;
  //     this.chatMessages.push({ role: "user", message: this.userMessage });

  //     const responseMessage = { role: "assistant", message: "" };
  //     this.chatMessages.push(responseMessage);

  //     let completeResponse = "";
  //     let displayedChars = 0;
  //     let typingInterval: any = null;

  //     // Velocidad dinámica según la longitud del mensaje
  //     const charsPerTick = Math.max(3, Math.floor(completeResponse.length / 50));

  //     const simulateTyping = () => {
  //         if (displayedChars < completeResponse.length) {
  //             const nextChunk = Math.min(displayedChars + charsPerTick, completeResponse.length);
  //             responseMessage.message = completeResponse.substring(0, nextChunk);
  //             displayedChars = nextChunk;

  //             setTimeout(() => this.scrollToBottom(), 10);
  //         } else {
  //             clearInterval(typingInterval);
  //             this.loadingResponse = false;
  //         }
  //     };

  //     const formData = {
  //         message: this.userMessage,
  //         session_id: this.threadId || "new_session"
  //     };

  //     const timeout = setTimeout(() => {
  //         clearInterval(typingInterval);
  //         responseMessage.message = completeResponse;
  //         this.loadingResponse = false;
  //     }, 10000); // 10 segundos de timeout

  //     this.http.post("http://localhost:3000/stream_chat", formData, {
  //         responseType: 'text',
  //         observe: 'events',
  //         reportProgress: true,
  //     })
  //     .subscribe({
  //         next: (event: HttpEvent<string>) => {
  //             if (event.type === HttpEventType.DownloadProgress) {
  //                 const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";
  //                 completeResponse = rawText.trim();

  //                 if (!typingInterval) {
  //                     typingInterval = setInterval(simulateTyping, 50); // Intervalo de escritura rápida
  //                 }
  //             } else if (event.type === HttpEventType.Response) {
  //                 clearTimeout(timeout);
  //                 completeResponse = (event.body as string)?.trim() || completeResponse;
  //                 if (!typingInterval) {
  //                     responseMessage.message = completeResponse;
  //                 }
  //                 const sessionIdHeader = event.headers?.get('X-Session-ID');
  //                 if (sessionIdHeader && !this.threadId) {
  //                     this.threadId = sessionIdHeader;
  //                 }
  //             }
  //         },
  //         error: (err) => {
  //             console.error('Error:', err);
  //             clearInterval(typingInterval);
  //             clearTimeout(timeout);
  //             responseMessage.message = "Error al obtener la respuesta. Intenta de nuevo.";
  //             this.loadingResponse = false;
  //         },
  //         complete: () => {
  //             clearInterval(typingInterval);
  //             clearTimeout(timeout);
  //             responseMessage.message = completeResponse;
  //             this.loadingResponse = false;
  //         }
  //     });

  //     // Clear input
  //     this.userMessage = "";
  //     setTimeout(() => {
  //       this.userMessage = "";
  //       // if (this.chatInput) {
  //       //   this.chatInput.nativeElement.style.height = 'auto';
  //       // }
  //     }, 100);
  // }

  // // Este stream funciona medio tosco al final del Stream PERO FUNCIONA BIEN
  // sendMessage_stream() {
  //   if (this.userMessage.trim() === "") return;

  //   // Add user message and set loading state
  //   this.loadingResponse = true;
  //   this.chatMessages.push({
  //     role: "user",
  //     message: this.userMessage
  //   });

  //   // Initialize assistant response with empty content
  //   const responseMessage = {
  //     role: "assistant",
  //     message: ""
  //   };
  //   this.chatMessages.push(responseMessage);

  //   // Variables para controlar la velocidad de escritura
  //   let completeResponse = "";
  //   let displayedChars = 3;
  //   let typingInterval: any = null;

  //   // Función para simular escritura gradual
  //   const simulateTyping = () => {
  //     const charsPerTick = 3; // Puedes ajustar esto para cambiar la velocidad

  //     if (displayedChars < completeResponse.length) {
  //       // Mostrar los siguientes caracteres
  //       const nextChunk = Math.min(displayedChars + charsPerTick, completeResponse.length);
  //       responseMessage.message = completeResponse.substring(0, nextChunk);
  //       displayedChars = nextChunk;

  //       // Asegurarse de desplazarse hacia abajo mientras se está escribiendo
  //       this.scrollToBottom();
  //     } else {
  //       // Hemos mostrado todo el texto, detener el intervalo
  //       clearInterval(typingInterval);
  //       this.loadingResponse = false;
  //       this.startingResponse = false;
  //     }
  //   };

  //   // Prepare request data
  //   const formData = {
  //     message: this.userMessage,
  //     session_id: this.threadId || "new_session"
  //   };

  //   // Send streaming request
  //   this.http
  //     .post("http://localhost:3000/stream_chat", formData, {
  //       responseType: 'text',
  //       observe: 'events',
  //       reportProgress: true,
  //     })
  //     .subscribe({
  //       next: (event: HttpEvent<string>) => {
  //         if (event.type === HttpEventType.DownloadProgress) {
  //           // Get the current text received so far
  //           const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";

  //           // Actualizar el texto completo que tenemos
  //           completeResponse = rawText.trim();

  //           this.startingResponse = true;

  //           // Solo iniciar el intervalo de escritura si aún no está en marcha
  //           if (!typingInterval) {
  //             typingInterval = setInterval(simulateTyping, 25); // 50ms entre actualizaciones
  //           }
  //         } else if (event.type === HttpEventType.Response) {
  //           // Respuesta completa recibida
  //           completeResponse = (event.body as string)?.trim() || completeResponse;

  //           // Si el intervalo ya terminó, asegurémonos de mostrar todo el texto
  //           if (!typingInterval) {
  //             responseMessage.message = completeResponse;
  //             this.loadingResponse = false;
  //             this.startingResponse = false;
  //           }

  //           // Extraer ID de sesión si está disponible
  //           const sessionIdHeader = event.headers?.get('X-Session-ID');
  //           if (sessionIdHeader && !this.threadId) {
  //             this.threadId = sessionIdHeader;
  //           }
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error en la solicitud:', err);
  //         clearInterval(typingInterval);
  //         this.loadingResponse = false;
  //         responseMessage.message = "Error al obtener la respuesta. Por favor, intenta de nuevo.";
  //       },
  //       complete: () => {
  //         // Si por alguna razón el intervalo sigue en marcha al completar, asegurémonos de limpiarlo
  //         if (typingInterval) {
  //           // Forzar la finalización mostrando todo el texto
  //           responseMessage.message = completeResponse;
  //           clearInterval(typingInterval);
  //         }
  //         this.loadingResponse = false;
  //         this.startingResponse = false;
  //       }
  //     });

  //   // Clear input
  //   this.userMessage = "";
  //   setTimeout(() => {
  //     this.userMessage = "";
  //     // if (this.chatInput) {
  //     //   this.chatInput.nativeElement.style.height = 'auto';
  //     // }
  //   }, 100);
  // }


  // // Este metodo no maneja el tiempo desde el front
  // sendMessage_with_NO_partialText() {
  //   if (this.userMessage.trim() === "") return;

  //   // Add user message and set loading state
  //   this.loadingResponse = true;
  //   // Agregar el mensaje del usuario
  //   this.chatMessages.push({
  //     role: "user",
  //     message: this.userMessage
  //   });

  //   // Initialize assistant response with empty content
  //   const responseMessage = {
  //     role: "assistant",
  //     message: ""
  //   };
  //   this.chatMessages.push(responseMessage);

  //   // Prepare request data
  //   const formData = {
  //     message: this.userMessage,
  //     session_id: this.threadId || "new_session" // Usamos el ID existente o creamos uno nuevo
  //   };

  //   // Send streaming request
  //   this.http
  //     .post("http://localhost:3000/stream_chat", formData, {
  //       responseType: 'text',
  //       observe: 'events',
  //       reportProgress: true,
  //     })
  //     .subscribe({
  //       next: (event: HttpEvent<string>) => {
  //         if (event.type === HttpEventType.DownloadProgress) {
  //           // Get the received text so far
  //           const rawText = (event as HttpDownloadProgressEvent).partialText ?? "";

  //           // Como ahora estamos usando media_type="text/plain",
  //           // recibimos directamente el texto sin formato de evento
  //           this.startingResponse = true;

  //           // Actualizamos el mensaje del asistente con el texto recibido hasta ahora
  //           responseMessage.message = rawText.trim();

  //           // Después de recibir la respuesta, nos aseguramos de desplazarnos al final
  //           this.scrollToBottom();
  //         } else if (event.type === HttpEventType.Response) {
  //           // Respuesta completa recibida
  //           this.loadingResponse = false;
  //           this.startingResponse = false;

  //           // Si no existe un ID de sesión, podemos extraerlo de los headers si el backend lo proporciona
  //           const sessionIdHeader = event.headers?.get('X-Session-ID');
  //           if (sessionIdHeader && !this.threadId) {
  //             this.threadId = sessionIdHeader;
  //           }
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error en la solicitud:', err);
  //         this.loadingResponse = false;
  //         responseMessage.message = "Error al obtener la respuesta. Por favor, intenta de nuevo.";
  //       },
  //       complete: () => {
  //         // La solicitud ha finalizado completamente
  //         this.loadingResponse = false;
  //         this.startingResponse = false;
  //       }
  //     });

  //   // Clear input
  //   this.userMessage = "";
  //   setTimeout(() => {
  //     this.userMessage = "";
  //     // // Aseguramos que el área de texto se ajuste a su tamaño inicial
  //     // if (this.chatInput) {
  //     //   this.chatInput.nativeElement.style.height = 'auto';
  //     // }
  //   }, 100);
  // }

}
