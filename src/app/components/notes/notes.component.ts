import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  title: string = '';
  text: string = '';
  notes: { title: string, text: string }[] = []; // Array to hold notes

  ngOnInit() {
    // Retrieve notes from local storage
    this.notes = JSON.parse(localStorage.getItem('notes') || '[]');
  }

  onSaveNote() {
    // Get the title and text values
    const title = (document.getElementById('noteTitle') as HTMLInputElement).value;
    const text = (document.getElementById('noteText') as HTMLInputElement).value;

    // Create a note object
    const note = { title, text };

    // Save the note in local storage
    this.notes.push(note);
    localStorage.setItem('notes', JSON.stringify(this.notes));

    // Clear the form
    (document.getElementById('noteTitle') as HTMLInputElement).value = '';
    (document.getElementById('noteText') as HTMLInputElement).value = '';
  }
}
