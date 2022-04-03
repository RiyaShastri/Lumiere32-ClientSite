import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { CountryIsoService } from './country-iso.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  TAXAMOUNT: any;
  deliveryDisplay: boolean = true;
  carddisplay: boolean = true;
  addMoneyDisplay: boolean = true;
  payLaterIconDisplay: boolean = false;
  addToCartProductsDetails: any;
  dueDate: any = null;
  toastMessage: any;
  servicePayLaterBalance: any;
  numberVerified: boolean = false;
  userPayOption: any;
  userCardPayOption: any;
  userWalletPayOption: any;
  saveCardForUser: boolean;
  card: any = {};
  token: any;
  selectPaymentCard: any
  selectedCreditCard: any
  cardselected: boolean = true;
  cardVerify: boolean;
  cod: any;
  promoDiscountid: any;
  paymenttype: any;
  active4 = new BehaviorSubject<boolean>(false);
  activeStep2: boolean;
  activeStep3: boolean;
  activeStep4: boolean;
  activeStep5: boolean;
  cardPayAmount: any = '';
  minimumOrderAmount: number;
  alldeliveryData: any;
  isDefaultDeliverySelected: any;
  billingAddress: any = {};
  userBillingAddress: any = {};
  creditToken: any;
  delieveryAddress: any;
  cardPayment: any;
  throughWallet: any;
  throughPaylater: any;
  checkoutOrder: any;
  orderTotal: any;
  orderTotalWithoutTax: any;
  walletBalance: any;
  useWallet: boolean;
  orderProductByCustomer: any;
  userSelectDelieverAddress: any;
  orderStatusComments: any;
  delieveryType: any;
  delieveryPrice: number;
  delieverData: any;
  del: any;
  newAddress: any = {};
  orderData: any = {
    orderDetails: {},
    productData: {},
    walletPayment: {},
  };
  countryModel: any;
  customerId: any;
  dialogDisplay: boolean = false;
  editCount = 0;
  editButtonDisplay = 'Add New Address';
  payLaterBalance: any;
  //http://175.41.182.101/
  taxData: any;
  shippingMobileNo: any;
  countryMapIsAlpha = new Map();
  countryMinLenMap = new Map();
  countryMaxLenMap = new Map();
  private _unsubscribe = new Subject<boolean>();

  deliveryZipMaxLength: number
  deliveryZipMinLength: number
  deliveryZipIsAlpha: boolean = false
  billingZipMaxLength: number
  billingZipMinLength: number
  billingZipIsAlpha: boolean = false

  private ipay88FormValue = new BehaviorSubject(false);
  ipay88Status = this.ipay88FormValue.asObservable();

  productTotalAmount;

  constructor(
    private http: HttpClient,
    private router: Router,
    private baseService: BaseService,
    private countryIso: CountryIsoService
  ) { }

  changeipay88Status(message) {
    this.ipay88FormValue.next(message);
  }

  verifyCard(body) {
    return this.http
      .post(`${this.baseService.baseUrlRaw}card_validator`, body)
      .pipe(catchError(this.handleError));
  }
  allCards: any;
  getAllSavedCards(id) {
    let url = 'http://175.41.182.101/api/v1/listPaymentMethods?customerId=';
    return this.http
      .get(`${this.baseService.baseUrlRaw}listPaymentMethods?customerId=${id}`)
      .pipe(catchError(this.handleError));
  }
  promoApplied: boolean = false;
  promoDiscount: any;

  getPromoOffer(code, custid, total) {
    let url = 'http://175.41.182.101/api/v1/listPaymentMethods?customerId=';
    return this.http
      .get(
        this.baseService.baseUrlRaw +
        `applyPromotionOffers?code=${code}&customerId=${custid}&total=${total}`
      )
      .pipe(catchError(this.handleError));
  }
  /* coupon used */
  couponUsedByCustomer(body) {
    let url = 'http://175.41.182.101/api/v1/listPaymentMethods?customerId=';
    return this.http
      .post(
        this.baseService.baseUrl +
        `${this.countryIso.getLoggedInCustomerId()}/couponCodeUsed`,
        body
      )
      .pipe(catchError(this.handleError));
  }
  /* wallet adjustment */
  walletAdjustment(id, body) {
    let url = 'http://localhost:3000/api/v1/customer/' + id + '/wallet';
    return this.http.post(this.baseService.baseUrl + id + '/wallet', body).pipe(
      // return this.http.post(url,body).pipe(
      catchError(this.handleError)
    );
  }
  /* this fuction will fetch wallet and pay laterb alance */
  fetchWalletPayLaterBalance(id) {
    return this.http
      .get(this.baseService.baseUrlAdmin + 'customerAllWallet/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  deductWallet(id, body) {
    return this.http
      .post(this.baseService.baseUrl + `${id}/wallet`, body)
      .pipe(catchError(this.handleError));
  }
  /* pay-pal integration in transaction table */
  paymentTransactionDetailsInDB(body) {
    return this.http
      .post(this.baseService.baseUrl + 'create-transaction', body)
      .pipe(
        catchError(this.handleError)
      );
  }
  deductStock(body) {
    return this.http
      .post(this.baseService.baseUrl + `orders/deduct-stock`, body)
      .pipe(catchError(this.handleError));
  }

  setActiveStep(value: boolean) {
    this.activeStep4 = value;
  }
  getQuoteForUser(body) {
    return this.http
      .post(this.baseService.baseUrlRaw + 'customer/quotation', body)
      .pipe(catchError(this.handleError));
  }

  userMobileNumber: any;
  userVerifiedDisplay: boolean = true;
  varifyMobileNumber(body) {
    return this.http
      .post(this.baseService.baseUrlAdmin + 'verify-number', body)
      .pipe(catchError(this.handleError));
  }

  verifynumberOfCustomerSaveInDb(id, body) {
    return this.http
      .post(`${this.baseService.baseUrl} ${id}/shippingMobileVerifyOTP`, body)
      .pipe(catchError(this.handleError));
  }
  paymentThroughCard(body) {
    return this.http
      .post(this.baseService.baseUrlRaw + 'stripe/checkouts', body)
      .pipe(catchError(this.handleError));
  }
  getBrainTreeToken() {
    return this.http
      .get(`${this.baseService.baseUrlRaw}client_token`)
      .pipe(catchError(this.handleError));
  }

  placeCustomerOrder(body, type, dis_id) {
    return this.http
      .post(this.baseService.baseUrlRaw +
        `order/checkout?orderBy=online&paymentType=${type}&promotionOffersId=${dis_id}`, body);
  }

  placeCustomePayPalrOrder(body) {
    return (
      this.http
        .post(
          this.baseService.baseUrl + `orders/insert-order?orderBy=online`,
          body
        ).pipe(catchError(this.handleError))
    );
  }
  getCountry() {
    return this.http
      .get(this.baseService.baseUrlAdmin + 'country')
      .pipe(catchError(this.handleError));
  }

  rollbackOrderForCustomer(id) {
    return this.http
      .post(this.baseService.baseUrlRaw + `order-rollback?orderId=${id}`, null)
      .pipe(catchError(this.handleError));
  }
  saveNewDelieverAddress(body) {
    return this.http
      .post(this.baseService.baseUrl + 'address', body)
      .pipe(catchError(this.handleError));
  }
  id: any;
  updateExistingDelieveryAddress(id, body) {
    return this.http
      .put(this.baseService.baseUrl + 'update/delievery-address/' + id, body)
      .pipe(catchError(this.handleError));
  }
  getAllUserAddress(id) {
    return this.http
      .get(this.baseService.baseUrl + 'user/address/?user=' + id)
      .pipe(catchError(this.handleError));
  }

  getOrderDetailsWRTCustomerID(id) {
    return this.http
      .get(this.baseService.baseUrl + 'cart?customerId=' + id)
      .pipe(catchError(this.handleError));
  }

  getDeliveryTypes(id) {
    return this.http
      .get(this.baseService.baseUrlAdmin + 'deliveryChargeDetail/' + id)
      .pipe(catchError(this.handleError));
  }

  getWalletDetails(id) {
    return this.http
      .get(this.baseService.baseUrl + 'detail/' + id)
      .pipe(catchError(this.handleError));
  }

  emptyCart(id) {
    return this.http
      .get(this.baseService.baseUrl + 'delete-cart/' + id)
      .pipe(catchError(this.handleError));
  }

  updateBillingAddress(data) {
    return this.http
      .put(this.baseService.baseUrl + `update`, data)
      .pipe(catchError(this.handleError));
  }
  findFelieveryForCountry() {
    let delivery_data: any = JSON.parse(localStorage.getItem('country'));
    this.delieverData = delivery_data.find(
      (o) => o.alphaCode == this.countryIso.getCountryCode()
    );
    this.delieverData = this.delieverData.deliveryCharge;
    this.delieveryPrice = parseFloat(this.delieverData[0].deliveryCharge);

    this.minimumOrderAmount = parseFloat(
      this.delieverData[0].minimumOrderAmount
    );

    this.del = this.delieverData[0].id;
    this.del = this.del.toString();
    this.delieveryPriceForUser.push(this.delieverData[0].deliveryCharge);
  }
  delieveryPriceForUser: any = [];

  getDelieveryData = () =>
    new Promise((resolve, reject) => {
      this.getDeliveryTypes(this.countryIso.getCountryId()).subscribe(
        (response: any) => {
          this.alldeliveryData = response.data.Detail;
          this.delieverData =
            response.data.Detail && response.data.Detail.length > 1
              ? response.data.Detail.filter((f) => f.isDefault)
              : response.data.Detail;
          //orderTotal
          this.delieveryPrice = parseFloat(this.delieverData[0].deliveryCharge);
          this.delieveryType = parseFloat(this.delieverData[0].id);
          this.del = this.delieverData[0].id;
          this.del = this.del.toString();
          this.delieveryPriceForUser.push(this.delieverData[0].deliveryCharge);
          this.minimumOrderAmount = parseFloat(
            this.delieverData[0].minimumOrderAmount
          );
          this.isDefaultDeliverySelected = this.delieverData[0]
            .isDefault as Boolean;
          resolve(200);
        },
        (error) => {
          this.router.navigate([`/${this.countryIso.getCountryCode()}/login`]);
          reject(error);
        }
      );
    });
  getUserAddress() {
    this.getAllUserAddress(this.customerId).subscribe(
      (response) => {
        this.delieveryAddress = response;
        this.delieveryAddress = this.delieveryAddress.data.result;
        this.checkDefaultAddress();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // to get saved bank payment details
  getPaymentDetails(custId: any) {
    return this.http
      .get(`${this.baseService.baseUrlRaw}stripe/listCards/${custId}`)
      .pipe(catchError(this.handleError));
  }

  // to delete bank payment details
  deletePaymentDetails = (obj: any) => {
    return this.http
      .post(`${this.baseService.baseUrlRaw}stripe/deleteCard/`, obj)
      .pipe(catchError(this.handleError));
  };

  checkDefaultAddress() {
    let data = this.delieveryAddress.filter(
      (o) => o.isDefault == 'Yes' || o.isDefault == 'Yes'
    );
    if (data.length > 0) {
      this.userSelectDelieverAddress = data[0].id;
      this.userSelectDelieverAddress = this.userSelectDelieverAddress.toString();
      this.orderData.orderDetails.customerId = data[0].customerId;
      this.orderData.orderDetails.customerName = data[0].name;
      this.orderData.orderDetails.shippingClinicName = data[0].clinicName;
      this.orderData.orderDetails.shippingBuildingName = data[0].buildingName;
      this.orderData.orderDetails.shippingBlockNo = data[0].blockNo;
      this.orderData.orderDetails.shippingFloorNo = data[0].floorNo;
      this.orderData.orderDetails.shippingUnitNo = data[0].unitNo;
      this.orderData.orderDetails.shippingStreetName = data[0].streetName;
      this.orderData.orderDetails.shippingCountry = data[0].country;
      this.orderData.orderDetails.shippingCountryId = data[0].id;
      this.orderData.orderDetails.shippingPostcode = parseInt(data[0].zip);
      this.orderData.orderDetails.orderDate = new Date();
    } else if (data.length == 0) {
      this.userSelectDelieverAddress = this.delieveryAddress[0]['id'] || null;
      this.userSelectDelieverAddress = this.userSelectDelieverAddress.toString();
      this.orderData.orderDetails.customerId =
        this.delieveryAddress[0].customerId;
      this.orderData.orderDetails.customerName = this.delieveryAddress[0].name;
      this.orderData.orderDetails.shippingClinicName =
        this.delieveryAddress[0].clinicName;
      this.orderData.orderDetails.shippingBuildingName =
        this.delieveryAddress[0].buildingName;
      this.orderData.orderDetails.shippingBlockNo =
        this.delieveryAddress[0].blockNo;
      this.orderData.orderDetails.shippingFloorNo =
        this.delieveryAddress[0].floorNo;
      this.orderData.orderDetails.shippingUnitNo =
        this.delieveryAddress[0].unitNo;
      this.orderData.orderDetails.shippingStreetName =
        this.delieveryAddress[0].streetName;
      this.orderData.orderDetails.shippingCountry =
        this.delieveryAddress[0].country;
      this.orderData.orderDetails.shippingCountryId =
        this.delieveryAddress[0].id;
      this.orderData.orderDetails.shippingPostcode = parseInt(this.delieveryAddress[0].zip);
      this.orderData.orderDetails.shippingState =
        this.delieveryAddress[0].state;
      this.orderData.orderDetails.orderDate = new Date();
    }
    this.checkPinCode(this.orderData.orderDetails.shippingPostcode);
  }

  async checkPinCode(pinCode) {

    this.calculateDeliveryCharge(pinCode).toPromise().then(async res => {
      const data = res['data'];
      this.delieveryPrice = Number(data['deliveryCharge'] || 0);
      await this.calculateTotalAmount();
    }).catch(err => { });

  }

  calculateTotalAmount() {

    return new Promise((resolve, reject) => {
      const allOrderData = JSON.parse(localStorage.getItem('order-data'));
      let arr = [];
      if (!allOrderData || Object.keys(allOrderData).length == 0 ||
        !this.taxData || Object.keys(this.taxData).length === 0) {
        return;
      }

      allOrderData.forEach((elem) => {
        arr.push(elem.total);
      });

      let orderTotal = arr.reduce(function (a, b) { return a + b; });
      // console.info("orderTotal", orderTotal);
      this.productTotalAmount = Number(orderTotal).toFixed(2);

      //order total
      this.orderTotalWithoutTax = Number(orderTotal).toFixed(2);
      this.orderTotal = Number(orderTotal).toFixed(2);

      //order total with discount if applied
      if (this.promoDiscount ||
        localStorage.getItem('discount_applied')) {
        let discount: any = localStorage.getItem('discount_applied');
        let bytes = CryptoJS.AES.decrypt(discount, `${this.countryIso.getKey()}`);
        let originalText: any = bytes.toString(CryptoJS.enc.Utf8);

        this.promoDiscount = parseFloat(originalText);
        if (orderTotal >= parseFloat(this.promoDiscount)) {
          this.orderTotal = Number(Number(orderTotal) - Number(this.promoDiscount)).toFixed(2);
        } else {
          this.orderTotal = Number(orderTotal).toFixed(2);
        }
      }

      this.orderTotal = Number(Number(this.orderTotal) + Number(this.delieveryPrice || 0));

      //tax amount
      let taxAmount: any = (Number(this.orderTotal) * parseFloat(this.taxData['taxRate'])) / 100;
      this.TAXAMOUNT = parseFloat(taxAmount).toFixed(2);

      //order total with tax amount
      this.orderTotal = Number(Number(this.orderTotal) + Number(taxAmount)).toFixed(2);
      resolve(200);
    });

  }

  deleteUserDelieverAddress(id) {
    return this.http
      .delete(this.baseService.baseUrl + 'address/delete/' + id)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`
      );
      errorMessage = error.error.message || error.message;
    }
    return throwError(error);
  }

  getIpay88Btn(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Accept', 'text/xml');

    return this.http
      .post(this.baseService.baseUrlRaw + 'iPay88New', body, {
        headers: headers,
        responseType: 'text'
      }).pipe(catchError(this.handleError));
  }

  // Populate maps based on country Id parameters 
  getCountryInfo() {
    return new Promise((resolve, reject) => {
      const newArray = [];
      this.countryIso.getCountriesList().pipe(takeUntil(this._unsubscribe)).subscribe(
        (success: any) => {
          if (success.data != []) {
            success.data.forEach((element) => {
              newArray.push({
                isAlpha: element.countries.isAlpha,
                id: element.id,
                max_length: element.countries.pncodeLength,
                min_length: element.countries.minpncodeLength,
              });
            }),
              newArray.forEach((element) => {
                this.countryMapIsAlpha.set(element.id, element.isAlpha);
                this.countryMaxLenMap.set(element.id, element.max_length);
                this.countryMinLenMap.set(element.id, element.min_length);
              }),
              this.billingZipMinLength = this.countryMinLenMap.get(this.userBillingAddress.country)
            this.billingZipMaxLength = this.countryMaxLenMap.get(this.userBillingAddress.country)
            this.billingZipIsAlpha = this.countryMapIsAlpha.get(this.userBillingAddress.country);
          }
          resolve(200);
        }, (error) => { resolve(200); });
    });
  }

  validateIsAlpha(pincode) {
    if (pincode.toString().match(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/))
      return true;
    else
      return false;
  }


  calculateDeliveryCharge(pinCode) {
    const countryId = window.localStorage.getItem('country_id');
    const userDetail = (window.localStorage.getItem('UserData')) ? JSON.parse(window.localStorage.getItem('UserData')) : null;
    if (countryId && pinCode && userDetail && userDetail['customerId']) {
      return this.http
        .get(this.baseService.baseUrlCountry + 'getDeliveryCharge?countryId=' + countryId + '&postCode=' + pinCode + '&customerId=' + userDetail['customerId'])
        .pipe(catchError(this.handleError));
    }
  }

  /// ==================== NEW PAYMENT MODULE APIS START ==========================

  proceedToPayment(reqObj) {
    return this.http.post(this.baseService.baseUrlRaw + '/order/newCheckOut', reqObj)
      .pipe(catchError(this.handleError));
  }

  getAllPaymentMode(countryId, pageType) {
    return this.http.get(this.baseService.baseUrlCountry + 'getAllPaymentMode?countryId=' + countryId + '&type=' + pageType)
      .pipe(catchError(this.handleError));
  }

  getOrderDetails(orderId) {
    return this.http.get(this.baseService.baseUrlAdmin + 'get-order-details/customer/' + orderId)
      .pipe(catchError(this.handleError));
  }

  commonPayment(reqObj, discountId) {
    return this.http.post(this.baseService.baseUrlRaw + 'commonPayment?orderBy=online&promotionOffersId=' + discountId, reqObj)
      .pipe(catchError(this.handleError));
  }

  /// ==================== NEW PAYMENT MODULE APIS END ============================









}
