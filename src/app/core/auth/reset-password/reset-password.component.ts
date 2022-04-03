import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from 'src/app/_helpers/must-watch.validator';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {CountryIsoService} from '../../services/country-iso.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  isSubmittedResetForm: boolean = false
  resetForm: FormGroup;
  public loading = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router:Router,
    private countryISO : CountryIsoService
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required,
        // Validators.pattern('^(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        Validators.pattern('^(?=.*?[a-z])(?=.*[0-9]).{8,}$')]],
      rePassword: ['', Validators.required],
    },
      {
        validator: MustMatch('password', 'rePassword')
      })

  }

  get resetControls() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.loading = true;
    this.isSubmittedResetForm = true;
    if (this.resetForm.invalid) {
      this.loading = false;
      return;
    }
    this.authService.onResetpassword(this.resetForm.value.password).subscribe(

      data => {
        this.loading = false;
        this.isSubmittedResetForm = false;
        this.toastr.success(data.data)
        this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
      },
      error => {
        this.loading = false;
        this.isSubmittedResetForm = false;
        this.toastr.error(error.error.message);
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
        }
      });
  }

}
