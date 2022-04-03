import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import Swal from 'sweetalert2';
import { CountryIsoService } from '../../../core/services/country-iso.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})

export class DeliveryAddressComponent implements OnInit {

  display = false;
  panelExpanded = false;
  deliverData;
  newAreaDetail = {
    city: null,
    state: null,
    country: null,
  };
  allOrderData = [];

  constructor(
    public checkoutService: CheckoutService,
    public userService: UserService,
    private toast: ToastrService,
    private countryIso: CountryIsoService
  ) {
    this.checkoutService['orderStatusComments'] = null;
  }

  ngOnInit(): void {
    this.panelExpanded = true;
    this.allOrderData = JSON.parse(localStorage.getItem('order-data'));
  }

  editForm(item) {
    const newAddress = this.checkoutService['newAddress'];
    this.checkoutService['id'] = item['id'];
    newAddress['name'] = item['name'];
    newAddress['clinicName'] = item['clinicName'];
    newAddress['blockNo'] = item['blockNo'];
    newAddress['floorNo'] = item['floorNo'];
    newAddress['unitNo'] = item['unitNo'];
    newAddress['buildingName'] = item['buildingName'];
    newAddress['streetName'] = item['streetName'];
    newAddress['zip'] = item['zip'];
    newAddress['country'] = item['country'];
    newAddress['state'] = item['state'];
    this.checkoutService['editCount'] = 1;
    this.checkoutService['editButtonDisplay'] = 'Update Address';
    this.checkoutService['dialogDisplay'] = true;
    this.checkoutService['deliveryZipMinLength'] = this.checkoutService['countryMinLenMap'].get(Number(newAddress['country']))
    this.checkoutService['deliveryZipMaxLength'] = this.checkoutService['countryMaxLenMap'].get(Number(newAddress['country']))
    this.checkoutService['deliveryZipIsAlpha'] = this.checkoutService['countryMapIsAlpha'].get(Number(newAddress['country']));
    this.checkPinCode(item['zip'], true);
  }

  deliverOptionChosenByUser(value, i) {
    this.checkoutService['isDefaultDeliverySelected'] = value['isDefault'] as Boolean;
  }

  addressByUser(value) {
    const orderDetail = this.checkoutService['orderData']['orderDetails'];
    this.checkoutService['delieveryAddress'].some((elem) => {
      if (elem['id'] == value) {
        console.info(elem);
        orderDetail['customerId'] = elem['customerId'];
        orderDetail['customerName'] = elem['name'];
        orderDetail['shippingClinicName'] = elem['clinicName'];
        orderDetail['shippingBuildingName'] = elem['buildingName'];
        orderDetail['shippingBlockNo'] = elem['blockNo'];
        orderDetail['shippingFloorNo'] = elem['floorNo'];
        orderDetail['shippingUnitNo'] = elem['unitNo'];
        orderDetail['shippingStreetName'] = elem['streetName'];
        orderDetail['shippingCountry'] = elem['country'];
        orderDetail['shippingCountryId'] = elem['id'];
        orderDetail['shippingPostcode'] = parseInt(elem['zip']);
        orderDetail['state'] = elem['state'];
        orderDetail['orderDate'] = new Date();
        this.checkPinCodefromseelction(elem['zip']);
      }
    });
  }

  async checkPinCodefromseelction(pinCode) {
    this.checkoutService['delieveryPrice'] = 0;
    this.checkoutService.calculateDeliveryCharge(pinCode).toPromise().then(async res => {
      this.checkoutService['delieveryPrice'] = Number(res['data']['deliveryCharge'] || 0);
      await this.calculateTotalAmount();
    }).catch(err => { });
  }


  async checkPinCode(event, isOnInit) {

    this.newAreaDetail = {
      city: null,
      state: null,
      country: null,
    };

    const pinCode = isOnInit ? event : event.target.value;

    if (pinCode.length <= this.checkoutService.billingZipMaxLength && pinCode.length >= this.checkoutService.billingZipMinLength) {

      this.checkoutService.calculateDeliveryCharge(pinCode).toPromise().then(async res => {
        if (res && res['data'] && res['data']['country']['countryName']) {
          const data = res['data'];
          this.newAreaDetail = {
            city: data['city'],
            state: data['state'],
            country: data['country']['countryName']
          };
          // this.checkoutService['delieveryPrice'] = Number(data['deliveryCharge'] || 0);
          // await this.calculateTotalAmount();
        }
      }).catch(err => { });
    }
  }

