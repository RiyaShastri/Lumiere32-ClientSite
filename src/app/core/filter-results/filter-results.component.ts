import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterChoice } from './filter-choice.model';

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.component.html',
  styleUrls: ['./filter-results.component.css']
})
export class FilterResultsComponent implements OnInit {

  public filterResults: any
  public filterChoices: FilterChoice[]
  public currencyFormater: Intl.NumberFormat


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currencyFormater = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    });
  }

  ngOnInit() {
    //Update filter choices based on the query params
    this.route.queryParamMap.subscribe((paramsMap: Params) => {
      this.filterResults = paramsMap.params
      this.filterChoices = []
      if (this.filterResults) {
        if (this.filterResults['categoryId']) {
          if (Array.isArray(this.filterResults['categoryId'])) {
            this.filterChoices.push(new FilterChoice('categoryId', 'Category', this.filterResults['categoryId']))
          } else {
            this.filterChoices.push(new FilterChoice('categoryId', 'Category', new Array(this.filterResults['categoryId'])))
          }
        }
        if (this.filterResults['price']) {
          let priceRange: number[] = this.filterResults['price']
          this.filterChoices.push(new FilterChoice('price', 'Price', ['From ' + this.currencyFormater.format(priceRange[0]) + ' To ' + this.currencyFormater.format(priceRange[1])]))
        }
        if (this.filterResults['manufactureId']) {
          if (Array.isArray(this.filterResults['manufactureId'])) {
            this.filterChoices.push(new FilterChoice('manufactureId', 'Manufacture', this.filterResults['manufactureId']))
          } else {
            this.filterChoices.push(new FilterChoice('manufactureId', 'Manufacture', new Array(this.filterResults['manufactureId'])))
          }
        }
        if (this.filterResults['discount']) {
          if (Array.isArray(this.filterResults['discount'])) {
            this.filterChoices.push(new FilterChoice('discount', 'Discount', this.filterResults['discount']))
          } else {
            this.filterChoices.push(new FilterChoice('discount', 'Discount', new Array(this.filterResults['discount'])))
          }
        }
        if (this.filterResults['countryOriginId']) {
          if (Array.isArray(this.filterResults['countryOriginId'])) {
            this.filterChoices.push(new FilterChoice('countryOriginId', 'Country', this.filterResults['countryOriginId']))
          } else {
            this.filterChoices.push(new FilterChoice('countryOriginId', 'Country', new Array(this.filterResults['countryOriginId'])))
          }
        }
      }
    })
    console.log(this.filterResults)
  }

  /**
   * Remove clicked filter choice from the queryParams
   * @param choice 
   * @param value 
   */
  public removeFilterChoice(choice: FilterChoice, value: string): void {
    console.log("ff")
    let params = Object.assign({}, this.route.snapshot.queryParams);
    if (choice.values.length == 1) {
      params[choice.identifier] = undefined
    } else {
      params[choice.identifier] = params[choice.identifier].slice()
      let index = params[choice.identifier].indexOf(value)
      params[choice.identifier].splice(index, 1)
      if(params[choice.identifier].length == 0) {
        params[choice.identifier] = undefined
      }
    }
    this.router.navigate(['c/', this.route.snapshot.params.id], { queryParams: params })
    // this.router.navigate(['/dental/product-listing'], {  })
  }
}