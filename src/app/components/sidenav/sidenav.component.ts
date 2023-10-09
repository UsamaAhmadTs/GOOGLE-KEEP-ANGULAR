import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  notesClicked: boolean = true;
  archiveClicked: boolean = false;
  @Output() notesClickedEmitter = new EventEmitter<boolean>();
  @Output() archiveClickedEmitter = new EventEmitter<boolean>();
  onNoteClick() {
    this.notesClicked = true;
    this.archiveClicked = false;
    this.notesClickedEmitter.emit(true);
  }
  onArchiveClick() {
    this.archiveClicked = true;
    this.notesClicked = false;
    this.archiveClickedEmitter.emit(true);
  }
}
