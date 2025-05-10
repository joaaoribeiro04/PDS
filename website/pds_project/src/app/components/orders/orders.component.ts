import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders: any[] = [];
  showModal = false;
  orderStatus: string | null = null;
  errorMessage: string | null = null;
  showStatusModal = false;
  selectedOrderId: number | null = null;
  selectedStatus: string | null = null;

  searchId: string = '';
  filterStatus: string = '';

  constructor(private api: ApiService, private userService: UserService) { }

  get isWorker(): boolean {
    return this.userService.user.roles?.isWorker || false;
  }

  get filteredOrders() {
    return this.orders
      .filter(order => !this.searchId || order.id.toString().includes(this.searchId))
      .filter(order => !this.filterStatus || order.status === this.filterStatus);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const token = this.userService.user.token;
    if (!token) return;

    this.api.getOrders(token).subscribe({
      next: (res) => {
        const userId = this.userService.user.id;
        this.orders = this.isWorker
          ? res
          : res.filter(order => order.user_id === userId);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load orders';
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  confirmAction() {
    const { id, token } = this.userService.user;

    if (!id || !token) {
      this.errorMessage = 'User not authenticated';
      this.showModal = false;
      return;
    }

    this.api.insertOrder(id, token).subscribe({
      next: (res) => {
        this.orderStatus = res.status;
        this.showModal = false;
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to create order';
        this.showModal = false;
      }
    });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const { id, token } = this.userService.user;

    this.api.updateOrder(orderId, id!, token!).subscribe({
      next: (res) => {
        this.orderStatus = `Order #${orderId} updated to ${newStatus}`;
        this.loadOrders();
        this.closeStatusModal();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update order';
        this.closeStatusModal();
      }
    });
  }

  cancelAction() {
    this.showModal = false;
  }

  openStatusModal(orderId: number, status: string) {
    this.selectedOrderId = orderId;
    this.selectedStatus = status;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedOrderId = null;
    this.selectedStatus = null;
  }

  confirmStatusUpdate() {
    if (!this.selectedOrderId || !this.selectedStatus) return;

    this.updateOrderStatus(this.selectedOrderId, this.selectedStatus);
  }
}
