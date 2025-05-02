import { Component, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chato',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './chato.component.html',
  styleUrl: './chato.component.css'
})
export class ChatoComponent {
  http = inject(HttpClient);
  message: string = '';
  response: any = null;
  loading: boolean = false;
  error: string = '';


  constructor(){};


  sendMessage_old() {
    if (!this.message.trim()) return;
    this.loading = true;
    this.error = '';

    // Now sending a POST request with a JSON body
    this.http.post('http://localhost:3000/chato', { message: this.message }, { responseType: 'text' })
      .subscribe({
        next: (data: string) => {
          this.response = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Ocurrió un error al obtener la respuesta.';
          this.loading = false;
        }
      });
  }


  async sendMessage() {
    if (!this.message.trim()) return;
    this.loading = true;
    this.error = '';
    this.response = '';

    try {
      const response = await fetch('http://localhost:3000/stream_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: this.message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        this.response += chunk; // Append each chunk to the response
      }
    } catch (err) {
      console.error(err);
      this.error = 'Ocurrió un error al obtener la respuesta.';
    } finally {
      this.loading = false;
    }
  }

}
