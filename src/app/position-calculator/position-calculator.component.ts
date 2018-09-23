import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Position, Transaction } from './position-calculator.model';
import { PositionCalculatorService } from './position-calculator.service';

@Component({
    selector: 'app-position-calculator',
    templateUrl: './position-calculator.component.html',
    styleUrls: ['./position-calculator.component.css']
})
export class PositionCalculatorComponent implements OnInit {
    public transactions: Transaction[];
    public positionCalculatorForm: FormGroup;
    public startOfDayPositions: Transaction[];
    public positions: Position[];
    public error: Boolean = false;

    constructor(private positionService: PositionCalculatorService) { }

    ngOnInit() {
        this.transactions = this.positionService.fetchTransactions();
        this.positionCalculatorForm = new FormGroup({
            positions: new FormControl('', Validators.required)
        });
    }

    get formControls() {
        return this.positionCalculatorForm.controls;
    }

    public onUploadPositions(event): void {
        this.startOfDayPositions =
            this.positionService.fetchPositionData(event);
    }

    public markFormAsTouched(form: FormGroup | FormArray) {
        (<any>Object).values(form.controls).forEach(control => {
            if (control.controls) {
                // control is a FormGroup or FormArray
                this.markFormAsTouched(control);
            } else {
                // control is a FormControl
                control.markAsTouched();
            }
        });
    }

    public preaprePositions(): void {
        if (this.startOfDayPositions && this.startOfDayPositions.length > 0) {
            this.startOfDayPositions.forEach((position) => {
                if (this.positions === undefined) {
                    this.positions = [{
                        instrument: position[0],
                        account: position[1],
                        accountType: position[2],
                        quantity: +position[3]
                    }];
                } else {
                    this.positions.push({
                        instrument: position[0],
                        account: position[1],
                        accountType: position[2],
                        quantity: +position[3]
                    });
                }
            });
        }
    }

    public close() {
        this.error = false;
    }

    public calculatePosition() {
        this.positionService.calculatePosition(this.positions, this.transactions);
    }

    public onSubmit() {
        if (this.startOfDayPositions && this.startOfDayPositions.length > 0) {
            this.markFormAsTouched(this.positionCalculatorForm);
            // Do not submit form if invalid.
            if (this.positionCalculatorForm.invalid) {
                return;
            } else {
                this.positions = [];
                this.transactions = this.positionService.fetchTransactions();
                this.preaprePositions();
            }
        } else {
            this.error = true;
        }
    }
}
