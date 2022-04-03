import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  slides = [
    {
      img: "assets/images/slider-image.svg",
      name: "Join Lumiere32",
      text: " & simplify your clinic or hospital procurement process"
    }
  ];
  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "prevArrow": false, //'<i class="fa fa-chevron-right"></i>'
    "nextArrow": false, //'<i class="fa fa-chevron-left"></i>'
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
  };

  routerUrl: string;

  constructor(
    public router: Router
  ) {
    // this.router.errorHandler((error)=>{
    //   console.log("error here in routing")
    // })
    this.routerUrl = this.router.url;
    console.log("this router url",this.routerUrl)
   }

  ngOnInit(): void {

  }

  slickInit(e) {
  }

}
