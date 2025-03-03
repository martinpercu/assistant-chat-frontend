import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RegisterComponent } from '@components/register/register.component';
import { LoginComponent } from '@components/login/login.component';
import { LogoutComponent } from '@components/logout/logout.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-modal-register-login',
  standalone: true,
  imports: [RegisterComponent, LoginComponent, LogoutComponent],
  templateUrl: './modal-register-login.component.html',
  styleUrl: './modal-register-login.component.css'
})
export class ModalRegisterLoginComponent {


  @Output() showStayTuned = new EventEmitter();
  private router = inject(Router);



  closeModal() {
    // alert('CLOSE ALERT this fall 2024. Stay tuned!')
    this.showStayTuned.emit(false);
  };


  navToRoot() {
    this.router.navigate([''])
  };
}
