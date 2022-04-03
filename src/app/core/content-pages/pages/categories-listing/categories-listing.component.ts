import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  AlgoliaSearchRequest,
  CategoriesListService,
} from 'src/app/core/services/categories-list.service';
import { CountryIsoService } from 'src/app/core/services/country-iso.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-categories-listing',
  templateUrl: './categories-listing.component.html',
  styleUrls: ['./categories-listing.component.scss'],
})

export class CategoriesListingComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator') paginator: any;
  showFilter = false;
  selectedValues: any;
  showPopup: any;
  popupIndex: any;
  pageNumber = 0;
  categoryies$;
  categoryFilters$;
  pagination = { page: 0 };
  sort: { sortPrice: any };
  categoryId: any;
  productType: any;
  pageno: any;
  productList: any;
  cdRef: any;
  loading: boolean;
  filterDisplay: boolean;
  searchKey: any = '';
  countryISO: any;
  reset: boolean;
  selectedSort: any;
  filterData: any = {};
  filterDataCount = 0;
  catIds = [];
  countryOriginIds = [];
  discount = [];
  manIds = [];
  dropDownOptions = [
    { label: 'New Arrivals', value: null },
    { label: 'Price : Low to High', value: 'lowest' },
    { label: 'Price : High to Low', value: 'highest' },
  ];
  selectedSorting: any;
  isActive: any;
  filter: any = {
    manufactureId: [],
  };
  filterParams: any = {
    manufactureId: [],
    categoryId: [],
    countryOriginId: [],
    discount: [],
  };
  filterList = [];
  totalRecords = 0;
  loadingObj = {
    categoryies: true
  };
  filterArrForLoader = [1, 2, 3, 4, 5];
  productArrForLoader = [1, 2, 3, 1, 3, 5, 6, 6, 2, 6, 5, 5];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    public authService: AuthService,
    public countryIso: CountryIsoService,
    public service: UserService,
    private categoryListService: CategoriesListService,
    private Location: Location
  ) {
    this.countryISO = countryIso;
  }

  async ngOnInit() {

    await this.getCategoryData();
    this.route.queryParams.subscribe((p) => {
      if (!p.page || p.page == 0) {
        this.pagination.page = 0;
      }
      this.selectedValues = [];
      this.reset = true;
      let redirectionData = JSON.parse(localStorage.getItem('detailPage'));
      if (p.page) {
        redirectionData = {};
        redirectionData.page = p.page;
        this.pagination.page = p.page;
      } else {
        this.pagination.page = 0;
      }
      if (p.sortPrice) {
        this.selectedSort = p.sortPrice;
      }
      this.searchKey = p.val;

      this.applyFilter(p);
      this.reset = true;
      const req = new AlgoliaSearchRequest();
      req.countryId = this.categoryListService.countryCode
        ? this.categoryListService.countryCode
        : 'my';
      req.query = p.val;
      req.page = p.page
        ? p.page
        : redirectionData && redirectionData.page
          ? redirectionData.page
          : 0;

      const filter = {};
      Object.keys(this.filterData).map((key) => {
        if (key === 'page' || key === 'val') {
        } else {
          filter[key] = this.filterData[key];
        }
      });

      const request = { ...req, ...filter };
      this.categoryListService.updateAlgoliaRequest(request);
      this.categoryListService.updateAlgoliaRequestFilter(req);

      if ((this.paginator && !p.page) || (this.paginator && p.page != '0')) {
        this.pagination.page = 0;
        this.paginator.changePage(0);
        this.productService.paginationNumber$.next(1);
        this.pageNumber = 1;
      }
    });

    this.router.events
      .pipe(filter((f) => f instanceof NavigationStart))
      .subscribe((e: any) => {
        if (e.navigationTrigger === 'popstate' && e.url.search('val=') < 0) {
          localStorage.removeItem('detailPage');
        } else if (e.url.search('/p/') > -1) {
          localStorage.setItem('detailPage', JSON.stringify(this.pagination));
        }
      });

    setTimeout(() => {
      this.loadingObj['categoryies'] = false;
    }, 500);
  }

  openMore(title) {
    this.popupIndex = title;
    this.showPopup = true;
  }

  ngAfterViewInit(): void {
    const redirectionData = JSON.parse(localStorage.getItem('detailPage'));
    this.pagination.page =
      this.filterData && this.filterData.page
        ? parseInt(this.filterData.page) + 1
        : redirectionData && redirectionData.page
          ? redirectionData.page
          : 0;
    setTimeout(() => {
      if (this.paginator) {
        this.paginator.changePage(
          this.filterData.page
            ? parseInt(this.filterData.page)
            : redirectionData && redirectionData.page
              ? redirectionData.page
              : 0
        );
      }
    }, 2000);
    this.pageNumber = this.filterData.page
      ? parseInt(this.filterData.page) + 1
      : redirectionData && redirectionData.page
        ? redirectionData.page + 1
        : 1;
  }

  getCategoryData() {
    return new Promise((resolve, rejects) => {
      this.categoryFilters$ = this.categoryListService.algoliaCategoryFilterResponse$.pipe(
        map((d: any) => {
          if (Object.keys(this.filterParams).length > 1) {
            Object.keys(this.filterParams).map((m) => {
              if (this.filterParams[m]) {
                const arr = this.filterParams[m];
                if (typeof arr != 'string') {
                  arr.map((id) => {
                    d.data.filter.map((da) => {
                      if (
                        da &&
                        da.value &&
                        da.name.toLowerCase() === m.toLowerCase()
                      ) {
                        da.value.map((k) => {
                          if (k.id === +id) {
                            this.selectedValues.push(k.uuid);
                          }
                        });
                      }
                    });
                  });
                }
              }
            });
          }

          return d;
        })
      );

      this.categoryies$ = this.categoryListService.algoliaCategoryResponse$.pipe(
        map((res: any) => {
          if (this.paginator) {
            this.paginator.totalRecords = res?.data?.total;
            (res?.data?.total == 0) ? this.countryIso.zeroResults = true : this.countryIso.zeroResults = false
            }
          this.reset = false;
          return res;
        })
      );
      resolve(200);
    });
  }

  navigateRoutes(item, id) {
    localStorage.setItem('productInfo', item);
    localStorage.setItem('productId', id);
  }

  searchCategory() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById('searchUL');
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName('a')[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  searchPopupCategory() {
    let input: any = document.getElementById('searchPopupInput');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById('searchPopupList');
    let li = ul.getElementsByTagName('li');
    for (let i = 0; i < li.length; i++) {
      let a = li[i].getElementsByTagName('a')[0];
      let txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  private applyFilter(params) {
    if (Object.keys(params) && Object.keys(params).length > 1) {
      Object.keys(params)?.map((k) => {
        if (k !== 'val=' && k !== 'query' && params[k]) {
          if (k === 'page') {
            this.filterData[k] = params[k];
            this.filterParams[k] = params[k];
          } else {
            this.filterData[k] = params[k];
            this.filterParams[k] = params[k].split(',');
          }
        }
      });
    }
  }

  searchPlaceholder(value) {
    return 'Search in' + value;
  }

  /* this will bring all the products */
  sortingChange(event) {
    this.sort = { sortPrice: event.value };
    this.filterParams.sortPrice = event.value;
    this.updateURL();
    this.updateCategoryListRequest();
  }

  goToLogin(productName, pid) {
    localStorage.setItem('productInfo', productName);
    localStorage.setItem('productId', pid);
    this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
  }

  clearFilter() {
    for (let i = 0; i < this.filterDataCount; i++) {
      var item = document.getElementsByTagName('p-checkbox')[
        i
      ] as HTMLInputElement;
      let index = this.filterList.indexOf(item.innerText);
      if (item.checked && index >= 0) item.click();
    }
    this.filterParams.manufactureId = [];
    this.filterParams.categoryId = [];
    this.filterParams.countryOriginId = [];
    this.filterParams.discount = [];
    this.selectedValues = [];
    console.log('sssss', this.selectedValues, this.filterData);
    this.updateSearch();
  }

  checkBoxEvent(event, checkeditems, head) {
    let mids: any = [];
    let cids: any = [];
    let countryIds = [];
    let discount = [];

    if (event.checked == true) {
      this.filterList.push(checkeditems.title);
      if (head.title.toLowerCase() === 'brands') {
        console.log("discount===>");
        mids = this.filterParams.manufactureId || [];
        mids.push(checkeditems.id.toString());
        this.filterParams.manufactureId = mids;
        this.updateURL();
        this.updateSearch();
      }
      if (head.title.toLowerCase() === 'categories') {
        cids = this.filterParams.categoryId || [];
        cids.push(checkeditems.id.toString());
        this.filterParams.categoryId = cids;
        this.updateURL();
        this.updateSearch();
      }

      if (head.title.toLowerCase() === 'country of origin') {

        countryIds = this.filterParams.countryOriginId || [];
        countryIds.push(checkeditems.id.toString());
        this.filterParams.countryOriginId = countryIds;
        this.updateURL();
        this.updateSearch();
      }

      if (head.title.toLowerCase() === 'discount') {
        discount = this.filterParams.discount || [];
        discount.push(checkeditems.id.toString());
        this.filterParams.discount = discount;
        this.updateURL();
        this.updateSearch();
      }
    } else {
      let index = this.filterList.indexOf(checkeditems.title);
      if (index >= 0) this.filterList.splice(index, 1);
      if (head.title.toLowerCase() === 'brands') {
        let index = this.filterParams.manufactureId.indexOf(
          checkeditems.id.toString()
        );
        this.filterParams.manufactureId.splice(index, 1);
        this.updateURL();
        this.updateSearch();
      }
      if (head.title.toLowerCase() === 'categories') {
        let index = this.filterParams.categoryId.indexOf(
          checkeditems.id.toString()
        );
        this.filterParams.categoryId.splice(index, 1);
        this.updateURL();
        this.updateSearch();
      }
      if (head.title.toLowerCase() === 'country of origin') {
        let index = this.filterParams.countryOriginId.indexOf(
          checkeditems.id.toString()
        );
        this.filterParams.countryOriginId.splice(index, 1);
        this.updateURL();
        this.updateSearch();
      }

      if (head.title.toLowerCase() === 'discount') {
        let index = this.filterParams.discount.indexOf(
          checkeditems.id.toString()
        );
        this.filterParams.discount.splice(index, 1);
        this.updateURL();
        this.updateSearch();
      }
    }
  }

  updateURL() {
    const location = window.location.href.split('val=')[0];
    if (!location) {
      return;
    }
    const baseUrl = location.substr(
      window.location.origin.length,
      location.length - 1
    );
    let query = '';
    Object.keys(this.filterParams).map((d) => {
      if (
        this.filterParams[d] &&
        this.filterParams[d].length &&
        d !== 'page' &&
        d !== 'sortPrice' &&
        d !== 'val'
      ) {
        query += '&' + d + '=' + this.filterParams[d].join(',');
      } else if (d === 'page') {
        query += '&' + d + '=' + this.filterParams[d];
      } else if (d === 'sortPrice') {
        query += '&' + d + '=' + this.filterParams[d];
      }
    });
    this.Location.replaceState(baseUrl + 'val=' + this.searchKey + query);
  }

  updateSearch() {
    let data: any = {
      cid: this.categoryId,
    };
    if (this.filterParams.manufactureId) {
      if (this.filterParams.manufactureId.length == 0) {
        delete data.manufactureId;
      }
      if (this.filterParams.manufactureId.length > 0) {
        data.manufactureId = this.filterParams.manufactureId.toString();
      }
    }
    if (this.filterParams.sortPrice) {
      data.sortPrice = this.filterParams.sortPrice;
    }

    if (this.filterParams.page) {
      data.page = 0;
    }
    if (this.filterParams.categoryId) {
      if (this.filterParams.categoryId.length == 0) {
        delete data.categoryId;
      }
      if (this.filterParams.categoryId.length > 0) {
        data.categoryId = this.filterParams.categoryId.toString();
      }
    }

    if (this.filterParams.countryOriginId) {
      if (this.filterParams.countryOriginId.length == 0) {
        delete data.countryOriginId;
      }
      if (this.filterParams.countryOriginId.length > 0) {
        data.countryOriginId = this.filterParams.countryOriginId.toString();
      }
    }

    if (this.filterParams.discount) {
      if (this.filterParams.discount.length == 0) {
        delete data.discount;
      }
      if (this.filterParams.discount.length > 0) {
        data.discount = this.filterParams.discount.toString();
      }
    }
    this.filterData = data;
    this.pagination.page = 0;
    this.updateCategoryListRequest(true);
  }

  homeNavigate() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/`]);
  }

  onPageChange(e) {
    this.filterData.page = e.page;
    if (!this.pagination.page || this.pagination.page !== e.page) {
      this.pagination.page = this.filterData.page
        ? this.filterData.page
        : this.reset
          ? 0
          : e.page;

      this.pageNumber = this.filterData.page
        ? parseInt(this.filterData.page) + 1
        : (this.reset ? 0 : e.page) + 1;
      this.filterParams.page = e.page;
      this.updateURL();
      this.updateCategoryListRequest();
    }
  }

  private updateCategoryListRequest(isReset = false) {
    const req = {
      ...new AlgoliaSearchRequest(),
      ...this.filterData,
      ...this.pagination,
      ...this.sort,
      ...{ query: this.searchKey },
    };

    if (isReset && !this.filterData.page) {
      req.page = 0;
    }
    this.categoryListService.updateAlgoliaRequest(req);
    this.categoryListService.updateAlgoliaRequestFilter(req);

    if (this.paginator && isReset && !this.filterData.page) {
      this.pagination.page = 0;
      this.paginator.changePage(0);
    }
  }

  getActiveFilterCount(array: any[]) {
    return array.filter((f) => f.active).length;
  }

}
