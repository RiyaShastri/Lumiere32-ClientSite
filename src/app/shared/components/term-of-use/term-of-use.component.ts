import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {CountryIsoService} from '../../../../app/core/services/country-iso.service';

@Component({
  selector: 'app-term-of-use',
  templateUrl: './term-of-use.component.html',
  styleUrls: ['./term-of-use.component.scss']
})
export class TermOfUseComponent implements OnInit {
  title = 'terms-of-use';
  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public countryISO: CountryIsoService
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.countryISO.MessageTitile.termsofuse)
    this.metaTagService.updateTag(
      { name: 'description', content: "Edit song data." }
    );
  }

}
