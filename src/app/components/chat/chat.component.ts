import { Component, signal, inject, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, Renderer2 } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';

import { ChatMessage } from '@models/chatMessage';
import { HttpClient } from '@angular/common/http';

import { HeaderComponent } from '@components/header/header.component';
import { DropdowntitleComponent } from '@components/dropdowntitle/dropdowntitle.component'


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

  constructor(
    // private chatService: ChatService,
    private http: HttpClient,
    private renderer: Renderer2
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


  sendMessage() {
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
    }, 10);
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
    console.log(textarea.style.height);
    textarea.style.height = 'auto'; // Reinicia la altura para reducir si es necesario
    console.log(textarea.style.height);
  }

  // pressEnter(event: any) {
  //   if (!event.shiftKey) { // Evita el salto de línea al presionar solo "Enter"
  //     event.preventDefault(); // Previene el salto de línea
  //     console.log('Mensaje enviado:', this.userMessage); // Aquí iría la lógica para enviar el mensaje
  //     this.userMessage = ''; // Limpia el campo después de enviar
  //   }
  // }

  // adjustHeight(textarea: HTMLTextAreaElement, event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     textarea.style.height = 'auto'; // Reinicia la altura para reducir si es necesario
  //     textarea.style.height = `${textarea.scrollHeight + 12}px`; // Ajusta la altura al contenido
  //   }
  // }


}
