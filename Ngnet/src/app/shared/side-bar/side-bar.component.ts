import { Component, Input } from '@angular/core';
import { ISideBarModel } from 'src/app/interfaces/side-bar-model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  @Input() model: ISideBarModel = { visible: false };

  constructor() { }

  switch() {
    this.model.visible = !this.model.visible;
  }
}
