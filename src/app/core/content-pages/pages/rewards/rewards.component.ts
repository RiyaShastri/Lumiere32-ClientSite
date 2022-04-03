import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { CountryIsoService } from 'src/app/core/services/country-iso.service';
import { PromotionService } from 'src/app/core/services/promotion.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class RewardsComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: Paginator;
  categories;
  brandRewards = [];
  planDetail;
  rewardTable;
  checked = true;
  pageIndex = 1;
  totalrecords = 1;
  userSpentAmount = 0;
  userRewardPoints = 0;
  convertRewardPoint = 200;
  convertWalletAmount = 1;
  totalRewardPoint;
  customOptions: OwlOptions = {
    margin: 20,
    loop: true,
    // stagePadding: 100,
    // nav: true,
    rewind: true,
    dots: false,
    navSpeed: 500,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  };

  constructor(
    public promoService: PromotionService,
    private toastr: ToastrService,
    public router: Router,
    private confirmationService: ConfirmationService,
    private countryISO: CountryIsoService) { }

  async ngOnInit() {
    await this.getRewardDetail();
    await this.getRewardDefaultData();
  }

  getRewardDefaultData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.promoService.getPromoOffersCategory().toPromise(),
        this.promoService.getRewardPageDetail().toPromise(),
        this.promoService.getTotalRewardPoint(this.pageIndex).toPromise(),
        this.promoService.getBrandRewards().toPromise(),
      ]).then(detail => {
        this.categories = detail[0]['data'];
        this.planDetail = detail[1]['data'];
        this.totalRewardPoint = detail[2]['data'];
        this.rewardTable = detail[2]['data']['rewardTxn'];
        this.brandRewards = detail[3]['data']['results'];
        if (this.planDetail && this.planDetail.length > 0) {
          const plan = this.planDetail[0];
          this.userSpentAmount = plan['spentAmount'];
          this.userRewardPoints = plan['rewardPoints'];
          this.convertRewardPoint = plan['convertRewardPoint'];
          this.convertWalletAmount = plan['convertWalletAmount'];
        }
        resolve(1);
      }).catch(err => {
        if (err && err.error && err.error.statusCode === 401) {
          this.router.navigate([
            `/${this.countryISO.getCountryCode()}/login`,
          ]);
        }
        resolve(1);
      });
    });

  }


  async paginate(event) {
    if (event && event.page + 1) {
      this.pageIndex = event.page + 1;
    } else {
      this.pageIndex = 1;
    }
    await this.getRewardDetail();
  }

  getRewardDetail() {
    return new Promise((resolve, reject) => {
      this.promoService.getTotalRewardPoint(this.pageIndex).toPromise().then(detail => {
        this.totalRewardPoint = detail['data'];
        this.totalrecords = detail['data']['total'];
        this.rewardTable = detail['data']['rewardTxn'];
        resolve(1);
      }).catch(err => {
        if (err && err.error && err.error.statusCode === 401) {
          this.router.navigate([
            `/${this.countryISO.getCountryCode()}/login`,
          ]);
        }
        resolve(1);
      });
    });
  }

  confirmRedeem(rewardSchemeId, schemeName, points) {
    if (Number(this.totalRewardPoint['reward']) >= points) {
      this.confirmationService.confirm({
        message: `Do you want to redeem points for ${schemeName} ?`,
        header: 'Confirmation',
        key: 'Redeem',
        accept: () => {
          this.promoService.confirmRedeem(rewardSchemeId).toPromise().then(async (res) => {
            if (res) {
              await this.getRewardDetail();
              this.toastr.success('Voucher has been successfully redeemed. <br /><br /> Our support team will share the voucher via email/mobile within 72 hours.',
                '', { closeButton: true, timeOut: 4000, progressBar: true, enableHtml: true });
            }
          }).catch(err => {
            if (err && err.error && err.error.statusCode === 400) {
              this.toastr.error(err.error.message);
            } else if (err && err.error && err.error.statusCode === 401) {
              this.router.navigate([
                `/${this.countryISO.getCountryCode()}/login`,
              ]);
            }
          });
        }
      });
    } else {
      this.confirmationService.confirm({
        message: `Your existing reward points are insufficient for the ${schemeName}`,
        header: 'Insufficient balance',
        key: 'error',
        accept: () => { }
      });
    }
  }

  convertPointToWallet() {
    if (Number(this.totalRewardPoint['reward']) >= Number(this.convertRewardPoint)) {
      this.confirmationService.confirm({
        message: 'Do you want to convert points into Pay32 wallet  ?',
        key: 'Redeem',
        accept: () => {
          this.promoService.convertRedeemToWallet().toPromise().then(async (res) => {
            if (res) {
              await this.getRewardDetail();
              this.toastr.success('Successfully redeemed.  <br /><br /> You have converted your points into Pay32 Wallet balance. Thank you!',
                '', { closeButton: true, timeOut: 4000, progressBar: true, enableHtml: true });
            }
          }).catch(err => {
            if (err && err.error && err.error.statusCode === 400) {
              this.toastr.error(err.error.message);
            } else if (err && err.error && err.error.statusCode === 401) {
              this.router.navigate([
                `/${this.countryISO.getCountryCode()}/login`,
              ]);
            }
          });
        }
      });
    } else {
      this.toastr.error(`You need minimum ${this.convertRewardPoint} points to convert into Pay32 wallet`);
    }

  }

}
