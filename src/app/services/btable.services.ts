import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BtableService {
  private apiUrl = 'http://localhost:8000/db/table';

  constructor(private http: HttpClient) {}

  getBtable(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(this.http.get<any>(this.apiUrl, { headers }));
    return this.http.get<any>(this.apiUrl);
  }
}
