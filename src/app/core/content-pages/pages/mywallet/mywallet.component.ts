import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BrowserModule, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-mywallet',
  templateUrl: './mywallet.component.html',
  styleUrls: ['./mywallet.component.scss']
})
export class MywalletComponent implements OnInit {

  walletOptions = [{ name: 'My Wallet' }];
  currentDate;
  userFilterDate = "07";
  endDate
  dateType = null
  chartData;
  datesArrayForChart = []
  spentArrayForChart = []
  saveArrayForChart = []
  filterByDates = [
    { name: "Last 7 Days", value: "07", dateType: null },
    { name: "Last 30 Days", value: "30", dateType: null },
    { name: "Last 6 Months", value: "180", dateType: "month" },
    { name: "Last 12 Months", value: "365", dateType: "month" }
  ]
  userReqFilterForGraph = "07";
  dashResponse;
  display = false
  typeSelect = 'Wallet'
  CustomerId
  userOrderFilter;
  selectedvalue;

  constructor(
    public service: UserService,
    private title: Title,
    private router: Router,
    private countryIso: CountryIsoService) {

    this.currentDate = new Date()
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;

    if (!userDetail) {
      this.router.navigate([`${this.countryIso.getCountryCode()}/login`])
    } else {
      this.getDate(this.currentDate)
      this.viewTable(this.walletOptions[0].name)
      this.CustomerId = userDetail['customerId'];
      this.calMonthOrDate(this.userFilterDate)
    }
  }

  getDate(dt) {
    //this.currentDate = dt.getDate() + '-' +  dt.getMonth() + 1 + '-' + dt.getFullYear()
    let month: any = parseInt(dt.getMonth()) + 1
    if (month < 10) {
      month = '0' + month.toString()
    }
    this.currentDate = dt.getFullYear() + '-' + month + '-' + dt.getDate()
  }

  calMonthOrDate(filterDate) {
    let dt: any = new Date(Date.now() - parseInt(filterDate) * 24 * 60 * 60 * 1000)
    let month: any = parseInt(dt.getMonth() + 1)
    if (month < 10) {
      month = '0' + month.toString()
    }
    // this.endDate = dt.getDate() + '-' +  parseInt(dt.getMonth() + 1)  + '-' + dt.getFullYear()
    this.endDate = dt.getFullYear() + '-' + month + '-' + dt.getDate()
  }

  ngOnDestroy() {
    this.title.setTitle('Lumiere32')
  }

  controlChartDays(event) {
    this.datesArrayForChart = [];
    this.saveArrayForChart = [];
    this.spentArrayForChart = []
    console.log("user selected", event)
    if (event == 180) {
      this.dateType = 'month'
    }
    if (event == 365) {
      this.dateType = 'month'
    }
    this.userFilterDate = event
    this.calMonthOrDate(this.userFilterDate);
    this.getChartData(this.currentDate, this.endDate, this.dateType)
    //this.showChart()
    //userFilterDate
  }

  getChartData(startDate, endDate, dateType) {
    this.chartData = [];
    this.datesArrayForChart = []
    this.spentArrayForChart = []
    this.saveArrayForChart = []

    this.service.getChartData(this.CustomerId, this.typeSelect, startDate, endDate, dateType)
      .subscribe((response) => {
        this.chartData = response;
        this.chartData = this.chartData.data.wallet

        for (var item in this.chartData) {
          console.log("i", this.chartData[item])
          this.datesArrayForChart.push(this.chartData[item].sdate)
          this.spentArrayForChart.push(this.chartData[item].spent)
          if (this.typeSelect == 'Wallet') {

            this.saveArrayForChart.push(this.chartData[item].savings)
          }
        }
        this.showChart()
      }, (error) => {
        this.router.navigate([`${this.countryIso.getCountryCode()}/login`])
      })
  }

  calculateDate(userFilterDate) {
    let curr = new Date
    let week = []

    for (let i = 1; i <= userFilterDate; i++) {
      let first = curr.getDate() - curr.getDay() + i
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      week.push(day)
    }
  }

  showChart() {
    var walletLegend = [{
      label: '#spent',
      backgroundColor: "#1b4791",
      data: this.spentArrayForChart,

    }, {
      label: '#savings',
      data: this.saveArrayForChart,
      backgroundColor: "#63c7db",

    }]
    var BNPLLegend = [{
      label: '#spent',
      backgroundColor: "#1b4791",
      data: this.spentArrayForChart,

    }]
    var myLegends = this.typeSelect == 'Wallet' ? walletLegend : BNPLLegend;

    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: this.datesArrayForChart,
        datasets: myLegends
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

  ngOnInit(): void {
    Promise.all([this.getChartData(this.currentDate, this.endDate, this.dateType), this.getUserData(this.typeSelect)])
    this.title.setTitle(this.countryIso.MessageTitile.pay32);
  }

  getUserData(typeSelect) {
    this.service.getDashboardDetails(this.CustomerId, typeSelect)
      .subscribe((response) => {
        this.dashResponse = response
        this.dashResponse = this.dashResponse.data
        console.log(this.dashResponse)
        this.display = true
      }, (error) => {
        console.log(error)
        this.router.navigate([`${this.countryIso.getCountryCode()}/login`]);
      })
  }

  filterTable() {
    this.dashResponse = this.dashResponse.walletTxn.results.filter((res) => {
      return res.order.match(this.userOrderFilter);
    })
  }

  viewTable(item) {
    this.selectedvalue = item;
    if (item == 'Pay Later') {
      this.typeSelect = 'PAY32-BNPL';
      // this.controlChartDays(30)
      Promise.all([this.getChartData(this.currentDate, this.endDate, this.dateType), this.getUserData(this.typeSelect)])
    } else if (item == 'My Wallet') {
      this.typeSelect = 'Wallet'
      Promise.all([this.getChartData(this.currentDate, this.endDate, this.dateType), this.getUserData(this.typeSelect)])
    }
    else if (item == 'Working Capital') {
      this.typeSelect = 'Working Capital'
      Promise.all([this.getChartData(this.currentDate, this.endDate, this.dateType), this.getUserData(this.typeSelect)])
    }
  }

  navigateToContactUs() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/contact-us`])
  }

  navigateToAddMoney() {
    // this.router.navigate([`/${this.countryIso.getCountryCode()}/add-money`])
    this.router.navigate([`/${this.countryIso.getCountryCode()}/pay32/top-up`])
  }
}
