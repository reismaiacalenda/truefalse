import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

var regex:RegExp = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

export function ValidateCpf(control: AbstractControl) {
  if (regex.test(String(control.value).toLowerCase())){
    return null;
  }else{
    return {validCpf: false}
  }
}

export function isValidCnpj(input: String) {
  return regex.test(String(input).toLowerCase())
}

export function ValidateCnpjSelectMulti(formArray: FormArray):ValidatorFn{
  formArray.controls.forEach((c:FormGroup) => {
    c.setErrors(ValidateCpf(c.controls['cpf']))
  });
  return;
}