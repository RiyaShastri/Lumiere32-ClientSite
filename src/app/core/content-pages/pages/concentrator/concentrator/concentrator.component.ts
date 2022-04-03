import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ConcentratorsService } from '../../../../services/concentrators.service';

@Component({
  selector: 'app-concentrator',
  templateUrl: './concentrator.component.html',
  styleUrls: ['./concentrator.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class ConcentratorComponent implements OnInit {
  micrositeProductsList: any
  micrositeProdCategory = []
  productCategory: string
  categories = []
  closeResult = "";
  contactDetails = new FormGroup({})
  isSubmitted: boolean = false;
  selectedProductIndex: number;
  selectedProductName: string;
  selectedProductPrice: string;
  selectedProductImage: string;
  selectedProductMinQuantity: number;
  selectedProductMaxQuantity: number;
  requestQuote: boolean = false
  selectedProductQuantity: number
  oxyConcenArr: any = []
  comboOfferArr: any = []
  rapidTestKitArr: any = []
  modifiedPriceFormat: number

  constructor(
    private modalService: NgbModal,
    private concentratorService: ConcentratorsService) { }

  ngOnInit(): void {
    this.requestQuote = false
    this.initForm();
    this.getMicrositeProducts()
  }

  open(content, modaltype, productName, productPrice, productImage, productMinQuantity, productMaxQuantity, productQuantity) {
    this.requestQuote = false
    this.selectedProductName = productName;
    this.selectedProductPrice = parseFloat(productPrice).toFixed(2);
    this.selectedProductImage = productImage
    this.selectedProductMinQuantity = productMinQuantity
    this.selectedProductMaxQuantity = productMaxQuantity
    this.selectedProductQuantity = productQuantity
    this.modalService
      .open(content, { ariaLabelledBy: modaltype, backdrop: 'static', keyboard: false })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;

        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  initForm() {
    this.contactDetails = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl("", [Validators.required]),
      mobile: new FormControl(''),
      notes: new FormControl('')
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.contactDetails.invalid) {
      return;
    } else {
      let data = this.contactDetails.value;
      data.product = this.selectedProductName
      if (!this.requestQuote) {
        data.image = this.selectedProductImage
        if (this.selectedProductMinQuantity != undefined)
          data.min_qty = this.selectedProductMinQuantity
        if (this.selectedProductMaxQuantity != undefined)
          data.max_qty = this.selectedProductMaxQuantity
        this.modifiedPriceFormat = Number(this.selectedProductPrice.toString().replace('.', ''))
        data.amount = Number(this.modifiedPriceFormat)
        if (this.selectedProductPrice != undefined)
          data.qty = this.selectedProductQuantity
      }

      this.concentratorService.checkoutQuote(data).subscribe((response) => {
        let url: any = response;
        url = url.url
        window.location.href = url.toString();
      }, (error) => {
        console.log(error)
      })

      this.concentratorService.checkoutStripe(data).subscribe((response) => {
        let url: any = response;
        url = url.url
        window.location.href = url.toString();
      }, (error) => {
        console.log(error)
      })
    }
  }

  get contactControls() {
    return this.contactDetails.controls;
  }

  openForQuote(content, modaltype, productName) {
    this.requestQuote = true
    this.selectedProductName = productName;
    this.modalService
      .open(content, { ariaLabelledBy: modaltype, backdrop: 'static', keyboard: false })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;

        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  getMicrositeProducts() {
    this.concentratorService.getMicrositeProducts().subscribe(
      (success: any) => {
        this.micrositeProductsList = success.data;
        for (var i = 0; i < this.micrositeProductsList.length; i++) {
          this.micrositeProdCategory.push(this.micrositeProductsList[i].category)
        }

        this.oxyConcenArr = success.data.filter((x: any) => x.category === 'Oxygen Concentrator' && x.status === 1)
        this.comboOfferArr = success.data.filter((x: any) => x.category === 'Combo Offers' && x.status === 1)
        this.rapidTestKitArr = success.data.filter((x: any) => x.category === 'Rapid Testing Kits' && x.status === 1)

        const categoryList = [...new Set(this.micrositeProdCategory)];
        for (var j = 0; j < categoryList.length; j++) {
          this.categories.push(categoryList[j]);
        }
      }
    );
  }
}
