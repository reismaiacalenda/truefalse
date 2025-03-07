import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

var regex:RegExp = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/;

export function ValidateCnpj(control: AbstractControl) {
  if (regex.test(String(control.value).toLowerCase())){
    return null;
  }else{
    return {validCnpj: false}
  }
}

export function isValidCnpj(input: String) {
  return regex.test(String(input).toLowerCase())
}

export function ValidateCnpjSelectMulti(formArray: FormArray):ValidatorFn{
  formArray.controls.forEach((c:FormGroup) => {
    c.setErrors(ValidateCnpj(c.controls['cnpj']))
  });
  return;
}