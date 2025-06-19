import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaneService {
  private apiUrl = 'http://localhost:8000/planes';

  constructor(private http: HttpClient) {}

  getPlanes(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }

  createPlane(token: string, plane: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl, plane, { headers });
  }

  getPlane(token: string, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  updatePlane(token: string, id: number, updateData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateData, { headers });
  }

  deletePlane(token: string, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
