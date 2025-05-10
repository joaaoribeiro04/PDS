// announcements.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})

export class AnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  mostRecent: any | null = null;
  newAnnouncement = { description: '', image: '', date: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private api: ApiService, private userService: UserService) { }

  get isAdmin(): boolean {
    return this.userService.user.roles?.isAdmin || false;
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    const token = this.userService.user.token || '';

    this.api.getAnnouncements(token).subscribe({
      next: (res) => {
        let sorted = res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.mostRecent = sorted[0];
        this.announcements = sorted.slice(1);
      },
      error: (err) => {
        this.errorMessage = err || 'Failed to load announcements';
      }
    });
  }
  createAnnouncement() {
    const token = this.userService.user.token || '';
    const admin_id = this.userService.user.id || 0;
    const data = { ...this.newAnnouncement };

    this.api.createAnnouncement(admin_id, token, data).subscribe({
      next: (res) => {
        this.successMessage = 'Announcement created';
        this.newAnnouncement = { description: '', image: '', date: '' };
        this.loadAnnouncements();
      },
      error: (err) => {
        this.errorMessage = err || 'Failed to create announcement';
      }
    });
  }
}
