import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

@Injectable()
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userType: string = 'user'; // Default user type is 'user'
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  // Method to register with email
  registerWithEmail() {
    // Check if all fields are filled out
    if (!this.email || !this.password || !this.confirmPassword || !this.userType) {
      this.errorMessage = 'All fields are required';
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Check password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    const auth = getAuth();

    // Attempt to create the user with email/password
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User registered:', userCredential.user);
        this.errorMessage = '';

        // Send user type to the backend
        this.http.post('/create', { 
          email: this.email, 
          type: this.userType 
        }).subscribe({
          next: () => {
            console.log('User type saved to backend');
            this.router.navigate(['/login']); // Redirect to login page after successful registration
          },
          error: (err) => {
            console.error('Error saving user type:', err);
            this.errorMessage = 'Error saving user type. Please try again.';
          }
        });
      })
      .catch((error) => {
        console.error('Registration error:', error.message);
        this.errorMessage = error.message;
      });
  }

  // Method to register with Google
  registerWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // Attempt to sign in with Google
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google registration successful:', result.user);
        this.errorMessage = ''; // Clear any previous errors

        // Send user type to the backend (default type for Google registration is 'user')
        this.http.post('/create', { 
          email: result.user.email, 
          type: this.userType 
        }).subscribe({
          next: () => {
            console.log('User type saved to backend for Google user');
            this.router.navigate(['/login']); // Redirect to login page
          },
          error: (err) => {
            console.error('Error saving user type for Google user:', err);
            this.errorMessage = 'Error saving user type for Google user. Please try again.';
          }
        });
      })
      .catch((error) => {
        console.error('Google registration error:', error.message);
        this.errorMessage = 'Failed to register with Google. Please try again.';
      });
  }

  // Method to navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']); // Redirect to login page
  }
}
