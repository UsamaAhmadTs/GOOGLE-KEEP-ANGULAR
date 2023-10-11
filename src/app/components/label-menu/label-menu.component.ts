import {Component, Input, OnDestroy} from '@angular/core';

import {Label} from "../label";

import {Note} from "../note";

import {v4 as uuidv4} from "uuid";

import {LabelService} from "../label.service";

import {Subscription} from "rxjs";

@Component({
  selector: 'app-label-menu',
  templateUrl: './label-menu.component.html',
  styleUrls: ['./label-menu.component.scss']
})
export class LabelMenuComponent implements OnDestroy{
  @Input() labelDropdown: boolean = false;
  @Input() DialogBoxOpen!: boolean;
  @Input() note!: Note;
  @Input() searchLabelText: string = '';
  labels: Label[] = [];
  searchLabels: Label[] = [];
  labelTitle: string = '';
  private labelsSubscription: Subscription;
  private searchLabelsSubscription!: Subscription
  private associateLabelsSubscription!: Subscription;
  constructor(private labelService: LabelService) {
    this.labelsSubscription = this.labelService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
  }

  associateLabelWithNote(label: Label, note: Note) {
    this.associateLabelsSubscription = this.labelService.associateLabelWithNote(label, note).subscribe();
  }

  createLabel(labelTitle: string, note: Note) {
    if (labelTitle) {
      const newLabel: Label = {
        labelId: uuidv4(),
        labelTitle: labelTitle,
        showCancel: false
      };
      this.labelService.createLabel(newLabel);
      this.associateLabelWithNote(newLabel, note);
      this.labelTitle = '';
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  searchLabel(): void {
    if (this.labelTitle) {
      this.searchLabelsSubscription = this.labelService.searchLabels(this.labelTitle).subscribe(filteredLabels => {
        this.searchLabels = filteredLabels;
      });
    }
  }

  checkedBox(note: Note, findLabel: Label): boolean {
    const found = note.labels.find(label => label.labelId === findLabel.labelId);
    return !!found;
  }

  ngOnDestroy(): void {
    if (this.labelsSubscription) {
      this.labelsSubscription.unsubscribe();
    }
    if (this.searchLabelsSubscription) {
      this.searchLabelsSubscription.unsubscribe();
    }
    if (this.associateLabelsSubscription) {
      this.associateLabelsSubscription.unsubscribe();
    }
  }
}
