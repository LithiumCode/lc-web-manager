import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/']);
        resolve(false);
      }
    });
  });
};