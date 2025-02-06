export let globals = {
  printable: false,
  debug: false,
  asideOpen: false,
  flagAside: false
};

export function consoleLog(log: any) {
  if (globals.debug == true){
    console.log(log);
    // console.log(getMethodName());
  }
}

export function printable(){
  if (globals === undefined || globals.printable === undefined){
    return false;
  }else{
    return !globals.printable;
  }
}

// function getMethodName() {
//   var err = new Error();
//   return /at \w+\.(\w+)/.exec(err.stack.split('\n')[2])[1] // we want the 2nd method in the call stack

// }