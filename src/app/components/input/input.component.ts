import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Note} from "../note";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NotesService} from "../notes-service";

type InputLengthI = { title?: number, body?: number }

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit{
  showFirst = true;
  showDropdownMenu = false;
  @Output() createNoteRefreshEvent = new EventEmitter<any>();
  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  toggleDivs() {
    this.showFirst = !this.showFirst;
  }

  constructor(
    private formBuilder: FormBuilder,
  private notesService: NotesService
  ){}
  notes! : FormGroup;
  ngOnInit(): void {
    this.notes = this.formBuilder.group({
      title: [''],
      note: ['']
    })
  }
  createNote(){
    let sendData = {
      title: this.notes.value.title,
      description: this.notes.value.note
    }

    this.notesService.createNote(sendData).subscribe((result:any) =>{
      this.createNoteRefreshEvent.emit(result);
    });

    this.notes.reset();
    this.showFirst = !this.showFirst;
  }

  addLabel() {}

}
