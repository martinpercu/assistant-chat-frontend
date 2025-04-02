import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';

import { ChatMessage } from '@models/chatMessage';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from '@components/header/header.component';
import { DropdowntitleComponent } from '@components/dropdowntitle/dropdowntitle.component'

import { ChangeDetectorRef } from '@angular/core';

import { AssistantselectorService } from '@services/assistantselector.service';

@Component({
  selector: 'app-assistant-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, DropdowntitleComponent],
  templateUrl: './assistant-chat.component.html',
  styleUrl: './assistant-chat.component.css'
})
export class AssistantChatComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  private http = inject(HttpClient);
  private assistSelector = inject(AssistantselectorService);


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
  // assistant_id: string = 'asst_L0n8MIqjkbPJpgvqpEKUt1Hw';
  // assistant_id = signal<string>('asst_L0n8MIqjkbPJpgvqpEKUt1Hw');
  assistant_id = this.assistSelector.assistant_id



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
        assistant_id: this.assistant_id() || null
      };

      // Variable para llevar el seguimiento del largo del texto ya procesado
      let processedLength = 0;

      this.http
        .post("http://localhost:3000/chat_a_stream_id", formData, {
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
      console.log(this.assistant_id());

      // this.http.get('https://fastapi-chat-5ewd.onrender.com')
      //   .subscribe({
      //     next: (response) => {
      //       console.log('Respuesta del GET:', response);
      //     },
      //     error: (error) => {
      //       console.error('Error en la solicitud GET:', error);
      //     },
      //   });
    }


}
