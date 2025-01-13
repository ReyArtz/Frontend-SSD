import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.css']
})

@Injectable()
export class DepositMoneyComponent {
  amount: number = 0;
  errorMessage: string = '';
  currentPage: string = 'deposit-money';

  constructor(private router: Router, private http: HttpClient) {}

  depositMoney() {
    if (this.amount === 0) {
      alert('Amount cannot be zero. Please enter a valid amount.');
      return;
    }

    const isWithdrawal = this.amount < 0; // Check if the amount is negative
    const operation = isWithdrawal ? 'withdrawn' : 'deposited';

    this.http.post('/modifyfunds', {
      "amount": this.amount
    }).subscribe({
      next: (response: any) => {
        alert(`Successfully ${operation} $${Math.abs(this.amount)}!`); // Display positive value for amount
        this.router.navigate(['/main']); 
      },
      error: (error) => {
        console.error('Error during transaction:', error);
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  navigateTo(path: string) {
    this.currentPage = path; 
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
