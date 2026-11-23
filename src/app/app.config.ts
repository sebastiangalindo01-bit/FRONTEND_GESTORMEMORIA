import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG
} from 'keycloak-angular';

import { routes } from './app.routes';

// El interceptor agregará el token únicamente
// a las peticiones dirigidas a memoria-service.
const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^http:\/\/localhost:8080\/.*/i,
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideKeycloak({
      config: {
        url: 'http://localhost:8081',
        realm: 'gestor-memoria',
        clientId: 'frontend-angular'
      },
      initOptions: {
        onLoad: 'login-required',
        pkceMethod: 'S256'
      }
    }),

    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [urlCondition]
    },

    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor])
    )
  ]
};