  calculateTotalAmount() {
    return new Promise((resolve, reject) => {
      let arr = [];
      console.info("=====================Start===========================");
      if (!this.allOrderData || Object.keys(this.allOrderData).length == 0 ||
        !this.checkoutService['taxData'] || Object.keys(this.checkoutService['taxData']).length === 0) {
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
        let bytes = CryptoJS.AES.decrypt(discount, `${this.countryIso.getKey()}`);
        let originalText: any = bytes.toString(CryptoJS.enc.Utf8);

        this.checkoutService['promoDiscount'] = parseFloat(originalText);
        if (orderTotal >= parseFloat(this.checkoutService['promoDiscount'])) {
          this.checkoutService['orderTotal'] = Number(Number(orderTotal) - Number(this.checkoutService['promoDiscount'])).toFixed(2);
        } else {
          this.checkoutService['orderTotal'] = Number(orderTotal).toFixed(2);
        }
      }

      //order total with delivery charges
      // this.checkoutService['delieveryPrice'] = Number(this.checkoutService['orderTotal']) >= this.checkoutService['minimumOrderAmount'] &&
      //   this.checkoutService['isDefaultDeliverySelected'] ? 0 : Number(this.checkoutService['delieveryPrice']);

      // console.info("orderTotal", this.checkoutService['orderTotal']);
      // console.info("this.checkoutService['delieveryPrice']", this.checkoutService['delieveryPrice']);

      this.checkoutService['orderTotal'] = Number(Number(this.checkoutService['orderTotal']) + Number(this.checkoutService['delieveryPrice'] || 0));

      //tax amount
      let taxAmount: any = (Number(this.checkoutService['orderTotal']) * parseFloat(this.checkoutService['taxData']['taxRate'])) / 100;
      this.checkoutService['TAXAMOUNT'] = parseFloat(taxAmount).toFixed(2);

      //order total with tax amount
      this.checkoutService['orderTotal'] = Number(Number(this.checkoutService['orderTotal']) + Number(taxAmount)).toFixed(2);
      console.info("=====================End===========================");
      resolve(200);
    });

  }

  showDialog() {
    this.checkoutService['newAddress'] = {};
    this.checkoutService['dialogDisplay'] = true;
    this.checkoutService['editCount'] = 0;
    this.checkoutService['editButtonDisplay'] = 'Add New Address';
    this.newAreaDetail = {
      city: null,
      state: null,
      country: null,
    };
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your shipping address will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.checkoutService.deleteUserDelieverAddress(id).subscribe((response) => {
          if (response) {
            Swal.fire('Deleted!',
              'Address has been deleted successfully!', 'success');
            this.checkoutService.getUserAddress();
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Address is safe :)', 'error');
      }
    });
  }

  Save() {
    if (this.checkoutService['delieveryAddress']['length'] == 0) {
      Swal.fire('Please Add at least one shipping address');
      return;
    } else {
      this.panelExpanded = false;
      this.checkoutService['activeStep4'] = true;
      this.checkoutService.setActiveStep(true);
    }
  }

  closePopup() {
    this.checkoutService.dialogDisplay = false;
    this.newAreaDetail = {
      city: null,
      state: null,
      country: null,
    };

  }

  saveAddress() {
    if (!this.checkoutService.newAddress.name || typeof this.checkoutService.newAddress.name == undefined ||
      this.checkoutService.newAddress.name == "") {
      this.toast.error("Please Enter Name");
      return;
    } else if (!this.checkoutService.newAddress.clinicName || typeof this.checkoutService.newAddress.clinicName == undefined ||
      this.checkoutService.newAddress.clinicName == "") {
      this.toast.error("Please Enter Clinic Name")
      return;
    }
    else if (!this.checkoutService.newAddress.zip || typeof this.checkoutService.newAddress.zip == undefined ||
      this.checkoutService.newAddress.zip == "") {
      this.toast.error("Please Enter Zip")
      return;
    }
    else if ((this.checkoutService.newAddress.zip && this.checkoutService.newAddress.zip != "") &&
      (this.checkoutService.newAddress.zip.length > this.checkoutService.billingZipMaxLength ||
        this.checkoutService.newAddress.zip.length < this.checkoutService.billingZipMinLength ||
        (!this.checkoutService.billingZipIsAlpha && this.checkoutService.validateIsAlpha(this.checkoutService.newAddress.zip))) ||
      !this.newAreaDetail['country']) {
      this.toast.error("Invalid Postal Code")
      return;
    }

    if (this.checkoutService.editCount == 0) {

      this.checkoutService.newAddress.customerId = this.checkoutService.customerId;
      this.checkoutService.newAddress.state = this.newAreaDetail['state'];
      this.checkoutService.newAddress.country = this.newAreaDetail['country'];
      this.checkoutService.newAddress.city = this.newAreaDetail['city'];

      this.checkoutService.saveNewDelieverAddress(this.checkoutService.newAddress).subscribe((response) => {
        console.log(response);
        this.newAreaDetail = {
          city: null,
          state: null,
          country: null,
        };
        this.checkoutService.dialogDisplay = false;
        this.checkoutService.newAddress = {};
        this.checkoutService.getUserAddress();
      }, (error) => {
        console.log(error);
      })
    } else if (this.checkoutService.editCount == 1) {
      this.checkoutService.newAddress.customerId = this.checkoutService.customerId;
      this.checkoutService.newAddress.state = this.newAreaDetail['state'];
      this.checkoutService.newAddress.country = this.newAreaDetail['country'];
      this.checkoutService.newAddress.city = this.newAreaDetail['city'];

      this.checkoutService.updateExistingDelieveryAddress(this.checkoutService.id, this.checkoutService.newAddress).subscribe((response) => {
        this.newAreaDetail = {
          city: null,
          state: null,
          country: null,
        };
        this.checkoutService.dialogDisplay = false;
        this.checkoutService.newAddress = {}
        this.checkoutService.getUserAddress();
      }, (error) => {
        console.log(error);
      })
    }
  }

}
