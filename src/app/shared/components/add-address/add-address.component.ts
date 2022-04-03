import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { CountryIsoService } from "../../../core/services/country-iso.service";
import { CheckoutService } from 'src/app/core/services/checkout.service';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  addressForm: FormGroup;
  isSubmitted: boolean;
  public loading = false;
  addressFormDetails;
  addressTitle: string;
  editMode: boolean;
  addresses;
  address;
  private _unsubscribe = new Subject<boolean>();
  id: number
  countries = [];
  custId;
  loadedCountryId;
  arrayData;
  addAddressZipMaxLength: number
  addAddressZipMinLength: number
  addAddressZipIsAlpha: boolean = false

  constructor(
    public formBuilder: FormBuilder,
    public userService: UserService,
    public toastr: ToastrService,
    public dialog: MatDialogRef<AddAddressComponent>,
    private authService: AuthService,
    public service: CheckoutService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    var json = JSON.parse(localStorage.UserData);
    this.custId = json.customerId
    this.loadedCountryId = json.countryId;
  }

  ngOnInit(): void {
    // this.service.getCountryInfo();
    this.addressTitle = "Add New Address"

    if (this.data) {
      this.id = this.data.id
      this.editMode = this.id != null
    }
    this.authService.getCountry().subscribe(
      (response: HttpResponse<any>) => {
        if (response.body.data != null) {
          response.body.data.forEach(element => {
            this.countries.push({
              label: element.country,
              value: element.id
            });
          });
        }
      }, (error) => { })
    this.initForm()
  }

  onChangeCountry(event) {
    let country_new_id = event.value;
    this.loadedCountryId = country_new_id;
    this.getCountryDetail(this.loadedCountryId)
  }

  getCountryDetail(event) {
    console.log(event)
    var changedCountry = event;
    this.loadedCountryId = parseInt(changedCountry);
    this.addAddressZipMinLength = this.service.countryMinLenMap.get(this.loadedCountryId)
    this.addAddressZipMaxLength = this.service.countryMaxLenMap.get(this.loadedCountryId)
    this.addAddressZipIsAlpha = this.service.countryMapIsAlpha.get(this.loadedCountryId);
    this.applyValidationsOnPostalCode();
    this.addressForm.controls.postal.updateValueAndValidity();
  }

  get addressControls() {
    return this.addressForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    this.loading = true;
    if (this.addressForm.invalid) {
      this.loading = false;
      return;
    }

    this.addressFormDetails = {
      "name": this.addressForm.get('name').value,
      "clinicName": this.addressForm.get('clinicName').value,
      "blockNo": this.addressForm.get('blockNo').value,
      "floorNo": this.addressForm.get('floorNo').value,
      "unitNo": this.addressForm.get('unitNo').value,
      "buildingName": this.addressForm.get('building').value,
      "streetName": this.addressForm.get('streetName').value,
      "country": this.addressForm.get('country').value,
      "zip": this.addressForm.get('postal').value,
      "customerId": this.custId
    }

    if (this.id) {
      this.addressFormDetails.id = this.id;
    }
    if (this.editMode) {
      this.addressTitle = "Edit Address"
      this.userService.onUpdateAdd(this.addressFormDetails).subscribe(
        data => {
          this.loading = false;
          this.toastr.success("Address Edited Successfully")
          this.dialog.close()
        }, error => {
          this.loading = false;
          this.toastr.error(error.message)
        });
    }
    else {

      this.userService.onAddressAdd(this.addressFormDetails).subscribe(
        data => {
          this.loading = false;
          this.toastr.success("Address Added Successfully")
          this.dialog.close()
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error.message);
        });
    }
  }
  initForm() {
    let name = "";
    let clinicName = "";
    let blockNo = "";
    let floorNo = "";
    let unitNo = "";
    let streetName = "";
    let building = "";
    let postal = "";
    let country = ""
    if (this.editMode) {
      this.addressTitle = "Edit Address"
      this.userService.getProfileAddressAdd(this.custId).pipe(takeUntil(this._unsubscribe)).subscribe(
        (success: any) => {

          this.addresses = success.body.data.result;
          this.address = this.addresses.filter((item: any) => {
            return this.id === item.id
          })
          this.addressForm.patchValue({
            "name": this.address[0].name,
            "clinicName": this.address[0].clinicName,
            "building": this.address[0].buildingName,
            "floorNo": this.address[0].floorNo,
            "streetName": this.address[0].streetName,
            "unitNo": this.address[0].unitNo,
            "blockNo": this.address[0].blockNo,
            "postal": this.address[0].zip,
            "country": parseInt(this.address[0].country),
            "customerId": this.custId

          })
          this.addAddressZipMinLength = this.service.countryMinLenMap.get(Number(this.address[0].country))
          this.addAddressZipMaxLength = this.service.countryMaxLenMap.get(Number(this.address[0].country))
          this.addAddressZipIsAlpha = this.service.countryMapIsAlpha.get(Number(this.address[0].country))
          this.applyValidationsOnPostalCode()
        },
        error => {

        }
      )

    }
    this.addressForm = new FormGroup({
      "country": new FormControl(country, Validators.required),
      "name": new FormControl(name, Validators.required),
      "clinicName": new FormControl(clinicName, Validators.required),
      "blockNo": new FormControl(blockNo,),
      "floorNo": new FormControl(floorNo,),
      "unitNo": new FormControl(unitNo,),
      "streetName": new FormControl(streetName,),
      "building": new FormControl(building,),
      "postal": new FormControl(postal, [Validators.required]),
      'countryName': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required),
    });
  }

  applyValidationsOnPostalCode() {
    if (this.addAddressZipIsAlpha == false)
      this.addressForm.controls["postal"].setValidators([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(this.addAddressZipMaxLength),
        Validators.minLength(this.addAddressZipMinLength),
      ]);
    else
      this.addressForm.controls["postal"].setValidators([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$"),
        Validators.maxLength(this.addAddressZipMaxLength),
        Validators.minLength(this.addAddressZipMinLength),
      ]);
  }
}
