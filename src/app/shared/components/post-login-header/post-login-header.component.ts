import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { HttpResponse } from '@angular/common/http';
import { CountryIsoService } from '../../../../app/core/services/country-iso.service';
@Component({
  selector: 'app-post-login-header',
  templateUrl: './post-login-header.component.html',
  styleUrls: ['./post-login-header.component.scss']
})
export class PostLoginHeaderComponent implements OnInit {
  routerUrl: string;
  profileDetails: any;
  editProfile: boolean;
  breadcrum: string;
  orderID: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public countryIso: CountryIsoService
  ) {
    this.routerUrl = this.router.url;


    //  this.route.snapshot.routeConfig.path = this.orderID
  }

  ngOnInit(): void {
    this.onProfileInfo()
    this.countryIso.breadcrum = this.route.snapshot.routeConfig.path.replace(':id', this.route.snapshot.params.id) || this.orderID

  }
  onProfileInfo() {
    this.userService.getProfilePersonalInfo().subscribe(
      (response: HttpResponse<any>) => {
        this.profileDetails = response.body.data

      },
      (error) => {

      }
    )
  }
  dashboard() {
    this.editProfile = false;

    this.router.navigate([`${this.countryIso.getCountryCode()}/user/dashboard`])
  }
  profile() {
    this.editProfile = true;
    this.router.navigate([`${this.countryIso.getCountryCode()}/user/profile`])
  }
  orders() {
    this.editProfile = false;

    this.router.navigate([`${this.countryIso.getCountryCode()}/user/orders`])
  }

  quotation() {

    this.router.navigate([`${this.countryIso.getCountryCode()}/user/quotations`])
  }
  wishList() {
    this.router.navigate([`${this.countryIso.getCountryCode()}/user/wishlist`])
    this.editProfile = false;

  }
  navigateFromBreadcrum() {
    if (this.breadcrum == "profile") {
      this.editProfile = true;
      this.router.navigate([`${this.countryIso.getCountryCode()}/user/profile`])
    }
    if (this.breadcrum == "wishlist") {
      this.editProfile = false;
      this.router.navigate([`${this.countryIso.getCountryCode()}/user/wishlist`])
    }
    if (this.breadcrum == "orders") {
      this.editProfile = false;
      this.router.navigate([`${this.countryIso.getCountryCode()}/user/orders`])
    }
    if (this.breadcrum == "dashboard") {
      this.editProfile = false;
      this.router.navigate([`${this.countryIso.getCountryCode()}/user/dashboard`])
    }
  }
}

