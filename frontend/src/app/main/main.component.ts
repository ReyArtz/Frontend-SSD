import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: any;
  balance: number = 0;
  errorMessage: string = '';

  constructor(private router: Router) {
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
    const db = getDatabase();
    const balanceRef = ref(db, 'users/' + this.user.uid + '/balance');
    get(balanceRef).then((snapshot) => {
      if (snapshot.exists()) {
        this.balance = snapshot.val();
      } else {
        this.balance = 0; 
      }
    }).catch((error: any) => {
      console.error("Error fetching balance:", error);
      this.errorMessage = "Error fetching balance.";
    });
  }

  updateBalance(newBalance: number) {
    const db = getDatabase();
    const balanceRef = ref(db, 'users/' + this.user.uid);

    set(balanceRef, {
      balance: newBalance
    }).then(() => {
      this.balance = newBalance; 
    }).catch((error: any) => {
      console.error("Error updating balance:", error);
      this.errorMessage = "Error updating balance.";
    });
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
