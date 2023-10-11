import {Component, HostListener} from '@angular/core';
import {NotesService} from "./components/notes-service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Google Keep';

}
