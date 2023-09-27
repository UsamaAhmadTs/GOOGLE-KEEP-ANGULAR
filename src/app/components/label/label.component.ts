import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NotesService} from "../notes-service";

import {Label} from "../label";

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit{
  @ViewChild("modalContainer ") modalContainer !: ElementRef<HTMLInputElement>
  @ViewChild("modal") modal !: ElementRef<HTMLInputElement>
  @ViewChild("labelError") labelError !: ElementRef<HTMLInputElement>
  labels: string[] = [];

  constructor(private notesService:NotesService) {
  }
  addLabel(labelInput: HTMLInputElement) {
    if (!labelInput) return;
    const label = labelInput.value;
    let highestNoteId = parseInt(localStorage.getItem('highestNoteId') || '0', 10);
    if (label) {
      const newLabel: Label = {
        labelId: highestNoteId + 1,
        labelTitle: label
      };
    }
  }
  ngOnInit(): void {
    this.notesService.getLabels().subscribe(labels => {
      this.labels = labels;
      console.log(labels)
    });
  }

}
