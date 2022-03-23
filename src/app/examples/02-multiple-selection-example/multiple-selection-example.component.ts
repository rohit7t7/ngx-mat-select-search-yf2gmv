import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatOption, MatSelect } from '@angular/material';

import { Bank, BANKS } from '../demo-data';

@Component({
  selector: 'app-multiple-selection-example',
  templateUrl: './multiple-selection-example.component.html',
  styleUrls: ['./multiple-selection-example.component.scss'],
})
export class MultipleSelectionExampleComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** list of banks */
  protected banks: Bank[] = BANKS;

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(
    1
  );

  @ViewChild('multiSelect') multiSelect: MatSelect;
  placeholder: any = 'Banks';
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  allSelected: any = false;

  constructor() {}

  ngOnInit() {
    // set initial selection
    this.bankMultiCtrl.setValue([...this.banks]);

    // load the initial bank list
    this.filteredBanksMulti.next(this.banks.slice());

    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log(this.banks);
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Bank, b: Bank) =>
          a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.banks.filter((bank) => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  checkall(e) {
    this.checkUncheckList(e);
  }

  checkUncheckList(e) {
    this.placeholder = 'Bank';
    if (e.name == 'Select All') {
      if (
        this.bankMultiCtrl.value.length == 1 ||
        this.bankMultiCtrl.value.length == this.banks.length
      ) {
        this.bankMultiCtrl.setValue([...this.banks]);
        this.placeholder = 'Bank';
      } else {
        const index = this.bankMultiCtrl.value.findIndex((object) => {
          return object.name === 'Select All';
        });
        if (index > -1) {
          this.bankMultiCtrl.setValue([...this.banks]);
          this.placeholder = 'Bank';
        } else {
          this.bankMultiCtrl.setValue([]);
          this.placeholder = 'None Selected';
        }
      }
    } else {
      if (this.bankMultiCtrl.value.length == this.banks.length - 1) {
        console.log(this.banks.length - 1);
        var arr = this.bankMultiCtrl.value;
        const index = arr.findIndex((object) => {
          return object.name === 'Select All';
        });
        if (index > -1) {
          this.bankMultiCtrl.value.splice(index, 1);
          this.bankMultiCtrl.setValue([...arr]);
          this.placeholder = 'Bank';
        } else {
          this.bankMultiCtrl.setValue([...this.banks]);
          this.placeholder = 'Bank';
        }
      }
    }
  }
}
