import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { CountryIsoService } from 'src/app/core/services/country-iso.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  searchText;
  isLoading: boolean = true;
  alphabetArr: any = [];
  brandIndex: any
  alphabetIndex: any
  constructor(
    public service: UserService,
    private router: Router,
    public countryIso: CountryIsoService) {
    // this.getBrandThumbnails() 
  }

  ngOnInit(): void {
    this.getAllBrands();
    this.featuredBrand();
    this.alphabetArr = [
      '#',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
  }

  featuredBrandArr: any;
  allBrandArr: any;

  featuredBrand() {
    this.isLoading = true;
    this.service.getFeaturedBrand().subscribe((res: any) => {
      this.isLoading = false;
      this.featuredBrandArr = res.data;
      console.log('response...', this.featuredBrandArr);
    });
  }
  getAllBrands() {
    this.service.getAllBrands().subscribe((res: any) => {
      this.allBrandArr = res.data;
      this.allBrandArr = Object.entries(res.data);
      for (const iterator of this.allBrandArr) {
        if (iterator[0] === '123') {
          iterator[0] = '#';
        }
      }
    });
  }

  showBrandDiv(value: any) {
    this.brandIndex = value ? value.toLowerCase() : null
    this.alphabetIndex = value
    for (const iterator of this.alphabetArr) {
      if (iterator[0].toLowerCase() === value.toLowerCase()) {
        document.getElementById(value.toLowerCase()).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }

}
