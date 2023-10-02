import {Label} from "./label";
export interface Note{
  noteId: string;
  noteTitle?: string;
  noteText?: string;
  isArchived: boolean;
  showDropdownMenu?: boolean;
  showLabelMenu?: boolean;
  display?: boolean;
  labels: Label[];
}
