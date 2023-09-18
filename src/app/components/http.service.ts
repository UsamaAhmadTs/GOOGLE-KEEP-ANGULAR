import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrl = 'http://localhost:63414';

  constructor(private httpClient: HttpClient) { }

  PostService(url: string, reqPayload: any, token: boolean) {
    return this.httpClient.post(this.baseUrl + url, reqPayload );
  }

  GetService(url: string, token: boolean){
    return this.httpClient.get(this.baseUrl + url);
  }
}
