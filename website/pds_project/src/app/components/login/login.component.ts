import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private api: ApiService,
    private userService: UserService,
    private router: Router
  ) { }

  onSubmit() {
    this.api.signIn(this.email, this.password).subscribe({
      next: (res) => {
        this.userService.setToken(res.token);
        console.log(this.userService.user);

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err;
        console.error(this.errorMessage);
      }
    });
  }
}
