import {Component, ElementRef, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Router} from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @ViewChild('Btn') Btn!: ElementRef;

    searchQuery: string = '';

    isFocused: boolean = false;

    constructor(private noteService: NotesService, private router: Router) {
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
        this.Btn.nativeElement.hidden = false;
    }

    clearSearchField() {
        const searchQuery = document.getElementById('search') as HTMLInputElement;
        if (searchQuery) {
            searchQuery.value = '';
        }
        this.router.navigate(['/notes']);
        this.Btn.nativeElement.hidden = true;
    }

}
