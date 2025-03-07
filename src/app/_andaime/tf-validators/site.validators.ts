import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

var regex:RegExp = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/;

export function ValidateSite(control: AbstractControl) {
  if (regex.test(String(control.value).toLowerCase())){
    return null;
  }else{
    return {validSite: false}
  }
}

export function isValidSite(input: String) {
  return regex.test(String(input).toLowerCase())
}

export function ValidateSiteSelectMulti(formArray: FormArray):ValidatorFn{
  formArray.controls.forEach((c:FormGroup) => {
    c.setErrors(ValidateSite(c.controls['site']))
  });
  return;
}