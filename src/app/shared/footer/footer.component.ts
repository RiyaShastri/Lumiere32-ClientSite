import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../app/core/services/country-iso.service';
import { BaseService } from '../../core/services/base.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NewsletterService } from '../../core/services/newsletter.service';
import Swal from 'sweetalert2'
@Component({

  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router,
    public countryISO: CountryIsoService,
    public authService: AuthService,
    private baseservice: BaseService,
    private newsService: NewsletterService
  ) {
    let currentDate = new Date()
    this.currentYear = currentDate.getFullYear()
  }
  currentYear: any;
  isEmailValid: boolean = false
  ngOnInit(): void {
    this.display = false
    document.getElementById('emailValidation').innerHTML = ''
  }
  logoNavigate() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}`]);
  }
  loginPage() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
  }
  registerPage() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/register`])
  }
  contactus() {
    console.log("checked")
    this.router.navigate([`/${this.countryISO.getCountryCode()}/contact-us`])
  }
  email: any
  display: boolean = false
  siugnUpForLetter() {
    this.validateEmail()
    console.log("email ", this.user.email)
  }
  user: any = {}
  validateEmail() {
    if (this.user.email == '' || this.user.email == undefined) {
      this.display = true;
      return;
    }
    if (this.isEmailValid) {
      console.log('valid email', this.user.email)
      this.newsService.subscribeNewsLetter(this.countryISO.getCountryId(), this.user.email)
        .subscribe((response) => {
          console.log('response', response)
          let mesg: any = response
          this.display = false
          this.user.email = ''
          Swal.fire(mesg.message)
        }, (error) => {
          console.log(error)
        })
    }
  }

  contact() {
    console.log('enter')
    this.router.navigate([`/${this.countryISO.getCountryCode()}/contact-us`])
  }
  termofuse() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/term-of-use`])
  }
  privacy() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/privacy-policy`])
  }
  about() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/about-us`])
  }
  sellOnLumiere() {
    window.open(`https://www.lumiere32.my/admin/auth/sellerlogin`)
  }
  helpCentre() {
    window.open(`https://sites.google.com/lumiere32.sg/help-centre/home`)
  }

  clearEmailValidation(event) {
    var regex = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (this.user.email != '') {
      this.isEmailValid = regex.test(this.user.email)
      if (!this.isEmailValid)
        document.getElementById('emailValidation').innerHTML = 'Email is Invalid'
      else
        document.getElementById('emailValidation').innerHTML = ''
    }
    else {
      document.getElementById('emailValidation').innerHTML = ''
    }
  }

}
