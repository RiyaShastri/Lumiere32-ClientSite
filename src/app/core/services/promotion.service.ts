import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})

export class PromotionService {
  constructor(
    private http: HttpClient,
    private baseService: BaseService
  ) { }

  getPromoOffersCategory() {
    const countryId = localStorage.getItem("country_id");
    return this.http.get(
      this.baseService.baseUrlRaw +
      'getSubscriptionPromotionCategory?countryId=' +
      countryId
    );
  }

  getPromotions() {
    const countryId = localStorage.getItem("country_id");
    return this.http.get(
      this.baseService.baseUrlRaw +
      'getSubscriptionPromotion?countryId=' +
      countryId
    );
  }

  getRewardPageDetail() {
    const countryId = localStorage.getItem("country_id");
    return this.http.get(this.baseService.baseUrlRaw + 'web/rewardPlan?countryId=' + countryId);
  }

  getTotalRewardPoint(pageNo) {
    const queryParams = { page: pageNo };
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userData && userData['customerId']) {
      const customerId = userData['customerId'];
      return this.http.get(this.baseService.baseUrlRaw + 'customer/' + customerId + '/reward', { params: queryParams });
    }
  }
  getBrandRewards() {
    const countryId = localStorage.getItem("country_id");
    return this.http.get(this.baseService.baseUrlRaw + 'web/rewardScheme?countryId=' + countryId);
  }

  confirmRedeem(shemeId) {
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    const countryId = localStorage.getItem("country_id");

    if (userData && userData['customerId']) {
      const customerId = userData['customerId'];

      const reqObj = {
        rewardSchemeId: shemeId,
        countryId: countryId,
        customerId: customerId
      };

      return this.http.post(this.baseService.baseUrlRaw + 'customer/rewardRedemption', reqObj);
    }
  }

  convertRedeemToWallet() {
    const userData = localStorage.getItem('UserData') ? JSON.parse(localStorage.getItem('UserData')) : null;
    if (userData && userData['customerId']) {
      const customerId = userData['customerId'];
      return this.http.get(this.baseService.baseUrlRaw + 'customer/convertRewardPointsToWallet/' + customerId);
    }
  }

}
