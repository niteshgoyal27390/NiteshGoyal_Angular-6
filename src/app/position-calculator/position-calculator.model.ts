export class Position {
    instrument: String;
    account: String;
    accountType: String;
    quantity: number;
}

export class EndPosition {
    instrument: String;
    account: String;
    accountType: String;
    quantity: number;
    delta: number;
}

export class Transaction {
    TransactionId: String;
    Instrument: String;
    TransactionType: String;
    TransactionQuantity: number;
}
