import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContactUsService } from '../../../services/contact-us.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  enquiry: any = {}


  constructor(private service: ContactUsService,
    private toast: ToastrService,
    private router: Router,
    private _renderer: Renderer2,
    private titleService:Title,
    public countryISO: CountryIsoService

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.countryISO.MessageTitile.contactus)

    // let srcipt = this._renderer.createElement('script')
    // srcipt.defer = true;
    // srcipt.async = true;
    // srcipt.src = "https://www.google.com/recaptcha/api.js";
    // this._renderer.appendChild(document.body,srcipt)


  }
  tokenVerified: any;
  async resolved(captchaResponse: string) {
    this.tokenVerified = captchaResponse
    
    console.log(`Resolved captcha with response: ${captchaResponse}`);

    await this.service.sendTokenToBackend(captchaResponse).subscribe((response)=>{
      console.log("response verify captcha..",response)
      let mesg:any = response
      if (mesg.success == true){
        this.toast.show('Verified')
      } else {
        this.toast.show('recaptcha not verified')
      }
    },(error)=>{
      console.log("error",error)
    })
  }

 

  public onError(errorDetails: any[]) {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
  message: string;
  submit(playlistForm:any) {
    console.log('submit?')
    if (!this.tokenVerified) {
      this.toast.error("Please fill all the fields")
      return
    }
    if (this.enquiry.name == "" || this.enquiry.name == undefined || !this.enquiry.name ||
      this.enquiry.message == "" || this.enquiry.message == undefined || !this.enquiry.message ||
      this.enquiry.mobile == "" || this.enquiry.mobile == undefined || !this.enquiry.mobile ||
      this.enquiry.email == "" || this.enquiry.email == undefined || !this.enquiry.email
    ) {
      this.toast.error("Please fill all the  mandatory fields")
      return
    }
    //let findRegion = JSON.parse(localStorage.getItem("userInRegion"))
    //let showMessage = "Our executive will reach out to you to address your queries"
    //this.router.navigate([`/${this.countryISO.getCountryCode()}/thank-you`], { state: { message: showMessage } })
    // console.log(findRegion)


    this.enquiry.region = localStorage.getItem("countryCode")
    this.enquiry.countryId = localStorage.getItem("country_id")
    this.service.postEnquiry(this.enquiry)
      .subscribe((response: any) => {
        playlistForm.reset()
        // this.toast.success(response.message)
        this.router.navigate([`/${this.countryISO.getCountryCode()}/thank-you`],{ state: { message: response.message }})

      }, (error) => {
        console.log(error)
        this.toast.error("Not able to submit the enquiry,please try again later")
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
        }
      })

  }

  goToUrlSG(): void {
    window.location.href = "https://goo.gl/maps/qMS3Pr8zJsknTnTd9"
}
}


