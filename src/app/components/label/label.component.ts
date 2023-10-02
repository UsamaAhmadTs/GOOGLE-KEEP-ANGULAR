import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

@Component({
    selector: 'app-label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
    @ViewChild("modalContainer ") modalContainer !: ElementRef<HTMLInputElement>
    @ViewChild("modal") modal !: ElementRef<HTMLInputElement>
    @ViewChild("labelError") labelError !: ElementRef<HTMLInputElement>
    labels: string[] = [];

    constructor(private notesService: NotesService) {
    }

    ngOnInit(): void {
        this.notesService.getLabels().subscribe(labels => {
        });
    }

}
