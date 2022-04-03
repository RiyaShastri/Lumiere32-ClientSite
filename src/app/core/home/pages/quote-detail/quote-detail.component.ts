import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {QuotationService} from '../../../services/quotation.service';
import {CountryIsoService} from '../../../services/country-iso.service'
@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {
  quoteId:any;
  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private service:QuotationService,
    private countryIso : CountryIsoService
  ) { 
   this.quoteId =  this.route.snapshot.paramMap.get("id")
   console.log(this.quoteId);
  
  }
  quoteData:any;
  quotationProducts:any;
  GST:any
  TOTAL_QUOTE_AMOUNT:any
  getQuoteDetail(id){
    this.service.getSingleOrderDetailsById(id)
    .subscribe((response)=>{
     this.quoteData = response;
     this.quoteData = this.quoteData.data
     this.quotationProducts = this.quoteData.quotationProducts;
     console.log("quote data...", this.quoteData)
     console.log("quote product data",this.quotationProducts)
   
     this.GST =  this.countryIso.getCountryTax()
     this.GST = parseFloat(this.GST)
    
     let price:any = parseFloat(this.quoteData.total).toFixed(2)
    
     let taxamount :any = price * this.GST /100
     
     taxamount = parseFloat(taxamount)
    
     this.TOTAL_QUOTE_AMOUNT = parseFloat(price) + parseFloat(taxamount)
     this.TOTAL_QUOTE_AMOUNT = parseFloat(this.TOTAL_QUOTE_AMOUNT).toFixed(2)
     
   
    },(error)=>{
      console.log(error)
    })

  }
  ngOnInit(): void {
    this.getQuoteDetail(this.quoteId)
  }
  back(){
    this.router.navigate([`${this.countryIso.getCountryCode()}/user/quotations`])
  }
}
