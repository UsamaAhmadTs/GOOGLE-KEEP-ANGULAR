import {Component} from '@angular/core';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  notesClicked: boolean = true;
  archiveClicked: boolean = false;
  onNoteClick() {
    this.notesClicked = true;
    this.archiveClicked = false;
  }
  onArchiveClick() {
    this.archiveClicked = true;
    this.notesClicked = false;
  }
}
