import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  
  private driveUploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  constructor(private http: HttpClient) {}

  // uploadFile(file: File, employeeId: string) {
  //   debugger
  //   const accessToken = localStorage.getItem(`code_verifier_${employeeId}`);
  //   if (!accessToken) {
  //     console.error(`No access token found for employee ${employeeId}`);
  //     return;
  //   }

  //   const metadata = { name: file.name, mimeType: file.type };
  //   const formData = new FormData();
  //   formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  //   formData.append("file", file);

  //   const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });

  //   return this.http.post(this.driveUploadUrl, formData, { headers });
  // }

  uploadFile(file: File, employeeId: string) {

    const accessToken = localStorage.getItem(`code_verifier_${employeeId}`);
    if (!accessToken) {
      console.error(`No access token found for employee ${employeeId}`);
      return;
    }
    const metadata = {
        name: file.name,
        mimeType: file.type
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`
    });

    return this.http.post(this.driveUploadUrl, formData, { headers });
}

}
