import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryIsoService } from '../../services/country-iso.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  constructor(
    private _activateRoute:ActivatedRoute,
    private countryIso:CountryIsoService,
    private _router:Router,
  ) {
  }
  
  ngOnInit(): void {
    this.countryIso.allCountries=JSON.parse(localStorage.getItem('country'));
  }
}