import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../services/country-iso.service';
import { BehaviorSubject } from 'rxjs';
import { ForgotPasswordDialogComponent } from 'src/app/shared/components/forgot-password-dialog/forgot-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
  otp: string;
  emailId: string;
  isDisabled: boolean = false;
  seconds$ = new BehaviorSubject(0);
  timeOut = 30;
  count = 0;
  clearTimer: boolean = false;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private countryISO: CountryIsoService,
  ) { }

  ngOnInit(): void {
    document.getElementById('resendOtp').classList.add('disabled');
    this.startTimer();
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

  onOtpChange(otp) {
    this.otp = otp;
  }

  onChangeEmail() {
    if (this.authService.noVerifyUsername && this.authService.noVerifyPassword) {     //newly added code
      this.authService.noVerifyUsername = ''                                        //newly added code
      this.authService.noVerifyPassword = ''                                        //newly added code
    }                                                                             //newly added code
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      width: '666px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
    this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
  }
  onSubmitOTP() {
    this.authService.onVerifyOtpLogIn(this.otp).subscribe(
      (data) => {
        if (this.authService.forgotPassPage) {
          this.toastr.success('OTP Verified Successfully');
          this.router.navigate([
            `/${this.countryISO.getCountryCode()}/reset-password`,
          ]);
        } else {
          this.toastr.success('OTP Verified Successfully');
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]); //newly added code
        }
      },
      (error) => {
        if (this.otp == undefined || this.otp == '') {
          if (this.authService.forgotPassPage) {
            this.toastr.error("OTP is required!");
          } else {
            this.toastr.error("OTP is required!");
          }
        }
        else {
          if (this.authService.forgotPassPage) {
            this.toastr.error("Invalid OTP. Please try again!");
          } else {
            this.toastr.error("Invalid OTP. Please try again!");
          }
          if (error.status == 401) {
            this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
          }
        }
      }
    );
  }

  onResendOtp(event) {
    this.clearTimer = false;
    this.startTimer();
    let element = document.getElementById('resendOtp');
    element.classList.add('disabled');
    this.authService.onResendOtpLogIn().subscribe(
      (data) => {
        this.toastr.success(data.data);
      },
      (error) => {
        this.toastr.error("Invalid OTP. Please try again!");
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        }
      }
    );
  }
}
