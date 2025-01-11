import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent {
  recipient: string = '';  // The name of the person the user is sending money to
  amount: number = 0;  // The amount the user wants to send
  errorMessage: string = '';  // Error message in case something goes wrong

  constructor(private router: Router) {}

  sendMoney() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const userName = auth.currentUser?.displayName;

    // Check if recipient is the same as the logged-in user
    if (this.recipient.toLowerCase() === userName?.toLowerCase()) {
      this.errorMessage = 'You cannot send money to yourself!';
      return;  // Early return in case of error
    }

    // Validate input
    if (!this.recipient || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid recipient and amount.';
      return;  // Early return in case of missing information
    }

    if (!userId) {
      this.errorMessage = 'User not logged in.';
      return;  // Early return in case user is not logged in
    }

    // Fetch user balance from the database
    const db = getDatabase();
    const balanceRef = ref(db, 'users/' + userId + '/balance');
    
    get(balanceRef).then((snapshot) => {
      const currentBalance = snapshot.val();
      
      // Check for sufficient balance
      if (currentBalance < this.amount) {
        this.errorMessage = 'Insufficient balance!';
        return;  // Early return in case balance is insufficient
      }

      const newBalance = currentBalance - this.amount;
      set(ref(db, 'users/' + userId), { balance: newBalance });

      // Handle recipient's balance update
      const recipientRef = ref(db, 'users/' + this.recipient);
      get(recipientRef).then((recipientSnapshot) => {
        if (recipientSnapshot.exists()) {
          const recipientBalance = recipientSnapshot.val().balance || 0;
          const updatedRecipientBalance = recipientBalance + this.amount;
          set(ref(db, 'users/' + this.recipient), { balance: updatedRecipientBalance });
          this.errorMessage = '';  // Clear any error messages
          alert(`Money sent to ${this.recipient}! Amount: $${this.amount}`);

          // After sending money, navigate back to the main page
          this.router.navigate(['/main']);
        } else {
          this.errorMessage = 'Recipient not found!';
        }
      }).catch((error) => {
        this.errorMessage = 'Error updating recipient balance: ' + error.message;
      });

    }).catch((error) => {
      this.errorMessage = 'Error fetching balance: ' + error.message;
    });
  }
}
