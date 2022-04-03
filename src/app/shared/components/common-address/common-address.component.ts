import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { UserService } from 'src/app/core/services/user.service';
import { CountryIsoService } from '../../../core/services/country-iso.service';

@Component({
  selector: 'app-common-address',
  templateUrl: './common-address.component.html',
  styleUrls: ['./common-address.component.scss']
})
export class CommonAddressComponent implements OnInit {

  panelExpanded = true;
  showNullError = false;
  areaDetail = {
    city: null,
    state: null,
    country: null,
  };
  pinCode;
  allOrderData = [];

  constructor(
    public checkoutService: CheckoutService,
    public userService: UserService,
    private toast: ToastrService,
    private countryIso: CountryIsoService) {
    this.panelExpanded = true;
  }

  async ngOnInit() {
    this.checkoutService['activeStep2'] = true;

    await this.getBillingAddressOfUser();
  }

  async saveAddress() {
    const billingAddressData = this.checkoutService['userBillingAddress'];
    if ((billingAddressData['zip'] && billingAddressData['zip'] != "") &&
      (billingAddressData['zip']['length'] > this.checkoutService['billingZipMaxLength'] ||
        billingAddressData['zip']['length'] < this.checkoutService['billingZipMinLength'] ||
        (!this.checkoutService['billingZipIsAlpha'] && this.checkoutService.validateIsAlpha(billingAddressData['zip'])))) {
      return
    }
    if (!this.areaDetail['country']) {
      this.toast.error("Invalid Postal Code")
      return
    }
    let errorInterval: any;
    errorInterval = setInterval(() => {
      if (billingAddressData['name'] == "" || billingAddressData['clinicName'] == ""
        || billingAddressData['state'] == "" || billingAddressData['state'] == null
        || billingAddressData['state'] == 'null' || billingAddressData['zip'] == 'null'
        || billingAddressData['zip'] == "" || billingAddressData['zip'] == null) {
        this.showNullError = true;
        return
      } else {
        this.showNullError = false;
        clearInterval(errorInterval);
      }
    }, 500)

    // setTimeout(() => {
    if (!this.showNullError) {
      await this.saveBillingAddress()
      this.panelExpanded = false;
      this.checkoutService['activeStep3'] = true;
    }
    // }, 1000)
  }

  saveBillingAddress() {
    return new Promise((resolve, reject) => {
      let data = { ...this.checkoutService['userBillingAddress'] };

      data.pincode = data.zip;
      data.houseNo = data.blockNo;
      delete data.blockNo;
      delete data.zip;
      delete data.name;
      delete data.countryName;

      data['state'] = this.areaDetail['state'];
      data['city'] = this.areaDetail['city'];

      data.customerId = this.countryIso.getLoggedInCustomerId();

      this.checkoutService.updateBillingAddress(data).subscribe((response) => {
        if (response) {
          resolve(200);
          // this.toaster.success("Address saved successfully!");
        }
      }, (error) => {
        resolve(200);
        console.log(error)
      })
    });
  }

  async checkPinCode(event, isOnInit) {

    this.areaDetail = {
      city: null,
      state: null,
      country: null,
    };

    const pinCode = isOnInit ? event : event.target.value;
    this.checkoutService['userBillingAddress']['zip'] = pinCode;

    if (pinCode.length <= this.checkoutService.billingZipMaxLength && pinCode.length >= this.checkoutService.billingZipMinLength) {

      this.checkoutService.calculateDeliveryCharge(pinCode).toPromise().then(async res => {
        if (res && res['data'] && res['data']['country']['countryName']) {
          const data = res['data'];
          this.areaDetail = {
            city: data['city'],
            state: data['state'],
            country: data['country']['countryName']
          };
        }
      }).catch(err => { });
    }
  }

  getBillingAddressOfUser() {
    return new Promise((resolve, reject) => {
      this.userService.getBillingProfilePersonalInfo().subscribe(
        async (response: any) => {
          // await this.checkoutService.getCountryInfo();
          console.info("response", response);
          this.checkoutService['taxData'] = {};
          this.checkoutService['taxData']['taxCode'] = response['data']['taxCode'];
          this.checkoutService['taxData']['taxRate'] = response['data']['taxRate'];
          this.checkoutService['taxData']['taxId'] = response['data']['taxId'];
          this.addBillingData(response['data']);
          resolve(200);
        },
        (error) => {
          resolve(200);
          console.info('error in fetching billing address', error);
        });
    });
  }

