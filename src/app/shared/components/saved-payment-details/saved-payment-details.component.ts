import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutService } from 'src/app/core/services/checkout.service';
@Component({
  selector: 'app-saved-payment-details',
  templateUrl: './saved-payment-details.component.html',
  styleUrls: ['./saved-payment-details.component.scss'],
})
export class SavedPaymentDetailsComponent implements OnInit {
  savedPaymentsArr: any = [];

  constructor(
    public dialog: MatDialog,
    public checkoutService: CheckoutService
  ) {
    this.getSavedPayments();
  }

  ngOnInit(): void { }

  //to get all saved payment details
  getSavedPayments = () => {
    try {
      const userDetail = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
      if (userDetail) {
        this.checkoutService.getPaymentDetails(userDetail['customerId']).subscribe((res: any) => {
          if (res.success && res.data) {
            this.savedPaymentsArr = res.data.allCards ? res.data.allCards : [];
          }
        });
      }
    } catch (error) { }
  };

  // to delete saved payment
  deleteSavedPayment = (item: any) => {
    try {
      let obj = {
        customerId: item.customerId,
        cardId: item.creditCard.id,
        id: item.id,
      };

      this.checkoutService.deletePaymentDetails(obj).subscribe((res: any) => {
        if (res.success) {
          this.getSavedPayments();
        }
      });
    } catch (error) { }
  };
}
