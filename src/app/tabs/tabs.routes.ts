import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'list/:id',
        loadComponent: () =>
          import('../pages/list-detail/list-detail.page').then((m) => m.ListDetailPage),
      },
      {
        path: 'import-export',
        loadComponent: () =>
          import('../pages/export/export.page').then((m) => m.ExportPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      }
    ]
  }
];