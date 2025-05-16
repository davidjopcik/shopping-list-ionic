import { Routes } from '@angular/router';

export const routes: Routes = [
  {
     path: '',
    redirectTo: 'tabs/home',
      pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'import-export',
        loadComponent: () =>
          import('./pages/export/export.page').then((m) => m.ExportPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
      },
      {
        path: 'list/:id',
        loadComponent: () => import('./pages/list-detail/list-detail.page').then(m => m.ListDetailPage)
}
    ]
  }

];