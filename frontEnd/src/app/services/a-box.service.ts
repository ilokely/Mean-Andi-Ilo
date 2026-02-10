import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ABoxService {
  private apiUrl = `${environment.apiUrl}/box`;
  

  constructor(private http: HttpClient , private router: Router) { }
  
  getBusyBoxes(){
    return this.http.get(`${this.apiUrl}/unAvailable`);
  } 

  getFreeBoxes(){
    return this.http.get(`${this.apiUrl}/available`);
  }

  createBox(box: any){
    return this.http.post(`${this.apiUrl}`, box);
  }

  updateBox(id: string, box: any){
    return this.http.put(`${this.apiUrl}/${id}`, box);
  }

  deleteBox(id: string){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
