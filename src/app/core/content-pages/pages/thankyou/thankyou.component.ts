import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
sub
messageDetails:any
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { 
   this.sub = this.route.paramMap.pipe((map)=>window.history.state)
   console.log(this.sub)
  }

  ngOnInit(): void {
    localStorage.removeItem('payMethod');
    localStorage.removeItem('refNo');
  }
  ngOnDestroy(){
    localStorage.removeItem('dis_id')
  }

}
