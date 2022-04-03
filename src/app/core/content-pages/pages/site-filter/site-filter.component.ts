import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
} from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { CategorySearchRequest } from 'src/app/core/services/categories-list.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-site-filter',
  templateUrl: './site-filter.component.html',
  styleUrls: ['./site-filter.component.scss'],
})
export class SiteFilterComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator: any;
  showFilter = false;
  selectedValues: any;
  showPopup: any;
  popupIndex: any;
  pageNumber = 1;
  breadCrumbData: any;
  showErrorPage: boolean = false;
  reset: boolean;
  totalRecords = 0;

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
  loadingObj = {
    categoryies: true
  };
  countryISO: any;
  breadCrumb: string;
  filterParams: any = {
    manufactureId: [],
    categoryId: [],
    countryOriginId: [],
    discount: [],
  };
  dropDownOptions = [
    { label: 'New Arrivals', value: null },
    { label: 'Price : Low to High', value: 'lowest' },
    { label: 'Price : High to Low', value: 'highest' },
  ];
  selectedSorting: any;
  filterDataCount = 0;
  catIds = [];
  isActive: any;
  filter: any = {
    manufactureId: [],
  };
  countryOriginIds = [];
  discount = [];
  manIds = [];
  filterList = [];
  filterData: any;
  rd: string;
  selectedSort: any;
  askMoreForm: any;
  showAskMore: boolean;
  productInfo: any;
  fieldDisable: boolean;
  userInfo: any;
  modalHeading: string;
  filterArrForLoader = [1, 2, 3, 4, 5];
  productArrForLoader = [1, 2, 3, 1, 3, 5, 6, 6, 2, 6, 5, 5];
  categoryies$ = this.productService.category$.pipe(
    map((d) => {
      this.totalRecords = d?.data?.total;
      if (this.paginator) {
        this.paginator.totalRecords = d?.data?.total;
      }
      if (!d || d?.data?.total === 0) {
        this.showErrorPage = true;
      } else {
        this.showErrorPage = false;
      }
      if (d && d?.data && d?.data?.results) {
        this.reset = false;
        return d?.data?.results;
      }
      this.reset = false;
      return null;
    })
  );
  categoryFilters$ = this.productService.productByCategoryFilter$.pipe(
    map((d: any) => {
      this.breadCrumbData = d?.data ? d?.data?.breadcrumb : null;

      if (Object.keys(this.filterData).length > 1) {
        Object.keys(this.filterData).map((m) => {
          if (this.filterData[m]) {
            const arr = this.filterData[m];
            if (typeof arr != 'string' && typeof arr != 'number') {
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

      return d && d?.data && d?.data ? d?.data : null;
    })
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    public authService: AuthService,
    countryIso: CountryIsoService,
    public service: UserService,
    private Location: Location
  ) {
    this.countryISO = countryIso;
    this.rd = this.router.url;
    this.rd = this.rd.split('/')[3].split('?')[0];
    this.rd = this.rd.split("%20").join(" ");
    this.rd = this.rd.replace("-", " ").split(' ').map(this.capitalize).join(' ');
  }

  ngOnInit() {
    // this.updateCurrentPage();
    this.route.queryParams.subscribe((params) => {
      if (!params.page || params.page == 0) {
        this.pagination.page = 0;
      }
      this.reset = true;
      this.clearFilter();
      this.selectedValues = [];

      let redirectionData = JSON.parse(localStorage.getItem('detailPageSite'));

      if (params.page) {
        redirectionData = {};
        redirectionData.page = params.page;
        this.pagination.page = params.page;
      } else {
        this.pagination.page = 0;
      }

      if (params.sortPrice) {
        this.selectedSort = params.sortPrice;
      }

      if (window.location.href.search('brand') > -1) {

        this.breadCrumb = window.location.href.split('/')[3].split('?')[0];
        this.getMerchantType();
        this.categoryId = params.manufactureId;
        this.applyFilter(params);
        this.productService.productByCategoryRequest$.next({
          page:
            redirectionData && redirectionData.page ? redirectionData.page : 0,
          manufactureId: params.manufactureId,
          ...{ ...params },
        });
        const pCat = { manufactureId: params.manufactureId };
        this.productService.productByCategoryFilterRequest$.next({
          params: pCat,
          productType: this.productType,
        });
      } else {
        // this.breadCrumb = window.location.href;
        this.breadCrumb = window.location.href.split('/')[3].split('?')[0];
        if (window.location.href.search('sc') > -1) {
          this.productService.isSubCategory = true;
        } else {
          this.productService.isSubCategory = false;
        }
        this.getMerchantType();

        this.categoryId = params.cid;

        //do filter work here;
        this.applyFilter(params);
        if (params.page) {
          this.pagination.page = params.page;
        }
        if (!this.productService.isSubCategory) {
          const pCat = { parentCategoryId: this.categoryId };
          this.productService.productByCategoryFilterRequest$.next({
            params: pCat,
            productType: this.productType,
          });
        }
        else {
          const pCat = { categoryId: this.categoryId };
          this.productService.productByCategoryFilterRequest$.next({
            params: pCat,
            productType: this.productType,
          });
        }

        if (!this.productService.isSubCategory) {
          this.productService.productByCategoryRequest$.next({
            parentCategoryId: this.categoryId,
            ...{ ...params },
            page:
              redirectionData && redirectionData.page
                ? redirectionData.page
                : 0,
          });
        } else {
          this.productService.productByCategoryRequest$.next({
            page:
              redirectionData && redirectionData.page
                ? redirectionData.page
                : 0,
            categoryId: this.categoryId,
            ...{ ...params },
          });
        }
      }

      if (this.paginator && (!params.page || params.page == 0)) {
        this.pagination.page = 0;
        this.paginator.changePage(0);
        this.productService.paginationNumber$.next(1);
        this.pageNumber = 1;
      }
    });

    this.router.events
      .pipe(filter((f) => f instanceof NavigationStart))
      .subscribe((e: any) => {
        if (e.url.search('/p/') < 0 && e.url.search('cid=') < 0) {
          localStorage.removeItem('detailPageSite');
        } else if (e.url.search('/p/') > -1) {
          localStorage.setItem(
            'detailPageSite',
            JSON.stringify(this.pagination)
          );
        }
      });

    setTimeout(() => {
      this.loadingObj['categoryies'] = false;
    }, 500);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngAfterViewInit(): void {
    const redirectionData = JSON.parse(localStorage.getItem('detailPageSite'));
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

  openMore(title) {
    this.popupIndex = title;
    this.showPopup = true;
    this.showErrorPage = false;
  }

  parentCategoryNavigates(mybreadCrumbData) {
    console.log('myurl', mybreadCrumbData);
    if (mybreadCrumbData == 'Buy More, Save More') {
      this.router.navigate(
        [
          `/${this.countryISO.getCountryCode()}/c/${this.countryISO.convertToSlug(
            mybreadCrumbData.parentCategoryName
          )}` + `?isQuantityDiscount=true`,
        ],
        { queryParams: { cid: mybreadCrumbData.parentCategoryId } }
      );
    }
    this.router.navigate(
      [
        `/${this.countryISO.getCountryCode()}/c/${this.countryISO.convertToSlug(
          mybreadCrumbData.parentCategoryName
        )}/`,
      ],
      { queryParams: { cid: mybreadCrumbData.parentCategoryId } }
    );
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

  applyFilter(params) {
    if (Object.keys(params) && Object.keys(params).length > 1) {
      Object.keys(params).map((k) => {
        if (k !== 'cid') {
          if (k === 'page') {
            this.filterData[k] = params[k];
            this.filterParams[k] = params[k];
          } else {
            this.filterData[k] = params[k].split(',');
            this.filterParams[k] = params[k].split(',');
          }
        }
      });
    } else {
      if (params.manufactureId && window.location.href.search('brand') > -1) {
        Object.keys(params).map((k) => {
          if (k !== 'cid') {
            if (k === 'page') {
              this.filterData[k] = params[k];
              this.filterParams[k] = params[k];
            } else {
              this.filterData[k] = params[k].split(',');
              this.filterParams[k] = params[k].split(',');
            }
          }
        });
      }
    }
  }

  showAskMoreDialog(type) {
    this.askMoreForm.reset();
    this.showAskMore = true;
    const controls = this.askMoreForm.controls;
    controls.productId.setValue(this.productInfo.id);
    controls.productName.setValue(this.productInfo.productName);
    if (this.authService.loginFlag) {
      this.fieldDisable = true;
      controls.name.setValue(
        this.userInfo.firstName + ' ' + this.userInfo.lastName
      );

      //controls.countryCode.setValue(this.counrtyIso.getCountryId());
      controls.emailId.setValue(this.userInfo.Email);
      controls.mobileNo.setValue(this.userInfo.mobileNumber);
      controls.countryCode.patchValue(this.userInfo.countryCode.name);
    }
    if (type == 'ask More') {
      this.modalHeading = 'Ask more information';
      controls.type.setValue('ask');
    } else if (type == 'sample') {
      this.modalHeading = 'Request For Sample';
      controls.type.setValue('sample');
    } else if (type == 'quote') {
      this.modalHeading = 'Request For Quote';
      controls.type.setValue('Quote');
    }
  }

  getMerchantType() {
    const currentRoute = this.route.snapshot.routeConfig.path;
    var splitted = currentRoute.split('/');
    this.productType = splitted;
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
  /* drop down options */

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

  homeNavigate() {
    this.router.navigate([`/${this.countryISO.getCountryCode()}/`]);
  }

  checkBoxEvent(event, checkeditems, head) {
    let mids: any = [];
    let cids: any = [];
    let countryIds = [];
    let discount = [];

    if (event.checked == true) {
      this.filterList.push(checkeditems.title);
      if (head.title.toLowerCase() === 'brands') {
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
    let location = window.location.href.split('cid=')[0];
    if (window.location.href.includes('isQuantityDiscount') || window.location.href.includes('buy-more-save-more')) {
      location = window.location.origin + window.location.pathname + '?isQuantityDiscount=true'
    }
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
        d !== 'sortPrice'
      ) {
        query += '&' + d + '=' + this.filterParams[d].join(',');
      } else if (d === 'page') {
        query += '&' + d + '=' + this.filterParams[d];
      } else if (d === 'sortPrice') {
        query += '&' + d + '=' + this.filterParams[d];
      }
    });

    if (window.location.href.search('brand') > -1) {
      const brandBaseUrl = baseUrl.split('?')[0].split('&')[0];
      this.Location.replaceState(brandBaseUrl + '?' + query.substr(1));
      return;
    }
    else if ((window.location.href.search('isQuantityDiscount') > -1) || (window.location.href.search('buy-more-save-more') > -1)) {
      const qbdURL = baseUrl.replace('isQuantityDiscount=true', '').replace('cid=&', '')
      if (query.includes('isQuantityDiscount')) {
        query = query.substring(1)
        this.Location.replaceState(qbdURL + query);
      }
      else
        this.Location.replaceState(qbdURL + 'isQuantityDiscount=true' + query);
    }
    else {
      this.Location.replaceState(baseUrl + 'cid=' + this.categoryId + query);
    }
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

  updateCategoryListRequest(isReset = false) {
    const req = {
      ...new CategorySearchRequest(),
      ...this.filterData,
      ...this.pagination,
      ...this.sort,
    };

    if (window.location.href.search('brand') > -1) {
      req['manufactureId'] = this.filterData.manufactureId
        ? this.filterData.manufactureId
        : this.categoryId;
    } else {
      if (this.productService.isSubCategory && this.categoryId) {
        req['categoryId'] = this.categoryId;
      } else {
        req['parentCategoryId'] = this.categoryId;
      }
    }

    if (isReset && !this.filterData.page) {
      req.page = 0;
    }
    delete req.cid;
    this.productService.productByCategoryRequest$.next(req);

    this.productService.productByCategoryFilterRequest$.next({
      params: req,
      productType: this.productType,
    });

    if (this.paginator && isReset && !this.filterData.page) {
      this.pagination.page = 0;
      this.paginator.changePage(0);
    }
  }

  getActiveFilterCount(array: any[]) {
    return array.filter((f) => f.active).length;
  }
}
