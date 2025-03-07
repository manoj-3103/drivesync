import { Component, OnInit } from '@angular/core';
import { DriveService } from '../services/drive-service.service';
import { EmployeeService } from '../services/employee-service.service';
import { AuthService } from '../services/auth-service.service';
import { CommonModule, NgFor } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent implements OnInit {

  employees: any = [
    { id: 'emp1', name: 'John Doe' },
  ];

  employeeId = 'emp1';

  file = new File(["Sample Document"], `doc-emp1.txt`, { type: "text/plain" })

  accessToken: any;
  refreshToken: any;

  private driveUploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  constructor(private http: HttpClient, private driveService: DriveService, private employeeService: EmployeeService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.accessToken = this.authService.getAccessTokenFromUrl();
    console.log('this.accessToken: ', this.accessToken);
    this.refreshToken = this.authService.getRefreshTokenFromUrl();
    console.log('this.refreshToken: ', this.refreshToken);
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
    this.authService.revokeAccessToken(this.accessToken).subscribe(() => console.log("Access Revoked"));
  }

}
