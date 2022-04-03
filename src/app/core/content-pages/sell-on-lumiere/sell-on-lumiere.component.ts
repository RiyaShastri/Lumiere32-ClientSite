
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AuthService } from '../../services/auth.service';
import { BaseService } from '../../services/base.service';
import { CountryIsoService } from '../../services/country-iso.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sell-on-lumiere',
  templateUrl: './sell-on-lumiere.component.html',
  styleUrls: ['./sell-on-lumiere.component.scss']
})
export class SellOnLumiereComponent implements OnInit {
  formValid = false;
  isFormSubmitted : boolean = false
  sellerRegistered: boolean = false
  submitButtonClicked: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    public authService:AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private countryService: CountryIsoService,
    private baseService: BaseService,
    private toastr: ToastrService,
    ) { }
  signUpForm:FormGroup;
  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      sellerName : new FormControl("",[Validators.required]),
      sellerEmail : new FormControl("",[Validators.required, Validators.pattern('^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]),
      mobileNo : new FormControl("",[Validators.required, Validators.pattern('^[0-9 +,-]{5,18}$')]),
      houseNo : new FormControl(""),
      floorNo  : new FormControl(""),
      unitNo : new FormControl(""),
      buildingName : new FormControl(""),
      streetName : new FormControl(""),
      pincode : new FormControl(""), 
      city: new FormControl(""),
      state: new FormControl("") 
    })
  }
  tokenVerified: any;

  imagesList=[
    {
      imageUrl:'/assets/images/why-choose-1-1.png',
      text:'Most Preferred B2B Marketplace By Healthcare Professionals'
    },
    {
      imageUrl:'/assets/images/why-choose-2.png',
      text:'End-to-End Management of Logistics'
    },
    {
      imageUrl:'/assets/images/why-choose-3-1.png',
      text:'Expand into the New Markets'
    },
    {
      imageUrl:'/assets/images/why-choose-4.png',
      text:'Way to reach Thousand of Medical Professionals'
    }, 
    {
      imageUrl:'/assets/images/why-choose-5.png',
      text:'Accessibility and Exposure For Your Brand'
    },
    {
      imageUrl:'/assets/images/why-choose-6.png',
      text:'Marketers to run your Digital Campaigns'
    },
    {
      imageUrl:'/assets/images/why-choose-7.png',
      text:'Data & Market insights for Greater Sales'
    },
    {
      imageUrl:'/assets/images/why-choose-8.png',
      text:'Unlimited listing'
    },
  ]
  signIn(){
    window.location.href = this.baseService.vendorUrl
  }

  get signUpFormControl(){
    return this.signUpForm.controls;
  }

  async onSubmit(){
    this.submitButtonClicked = true
    if(!this.signUpForm.valid){
      this.isFormSubmitted = false
      return
    }
    this.formValid =true;
    this.recaptchaV3Service.execute('importantAction')
    .subscribe(async(token: string) => {
      console.log(`Token [${token}] generated`);
      await new Promise(resolve => setTimeout(resolve, 500));
      this.tokenVerified = token
      this.insertData()
      })
    }

  insertData(){
    const data = this.signUpForm.value
    data.countryId=Number(localStorage.getItem('country_id'))
    data.token = this.tokenVerified
      this.countryService.registerSeller(data).subscribe((response) => {
       this.toastr.info('Your Registration request sent successfully. Admin will contact to you soon.')
       this.sellerRegistered = true
       this.isFormSubmitted = true
      }, (error) => {
        this.toastr.error(error.error.message)
        this.isFormSubmitted = false
      })
  }
}
