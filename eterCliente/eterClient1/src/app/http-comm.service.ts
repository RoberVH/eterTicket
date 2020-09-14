import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable,throwError, of } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';




//import { constantes } from './constantes';
import {usuario} from './usuario';

const httpOptionslogin = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Response-Type': 'text',
  })
};



@Injectable({
  providedIn: 'root'
})
export class HttpCommService {

  paramsGetBase ={
    params: {
    'Content-Type':  'application/json',
    'Response-Type': 'json',
  }};

  constructor(private http: HttpClient) { }

   logUser(endPoint:string, usuario:string, password:string): Observable<any>{
    let loginJson= { username:'', passw:'' };
    loginJson.username=usuario;
    loginJson.passw=password;
    //console.log('-logUser en http-comm - loginJson ',loginJson);
    let loginStr=JSON.stringify(loginJson);
    //console.log('-logUser en http-comm - por postear loginStr ',loginStr);
    return this.http.post(endPoint,loginStr,httpOptionslogin);
  }

  public consultaDatos(endPoint:string,headers:any): Observable<any> {
    console.log('entrando a consultadatos');
    
  //console.log('consultaDatos. Asi sera el llamado: ', endPoint,JSON.stringify(headers));
      return this.http.get(endPoint,{headers}) //.pipe(catchError(this.handleError));
      //.catch(this.handleError);
      /*.catch (error => {
          console.log('Manejador interno de Error.error.msg: ',error.error.message); 
           throw(error.error.message)} )*/
}

    private handleError(error: any): Observable<any> {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      console.log('Mi manejador de Error.error.msg: ',error.error.message);
      return throwError(error.error.message);
      //return Observable.throw(error.error.message);
      //return observableThrowError('Hubo error.error.message');
      // if (error.status==500) { this.router.navigate(['login'])} else {return throwError(errMsg)}
    }
}


