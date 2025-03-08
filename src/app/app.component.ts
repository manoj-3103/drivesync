import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthComponent } from './authorization/google-auth/google-auth.component';
import { FireService } from './authorization/services/fire.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleAuthComponent, NgFor, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  documents: any = [];
  files: any[] = [];

  constructor(private fireService: FireService) { }

  ngOnInit(): void {
    this.getAllFiles();
  }


  getAllFiles() {
    this.fireService.getAllFiles()
      .subscribe({
        next: (data) => {
          this.documents = data[0].Documents;
          console.log(data[0].Documents)
        }, error: (error) => {
          console.log(error)
        }
      });
  }
}
