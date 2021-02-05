import { Component, OnInit } from '@angular/core';
import { HeaderService } from './services/header.service';
import * as version from '../version.GENERATED';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SplunkLoggerService } from './services/splunk-logger.service';
import { CommonLogEvents } from 'moh-common-lib';
import { environment } from '../environments/environment';
import { SplashPageService } from './modules/splash-page/splash-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'moh-bcp';

  constructor(private headerService: HeaderService,
              private titleService: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private splunkLogger: SplunkLoggerService,
              private splash: SplashPageService) {
    version.success
      ? console.log('%c' + version.message, 'color: #036; font-size: 20px; background-color: white;')
      : console.error(version.message);
  }

  ngOnInit() {
    if (!environment.bypassSplashPage) {
      this.splash.setup();
    }
    this.headerService.title.subscribe(x => this.title = x);
    this.updateTitleOnRouteChange();
  }

  /**
   * Listen to every route change, and update the page title based on the
   * 'title' property in the route's data.
   */
  private updateTitleOnRouteChange() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe((data: { title?: string }) => {
      this.setTitle(data.title);
      this.splunkLogger.log({
        event: CommonLogEvents.navigation,
        title: data.title ? data.title : this.title,
        url: this.router.url,
      });
    });
  }

  /** Set the page title. Includes basic formatting and fallback */
  private setTitle(title?: string) {
    const app = 'Business Cost Premium | ';

    // If title is null, use default title
    this.titleService.setTitle( app.concat( (title ? title : this.title) ) );
  }
}
