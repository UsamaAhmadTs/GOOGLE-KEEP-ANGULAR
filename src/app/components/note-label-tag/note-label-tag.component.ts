import {Component, Input, OnDestroy} from '@angular/core';

import {Note} from "../note";

import {Label} from "../label";

import {LabelService} from "../label.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-note-label-tag',
  templateUrl: './note-label-tag.component.html',
  styleUrls: ['./note-label-tag.component.scss']
})
export class NoteLabelTagComponent implements OnDestroy{
  @Input() note!: Note;
  @Input() showAdditionalLabels: boolean = true;
  @Input() slice: boolean = true;
  private associateLabelsSubscription!: Subscription;
  constructor(private labelService: LabelService) {
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onMouseEnter(label: Label) {
    label.showCancel = true;
  }

  onMouseLeave(label: Label) {
    label.showCancel = false;
  }

  shouldShowAdditionalLabels(note: Note): boolean {
    return note.labels.length > 2;
  }

  associateLabelWithNote(label: Label, note: Note) {
    this.associateLabelsSubscription = this.labelService.associateLabelWithNote(label, note).subscribe();
  }
  ngOnDestroy(): void {
    if (this.associateLabelsSubscription) {
      this.associateLabelsSubscription.unsubscribe();
    }
  }
}
