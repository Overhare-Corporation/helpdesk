import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideNzI18n(es_ES), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "helpdesk-by-overhare", appId: "1:487020696834:web:38f274e7cc36274757de1b", storageBucket: "helpdesk-by-overhare.firebasestorage.app", apiKey: "AIzaSyASZRAJtT4HxibKo8UCAxXRsJQLGyfuhhs", authDomain: "helpdesk-by-overhare.firebaseapp.com", messagingSenderId: "487020696834", measurementId: "G-J553RDKHDH" })), provideAuth(() => getAuth()), provideFirebaseApp(() => initializeApp({ projectId: "helpdesk-by-overhare", appId: "1:487020696834:web:38f274e7cc36274757de1b", storageBucket: "helpdesk-by-overhare.firebasestorage.app", apiKey: "AIzaSyASZRAJtT4HxibKo8UCAxXRsJQLGyfuhhs", authDomain: "helpdesk-by-overhare.firebaseapp.com", messagingSenderId: "487020696834", measurementId: "G-J553RDKHDH" })), provideAuth(() => getAuth()), provideMessaging(() => getMessaging())]
};
