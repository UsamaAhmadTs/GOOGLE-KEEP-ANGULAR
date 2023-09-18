import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild("form23zSaZ") form23zSaZ?: ElementRef<HTMLDivElement>

  refresh() {
    window.location.reload()
  }

  ngOnInit(): void {
  }

}
