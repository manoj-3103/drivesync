import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { AuthService } from '../services/auth-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent implements OnInit, OnDestroy {

  selectedFile: File | null = null;
  uploadResponse: any = null;
  files: any[] = [];
  accessToken: any;
  refreshToken: any;
  isSignedIn: boolean = false;
  isRefreshTokenAvailable: boolean = false; // need to integrate from backend


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const services: Observable<any> = this.isRefreshTokenAvailable ? this.authService.refreshToken(this.refreshToken) : this.authService.getAccessTokenFromUrl();
    services.subscribe({
      next: () => {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        console.log('this.accessToken: ', this.accessToken);
        console.log('this.refreshToken: ', this.refreshToken);
        this.isSignedIn = !!this.accessToken;
        this.getGooleDriveFiles();
      },
      error: (err) => {
        console.error('Error occurred:', err);
      }
    })
  }

  getGooleDriveFiles() {
    if (this.accessToken) {
      this.authService.getDriveFiles(this.accessToken).subscribe((response: any) => {
        this.files = response.files;
        console.log(this.files);
      });
    }
  }

  deleteFile(fileId: string) {
    if (this.accessToken) {
      this.authService.deleteFile(this.accessToken, fileId).subscribe(() => {
        console.log('File deleted:', fileId);
        this.files = this.files.filter(file => file.id !== fileId);
      }, (error: any) => {
        console.error('Error deleting file:', error);
      });
    }
  }

  loginEmployee() {
    this.authService.loginWithGoogle();
  }

  revokeAccess() {
    this.authService.revokeAccessToken(localStorage.getItem('access_token')).subscribe(() => console.log("Access Revoked"));
    this.destroyLocalStorage();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('this.selectedFile: ', this.selectedFile);
  }

  uploadFile() {
    if (this.selectedFile && this.accessToken) {
      this.authService.uploadFile(this.accessToken, this.selectedFile).subscribe((response: any) => {
        this.uploadResponse = response;
        this.selectedFile = null;
        this.getGooleDriveFiles();
        console.log('File uploaded:', response);
      }, (error: any) => {
        console.error('Upload error:', error);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyLocalStorage();
  }

  destroyLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isSignedIn = false;
  }

}
