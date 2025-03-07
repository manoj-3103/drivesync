import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthComponent } from './authorization/google-auth/google-auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,GoogleAuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'drivesync';
}
