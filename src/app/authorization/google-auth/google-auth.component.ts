import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DriveService } from '../services/drive-service.service';
import { EmployeeService } from '../services/employee-service.service';
import { AuthService } from '../services/auth-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent implements OnInit, OnDestroy {

  employees: any = [
    { id: 'emp1', name: 'John Doe' },
  ];

  employeeId = 'emp1';

  file = new File(["Sample Document"], `doc-emp1.txt`, { type: "text/plain" })

  accessToken: any;
  refreshToken: any;
  isSignedIn: boolean = false;
  isRefreshTokenAvailable: boolean = false; // need to integrate from backend

  private driveUploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  constructor(private http: HttpClient, private driveService: DriveService, private employeeService: EmployeeService, private authService: AuthService) {
  }

  ngOnInit(): void {
    const services: Observable<any> = this.isRefreshTokenAvailable ? this.authService.refreshToken(this.refreshToken) : this.authService.getAccessTokenFromUrl();
    services.subscribe({
      next: () => {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        console.log('this.accessToken: ', this.accessToken);
        console.log('this.refreshToken: ', this.refreshToken);
        this.isSignedIn = !!this.accessToken;
      },
      error: (err) => {
        console.error('Error occurred:', err);
      }
    })
  }

  syncAllEmployeesDocuments() {
    const metadata = {
      name: this.file.name,
      mimeType: this.file.type
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', this.file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });
    this.http.post(this.driveUploadUrl, formData, { headers }).subscribe((response: any) => {
      console.log(`File uploaded for John Doe:`, response);
    });
  }

  loginEmployee() {
    this.authService.loginWithGoogle();
  }

  revokeAccess() {
    this.authService.revokeAccessToken(localStorage.getItem('access_token')).subscribe(() => console.log("Access Revoked"));
    this.destroyLocalStorage();
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
