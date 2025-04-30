import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';

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
  userService = inject(UserService);
  // isDarkMode = false;

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!
        });
        // this.userService.userSig.set({
        //   email: user.email!,
        //   username: user.displayName!,
        //   userUID: user.uid!
        // });
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig());
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  //   if (this.isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }

  // constructor() {
  //   const id = this.authService.getUserUid();
  //   if (id) {
  //     this.userId = id
  //     // console.log('hay parametro', this.userId);
  //     this.getUser()
  //   }
  // };

  // async getUser() {
  //   const userGetted = await this.clientService.getOneUser(this.userId);
  //   this.user = userGetted;
  //   // console.log(this.user);
  //   this.buildForm();
  //   if(this.user.stripeCustomerId == 'none') {
  //     console.log('tiene NONE')
  //   }
  //   else {
  //     this.syncStripeAccount();
  //   }
  // };



}
