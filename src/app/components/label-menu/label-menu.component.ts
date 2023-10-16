import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy, OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

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
export class LabelMenuComponent implements OnDestroy {
  @Input() labelDropdown: boolean = false;
  @Input() DialogBoxOpen!: boolean;
  @Input() note!: Note;
  @Input() searchLabelText: string = '';
  @Output() labelTitleChange = new EventEmitter<string>();
  @ViewChild('labelSearchText') labelSearchText!: ElementRef;
  @ViewChild('labelArea') labelArea!: ElementRef;

  labels: Label[] = [];
  searchLabels: Label[] = [];
  labelTitle: string = '';
  private labelsSubscription: Subscription;
  private searchLabelsSubscription!: Subscription
  private associateLabelsSubscription!: Subscription;

  constructor(private labelService: LabelService,private renderer: Renderer2, private elementRef: ElementRef) {
    this.labelsSubscription = this.labelService.getLabels().subscribe(labels => {
      this.labels = labels;
    });
    this.labelService.labelTitle$.subscribe(title => {
      this.labelTitle = title;
    });
  }

  associateLabelWithNote(label: Label, note: Note) {
   this.labelService.associateLabelWithNote(label, note);
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

  searchHeight() {
    const searchEl = this.labelSearchText?.nativeElement;
    const labelEl = this.labelArea?.nativeElement;

    if (searchEl) {
      const contentOverflows = searchEl.scrollHeight > searchEl.clientHeight;
      const desiredHeight = contentOverflows
        ? searchEl.scrollHeight + 16
        : searchEl.clientHeight + 10;
      this.renderer.setStyle(labelEl, 'height', `${desiredHeight}px`);
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
    this.labelService.setLabelTitle(this.labelTitle);
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
