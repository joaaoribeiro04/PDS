import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  allReports: any[] = [];
  allUsers: any[] = [];
  newReportDesc = '';
  filterStatus: 'ALL' | 'PENDING' | 'CLOSED' = 'ALL';
  selectedReport: any = null;
  showWarningModal = false;

  constructor(private api: ApiService, public userService: UserService) { }

  get isAdmin(): boolean {
    return this.userService.user.roles?.isAdmin || false;
  }

  get filteredUserReports() {
    const myReports = this.allReports.filter(r => r.user_id === this.userService.user.id && r.is_report);
    if (this.filterStatus === 'PENDING') return myReports.filter(r => r.status === 'PENDING');
    if (this.filterStatus === 'CLOSED') return myReports.filter(r => r.status !== 'PENDING');
    return myReports;
  }

  get filteredAllReports() {
    const reports = this.allReports.filter(r => r.is_report);
    if (this.filterStatus === 'PENDING') return reports.filter(r => r.status === 'PENDING');
    if (this.filterStatus === 'CLOSED') return reports.filter(r => r.status !== 'PENDING');
    return reports;
  }

  ngOnInit(): void {
    this.loadReports();
    if (this.isAdmin) this.loadAllUsers();
  }

  loadReports() {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.getAllRequests(token).subscribe(res => {
      this.allReports = res;
    });
  }

  loadAllUsers() {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.getAllUsers(token).subscribe(users => {
      this.allUsers = users;
    });
  }

  submitReport() {
    const token = this.userService.user.token;
    if (!token || !this.newReportDesc.trim()) return;

    const body = {
      user_id: this.userService.user.id,
      description: this.newReportDesc.trim(),
      is_report: true
    };

    this.api.createReport(body, token).subscribe(() => {
      this.newReportDesc = '';
      this.loadReports();
    });
  }

  approveReport(report: any) {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.updateReport(report.id, {
      admin_id: this.userService.user.id,
      accepted: true,
      response: 'Taking actions'
    }, token).subscribe(() => {
      this.openWarningModal(report);
      this.loadReports()
    });
  }

  rejectReport(report: any) {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.updateReport(report.id, {
      admin_id: this.userService.user.id,
      accepted: false,
      response: 'Rejected by admin'
    }, token).subscribe(() => this.loadReports());
  }

  openWarningModal(report: any) {
    this.selectedReport = report;
    this.showWarningModal = true;
  }

  cancelWarning() {
    this.selectedReport = null;
    this.showWarningModal = false;
  }

  issueWarning() {
    const token = this.userService.user.token;
    const resident_id = this.selectedReport?.selectedUserId;

    if (!token || !resident_id) return;

    const body = {
      admin_id: this.userService.user.id,
      resident_id,
      description: `Report: ${this.selectedReport.description}`,
      date: new Date().toLocaleDateString()
    };

    this.api.createWarning(body, token).subscribe(() => {
      this.selectedReport = null;
      this.showWarningModal = false;
      alert('Warning issued.');
    });
  }
}
