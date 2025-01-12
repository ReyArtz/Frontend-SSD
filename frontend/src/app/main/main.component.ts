import { Component, Injectable, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, HttpClientModule,CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

@Injectable()
export class MainComponent implements OnInit {
  user: any;
  balance: number = 0;
  errorMessage: string = '';
  currentPage: string = 'main';  

  constructor(private router: Router, private http: HttpClient) {
    initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    this.user = auth.currentUser;
  }

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/login']); 
    } else {
      this.fetchBalance();
    }
  }

  fetchBalance() {
    this.http.get('/balance').subscribe({
      next: (data: any) => {
        this.balance = data.balance;
      },
      error: (error: any) => {
        console.error('Error fetching balance:', error);
        this.errorMessage = 'Error fetching balance. Please try again later.';
      }
    });
  }

  refreshBalance() {
    this.fetchBalance();  
  }

  checkBalance() {
    alert(`Your current balance is: $${this.balance}`);
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
    this.currentPage = path;  // Update current page to show balance section when on 'main'
    this.router.navigate([path]);
  }
}
