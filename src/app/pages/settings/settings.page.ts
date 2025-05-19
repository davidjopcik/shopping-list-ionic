import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  AlertController, ToastController } from '@ionic/angular';
import {
  IonToggle,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonNote,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAlert,
} from '@ionic/angular/standalone';
import { HomePage } from '../home/home.page';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,  IonToggle,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonNote,
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAlert,]
})
export class SettingsPage {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  language: string = 'sk';

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {}

  toggleDarkMode(enabled: boolean) {
    document.body.classList.toggle('dark', enabled);
    localStorage.setItem('dark-mode', JSON.stringify(enabled));
  }

  saveLanguage() {
    localStorage.setItem('app-language', this.language);
    this.showToast('Jazyk uložený');
  }

  exportAllData() {
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

  async confirmReset() {
    const alert = await this.alertCtrl.create({
      header: 'Potvrdiť vymazanie',
      message: 'Naozaj chceš vymazať všetky uložené dáta?',
      buttons: [
        { text: 'Zrušiť', role: 'cancel' },
        {
          text: 'Vymazať',
          handler: () => {
            localStorage.clear();
            this.showToast('Dáta boli vymazané');
            setTimeout(() => {
            window.location.reload(); 
          }, 500);
          }
        }
      ]
    });
    await alert.present();

  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'primary'
    });
    await toast.present();
  }

  ngOnInit() {
    const storedLang = localStorage.getItem('app-language');
    if (storedLang) this.language = storedLang;

    const dark = localStorage.getItem('dark-mode');
    if (dark === 'true') {
      document.body.classList.add('dark');
    }
  }
}