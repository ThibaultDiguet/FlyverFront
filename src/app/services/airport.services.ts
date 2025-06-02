import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private apiUrl = 'http://localhost:8000/airport';

  constructor(private http: HttpClient) {}

  getAirports(token: string, id?: number, name?: string): Observable<any> {
    let params = new HttpParams();
    if (id) params = params.set('id', id);
    if (name) params = params.set('name', name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  createAirport(token: string, airport: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.apiUrl, airport, { headers });
  }

  updateAirport(token: string, id: number, airportUpdate: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let params = new HttpParams().set('id', id);
    return this.http.patch<any>(this.apiUrl, airportUpdate, { headers, params });
  }

  deleteAirport(token: string, id?: number, name?: string): Observable<any> {
    let params = new HttpParams();
    if (id) params = params.set('id', id);
    if (name) params = params.set('name', name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(this.apiUrl, { headers, params });
  }
}
