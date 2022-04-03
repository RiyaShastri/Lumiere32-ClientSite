import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ProductsService } from 'src/app/core/services/products.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { CartCountService } from '../../../services/cart-count.service';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { UserService } from '../../../services/user.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})

export class AddToCartComponent implements OnInit {

  CartDetails;
  cartForm: FormGroup;
  selectedCartItems;
  customerDetail;
  customerId;
  couponCode = null;
  loadingObj = {
    isProductDataLoading: true
  };
  allConditions = {
    clickMark: false,
    clickMarkAll: false,
    codeDisplay: true,
    isClickedAddToCart: false,
    quoteDisplay: true,
    isPriceDetailDisplay: true,
    proceedToPayAccess: true,
  };
  totalAmount: number;
  totalAmountAfterDiscount: number;
  productId;
  outStockArray = [];
  paymentStep = {
    verifyMobile: false,
    billingAddress: false,
    deliveryAddress: false,
    payment: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private title: Title,
    public userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    public checkService: CheckoutService,
    private countryISO: CountryIsoService,
    private cartCountService: CartCountService) {
    this.checkService.promoDiscount = 0
  }

  ngOnDestroy() {
    this.title.setTitle('Lumiere32');
  }

  async ngOnInit() {

    localStorage.removeItem('discount_applied');
    localStorage.removeItem('dis_id');
    this.checkService['delieveryPrice'] = 0.00;

    this.title.setTitle(this.countryISO['MessageTitile']['cart']);

    this.checkService.activeStep4 = false;
    this.checkService.activeStep5 = false;
    this.checkService.activeStep3 = false;

    this.cartForm = this.formBuilder.group({
      quantities: this.formBuilder.array([])
    });

    const userData = localStorage.getItem('UserData');
    if (userData) {
      this.customerDetail = JSON.parse(userData);
      this.customerId = this.customerDetail['customerId'];
    } else {
      this.CartDetails = [];
      this.allConditions['isPriceDetailDisplay'] = false;
    }
    await this.getCartDetail();
  }

  quantities() {
    return this.cartForm.get("quantities") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.formBuilder.group({
      quantity: []
    })
  }

