import { Injectable } from '@angular/core';
import {Contact} from './contact';
import {CONTACTS} from './mockup-contacts';
import  {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  serverUrl = "/api/v1";

  constructor(private httpClient: HttpClient) { }

  getContacts(): Observable<Contact[]>{
    const url = this.serverUrl + "/contacts"
    return this.httpClient.get<Contact[]>(url)
  }
}
