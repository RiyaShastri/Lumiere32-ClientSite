import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductsService } from 'src/app/core/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { validateAllFormFields } from '../../../utils/custom-validators';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../../services/utility.service';
import { CartCountService } from '../../../services/cart-count.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';
import { CheckoutService } from 'src/app/core/services/checkout.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {

  productImageView = '';
  productImageViewActive = 0;
  outStockDisplay = true;
  loadingObj = {};
  productSlides = [
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 100`,
      originalprice: `${this.service.curr} 200`,
      walletprice: `${this.service.curr} 80`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 90`,
      originalprice: `${this.service.curr} 180`,
      walletprice: `${this.service.curr} 70`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 90`,
      originalprice: `${this.service.curr} 180`,
      walletprice: `${this.service.curr} 70`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 90`,
      originalprice: `${this.service.curr} 180`,
      walletprice: `${this.service.curr} 70`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 120`,
      originalprice: `${this.service.curr} 100`,
      walletprice: `${this.service.curr} 100`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 150`,
      originalprice: `${this.service.curr} 300`,
      walletprice: `${this.service.curr} 120`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50`,
      originalprice: `${this.service.curr} 100`,
      walletprice: `${this.service.curr} 40`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50`,
      originalprice: `${this.service.curr} 100`,
      walletprice: `${this.service.curr} 40`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
  ];
  productSlideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    margin: 10,
    nextArrow: '<i class="fa fa-chevron-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left"></i>',
    dots: true,
    infinite: false,
    // "nextArrow": '<i class="fa fa-chevron-right"></i>'
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  phoneCodes = [
    { name: 'select' },
    { name: '+1' },
    { name: '+31' },
    { name: '+44' },
    { name: '+60' },
    { name: '+61' },
    { name: '+65' },
    { name: '+91' },
  ];
  productId = '';
  productInfo;
  cartForm: FormGroup;
  askMoreForm: FormGroup;
  showAskMore = false;
  codes = [];
  userInfo = {};
  modalHeading = '';
  fieldDisable = false;
  showVariant = false;
  state$: Observable<object>;
  loading: boolean;
  showErrorPage = false;

  constructor(
    private productService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public _utility: UtilityService,
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cartCountService: CartCountService,
    public counrtyIso: CountryIsoService,
    public service: UserService,
    private titleService: Title,
    private checkService: CheckoutService
  ) {
    this.showErrorPage = false;
    router.events.subscribe((val) => {
      if (this.productId != this._activatedRoute.snapshot.queryParams.pid) {
        this.productImageView = '';
        this.productImageViewActive = 0;
        this.productId = '';
        this.productService.isSearchProductHit = true;
        this.productId = this._activatedRoute.snapshot.queryParams.pid;
        this.loading = true;
        this.getProductDetail();
        this.ngOnInit();
      }
    });
    if (this._activatedRoute.snapshot.queryParams.pid) {
      this.productId = this._activatedRoute.snapshot.queryParams.pid;
    } else {
      this.router.navigateByUrl['/'];
    }
    this.getProductDetail();
  }

  ngOnInit(): void {
    this.state$ = this._activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );

    const userDetail = localStorage.getItem('UserData');
    if (userDetail) {
      this.userInfo = JSON.parse(userDetail);
    }

    this.getCountries();
    this.cartForm = this._fb.group({
      quantities: this._fb.array([]),
    });
    this.askMoreForm = this._fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      name: ['', Validators.required],
      countryCode: ['', Validators.required],
      emailId: ['', [Validators.email, Validators.required]],
      mobileNo: ['', Validators.required],
      comment: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  getCountries() {
    this.authService.getCountry().subscribe(
      (response: HttpResponse<any>) => {
        if (response.body.data != null) {
          response.body.data.forEach((element) => {
            this.codes.push({
              label: '+' + element.phoneCode,
              value: '+' + element.phoneCode,
            });
          });
        }
        return this.codes;
      },
      (error) => { }
    );
  }

  goToLogin(productName, pid) {
    localStorage.setItem('productInfo', productName);
    localStorage.setItem('productId', pid);
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}/login`]);
  }

  quantities() {
    return this.cartForm.get('quantities') as FormArray;
  }

  newQuantity(): FormGroup {
    return this._fb.group({
      quantity: 1,
    });
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  addProductToCart(index, productName?: any, productId?: any) {

    localStorage.removeItem('discount_applied');
    localStorage.removeItem('dis_id');
    this.checkService['delieveryPrice'] = 0.00;

    const userDetail = localStorage.getItem('UserData');
    if (!userDetail) {
      this.goToLogin(productName, productId);
    }
    let reqObj = {
      quantity: this.cartForm.value.quantities[index].quantity,
      productId: +this.productId,
      countryId: this.counrtyIso.getCountryId(),
      customerId: this.counrtyIso.getLoggedInCustomerId(),
      sellerId: this.productInfo.sellerId,
    };

    if (!reqObj.customerId && reqObj.customerId == 0) {
      this.authService.doLogout();
      this.goToLogin(productName, productId);
    }

    if (this.productInfo.productVariants.length) {
      reqObj.productId = this.productInfo.productVariants[index].id;
      reqObj.sellerId = this.productInfo.productVariants[index].sellerId;
    }

    if (reqObj.customerId != 0) {
      this.productService.addToCart(reqObj).subscribe(
        (response: any) => {
          this.toastr.success(response.message);
          this.cartCountService.updateCount('success');
          this.productService.getCartDetailID(this.counrtyIso.getLoggedInCustomerId()).subscribe((response: any) => {
            this.checkService.addToCartProductsDetails = response['data'];
            localStorage.setItem('order-data', JSON.stringify(response['data']));
          });
        }, (error) => {
          this.toastr.warning(error.error.message);
        }
      );
    }
  }

  openPdf() {
    window.open(this.productInfo.catelogue);
  }

  getProductDetail() {
    this.loadingObj['isProductDataLoading'] = true;
    let searchHit = document.getElementById('ais-hits');
    if (searchHit != null) {
      searchHit.style.display = 'none';
    }

    this.productService.getProductDetailId(this.productId).subscribe(
      (response: any) => {

        this.productInfo = response.data;
        let length = this.productInfo.quantityDiscounts.length - 1
        let i = 0
        for (const iterator of this.productInfo.quantityDiscounts) {
          iterator.price = Number(iterator.price)
          this.productInfo.quantityDiscounts[i].maxQuantity = '-' + this.productInfo.quantityDiscounts[i].maxQuantity
          if (i === length) {
            this.productInfo.quantityDiscounts[i].maxQuantity = 'or more'
          }
          i++
        }

        this.titleService.setTitle('Buy ' +
          this.productInfo.productName + ' Online at Best Price | Lumiere32.my');
        this.loading = false;
        /* handle cart display or out of stock display */
        if (response.data.productVariants.length == 0) {
          if (
            this.productInfo.sellerProducts[0].length == 0 ||
            !this.productInfo.sellerProducts.length
          ) {
            this.outStockDisplay = false;
            //this.toastr.info("Product is Out of Stock")
          } else if (this.productInfo.sellerProducts[0].quantity <= 0) {
            this.outStockDisplay = false;
            //this.toastr.info("Product is Out of Stock")
          }
        }
        if (response.data.productVariants.length) {
          let index = 0;
          for (var element of response.data.productVariants) {
            // response.data.productVariants.map((element, index) => {
            element.showDisplay = true;

            if (
              element.sellerProducts[0].length == 0 ||
              !element.sellerProducts.length
            ) {
              this.outStockDisplay = false;
              element.showDisplay = false;
              this.toastr.info('Product is Out of Stock');
            } else if (element.sellerProducts[0].quantity <= 0) {
              element.showDisplay = false;
              this.outStockDisplay = false;
              if (!element.isQuote)
                this.toastr.info('Product is Out of Stock..');
            }
            this.addQuantity();
            if (element.cartDetail) {
              this.quantities().controls[index].get('quantity').setValue(1);
            }
            index++;
          }
        } else {
          this.addQuantity();
          if (response.data.cartDetail) {
            this.quantities().controls[0].get('quantity').setValue(1);
          }
        }
        if (response.data.productImage.length) {
          this.productImageView = response.data.productImage[0].image;
        }
        if (response.data.productVariants.length) {
          this.showVariant = true;
        }

        setTimeout(() => {
          this.loadingObj['isProductDataLoading'] = false;
        }, 500);
      },
      (error) => {
        this.loadingObj['isProductDataLoading'] = false;
      }
    );
  }

  reloadProduct() {
    this.productService.getProductDetailId(this.productId).subscribe(
      (response: any) => {
        this.productInfo = response.data;
        this.showErrorPage = false;
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  chanageMainImage(index, image) {
    let currIndex = index;
    this.productImageView = image;
    this.productImageViewActive = index;
    this.productInfo.productImage.forEach((element, index) => {
      if (currIndex == index) {
        element.active == true;
      } else {
        element.active == false;
      }
    });
    this.cdr.detectChanges();
  }

  addQty(index, stock) {
    let valueQty: any = +this.quantities().controls[index].value.quantity;
    if (parseInt(stock) > parseInt(valueQty)) {
      this.quantities()
        .controls[index].get('quantity')
        .setValue(valueQty + 1);
    } else {
      this.toastr.warning('Max quanity reached.');
    }
  }

  removeQty(index) {
    let valueQty = +this.quantities().controls[index].value.quantity;
    if (valueQty === 0) return false;
    this.quantities()
      .controls[index].get('quantity')
      .setValue(valueQty - 1);
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
        this.userInfo['firstName'] + ' ' + this.userInfo['lastName']
      );

      //controls.countryCode.setValue(this.counrtyIso.getCountryId());
      controls.emailId.setValue(this.userInfo['Email']);
      controls.mobileNo.setValue(this.userInfo['mobileNumber']);
      controls.countryCode.patchValue(this.userInfo['countryCode'].name);
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

  askMoreFromSubmit() {
    let reqData = this.askMoreForm.value;
    if (reqData.countryCode == undefined || reqData.countryCode == 'select') {
      this.toastr.error('please select valid code first');
    }
    if (this.askMoreForm.valid) {
      this.productService.askMoreRequest(reqData).subscribe(
        (response: any) => {
          this.counrtyIso.openSweetAlert(response.message, '');
          // this.toastr.success(response.message);
          this.showAskMore = false;
          this.hideForm('');
          //   this.askMoreForm.reset();
        },
        (error) => {
          this.toastr.warning(error.error.message);
        }
      );
    } else {
      validateAllFormFields(this.askMoreForm);
    }
  }

  hideForm(e) {
    this.askMoreForm.reset();
    this.fieldDisable = false;
  }

  cartTableShow() {
    document.getElementById('cartTable').scrollIntoView({
      behavior: 'smooth',
      block: "start",
      inline: "nearest"
    })
  }
}
