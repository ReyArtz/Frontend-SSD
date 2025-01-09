import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide the router with the routes
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),  // Initialize Firebase
    provideAuth(() => getAuth())  // Initialize Firebase Authentication
  ],
}).catch((err) => console.error(err));
