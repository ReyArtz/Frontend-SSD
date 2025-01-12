import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent {
  recipient: string = '';
  amount: number = 0;
  errorMessage: string = '';
  currentPage: string = 'send-money';

  constructor(private router: Router, private http: HttpClient) {}

  sendMoney() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;

    if (!this.recipient || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid recipient and amount.';
      return;
    }

    if (this.recipient.toLowerCase() === userEmail?.toLowerCase()) {
      this.errorMessage = 'You cannot send money to yourself!';
      return;
    }

    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    this.http.post('/transfer', {
      senderId: userId,
      recipient: this.recipient,
      amount: this.amount
    }).subscribe({
      next: (response: any) => {
        alert(`Money sent to ${this.recipient}! Amount: $${this.amount}`);
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Error during money transfer:', err);
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  logout() {
    const auth = getAuth();

    signOut(auth).then(() => {
      console.log('User signed out');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout error:', error);
      this.errorMessage = 'Error signing out. Please try again.';
    });
  }
  navigateTo(path: string) {
    this.currentPage = path;
    this.router.navigate([path]);
  }
}
