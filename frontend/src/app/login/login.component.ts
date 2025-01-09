import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any = null;
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    const app = initializeApp(environment.firebaseConfig);
    const auth = getAuth(app);

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        this.user = result.user;
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.user = null;
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    // Your login logic here
    console.log('Logging in with email and password...');
  }
}
