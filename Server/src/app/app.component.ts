import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { AppState } from './interface/app-state';
import { CustumResponse } from './interface/custum-response';
import { BehaviorSubject, Observable, catchError, map, of, pipe, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { Server } from './interface/server';
import { NgForm } from '@angular/forms';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  appState$:Observable<AppState<CustumResponse>>
  readonly DS=DataState;
  readonly Status=Status;
  ip :string;
  name:string;
  memory:string;
  type:string;
  ST:Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustumResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();


  constructor(private serverService: ServerService){}

  ngOnInit(): void{
    this.appState$ =this.serverService.servers$
    .pipe(
      map( response => {
        this.dataSubject.next(response)
        return {dataState: DataState.LOADED_STATE,appData: { ...response, data: { servers: response.data.servers.reverse()}}}
      }),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError((error:string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      })
    );
  }


  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          this.dataSubject.value.data.servers[this.dataSubject.value.data.servers.findIndex(server =>  server.id === response.data.server.id)] = response.data.server;
          //this.notifier.onDefault(response.message);
          this.filterSubject.next('');
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.filterSubject.next('');
          //this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }


  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          //this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          //this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }
  saveServer(serverForm : NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: {servers: [response.data.server, ...this.dataSubject.value.data.servers]}}
          );
          document.getElementById('closeModal').click();
          this.isLoading.next(false);
          serverForm.resetForm({status: this.Status.SERVER_DOWN});
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }
  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: 
              { servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)} }
          );
          //this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          //this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }


  get(server:Server):void{
    this.ip=server.ipAddress;
    this.name=server.name;
    this.memory=server.memory;
    this.type=server.type;
    this.ST=server.status;
  }



  printReport(): void {
    //this.notifier.onDefault('Report downloaded');
    // window.print();
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}