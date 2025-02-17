import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Assistant 4 All';

  authService = inject(AuthService);

  ngOnInit(): void {
      this.authService.user$.subscribe((user) => {
        if (user) {
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!
          });
        } else {
          this.authService.currentUserSig.set(null);
        }
        console.log(this.authService.currentUserSig());

      });
  }






}
