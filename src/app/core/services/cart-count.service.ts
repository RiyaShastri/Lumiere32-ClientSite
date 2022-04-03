import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartCountService {
  
  public cartCount: EventEmitter<string> = new EventEmitter();

  updateCount(val) {
    this.cartCount.emit(val);
  }
  constructor() { }
}
