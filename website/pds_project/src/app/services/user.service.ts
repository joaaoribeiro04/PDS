import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: {
    isAdmin: boolean;
    isWorker: boolean;
  };
  exp: number;
  iat: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  user = {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTEsIm5hbWUiOiJKb8OjbyBTaWx2YSIsImVtYWlsIjoiMTc0NjExMzI0OTIzNUBpcGNhLnB0IiwicGhvbmUiOiI5MTIzNDU2NzgiLCJyb2xlcyI6eyJpc0FkbWluIjpmYWxzZSwiaXNXb3JrZXIiOmZhbHNlfX0.N73Pm8L3ApLveJj2H1Ev416CJ5GGbl9BcQEjtl-U9v8' as string | null,
    id: 51 as number | null,
    name: 'João Silva' as string | null,
    email: '1746113249235@ipca.pt' as string | null,
    phone: '912345678' as string | undefined,
    roles: {
      isAdmin: false,
      isWorker: false
    } as { isAdmin: boolean; isWorker: boolean; } | undefined
  };

  constructor() { }

  decodeToken(): void {
    if (!this.user.token) return;

    try {
      const payload = jwtDecode<TokenPayload>(this.user.token);

      this.user.id = payload.id;
      this.user.name = payload.name;
      this.user.email = payload.email;
      this.user.phone = payload.phone;
      this.user.roles = payload.roles;
    } catch (error) {
      console.error('Invalid token', error);
    }
  }

  setToken(token: string): void {
    this.user.token = token;
    this.decodeToken();
  }
}
