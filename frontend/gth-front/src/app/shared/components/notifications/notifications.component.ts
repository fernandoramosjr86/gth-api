import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      MatIconModule,
      MatButtonModule,
      MatListModule
    ]
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;

  // Dummy notifications
  notifications = [{
    message: 'New contact added',
    icon: 'assignment_ind',
    time: '1 min ago',
    route: '/inbox',
    color: 'primary'
  }, {
    message: 'New message',
    icon: 'chat',
    time: '4 min ago',
    route: '/chat',
    color: 'accent'
  }, {
    message: 'Server rebooted',
    icon: 'settings_backup_restore',
    time: '12 min ago',
    route: '/charts',
    color: 'warn'
  }]

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });
  }
  clearAll(e) {
    e.preventDefault();
    this.notifications = [];
  }
}
