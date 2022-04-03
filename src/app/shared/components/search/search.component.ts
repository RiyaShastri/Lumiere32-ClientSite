import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CountryIsoService } from '../../../core/services/country-iso.service';

import { ProductsService } from 'src/app/core/services/products.service';
import { environment } from '../../../../environments/environment';
import { filter, finalize, startWith, take } from 'rxjs/operators';
// import * as $ from 'jquery';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('hits') hits: any;
  config = {
    apiKey: environment.algoliaAPIKEY,
    appId: environment.algoliaAPPID,
    indexName: environment.indexName,
  };
  filterCatogery: any;
  searchKeyword: any = '';
  @Output() searchValue = new EventEmitter<string>();

  constructor(
    private router: Router,
    private countryIso: CountryIsoService,
    public productService: ProductsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }
  hover: boolean = false;
  display: boolean = false;

  searchedKey(event) {
    if (event.target.value.length >= 1) {
      this.searchKeyword = event.target.value;
      this.display = true;
    } else {
      this.searchKeyword = '';
      this.display = false;
    }
    this.searchValue.emit(this.searchKeyword);
  }

  onBlur(event) {
    event.target.value ? event.target.value = '' : '';
    setTimeout(() => {
      if (window.location.href.search('/p/') > -1) {
        if (window.location.href.search(this.searchKeyword) > -1) {
        } else {
          this.display = false;
          return;
        }

        // this.display = true;
        this.display = false;
      } else {
        this.display = false;
      }
    }, 300);
  }
  // changes
  addInput(event) {
    this.display = false;
    this.cdRef.detectChanges();
    if (this.searchKeyword !== '' && this.searchKeyword.length >= 1) {
      localStorage.removeItem('detailPage');
      this.router.navigateByUrl(`/my/search?val=${this.searchKeyword}`);
      event.target.value ? event.target.value = '' : '';
    }
  }

  removeSearch($event) {
    $event.target.value = '';
    this.display = false;
  }

  navigate(val) {
    console.log('sdsdsd', val);
    let productId: any;
    this.productService.isSearchProductHit = false;
    if (val.parentId != null) {
      productId = val.parentId;
    } else {
      productId = val.objectID;
    }

    val.name = val.name.replace('/', '');
    localStorage.setItem('productInfo', val.name);
    localStorage.setItem('productId', productId);
    this.router.navigate(
      [
        `../../${this.countryIso.getCountryCode()}/p/${this.countryIso.convertToSlug(
          val.name
        )}`,
      ],
      { queryParams: { pid: `${productId}` } }
    );
  }

  getProductByCategory(parentCategoryName, categoryName, categoryId) {
    if (parentCategoryName != undefined && categoryName != undefined && categoryId != undefined) {
      parentCategoryName = parentCategoryName.replace(/\//g, '').replace('&', '').replace('(', '').replace(')', '').replace(/ {2,}/g, ' ').trim().replaceAll(' ', '-')
      parentCategoryName = parentCategoryName.toLowerCase()
      categoryName = categoryName.toLowerCase()
      categoryName = categoryName.replace(/\//g, '').replace('&', '').replace('(', '').replace(')', '').replace(/ {2,}/g, ' ').trim().replaceAll(' ', '-')
      this.router.navigateByUrl(`/my/sc/` + parentCategoryName + `/` + categoryName + `?cid=` + categoryId);
    }
  }
}
