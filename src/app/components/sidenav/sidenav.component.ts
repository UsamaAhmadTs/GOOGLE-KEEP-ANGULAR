import {Component, ElementRef} from '@angular/core';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  onItemClick(item: ElementRef) {
    const items = document.querySelectorAll('.item');
    items.forEach((el) => el.classList.remove('focused'));
    item.nativeElement.classList.add('focused');
  }
}
