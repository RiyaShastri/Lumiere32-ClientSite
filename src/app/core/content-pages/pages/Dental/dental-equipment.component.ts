import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  Input,
  Output,
} from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { FBFilterComponent } from '../../../vertical-filter-bar/fb-filter-component.interface';
import { ShowMoreModalComponent } from '../../../vertical-filter-bar/checkbox-filter/show-more-modal/show-more-modal.component';
import { Router } from '@angular/router';
import { CountryIsoService } from '../../../services/country-iso.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dental-equipment',
  templateUrl: './dental-equipment.component.html',
  styleUrls: ['./dental-equipment.component.scss'],
  providers: [NgbProgressbarConfig],
})
export class DentalEquipmentComponent implements OnInit {
  @Output()
  public change: EventEmitter<string[]> = new EventEmitter();

  @ViewChild(ShowMoreModalComponent)
  public showMoreModal: ShowMoreModalComponent;
  slides = [
    {
      img: 'assets/images/kerr.png',
    },
    {
      img: 'assets/images/kerr.png',
    },
    {
      img: 'assets/images/kerr.png',
    },
    // {
    //   img: "assets/images/dentalbanner.png",
    // }
  ];

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  slideConfig1 = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  slideConfigs = {
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: '<i class="fa fa-chevron-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left"></i>',
  };
  productSlide = [
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 100.00`,
      originalprice: `${this.service.curr} 200.00`,
      walletprice: `${this.service.curr} 80.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 90.00`,
      originalprice: `${this.service.curr} 180.00`,
      walletprice: `${this.service.curr} 70.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 120.00`,
      originalprice: `${this.service.curr} 240.00`,
      walletprice: `${this.service.curr} 100.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 150.00`,
      originalprice: `${this.service.curr} 300.00`,
      walletprice: `${this.service.curr} 120.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50.00`,
      originalprice: `${this.service.curr} 100.00`,
      walletprice: `${this.service.curr} 40.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/medical_prod-slider.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50.00`,
      originalprice: `${this.service.curr} 10.00`,
      walletprice: `${this.service.curr} 40.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
  ];

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

