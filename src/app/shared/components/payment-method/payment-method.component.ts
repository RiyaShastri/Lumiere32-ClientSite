import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/core/services/checkout.service';
import { CountryIsoService } from '../../../core/services/country-iso.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {

  panleExpanded = true;
  isLoading = false;
  customerId;
  listOfProducts = [];

  constructor(
    public checkoutService: CheckoutService,
    public userService: UserService,
    public countryISO: CountryIsoService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userData) {
      this.customerId = userData['customerId'];
      this.getOrderDataForCustomer();
    }
  }

  proceedToPay() {
    this.isLoading = true;
    const requestData = {
      customerId: this.customerId,
      productData: this.listOfProducts,
    }
    this.checkoutService.proceedToPayment(requestData).toPromise().then((response) => {
      if (response) {
        const orderId = response['data']['orderId'];
        this.router.navigate([`/${this.countryISO.getCountryCode()}/payment`],
          { queryParams: { type: 'order', typeId: orderId } });
        this.isLoading = false;
      }
    }).catch((error) => { this.isLoading = false; });

  }

  getOrderDataForCustomer() {
    return new Promise((resolve, reject) => {
      this.checkoutService.getOrderDetailsWRTCustomerID(this.customerId).subscribe(
        (response) => {
          if (response && response['data'] && response['data'].length > 0) {
            this.checkoutService['orderProductByCustomer'] = response['data'];

            response['data'].forEach((elem) => {
              this.listOfProducts.push(
                {
                  quantity: elem['quantity'],
                  price: parseFloat(elem['product']['MRP']).toFixed(2),
                  total: elem['total'],
                  discount: 0,
                  productId: elem['product']['id'],
                  orderProductStatus: 'In Stock',
                  productName: elem['product']['productName'],
                  sellerId: elem['product']['sellerId'],
                  sellerName: elem['product']['sellerProducts'][0]['sellerDetail']['sellerName'],
                  sellerfee: elem['product']['sellerProducts'][0]['sellerFee'],
                  pncode: elem['product']['PNCDE']
                }
              );
            });
            resolve(200);
          }
        }, (error) => {
          resolve(200);
          if (error.status == 401) {
            this.router.navigate([`/${this.countryISO.getCountryCode()}/login`]);
          }
        }
      );
    });
  }

}
