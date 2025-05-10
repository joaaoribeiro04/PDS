import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})

export class InvoicesComponent implements OnInit {
  allInvoices: any[] = [];
  filterStatus: 'ALL' | 'PAID' | 'UNPAID' = 'ALL';
  showModal = false;
  usersWithoutInvoice: any[] = [];

  constructor(private api: ApiService, public userService: UserService) { }

  get isAdmin(): boolean {
    return this.userService.user.roles?.isAdmin || false;
  }

  get filteredAllInvoices() {
    if (this.filterStatus === 'PAID') return this.allInvoices.filter(inv => inv.isPaid === true);
    if (this.filterStatus === 'UNPAID') return this.allInvoices.filter(inv => inv.isPaid === false);

    return this.allInvoices;
  }

  get filteredUserInvoices() {
    const userId = this.userService.user.id;
    const myInvoices = this.allInvoices.filter(inv => inv.user_id === userId);

    if (this.filterStatus === 'PAID') return myInvoices.filter(inv => inv.isPaid === true);
    if (this.filterStatus === 'UNPAID') return myInvoices.filter(inv => inv.isPaid === false);

    return myInvoices;
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.getAllinvoices(token).subscribe(res => {
      this.allInvoices = res;
    });
  }

  markAsPaid(invoiceId: number) {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.updateInvoice(invoiceId, { isPaid: true }, token).subscribe(() => {
      this.loadInvoices();
    });
  }

  openInvoiceModal() {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.getAllUsers(token).subscribe(users => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      this.usersWithoutInvoice = users.filter(user => {
        const hasInvoiceThisMonth = this.allInvoices.some(inv =>
          inv.user_id === user.id &&
          new Date(inv.issue_date).getMonth() === currentMonth &&
          new Date(inv.issue_date).getFullYear() === currentYear
        );
        return !hasInvoiceThisMonth;
      });

      this.showModal = true;
    });
  }

  createInvoiceForUser(userId: number) {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.createInvoice({ user_id: userId, isPaid: false }, token).subscribe(() => {
      this.loadInvoices();
      this.showModal = false;
    });
  }

  isPastDue(dueDate: string): boolean {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  }

  emitWarning(invoice: any) {
    const token = this.userService.user.token;
    if (!token) return;

    const payload = {
      admin_id: this.userService.user.id,
      resident_id: invoice.user_id,
      description: 'Invoice payment is due',
      date: new Date().toLocaleDateString(),
    };

    this.api.createWarning(payload, token).subscribe(() => {
      alert(`Warning sent to user ID ${invoice.user_id} for invoice ${invoice.id}.`);
    });
  }
}
