import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/_helpers/must-watch.validator';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  ChangePasswordForm: FormGroup;
  submitted: boolean;
  public loading = false;
  ChangePasswordFormDetails: any;


  constructor(
    public formBuilder : FormBuilder,
    public userService:UserService,
    public toastr : ToastrService,
    private router:Router,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.ChangePasswordForm = this.formBuilder.group({
      currentPassword: new FormControl('', [
        Validators.required]),
        newPassword: new FormControl('', [Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*?[a-z])(?=.*[0-9]).{8,}$'),
          // Validators.pattern('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
          Validators.maxLength(20)]),
          newRePassword: new FormControl('', [
            Validators.required]),
  
    },
    {
      validator: MustMatch('newPassword', 'newRePassword')

    });
  }
  onSubmit(){
    
    this.submitted = true;
    this.loading = true;

    if (this.ChangePasswordForm.invalid) {
      this.loading = false;

      return;
    }
    this.ChangePasswordFormDetails = {
      "currentPassword" : this.ChangePasswordForm.get('currentPassword').value,
      "newPassword" : this.ChangePasswordForm.get('newPassword').value,


    }
    
    this.userService.onPasswordChange(this.ChangePasswordFormDetails).subscribe(
      data => {   
        
        this.loading = false;
        this.toastr.success("Password changed successfully")
        this.dialog.closeAll()
      },
      error => {
        this.loading = false;
        this.toastr.error(error.error.message);
        ;
      });
  }
  
  get f(){
    return this.ChangePasswordForm.controls;
  }
}
