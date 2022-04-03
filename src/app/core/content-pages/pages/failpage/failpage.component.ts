import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-failpage',
  templateUrl: './failpage.component.html',
  styleUrls: ['./failpage.component.scss']
})
export class FailpageComponent implements OnInit {
  sub
  messageDetails:any
  constructor(  private route: ActivatedRoute,
    private router: Router) { 

      this.sub = this.route.paramMap.pipe((map)=>window.history.state)
      console.log(this.sub)
    }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    localStorage.removeItem('dis_id')
  }

}
