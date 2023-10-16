import {Component, OnDestroy} from '@angular/core';

import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

import {Subscription} from "rxjs";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy {
  notesClicked: boolean = true;
  archiveClicked: boolean = false;
  private routeSubscription!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute === '/archived') {
          this.archiveClicked = true;
          this.notesClicked = false;
        } else if (currentRoute === '/notes') {
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

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
