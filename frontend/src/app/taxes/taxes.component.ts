import { Component, OnInit } from '@angular/core';
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
export class TaxesComponent implements OnInit {
  bills: any[] = [];
  errorMessage: string = '';
  currentPage: string = 'taxes'; // For menu highlighting

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBills();
  }

  fetchBills() {
    this.http.get('/bills').subscribe({
      next: (data: any) => {
        this.bills = data.bills; // Assuming `data.bills` contains the list of bills
      },
      error: (error) => {
        console.error('Error fetching bills:', error);
        this.errorMessage = 'Error fetching bills. Please try again later.';
      }
    });
  }

  payBill(billId: string) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      this.errorMessage = 'User not logged in. Please log in to pay the bill.';
      return;
    }

    this.http.post(`/paybill/${userId}`, { billId }).subscribe({
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