  dealsSlides = [
    {
      img: 'assets/images/medical-product/deals.png',
      name: 'Braun No touch',
      discountprice: `${this.service.curr} 100.00`,
      originalprice: `${this.service.curr} 200.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/deals-one.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 90.00`,
      originalprice: `${this.service.curr} 180.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/deals-two.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 120.00`,
      originalprice: `${this.service.curr} 240.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/deals-three.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 150.00`,
      originalprice: `${this.service.curr} 300.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/deals.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50.00`,
      originalprice: `${this.service.curr} 100.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/deals-two.png',
      name: 'Dentmark dental air',
      discountprice: `${this.service.curr} 50.00`,
      originalprice: `${this.service.curr} 100.00`,
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
  ];

  dealsSlideConfig = {
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

  popularSlides = [
    {
      img: 'assets/images/medical-product/popular.png',
      name: 'Medical Consumables',
      product: '71 Product',
    },
    {
      img: 'assets/images/medical-product/popular-one.png',
      name: 'Impression Materials',
      product: '81 Product',
    },
    {
      img: 'assets/images/medical-product/popular-two.png',
      name: 'Equipment',
      product: '91 Product',
    },
    {
      img: 'assets/images/medical-product/popular-three.png',
      name: 'Dental Consumables',
      product: '100 Product',
    },
    // {
    //   img: "assets/images/medical-product/popular.png",
    //   name: 'Obstetrics & Gynecology',
    //   product:'60 Product'
    // },
    // {
    //   img: "assets/images/medical-product/popular-two.png",
    //   name: 'Spirometers',
    //   product:'101 Product'
    // },
  ];

  popularSlideConfig = {
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

  shopSlidess = [
    {
      img: 'assets/images/medical-product/shop.png',
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent: 'Flat 30% off',
    },
    {
      img: 'assets/images/medical-product/shop-one.png',
      logo: 'assets/images/medical-product/shop-logo-one.png',
      discountpercent: 'Flat 15% off',
    },
    {
      img: 'assets/images/medical-product/shop-two.png',
      logo: 'assets/images/medical-product/shop-logo-two.png',
      discountpercent: 'Flat 20% off',
    },
    {
      img: 'assets/images/medical-product/kerr-brand.png',
      logo: 'assets/images/medical-product/kerr-logo.png',
      discountpercent: 'Flat 28% off',
      brand: 'Kerr',
    },
    {
      img: 'assets/images/medical-product/shop.png',
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent: 'Flat 35% off',
    },
    {
      img: 'assets/images/medical-product/shop-two.png',
      logo: 'assets/images/medical-product/shop-logo-two.png',
      discountpercent: 'Flat 30% off',
    },
  ];

  showBrandDentals(value) {
    console.log(value);
    this.router.navigate(
      [`/${this.countryIso.getCountryCode()}/c/Materials-&-Composite`],
      { queryParams: { cid: 43 } }
    );
  }

  navigateToCategiry(value, brandname) {
    console.log(value);
    let data = {
      manufactureId: value,
    };
    brandname = brandname.trim();
    brandname = brandname.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate(
      [`/${this.countryIso.getCountryCode()}/brand/${brandname}`],
      {
        queryParams: data,
      }
    );
  }
  shopSlideConfig = {
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

  groupSlides = [
    {
      img: 'assets/images/medical-product/group.png',
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/group-one.png',
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/group.png',
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
    {
      img: 'assets/images/medical-product/group-one.png',
      discountimage: 'assets/images/medical-product/discount-background.png',
    },
  ];

  groupSlideConfig = {
    slidesToShow: 2,
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
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  sellerSlides = [
    // {
    //   img: "assets/images/medical-product/global_pharmacy.jpg",
    //   image: "assets/images/medical-product/seller-one.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
    // {
    //   img: "assets/images/medical-product/global_pharmacy.jpg",
    //   image: "assets/images/medical-product/seller.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
    // {
    //   img: "assets/images/medical-product/global_pharmacy.png",
    //   image: "assets/images/medical-product/seller-three.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
    // {
    //   img: "assets/images/medical-product/global_pharmacy.png",
    //   image: "assets/images/medical-product/seller.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
    // {
    //   img: "assets/images/medical-product/global_pharmacy.png",
    //   image: "assets/images/medical-product/seller-two.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
    // {
    //   img: "assets/images/medical-product/global_pharmacy.png",
    //   image: "assets/images/medical-product/seller-three.png",
    //   name: 'Global Pharmacy',
    //   discountpercent:'Flat 30% off'
    // },
  ];

  sellerSlideConfig = {
    slidesToShow: 2,
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

  constructor(
    config: NgbProgressbarConfig,
    private router: Router,
    public service: UserService,
    public authService: AuthService,
    private titleservice: Title,
    private countryIso: CountryIsoService
  ) {
    config.max = 1000;
    config.animated = true;
    config.type = 'avail';
    config.height = '7px';
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
  slidess: any;

  getBanner() {
    this.service
      .getBannerImageAndDetails(this.countryIso.getCountryId())
      .subscribe(
        (response) => {
          console.log(response);
          this.slidess = response;
          this.slidess = this.slidess.data;

          this.slidess = this.slidess.filter(
            (o) =>
              o.position == 'Inner Page' &&
              o.adminStatus == 1 &&
              o.isDelete == 0
          );
          console.log(this.slidess, 'landing page response');
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnInit(): void {
    this.titleservice.setTitle(this.countryIso.MessageTitile.shopNowDental);
    this.getBanner();
    this.getCategoriesBanner();
    this.getBrandThumbnails();
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

  navigateToInstruments(item, id) {
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
  navigateToConsumables(item, id) {
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
  productSlides: any;
  dentalCategoryData: any;

  materialSlides: any;
  instrumentSlides: any;
  consumables: any;
  getCategoriesBanner() {
    this.service.getDentalBanner().subscribe(
      (response) => {
        this.dentalCategoryData = response;
        this.dentalCategoryData = this.dentalCategoryData.data;
        console.log('banner dental response', this.dentalCategoryData);
        let cloneMaterials: any = { ...this.dentalCategoryData };
        this.materialSlides = cloneMaterials.materials;
        this.instrumentSlides = cloneMaterials.instruments;
        this.consumables = cloneMaterials.consumables;
        console.log('only materials', this.materialSlides);
      },
      (error) => {
        console.log('error in dental banner', error);
      }
    );
  }
  goToLogin(productName, pid) {
    localStorage.setItem('productInfo', productName);
    localStorage.setItem('productId', pid);
    this.router.navigate([`/${this.countryIso.getCountryCode()}/login`]);
  }
  ngOnDestroy() {
    this.titleservice.setTitle(this.countryIso.MessageTitile.defaultTitle);
  }
  shopslides: any;
  getBrandThumbnails() {
    this.service.getDetailsShopByBrand().subscribe((response) => {
      this.shopslides = response;
      this.shopslides = this.shopslides.data.results;
      console.log('response...', this.shopslides);
    });
  }

  slickInit(e) {
    console.log('slick initialized', e);
  }

  routePay32() {
    if (this.authService.loginFlag) {
      this.router.navigate([`/${this.countryIso.getCountryCode()}/my-wallet`])
    }
    else {
      this.authService.routePay32 = true
      this.router.navigate([`/${this.countryIso.getCountryCode()}/login`])
      if (this.authService.loginFlag) {
        this.router.navigate([`/${this.countryIso.getCountryCode()}/my-wallet`])
      }
    }
  }
}
