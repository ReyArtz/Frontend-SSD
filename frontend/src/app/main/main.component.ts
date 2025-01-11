import { Component, Injectable, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

@Injectable()
export class MainComponent implements OnInit {
  user: any;
  balance: number = 0;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {
    initializeApp(environment.firebaseConfig); // Initialize Firebase with environment config
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
    this.http.get('/balance').subscribe((data: any) => { //ceva de genul asta ar trebui sa fie
      this.balance = data.balance;
    });
  }

  updateBalance(newBalance: number) {
    // const db = getDatabase();
    // const balanceRef = ref(db, 'users/' + this.user.uid);

    // set(balanceRef, {
    //   balance: newBalance
    // }).then(() => {
    //   this.balance = newBalance; 
    // }).catch((error: any) => {
    //   console.error("Error updating balance:", error);
    //   this.errorMessage = "Error updating balance.";
    // });
    return -1;
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']); // for logout
    }).catch((error: any) => {
      console.error("Error signing out:", error);
      this.errorMessage = "Error signing out.";
    });
  }

  //menu
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
