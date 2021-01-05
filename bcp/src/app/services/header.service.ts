import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _title: BehaviorSubject<string> = new BehaviorSubject('');
  public title: Observable<string> = this._title.asObservable();
  // private PREFIX = environment.appConstants.serviceName;

  constructor() { }

  setTitle(newTitle: string) {
    this._title.next(newTitle);
  }
}
