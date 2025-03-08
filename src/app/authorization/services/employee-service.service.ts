import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  employees: any = [
    { id: 'emp1', name: 'John Doe' },
  ];

  getEmployees() {
    return this.employees;
  }

  getEmployeeDocuments(employeeId: string): File[] {
    return [new File(["Sample Document"], `doc-${employeeId}.txt`, { type: "text/plain" })];
  }
}
