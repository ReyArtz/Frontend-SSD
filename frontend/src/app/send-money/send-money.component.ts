import { Component, Injectable } from '@angular/core';
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

@Injectable()
export class SendMoneyComponent {
  recipient: string = '';
  amount: number = 0;
  errorMessage: string = '';
  currentPage: string = 'send-money';

  constructor(private router: Router, private http: HttpClient) {}

  sendMoney() {
    this.http.post('/transfer', {
      "email": this.recipient,
      "amount": this.amount
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
