import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('clearSearch') clearSearch!: ElementRef;

  searchQuery: string = '';

  isFocused: boolean = false;

  constructor(private noteService: NotesService, private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute === '/archived' || currentRoute === '/notes') {
          this.clearNavigate(currentRoute);
        }
      }
    });
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  isArchiveRoute(): boolean {
    return this.router.url === '/archived';
  }

  onSearchInputChange() {
    this.noteService.setSearchQuery(this.searchQuery)
    this.router.navigate(['/search']);
    this.clearSearch.nativeElement.hidden = false;
  }

  clearSearchField() {
    const searchQuery = document.getElementById('search') as HTMLInputElement;
    if (searchQuery) {
      searchQuery.value = '';
    }
    this.router.navigate(['/notes']);
    this.clearSearch.nativeElement.hidden = true;
  }
  clearNavigate(currentRoute: string) {
    const searchQuery = document.getElementById('search') as HTMLInputElement;
    if (searchQuery) {
      searchQuery.value = '';
    }

    if (currentRoute === '/archived') {
      this.router.navigate(['/archived']);
    } else {
      this.router.navigate(['/notes']);
    }

    this.clearSearch.nativeElement.hidden = true;
  }
}
