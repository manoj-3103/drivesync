import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  selectedEmployeeId: any;
  private clientId = '1099306377307-mr40lb1vi6t70cbl9784s27k7havge62.apps.googleusercontent.com';
  private redirectUri = 'http://localhost:4200/auth';
  private scope = 'https://www.googleapis.com/auth/drive';
  private revokeUrl = 'https://accounts.google.com/o/oauth2/revoke';

  constructor(private http: HttpClient, private router: Router) { }

  loginWithGoogle() {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=token&scope=${this.scope}&prompt=consent`;
    window.location.href = authUrl;
  }

  getAccessTokenFromUrl(): string | null {
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    console.log('window.location.search: ', window.location.hash.substring(1));
    return fragment.get('access_token');
  }

  getRefreshTokenFromUrl() {
    const fragment = new URLSearchParams(window.location.search);
    return fragment.get('refresh_token');
  }

  revokeAccessToken(accessToken: string) {
    const params = new HttpParams().set('token', accessToken);
    return this.http.post(this.revokeUrl, null, { params });
  }
}
