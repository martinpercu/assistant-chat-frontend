import { Component } from '@angular/core';

@Component({
  selector: 'app-button-theme',
  standalone: true,
  imports: [],
  templateUrl: './button-theme.component.html',
  styleUrl: './button-theme.component.css'
})
export class ButtonThemeComponent {
  isDarkMode: boolean = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
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

}
