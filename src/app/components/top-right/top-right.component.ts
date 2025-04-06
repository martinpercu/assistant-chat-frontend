import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-top-right',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './top-right.component.html',
  styleUrl: './top-right.component.css'
})
export class TopRightComponent {

  showlist: boolean = false

  switchShowList(){
    this.showlist = !this.showlist
  }

}
