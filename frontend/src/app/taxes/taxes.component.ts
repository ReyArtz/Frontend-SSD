import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { getAuth, signOut } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-taxes',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})

@Injectable()
export class TaxesComponent{
  bills: any[] = [];
  errorMessage: string = '';
  currentPage: string = 'taxes'; // For menu highlighting

  constructor(private router: Router, private http: HttpClient) {
    this.fetchBills();
  }

  fetchBills() {
    this.http.get('/bills').subscribe({
      next: (data: any) => {
        this.bills = data; // Assuming `data.bills` contains the list of bills
      },
      error: (error) => {
        if(error.status === 404) {
          return;
        }
        console.error('Error fetching bills:', error);
        this.errorMessage = 'Error fetching bills. Please try again later.';
      }
    });
  }

  payBill(billId: string) {

    this.http.get(`/paybill/${billId}`).subscribe({
      next: () => {
        alert('Bill paid successfully!');
        this.fetchBills(); // Refresh the list of bills
      },
      error: (error) => {
        console.error('Error paying bill:', error);
        this.errorMessage = 'Error paying the bill. Please try again.';
      }
    });
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  navigateTo(path: string) {
    this.currentPage = path;
    this.router.navigate([path]);
  }
}
