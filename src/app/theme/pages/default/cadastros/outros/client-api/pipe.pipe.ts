import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipe'
})
export class PipePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let values= value.split(',');
    let result=''
    for(let v of values)
    {
      result+=(v) + ", ";
    }
    return result;
  }

  captitalize(value:string)
  {
    return value.substr(0,1).toUpperCase() + value.substr(1).toLowerCase();
  }

}
