import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule],
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.css']
})
export class DepositMoneyComponent {
  amount: number = 0;
  errorMessage: string = '';
  currentPage: string = 'deposit-money'; // Set the current page for highlighting the menu

  constructor(private router: Router, private http: HttpClient) {}

  depositMoney() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (this.amount <= 0) {
      this.errorMessage = 'Please enter a valid deposit amount.';
      return;
    }

    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    // Call the backend endpoint to modify funds
    this.http.post('/modifyfunds', {
      userId: userId,
      amount: this.amount,
    }).subscribe({
      next: (response: any) => {
        alert(`Successfully deposited $${this.amount}!`);
        this.router.navigate(['/main']); // Navigate back to the main page
      },
      error: (error) => {
        console.error('Error during deposit:', error);
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  navigateTo(path: string) {
    this.currentPage = path; // Update the current page
    this.router.navigate([path]);
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out:', error);
      this.errorMessage = 'Error signing out. Please try again.';
    });
  }
}
