import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class LoadingService {
    public pendingRequestNumber: number;
    public pendingRequests:Observable<number>;
    private prSubject: BehaviorSubject<number>;

    constructor() {
        this.prSubject = new BehaviorSubject<number>(0);
        this.pendingRequests = this.prSubject.asObservable();
        this.pendingRequestNumber = 0;
    }

    addRequest() {
        this.prSubject.next(++this.pendingRequestNumber)
    }
    removeRequest() {
        this.prSubject.next(--this.pendingRequestNumber)
    }

    isPending(){
        return this.pendingRequestNumber > 0;
    }
}