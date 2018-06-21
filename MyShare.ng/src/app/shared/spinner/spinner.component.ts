import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template:`
  <div class="overlay"> 
    <div class="overlay-content text-center">
      <div style="display:inline-block" class="loader"></div>
    </div>
  </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  constructor() { 
  }
}
