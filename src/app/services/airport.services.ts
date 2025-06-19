import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AirportService {
  private apiUrl = 'http://localhost:8000/airports';

  constructor(private http: HttpClient) {}

  getAirports(token: string,): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<any>(this.apiUrl, { headers });
  }

  createAirport(token: string, airport: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl, airport, { headers });
  }

  getAirport(token: string, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  updateAirport(token: string, id: number, airportUpdate: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, airportUpdate, { headers });
  }

  deleteAirport(token: string, id?: number, name?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (id === undefined) {
      throw new Error('id is required for deleteAirport');
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