  async addBillingData(data) {
    const billingAddress = this.checkoutService['userBillingAddress'];
    this.pinCode = data['pincode'];
    console.info("billingAddress", billingAddress);
    billingAddress['name'] = data['firstName'] + ' ' + data['lastName'];
    billingAddress['clinicName'] = data['clinicName'];
    billingAddress['blockNo'] = data['houseNo'];
    billingAddress['floorNo'] = data['floorNo'];
    billingAddress['unitNo'] = data['unitNo'];
    billingAddress['buildingName'] = data['buildingName'];
    billingAddress['streetName'] = data['streetName'];
    billingAddress['country'] = data['countryId'];
    billingAddress['zip'] = data['pincode'];
    billingAddress['Email'] = data['Email'];
    billingAddress['state'] = data['state'];
    billingAddress['mobileNumber'] = data['mobileNumber'];
    billingAddress['countryName'] = data['country']['country'];
    await this.checkoutService.getCountryInfo();
    this.checkPinCode(data['pincode'], true);
  }

  // calculateTotalAmount() {
  //   return new Promise((resolve, reject) => {
  //     let arr = [];
  //     console.info("=====================Start===========================");
  //     if (!this.allOrderData || Object.keys(this.allOrderData).length == 0 ||
  //       !this.checkoutService['taxData'] || Object.keys(this.checkoutService['taxData']).length === 0) {
  //       return;
  //     }

  //     this.allOrderData.forEach((elem) => {
  //       arr.push(elem.total);
  //     });

  //     let orderTotal = arr.reduce(function (a, b) { return a + b; });
  //     // console.info("orderTotal", orderTotal);
  //     this.checkoutService['productTotalAmount'] = Number(orderTotal).toFixed(2);

  //     //order total
  //     this.checkoutService['orderTotalWithoutTax'] = Number(orderTotal).toFixed(2);
  //     this.checkoutService['orderTotal'] = Number(orderTotal).toFixed(2);

  //     //order total with discount if applied
  //     if (this.checkoutService['promoDiscount'] ||
  //       localStorage.getItem('discount_applied')) {
  //       let discount: any = localStorage.getItem('discount_applied');
  //       let bytes = CryptoJS.AES.decrypt(discount, `${this.countryIso.getKey()}`);
  //       let originalText: any = bytes.toString(CryptoJS.enc.Utf8);

  //       this.checkoutService['promoDiscount'] = parseFloat(originalText);
  //       if (orderTotal >= parseFloat(this.checkoutService['promoDiscount'])) {
  //         this.checkoutService['orderTotal'] = Number(Number(orderTotal) - Number(this.checkoutService['promoDiscount'])).toFixed(2);
  //       } else {
  //         this.checkoutService['orderTotal'] = Number(orderTotal).toFixed(2);
  //       }
  //     }

  //     //order total with delivery charges
  //     // this.checkoutService['delieveryPrice'] = Number(this.checkoutService['orderTotal']) >= this.checkoutService['minimumOrderAmount'] &&
  //     //   this.checkoutService['isDefaultDeliverySelected'] ? 0 : Number(this.checkoutService['delieveryPrice']);

  //     console.info("orderTotal", this.checkoutService['orderTotal']);
  //     console.info("this.checkoutService['delieveryPrice']", this.checkoutService['delieveryPrice']);

  //     this.checkoutService['orderTotal'] = Number(Number(this.checkoutService['orderTotal']) + Number(this.checkoutService['delieveryPrice'] || 0));

  //     //tax amount
  //     let taxAmount: any = (Number(this.checkoutService['orderTotal']) * parseFloat(this.checkoutService['taxData']['taxRate'])) / 100;
  //     this.checkoutService['TAXAMOUNT'] = parseFloat(taxAmount).toFixed(2);

  //     //order total with tax amount
  //     this.checkoutService['orderTotal'] = Number(Number(this.checkoutService['orderTotal']) + Number(taxAmount)).toFixed(2);
  //     console.info("=====================End===========================");
  //     resolve(200);
  //   });

  // }

}
