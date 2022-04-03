import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.scss']
})

export class BillingAddressComponent implements OnInit, OnDestroy {

  newAreaDetail = {
    city: null,
    state: null,
    country: null,
  };

  constructor(
    public checkoutService: CheckoutService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.checkoutService.getCountryInfo();
    console.info("111111111111111111111111")
    setTimeout(() => {
      if (this.checkoutService['newAddress'] && this.checkoutService['newAddress'].hasOwnProperty('zip')) {
        if (this.checkoutService.editCount == 1) {
          console.info("this.checkoutService['newAddress']['zip']", this.checkoutService['newAddress']['zip']);
          this.checkPinCode(this.checkoutService['newAddress']['zip'], true);
        } else {
          this.newAreaDetail = {
            city: null,
            state: null,
            country: null,
          };
        }
      }
    }, 2000);
  }
  ngOnDestroy(): void {

    this.newAreaDetail = {
      city: null,
      state: null,
      country: null,
    };

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
        (!this.checkoutService.billingZipIsAlpha && this.checkoutService.validateIsAlpha(this.checkoutService.newAddress.zip)))) {
      this.toast.error("Invalid Postal Code")
      return;
    }

    if (this.checkoutService.editCount == 0) {
      this.checkoutService.newAddress.customerId = this.checkoutService.customerId;
      this.newAreaDetail = {
        city: null,
        state: null,
        country: null,
      };
      this.checkoutService.saveNewDelieverAddress(this.checkoutService.newAddress).subscribe((response) => {
        console.log(response);
        this.checkoutService.dialogDisplay = false;
        this.checkoutService.newAddress = {};
        this.checkoutService.getUserAddress();
      }, (error) => {
        console.log(error);
      })
    } else if (this.checkoutService.editCount == 1) {
      this.checkoutService.newAddress.customerId = this.checkoutService.customerId;
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

  checkPinCode(event, isOnInit) {

    this.newAreaDetail = {
      city: null,
      state: null,
      country: null,
    };

    const pinCode = isOnInit ? event : event.target.value;

    if (pinCode.length <= this.checkoutService.billingZipMaxLength &&
      pinCode.length >= this.checkoutService.billingZipMinLength) {
      this.checkoutService.calculateDeliveryCharge(pinCode).toPromise().then(res => {
        console.info("res", res);
        if (res && res['data']) {
          const data = res['data'];
          //   this.service['deliveryCharge'] = res['deliveryCharge']
          this.newAreaDetail = {
            city: data['city'],
            state: data['state'],
            country: data['country']['countryName'],
          };
        }
      }).catch(err => { });
    } else {
      // this.checkoutService['userBillingAddress']['zip'] = null;
      this.newAreaDetail = {
        city: null,
        state: null,
        country: null,
      };
    }
  }
}
