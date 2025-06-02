import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelPlaneService {
  private apiUrl = 'http://localhost:8000/model_plane';

  constructor(private http: HttpClient) {}

  getModelPlanes(token: string, name?: string, manufacturer?: string, id?: number): Observable<any> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (manufacturer) params = params.set('manufacturer', manufacturer);
    if (id) params = params.set('id', id);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  createModelPlane(token: string, modelPlane: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(this.apiUrl, modelPlane, { headers });
  }

  updateModelPlane(token: string, id: number, updateData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updateData, { headers });
  }

  deleteModelPlane(token: string, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
