import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  notesClicked: boolean = true;
  archiveClicked: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute === '/archived') {
          this.archiveClicked = true;
          this.notesClicked = false;
        }else if (currentRoute === '/notes'){
          this.notesClicked = true;
          this.archiveClicked = false;
        }
      }
    });
  }

  onNoteClick() {
    this.notesClicked = true;
    this.archiveClicked = false;
  }
  onArchiveClick() {
    this.archiveClicked = true;
    this.notesClicked = false;
  }

}
