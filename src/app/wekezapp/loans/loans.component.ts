import { Component, OnInit } from '@angular/core';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';
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
  loanRequestAmount: any = '1,000';
  loanRepaymentAmount: any = '500';
  myLoans = [];
  myLoansDropdown = [];
  selectedLoanId;
  selectedLoan = '<select loan>';

  // myLoans table
  tableLoanPaymentAmount: any = '250';

  // all loans table
  allLoans = [];

  // adding existing loan
  selectedLoanee = '<select member>';
  membersNamesList = [];
  existingLoanReceipient;
  existingLoanAmount: any = '800';
  existingLoanRate = 5;
  existingLoanDueDate = new Date();
  existingLoanIssuedDate = new Date();


  constructor(
    private authService: AuthService,
    private ledgerService: LedgerService,
    private userService: UserService,
    private toastyService: ToastyService) {}
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

      this.userService.getAllUsers()
      .subscribe(users => {
        users.forEach(user => {
          this.membersNamesList.push({userId: user.userId, name: user.firstName});
        });
      });
  }

  requestLoan() {
    const loanRequestString = this.loanRequestAmount;
    this.loanRequestAmount = +this.loanRequestAmount.replace(/,/g, '');

    this.ledgerService.requestLoan(this.loanRequestAmount)
      .subscribe(loan => {
        this.loanRequestAmount = '0';
        this.addToast('info', 'You requested a loan of Ksh. ' + loanRequestString);
        this.myLoans.push(loan);
        this.updateRepayableLoans();
      },
      err => {
        this.addToast('error', err);
      });
  }

  addExistingLoan() {
    this.existingLoanAmount = +this.existingLoanAmount.replace(/,/g, '');

    this.ledgerService.addExistingLoan({
      receiverId: this.existingLoanReceipient.userId,
      amount: this.existingLoanAmount,
      interestRate: this.existingLoanRate,
      dateDue: this.existingLoanDueDate,
      dateIssued: this.existingLoanIssuedDate,
      dateRequested: this.existingLoanIssuedDate,
      approved: true,
      evaluatedBy: this.authService.currentUser.UserId,
      amountPayable: this.existingLoanAmount + (this.existingLoanAmount * this.existingLoanRate / 100)
    }).subscribe(loan => {
      this.existingLoanAmount = '0';
      this.addToast('info', 'Loan added');
      this.myLoans.push(loan);
      this.updateRepayableLoans();
    },
    err => {
      this.addToast('error', err);
    });

  }

  // admin
  evaluateLoan(loan, evaluation) {
    // todo:
    // loan.evaluatedBy = this.authService.currentUser.UserId;
    loan.evaluatedBy = this.authService.currentUser.UserId;

    let toastMsg = 'Loan application denied successfully';
    let toastType = 'info';
    if (evaluation === 'approved') {
      loan.approved = true;
      toastMsg = 'Loan application approved';
      toastType = 'Success';
    }

    this.ledgerService.evaluateLoan(loan)
    .subscribe(evaluatedLoan => {
      this.addToast(toastType, toastMsg);
    },
    err => {
      this.addToast('error', err);
    });
  }

  payLoan(transactionId?, fromTable = false) {
    let loanRepaymentString = '';
    if (fromTable) {
      loanRepaymentString =  this.tableLoanPaymentAmount;
      this.loanRepaymentAmount = +this.tableLoanPaymentAmount.replace(/,/g, '');
    } else {
      loanRepaymentString =  this.loanRepaymentAmount;
      this.loanRepaymentAmount = +this.loanRepaymentAmount.replace(/,/g, '');
    }
    if (transactionId) {
      this.selectedLoanId = transactionId;
    }
    this.ledgerService.repayLoan(this.selectedLoanId, this.loanRepaymentAmount)
      .subscribe(updatedLoan => {
        this.loanRepaymentAmount = '0';
        this.tableLoanPaymentAmount = '0';
        this.addToast('info', 'You paid Ksh. ' + loanRepaymentString + ' in payment of your loan');
          this.myLoans.forEach((loanInList, i) => {
            if (loanInList.transactionId === this.selectedLoanId) {
              this.myLoans.splice(i, 1);
            }
          });
          this.myLoans.push(updatedLoan);
          this.updateRepayableLoans();
        // todo: figure out a way to remove loan from dropdown list
        // of repayable loans if it's fully repaid
      },
      err => {
        this.addToast('error', err);
      });
  }

  selectExistingLoanReceipient(receipient) {
    this.existingLoanReceipient = receipient;
    this.selectedLoanee = receipient.name;
    this.toggleDropdown('ddown-existing-loan-receipient');
  }

  selectLoan(loan) {
    this.selectedLoan = 'Ksh. ' + loan.amount;
    this.selectedLoanId = loan.transactionId;
    this.toggleDropdown('ddown-content-pay-loan-widget');
  }

  toggleDropdown(classOrId) {
    // this.dropdownToggle = true;
    // console.log(this.myLoansDropdown);
    // console.log(dropDownMenu.item(0));
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
      if (loan.approved && !loan.isClosed) {
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
    // amountPaidSoFar = 7.5;
    // amountPayable = 10;
    return amountPayable <= 0 ? '0' : Math.round((amountPaidSoFar / amountPayable * 100));
  }

  amtChange() {
    this.loanRequestAmount = +this.loanRequestAmount.replace(/,/g, '');
    const n1 = this.loanRequestAmount.toLocaleString();
    this.loanRequestAmount = n1;

    this.loanRepaymentAmount = +this.loanRepaymentAmount.replace(/,/g, '');
    const n2 = this.loanRepaymentAmount.toLocaleString();
    this.loanRepaymentAmount = n2;

    this.tableLoanPaymentAmount = +this.tableLoanPaymentAmount.replace(/,/g, '');
    const n3 = this.tableLoanPaymentAmount.toLocaleString();
    this.tableLoanPaymentAmount = n3;

    this.existingLoanAmount = +this.existingLoanAmount.replace(/,/g, '');
    const n4 = this.existingLoanAmount.toLocaleString();
    this.existingLoanAmount = n4;
  }

  addToast(toastType: string, message: string, timeout = 3000) {
    let toastId;
    const toastOptions: ToastOptions = {
      title: '',
      onAdd: (toast: ToastData) => {
        toastId = toast.id;
      }
    };
    toastOptions.title = '';
    toastOptions.msg = message;
    toastOptions.theme = 'bootstrap';
    toastOptions.timeout = timeout;

    switch (toastType) {
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      default:
        this.toastyService.default(toastOptions);
    }
    return toastId;
  }
}
