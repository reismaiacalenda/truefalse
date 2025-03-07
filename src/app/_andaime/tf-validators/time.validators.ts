import { AbstractControl, FormGroup } from '@angular/forms';
import { consoleLog } from '../../globals';

export function ValidateTime(control: AbstractControl) {
  var value:string = control.value
  if (value.split(":")[1]=="00" || value.split(":")[1]=="30"){
    return null;
  }
  else if (value.split(":")[0]=="--" || value.split(":")[1]=="--"){
    return {validTime: false}
  }
  else {
    return { validTime: false}
  }
  
}

export function ValidateTimeInterval(hr_inicio, hr_fim){
  return (group: FormGroup): {[key: string]: any} => {
    var dateInicio = new Date(`01/01/2000 ${group.controls[hr_inicio].value}`);
    var dateFim = new Date(`01/01/2000 ${group.controls[hr_fim].value}`);
    if (dateInicio.getTime() >= dateFim.getTime()){
      group.controls[hr_fim].setErrors({timeInterval: true})      
      return null
    }
  }
  // var dateInicio = new Date(`01/01/2000 ${formGroup.controls['hr_inicio'].value}`);
  // var dateFim = new Date(`01/01/2000 ${formGroup.controls['hr_fim'].value}`);

  // if (dateInicio.getTime() < dateFim.getTime()){
  //   // return null;
  //   consoleLog("if")
  // }else{
  //   consoleLog("else");
  //   formGroup.controls['hr_fim'].setErrors( { validTimeInterval: false})
  //   consoleLog(formGroup.controls['hr_fim'].valid)
  // }
  // return;
  
}