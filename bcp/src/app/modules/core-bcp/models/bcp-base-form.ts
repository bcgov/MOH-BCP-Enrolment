import { AbstractReactForm , ContainerService, PageStateService} from 'moh-common-lib';
import { OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

export class BcpBaseForm extends AbstractReactForm implements OnInit, AfterViewInit, OnDestroy {

  links = environment.links;

  private _subscription: Subscription;

  constructor( protected router: Router,
               protected containerService: ContainerService,
               protected pageStateService: PageStateService ) {
    super(router);
  }

  ngOnInit() {
    // console.log( 'BCP base form - OnInit' );

    // Default behaviour for most pages - override if need different functionality
    this.containerService.setSubmitLabel();
    this.containerService.setUseDefaultColor();

    this.pageStateService.setPageIncomplete();
  }

  ngAfterViewInit() {
    this._subscription = this.containerService.$continueBtn.subscribe(
      (obs) => {
        // console.log( 'BCP base form - continue button clicked' );
        this.continue();
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  continue() {
    // console.log( 'Continue: BCP base form to be overriden');
  }

  protected navigate( url: string ) {
    // console.log( 'BCP base form - navigate' );

    this.pageStateService.setPageComplete();
    super.navigate(url);
  }
}
