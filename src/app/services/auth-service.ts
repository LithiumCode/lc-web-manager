// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { updatePassword } from 'firebase/auth';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  async updateUserPassword(newPassword: string): Promise<void> {
    const currentUser = await firstValueFrom(user(this.auth));

    if (!currentUser) {
      throw new Error('Usuário não está autenticado.');
    }

    await updatePassword(currentUser, newPassword);
  }
}

