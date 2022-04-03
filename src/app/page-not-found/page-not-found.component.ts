import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryIsoService } from '../core/services/country-iso.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router :Router , private counrtyIso :CountryIsoService) {}

  ngOnInit(): void {}
  
  homepage() {
    this.router.navigate([`/${this.counrtyIso.getCountryCode()}`]);
  }
}
