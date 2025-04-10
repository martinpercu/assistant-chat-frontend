import { Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent {

  showPdf: string = ''

  pdfs = [
    {
      name: 'Napoleon Biography',
      docname: 'napoleon'
    },
    {
      name: 'US Presidents',
      docname: 'presi'
    },
    {
      name: 'US Presidents Conclusion',
      docname: 'presi-conclu'
    },
    {
      name: 'Lisa History',
      docname: 'lisa'
    }
  ]

  constructor() {
    // this.pdfUrl = './../../../assets/pdf/us-presi.pdf';
  }

  selectPdf(pdfSelect: string){
    this.showPdf = pdfSelect
  }

}
