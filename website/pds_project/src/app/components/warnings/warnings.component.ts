import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss']
})
export class WarningsComponent implements OnInit {
  userWarnings: any[] = [];

  constructor(private api: ApiService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadWarnings();
  }

  loadWarnings() {
    const token = this.userService.user.token;
    const userId = this.userService.user.id;

    if (!token || !userId) return;

    this.api.getAllWarnings(token).subscribe(warnings => {
      this.userWarnings = warnings.filter(w => w.resident_id === userId);
    });
  }
}
