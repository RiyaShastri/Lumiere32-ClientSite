import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CheckoutService } from '../../../services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
//checkout.cardselected
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent implements OnInit {

  ngCust: any = {}
  moneyForm: FormGroup;
  expireYears: any = []
  purchaseTopUp: any;
  customerID: any
  maskNumber: any;

  constructor(private service: UserService, public checkout: CheckoutService,
    private countryISO: CountryIsoService,
    private title: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router
  ) {
    //   this.checkout.cardselected = true
    Promise.all([this.getAllPromos(), this.getAllYears()])

    // this.checkout.cardselected = true
    //this.checkout.panleExpanded = true
  }
  getAllYears() {
    let dt = new Date()
    let currentYear: any = dt.getFullYear()
    console.log("get full year ...", currentYear)
    for (var i = currentYear; i < currentYear + 30; i++) {
      this.expireYears.push(i)
    }
    console.log('expire years push', this.expireYears)
  }
  cardData: any;
  verifyCard(value) {
    if (value.length == 16) {
      let data = {
        cardNumber: value
      }
      this.checkout.verifyCard(data)
        .subscribe((response) => {
          this.cardData = response
          this.cardData = this.cardData.data.isValid
          console.log(this.cardData)
          this.checkout.cardVerify = this.cardData
          console.log(this.checkout.cardVerify, "card verify ??")
          if (this.checkout.cardVerify == true) {
            this.toastr.success("Card Number Verified Successfully")
          } else {
            this.checkout.cardVerify = false
          }
        }, (error) => {
          console.log(error.status)
          this.checkout.cardVerify = false
          this.toastr.error("Enter Valid Card Number")

        })

    }
  }
  promoData: any;
  getAllPromos() {
    this.service.getAllTopUpDetails()
      .subscribe((response) => {
        this.promoData = response;
        this.promoData = this.promoData.data.results
        console.log(this.promoData)
      }, (error) => {
        console.log(error)
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
        }
      })
  }
  cardErrorDisplay: boolean = false
  cardNumberErrorDisplay: boolean = false
  checkChar(e, type) {
    switch (type) {
      case 'cvv':
        this.checkCVVValidation(e)
      case 'cardNumber':
        this.checkNumberValidation(e)
    }

  }
  checkNumberValidation(e) {
    console.log("e", e)
    let char = /^[0-9]+$/;
    if (!e.match(char)) {
      this.cardNumberErrorDisplay = true
    } else {
      this.cardNumberErrorDisplay = false
    }
  }
  checkCVVValidation(e) {
    console.log("e", e)
    let char = /^[0-9]+$/;
    if (!e.match(char)) {
      this.cardErrorDisplay = true
    } else {
      this.cardErrorDisplay = false
    }
  }
  ngOnInit(): void {
    this.title.setTitle(this.countryISO.MessageTitile.addmoney)
    this.checkout.card = {}

    this.moneyForm = this.formBuilder.group({
      userId: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]),
      password: ['', Validators.required],

    });
  }

  ngOnDestroy() {
    this.title.setTitle('Lumiere32')
  }
  checkValidation() {
    if (!this.checkout.card.name) {
      this.toastr.error('Enter valid Name to proceed')
      return
    }
    if (!this.checkout.card.cardNumber) {
      this.toastr.error('Enter valid card number to proceed')
      return
    }
    if (!this.checkout.card.expirationMonth) {
      this.toastr.error('Enter valid expiry month to proceed')
      return
    }

    if (!this.checkout.card.expirationYear) {
      this.toastr.error('Enter valid expiry year to proceed')
      return
    }

    if (!this.checkout.card.cvv) {
      this.toastr.error('Enter valid cvv to proceed')
      return
    }
    if (this.cardErrorDisplay == true) {
      this.toastr.error('Enter valid cvv to proceed')
      return
    }
  }
  topUpAmount: any;
  cashbackAmount: any;
  schemeId: any;
  topUpMessage: any;

  cardDisplay: boolean = false;
  buy(value) {
    this.topUpAmount = value.amount
    this.cashbackAmount = value.cashbackAmount
    this.schemeId = value.id
    this.topUpMessage = value.title
    this.cardDisplay = true
    console.log(value)
  }


  submit() {
    this.checkValidation()
    const userData = JSON.parse(localStorage.getItem('UserData'));
    this.customerID = userData['customerId'];
    console.log("card details", this.checkout.card);
    this.checkout.card.paymentFor = "Topup";
    /* to do dynamicl top up id */
    this.checkout.card.topupSchemeId = this.schemeId
    this.checkout.card.amount = this.topUpAmount
    this.checkout.card.orderId = 0
    this.checkout.card.customerId = this.customerID
    let amount = this.checkout.card.amount
    amount = parseFloat(amount).toFixed(2)
    amount = +(amount);
    console.log("amount ...", amount);
    console.log("amount ...", typeof amount);
    let data = {
      "cardholderName": this.checkout.card.name,
      "customerId": this.customerID,
      "amount": amount,
      "cardNumber": this.checkout.card.cardNumber,
      "expirationMonth": this.checkout.card.expirationMonth,
      "expirationYear": this.checkout.card.expirationYear,
      "paymentFor": "Topup",
      "cardId": false,
      "cvv": this.checkout.card.cvv,
      "orderId": 0,
      "saveCardForUser": false,
      "topupSchemeId": this.schemeId
    }
    console.log("card details", this.checkout.card);
    this.checkout.paymentThroughCard(data).subscribe((response) => {
      console.log(response)
      this.maskNumber = response
      this.maskNumber = this.maskNumber.data.creditCard.last4
      let successMesg: any = response;
      successMesg = successMesg.success
      if (successMesg == true) {
        let dataForTopUp = {
          "amountCredit": this.topUpAmount,/* top up amount*/
          "amountDebit": "0",
          "message": `Wallet Topup by Customer ending with card ${this.maskNumber}`,
          "type": "Wallet",
          "txnSource": "Customer",
          "txnSourceId": this.schemeId /* top up scheme id */
        }
        let dataForCashback = {
          "amountCredit": this.cashbackAmount,/* top up cash back amount*/
          "amountDebit": "0",
          "message": `CashBack For ${this.topUpMessage}`,
          "type": "Wallet",
          "txnSource": "Cashback",
          "txnSourceId": this.schemeId /* top up scheme id */
        }
        Promise.all([this.addToWallet(dataForTopUp), this.addToWallet(dataForCashback)])
        /* navigate to thank you page */
        // this.addToWallet(dataForTopUp)
        // this.addToWallet(dataForCashback)
        let showMessage = "Top-Up has been done successfully!"
        this.router.navigate([`/${this.countryISO.getCountryCode()}/thank-you`], { state: { message: showMessage } })
      }
    }, (error) => {
      console.log(error)
      if (error.status == 401) {
        this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
      } else {
        let showMessage = error.error.message || "Please try again"
        this.router.navigate([`/${this.countryISO.getCountryCode()}/error-occured`], { state: { message: showMessage } })
      }
    })
  }
  /* this will dedct from wallet */
  addToWallet(data) {
    this.checkout.walletAdjustment(this.customerID, data)
      .subscribe((response) => {
        console.log(response)
      }, (error) => {
        console.log(error)
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
        }
      })
  }

}
