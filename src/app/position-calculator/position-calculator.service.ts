import { Injectable } from '@angular/core';
import { Transaction, Position, EndPosition } from './position-calculator.model';
import { PositionCalculatorResource } from './position-calculator.resource';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Injectable({
  providedIn: 'root'
})
export class PositionCalculatorService {
  public transactions: Transaction[];
  public endOfDayPositions: EndPosition[] = [];
  constructor(private positionResource: PositionCalculatorResource) { }

  public fetchTransactions(): Transaction[] {
    this.positionResource.getTransactions().subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
    });
    return this.transactions;
  }

  public fetchPositionData(event: any) {
    const fileToRead = event.target.files[0];
    const positionItems = [];
    if (event.target.files && event.target.files.length) {

      if (!this.validateFile(event.target.files[0].name)) {
        return [];
      }

      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent: any) => {

        const textFromFileLoaded = fileLoadedEvent.target.result;
        const csvContent = textFromFileLoaded;
        const allTextLines = csvContent.split(/\r|\n|\r/);
        const positionHeaders = allTextLines[0].split(',');

        if (!(positionHeaders && positionHeaders.length === 4)) {
          return [];
        }

        for (let i = 1; i < allTextLines.length; i++) {
          // split content based on comma
          const data = allTextLines[i].split(',');
          if (data.length === positionHeaders.length) {
            const position = [];
            for (let j = 0; j < data.length; j++) {
              position.push(data[j]);
            }
            positionItems.push(position);
          }
        }
      };
      fileReader.readAsText(fileToRead, 'UTF-8');
      return positionItems;
    }
  }

  public validateFile(name: String): Boolean {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'txt') {
      return true;
    } else {
      return false;
    }
  }

  public calculatePosition(positions: Position[], transactions: Transaction[]) {
    positions.forEach(position => {
      const instrument = position.instrument;
      const accountType = position.accountType;
      const startPoitionQuantity = position.quantity;
      let endPoitionQuantity = position.quantity;
      let delta = 0;
      transactions.forEach(transaction => {
        if (instrument === transaction.Instrument) {
          if (transaction.TransactionType === 'B') {
            if (accountType === 'E') {
              endPoitionQuantity += transaction.TransactionQuantity;
            } else {
              endPoitionQuantity -= transaction.TransactionQuantity;
            }
          } else {
            if (accountType === 'E') {
              endPoitionQuantity -= transaction.TransactionQuantity;
            } else {
              endPoitionQuantity += transaction.TransactionQuantity;
            }
          }
        }
      });
      delta = endPoitionQuantity - startPoitionQuantity;
      this.endOfDayPositions.push({
        instrument: instrument,
        account: position.account,
        accountType: accountType,
        quantity: endPoitionQuantity,
        delta: delta
      });
    });
    this.exportEndOfDayPositionToCSV();
  }

  public exportEndOfDayPositionToCSV() {
    const options = {
      fieldSeparator: ',',
      headers: ['Instrument', 'Account', 'AccountType', 'Quantity', 'Delta']
    };
    const exportFile = new Angular5Csv(this.endOfDayPositions, 'Expected_EndOfDay_Positions', options);
  }
}
