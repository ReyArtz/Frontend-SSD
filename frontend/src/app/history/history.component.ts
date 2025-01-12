import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';  // Import signOut from Firebase Authentication
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [DatePipe]
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchTransactionHistory();
  }

  fetchTransactionHistory() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    this.http.get(`/history/${userId}`).subscribe({
      next: (data: any) => {
        this.transactions = data.transactions;
      },
      error: (error: any) => {
        console.error('Error fetching transaction history:', error);
        this.errorMessage = 'Error fetching transaction history. Please try again later.';
      }
    });
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error: any) => {
      console.error('Error logging out:', error);
      this.errorMessage = 'Error signing out. Please try again.';
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
