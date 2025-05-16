import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
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
    const lists = localStorage.getItem('shopping-lists');
    if (!lists) return;

    const parsedLists = JSON.parse(lists);
    const dataToExport: { shoppingLists: any[], items: Record<number, any[]> } = {
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
    this.fileInput?.nativeElement.click();
  }

  importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
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
          this.showToast('Import úspešný');
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