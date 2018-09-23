import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from './position-calculator.model';

@Injectable({
    providedIn: 'root'
})

export class PositionCalculatorResource {

    constructor(private httpClient: HttpClient) { }

    public getTransactions(): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>('http://localhost:3000/transactions');
    }

}
