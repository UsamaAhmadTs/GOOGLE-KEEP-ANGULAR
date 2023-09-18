import { Injectable } from '@angular/core';

import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private HttpService: HttpService) { }

  createNote(reqData: any) {
    return this.HttpService.PostService("notes/addNotes", reqData, true);
  }

  getNotes(){
    return this.HttpService.GetService("notes/getNotesList", true);

  }

  updateNotes(reqData: any){
    return this.HttpService.PostService("notes/updateNotes", reqData, true);
  }

  archiveMoveNotes(reqData: any) {
    return this.HttpService.PostService("notes/archiveNotes", reqData,true);
  }

  getArchiveNotesList(){
    return this.HttpService.GetService("notes/getArchiveNotesList", true);
  }

  deleteForeverNotes(reqData: any){
    return this.HttpService.PostService("notes/deleteForeverNotes", reqData,true);
  }

}
