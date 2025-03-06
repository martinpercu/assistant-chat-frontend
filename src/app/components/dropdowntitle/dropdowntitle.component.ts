import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AssistantselectorService } from '@services/assistantselector.service';
import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-dropdowntitle',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './dropdowntitle.component.html',
  styleUrl: './dropdowntitle.component.css',
})
export class DropdowntitleComponent {


  assistantselectorService = inject(AssistantselectorService);

  userService = inject(UserService);
  authService = inject(AuthService);

}
