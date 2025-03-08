import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fs: Firestore) { }

  getAllFiles(): Observable<any[]> {
    const employeeDocuments = collection(this.fs, 'employeeDocuments');
    return collectionData(employeeDocuments) as Observable<any[]>;
  }

  uploadFile() {

  }

  deleteFile() {

  }
}
