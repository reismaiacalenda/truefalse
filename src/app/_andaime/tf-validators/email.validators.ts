import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { consoleLog } from '../../globals';

var regex:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function ValidateEmail(control: AbstractControl) {
  // if (regex.test(String(control.value).toLowerCase())){
// consoleLog("oi")
// consoleLog(control.value.name)
  if (control.value != undefined && control.value.name != undefined && isValidEmail(control.value.name) != true){
    control.setErrors({validEmail: false})
  }
}

export function isValidEmail(input: String) {
  return regex.test(String(input).toLowerCase())
}

export function ValidateEmailSelectMulti(control: AbstractControl):ValidatorFn{
  var arrayClone = [...control.value];
  var arrayParaIterar = [...control.value];
  // arrayClone.push(Object.assign({}, control.value))
  // arrayParaIterar.push(Object.assign({}, control.value))
// consoleLog(arrayParaIterar);
// if (arrayClone != null && arrayClone != []){
  if (arrayClone != null && arrayClone.length > 0){
    var valid = true;
    var multiplas_entradas;
    arrayParaIterar.forEach((input, index) => {
      var validLocal = true;
      multiplas_entradas = input["name"].split(" ");
      if (multiplas_entradas.length == 1){
        if (!isValidEmail(multiplas_entradas[0])){
          valid = false;
        }
      }else{
        var array_entradas_novas:any[] = []
        multiplas_entradas.forEach(subemail => {
          if (!isValidEmail(subemail)){
            validLocal = false;
            valid=false;
          }
          // else{
            var repetido = false;
            arrayClone.forEach(inputB=>{
              if (inputB["name"] == subemail){
                repetido = true;
              }
            })
            if (repetido == false){
              array_entradas_novas.push({name: subemail})
            }
          // }
        });
        // if (validLocal == true){
          arrayClone.splice(index,1)
          arrayClone = arrayClone.concat(array_entradas_novas);
        // }else {
          // valid = false;
        // }
      }
    });
    control.setValue(arrayClone);

    if (valid != true){
    // consoleLog("retnoufalse")
      control.setErrors({validEmail: false})
    }
    // if(multiplas_entradas.length > 1){
    // }
  }
  // if (control != undefined ){
  //   control
  // }
  return;

  // // consoleLog("ta vindo o que no valide email maluco?")
  // consoleLog(formArray)

  // if (formArray.value != undefined && formArray.value.length > 0){
  // // consoleLog("q")
  //   formArray.value.forEach(c => {
  //     // if (!ValidateEmail(c)){
  //   // consoleLog("oi")
  //   // consoleLog(c['name'])
  //   // consoleLog(ValidateEmail(c['name']))
  //     formArray.setErrors(ValidateEmail(c['name']))
  //     // c.updateValueAndValidity();
  //     // }
  //     // consoleLog("control");
  //     // consoleLog(c);
  //     // consoleLog("validate emails:");
  //     // consoleLog(ValidateEmail(c));
  //     // consoleLog("formArray.valid:" + formArray.valid)
  //     // consoleLog("c.valid:" + c.valid)
  //   });
  //   // formArray.updateValueAndValidity()
  // }
  // return;
}