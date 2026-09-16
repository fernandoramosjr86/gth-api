import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'egret-notifications2',
    templateUrl: './egret-notifications2.component.html',
    styleUrls: ['./egret-notifications2.component.scss'],
    standalone: true,
    imports: [CommonModule, MatSidenavModule]
})
export class EgretNotifications2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
