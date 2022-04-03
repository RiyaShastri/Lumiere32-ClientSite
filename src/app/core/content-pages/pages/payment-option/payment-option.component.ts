
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { CartCountService } from 'src/app/core/services/cart-count.service';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { CountryIsoService } from 'src/app/core/services/country-iso.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss']
})
export class PaymentOptionComponent implements OnInit, OnDestroy {

  orderData;
  countryId;
  paymentOptions;
  pageType;
  orderId;
  paymentType = null;
  isWalletSelected = false;
  expireYears = [];
  customerId = null;
  payPalConfig: IPayPalConfig;
  userCurrentWalletBalance = 0;
  cardDetailForm: FormGroup;
  submitted = false;
  isCardVerify = false;
  userCardDetails = {};
  paypalDetails = {};
  walletPaymentDetail = {};
  paymentTypeWithAmount = {
    cod: 0
  };
  selectedProductId = [];
  finalRequestPayload = {
    cardDetails: {},
    walletPayment: {},
    paypalDetails: {},
    ipay88Details: {},
  };
  previewIpay88HTML = null;
  loadingObj = {};
  convertHTML;
  queryParam = {};
  selectedPaymentOption = '';
  itemAmount = null;
  saveUserCards = [];
  cvvNo;
  isCvvErr = false;
  selectedCard = null;
  countryWisePaymentMethods = [];
  dissabledBtn = {
    savedCard: false,
    wallet: false,
    card: false
  }
  fullPageLoader = true;

