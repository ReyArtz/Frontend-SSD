import { Component, Injectable, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturier',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule], 
  templateUrl: './facturier.component.html',
  styleUrls: ['./facturier.component.css']
})

@Injectable()
export class FacturierComponent implements OnInit {
  recipient: string = '';
  amount: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  user: any;

  constructor(private http: HttpClient, private router: Router) {
    initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    this.user = auth.currentUser;
  }

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  async sendBill() {
    if (!this.recipient || this.amount <= 0) {
      this.errorMessage = 'Please fill in all fields with valid values';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.http.post('/sendbill', {
        recipient: this.recipient,
        amount: this.amount
      }).toPromise();

      this.successMessage = 'Bill sent successfully';
      this.recipient = '';
      this.amount = 0;
    } catch (error) {
      console.error('Error sending bill:', error);
      this.errorMessage = 'Failed to send bill. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error: any) => {
      console.error('Error signing out:', error);
      this.errorMessage = 'Error signing out. Please try again.';
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
