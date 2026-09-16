import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.css'],
    standalone: false
})
export class ProfileSettingsComponent implements OnInit {
  public hasBaseDropZoneOver: boolean = false;
  constructor() { }

  ngOnInit() {
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
