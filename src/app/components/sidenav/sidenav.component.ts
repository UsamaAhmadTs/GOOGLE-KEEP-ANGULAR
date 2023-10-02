import {Component} from '@angular/core';

import {MatDialog} from "@angular/material/dialog";

import {LabelComponent} from "../label/label.component";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
    constructor(public dialog: MatDialog) {
    }

    openEditLabelsModal(): void {
        const dialogRef = this.dialog.open(LabelComponent, {});
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}
