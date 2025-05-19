import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Route, Router } from '@angular/router';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ExportPage {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  exportData() {
    const rawLists = localStorage.getItem('shopping-lists');
    if (!rawLists) return;

    const parsedLists = JSON.parse(rawLists);

    const listsWithItems = parsedLists.map((list: any) => {
      const itemsKey = `shopping-list-${list.id}`;
      const items = localStorage.getItem(itemsKey);
      return {
        ...list,
        items: items ? JSON.parse(items) : []
      };
    });

    const dataToExport = {
      shoppingLists: listsWithItems
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'nakupne-zoznamy.json';
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Export dokončený');
  }

  triggerImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event: any) => this.importData(event);
    input.click();
  }

  importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        if (Array.isArray(data.shoppingLists)) {
          const simplifiedLists = data.shoppingLists.map((list: any) => ({
            id: list.id,
            name: list.name,
            owner: list.owner
          }));

          localStorage.setItem('shopping-lists', JSON.stringify(simplifiedLists));

          data.shoppingLists.forEach((list: any) => {
            const items = Array.isArray(list.items) ? list.items : [];
            localStorage.setItem(`shopping-list-${list.id}`, JSON.stringify(items));
          });

          this.showToast('Import prebehol úspešne');
        } else {
          this.showToast('Neplatný formát súboru');
        }
      } catch (err) {
        this.showToast('Chyba pri načítaní JSON');
      }
    };

    reader.readAsText(file);
  }
  
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

}
