import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Title } from '@angular/platform-browser';
import { CountryIsoService } from '../../../services/country-iso.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent implements OnInit {

  constructor(
    public service: UserService,
    private titleService: Title,
    public countryISO: CountryIsoService,
    public productService: ProductsService,
    private router: Router,
    private countryIso: CountryIsoService,
  ) {
    this.getDashData()

  }

  dashResponse: any;
  getDashData() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userDetail && userDetail['customerId']) {
      this.service.getDashboardDetailsForMain(userDetail['customerId'])
        .subscribe((response) => {
          this.dashResponse = response['data'];
        }, (error) => {
          console.log(error)
        })
    }
  }

  ngOnInit(): void {
    this.UserDashboardDetails();
    this.titleService.setTitle(this.countryISO.MessageTitile.dashboard);

  }

  UserDashboardDetails() {

  }

  navigate(val) {
    val.productName = val.productName.replace('/', '');
    this.router.navigate(
      [
        `../../${this.countryIso.getCountryCode()}/p/${this.countryIso.convertToSlug(
          val.productName
        )}`,
      ],
      { queryParams: { pid: val.id } }
    );
  }
}
