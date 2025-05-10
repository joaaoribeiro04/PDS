import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  newRequestDesc = '';
  userRequests: any[] = [];
  allRequests: any[] = [];
  filterStatus: string = '';
  userFilter: string = 'ALL';

  constructor(private api: ApiService, private userService: UserService) { }

  get isAdmin(): boolean {
    return this.userService.user.roles?.isAdmin || false;
  }

  get filteredRequests() {
    return this.filterStatus
      ? this.allRequests.filter(req => req.status === this.filterStatus)
      : this.allRequests;
  }

  filteredUserRequests() {
    if (this.userFilter === 'ALL') return this.userRequests;
    return this.userRequests.filter(req => req.status === this.userFilter);
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    const { id, token } = this.userService.user;
    if (!token) return;

    this.api.getAllRequests(token).subscribe(res => {
      this.allRequests = res;
      this.userRequests = this.allRequests.filter(req => req.user_id === id);
    });
  }

  submitRequest() {
    const { id, token } = this.userService.user;
    if (!this.newRequestDesc || !id || !token) return;

    this.api.createRequest(id, this.newRequestDesc, token).subscribe({
      next: () => {
        this.newRequestDesc = '';
        this.loadRequests();
      }
    });
  }

  respondToRequest(requestId: number, response: string, accepted: boolean) {
    const { id, token } = this.userService.user;

    if (!token || !id) return;

    this.api.updateRequest(requestId, id, response, accepted, token).subscribe({
      next: () => this.loadRequests()
    });
  }
}
