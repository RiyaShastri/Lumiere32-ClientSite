import { Component, OnInit } from '@angular/core';
import { ChangePasswordComponent } from 'src/app/shared/components/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { SavedPaymentDetailsComponent } from 'src/app/shared/components/saved-payment-details/saved-payment-details.component';
import { UserService } from 'src/app/core/services/user.service';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddAddressComponent } from 'src/app/shared/components/add-address/add-address.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { CheckoutService } from 'src/app/core/services/checkout.service';

declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  practises: string[];
  postal;
  custId;
  public toggleButton = true;
  profileDetails;
  personalDetailForm: FormGroup;
  isSubmitted = false;
  personalDetailFormDetails;
  profileBillingDetails;
  addressDetail;
  default = true;
  defaultAddressDetail;
  public loading = false;
  private _unsubscribe = new Subject<boolean>();
  codes = [];
  countries = [];
  selected_countryCode;
  selected_country;
  countryValue;
  selected_speciality;
  min_pincode_length: number;
  pincode_length: number;
  dataLoaded = true;
  specialities = [];
  pincode: { countryname: string; pincode: number; mobile: number }[];
  errorMessage: string;
  errorMessages: string;
  ButtonDisbaled = true;
  loadedCountryId: number;
  postalcode;
  arrayData;
  userBillingZipMaxLength: number
  userBillingZipMinLength: number
  userBillingZipIsAlpha = false
  regionName = '';

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private titleService: Title,
    private conuntryIso: CountryIsoService,
    public service: CheckoutService
  ) {
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    this.loadedCountryId = userData['countryId'];
    this.custId = userData['customerId'];
    this.regionName = userData['customerRegionName'];
  }

  ngOnInit(): void {
    this.service.getCountryInfo();
    this.getSpecialities();
    this.getProfileAddressDetails();
    this.authService.getCountry().subscribe(
      (response: HttpResponse<any>) => {
        if (response.body.data != null) {
          console.log(response.body.data);
          this.countries = response.body.data;
          this.countries.map((i) => {
            i.label = i.country;
            i.value = i.id;
          });
          response.body.data.forEach((element) => {
            this.codes.push({
              label: "+" + element.phoneCode,
              value: element.phoneCode,
            });
          });
        }
        this.codes = this.codes.filter((v, i) => this.codes.findIndex(item => item.value == v.value) === i);
      }, (error) => {
        this.loading = false;
      }
    );
    this.selected_country = [];
    this.selected_countryCode = '';
    this.selected_speciality = '';
    this.initForm();
    this.titleService.setTitle(this.conuntryIso.MessageTitile.profile);
  }
  getSpecialities() {
    this.authService.getSpeciality().subscribe(
      (response: HttpResponse<any>) => {
        if (response.body.data.result != null) {
          response.body.data.result.forEach((element) => {
            this.specialities.push({
              label: element.specialityName,
              value: element.specialityName,
            });
          });
        }
        return this.specialities;
      },
      (error) => { }
    );
  }

  enable() {
    this.ButtonDisbaled = false;
    this.toggleButton = false;
  }

  get profileControls() {
    return this.personalDetailForm.controls;
  }

  initForm() {
    this.personalDetailForm = new FormGroup({
      email: new FormControl('', [Validators.required,
      Validators.pattern('^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]),
      name: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      clinicName: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required,
      Validators.pattern('^[0-9\+\-]{5,15}$')]),
      speciality: new FormControl('', [Validators.required]),
      practiceType: new FormControl('', Validators.required),
      blockNo: new FormControl(),
      floorNo: new FormControl(),
      code: new FormControl('', Validators.required),
      unitNo: new FormControl(),
      streetName: new FormControl(),
      building: new FormControl('', Validators.required),
      country: new FormControl(),
      city: new FormControl(),
      state: new FormControl('', Validators.required),
      postal: new FormControl('', [Validators.required])
    });
    this.onProfileInfo();

    this.practises = ['Medical', 'Dental', 'Other'];
  }

  getCountryDetail(countryId) {
    return new Promise((resolve, reject) => {
      this.loadedCountryId = parseInt(countryId);
      this.userBillingZipMinLength = this.service.countryMinLenMap.get(this.loadedCountryId)
      this.userBillingZipMaxLength = this.service.countryMaxLenMap.get(this.loadedCountryId)
      this.userBillingZipIsAlpha = this.service.countryMapIsAlpha.get(this.loadedCountryId);
      this.applyValidationsOnPostalCode();
      this.personalDetailForm.controls.postal.updateValueAndValidity();
      resolve(200);
    });
  }

  onProfileInfo() {
    this.userService.getProfilePersonalInfo().subscribe(
      async (response: HttpResponse<any>) => {
        this.profileDetails = response.body.data;
        this.personalDetailForm.patchValue({
          email: this.profileDetails.Email,
          name: this.profileDetails.firstName,
          lname: this.profileDetails.lastName,
          clinicName: this.profileDetails.clinicName,
          // "code": parseInt(this.profileDetails.countryCode),
          mobile: this.profileDetails.mobileNumber,
          //"speciality" : this.profileDetails.speciality,
          practiceType: this.profileDetails.practiceType,
          blockNo: this.profileDetails.houseNo,
          floorNo: this.profileDetails.floorNo,
          unitNo: this.profileDetails.unitNo,
          streetName: this.profileDetails.streetName,
          building: this.profileDetails.buildingName,
          state: this.profileDetails.state,
          postal: this.profileDetails.pincode,
          // country: this.profileDetails['country']['country'],
          // city: this.profileDetails.city,
        });

        await this.getCountryDetail(this.profileDetails['country']['id']);

        this.selected_countryCode = this.profileDetails.countryCode;
        if (this.selected_countryCode == '')
          this.selected_countryCode = "60"
        this.selected_speciality = this.profileDetails.speciality;

        this.checkPinCode(this.profileDetails.pincode, true);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getProfileAddressDetails() {
    this.loading = true;
    this.userService.getProfileAddressDetails(this.custId).subscribe(
      (response: HttpResponse<any>) => {
        this.loading = false;
        this.addressDetail = response.body.data.result;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  setDefault(id) {
    document.getElementById('default').classList.add('blue');
    this.default = false;
    this.defaultAddressDetail = this.addressDetail.filter(
      (item) => item.id === id
    );
    this.userService
      .onUpdateAddDefault(this.defaultAddressDetail, id)
      .subscribe(
        (success) => {
          this.getProfileAddressDetails();
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.personalDetailForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
  }

  onSubmit() {
    this.loading = true
    this.isSubmitted = true;
    if (this.personalDetailForm.invalid) {
      if (!this.personalDetailForm.get('city').value) {
        this.toastr.error("Invalid Postal Code");
        this.loading = false;
        return
      }
      this.loading = false;
      this.findInvalidControls();
      return;
    }

    this.custId = this.conuntryIso.getLoggedInCustomerId()
    this.personalDetailFormDetails = {
      Email: this.personalDetailForm.get('email').value,
      firstName: this.personalDetailForm.get('name').value,
      lastName: this.personalDetailForm.get('lname').value,
      clinicName: this.personalDetailForm.get('clinicName').value,
      houseNo: this.personalDetailForm.get('blockNo').value,
      floorNo: this.personalDetailForm.get('floorNo').value,
      unitNo: this.personalDetailForm.get('unitNo').value,
      streetName: this.personalDetailForm.get('streetName').value,
      buildingName: this.personalDetailForm.get('building').value,
      practiceType: this.personalDetailForm.get('practiceType').value,
      pincode: this.personalDetailForm.get('postal').value,
      mobileNumber: this.personalDetailForm.get('mobile').value,
      customerId: parseInt(this.custId),
      countryId: this.conuntryIso.getCountryId(), //this.personalDetailForm.get('country').value,
      countryCode: this.personalDetailForm.get('code').value,
      speciality: this.personalDetailForm.get('speciality').value,
      city: this.personalDetailForm.get('city').value,
      state: this.personalDetailForm.get('state').value,
      country: this.personalDetailForm.get('country').value,
    };
    this.userService
      .postProfilePersonalInfo(this.personalDetailFormDetails)
      .subscribe(
        (success) => {
          let userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
          if (userDetail) {
            const title = userDetail['title']
            const otp = userDetail['otp']
            const mobileVerify = userDetail['mobileVerify']
            const emailVerify = userDetail['emailVerify']
            const signupNewsletter = userDetail['signupNewsletter']
            const countryRegionId = userDetail['countryRegionId']
            const shippingMobileNo = userDetail['shippingMobileNo']
            const shippingMobileVerify = userDetail['shippingMobileVerify']
            const adminStatus = userDetail['adminStatus']
            const isDelete = userDetail['isDelete']
            const created_at = userDetail['created_at']
            const updated_at = userDetail['updated_at']
            const stripeCustomerId = userDetail['stripeCustomerId']
            const disableAbandonCart = userDetail['disableAbandonCart']
            const rewardPlanId = userDetail['rewardPlanId']
            const isDisableReward = userDetail['isDisableReward']
            const customerRegionName = userDetail['customerRegionName']

            userDetail = this.personalDetailFormDetails
            userDetail['title'] = title
            userDetail['otp'] = otp
            userDetail['mobileVerify'] = mobileVerify
            userDetail['emailVerify'] = emailVerify
            userDetail['signupNewsletter'] = signupNewsletter
            userDetail['countryRegionId'] = countryRegionId
            userDetail['shippingMobileNo'] = shippingMobileNo
            userDetail['shippingMobileVerify'] = shippingMobileVerify
            userDetail['adminStatus'] = adminStatus
            userDetail['isDelete'] = isDelete
            userDetail['created_at'] = created_at
            userDetail['updated_at'] = updated_at
            userDetail['stripeCustomerId'] = stripeCustomerId
            userDetail['disableAbandonCart'] = disableAbandonCart
            userDetail['rewardPlanId'] = rewardPlanId
            userDetail['isDisableReward'] = isDisableReward
            userDetail['customerRegionName'] = customerRegionName
            localStorage.setItem('UserData', JSON.stringify(userDetail));
            this.loading = false;
            this.toastr.success('Profile Details Updated');
            this.toggleButton = true;
          }
        },
        (error) => {
          this.loading = false;
          this.toastr.error(error.message);
        }
      );
  }

  removeAddress(id: number) {
    this.loading = true;
    this.userService.onDeleteAddress(id).subscribe(
      (response) => {
        this.getProfileAddressDetails();

        let msg: any = response.body;
        msg = msg.data;
        this.toastr.success(msg);
      },
      (error) => {
        this.loading = false;
        this.toastr.error(error.message);
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '666px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openDialog2() {
    const dialogRef = this.dialog.open(SavedPaymentDetailsComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openDialog3() {
    const dialogRef = this.dialog.open(AddAddressComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      this.getProfileAddressDetails();
    });
  }


  openDialog4(id: number) {
    console.log('id ??', id);
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log('result ?', result);
        this.getProfileAddressDetails();
      },
      (error) => {
        console.log('errror in fetching address', error);
      }
    );
  }

  onChange(event) {
    console.log('event :' + event);
    console.log(event.value);
    console.log(this.pincode);
    for (var i = 0; i <= this.codes.length; i++) {
      if (event.value != this.codes[i].value) {
        if (i > this.codes[i].value) {
          this.errorMessage = 'Country code is not correct';
          this.ButtonDisbaled = true;
        }
      } else {
        this.errorMessage = '';
        this.ButtonDisbaled = false;
      }
    }
  }

  applyValidationsOnPostalCode() {
    if (this.userBillingZipIsAlpha == false)
      this.personalDetailForm.controls["postal"].setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(this.userBillingZipMaxLength),
        Validators.minLength(this.userBillingZipMinLength),
      ]);
    else
      this.personalDetailForm.controls["postal"].setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$"),
        Validators.maxLength(this.userBillingZipMaxLength),
        Validators.minLength(this.userBillingZipMinLength),
      ]);
  }
  async checkPinCode(event, isOnInit) {

    // this.areaDetail = {
    //   city: null,
    //   state: null,
    //   country: null,
    // };

    this.personalDetailForm.patchValue({
      state: '',
      country: '',
      city: ''
    });

    const pinCode = isOnInit ? event : event.target.value;
    console.info('pinCode', pinCode);
    console.info('userBillingZipMaxLength', this.userBillingZipMaxLength);
    console.info('userBillingZipMinLength', this.userBillingZipMinLength);
    this.service['userBillingAddress']['zip'] = pinCode;

    if ((pinCode.length <= this.userBillingZipMaxLength && pinCode.length >= this.userBillingZipMinLength) || isOnInit) {

      this.service.calculateDeliveryCharge(pinCode).toPromise().then(async res => {
        if (res && res['data'] && res['data']['country']['countryName']) {
          const data = res['data'];
          this.personalDetailForm.patchValue({
            city: data['city'],
            state: data['state'],
            country: data['country']['countryName']
          });
        }
      }).catch(err => { });
    }
  }

}
