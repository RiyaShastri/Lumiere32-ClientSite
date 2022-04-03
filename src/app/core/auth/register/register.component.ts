import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../../_helpers/must-watch.validator';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { EncrDecrServiceService } from '../../services/encr-decr-service.service';
import { CountryIsoService } from '../../services/country-iso.service';
import { BehaviorSubject, interval, Observable } from 'rxjs';

import { BrowserModule, Title } from '@angular/platform-browser';
import { CheckoutService } from '../../services/checkout.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  titles: string[];
  practises: string[];
  // titleListFromAPI: string[];
  clearTimer: boolean = false;
  seconds$ = new BehaviorSubject(0);
  timeOut = 30;
  count = 0;
  isSubmittedEmailForm: boolean = false;
  isSubmittedRegisterForm: boolean = false;
  public loading = false;
  registerForm: FormGroup;
  emailForm: FormGroup;
  registerFormDetails: {};
  codes: any = [];
  specialities: any = [];
  hide = true;
  hide1 = true;
  emailFormDetails: {};
  otp: string;
  registerFormFlag: boolean = false;
  otpFlag: boolean = false;
  emailFormFlag: boolean = true;
  registerSecreen1Data: any;
  isDisabled: boolean = false;
  mySubscription: any;
  pincode: { countryname: string; pincode: number; mobile: number }[];
  errorMessage: string;
  ButtonDisbaled: boolean = true;
  encrypted: string;
  initialButton: boolean = false;
  redirectUrl = '';

  constructor(
    private utilityService: UtilityService,
    private titleservice: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private EncrDecr: EncrDecrServiceService,
    private countryIso: CountryIsoService,
    public service: CheckoutService

  ) {
    this.redirectUrl = `${this.countryIso.getCountryCode()}`;
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    // this.mySubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Trick the Router into believing it's last link wasn't previously loaded
    //     this.router.navigated = false;
    //   }
    // });
  }
  login() {
    this.initialButton = true;
    this.router.navigate([`/${this.countryIso.getCountryCode()}/login`]);
  }

  signup() {
    this.initialButton = false;
    this.router.navigate([`/${this.countryIso.getCountryCode()}/register`]);
  }

  ngOnInit(): void {
    this.titleservice.setTitle(this.countryIso.MessageTitile.signup);
    this.getCountries();
    const jsonObject: object = {
      City: [
        {
          id: 1,
          name: 'Basel',
          founded: -200,
          beautiful: true,
          data: 123,
          keywords: ['Rhine', 'River'],
        },
        {
          id: 1,
          name: 'Zurich',
          founded: 0,
          beautiful: false,
          data: 'no',
          keywords: ['Limmat', 'Lake'],
        },
      ],
    };
    this.pincode = [
      {
        countryname: 'usa',
        pincode: 5,
        mobile: +41,
      },
      {
        countryname: 'malaysia',
        pincode: 5,
        mobile: +41,
      },
    ];

    this.getSpecialities();
    this.registerForm = this.formBuilder.group(
      {
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        clinicName: ['', Validators.required],
        code: [''],
        title: ['', Validators.required],
        contactNo: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{5,15}$'),
        ]),
        practiceType: ['', Validators.required],
        termCondition: new FormControl('', [
          (control) => {
            return !control.value ? { required: true } : null;
          },
        ]),
        signupNewsletter: new FormControl('', [
          (control) => {
            return !control.value ? null : control.value;
          },
        ]),
        speciality: ['', Validators.required],
        newsLetter: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*?[a-z])(?=.*[0-9]).{8,}$'),
          ],
        ],
        rePassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'rePassword'),
      }
    );
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          // '^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,3}$' //===========original 
          '^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'
        ),
      ]),
    });

    if (localStorage.getItem('token')) {
      this.router.navigate([`${this.redirectUrl}`]);
      return
    }

    this.titles = ['Dr.', 'Ms.', 'Mr', 'Prof.'];
    this.practises = ['Medical', 'Dental', 'Other'];
  }
  startTimer() {
    this.count = 0;
    this.seconds$.next(30);
    const interval = setInterval(() => {
      this.seconds$.next(30 - this.count);
      if (this.count === 30) {
        clearInterval(interval);
        this.clearTimer = true;
        document.getElementById('resendOtp').classList.remove('disabled');
      }
      this.count++;
    }, 1000);
  }
  getCountries() {
    this.authService.getCountry().subscribe(
      (response: HttpResponse<any>) => {
        if (response.body.data != null) {
          response.body.data.forEach((element) => {
            this.codes.push({
              label: element.phoneCode,
              value: element.phoneCode,
            });
          });
          console.log(this.codes);
        }

        return this.codes;
      },
      (error) => {
        if (error.status == 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    );
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
      (error) => {
        if (error.status == 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }
  get emailControls() {
    return this.emailForm.controls;
  }

  get signUpControls() {
    return this.registerForm.controls;
  }

  onSubmitEmailForm() {
    this.loading = true;
    this.isSubmittedEmailForm = true;
    if (this.emailForm.invalid) {
      this.loading = false;
      this.registerFormFlag = false;
      return;
    }
    this.authService
      .onRegisterScreen1(this.emailForm.get('email').value.toLowerCase())
      .subscribe(
        (data) => {
          this.registerSecreen1Data = data.data;
          this.loading = false;
          this.toastr.success('Successful');
          this.emailFormFlag = false;
          this.registerFormFlag = true;
          this.isSubmittedEmailForm = false;
          this.emailForm.reset();
        },
        (error) => {
          this.registerFormFlag = false;
          this.loading = false;
          this.toastr.error("Email already exists.");
          if (error.status == 401) {
            this.router.navigate(['/auth/login']);
          }
        }
      );
  }
  onSubmitRegisterForm() {
    console.log('yeah');
    this.loading = true;
    this.isSubmittedRegisterForm = true;
    if (this.registerForm.invalid) {
      console.log('invalid form ?');
      this.loading = false;
      console.log('ddddddddd', this.registerForm);
    } else {
      this.registerFormDetails = {
        Email: this.registerSecreen1Data,
        password: this.registerForm.get('password').value,
        firstName: this.registerForm.get('fname').value,
        lastName: this.registerForm.get('lname').value,
        title: this.registerForm.get('title').value,
        clinicName: this.registerForm.get('clinicName').value,
        countryCode: this.registerForm.get('code').value,
        mobileNumber: this.registerForm.get('contactNo').value,
        practiceType: this.registerForm.get('practiceType').value,
        speciality: this.registerForm.get('speciality').value,
        countryRegionId: this.countryIso.getCountryId(),
        countryId: this.countryIso.getCountryId(),
        signupNewsletter:
          this.registerForm.get('signupNewsletter').value == true ? 1 : 0,
      };
      console.log('ddddddddd', this.registerFormDetails);
      this.authService.onRegisterScreen2(this.registerFormDetails).subscribe(
        (data) => {
          this.registerSecreen1Data = data;
          this.loading = false;
          this.toastr.success('Registration Successful');
          this.isSubmittedRegisterForm = false;
          this.registerForm.reset();
          this.emailFormFlag = false;
          this.registerFormFlag = false;
          this.otpFlag = true;
          this.startTimer();
          this.service.userMobileNumber = ''
        },
        (error) => {
          this.otpFlag = false;
          this.loading = false;
          this.toastr.error(error.error.message);
          if (error.status == 401) {
            this.router.navigate(['/auth/login']);
          }
        }
      );
    }
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  onSubmitOTP() {
    console.log('checking register form ???????');
    this.loading = true;
    this.authService.onVerifyOtpSignUp(this.otp).subscribe(
      (response: HttpResponse<any>) => {
        if (response) {
          this.loading = false;
          this.authService.loginFlag = true;
          this.authService.loggedInCustomerName = response['body']['data']['firstName'];
          this.toastr.success('Login Successful');
          //   encypted token logic
          // console.log(response.headers.get('authtoken'))
          // var en= CryptoJS.AES.encrypt(response.headers.get('authtoken'),'secret key palak!@123').toString();
          // console.log(en)

          this.encrypted = this.EncrDecr.set(
            '123456$#@$^@1ERF',
            response.headers.get('authtoken')
          );
          localStorage.setItem('token', response.headers.get('authtoken'));
          localStorage.setItem('UserData', JSON.stringify(response['body']['data']));
          this.router.navigate(['']);
        }
      },
      (error) => {
        this.loading = false;
        if (this.otp == undefined || this.otp == '') {
          this.toastr.error("OTP is required!")
        }
        else {
          this.toastr.error("Invalid OTP. Please try again!");
        }
        if (error.status == 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }
  handleSuccess(data) { }
  onChangeEmail() {
    window.location.reload();
    // this.router.navigate(['/auth/register'])
  }
  // onResendOtp() {
  //   this.loading = true;
  //   document.getElementById('resendOtp').classList.add('disable')
  //   setTimeout(() => {
  //     document.getElementById('resendOtp').classList.remove('disable')
  //   }, 30000);
  //   this.authService.onResendOtpSignUp().subscribe(
  //     data => {
  //       this.loading = false;
  //       this.toastr.success("OTP resent")
  //     },
  //     error => {
  //       this.loading = false;
  //       this.toastr.error(error.error.message);
  //       if (error.status == 401) {
  //         this.router.navigate(['/auth/login'])
  //       }
  //       ;
  //     })
  // }
  onResendOtp() {
    if (!this.clearTimer) return;
    this.clearTimer = false;
    this.startTimer();
    let element = document.getElementById('resendOtp');
    element.classList.add('disabled');
    this.authService.onResendOtpSignUp().subscribe(
      (data) => {
        this.toastr.success(data.data);
      },
      (error) => {
        this.toastr.error("Invalid OTP. Please try again!");
        if (error.status == 401) {
          this.router.navigate([`/${this.countryIso.getCountryCode()}/login`]);
        }
      }
    );
  }
  ngOnDestroy() {
    this.titleservice.setTitle('Lumiere32');
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  onChange(event) {
    console.log('event :' + event);
    console.log(event.value);
    console.log(this.pincode);
    for (var i = 0; i <= this.pincode.length; i++) {
      if (event.value != this.pincode[i].mobile) {
        console.log(event.value);
        console.log(this.pincode[i].mobile);
        this.errorMessage = 'Country code is not correct';
        this.ButtonDisbaled = true;
        console.log(this.errorMessage);
      } else {
        this.errorMessage = '';
        this.ButtonDisbaled = false;
      }
      // else{
      //   this.registerForm.controls.code.patchValue("+91");
      //   this.registerForm.controls.mobileNumber.patchValue("7772804044");
      //   this.errorMessage='';
      //   this.ButtonDisbaled = false;
      // }
    }
  }
}
