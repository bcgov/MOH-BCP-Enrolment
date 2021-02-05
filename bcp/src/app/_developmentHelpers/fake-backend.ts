import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { mergeMap, delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Injectable } from '@angular/core';
import { FakeBackendService } from './fake-backend.service';
import { environment } from '../../environments/environment';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor  {

  constructor( private fakebackendService: FakeBackendService ) { }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    // wrap in delayed observable to simulate server api call
    return of(null).pipe( mergeMap(() => {

      console.log( 'Request (fakeBackend interceptor)', request );

      if ( 'POST' === request.method ) {
        let payload = null;
        console.log( 'Post method' );

        if (request.url.includes( 'validatePractitioner' ) ) {
          console.log( 'Fake-backend for Validating practitioner/MD' );
          payload = this.fakebackendService.validatePractitioner( request );
        }

        if (request.url.includes( 'validateFacility' ) ) {
          console.log( 'Fake-backend for Validating facility/ID' );
          payload = this.fakebackendService.validateFacility( request );
        }

        if (request.url.includes( 'createFacility' ) ) {
          console.log( 'Fake-backend for create facility' );
          payload = this.fakebackendService.createFacility( request );
        }

        if (request.url.includes( 'maintainPractitioner' ) ) {
          console.log( 'Fake-backend for maintain practitioner' );
          payload = this.fakebackendService.maintainPractitioner( request );
        }

        if (request.url.includes( 'bcpAttachment' )) {
          console.log( 'Fake-backend for create facility' );
          payload = this.fakebackendService.bcpAttachment ( request );
        }

        if (request.url.includes( 'logging' )) {
          console.log( 'Fake-backend for logging - nothing logged' );
          payload = 'success';
        }

        if ( payload ) {

          console.log( 'Sending reponse from fake-backend: ', payload );
          return of(new HttpResponse({ status: 200, body: payload }))
            .pipe(delay(2500));
        }
      }

      // Pass through to actual service
      return next.handle( request );
    }));
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

