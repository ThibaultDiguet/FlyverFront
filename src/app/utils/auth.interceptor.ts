import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import {filter, mergeMap} from 'rxjs';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh')) {
    return next(req);
  }

  return authService.accessToken$.pipe(
    filter(accessToken => accessToken !== null),
    mergeMap(accessToken => {
      if (accessToken) {
        const clonedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });
        return next(clonedRequest);
      }
      return next(req);
    })
  );
};
