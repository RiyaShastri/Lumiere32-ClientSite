import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { RangeFilter } from './range-filter.model';
import { FBFilterComponent } from '../fb-filter-component.interface';

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.css'],
})
export class RangeFilterComponent implements OnInit, FBFilterComponent {
  @Input()
  public model: RangeFilter
  minValue:any;
  maxValue:any;
  @Output()
  change: EventEmitter<number[]> = new EventEmitter();
  
  constructor(
    private ChangeDetectorRef:ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.patchValuesToFields();
  }
  
  patchValuesToFields(){
    this.minValue=this.model.filterValue[0];
    this.maxValue=this.model.filterValue[1];
  }
  valueChange(name){
    if(name == "min"){
      this.model.min = +this.minValue;
      this.model.filterValue[0]= +this.minValue;
    }
    else if(name == "max"){
      this.model.max= +this.maxValue;
      this.model.filterValue[1] = +this.maxValue;
    }
    this.ChangeDetectorRef.detectChanges();
  }

  rangeChanged(event: any): void {
    if(this.model.filterValue[0] === this.model.min && this.model.filterValue[1] === this.model.max)
      this.change.emit(undefined)
    else{
      this.change.emit(this.model.filterValue)
    }
    this.patchValuesToFields();
  }
}
