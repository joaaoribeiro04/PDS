import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from '../orders/orders.component';
import { UserService } from '../../services/user.service';
import { AnnouncementsComponent } from "../announcements/announcements.component";
import { RequestsComponent } from "../requests/requests.component";
import { InvoicesComponent } from '../invoices/invoices.component';
import { ReportsComponent } from "../reports/reports.component";
import { WarningsComponent } from "../warnings/warnings.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, OrdersComponent, AnnouncementsComponent, RequestsComponent, InvoicesComponent, ReportsComponent, WarningsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  tabs = ['announcements', 'requests', 'reports', 'invoices', 'orders', 'warnings'];
  activeTab: string = this.tabs[0];

  constructor(private userService: UserService) { }

  get userName(): string {
    return this.userService.user?.name || 'User';
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
