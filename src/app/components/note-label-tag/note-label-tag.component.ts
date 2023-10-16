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
export class NoteLabelTagComponent implements OnDestroy {
  @Input() note!: Note;
  @Input() showAdditionalLabels: boolean = true;
  @Input() slice: boolean = true;
  private labelTitle!: string;
  private associateLabelsSubscription!: Subscription;

  constructor(private labelService: LabelService) {
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  shouldShowAdditionalLabels(note: Note): boolean {
    return note.labels.length > 2;
  }

  associateLabelWithNote(label: Label, note: Note) {
   this.labelService.associateLabelWithNote(label, note);
  }
  public onMouseEnter(label: Label) {
    this.labelHover(label, true);
  }

  public onMouseLeave(label: Label) {
    this.labelHover(label, false);
  }
   private labelHover(label: Label, hover: boolean) {
    label.showCancel = hover;
    if (hover) {
      this.labelTitle = label.labelTitle;
      const limit = 4;
      if (label.labelTitle.length >= 4 && label.labelTitle.length <= 6) {
        label.labelTitle = label.labelTitle.substring(0, 2) + "...";
      } else if (label.labelTitle.length > 6) {
        label.labelTitle = label.labelTitle.substring(0, label.labelTitle.length - limit) + "...";
      }
    } else {
      label.labelTitle = this.labelTitle;
    }
  }

  ngOnDestroy(): void {
    if (this.associateLabelsSubscription) {
      this.associateLabelsSubscription.unsubscribe();
    }
  }
}
