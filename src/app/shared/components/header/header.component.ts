import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { CategoryServiceService } from '../../../core/services/category-service.service';
import { ProductsService } from '../../../core/services/products.service';
import { CartCountService } from '../../../core/services/cart-count.service';
import { CountryIsoService } from '../../../core/services/country-iso.service';

import data from '../../../../assets/data.json';
import { AlertService } from 'src/app/_alert';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  options = {
    autoClose: false,
    keepAfterRouteChange: true,

  };
  @Input() getCount: any;
  allCategories: any = [];
  cartCount: any;
  countryCode: any;
  userId;
  selectedCountry: any;

  phoneCode: any;
  allCountriesFromJSON: any;
  showMenu: any;
  showCategory: boolean = false;
  showHelpMenu: boolean = false;
  subMenu: string;
  menuIcon: string = 'bi bi-plus-lg';
  plusIcon: boolean = true;
  index: number;
  logInChecked: any
  searchText = null;
  tokenVerified: any;
  displayDialog: boolean = false;
  dat: any = {};
  country_id;

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastr: ToastrService,
    private _categoryService: CategoryServiceService,
    private _productService: ProductsService,
    private cartCountService: CartCountService,
    public counrtyIso: CountryIsoService,
    private _activateRoute: ActivatedRoute,
    public alertService: AlertService,
    private cdRef: ChangeDetectorRef
  ) {
    this.showMenu = false;
    this.allCountriesFromJSON = data.allCountries;
    this.countryCode = this.router.url.split('/')[1];

    // =============newly added===================================

    this.countryCode = data.allCountries[0].alphaCode;
    localStorage.setItem('countryCode', this.countryCode)

    // =============================================================
    Promise.all([
      this.counrtyIso.getSelectedCountryObject(this.countryCode),
      this.setLocally(),
    ]);
    // this.counrtyIso.getSelectedCountryObject(this.countryCode )

    this.cartCountService.cartCount.subscribe((lang) => {
      this.getCartCount(this.counrtyIso.getLoggedInCustomerId());
    });

    let loggedCheck = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    this.logInChecked = loggedCheck ? 'Pay32' : 'Top-Up';
  }

  setLocally() {
    localStorage.setItem('countryCode', this.countryCode);
  }
  homepage() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}`]);
  }
  // dentalSupplies() {
  //   this.router.navigate([`/${this.counrtyIso.getCountryCode()}/dental`]);
  // }
  mediclaSupplies() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/medical`]);
  }

  pay32() {
    if (this.authService.loginFlag) {
      this.router.navigate([`/${this.counrtyIso.getCountryCode()}/my-wallet`]);
    } else {
      this.router.navigate([
        `/${this.counrtyIso.getCountryCode()}/pay32/top-up`,
      ]);
    }
  }

  topUp() {
    this.router.navigate([
      `/${this.counrtyIso.getCountryCode()}/pay32/top-up`,
    ])
  }

  aboutus() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/my-wallet`]);
  }

  commingSoon() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/offers`]);
  }

  termofuse() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/term-of-use`]);
  }
  privacy() {
    this.router.navigate([
      `/${this.counrtyIso.getCountryCode()}/privacy-policy`,
    ]);
  }
  myOrder() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/user/orders`]);
  }
  profile() {
    this.router.navigate([`${this.counrtyIso.getCountryCode()}/user/profile`]);
  }
  quotation() {
    this.router.navigate([
      `${this.counrtyIso.getCountryCode()}/user/quotations`,
    ]);
  }
  wishList() {
    this.router.navigate([`${this.counrtyIso.getCountryCode()}/user/wishlist`]);
  }
  ngOnInit(): void {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userDetail) {
      this.authService.loginFlag = true;
      this.authService.showPrice = true;
      this.userId = this.counrtyIso.getLoggedInCustomerId();
      this.authService.loggedInCustomerName = userDetail['firstName'];
      this.getCartCount(userDetail['customerId']);
    }
    this.country_id = localStorage.getItem("country_id");
    this.selectedCountry = this.counrtyIso.selectedCountry[0];
    this.getCategories();
    this.getCartBadgeCount(); //newly added fun
    // this.alertService.info(
    //   'FREE SHIPPING on Order of RM 150 and above',
    //   this.options
    // );
  }

  getUpdatedCountry(e) {
    // this.selectedCountry=e.value;
    let countryData = {
      region: e.value.itemName,
      countryId: e.value.id,
    };

    localStorage.setItem('userInRegion', JSON.stringify(countryData));
    this.counrtyIso.countryName = this.selectedCountry.alphaCode;
    this.counrtyIso.getSelectedCountryObject(this.counrtyIso.countryName);

    if (this.counrtyIso.countryName) {
      this.counrtyIso.countryName = this.countryCode;
      localStorage.setItem('countryCode', this.counrtyIso.countryName);

      this.router
        .navigateByUrl(`/${this.counrtyIso.countryName}/login`, {
          skipLocationChange: false,
        })
        .then(() => {
          this.router.navigate(['/' + this.counrtyIso.countryName + '/login']);
        });
      this.router.navigate(['/' + this.counrtyIso.countryName + '/login']);

      //window.location.reload()
    } else {
      this.router.navigate(['/', this.counrtyIso.getCountryCode()]);
    }
    this.getCategories();
  }

  //newly added start
  getCartBadgeCount() {
    this.cartCountService.cartCount.pipe(take(1)).subscribe((lang) => {
      this.getCartCount(this.counrtyIso.getLoggedInCustomerId());
    });
  }

  // newly added close

  contact() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/contact-us`]);
  }

  about() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/about-us`]);
  }
  addtocart() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/cart`]);
  }
  getCategories() {
    this._categoryService.getCategories().subscribe(
      (response: any) => {
        this.allCategories = response.data.result;
      },
      (error) => {
        if (error.status == 401) {
          this.router.navigate([`/${this.counrtyIso.getCountryCode()}/login`]);
        }
      }
    );
  }

  loginPage() {
    this.router
      .navigate(['/' + this.counrtyIso.getCountryCode() + '/login'])
      .then((data) => {
        console.log('data', data);
      })
      .catch((error) => {

        this.router.navigate([
          '/' + this.counrtyIso.getCountryCode() + '/login',
        ]);
      });
  }
  signUpPage() {
    this.router.navigate([
      '/' + this.counrtyIso.getCountryCode() + `/register`,
    ]);
  }

  logout() {
    this.authService.doLogout();
  }

  isSubMenu(val, item?: any) {
    localStorage.removeItem('detailPageSite');
    this._productService.isSubCategory = val;
    this._productService.isReset.next(true);
    if (!val) {
      // [routerLink]="[ '/'+counrtyIso.getCountryCode()+'/c', counrtyIso.convertToSlug(item?.categoryName)]"
      //         [queryParams]="{cid: item?.id}"
      // this.router.navigateByUrl(this.counrtyIso.getCountryCode() + '/c/' + this.counrtyIso.convertToSlug(item?.categoryName) + '?cid=' + item?.id)
    }
  }
  logoNavigate() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}`]);
  }
  getCartCount(id) {
    this._productService.getProductCount(id).subscribe(
      (response: any) => {
        if (response && response['data']) {
          this.cartCount = response['data'];
        } else {
          this.cartCount = 0;
        }
        // if (response.data && response.data.length > 0) {
        //   this.cartCount = null;
        // }
      },
      (error) => { });
  }
  dashboard() {
    this.router.navigate([
      `/${this.counrtyIso.getCountryCode()}/user/dashboard`,
    ]);
  }

  rewards() {
    this.router.navigate([
      `/${this.counrtyIso.getCountryCode()}/rewards`,
    ]);
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
    if (this.searchText !== '' && this.searchText.length >= 1 &&
      this.searchText !== null && this.searchText !== 'null') {
      this.router.navigateByUrl(`/my/search?val=${this.searchText}`);
    }
  }
  onSearchProduct(val) {
    this.display = true;
  }

  searchValue(event) {
    this.cdRef.detectChanges();
    localStorage.removeItem('detailPage');
    this.searchText = event;
  }

  closeSidebar() {
    localStorage.removeItem('detailPageSite');
    this.showMenu = false;
    this._productService.isReset.next(true);
  }

  openSidebar() {
    this.showMenu = true;
  }

  showSubmenu(item: any, index?: number) {
    localStorage.removeItem('detailPageSite');
    this.index = index;
    this.plusIcon = false;
    if (this.subMenu === item?.categoryName) {
      this.subMenu = '';
      this.menuIcon = 'bi bi-plus-lg';
      this.plusIcon = true;
      return;
    }
    this.subMenu = item?.categoryName;
    this.menuIcon = 'bi bi-dash-lg';
    this.plusIcon = false;
  }

  showQuoteDialog() {
    this.displayDialog = true;
  }

  submit() {
    if (!this.tokenVerified) {
      this.toastr.show('Please fill captcha first to proceed');
      return;
    }
    this.dat.mobileNo = this.phoneCode + this.dat.mobileNo;
    this.dat.type = 'quote';
    this._productService.askMoreRequest(this.dat).subscribe(
      (response) => {
        this.counrtyIso.openSweetAlert(
          'Quote Request submitted successfully',
          'Our agent will get back to you'
        );
        // this.toastr.success("Our agent will get back to you")
        this.displayDialog = false;
        this.dat = {};
      },
      (error) => {
        this.toastr.show('some error occurred while submitting');
        if (error.status == 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }


  public resolved(captchaResponse: string) {
    this.tokenVerified = captchaResponse;
  }

  public onError(errorDetails: any[]) {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  corporatePurchase() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/corporate`]);
  }
  sellOnLumiere() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/sell-on-lumiere32`]);
  }

}
