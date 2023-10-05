import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFooterComponent } from './note-footer.component';

describe('NoteFooterComponent', () => {
  let component: NoteFooterComponent;
  let fixture: ComponentFixture<NoteFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteFooterComponent]
    });
    fixture = TestBed.createComponent(NoteFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
