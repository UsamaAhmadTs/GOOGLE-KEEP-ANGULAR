import {Component, EventEmitter, Output} from '@angular/core';

type InputLengthI = { title?: number, body?: number }

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  showFirst = true;
  showDropdownMenu = false;

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  toggleDivs() {
    this.showFirst = !this.showFirst;
  }

  title: string = '';
  text: string = '';

  @Output() saveNote = new EventEmitter<{ title: string, text: string }>();

  onSaveNote() {
    if (this.title.trim() !== '' && this.text.trim() !== '') {
      this.saveNote.emit({title: this.title, text: this.text});
      this.title = '';
      this.text = '';

      // Save note in local storage
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      notes.push({title: this.title, text: this.text});
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }

  addLabel() {
  }

}
