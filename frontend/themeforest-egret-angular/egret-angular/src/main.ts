import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app/app.component';
import { rootRouterConfig } from './app/app.routing';
import { environment } from './environments/environment';
import { InMemoryDataService } from './app/shared/inmemory-db/inmemory-db.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { RoutePartsService } from './app/shared/services/route-parts.service';
import { ThemeService } from './app/shared/services/theme.service';
import { LayoutService } from './app/shared/services/layout.service';
import { AppLoaderService } from './app/shared/services/app-loader/app-loader.service';
import { AuthGuard } from './app/shared/guards/auth.guard';
import { NavigationService } from './app/shared/services/navigation.service';
import { AppConfirmService } from './app/shared/services/app-confirm/app-confirm.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(rootRouterConfig),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    RoutePartsService,
    ThemeService,
    LayoutService,
    AppLoaderService,
    AuthGuard,
    NavigationService,
    AppConfirmService,
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true, delay: 200 }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
}).catch(err => console.log(err));