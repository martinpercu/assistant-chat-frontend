import { Component, inject } from '@angular/core';

import { ModalinfoService } from '@services/modalinfo.service';

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.css'
})
export class ModalInfoComponent {

  modalinfoService = inject(ModalinfoService);

  closeModal() {
    this.modalinfoService.showModalInfo.set(false)
  };

}
