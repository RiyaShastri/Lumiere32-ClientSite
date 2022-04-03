import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {CountryIsoService} from '../../../../app/core/services/country-iso.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private titleService:Title, public countryISO: CountryIsoService) { }
/* make floww dynamic  because of bullet added tag directly to html*/
  privacyPolicy :any =[
  {title:"COLLECTION OF PERSONAL DATA/INFORMATION",data:""}
];
  ngOnInit(): void {
    this.titleService.setTitle(this.countryISO.MessageTitile.privacy)
  }

}
