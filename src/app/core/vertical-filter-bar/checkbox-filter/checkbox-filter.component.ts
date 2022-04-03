import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CheckboxFilter } from './checkbox-filter.model';
import { FBFilterComponent } from '../fb-filter-component.interface';
import { ShowMoreModalComponent } from './show-more-modal/show-more-modal.component';
import { ReturnStatement } from '@angular/compiler';
import { element } from 'protractor';
import {Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit, FBFilterComponent {

  @Input()
  public model: CheckboxFilter

  @Output()
  public change: EventEmitter<string[]> = new EventEmitter();

  @ViewChild(ShowMoreModalComponent)
  public showMoreModal: ShowMoreModalComponent

  constructor(private router : Router,
    private route : ActivatedRoute
    ) { 
   
  }

  ngOnInit() {
    // let dt :any= 42
    // this.model.filterValue.push(dt)
  }

  public checkChanged(item: string, event: Event, checked: boolean): void {
    console.log("item",item)
    console.log("item",typeof item)
    let index = this.model.filterValue.indexOf(item)
    console.log("index ?",index)
    if(checked) {
      if(index === -1)
      console.log("splice index",item)
      this.model.filterValue.push(item)
    } else {
      console.log('else?')
      this.model.filterValue.splice(index, 1)
    }
    event.stopPropagation()
 
    console.log("stop propogation",this.model.filterValue)
  
    this.change.emit(this.model.filterValue)
  }
  onApply(items: string[]) {    
    this.model.filterValue = items
    this.change.emit(this.model.filterValue)
  }
}
