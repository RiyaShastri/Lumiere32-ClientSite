import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { AuthService } from 'src/app/core/services/auth.service';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { CountryIsoService } from 'src/app/core/services/country-iso.service';
import { UserService } from 'src/app/core/services/user.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FasDirective } from 'angular-bootstrap-md';
@Component({
  selector: 'app-top-up-wallet',
  templateUrl: './top-up-wallet.component.html',
  styleUrls: ['./top-up-wallet.component.scss'],
})
export class TopUpWalletComponent implements OnInit {
  @ViewChild('cardForm') cardForm: NgForm;
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 1000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          dots: false,
          autoplay: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true,
          autoplay: true,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  promoData;
  topUpAmount;
  cashbackAmount;
  schemeId;
  topUpMessage;
  cardDisplay = false;
  expireYears = [];
  maskNumber;
  customerID;
  topUpText;
  payBtnValue;
  disabledBtn = false;

  constructor(
    private service: UserService,
    public checkout: CheckoutService,
    private countryISO: CountryIsoService,
    private title: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    public authService: AuthService,
    public counrtyIso: CountryIsoService
  ) {
    let loggedChecked = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;;
    this.topUpText = loggedChecked ? 'Top-Up Now' : 'Log-in to Top-up';
  }

  ngOnInit(): void {
    this.getAllPromos();
    this.getAllYears();
  }

  private getAllPromos() {
    this.service.getAllTopUpDetails().subscribe((response: any) => {
      this.promoData = response?.data?.results;
    });
  }

  buy(value) {
    if (this.authService.loginFlag) {
      this.payBtnValue = this.topUpAmount = value.amount;
      this.cashbackAmount = value.cashbackAmount;
      this.schemeId = value.id;
      this.topUpMessage = value.title;
      this.cardDisplay = true;
      console.log(value);
    } else {
      localStorage.setItem('top-up', value.id);
      this.router.navigate([`/${this.counrtyIso.getCountryCode()}/login`]);
    }
  }

  getAllYears() {
    let dt = new Date();
    let currentYear: any = dt.getFullYear();
    console.log('get full year ...', currentYear);
    for (var i = currentYear; i < currentYear + 30; i++) {
      this.expireYears.push(i);
    }
  }
  cardData: any;
  verifyCard(value) {
    if (value.length == 16) {
      let data = {
        cardNumber: value,
      };
      this.checkout.verifyCard(data).subscribe(
        (response) => {
          this.cardData = response;
          this.cardData = this.cardData.data.isValid;
          console.log(this.cardData);
          this.checkout.cardVerify = this.cardData;
          console.log(this.checkout.cardVerify, 'card verify ??');
          if (this.checkout.cardVerify == true) {
            this.toastr.success('Card Number Verified Successfully');
          } else {
            this.checkout.cardVerify = false;
          }
        },
        (error) => {
          console.log(error.status);
          this.checkout.cardVerify = false;
          this.toastr.error('Enter Valid Card Number');
        }
      );
    }
  }

  cardErrorDisplay: boolean = false;
  cardNumberErrorDisplay: boolean = false;
  checkChar(e, type) {
    switch (type) {
      case 'cvv':
        this.checkCVVValidation(e);
      case 'cardNumber':
        this.checkNumberValidation(e);
    }
  }
  checkNumberValidation(e) {
    console.log('e', e);
    let char = /^[0-9]+$/;
    if (!e.match(char)) {
      this.cardNumberErrorDisplay = true;
    } else {
      this.cardNumberErrorDisplay = false;
    }
  }
  checkCVVValidation(e) {
    console.log('e', e);
    let char = /^[0-9]+$/;
    if (!e.match(char)) {
      this.cardErrorDisplay = true;
    } else {
      this.cardErrorDisplay = false;
    }
  }

  submit() {
    this.checkValidation();

    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    this.customerID = userDetail['customerId'];
    this.disabledBtn = true;
    this.checkout.card.paymentFor = 'Topup';
    /* to do dynamicl top up id */
    this.checkout.card.topupSchemeId = this.schemeId;
    this.checkout.card.amount = this.topUpAmount;
    this.checkout.card.orderId = 0;
    this.checkout.card.customerId = this.customerID;
    let amount = this.checkout.card.amount;
    amount = parseFloat(amount).toFixed(2);
    amount = +amount;
    let data = {
      cardholderName: this.checkout.card.name,
      customerId: this.customerID,
      amount: amount,
      cardNumber: this.checkout.card.cardNumber,
      expirationMonth: this.checkout.card.expirationMonth,
      expirationYear: this.checkout.card.expirationYear,
      paymentFor: 'Topup',
      cardId: false,
      cvv: this.checkout.card.cvv,
      orderId: 0,
      saveCardForUser: false,
      topupSchemeId: this.schemeId,
    };

    this.checkout.paymentThroughCard(data).subscribe(
      (response) => {
        console.log(response);
        this.maskNumber = response;
        this.maskNumber = this.maskNumber.data.creditCard.last4;
        let successMesg: any = response;
        successMesg = successMesg.success;
        if (successMesg == true) {
          let dataForTopUp = {
            amountCredit: this.topUpAmount /* top up amount*/,
            amountDebit: '0',
            message: `Wallet Topup by Customer ending with card ${this.maskNumber}`,
            type: 'Wallet',
            txnSource: 'Customer',
            txnSourceId: this.schemeId /* top up scheme id */,
          };
          let dataForCashback = {
            amountCredit: this.cashbackAmount /* top up cash back amount*/,
            amountDebit: '0',
            message: `CashBack For ${this.topUpMessage}`,
            type: 'Wallet',
            txnSource: 'Cashback',
            txnSourceId: this.schemeId /* top up scheme id */,
          };
          Promise.all([
            this.addToWallet(dataForTopUp),
            this.addToWallet(dataForCashback),
          ]);
          let showMessage = 'Top-Up has been done successfully!';
          this.router.navigate(
            [`/${this.countryISO.getCountryCode()}/thank-you`],
            { state: { message: showMessage } }
          );
          this.disabledBtn = false;
        }
      },
      (error) => {
        console.log(error);
        this.disabledBtn = false;
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        } else {
          let showMessage = error.error.message || 'Please try again';
          this.router.navigate(
            [`/${this.countryISO.getCountryCode()}/error-occured`],
            { state: { message: showMessage } }
          );
        }
      }
    );
    this.cardForm.resetForm();
  }

  checkValidation() {
    if (!this.checkout.card.name) {
      this.toastr.error('Enter valid Name to proceed');
      return;
    }
    if (!this.checkout.card.cardNumber) {
      this.toastr.error('Enter valid card number to proceed');
      return;
    }
    if (!this.checkout.card.expirationMonth) {
      this.toastr.error('Enter valid expiry month to proceed');
      return;
    }

    if (!this.checkout.card.expirationYear) {
      this.toastr.error('Enter valid expiry year to proceed');
      return;
    }

    if (!this.checkout.card.cvv) {
      this.toastr.error('Enter valid cvv to proceed');
      return;
    }
    if (this.cardErrorDisplay == true) {
      this.toastr.error('Enter valid cvv to proceed');
      return;
    }
  }

  addToWallet(data) {
    this.checkout.walletAdjustment(this.customerID, data).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        }
      }
    );
  }

  closePaymentIframe() {
    this.cardDisplay = false;
    this.cardForm.resetForm();
  }


}
