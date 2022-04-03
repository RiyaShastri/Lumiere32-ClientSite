import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import { Title } from '@angular/platform-browser';
import {CountryIsoService} from '../../../services/country-iso.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor(public service : UserService,private titleService:Title,public countryISO: CountryIsoService) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.countryISO.MessageTitile.wishlist);
  }

}
