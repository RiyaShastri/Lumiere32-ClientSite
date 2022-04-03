import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../../services/quotation.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BaseService } from '../../../services/base.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {
  searchQuoteNo: any;
  searchQuoteDate: any;
  constructor(private service: QuotationService,
    private toast: ToastrService,
    public baseService: BaseService,
    private router: Router, private titleService: Title, public countryISO: CountryIsoService) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.countryISO.MessageTitile.quotation);
    Promise.all([this.getQuoteTableData()])

  }

  quoteData: any = [];
  getQuoteTableData() {
    const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userDetail && userDetail['customerId']) {
      this.service.getOrderDetailsById('quotation', userDetail['customerId'])
        .subscribe((response) => {
          this.quoteData = response
          this.quoteData = this.quoteData.response.result
          console.log(this.quoteData)
        }, (error) => {
          console.log(error)
        })
    }
  }

  Search() {
    if (this.searchQuoteNo != "") {
      this.quoteData = this.quoteData.filter((res) => {
        return res.quotationNumber.includes(this.searchQuoteNo)
      })
    } else if (this.quoteData == "") {
      this.getQuoteTableData()
    }
    else if (this.searchQuoteNo == "") {
      this.getQuoteTableData()
    }
  }

  SearchDate() {
    if (this.searchQuoteDate != "") {
      this.quoteData = this.quoteData.filter((res) => {
        let dt = res
        let dat = new Date(dt.quotationDate).toISOString().slice(0, 10).split("-").reverse().join("-");
        return dat.includes(this.searchQuoteDate)
      })
    } else if (this.quoteData == "") {
      this.getQuoteTableData()
    }
    else if (this.searchQuoteDate == "") {
      this.getQuoteTableData()
    }
  }
  downloadPDF(id) {
    this.service.downloadPDFFromService(id)
      .subscribe((response) => {
        console.log("response for download pdf", response)
      }, (error) => {
        this.toast.error('Not able to download the pdf')
        console.log(error)
      })
  }

  encodedId(id) {

    return btoa(id);
  }
  getSingleQuoteDetail(id) {
    this.router.navigate([`${this.countryISO.getCountryCode()}/user/quotation-detail/${id}`])
    // this.router.navigate(['quotation-detail/' + id])
  }
}
