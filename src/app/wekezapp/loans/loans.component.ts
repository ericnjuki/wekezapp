import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loans',
  templateUrl: 'loans.component.html',
  styleUrls: ['./loans.component.scss']
})

export class LoansComponent implements OnInit {

  dropdownToggle = true;
  selectedReceipient = 'Emma Watson';
  selectedLoan = 'Ksh. 50,000';

  ngOnInit() { }

  toggleDropdown(classOrId) {
    // this.dropdownToggle = true;
    const dropDownMenu = document.getElementsByClassName(classOrId);
    if (this.dropdownToggle) {
      dropDownMenu.item(0).setAttribute('style', 'display: block;');
    } else {
      dropDownMenu.item(0).setAttribute('style', 'display: none;');
    }
    this.dropdownToggle = this.dropdownToggle ? false : true;
  }

  selectReceipient(receipientName) {
    this.selectedReceipient = receipientName;
    this.toggleDropdown('ddown-content-name');
  }
  selectLoan(loanId) {
    this.selectedLoan = loanId;
    this.toggleDropdown('ddown-content-loan');
  }
}
