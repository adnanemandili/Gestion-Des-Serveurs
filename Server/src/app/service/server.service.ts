import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustumResponse } from '../interface/custum-response';
import { Observable,throwError} from 'rxjs';
import {catchError,tap} from 'rxjs/operators'
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({ providedIn: 'root'})
export class ServerService {
  private readonly apiUrl= 'http://localhost:8081/server';
  constructor(private http: HttpClient) { }
  servers$=<Observable<CustumResponse>>this.http.get<CustumResponse>(`${this.apiUrl}/list`)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  save$=(server:Server) => <Observable<CustumResponse>>this.http.post<CustumResponse>(`${this.apiUrl}/save`,server)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  server$=(id:number) => <Observable<CustumResponse>>this.http.get<CustumResponse>(`${this.apiUrl}/get/${id}`)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  ping$=(ipAddress:string) => <Observable<CustumResponse>>this.http.get<CustumResponse>(`${this.apiUrl}/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  filter$=(status:Status, response:CustumResponse) => <Observable<CustumResponse>>
  new Observable<CustumResponse>(
    suscriber => {
      console.log(response);
      suscriber.next(
        status === Status.ALL ? { ...response,message:`Servers filtred by ${status} status`}:
        {
          ...response,
          message: response.data.servers
          .filter(server => server.status === status).length > 0 ? `Servers filtred by ${status === Status.SERVER_UP?'SERVER UP':'SERVER DOWN'} status` : `No Servers found in ${status} status`,
          data: {servers: response.data.servers?.filter(server => server.status === status)}
        }
      );
      suscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  serverById$=(id:number) => <Observable<CustumResponse>>this.http.get<CustumResponse>(`${this.apiUrl}/get/${id}`)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );

  delete$=(id:number) => <Observable<CustumResponse>>this.http.delete<CustumResponse>(`${this.apiUrl}/delete/${id}`)
  .pipe(
    tap(console.log),
    catchError(this.handelError)
  );
  private handelError(error: HttpErrorResponse):Observable<never> {
    console.log(error);
    return throwError(`An Error occured -Error code: ${error.status}`); 
  }
}

