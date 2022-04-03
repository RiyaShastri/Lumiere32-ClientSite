import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import data from '../../../../../assets/data.json'
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  materialSlides: any;
  instrumentSlides: any;
  consumables: any;
  qbdSlides: any;
  loadingObj = {};
  trendingSlides = [
    {
      img: "assets/images/dentist.svg",
      text: 'Instruments',
      class: 'trending-card-blue',
      id: 3
    },
    {
      img: "assets/images/medical-aids.svg",
      text: 'Materials',
      class: 'trending-card-yellow',
      id: 4
    },
    {
      img: "assets/images/hospital.svg",
      text: 'Consumables',
      class: 'trending-card-pink',
      id: 1
    },
    {
      img: "assets/images/medical-devices.svg",
      text: 'Equipment',
      class: 'trending-card-green',
      id: 2
    }
    // {
    //   img: "assets/images/medical-aids.svg",
    //   text: 'Medical Aids',
    //   class: 'trending-card-yellow'
    // }
  ];
  featureSlides = [
    // {
    //   img: "assets/images/featured/techinasia.svg",
    //   url_val: "https://www.techinasia.com/startups-shaking-singapores-dental-industry"
    // },
    // {
    //   img: "assets/images/featured/e27.svg",
    //   url_val: "https://e27.co/thirteen-companies-pitched-seamless-asia-singapore-breakdown-20170420/"
    // },
    {
      img: "assets/images/featured/cropped-Health-Matters-Logo.png",
      url_val: "https://www.healthmatters.com.my/medical-supplies-distribution-platform-lumiere32-enters-malaysia-to-fully-digitalise-the-local-medical-supply-procurement-process/"
    },
    {
      img: "assets/images/featured/header_logo_20th-sp.png",
      url_val: "https://www.businesstoday.com.my/2021/10/28/lumiere32-to-digitalise-the-medical-supply-procurement-process/"
    },
    {
      img: "assets/images/featured/mashable.svg",
      url_val: "https://sea.mashable.com/culture/10340/5-singaporean-companies-that-are-playing-a-crucial-role-in-keeping-coronavirus-at-bay"
    },
    {
      img: "assets/images/featured/vulcan.svg",
      url_val: "https://vulcanpost.com/699985/lumiere32-medical-supplies-singapore/"
    },
  ];
  customerSlides = [
    {
      text: `"Lumiere32 responses toward our incessant requests for quotations and products had always been marvelous. In fact, they have provided several recommendations that served us even better than the products we were previously using."`,
      img: 'assets/images/customer-image.svg',
      name: 'Dr Andrew'
    },
    {
      text: `"The delivery was quick and hassle-free. The advantage over the traditional over the phone order is that one can browse for alternative products and the prices are listed for comparison. There is no surprise and no pressure from sales-persons."`,
      img: 'assets/images/customer-image.svg',
      name: 'Dr Li'
    }
  ];
  slideConfig1 = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 7000,
  }
  customerSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "nextArrow": '<i class="fa fa-long-arrow-right"></i>',
    "prevArrow": '<i class="fa fa-long-arrow-left"></i>',
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 3000,
  };
  featureSlideConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 5,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    // "nextArrow": '<i class="fa fa-chevron-right"></i>'
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1008,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }

    ]
  };
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
  };
  slideTrendingConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "margin": 10,
    // "nextArrow": '<i class="fa fa-chevron-right"></i>'
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1008,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 800,
        settings: "unslick"
      }

    ]
  };
  dentalCategoryData: any = [];
  // slides = [
  //   {
  //     img: "assets/images/home-slider-image.png",
  //   },
  //   {
  //     img: "https://lumier32.s3.ap-southeast-1.amazonaws.com/banner/1603928494419_Capture.PNG",
  //   },
  //   {
  //     img: "assets/images/1kerr.png",
  //   },
  //   {
  //     img: "assets/images/2kerr.png",
  //   }
  // ];

  slides = [
    {
      img: "assets/images/kerr.png",
    },
    {
      img: "assets/images/1kerr.png",
    },
    {
      img: "assets/images/2kerr.png",
    },
    {
      img: "assets/images/dentalbanner.png",
    }
  ];
  slidess: any;
  productSlideConfig = {
    slidesToShow: 4,
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
  shopSlideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    margin: 10,
    nextArrow: '<i class="fa fa-chevron-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left"></i>',
    dots: false,
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
  shopslides: any;

  navigateSignUp() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/register`])
  }
  naviagateToMainPage(name, id) {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/c/${name}`], { queryParams: { 'cid': id } })
  }
  navigateToPay32() {
    window.location.href = "https://www.pay32clinic.com/"
  }
  navigateToFeatureURL(myurl: string) {
    window.open(myurl, '_blank');
    // window.location.href = myurl
  }

  constructor(private router: Router,
    public service: UserService,
    private titleservice: Title,
    public authService: AuthService,
    private countryIso: CountryIsoService,
  ) {
    this.getCategoriesBanner();
    this.getBrandThumbnails()
  }

  navigateToPage(parent, name, id) {
    this.router.navigate(
      [`/${this.countryIso.getCountryCode()}/sc/${parent}/${name}`],
      { queryParams: { cid: id } }
    );
  }

  navigateToViewAll(parent, id) {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/c/${parent}`], {
      queryParams: { cid: id },
    });
  }

  navigateToViewAllQBD(parent, id) {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/c/${parent}`], {
      queryParams: { cid: undefined, isQuantityDiscount: true },
    });
  }

  navigateToBrands() {
    this.router.navigateByUrl('/my/brands')
  }

  ngOnInit(): void {
    localStorage.removeItem('detailPage');
    this.titleservice.setTitle(this.countryIso.MessageTitile.landingPage)
    Promise.all([this.getBanner()])
    this.countryIso.allCountries = data.allCountries
  }

  navigateToMaterial(item, id) {
    this.router.navigate(
      [
        `/${this.countryIso.getCountryCode()}/p/${item
          .split('+')
          .join('-')
          .split('(')
          .join('-')
          .split(')')
          .join('-')
          .split('/')
          .join('-')
          .replace(/ |_/g, '-')}`,
      ],
      { queryParams: { pid: id } }
    );
  }

  goToLogin(productName, pid) {
    localStorage.setItem('productInfo', productName);
    localStorage.setItem('productId', pid);
    this.router.navigate([`/${this.countryIso.getCountryCode()}/login`]);
  }

  ngOnDestroy() {
    this.titleservice.setTitle(this.countryIso.MessageTitile.defaultTitle)
  }
  navigateToAboutUs() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/about-us`])
  }

  navigateToDental1() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/c/Consumables`], { queryParams: { cid: 1 } })
  }

  navigateToDental2() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/corporate`])
    // this.router.navigate([`/${this.countryIso.getCountryCode()}/c/Instruments`],{queryParams:{cid:3}})
  }

  getBanner() {
    this.service.getBannerImageAndDetails(this.countryIso.getCountryId())
      .subscribe((response) => {
        console.log(response)
        this.slidess = response
        this.slidess = this.slidess.data;
        this.slidess = this.slidess.filter(o => o.position == "Main");
      }, (error) => {
        console.log(error)
      })
  }

  dental() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/dental`])
  }

  medical() {
    this.router.navigate([`/${this.countryIso.getCountryCode()}/medical`])
  }

  routePay32() {
    if (this.authService.loginFlag) {
      this.router.navigate([`/${this.countryIso.getCountryCode()}/my-wallet`])
    } else {
      this.authService.routePay32 = true
      this.router.navigate([`/${this.countryIso.getCountryCode()}/login`])
      if (this.authService.loginFlag) {
        this.router.navigate([`/${this.countryIso.getCountryCode()}/my-wallet`])
      }
    }
  }

  // newly added for landing page LCD-877
  // getBanner() {
  //   this.service
  //     .getBannerImageAndDetails(this.countryIso.getCountryId())
  //     .subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.slidess = response;
  //         this.slidess = this.slidess.data;

  //         this.slidess = this.slidess.filter(
  //           (o) =>
  //             o.position == 'Inner Page' &&
  //             o.adminStatus == 1 &&
  //             o.isDelete == 0
  //         );
  //         console.log(this.slidess, 'landing page response');
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }

  getCategoriesBanner() {
    this.loadingObj['slides'] = true;
    this.service.getDentalBanner().subscribe(
      (response) => {
        this.dentalCategoryData = response;
        this.dentalCategoryData = this.dentalCategoryData.data;
        console.log('banner dental response', this.dentalCategoryData);
        let cloneMaterials: any = { ...this.dentalCategoryData };
        this.qbdSlides = cloneMaterials.qbd
        this.materialSlides = cloneMaterials.materials;
        this.instrumentSlides = cloneMaterials.instruments;
        this.consumables = cloneMaterials.consumables;
        console.log('only materials', this.materialSlides);
        // setTimeout(() => {
        this.loadingObj['slides'] = false;
        // }, 3000);
      },
      (error) => {
        this.loadingObj['slides'] = false;
        console.log('error in dental banner', error);
      }
    );
  }

  getBrandThumbnails() {
    this.loadingObj['brandSlides'] = true;
    this.service.getDetailsShopByBrand().subscribe((response) => {
      this.shopslides = response;
      this.shopslides = this.shopslides.data.results;
      console.log('response...', this.shopslides);
      // setTimeout(() => {
      this.loadingObj['brandSlides'] = false;
      // }, 4000);
    }, (err) => { this.loadingObj['brandSlides'] = false; });
  }

  navigateToCategiry(value, brandname) {
    console.log(value);
    let data = {
      manufactureId: value,
    };
    brandname = brandname.trim();
    // brandname = brandname.replace(/\s+/g, '-').toLowerCase();
    brandname = brandname.replace('-', ' ').split(' ').map(this.capitalize).join(' ');
    this.router.navigate(
      [`/${this.countryIso.getCountryCode()}/brand/${brandname}`],
      {
        queryParams: data,
      }
    );
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
