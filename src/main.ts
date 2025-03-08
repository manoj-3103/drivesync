import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { importProvidersFrom } from '@angular/core';

const firebaseConfig = {
  apiKey: "AIzaSyAha9qMzNtEEbohxpQ3zRfrVzU_djxh-lY",
  authDomain: "drive-sync-5279a.firebaseapp.com",
  projectId: "drive-sync-5279a",
  storageBucket: "drive-sync-5279a.firebasestorage.app",
  messagingSenderId: "1054181005908",
  appId: "1:1054181005908:web:4cc90354e2c362dbc76bc1",
  measurementId: "G-BJHJY5PRTY"
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideHttpClient(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(firebaseConfig))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ]
}).catch(err => console.error(err));
