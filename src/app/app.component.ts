import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryIsoService } from './core/services/country-iso.service';
import { ToastrService } from 'ngx-toastr';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import data from '../assets/data.json';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = this.counrtyIso.title;
  codec = new HttpUrlEncodingCodec();

  //allCountryData =[{"id":44,"itemName":"Australia","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"au","tax":[],"deliveryCharge":[]},{"id":43,"itemName":"Netherlands Antilles","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"kl","tax":[],"deliveryCharge":[]},{"id":41,"itemName":"United Kingdom","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"1234","tax":[],"deliveryCharge":[{"id":82,"title":"2 days delivery","noOfdays":"2","minimumOrderAmount":"20.00","deliveryCharge":"10.00","countryId":41,"currency":"Rupiah - IDR","adminStatus":1,"isDelete":0,"created_at":"2021-02-01T02:01:01.528Z","updated_at":"2021-02-01T02:01:01.528Z","instructions":null,"currencyId":2}]},{"id":40,"itemName":"Tuvalu","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"tv","tax":[],"deliveryCharge":[]},{"id":39,"itemName":"India","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"in","tax":[],"deliveryCharge":[]},{"id":38,"itemName":"Singapore","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"sg","tax":[{"id":7,"taxCode":"gst","taxRate":"5.00","countryId":38},{"id":5,"taxCode":"GST1","taxRate":"7.00","countryId":38}],"deliveryCharge":[{"id":77,"title":"Standard Delivery","noOfdays":"5","minimumOrderAmount":"70.00","deliveryCharge":"3.50","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-10T09:08:01.732Z","updated_at":"2020-09-10T09:08:01.732Z","instructions":"Standard delivery free for orders more than $70","currencyId":1},{"id":79,"title":"Next Day","noOfdays":"1","minimumOrderAmount":"10.00","deliveryCharge":"10.00","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-17T19:04:01.243Z","updated_at":"2020-09-17T19:04:01.243Z","instructions":"item will be delivered next day ","currencyId":1},{"id":78,"title":"Same Day","noOfdays":"1","minimumOrderAmount":"0.00","deliveryCharge":"5.00","countryId":38,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-09-10T09:08:27.100Z","updated_at":"2020-09-10T09:08:27.100Z","instructions":"Get next day","currencyId":1}]},{"id":37,"itemName":"Yugoslavia","languages":[{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"yu","tax":[],"deliveryCharge":[]},{"id":36,"itemName":"Zimbabwe","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"}],"alphaCode":"zw","tax":[],"deliveryCharge":[]},{"id":32,"itemName":"Zambia","languages":[{"id":1,"itemName":"Malay","languageType":"Regional"}],"alphaCode":"zm","tax":[],"deliveryCharge":[]},{"id":30,"itemName":"Uruguay","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"uy","tax":[],"deliveryCharge":[]},{"id":28,"itemName":"United States","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"us","tax":[],"deliveryCharge":[{"id":64,"title":"arihant","noOfdays":"2","minimumOrderAmount":"100.00","deliveryCharge":"50.00","countryId":28,"currency":"2","adminStatus":1,"isDelete":0,"created_at":"2020-07-31T08:02:06.471Z","updated_at":"2020-07-31T08:02:06.471Z","instructions":null,"currencyId":null},{"id":70,"title":"New Deilvery Charge","noOfdays":"30","minimumOrderAmount":"1000.00","deliveryCharge":"20000.00","countryId":28,"currency":"Singapore Dollar","adminStatus":1,"isDelete":0,"created_at":"2020-08-05T04:57:58.128Z","updated_at":"2020-08-05T04:57:58.128Z","instructions":"asd","currencyId":null},{"id":73,"title":"asd","noOfdays":"12","minimumOrderAmount":"1111.00","deliveryCharge":"123.00","countryId":28,"currency":"Singapore Dollar - SGD","adminStatus":1,"isDelete":0,"created_at":"2020-08-06T11:38:23.489Z","updated_at":"2020-08-06T11:38:23.489Z","instructions":"asd","currencyId":null}]},{"id":26,"itemName":"Vietnam","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"vn","tax":[],"deliveryCharge":[]},{"id":1,"itemName":"Malaysia","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"my","tax":[{"id":3,"taxCode":"GST","taxRate":"6.00","countryId":1}],"deliveryCharge":[{"id":61,"title":"2","noOfdays":"2","minimumOrderAmount":"2.00","deliveryCharge":"2.00","countryId":1,"currency":"1","adminStatus":1,"isDelete":0,"created_at":"2020-07-31T07:43:14.308Z","updated_at":"2020-07-31T07:43:14.308Z","instructions":null,"currencyId":null},{"id":71,"title":"New Charge","noOfdays":"30","minimumOrderAmount":"200.00","deliveryCharge":"1000.00","countryId":1,"currency":"Singapore Dollar","adminStatus":1,"isDelete":0,"created_at":"2020-08-05T05:05:01.940Z","updated_at":"2020-08-05T05:05:01.940Z","instructions":"test","currencyId":null}]},{"id":24,"itemName":"Yemen","languages":[{"id":4,"itemName":"Vietnamese","languageType":"Regional"},{"id":3,"itemName":"English","languageType":"Regional"}],"alphaCode":"ye","tax":[],"deliveryCharge":[]}]
  allCountryData = data.allCountries;
  countryCode: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private counrtyIso: CountryIsoService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('country', JSON.stringify(this.allCountryData));
    }
    // this.getCountries();
    this.countryCode = this._router.url;
    $(window).bind('beforeunload', function () {
      localStorage.removeItem("detailPageSite")
      localStorage.removeItem("detailPage")
    });
  }

  ngOnInit() {
    //  this.getCountries()
    //  if(!localStorage.getItem('token')){
    //    this.router.navigate([""])
    //  }
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'keywords', content: 'Angular, Universal, Example' },
      { name: 'description', content: 'Angular Universal Example' },
      { name: 'robots', content: 'index, follow' },
    ]);
  }

  getCountries() {
    this.counrtyIso.getCountriesList().subscribe(
      (response: any) => {
        localStorage.setItem('country_me', JSON.stringify(response.data));
        //  this.counrtyIso.getSelectedCountryObject(this._router.url.split('/')[1])
      },
      (error) => {
        this.toastr.error(error.error.message);
        if (error.status == 401) {
          this._router.navigate([`/${this.counrtyIso.getCountryCode()}/login`]);
        }
      }
    );
  }
  // ngEncode(param: string){
  //   return this.codec.encodeValue(param);
  // }
}
