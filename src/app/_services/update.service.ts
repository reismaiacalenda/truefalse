import { SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";

export class UpdateService {

  constructor(public updates: SwUpdate) {
    console.log("constrindo updates sw update")
    if (updates.isEnabled) {
      console.log("tá enabled sim. fazendo interval");
      interval(5000).subscribe(() => updates.checkForUpdate()
        .then((evt) => {
          console.log('checking for updatesasdasdasdas. evt:')
          console.log(evt)
        }));
    }
  }

  public checkForUpdates(): void {
    console.log("checking for update");
    this.updates.versionUpdates.subscribe(event => {
      console.log("updates.versionUpdates disparou evento:");
      console.log(event);
      this.promptUser()
    });
  }

  private promptUser(): void {
    console.log('updating to new version...');
    this.updates.activateUpdate().then((evt) => {
      console.log("Opa, tamo aqui no then do activateupdate. evt:");
      console.log(evt)
      document.location.reload()
    }); 
  }
}