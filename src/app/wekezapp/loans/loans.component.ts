import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LedgerService } from 'src/app/services/ledger.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationType } from 'src/app/shared/flow-type.enum';

@Component({
  selector: 'app-loans',
  templateUrl: 'loans.component.html',
  styleUrls: ['./loans.component.scss']
})

export class LoansComponent implements OnInit {
  dropdownToggle = true;

  // requesting and paying loan
  loanRequestAmount = 1000;
  loanRepaymentAmount = 500;
  myLoans = [];
  myLoansDropdown = [];
  selectedLoanId;
  selectedLoan = '<select loan>';

  // all loans table
  allLoans = [];

  // adding existing loan
  selectedLoanee = '<select member>';

  constructor(private authService: AuthService, private ledgerService: LedgerService, private userService: UserService) {}
  ngOnInit() {
    this.ledgerService.getMyLoans()
      .subscribe(loans => {
        this.myLoans = loans;
        this.myLoans.forEach(loan => {
          const dateIssued = new Date(loan.dateIssued).toDateString();
          const dateRequested = new Date(loan.dateRequested).toDateString();
          const dateClosed = new Date(loan.dateClosed).toLocaleDateString();

          loan.dateIssued = dateIssued;
          loan.dateRequested = dateRequested;
          loan.dateClosed = dateClosed;


        });
        this.updateRepayableLoans();
      });

    this.ledgerService.getAllLoans()
      .subscribe(allLoans => {
        this.allLoans = allLoans;

        this.allLoans.forEach((loan, index) => {
          this.userService.findById(loan.receiverId).subscribe(u => {
            loan.receipient = u.firstName;
          });

          const dateIssued = new Date(loan.dateIssued).toDateString();
          const dateRequested = new Date(loan.dateRequested).toDateString();
          const dateDue = new Date(loan.dateDue).toDateString();
          const dateClosed = new Date(loan.dateClosed).toLocaleDateString();

          loan.dateIssued = dateIssued;
          loan.dateRequested = dateRequested;
          loan.dateClosed = dateClosed;
          loan.dateDue = dateDue;
        });
      });
  }

  requestLoan() {
    this.ledgerService.requestLoan(this.loanRequestAmount)
      .subscribe(loan => {
        this.myLoans.push(loan);
        this.updateRepayableLoans();
      });
  }

  // admin
  evaluateLoan(loan, evaluation) {
    // todo:
    // loan.evaluatedBy = this.authService.currentUser.UserId;
    loan.evaluatedBy = this.authService.currentUser.UserId;
    if (evaluation === 'approved') {
      loan.approved = true;
    }
    this.ledgerService.evaluateLoan(loan)
    .subscribe(evaluatedLoan => {
      console.log(evaluatedLoan);
    });
  }

  repayLoan() {
    this.ledgerService.repayLoan(this.selectedLoanId, this.loanRepaymentAmount)
      .subscribe(updatedLoan => {
          this.myLoans.forEach((loanInList, i) => {
            if (loanInList.transactionId === this.selectedLoanId) {
              this.myLoans.splice(i, 1);
            }
          });
          this.myLoans.push(updatedLoan);
          this.updateRepayableLoans();
        // todo: figure out a way to remove loan from dropdown list
          // of repayable loans if it's fully repaid
      });
  }

  selectExistingLoanReceipient(receipientName) {
    this.selectedLoanee = receipientName;
    this.toggleDropdown('ddown-content-name-existing-loan');
  }

  selectLoan(loan) {
    this.selectedLoan = 'Ksh. ' + loan.amount;
    this.selectedLoanId = loan.transactionId;
    this.toggleDropdown('ddown-content-loan');
  }

  addExistingLoan() {

  }

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

  updateRepayableLoans() {
    this.myLoansDropdown = [];
    this.myLoans.forEach(loan => {
      // if (!loan.isApproved && !loan.isClosed) {
      if (loan.isApproved && !loan.isClosed) {
        this.myLoansDropdown.push(loan);
      }
    });
  }

  getLoanStatus(amountPaidSoFar, amountPayable, isApproved, justTheColor) {
    if (!isApproved || amountPayable === 0) {
      return justTheColor ? 'bg-danger' : 'unapproved';
    }
    if (amountPaidSoFar === 0) {
      return justTheColor ? 'bg-danger' : 'unpaid';
    }
    if (amountPaidSoFar > 0 && amountPaidSoFar < amountPayable) {
      return justTheColor ? 'bg-warning' : 'half-paid';
    }
    if (amountPaidSoFar >= amountPayable) {
      return justTheColor ? 'bg-success' : 'paid';
    }
  }

  getPercentagePaid(amountPaidSoFar, amountPayable) {
    amountPaidSoFar = 7.5;
    amountPayable = 10;
    return amountPayable <= 0 ? '0' : (amountPaidSoFar / amountPayable * 100);
  }
}