  getCartDetail() {
    return new Promise((resolve, reject) => {
      this.loadingObj['isProductDataLoading'] = true;
      this.productService.getCartDetailID(this.customerId).subscribe((response: any) => {
        for (const iterator of response['data']) {
          iterator.orderQtyDiscText = null;
        }
        this.checkService.addToCartProductsDetails = response['data'];
        this.CartDetails = response['data'];
        localStorage.setItem('order-data', JSON.stringify(this.CartDetails));
        this.checkOutOfStock();

        if (this.CartDetails && this.CartDetails.length >= 1) {
          this.allConditions['isPriceDetailDisplay'] = true;
        } else {
          this.allConditions['quoteDisplay'] = false;
          this.allConditions['isPriceDetailDisplay'] = false;
          this.CartDetails = [];
          this.cartCountService.updateCount('success');
        }
        if (this.CartDetails.length > 0) {
          let total = 0;
          this.CartDetails.forEach((element, index) => {
            this.quantities().push(this.newQuantity());
            this.productId = element.productId;
            total += element.total;
            this.totalAmount = total;
            this.totalAmountAfterDiscount = this.totalAmount;
            this.quantities().controls[index].get('quantity').setValue(element.quantity);
          });
          // setTimeout(() => {
          this.loadingObj['isProductDataLoading'] = false;
          // }, 3000);
        }
        this.getQtyDisc();
        resolve(200);
      }, (error) => {
        this.loadingObj['isProductDataLoading'] = false;
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
        }
        resolve(200);
      })
    });
  }

  checkOutOfStock() {
    if (this.CartDetails.length == 0) {
      this.toastr.show('No Item in Cart');
      return
    }
    for (let item of this.CartDetails) {
      item.quantityDisplay = true;
      if (item.product.sellerProducts[0]['quantity'] <= 0) {
        this.outStockArray.push(item);
        item.quantityDisplay = false;
        this.allConditions['proceedToPayAccess'] = false;
        this.toastr.show(item.product.productName + " " + "is out of stock");
      }
    }
    return this.allConditions['proceedToPayAccess'];
  }

  outOfStockRemoveBtn(id) {
    let arr = []
    arr.push(id)
    this.productService.deleteRow(arr).subscribe(async (response: any) => {
      if (response) {
        this.removeOffer();
        this.cartCountService.updateCount('success');
        this.allConditions['proceedToPayAccess'] = true;
        this.outStockArray = [];
        this.toastr.success("Product deleted successfully!");
        await this.getCartDetail();
      }
    }, error => { });
  }

  getQtyDisc() {
    let prodArr = this.CartDetails;
    for (const iterator of prodArr) {
      if (iterator['productQuantityDiscount']) {
        let i = 0;
        let addQty: any;
        let discount;
        for (const item of iterator['productQuantityDiscount']) {
          if (item.minQuantity >= iterator.quantity && item.maxQuantity >= iterator.quantity) {
            if (i < iterator.productQuantityDiscount.length) {
              if (Number(iterator.productQuantityDiscount[i]['minQuantity']) >= Number(iterator.quantity)) {
                addQty = Number(iterator.productQuantityDiscount[i]['minQuantity']) - Number(iterator.quantity);
              } else {
                addQty = Number(iterator.productQuantityDiscount[i]['minQuantity']);
              }
              discount = iterator.productQuantityDiscount[i]['price'];
              if (addQty !== 0) {
                discount = parseInt(discount);
                iterator.orderQtyDiscText = 'Buy ' + addQty + ' more to get ' + discount + '%' + ' discount';
              }
            }
          }
          i++
          if (iterator.orderQtyDiscText && addQty !== 0) {
            break;
          }
        }
      }
    }
  }

  addToCartBtnClick(index) {
    this.allConditions['isClickedAddToCart'] = true;
    let reqObj = {
      quantity: this.cartForm.value.quantities[index]['quantity'],
      productId: +this.productId,
      countryId: this.countryISO.getCountryId(),
      customerId: this.customerId,
      sellerId: this.CartDetails[index]['product']['sellerId']
    }
    if (this.CartDetails.length) {
      reqObj.productId = this.CartDetails[index]['productId'];
    }

    this.productService.addToCart(reqObj).subscribe(async (response: any) => {
      this.removeOffer();
      this.toastr.success(response.message);
      this.cartCountService.updateCount('success');
      await this.getCartDetail();
      this.allConditions['isClickedAddToCart'] = false;
    }, (error) => {
      this.toastr.warning(error.error.message);
      if (error.status == 401) {
        this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
      } else if (error.status == 400) {
        this.quantities().reset();
        this.removeOffer();
        this.CartDetails = [];
        this.allConditions['isClickedAddToCart'] = false;
        this.getCartDetail();
      }
    })
  }

  addQty(index, stock) {
    let valueQty: any = +this.quantities().controls[index]['value']['quantity'];
    if (parseInt(stock) > parseInt(valueQty)) {
      this.quantities().controls[index].get('quantity').setValue(valueQty + 1);
      this.removeOffer();
    } else {
      this.toastr.warning("Max quantity reached.");
    }
  }

  removeQty(id, index) {
    let valueQty = +this.quantities().controls[index]['value']['quantity'];
    this.quantities().controls[index].get('quantity').setValue(valueQty - 1);
    let curQuantity = this.quantities().controls[index]['value']['quantity'];
    if (curQuantity <= 0) {

      let itemIDs = [];
      itemIDs.push(id);

      this.confirmationService.confirm({
        key: 'confirm-drop-database',
        message: 'Are you sure, you want to remove this item from cart?',
        accept: () => {
          this.productService.deleteRow(itemIDs).subscribe((response: any) => {
            this.toastr.success("Product deleted from cart");
            this.getCartDetail();
            this.cartCountService.updateCount('success');
            this.removeOffer();
          }, error => {
            if (error.status == 401) {
              this.router.navigate([`/${this.countryISO.getCountryCode()}/login`])
            }
          })
        },
        reject: () => {
          this.quantities().controls[index].get('quantity').setValue(1);
        }
      });
    }
  }

  changeQuantity(index) {
    if (parseInt(this.quantities().controls[index]['value']['quantity']) < 0) {
      this.quantities().controls[index].get('quantity').setValue(0);
      this.removeOffer();
    }
  }

  openProductDetail(item) {
    if (item.parentId !== null) {
      return `/${this.countryISO.getCountryCode()}/p/${item.productName.replace(/[^a-zA-Z0-9_-]/g, '')}` + `?pid=${item.parentId}`;
    }
    else {
      return `/${this.countryISO.getCountryCode()}/p/${item.productName.replace(/[^a-zA-Z0-9_-]/g, '')}` + `?pid=${item.id}`;
    }
  }

  // Select Cart Item Code start =================================================
  getCheckedItemList() {
    this.selectedCartItems = [];
    this.CartDetails.forEach(element => {
      if (element.isSelected) {
        this.selectedCartItems.push(element.id);
      }
    });
  }

  clickMarkOption(type) {
    this.selectedCartItems = [];
    if (type === 'single') {
      this.allConditions['clickMark'] = true;
      this.allConditions['clickMarkAll'] = false;
      this.markedItem(false, 'single');
    } else {
      this.markedItem(true, 'all');
      this.allConditions['clickMarkAll'] = true;
      this.allConditions['clickMark'] = false;
    }
  }

  markedItem(isMarkedAll, type) {
    this.CartDetails.forEach(element => {
      element.isSelected = isMarkedAll;
      if (type === 'all') {
        this.selectedCartItems.push(element.id);
      }
    });
  }

  markClickEvent(id, event, index) {
    if (event.target.checked) {
      if (this.selectedCartItems instanceof Array) {
        this.selectedCartItems.push(id);
      } else {
        this.selectedCartItems = [id];
      }
    } else {
      this.selectedCartItems = this.selectedCartItems.filter((ele) => {
        return ele != id;
      });
    }

    if (this.allConditions['clickMark']) {
      // single selection
      this.CartDetails.forEach((item: any, i) => {
        if (i == index) {
          item.isSelected = event.target.checked;
        }
      });
    }
  }

  removeProduct() {
    if (this.selectedCartItems && this.selectedCartItems.length > 0) {
      this.productService.deleteRow(this.selectedCartItems).subscribe(async (response: any) => {
        if (response) {
          this.selectedCartItems = [];
          this.allConditions['clickMark'] = false;
          this.allConditions['clickMarkAll'] = false;
          this.cartCountService.updateCount('success');
          this.removeOffer();
          this.CartDetails = [];
          await this.getCartDetail();
          this.toastr.success("Product deleted from cart");
        }
      }, error => { })
    } else {
      this.toastr.info("Please select at least one item to delete");
    }
  }

  // Select Cart Item Code End =================================================

  applyOffer() {
    this.checkService.getPromoOffer(this.couponCode, this.customerId, this.totalAmount)
      .subscribe((response) => {
        if (response) {
          if (response['statusCode']) {
            this.toastr.info(response['message']);
          } else {
            this.checkService.promoDiscount = parseFloat(response['data']['discount_applied']);
            this.checkService.promoDiscountid = response['data']['id'];
            this.checkService.promoApplied = true;

            if (Number(this.totalAmount) >= Number(this.checkService.promoDiscount)) {
              this.totalAmountAfterDiscount = Number(this.totalAmount) - Number(this.checkService.promoDiscount);
            } else {
              this.totalAmountAfterDiscount = Number(this.totalAmount);
            }
            this.allConditions['codeDisplay'] = false;
            this.toastr.success('Promo Code applied successfully.');
          }
        }
      }, (error) => {
        this.toastr.show(error['error']['message']);
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        }
      });
  }

  removeOffer() {
    this.totalAmountAfterDiscount = Number(this.totalAmountAfterDiscount) + Number(this.checkService.promoDiscount);
    this.couponCode = null;
    this.checkService['promoDiscount'] = 0;
    this.allConditions['codeDisplay'] = true;
  }

  proceedPayment() {
    if (this.outStockArray && this.outStockArray.length > 0) {
      return
    }
    if (this.CartDetails && this.CartDetails.length === 0) {
      this.toastr.show("Cart can not be empty");
    } else {
      localStorage.setItem('order-data', JSON.stringify(this.CartDetails));
      this.checkService['orderData']['orderDetails'] = this.CartDetails;
      this.checkService.checkoutOrder = this.CartDetails;
      this.checkService.shippingMobileNo = this.customerDetail['shippingMobileNo'];

      let discount: any = this.checkService['promoDiscount'].toString();
      var ciphertext = CryptoJS.AES.encrypt(discount, `${this.countryISO.getKey()}`).toString();
      localStorage.setItem('discount_applied', ciphertext);
      localStorage.setItem('dis_id', this.checkService['promoDiscountid']);

      this.router.navigate([`/${this.countryISO.getCountryCode()}/checkout-order`],
        { queryParams: { customer: this.customerDetail['firstName'], customerid: this.customerId } });
    }
  }

  getQuote() {
    this.allConditions['quoteDisplay'] = false;
    let productDetail: any = [];
    let sums = 0;

    for (const item in this.CartDetails) {

      sums = sums + Number(this.CartDetails[item].total);

      productDetail.push({
        productId: this.CartDetails[item].productId,
        sellerId: this.CartDetails[item].sellerId,
        productName: this.CartDetails[item].product.productName,
        PNCDE: this.CartDetails[item].product.PNCDE,
        quantity: this.CartDetails[item].quantity,
        price: this.CartDetails[item].product.MRP,
        totalPrice: this.CartDetails[item].total
      })
    }

    let data = {
      customerId: this.CartDetails[0]['customerId'],
      quotationDate: new Date(),
      quotationStatus: "new",
      countryId: this.CartDetails[0]['countryId'],
      customerName: this.customerDetail['firstName'],
      customerEmail: this.customerDetail['Email'],
      customerMobileNumber: this.customerDetail['mobileNumber'],
      shippingClinicName: this.customerDetail['clinicName'],
      shippingBuildingName: this.customerDetail['shippingBuildingName'] || null,
      shippingBlockNo: this.customerDetail['shippingBlockNo'] || null,
      shippingFloorNo: this.customerDetail['shippingFloorNo'] || null,
      shippingUnitNo: this.customerDetail['shippingUnitNo'] || null,
      shippingStreetName: this.customerDetail['shippingStreetName'] || null,
      shippingPincode: this.customerDetail['shippingPincode'] || null,
      billingClinicName: this.customerDetail['clinicName'] || null,
      billingBuildingName: this.customerDetail['buildingName'] || null,
      billingBlockNo: this.customerDetail['houseNo'] || null,
      billingFloorNo: this.customerDetail['floorNo'] || null,
      billingUnitNo: this.customerDetail['unitNo'] || null,
      billingStreetName: this.customerDetail['streetName'] || null,
      billingPincode: this.customerDetail['pincode'] || null,
      billingState: this.customerDetail['state'] || null,
      subTotal: sums,
      total: sums,
      quotationProducts: productDetail
    }

    this.checkService.getQuoteForUser(data)
      .subscribe((response) => {
        if (response) {
          this.toastr.success(response['message']);
          let showMessage = "Our executive will reach out to you";
          this.router.navigate([`/${this.countryISO.getCountryCode()}/thank-you`], { state: { message: showMessage } });
        }
      }, (error) => {
        if (error.status == 401) {
          this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
        }
      })
  }

}
