import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { environment } from '../../environments/environment';

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

  constructor(private router: Router) {
    const app = initializeApp(environment.firebaseConfig);
    const auth = getAuth(app);
  }

  registerWithEmail() {
    const auth = getAuth();

    if (this.password === this.confirmPassword) {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log('User registered:', userCredential.user);
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.error('Registration error:', error.message);
        });
    } else {
      console.error('Passwords do not match');
    }
  }

  registerWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google registration successful:', result.user);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Google registration error:', error.message);
      });
  }
}
