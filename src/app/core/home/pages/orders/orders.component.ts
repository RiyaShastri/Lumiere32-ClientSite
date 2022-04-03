import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { OrderSummaryService } from '../../../services/order-summary.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  CUSTID;
  message;
  orderStatus;
  statusSelectByUser;
  customerOrderData;
  page = 0;
  limit = 10;
  searchByOrder;
  loadDisplay = true;
  searchByInput

  constructor(
    public service: UserService,
    private orderSummaryService: OrderSummaryService,
    private router: Router,
    private titleService: Title,
    private countryIso: CountryIsoService
  ) {
    const UserDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    this.CUSTID = UserDetail['customerId'];
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.countryIso.MessageTitile.orders);
    Promise.all([this.getOrderDataByCustomer(), this.getAllOrderStatus()])
  }

  getAllOrderStatus() {
    this.orderSummaryService.getOrderStatus()
      .subscribe((response) => {
        this.orderStatus = response;
        this.orderStatus = this.orderStatus.data
      }, (error) => {
        console.log(error)
      })
  }

  loadMore() {
    //searchByInput
    this.limit = this.limit + 2
    this.getOrderDataByCustomer()
  }

  getOrderDataByCustomer() {
    this.orderSummaryService.getOrderDetailsByCustomer(this.CUSTID, this.limit)
      .subscribe((response) => {
        this.customerOrderData = response
        this.customerOrderData = this.customerOrderData.response.fetch_cutomer_order_data.results
        if (this.customerOrderData.length > 0) {
          this.message = "Load More"
        }
      }, (error) => {
        console.log(error)
      })
  }

  fetchOrderDetail(id) {
    this.router.navigate([`${this.countryIso.getCountryCode()}/user/orders/${id}`])
  }

  Search() {
    if (this.searchByOrder != "") {
      this.customerOrderData = this.customerOrderData.filter((res) => {
        return res.orderNo.includes(this.searchByOrder)
      })
    } else if (this.searchByOrder == "") {
      this.getOrderDataByCustomer()
    }
  }

  orderStatusSelectByUser(data) {
    this.searchByInput = null;
    this.loadDisplay = false;
    console.log(data)
    this.searchByOrder = data;
    this.filterOrder(`&orderStatus=`)
  }

  clearFilter() {
    this.searchByInput = null;
    this.loadDisplay = true;
    this.searchByOrder = null;
    this.getOrderDataByCustomer(), this.getAllOrderStatus()
  }

  filterOrder(qry) {
    this.searchByOrder = this.searchByOrder.replace(/ /g, "")
    qry = `${qry}${this.searchByOrder}`
    console.log("query is..", qry)
    this.subscribeSearchOrderService(qry)
  }

  filterByOrderId(qry) {
    this.loadDisplay = false;
    this.searchByOrder = null;
    this.searchByInput = this.searchByInput.replace(/ /g, "")
    qry = `${qry}${this.searchByInput}`
    console.log("query is..", qry)
    this.subscribeSearchOrderService(qry)
  }

  subscribeSearchOrderService(qry) {
    this.orderSummaryService.filterOrderForCustomer(this.CUSTID, qry)
      .subscribe((response) => {
        this.customerOrderData = response
        this.customerOrderData = this.customerOrderData.response.fetch_result_based_on_query
      }, (error) => {
        console.log(error)
      })
  }

  cancelOrder(item) {
    let data = {
      orderDetails: {
        Email: item.Email,
        mobileNumber: item.mobileNumber,
        billingClinicName: item.billingClinicName,
        billingPostcode: item.billingPostcode,
        billingBuildingName: item.billingBuildingName,
        billingBlockNo: item.billingBlockNo,
        billingFloorNo: item.billingFloorNo,
        billingUnitNo: item.billingUnitNo,
        billingStreetName: item.billingStreetName,
        customerId: item.customerId,
        customerName: item.customerName,
        shippingClinicName: item.shippingClinicName,
        shippingBuildingName: item.shippingBuildingName,
        shippingBlockNo: item.shippingBlockNo,
        shippingFloorNo: item.shippingFloorNo,
        shippingUnitNo: item.shippingUnitNo,
        shippingStreetName: item.shippingStreetName,
        shippingCountry: item.shippingCountry,
        country: item.shippingCountryId,
        //      paymenttype:paymenttype,
        countryid: item.countryid,
        shippingPostcode: item.shippingPostcode,
        orderDate: item.orderDate
      },
      productData: item.orderProducts,
      walletPayment: {
        listOfProductIds: JSON.stringify(item.orderTransactions[0].listOfProductIds),
        productTotal: item.orderTransactions[0].productTotal,
        totalAmountWithTax: item.orderTransactions[0].totalAmountWithTax,
        tax: item.orderTransactions[0].tax,
        taxCode: item.orderTransactions[0].taxCode,
        delieveryType: item.orderTransactions[0].delieveryType,
        delieveryCharge: item.orderTransactions[0].delieveryCharge,
        userpreference: "not mentioned",
        card: item.orderTransactions[0].methodOfPayment.card,
        wallet: item.orderTransactions[0].methodOfPayment.wallet,
        cod: item.orderTransactions[0].methodOfPayment.cod
      }
    }
    console.log(item)
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to cancel order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel the order!',
      cancelButtonText: 'No, keep the order safe'
    }).then((result) => {
      if (result.value) {

        this.orderSummaryService.cancelOrder(item.orderId, data)
          .subscribe((response) => {
            Promise.all([this.getOrderDataByCustomer(), this.getAllOrderStatus()])
          }, (error) => { console.log(error) })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Order is safe :)',
          'error'
        )
      }
    })



  }

  downloadInvoice(id) {
    this.orderSummaryService.downloadInvoice(id)
  }

}
