import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Title } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  allOrderData;
  customerId;
  custName;
  orderId;
  paylaterBalance;
  panleExpanded = false;
  paypalDataForTransactionTable;
  listOfProductIds = [];
  listOfProducts = [];
  loadingObj = { isProductDataLoading: true };
  queryParam = {};
  displayfullloader = true;

  constructor(
    public checkoutService: CheckoutService,
    private title: Title,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public countryISO: CountryIsoService
  ) {
    this.checkoutService.getDelieveryData().then(
      async (data) => {
        if (data == 200) {
          await this.triggerAllFunctions();
          // await this.calculateTotalAmount();
        }
      }, (error) => {
        console.log('error in delivery');
      }
    );
  }

  async ngOnInit() {
    // await this.triggerAllFunctions();
    // await this.calculateTotalAmount();
    this.title.setTitle(this.countryISO.MessageTitile.checkout);
  }

  async triggerAllFunctions() {
    return new Promise(async (resolve, reject) => {
      this.route.queryParams.subscribe((params) => {
        this.customerId = +params['customerid'] || 0;
      });
      const userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData) {
        this.customerId = userData['customerId'];
        this.custName = userData['firstName'];
        this.checkoutService['customerId'] = this.customerId;
        await this.initializecomp();
        await this.getOrderDataForCustomer();
        this.displayfullloader = false;
        resolve(200);
      } else {
        this.toast.show('No User found');
        this.displayfullloader = false;
      }
    });
  }

  initializecomp() {
    Promise.all([
      this.checkoutService.getUserAddress(),
      this.getAllCountry(),
      this.getVerifiedData(),
      this.checkWalletBalance()
    ]);
  } ß

  // getBillingAddressOfUser() {
  //   this.userService.getBillingProfilePersonalInfo().subscribe(
  //     async (response: any) => {
  //       this.checkoutService['taxData'] = {};
  //       this.checkoutService['taxData']['taxCode'] = response['data']['taxCode'];
  //       this.checkoutService['taxData']['taxRate'] = response['data']['taxRate'];
  //       this.checkoutService['taxData']['taxId'] = response['data']['taxId'];
  //       this.calculateTotalAmount();
  //       this.addBillingData(response['data']);
  //     },
  //     (error) => {
  //       console.info('error in fetching billing address', error);
  //     }
  //   );
  // }

  getVerifiedData() {
    if (this.countryISO.getCustomerNumberVerifiedOrNot() == 0) {
      this.toast.show('Please verify your number');
      this.checkoutService['userVerifiedDisplay'] = true;
    } else if (this.countryISO.getCustomerNumberVerifiedOrNot() == 1) {
      this.checkoutService['userMobileNumber'] = this.countryISO.getCustomerNumber();
      this.checkoutService['userVerifiedDisplay'] = false;
    }
  }

  // addBillingData(data) {
  //   const billingAddress = this.checkoutService['userBillingAddress'];
  //   billingAddress['name'] = data['firstName'] + ' ' + data['lastName'];
  //   billingAddress['clinicName'] = data['clinicName'];
  //   billingAddress['blockNo'] = data['houseNo'];
  //   billingAddress['floorNo'] = data['floorNo'];
  //   billingAddress['unitNo'] = data['unitNo'];
  //   billingAddress['buildingName'] = data['buildingName'];
  //   billingAddress['streetName'] = data['streetName'];
  //   billingAddress['country'] = data['countryId'];
  //   billingAddress['zip'] = data['pincode'];
  //   billingAddress['Email'] = data['Email'];
  //   billingAddress['state'] = data['state'];
  //   billingAddress['mobileNumber'] = data['mobileNumber'];
  //   billingAddress['countryName'] = data['country']['country'];
  //   this.checkoutService.getCountryInfo()
  // }

  getAllCountry() {
    this.checkoutService.getCountry().subscribe(
      (response) => {
        if (response && response['data']) {
          this.checkoutService.countryModel = response['data'];
        }
      },
      (error) => {
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        }
      }
    );
  }

  checkWalletBalance() {
    this.loadingObj['isProductDataLoading'] = true;
    this.checkoutService.getWalletDetails(this.countryISO.getLoggedInCustomerId())
      .subscribe((response) => {

        this.checkoutService['walletBalance'] = Number(response['data']['wallet']);
        this.checkoutService['throughWallet'] = Number(response['data']['wallet']);
        this.checkoutService['payLaterBalance'] = Number(response['data']['payLaterL32']);

        if (this.checkoutService['payLaterBalance'] >= this.checkoutService['orderTotal']) {
          this.checkoutService['payLaterIconDisplay'] = true;
        } else {
          this.checkoutService['payLaterIconDisplay'] = false;
        }

        if (this.checkoutService['orderTotal'] && this.checkoutService['walletBalance']) {
          if (Number(this.checkoutService['walletBalance']).toFixed(2) <=
            Number(this.checkoutService['orderTotal']).toFixed(2)) {
            this.checkoutService['carddisplay'] = true;
            this.checkoutService['cardPayment'] = Number(this.checkoutService['orderTotal']) -
              Number((this.checkoutService['walletBalance'] < 0) ? 0 : this.checkoutService['walletBalance']);
            this.checkoutService['cardPayment'] = Number(this.checkoutService['cardPayment']).toFixed(2);
          } else {
            this.checkoutService['carddisplay'] = false;
          }
        }
        this.checkoutService['cardPayment'] = Number(this.checkoutService['orderTotal']) -
          Number((this.checkoutService['walletBalance'] < 0 ? 0 : this.checkoutService['walletBalance']));

        // setTimeout(() => {
        this.loadingObj['isProductDataLoading'] = false;
        // }, 3000);
      },
        (error) => {
          this.loadingObj['isProductDataLoading'] = false;
          if (error.status == 401) {
            this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
          }
        });
  }

  calculateTotalAmount() {
    return new Promise((resolve, reject) => {
      let arr = [];
      this.displayfullloader = true;
      if (!this.allOrderData || Object.keys(this.allOrderData).length == 0
        || !this.checkoutService['taxData'] || Object.keys(this.checkoutService['taxData']).length === 0
      ) {
        // this.displayfullloader = false;
        // this.router.navigate([`/${this.countryISO.getCountryCode()}/cart`]);
        return;
      }

      this.allOrderData.forEach((elem) => {
        arr.push(elem.total);
      });

      let orderTotal = arr.reduce(function (a, b) { return a + b; });
      // console.info("orderTotal", orderTotal);
      this.checkoutService['productTotalAmount'] = Number(orderTotal).toFixed(2);

      //order total
      this.checkoutService['orderTotalWithoutTax'] = Number(orderTotal).toFixed(2);
      this.checkoutService['orderTotal'] = Number(orderTotal).toFixed(2);

      //order total with discount if applied
      if (this.checkoutService['promoDiscount'] ||
        localStorage.getItem('discount_applied')) {
        let discount: any = localStorage.getItem('discount_applied');
        let bytes = CryptoJS.AES.decrypt(discount, `${this.countryISO.getKey()}`);
        let originalText: any = bytes.toString(CryptoJS.enc.Utf8);

        this.checkoutService['promoDiscount'] = parseFloat(originalText);
        if (orderTotal >= parseFloat(this.checkoutService['promoDiscount'])) {
          this.checkoutService['orderTotal'] = Number(Number(orderTotal) - Number(this.checkoutService['promoDiscount'])).toFixed(2);
        } else {
          this.checkoutService['orderTotal'] = Number(orderTotal).toFixed(2);
        }
      }

      //tax amount
      let taxAmount: any = (Number(this.checkoutService['orderTotal']) * parseFloat(this.checkoutService['taxData']['taxRate'])) / 100;
      this.checkoutService['TAXAMOUNT'] = parseFloat(taxAmount).toFixed(2);

      //order total with tax amount
      this.checkoutService['orderTotal'] = Number(Number(this.checkoutService['orderTotal']) + Number(taxAmount)).toFixed(2);
      this.displayfullloader = false;
      resolve(200);
    });

  }


  // User add to cart product list
  userCartProductList() {
    return new Promise((resolve, reject) => {
      let data: any = [];
      this.checkoutService['orderProductByCustomer'].forEach((elem) => {
        data.push({
          quantity: elem['quantity'],
          price: parseFloat(elem['product']['MRP']).toFixed(2),
          total: elem['total'],
          discount: 0,
          productId: elem['product']['id'],
          orderProductStatus: 'In Stock',
          productName: elem['product']['productName'],
          sellerId: elem['product']['sellerId'],
          sellerName: elem['product']['sellerProducts'][0]['sellerDetail']['sellerName'],
          sellerfee: elem['product']['sellerProducts'][0]['sellerFee'],
          pncode: elem['product']['PNCDE']
        });
      });
      this.checkoutService['orderData']['productData'] = data;
      this.listOfProducts = data;
      resolve(200);
    });
  }

  getOrderDataForCustomer() {
    this.listOfProductIds = [];
    return new Promise((resolve, reject) => {
      this.checkoutService.getOrderDetailsWRTCustomerID(this.customerId).subscribe(
        async (response) => {
          if (response && response['data'] && response['data'].length > 0) {
            this.checkoutService['orderProductByCustomer'] = response['data'];
            response['data'].forEach((elem) => {
              this.listOfProductIds.push(elem['product']['id']);
            });
            this.allOrderData = JSON.parse(localStorage.getItem('order-data'));
            await this.calculateTotalAmount();
            await this.userCartProductList();
            resolve(200);
          }
        },
        (error) => {
          resolve(200);
          if (error.status == 401) {
            this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
          }
        }
      );
    });
  }

}
