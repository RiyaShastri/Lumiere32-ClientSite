import { Component, OnInit } from '@angular/core';
import { CheckoutService } from "src/app/core/services/checkout.service";
import Swal from 'sweetalert2'
import { CountryIsoService } from '../../../core/services/country-iso.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mobile-updates',
  templateUrl: './mobile-updates.component.html',
  styleUrls: ['./mobile-updates.component.scss']
})
export class MobileUpdatesComponent implements OnInit {

  numberStatus;
  verifyMobileForm: FormGroup;
  isVerifyBtnClick = false;
  isSubmitBtnClick = false;
  displayNextStep = false;

  constructor(
    public checkoutService: CheckoutService,
    public countryIso: CountryIsoService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.mobileFormGroup();
  }

  mobileFormGroup() {
    this.verifyMobileForm = this.formBuilder.group({
      countryCode: new FormControl(null, Validators.compose([
        Validators.required])),
      mobileNo: new FormControl(null, Validators.compose([
        Validators.required])),
      authCode: new FormControl(null, Validators.compose([
        Validators.required, Validators.pattern(/^[0-9]{6}$/)]))
    });
  }

  get f() { return this.verifyMobileForm.controls; }

  submitNumber(btnType) {
    const submittedValue = this.verifyMobileForm.value;

    let data = {};
    if (btnType === "Verify") {
      this.isVerifyBtnClick = true;
      this.isSubmitBtnClick = false;
      if (this.f.countryCode.status === "INVALID" || this.f.mobileNo.status === "INVALID") {
        return;
      }
      data = {
        to: submittedValue['countryCode'] + submittedValue['mobileNo'],
      }
    } else if (btnType === "Submit") {
      this.isSubmitBtnClick = true;
      this.isVerifyBtnClick = false;
      if (this.f.authCode.status === "INVALID") {
        return;
      }
      data = {
        to: submittedValue['countryCode'] + submittedValue['mobileNo'],
        code: submittedValue['authCode']
      };
    }

    this.checkoutService.varifyMobileNumber(data)
      .subscribe((response) => {
        if (response) {
          if (btnType === "Verify") {
            this.displayNextStep = true;
          } else if (btnType === "Submit") {
            this.numberStatus = response['data']['detail'][1]['status'];
            if (response['success'] && response['message'] == "Token verified.") {
              if (response['data']['detail'][1]['status'] == "pending") {
                Swal.fire("Please enter a valid code");
              } else {
                Promise.all([this.giveAccessToUser(), this.saveVerificationInDB()]);
              }
            }
          }
        }
      }, (error) => {
        if (btnType === "Submit") {
          Swal.fire("Please enter correct auth code");
        };
      });
  }

  giveAccessToUser() {
    this.checkoutService.userVerifiedDisplay = false;
    this.checkoutService.numberVerified = true;
    this.checkoutService.activeStep2 = true;
  }

  saveVerificationInDB() {
    let data = {
      "shippingMobileNo": this.f['countryCode'].value + this.f['mobileNo'].value,
      "shippingMobileVerify": 1
    };
    this.checkoutService.verifynumberOfCustomerSaveInDb(this.countryIso.getLoggedInCustomerId(), data).subscribe((response) => {
      this.countryIso.setShippingMobileNo(this.f['countryCode'].value + this.f['mobileNo'].value);
      this.toast.show(this.countryIso.setMobileVerfiedValueInStorage());
    }, (error) => {
      Swal.fire('Some issue occurred,Please reach out to your admin');
    })
  }

  handleEvent(value) {
    if (this.numberStatus == "approved") {
      this.checkoutService.userVerifiedDisplay = false;
    }
    if (this.numberStatus == "pending") {
      this.checkoutService.userVerifiedDisplay = true;
      Swal.fire("Please try again later");
    }
    if (value.action == 'done') {
      if (this.numberStatus == "approved") {
        this.checkoutService.userVerifiedDisplay = false;
      }
      if (this.numberStatus == "pending") {
        this.checkoutService.userVerifiedDisplay = true;
        Swal.fire("Please try again");
      }
      if (this.numberStatus != "pending" || this.numberStatus != "approved") {
        this.checkoutService.userVerifiedDisplay = true;
        Swal.fire("Session Time Out, Please try again");
      }
    }
  }

  changeMobNo() {
    this.displayNextStep = false;
    this.checkoutService.userVerifiedDisplay = true;
    this.f.authCode.reset();
  }

}
