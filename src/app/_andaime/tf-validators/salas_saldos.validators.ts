import { FormArray, ValidatorFn, FormControl, FormGroup } from '@angular/forms';
import { consoleLog } from '../../globals';

// export function ValidateEspacoSaldosUnico(formArray: FormArray):ValidatorFn{
  // consoleLog("ta vindo o que no valide email maluco?")
  // (formArray.get('saldos_attributes') as FormArray).controls
  //   .forEach((saldo:FormGroup) => {
  //     saldo.get('espacos_attributes').value
  //       .forEach((espaco:any) => {
  //         espaco.id

  //       });
  //   })
  // formArray.controls.forEach((c:FormGroup) => {
  //   // if (!ValidateEmail(c)){
    // c.setErrors(ValidateEmail(c.controls['email']))
    // c.updateValueAndValidity();
    // }
    // consoleLog("control");
    // consoleLog(c);
    // consoleLog("validate emails:");
    // consoleLog(ValidateEmail(c));
    // consoleLog("formArray.valid:" + formArray.valid)
    // consoleLog("c.valid:" + c.valid)
  // });
  // return;
  // formArray.updateValueAndValidity()
// }