import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SignInResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private readonly API_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  signIn(email: string, password: string): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.API_URL}/auth/signin`, {
      email,
      password,
    });
  }

  insertOrder(userId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.API_URL}/orders`, { user_id: userId }, { headers });
  }

  getOrders(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.API_URL}/orders`, { headers });
  }

  updateOrder(orderId: number, workerId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(`${this.API_URL}/orders/${orderId}`, { worker_id: workerId }, { headers });
  }

  createAnnouncement(adminId: number, token: string, data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.API_URL}/announcements`, {
      admin_id: adminId,
      description: data.description,
      image: data.image,
      date: data.date
    }, { headers });
  }

  getAnnouncements(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.API_URL}/announcements`, { headers });
  }

  createRequest(userId: number, description: string, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.API_URL}/requests`, { user_id: userId, description }, { headers });
  }

  getAllRequests(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.API_URL}/requests`, { headers });
  }

  updateRequest(requestId: number, adminId: number, response: string, accepted: boolean, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.API_URL}/requests/${requestId}`, { admin_id: adminId, response, accepted }, { headers });
  }

  getAllinvoices(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.API_URL}/invoices`, { headers });
  }

  createInvoice(data: { user_id: number; isPaid: boolean }, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.API_URL}/invoices`, data, { headers });
  }

  updateInvoice(id: number, data: { isPaid: boolean }, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.API_URL}/invoices/${id}`, data, { headers });
  }

  getAllUsers(token: string) {
    return this.http.get<any[]>(`${this.API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createWarning(payload: any, token: string) {
    return this.http.post(`${this.API_URL}/warnings`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getAllWarnings(token: string) {
    return this.http.get<any[]>(`${this.API_URL}/warnings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createReport(payload: any, token: string) {
    return this.http.post(`${this.API_URL}/requests`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateReport(id: any, payload: any, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.API_URL}/requests/${id}`, payload, { headers });
  }
}
