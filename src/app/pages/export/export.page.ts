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
  ) {}

  exportData() {
    const lists = localStorage.getItem('shopping-lists');
    if (!lists) return;

    const parsedLists = JSON.parse(lists);
    const dataToExport: {
  shoppingLists: any[],
  items: Record<number, any[]>
} = {
  shoppingLists: parsedLists,
  items: {}
};

    parsedLists.forEach((list: any) => {
      const itemsKey = `shopping-list-${list.id}`;
      const items = localStorage.getItem(itemsKey);
      if (items) {
        dataToExport.items[list.id] = JSON.parse(items);
      }
    });

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

  importData(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.shoppingLists && data.items) {
          localStorage.setItem('shopping-lists', JSON.stringify(data.shoppingLists));
          data.shoppingLists.forEach((list: any) => {
            const items = data.items[list.id] || [];
            localStorage.setItem(`shopping-list-${list.id}`, JSON.stringify(items));
          });
          this.showToast('Import prebehol úspešne');
        } else {
          alert('Neplatný formát súboru.');
        }
      } catch (err) {
        alert('Chyba pri načítaní JSON.');
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
