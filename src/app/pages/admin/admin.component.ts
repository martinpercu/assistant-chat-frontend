import { Component } from '@angular/core';

import { LoginComponent } from '@components/login/login.component';
import { LogoutComponent } from '@components/logout/logout.component';
import { RegisterComponent } from '@components/register/register.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [LoginComponent, LogoutComponent, RegisterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
