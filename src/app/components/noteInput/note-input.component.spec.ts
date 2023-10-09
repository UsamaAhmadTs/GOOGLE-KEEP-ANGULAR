import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteInputComponent } from './note-input.component';

describe('InputComponent', () => {
  let component: NoteInputComponent;
  let fixture: ComponentFixture<NoteInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteInputComponent]
    });
    fixture = TestBed.createComponent(NoteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
