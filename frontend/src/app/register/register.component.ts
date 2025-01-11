import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Method to register with email
  registerWithEmail() {
    // Check if all fields are filled out
    if (!this.email || !this.password || !this.confirmPassword) {
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
        this.errorMessage = ''; // Clear any previous errors
        this.router.navigate(['/login']); // Redirect to login page after successful registration
      })
      .catch((error) => {
        console.error('Registration error:', error.message);
        this.errorMessage = error.message; // Display Firebase error message
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
        this.router.navigate(['/login']); // Redirect to login page after successful Google registration
      })
      .catch((error) => {
        console.error('Google registration error:', error.message);
        this.errorMessage = 'Failed to register with Google. Please try again.'; // Display error message for Google login
      });
  }

  // Method to navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']); // Redirect to login page
  }
}
