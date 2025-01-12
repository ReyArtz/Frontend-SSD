import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { RouterModule } from '@angular/router'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent {
  user: any = null;
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable to store error messages

  constructor(private router: Router, private http: HttpClient) {
    const app = initializeApp(environment.firebaseConfig);
    const auth = getAuth(app);

    // Check the user's authentication status
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        // If the user is logged in, redirect to the main page
        this.router.navigate(['/main']); // Redirect to the main page without '/balance'
      }
    });
  }

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        this.user = result.user;
        sessionStorage.setItem('token', this.user.accessToken);
        // After successful login, redirect to the main page
        this.router.navigate(['/main']); // Redirect to the main page
      })
      .catch((error) => {
        console.error(error.message);
        this.errorMessage = 'Failed to sign in with Google';
      });
  }

  logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.user = null;
        // Redirect to the login page after logout
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error(error.message);
        this.errorMessage = 'Failed to log out';
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    const auth = getAuth();

    // Attempt email/password login
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Login successful, redirect to the main page
        this.user = userCredential.user;
        sessionStorage.setItem('token', this.user.accessToken);

        this.http.get('/whoami') // Example of a request to backend
          .subscribe((response) => {
            console.log(response);
          });

        this.router.navigate(['/main']); // Redirect to the main page
      })
      .catch((error) => {
        // Handle errors here (wrong email/password)
        console.error(error.message);
        this.errorMessage = 'Invalid email or password';
      });
  }
}
