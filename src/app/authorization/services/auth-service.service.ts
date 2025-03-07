import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  selectedEmployeeId: any;
  private clientId = '1099306377307-mr40lb1vi6t70cbl9784s27k7havge62.apps.googleusercontent.com';
  private clientSecretId = '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';
  private redirectUri = 'http://localhost:4200/auth';
  private scope = 'https://www.googleapis.com/auth/drive';
  private revokeUrl = 'https://accounts.google.com/o/oauth2/revoke';

  constructor(private http: HttpClient, private router: Router) { }

  loginWithGoogle() {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${this.scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  }

  getAccessTokenFromUrl(): Observable<void> {
    const params = new URLSearchParams(window.location.search);
    console.log('window.location.search: ', window.location.search);
    console.log('params: ', params);
    const code = params.get('code');
    console.log('code: ', code);
    if (code) {
      return this.exchangeCodeForTokens(code);
    } else {
      return of()
    }
  }

  exchangeCodeForTokens(code: string): Observable<void> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const body = new HttpParams()
      .set('code', code)
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecretId)
      .set('redirect_uri', this.redirectUri)
      .set('grant_type', 'authorization_code');

    return this.http.post<any>(tokenUrl, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.router.navigate(['/']);
      }),
      switchMap(() => of(undefined))
    );
  }

  refreshToken(token: any): Observable<any> {
    const refreshToken: any = token;
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecretId)
      .set('refresh_token', refreshToken)
      .set('grant_type', 'refresh_token');

    return this.http.post(tokenUrl, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      }),
      switchMap(() => of(undefined))
    );
  }

  revokeAccessToken(accessToken: any) {
    const params = new HttpParams().set('token', accessToken);
    return this.http.post(this.revokeUrl, null, { params });
  }
}
