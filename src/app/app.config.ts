import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { routes } from './app.routes'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { environment } from '../environments/enviroments'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getStorage, provideStorage } from '@angular/fire/storage'
import { provideEchartsCore } from 'ngx-echarts';

const firebaseConfig = environment.firebase

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideEchartsCore({ echarts: () => import('echarts') }),
  ]
}
