import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deposit-money.component.html',
  styleUrls: ['./deposit-money.component.css']
})
export class DepositMoneyComponent {
  amount: number = 0;  
  errorMessage: string = '';  

  constructor(private router: Router) {}

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


    const db = getDatabase();
    const balanceRef = ref(db, 'users/' + userId + '/balance');

    get(balanceRef).then((snapshot) => {
      const currentBalance = snapshot.val();
      
     
      const newBalance = currentBalance + this.amount;
      set(ref(db, 'users/' + userId), { balance: newBalance });

      this.errorMessage = ''; 
      alert(`Successfully deposited $${this.amount}! Your new balance is $${newBalance}`);

     
      this.router.navigate(['/main']);
    }).catch((error) => {
      this.errorMessage = 'Error fetching balance: ' + error.message;
    });
  }

  
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out: ', error);
    });
  }
}