  constructor(
    private route: ActivatedRoute,
    private countryIso: CountryIsoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private cartCountService: CartCountService,
    public userService: UserService,
    public checkoutService: CheckoutService
  ) {
    this.countryId = this.countryIso.getCountryId();
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userData) {
      this.customerId = userData['customerId'];
    }
  }

  ngOnInit() {

    this.route.queryParams.subscribe(async (params) => {
      this.queryParam['customerId'] = params['customerid'];
      this.queryParam['status'] = params['status'];
      this.queryParam['refNo'] = params['refNo'];
      this.queryParam['payMethod'] = params['payMethod'];
      this.queryParam['type'] = params['type'];
      this.queryParam['typeId'] = params['typeId'];

      // Ipay88 Success Payment URL
      if (this.queryParam['refNo'] && this.queryParam['payMethod']
        && this.queryParam['typeId'] && this.queryParam['type']) {
        this.fullPageLoader = true;
        const tempOrderData = window.localStorage.getItem('tempOrder');

        if (tempOrderData) {
          const walletObjData = JSON.parse(tempOrderData);
          const reqPayload = {
            orderId: this.queryParam['typeId'],
            type: this.queryParam['type'],
            paymentType: walletObjData['methodOfPayment']['wallet'] ? 'Wallet,iPay88' : 'iPay88',
            cardDetails: {},
            paypalDetails: {}
          }
          // this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
          if (walletObjData && walletObjData['methodOfPayment']) {
            walletObjData['methodOfPayment'][this.queryParam['payMethod']] = walletObjData['methodOfPayment']['card'];
            walletObjData['methodOfPayment']['card'] = 0;
            reqPayload['walletPayment'] = walletObjData;
            reqPayload['ipay88Details'] = { refNo: this.queryParam['refNo'] };

            // this.checkService.promoDiscountid
            this.checkoutService.commonPayment(reqPayload, this.checkoutService['promoDiscountid']).toPromise().then(response => {
              this.fullPageLoader = false;
              if (response && response['success']) {
                this.cartCountService.updateCount('success');
                this.toast.success('Payment Successful');
                this.router.navigate([`/${this.countryIso.getCountryCode()}/thank-you`], { state: { message: response['data']['message'] } });
              } else {
                this.toast.error('Payment Failed');
                this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`],
                  { state: { message: response['message'] } })
              }
            }).catch(err => {
              this.fullPageLoader = false;
              this.toast.error('Payment Failed');
              this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`],
                { state: { message: err['error']['message'] } })
            });
          }
        }
      }

      // Run Ipay88 Payment URL is not hit == Run for normal payment steps
      if (params && params['type'] && params['typeId'] &&
        !this.queryParam['refNo'] && !this.queryParam['payMethod'] && this.checkoutService['orderTotal'] && this.checkoutService['orderTotal'] > 0
        && this.checkoutService['orderTotal'] !== undefined) {
        this.orderId = params['typeId'];
        this.pageType = params['type'];
        if (this.countryId) {
          await this.getDefaultData(this.pageType, this.orderId);
        }
        this.getAllYears();
        this.initializeForm();
        this.getPaymentDetail();
      } else {
        this.fullPageLoader = true;
        this.router.navigate([`/${this.countryIso.getCountryCode()}/cart`],
          { state: { message: 'Invalid Payment URL' } })
      }

    });
  }

  getDefaultData(pageType, orderId) {
    this.fullPageLoader = true;
    Promise.all([
      this.checkoutService.getAllPaymentMode(this.countryId, pageType).toPromise(),
      this.checkoutService.getOrderDetails(orderId).toPromise(),
      this.checkoutService.getWalletDetails(this.customerId).toPromise(),
      this.checkoutService.getPaymentDetails(this.customerId).toPromise(),
    ]).then(response => {
      this.fullPageLoader = false;
      if (response[0] && response[0]['data']) {
        this.paymentOptions = response[0]['data'];
        this.paymentOptions.forEach(element => {
          if (element['country']['id'] == this.countryId) {
            this.countryWisePaymentMethods.push(element['paymentMode']['typeOfPayment']);
            if (element['paymentMode']['typeOfPayment'] == 'Pay32 Wallet') {
              this.isWalletSelected = true;
            }
          }
        });
      }
      if (response[1] && response[1]['response']['fetch_cutomer_order_data']) {
        this.orderData = response[1]['response']['fetch_cutomer_order_data'];
        this.selectedProductId = [];
        this.orderData.forEach(element => {
          if (element['orderProducts']) {
            element['orderProducts'].forEach(product => {
              this.selectedProductId.push(product['productId']);
            });
          }
        });
      }
      if (response[2] && response[2]['data']) {
        this.userCurrentWalletBalance = Number(response[2]['data']['wallet']);
        if (this.userCurrentWalletBalance > 0 && this.countryWisePaymentMethods.includes('Pay32 Wallet')) {
          this.isWalletSelected = true;
          this.selectWallet(true);
        } else {
          this.isWalletSelected = false;
          this.selectWallet(false);
        }
      }
      if (response[3]['success'] && response[3]['data']) {
        this.saveUserCards = response[3]['data'].allCards;
      } else {
        this.saveUserCards = [];
      }
    }).catch(err => {
      this.fullPageLoader = false;
      this.paymentOptions = [];
      this.orderData = [];
      this.saveUserCards = [];
    });
  }

  getPaymentDetail() {
    const walletPayObj = this.finalRequestPayload['walletPayment'];
    const orderTotal = this.checkoutService['orderTotal'];
    if (this.checkoutService['taxData'] && this.checkoutService['taxData']['taxRate']) {
      walletPayObj['tax'] = Number(this.checkoutService['taxData']['taxRate'] || 0).toFixed(2);
    } else {
      walletPayObj['tax'] = 0;
    }

    if (this.checkoutService['taxData'] && this.checkoutService['taxData']['taxId']) {
      walletPayObj['taxCode'] = this.checkoutService['taxData']['taxId'];
    } else {
      walletPayObj['taxCode'] = 0;
    }

    walletPayObj['taxamount'] = this.checkoutService.TAXAMOUNT || 0;
    walletPayObj['delieveryType'] = this.checkoutService.delieveryType;
    walletPayObj['delieveryCharge'] = this.checkoutService.delieveryPrice || 0;
    walletPayObj['discount'] = this.checkoutService.promoDiscount || 0;
    walletPayObj['productTotal'] = Number(this.checkoutService['productTotalAmount']).toFixed(2) || 0;
    walletPayObj['totalAmountWithTax'] = orderTotal;
    // this.itemAmount = Number(this.checkoutService['orderTotal']) - Number(walletPayObj['delieveryCharge']);
  }

  // ===== Save card details for user start =====

  initializeForm() {
    this.cardDetailForm = this.formBuilder.group({
      cardholderName: new FormControl('', Validators.compose([Validators.required])),
      cardNumber: new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,16}$')])),
      expirationMonth: new FormControl('', Validators.compose([Validators.required])),
      expirationYear: new FormControl('', Validators.compose([Validators.required])),
      saveCardForUser: new FormControl(false),
      cvv: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}$')])),
    });
  }

  get f() {
    return this.cardDetailForm.controls;
  }

  getAllYears() {
    let dt = new Date();
    let currentYear: any = dt.getFullYear();
    console.log('get full year ...', currentYear);
    for (var i = currentYear; i < currentYear + 30; i++) {
      this.expireYears.push(i);
    }
  }

  verifyCard() {
    if (this.f['cardNumber']['value'].length === 16) {
      let data = {
        cardNumber: this.f['cardNumber']['value'],
      };
      this.checkoutService.verifyCard(data).toPromise().then((response) => {
        if (response && response['data']) {
          this.isCardVerify = response['data']['isValid'];
          if (this.isCardVerify) {
            this.toast.success('Card Number Verified Successfully');
          }
        }
      }, (error) => {
        this.isCardVerify = false;
        this.toast.error('Enter Valid Card Number');
      }
      );
    }
  }

  async saveCard(validForm) {
    this.submitted = true;

    if (!this.isCardVerify && this.f['cardNumber']['value'].length != 16) {
      this.toast.error('Enter Valid Card Number');
    }
    if (!validForm) {
      return;
    }
    this.dissabledBtn['card'] = true;
    this.userCardDetails = this.cardDetailForm.value;
    this.userCardDetails['customerId'] = this.customerId;
    this.userCardDetails['amount'] = this.paymentTypeWithAmount['card'];
    this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
    this.finalRequestPayload['cardDetails'] = this.userCardDetails;
    this.finalRequestPayload['walletPayment']['listOfProductIds'] = JSON.stringify(this.selectedProductId);

    await this.finalPaymentProcess(this.finalRequestPayload);
  }

  checkCvvNo() {
    this.isCvvErr = (this.cvvNo !== null && this.cvvNo.toString().trim() !== '' &&
      this.cvvNo.toString().trim().length === 3) && !isNaN(this.cvvNo) ? false : true;
    this.dissabledBtn['savedCard'] = false;
  }

  async onItemChange(item) {
    this.cvvNo = null;
    this.isCvvErr = false;
    this.selectedCard = item ? item['id'] : null;
    // this.checkoutService.selectPaymentCard = item ? item['id'] : null;
    await this.selectPaymentType('saveCard');
  }

  async paySavedCard(item: any) {
    if (this.cvvNo !== null && this.cvvNo.toString().trim() !== '' && this.cvvNo.length == 3 && !this.isCvvErr) {
      this.dissabledBtn['savedCard'] = true;
      const reqPayload = {
        amount: this.paymentTypeWithAmount['card'],
        cardId: item['creditCard']['id'],
        cardholderName: item['creditCard']['name'],
        customerId: item['customerId'],
        cvv: this.cvvNo,
        saveCardForUser: false
      };

      this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
      this.finalRequestPayload['cardDetails'] = reqPayload;
      this.finalRequestPayload['walletPayment']['listOfProductIds'] = JSON.stringify(this.selectedProductId);
      if (!this.isCvvErr) {
        await this.finalPaymentProcess(this.finalRequestPayload);
      }
    } else {
      this.isCvvErr = true;
    }
  }

  // ===== Save card details for user end =====


  async selectWallet(event) {
    this.isWalletSelected = event;
    let totalOrder = this.checkoutService['orderTotal'];

    if (this.isWalletSelected && this.userCurrentWalletBalance >= totalOrder) {
      this.paymentTypeWithAmount['wallet'] = totalOrder;
      this.paymentTypeWithAmount['card'] = 0;
      this.paymentTypeWithAmount['paypal'] = 0;
      this.selectedPaymentOption = 'Wallet';
      this.paymentType = null;
      this.selectedCard = null;

    } else if (this.isWalletSelected && this.userCurrentWalletBalance < totalOrder) {

      if (totalOrder > this.userCurrentWalletBalance) {
        totalOrder = Number(this.checkoutService['orderTotal']) - Number(this.userCurrentWalletBalance);
      }

      if (this.paymentType === 'Stripe' || this.paymentType === 'ipay88' || this.paymentType === 'saveCard') {
        this.selectedPaymentOption = 'Wallet,Stripe';
        this.paymentTypeWithAmount['wallet'] = this.userCurrentWalletBalance;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        if (this.paymentType === 'ipay88') {
          this.selectedPaymentOption = 'Wallet,iPay88';
          await this.loadIpay88Form();
        }
      } else if (this.paymentType === 'paypal') {
        this.selectedPaymentOption = 'Wallet,Paypal';
        this.paymentTypeWithAmount['wallet'] = this.userCurrentWalletBalance;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        await this.paypalInitConfig();
      }
    }

    if (!this.isWalletSelected) {

      if (this.paymentType === 'Stripe' || this.paymentType === 'ipay88' || this.paymentType === 'saveCard') {
        this.selectedPaymentOption = 'Stripe';
        this.paymentTypeWithAmount['wallet'] = 0;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        if (this.paymentType === 'ipay88') {
          this.selectedPaymentOption = 'iPay88';
          await this.loadIpay88Form();
        }
      } else if (this.paymentType === 'paypal') {
        this.selectedPaymentOption = 'Paypal';
        this.paymentTypeWithAmount['wallet'] = 0;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        await this.paypalInitConfig();
      }
    }

  }

  async selectPaymentType(payOption) {
    this.paymentType = payOption;
    let totalOrder = this.checkoutService['orderTotal'];

    if (this.isWalletSelected && this.userCurrentWalletBalance >= totalOrder) {
      this.paymentTypeWithAmount['wallet'] = this.userCurrentWalletBalance;
      this.paymentTypeWithAmount['card'] = 0;
      this.paymentTypeWithAmount['paypal'] = 0;
      this.selectedPaymentOption = 'wallet';
      this.paymentType = null;
      this.selectedCard = null;

    } else if (this.isWalletSelected && this.userCurrentWalletBalance < totalOrder) {
      if (totalOrder > this.userCurrentWalletBalance) {
        totalOrder = Number(this.checkoutService['orderTotal']) - Number(this.userCurrentWalletBalance);
      }

      if (payOption === 'Stripe' || payOption === 'ipay88' || payOption === 'saveCard') {
        this.selectedPaymentOption = 'Wallet,Stripe';
        this.paymentTypeWithAmount['wallet'] = this.userCurrentWalletBalance;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        if (payOption === 'ipay88') {
          this.selectedPaymentOption = 'Wallet,iPay88';
          await this.loadIpay88Form();
        }
      } else if (payOption === 'paypal') {
        this.selectedPaymentOption = 'Wallet,Paypal';
        this.paymentTypeWithAmount['wallet'] = this.userCurrentWalletBalance;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        await this.paypalInitConfig();
      }
    }

    if (!this.isWalletSelected) {
      if (payOption === 'Stripe' || payOption === 'ipay88' || payOption === 'saveCard') {
        this.selectedPaymentOption = 'Stripe';
        this.paymentTypeWithAmount['wallet'] = 0;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        if (payOption === 'ipay88') {
          this.selectedPaymentOption = 'iPay88';
          await this.loadIpay88Form();
        }
      } else if (payOption === 'paypal') {
        this.selectedPaymentOption = 'Paypal';
        this.paymentTypeWithAmount['wallet'] = 0;
        this.paymentTypeWithAmount['card'] = parseFloat(totalOrder).toFixed(2);
        this.paymentTypeWithAmount['paypal'] = 0;
        await this.paypalInitConfig();
      }
    }
  }

  // ===== Get paypal button and paypal payment process start =====

  paypalInitConfig = () =>
    new Promise((resolve, reject) => {
      this.payPalConfig = {
        currency: 'MYR',
        clientId: environment.token_id,

        createOrderOnClient: (data) =>
          <ICreateOrderRequest>{
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'MYR',
                  value: `${parseFloat(this.paymentTypeWithAmount['card'] || this.checkoutService['orderTotal']).toFixed(2)}`,
                  breakdown: {
                    item_total: {
                      currency_code: 'MYR',
                      value: `${parseFloat(this.paymentTypeWithAmount['card'] || this.checkoutService['orderTotal']).toFixed(2)}`,
                    },
                  },
                },
                items: [
                  {
                    name: 'Lumiere32my Order',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                      currency_code: 'MYR',
                      value: `${parseFloat(this.paymentTypeWithAmount['card'] || this.checkoutService['orderTotal']).toFixed(2)}`,
                    },
                  },
                ],
              },
            ],
          },
        advanced: {
          extraQueryParams: [{ name: 'disable-funding', value: 'credit,card' }],
          commit: 'true',
        },
        style: {
          label: 'paypal',
          layout: 'vertical',
        },
        onApprove: (data, actions) => {
          actions.order.get().then((details) => {
            console.log('onApprove - get order details', details);
          });
        },
        onClientAuthorization: (data) => {
          // this.selectedProductId = [];
          this.paymentTypeWithAmount['paypal'] = Number(this.paymentTypeWithAmount['card']).toFixed(2);
          this.paymentTypeWithAmount['card'] = 0;

          this.paypalDetails = {
            customerId: this.customerId,
            transactionId: data.id,
            amount: parseFloat(this.paymentTypeWithAmount['paypal']).toFixed(2),
            paypal: data.payer,
            paymentType: 'sale',
            paymentFrom: 'paypal',
          };

          this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
          this.finalRequestPayload['paypalDetails'] = this.paypalDetails;
          this.finalRequestPayload['walletPayment']['listOfProductIds'] = JSON.stringify(this.selectedProductId);
          this.finalRequestPayload['cardDetails'] = {};
          this.finalRequestPayload['ipay88Details'] = {};

          this.finalPaymentProcess(this.finalRequestPayload);
          resolve(data);
        },
        onCancel: (data, actions) => {
          this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`]);
        },
        onError: (err) => {
          this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`],
            { state: { message: err } });
          reject(err);
        },
        onClick: (data, actions) => {
          console.info('onClick', data, actions);
        },
      };
    });

  // ===== Get paypal button and paypal payment process end =====


  // ===== Get ipay88 button and ipay88 payment process start =====

  loadIpay88Form() {
    return new Promise((resolve, rejects) => {
      if (this.customerId && this.orderId) {
        this.loadingObj['isiPay88Btn'] = true;

        const req = {
          customerId: this.customerId,
          amount: parseFloat(this.paymentTypeWithAmount['card']).toFixed(2),
          description: this.orderId,
          type: 'order',
          typeId: this.orderId,
        };

        this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
        this.finalRequestPayload['walletPayment']['listOfProductIds'] = JSON.stringify(this.selectedProductId);

        window.localStorage.setItem('tempOrder', JSON.stringify(this.finalRequestPayload['walletPayment']));

        this.checkoutService.getIpay88Btn(req).toPromise().then((response: any) => {
          if (response) {
            this.convertHTML = this.sanitizer;
            this.previewIpay88HTML = response;
            this.loadingObj['isiPay88Btn'] = false;
          }
        }).catch(err => { this.loadingObj['isiPay88Btn'] = false; });
      }
      resolve(200);
    });
  }

  payWithIpay88() {
    (document.getElementById('ipay88Form') as HTMLFormElement).submit();
    this.fullPageLoader = true;
  }

  // ===== Get ipay88 button and ipay88 payment process End =====

  finalPaymentProcess(paymentObj) {
    this.fullPageLoader = true;
    return new Promise((resolve, reject) => {
      const reqPayload = {
        orderId: this.orderId,
        type: this.pageType,
        paymentType: this.selectedPaymentOption,
        ...paymentObj
      };

      this.checkoutService.commonPayment(reqPayload, this.checkoutService['promoDiscountid']).toPromise().then(response => {
        this.fullPageLoader = false;
        if (response && response['success']) {
          this.toast.success('Payment Successful');
          this.cartCountService.updateCount('success');
          this.router.navigate([`/${this.countryIso.getCountryCode()}/thank-you`], { state: { message: response['data']['message'] } })
          localStorage.removeItem('discount_applied');
          localStorage.removeItem('dis_id');
          localStorage.removeItem('order-data');
          localStorage.removeItem('tempOrder');
        } else {
          this.toast.error('Payment Failed');
          this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`],
            { state: { message: response['message'] } })
        }
      }).catch(err => {
        this.fullPageLoader = false;
        this.toast.error('Payment Failed');
        this.router.navigate([`/${this.countryIso.getCountryCode()}/error-occured`],
          { state: { message: err['error']['message'] } })
      });
      resolve(200);
    });
  }


  paymentWiaWallet() {
    if (this.isWalletSelected && this.userCurrentWalletBalance >= this.checkoutService['orderTotal']) {
      this.finalRequestPayload['walletPayment']['methodOfPayment'] = this.paymentTypeWithAmount;
      this.dissabledBtn['wallet'] = true;
      this.finalPaymentProcess(this.finalRequestPayload);
    }
  }

  goTopUpPage() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/pay32/top-up`]);
  }

  ngOnDestroy(): void {
    this.checkoutService.activeStep3 = false;
    this.checkoutService.activeStep4 = false;
    this.checkoutService.activeStep5 = false;
    this.checkoutService['orderTotal'] = null;
  }

}
