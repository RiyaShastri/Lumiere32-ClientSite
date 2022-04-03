import { Component, OnInit, TemplateRef, Input, ChangeDetectorRef, AfterViewInit, ɵConsole } from '@angular/core';
import { CheckboxFilter } from 'src/app/core/vertical-filter-bar/checkbox-filter/checkbox-filter.model';
import { FBFilter } from 'src/app/core/vertical-filter-bar/fb-filter.interface';
import { KeywordFilter } from 'src/app/core/vertical-filter-bar/keyword-filter/keyword-filter.model';
import { RangeFilter } from 'src/app/core/vertical-filter-bar/range-filter/range-filter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-get-equipment',
  templateUrl: './get-equipment.component.html',
  styleUrls: ['./get-equipment.component.scss']
})
export class GetEquipmentComponent implements OnInit {
  @Input() filterResultsChange: any;
  encodeurl = new HttpUrlEncodingCodec
  filterOptions = [
    { label: 'Default', value: null },
    { label: 'price : Low to High', value: "lowest" },
    { label: 'price : High to Low', value: "highest" }
  ];
  selectedSorting: any;
  showFilter = false;
  categories: string[] = ['Medical Disposables', 'Consumables', 'Speciality', 'Mobility Aids']
  customerRatings: string[] = ['4 & above', '3 & above', '2 & above',]
  discountRange: string[] = ['10% or more', '20% or more', '30% or more']
  byCountry: string[] = ['India', 'Nepal']
  verticalBarFilters: FBFilter[] = [
    // new KeywordFilter('description', 'Description'),
    // new CheckboxFilter('categories', 'CATEGORIES', this.categories, 4),
    new RangeFilter('price', 'Price', 0, 10000, true)
    // new CheckboxFilter('customerRatings', 'Customer Ratings', this.customerRatings),
    // new CheckboxFilter('discountRange', 'Discount Range', this.discountRange),
    // new CheckboxFilter('byCountry', 'Filter By Country', this.byCountry)
  ];
  productType: any = [];
  currentRoute: any;
  categoryId: any;
  filterData: any = {};
  totalRecords;
  productList: any = [];
  pageno = 0;
  breadCrumbData: any = {};
  constructor(
    public service: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    public authService: AuthService,
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    public counrtyIso: CountryIsoService
  ) {
    this.getMerchantType();
    this.counrtyIso.allCountries = JSON.parse(localStorage.getItem('country'));
    this.counrtyIso.getSelectedCountryObject(this._router.url.split('/')[1])
  }

  ngOnInit(): void {

    console.log("trigger")
    this._activatedRoute.queryParams.subscribe(param => {
      this.categoryId = param.cid;
      this.getFiltersData();
      this.cdr.detectChanges();
    });
    this.setRoute();
  }
  setRoute() {
    this.counrtyIso.getCountriesList().subscribe((response: any) => {
      this.counrtyIso.allCountries = response.data;
      this.counrtyIso.getSelectedCountryObject(this._router.url.split('/')[1]);
    },
      error => {
        // this.toastr.error(error.error.message);
      })
    this.getFiltersData();
    this.getProductsByCategory();
    this.cdr.detectChanges();
  }
  navigateRoutes(productName, pid) {
    console.log("enter in navigate")
    this._router.navigate(['/' + this.counrtyIso.countryName + '/p/', productName.split('+').join('-').split('(').join('-').split(')').join('-').split('/').join('-').replace(/ |_/g, '-')], { queryParams: { pid: pid } });
  }
  onPageChange(e) {
    this.pageno = e.page;
    this.getProductsByCategory();
  }
  getMerchantType() {
    this.currentRoute = this._activatedRoute.snapshot.routeConfig.path;
    var splitted = this.currentRoute.split("/");
    this.productType = splitted;
  }
  // get Filters Data
  getFiltersData() {
    console.log("get filter data", this.productType)
    this.productService.getFilters(this.categoryId, this.productType).subscribe((response: any) => {
      this.breadCrumbData = response.data.breadcrumb;

      if (this.breadCrumbData.CategoryName) {
        this.titleService.setTitle('Buy ' + this.breadCrumbData.CategoryName + ' Online at Best Price | Lumiere32.my')
      } else {
        this.titleService.setTitle('Buy ' + this.breadCrumbData.parentCategoryName + ' Online at Best Price | Lumiere32.my')
      }
      console.log(response.data.filter)
      this.verticalBarFilters = [
        new RangeFilter('price', 'Price', 0, 10000, true)
      ];
      response.data.filter.forEach(item => {
        console.log("equipment", item)
        if (item.value.length > 4) {
          this.verticalBarFilters.push(new CheckboxFilter(item.name, item.title, item.value))
        }
        else {
          this.verticalBarFilters.push(new CheckboxFilter(item.name, item.title, item.value))
        }
      })
    },
      error => {
        console.log(error.error.message)
      })
  }
  filterResultChange(event) {
    console.log("filter", event)
    this.filterData = event;
    Object.keys(event).forEach(key => event[key] == undefined && delete event[key])
    this.getProductsByCategory();
  }
  clearAllFilter() {
    console.log("filter")
    this.filterData = {};
    this.getFiltersData();
    this.getProductsByCategory();
  }
  getProductsByCategory() {
    if (this.selectedSorting != null || this.selectedSorting != undefined) {
      this.filterData.sortPrice = this.selectedSorting;
    }
    else {
      delete this.filterData.sortPrice
    }

    console.log("pass argument 1",this.filterData)
    console.log("pass argument 2",this.pageno)

    this.productService.getProductsByCategory(this.filterData, this.pageno).subscribe((response:any) => {
      console.log("response by search category",response);
      this.productList=response.data.results;
      this.totalRecords=response.data.total;
      this.cdr.detectChanges();
    },
      error => {
        console.log(error.error.message)
      });
  }
  sortingChange(e) {
    if (e.value == null) {
      console.log(this.selectedSorting);
    }
    this.getProductsByCategory();
  }
  ecodingUrl(url) {
    console.log("url encoded", url)
    return this.encodeurl.encodeValue(url);
  }
}
