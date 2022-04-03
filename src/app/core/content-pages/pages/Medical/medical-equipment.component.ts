import { Component, OnInit } from '@angular/core';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {CountryIsoService} from '../../../services/country-iso.service';
@Component({
  selector: 'app-medical-equipment',
  templateUrl: './medical-equipment.component.html',
  styleUrls: ['./medical-equipment.component.scss'],
  providers: [NgbProgressbarConfig]
}) 
export class MedicalEquipmentComponent implements OnInit {

  constructor(
    private service : UserService,
    config: NgbProgressbarConfig,
    private  router:Router,
    private countryIso:CountryIsoService
    
  ) { 
    config.max = 1000;
    config.animated = true;
    config.type = 'avail';
    config.height = '7px';
  }
  slides = [
    {
      img: "assets/images/home-slider-image.png",
    },
    {
      img: "assets/images/home-slider-image.png",
    },
    {
      img: "assets/images/home-slider-image.png",
    }, 
    {
      img: "assets/images/home-slider-image.png",
    }
  ];
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "nextArrow": '<i class="fa fa-chevron-right"></i>', 
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
  };

  productSlides = [

    {
      img: "assets/images/medical-product/medical_prod-slider.png",
      name: 'Dentmark dental air',
      
      discountprice: 'RM 100.00',
      originalprice: 'RM 200.00',
      walletprice:'RM 80.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
      
    },
    {
      img: "assets/images/medical-product/medical_prod-slider.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 90.00',
      originalprice: 'RM 180.00',
      walletprice:'RM 70.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/medical_prod-slider-two.png",
      name: 'Apollo Pharmacy',
      discountprice: 'RM 120.00',
      originalprice: 'RM 240.00',
      walletprice:'RM 100.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/medical_prod-slider-three.png",
      name: 'Thermometer, 1pc',
      discountprice: 'RM 150.00',
      originalprice: 'RM 300.00',
      walletprice:'RM 120.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/medical_prod-slider.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 50.00',
      originalprice: 'RM 100.00',
      walletprice:'RM 40.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/medical_prod-slider.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 50.00',
      originalprice: 'RM 100.00',
      walletprice:'RM 40.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
  ];

  productSlideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint:767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
         }
        },
        {
          breakpoint:500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
      }

    ]
  };

  dealsSlides = [
    {
      img: "assets/images/medical-product/deals.png",
      name: 'Braun No touch',
      discountprice: 'RM 100.00',
      originalprice: 'RM 200.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/deals-one.png",
      name: 'Equipment Cabinet',
      discountprice: 'RM 90.00',
      originalprice: 'RM 180.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/deals-two.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 120.00',
      originalprice: 'RM 240.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/deals-three.png",
      name: 'Stethoscope',
      discountprice: 'RM 150.00',
      originalprice: 'RM 300.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/deals.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 50.00',
      originalprice: 'RM 100.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/deals-two.png",
      name: 'Dentmark dental air',
      discountprice: 'RM 50.00',
      originalprice: 'RM 100.00',
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
  ];

 dealsSlideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint:767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
         }
        },
        {
          breakpoint:500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
      }
    ]
  };

  popularSlides = [
    {
      img: "assets/images/medical-product/popular.png",
      name: 'surgery scissors',
      product:'71 Product'
    },
    {
      img: "assets/images/medical-product/popular-one.png",
      name: 'Obstetrics & Gynecology',
      product:'81 Product'
    },
    {
      img: "assets/images/medical-product/popular-two.png",
      name: 'Spirometers',
      product:'91 Product'
    },
    {
      img: "assets/images/medical-product/popular-three.png",
      name: 'glaves and mask',
      product:'100 Product'
    },
    {
      img: "assets/images/medical-product/popular.png",
      name: 'Obstetrics & Gynecology',
      product:'60 Product'
    },
    {
      img: "assets/images/medical-product/popular-two.png",
      name: 'Spirometers',
      product:'101 Product'
    },
  ];

  popularSlideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint:767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
         }
        },
        {
          breakpoint:500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
      }
    ]
  };

  shopSlidess = [
    {
      //img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off'
    },
    {
     // img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off'
    },
    {
     // img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off'
    },
    {
     // img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off'
    },
    {
     // img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off' 
    },
    {
     // img: "assets/images/medical-product/shop.png",
      logo: 'assets/images/medical-product/shop-logo.png',
      discountpercent:'Flat 30% off'
    },
  ];

  shopSlideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint:767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
         }
        },
        {
          breakpoint:500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
      }
    ]
  };

  groupSlides = [
    {
      img: "assets/images/medical-product/group.png",
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/group-one.png", 
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/group.png",
      discountimage: 'assets/images/medical-product/discount-background.png'
    },
    {
      img: "assets/images/medical-product/group-one.png",
      discountimage: 'assets/images/medical-product/discount-background.png'   
    },
  ];

  groupSlideConfig = {
    "slidesToShow": 2, 
    "slidesToScroll": 1,
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
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

  sellerSlides = [ 
    {
      img: "assets/images/medical-product/seller.png",
      image: "assets/images/medical-product/seller-one.png",
      name: 'surgery scissors',
      discountpercent:'Flat 30% off'
    },
    {
      img: "assets/images/medical-product/seller-one.png",
      image: "assets/images/medical-product/seller.png",
      name: 'Obstetrics & Gynecology',
      discountpercent:'Flat 30% off'
    },
    {
      img: "assets/images/medical-product/seller-two.png",
      image: "assets/images/medical-product/seller-three.png",
      name: 'Spirometers',
      discountpercent:'Flat 30% off'
    },
    {
      img: "assets/images/medical-product/seller-three.png",
      image: "assets/images/medical-product/seller.png",
      name: 'glaves and mask',
      discountpercent:'Flat 30% off'
    },
    {
      img: "assets/images/medical-product/seller.png",
      image: "assets/images/medical-product/seller-two.png",
      name: 'Obstetrics & Gynecology',
      discountpercent:'Flat 30% off'
    },
    {
      img: "assets/images/medical-product/seller-two.png",
      image: "assets/images/medical-product/seller-three.png",
      name: 'Spirometers',
      discountpercent:'Flat 30% off'
    },
  ];

  sellerSlideConfig = {
    "slidesToShow": 2, 
    "slidesToScroll": 1, 
    "margin": 10,
    "nextArrow": '<i class="fa fa-chevron-right"></i>',
    "prevArrow": '<i class="fa fa-chevron-left"></i>',
    "dots": true,
    "infinite": false,
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
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint:767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
         }
        },
        {
          breakpoint:500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
      }
    ]
  };


  ngOnInit(): void {
    this.getBrandThumbnails()
  }
shopslides:any
  getBrandThumbnails(){
    this.service.getDetailsShopByBrand()
    .subscribe((response)=>{
      
      this.shopslides = response
      this.shopslides = this.shopslides.data.results
      console.log("response...",this.shopslides)
    })
  }
  navigateToCategiry(value,brandname){
    console.log(value)
    let data = {
      manufactureId:value
    }
    brandname = brandname.trim()
    brandname = brandname.replace(/\s+/g, '-').toLowerCase()
    this.router.navigate([`/${this.countryIso.getCountryCode()}/brand/${brandname}`], {
      queryParams: data
    })
  }
  slickInit(e) {
  }

  routePage(){
    this.router.navigate(['/sc/Dental/Dental'])
  }

} 
