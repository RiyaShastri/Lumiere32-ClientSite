import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderSummaryService } from '../../../services/order-summary.service';
import { ToastrService } from 'ngx-toastr';
import { CountryIsoService } from '../../../services/country-iso.service';
import { UserService } from '../../../services/user.service';
import { BaseService } from '../../../services/base.service';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderID: any;
  constructor(
    private service: OrderSummaryService,
    private router: Router,
    public userService: UserService,
    public countryIso: CountryIsoService,
    private toastr: ToastrService,
    private baseService: BaseService,
    private route: ActivatedRoute) {
    this.orderID = this.route.snapshot.paramMap.get("id")
    this.getOrderData()
  }

  ngOnInit(): void {
    this.countryIso.breadcrum = this.orderID
  }

  customerOrderData: any;
  productData: any = [];
  productDataCancelled: any = [];
  cancelUserData: any = [];
  outOfStockUserData: any = [];
  refundUserData: any = [];
  cancelTableDisplay: boolean = false;
  outOfStockTableDisplay: boolean = false;
  refundTableDisplay: boolean = false;
  showCancelOption: boolean = true;
  copyProductData: any

  fetchOrderProductsData() {

    for (const item of this.customerOrderData) {
      console.log(item)
      item.orderProducts.forEach((elem) => {
        console.log(elem)
        this.productData.push(elem)
      })
    }

    let data: any = [...this.productData];
    this.productDataCancelled = this.productData.filter(o => o.orderProductStatus === "Cancelled");
    if (this.customerOrderData[0].cancelOrder) {
      for (let x of this.customerOrderData[0].cancelOrder) {
        for (let y of x.orderProducts) {
          this.cancelUserData.push(y);
        }
      }
    }
    if (this.customerOrderData[0].backOrder) {
      for (let x of this.customerOrderData[0].backOrder) {
        for (let y of x.orderProducts) {
          this.outOfStockUserData.push(y);
        }
      }
    }
    if (this.customerOrderData[0].orderRefunds) {
      for (let x of this.customerOrderData[0].orderRefunds) {
        this.refundUserData.push(x);
      }
    }
    if (this.cancelUserData.length >= 1) {
      this.cancelTableDisplay = true
    }
    if (this.outOfStockUserData.length >= 1) {
      this.outOfStockTableDisplay = true
    }
    if (this.refundUserData.length >= 1) {
      this.refundTableDisplay = true
    }
  }

  getOrderData() {
    this.service.getOrderDetailsById(this.orderID)
      .subscribe((response) => {
        this.customerOrderData = response
        this.customerOrderData = this.customerOrderData.response.fetch_cutomer_order_data
        this.fetchOrderProductsData()
        console.log(this.customerOrderData)
      }, (error) => {
        console.log(error)
      })
  }

  /* cancel logic to enable the check box */
  productStatus: any = [
    { status: "Cancelled" }
  ]
  userChangeProductStatusTo: any;
  cancelDisplay: boolean = false;
  cancelDisplayContorl() {
    if (this.cancelDisplay == false) {
      this.cancelDisplay = true
    } else {
      this.cancelDisplay = false
    }
  }

  /* user select check box below function will trigger */
  isActive: any;

  cancellingProduct(item, data) {
    let dt: any = [...this.customerOrderData]
    dt = this.customerOrderData[0].orderProducts.filter(o => o.orderProductStatus === "In Stock")
    let arr: any = []
    dt.map((elem) => {
      arr.push(elem.total)
    })
    let sum = arr.reduce((a, b) => a + b)
    this.customerOrderData[0].orderTransactions[0].productTotal = sum
    this.customerOrderData[0].orderTransactions[0].totalAmountWithTax = Number(sum) + ((parseFloat(this.customerOrderData[0].orderTransactions[0].productTotal)
      * parseFloat(this.customerOrderData[0].orderTransactions[0].tax)) / 100) + parseFloat(this.customerOrderData[0].orderTransactions[0].delieveryCharge)
    console.log(this.customerOrderData[0].orderTransactions[0].totalAmountWithTax)
    this.customerOrderData[0].orderTransactions[0].taxAmount = (Number(sum) * parseFloat(this.customerOrderData[0].orderTransactions[0].tax) / 100);
  }

  updateOrder() {

    let cancelArr = this.customerOrderData[0].orderProducts.filter(o => o.orderProductStatus == "Cancelled")
    if (cancelArr.length > 0) {
      let cancelTaxAmount = this.calculateTax(cancelArr, parseFloat(this.customerOrderData[0].orderTransactions[0].tax))
      console.log("tax cancel amount is", cancelTaxAmount);
      this.refundAmount(cancelTaxAmount)
    }
    let data = {
      orderDetails: {
        Email: this.customerOrderData[0].Email,
        mobileNumber: this.customerOrderData[0].mobileNumber,
        billingClinicName: this.customerOrderData[0].billingClinicName,
        billingPostcode: this.customerOrderData[0].billingPostcode,
        billingBuildingName: this.customerOrderData[0].billingBuildingName,
        billingBlockNo: this.customerOrderData[0].billingBlockNo,
        billingFloorNo: this.customerOrderData[0].billingFloorNo,
        billingUnitNo: this.customerOrderData[0].billingUnitNo,
        billingStreetName: this.customerOrderData[0].billingStreetName,
        customerId: this.customerOrderData[0].customerId,
        customerName: this.customerOrderData[0].customerName,
        // shippingClinicName:this.paymentService.shippingAddress.shippingClinicName,
        // shippingBuildingName:this.paymentService.shippingAddress.shippingBuildingName,
        // shippingBlockNo:this.paymentService.shippingAddress.shippingBlockNo,
        // shippingFloorNo:this.paymentService.shippingAddress.shippingFloorNo,
        // shippingUnitNo:this.paymentService.shippingAddress.shippingUnitNo,
        // shippingStreetName:this.paymentService.shippingAddress.shippingStreetName,
        // shippingCountry:this.countryName,
        country: this.customerOrderData[0].country,
        countryid: this.customerOrderData[0].countryid,
        // shippingPostcode: this.paymentService.shippingAddress.shippingPostcode,
        orderDate: this.customerOrderData[0].orderDate,
        orderNo: this.customerOrderData[0].orderNo
      },
      productData: this.customerOrderData[0].orderProducts,
      walletPayment: {
        listOfProductIds: this.customerOrderData[0].orderTransactions[0].listOfProductIds,
        productTotal: this.customerOrderData[0].orderTransactions[0].productTotal,
        totalAmountWithTax: this.customerOrderData[0].orderTransactions[0].totalAmountWithTax || 0,
        tax: this.customerOrderData[0].orderTransactions[0].tax,
        taxCode: this.customerOrderData[0].orderTransactions[0].taxCode,
        delieveryType: this.customerOrderData[0].orderTransactions[0].delieveryType,
        delieveryCharge: this.customerOrderData[0].orderTransactions[0].delieveryCharge,
        taxAmount: (this.customerOrderData[0].orderTransactions[0].taxAmount &&
          this.customerOrderData[0].orderTransactions[0].taxAmount != 'NaN') ?
          this.customerOrderData[0].orderTransactions[0].taxAmount : 0,
        card: this.card,
        wallet: this.wallet,
        cod: this.cod
      }
    }
    console.log("dddd", data);

    this.service.updateOrder(data, this.orderID)
      .subscribe((response) => {
        this.toastr.success("Order udpated successfully.")
        window.location.reload();
        // console.log(response)

      }, (error) => {
        console.log(error)
      })

  }


  calculateTax = (arr, tax) => {
    var productTotal = arr.reduce(function (prev, cur) {
      return prev + cur.total;
    }, 0);

    let totalAmountWithTax = productTotal * tax / 100;
    totalAmountWithTax = totalAmountWithTax + productTotal
    return totalAmountWithTax;
  }

  card: any;
  cod: any;
  wallet: any;
  refundAmount = (cancelTax) => {
    console.log("cancel ", cancelTax)
    this.card = parseFloat(this.customerOrderData[0].orderTransactions[0].methodOfPayment.card)
    this.wallet = parseFloat(this.customerOrderData[0].orderTransactions[0].methodOfPayment.wallet)

    if (parseFloat(this.wallet) >= parseFloat(this.card)) {
      if (parseFloat(this.wallet) <= parseFloat(cancelTax)) {
        let difference = cancelTax - parseFloat(this.wallet)
        this.card = parseFloat(this.card) - difference
        this.card = this.card //+ parseFloat(this.orderData.delieveryCharge)
        this.wallet = 0
        //return this.computeData;
      } if (parseFloat(this.wallet) >= parseFloat(cancelTax)) {
        this.wallet = parseFloat(this.wallet) - parseFloat(cancelTax)
        this.wallet = this.wallet //+ parseFloat(this.orderData.delieveryCharge)
        //return this.computeData
      }
    } else {
      if (parseFloat(this.card) <= parseFloat(cancelTax)) {
        let difference = cancelTax - parseFloat(this.card)
        this.wallet = parseFloat(this.wallet) - difference
        this.wallet = this.wallet //+ parseFloat(this.orderData.delieveryCharge)
        this.card = 0
        //return this.computeData;
      }
      if (parseFloat(this.card) >= parseFloat(cancelTax)) {
        this.card = parseFloat(this.card) - parseFloat(cancelTax)
        console.log(this.card, "card ...")
        this.card = this.card //+ parseFloat(this.orderData.delieveryCharge)
        console.log(this.card, "....")
        console.log("enter")
        //return this.computeData
      }
    }
  }

  codPay(id) {
    var encodedId = btoa(id)
    var navLink = `${this.baseService.baseUrlRaw}paynow/` + encodedId

    window.open(navLink, '_blank');


  }
  downloadInvoice(id) {
    this.service.downloadInvoice(id)
  }


}
