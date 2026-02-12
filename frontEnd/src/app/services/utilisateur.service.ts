import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateur`;

  // pour partager les donnees utilisateurs
  private currentUserSubject = new BehaviorSubject<any>(null);

  //Observable public pour que les composants s'abonnent
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient , private router: Router) { }

  get currentUserValue(): any{
    return this.currentUserSubject.value;
  }

  login(email: string, motDePasse: string){
    return this.http.post(`${this.apiUrl}/login` , {email,motDePasse});
  }

  getUtilisateurById(id : string){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserByIdObservable(id: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  getUtilisateurRole(id : string){
    return this.http.get(`${this.apiUrl}/${id}/role`);
  }

  
  getAllUtilisateursNotAdmin(){
    return this.http.get(`${this.apiUrl}/notAdmin`);
  }
  
  getAllBoutiques(){
    return this.http.get(`${this.apiUrl}/boutique`);
  }
  
  getAllClients(){
    return this.http.get(`${this.apiUrl}/client`);
  }

  updateInfosUtilisateur(id : string , user : any){
    return this.http.put(`${this.apiUrl}/updateUserInfo/${id}`, user).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  updateCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
  }

  logout(): void {
    const userInfo = localStorage.getItem('user');
    let role = '';

    if (userInfo) {
      const user = JSON.parse(userInfo);
      role = user?.role?.libelle;
    }

    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    switch (role) {
      case 'Admin':
        this.router.navigate(['/login/admin']);
        break;

      case 'Boutique':
        this.router.navigate(['/login/boutique']);
        break;

      case 'Client':
        this.router.navigate(['/login/client']);
        break;

      default:
        this.router.navigate(['/login/client']);
    }
}
}
