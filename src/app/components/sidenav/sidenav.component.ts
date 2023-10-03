import {Component} from '@angular/core';

import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
    constructor(public dialog: MatDialog) {
    }

}
