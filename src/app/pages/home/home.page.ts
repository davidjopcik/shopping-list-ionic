import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonIcon, IonFab, IonFabButton, IonAlert } from '@ionic/angular/standalone';
import { ShoppingList } from 'src/app/models/shopping-item';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonProgressBar } from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';


  const DEFAULT_LISTS: ShoppingList[] = [
  {
    id: 1,
    name: 'Potraviny',
    owner: 'Peter',
    items: [
      { id: 101, name: 'Chlieb', purchased: false, category: 'Pečivo' },
      { id: 102, name: 'Mlieko', purchased: true, category: 'Mliečne výrobky' },
      { id: 103, name: 'Maslo', purchased: false, category: 'Mliečne výrobky' }
    ]
  },
  {
    id: 2,
    name: 'Domácnosť',
    owner: 'Zuzka',
    items: [
      { id: 201, name: 'Toaletný papier', purchased: false, category: 'Hygiena' },
      { id: 202, name: 'Čistiaci prostriedok', purchased: true, category: 'Upratovanie' }
    ]
  },
  {
    id: 3,
    name: 'Záhrada',
    owner: 'Ján',
    items: [
      { id: 301, name: 'Kvetináče', purchased: false, category: 'Záhradníctvo' },
      { id: 302, name: 'Zemina', purchased: false, category: 'Záhradníctvo' },
      { id: 303, name: 'Rukavice', purchased: true, category: 'Príslušenstvo' }
    ]
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonAlert, IonProgressBar, IonFab, IonIcon, IonButton, IonCardContent, IonCardTitle, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {


  shoppingLists: ShoppingList[] = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.loadShoppingLists()
  }

  ngOnInit() {
  const data = localStorage.getItem('shopping-lists');
    localStorage.setItem('shopping-lists', JSON.stringify(DEFAULT_LISTS));
    DEFAULT_LISTS.forEach(list => {
      localStorage.setItem(`shopping-list-${list.id}`, JSON.stringify(list.items));
    });
  this.loadShoppingLists();
}


  getTotalItems(list: ShoppingList): number {
    return list.items.length
  }

  getPurchasedItems(list: ShoppingList): number {
    return list.items.filter(item => item.purchased).length
  }

  openList(id: number) {
    this.router.navigate(['/tabs/list', id]);
  }

  saveShoppingList() {
    localStorage.setItem('shopping-lists', JSON.stringify(this.shoppingLists))
  }

  loadShoppingLists() {
    const data = localStorage.getItem('shopping-lists');
    if (data) {
      this.shoppingLists = JSON.parse(data);
      this.shoppingLists.forEach(list => {
        const storedItems = localStorage.getItem(`shopping-list-${list.id}`);
        list.items = storedItems ? JSON.parse(storedItems) : [];
      });
    }
  }


  async showTestAlert() {
  console.log('Spúšťam alert...');

  try {
    const alert = await this.alertCtrl.create({
      header: 'Test',
      message: 'Funguje alert na Androide?',
      buttons: ['OK']
    });

    await alert.present();
    console.log('Alert zobrazený');
  } catch (err) {
    console.error('Chyba pri zobrazení alertu:', err);
  }
}

  public alertInputs = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Názov zoznamu'
  },
  {
    name: 'owner',
    type: 'text',
    placeholder: 'Majiteľ zoznamu'
  }
];

public alertButtons = [
  {
    text: 'Zrušiť',
    role: 'cancel'
  },
  {
    text: 'Pridať',
    role: 'confirm',
    handler: (data: any) => {
      if (!data.name || !data.owner) return false;
      const newList: ShoppingList = {
        id: Date.now(),
        name: data.name,
        owner: data.owner,
        items: [],
      };
      this.shoppingLists.push(newList);
      this.saveShoppingList();
      return true;
    }
  }
];

  async addShoppingList() {
    const alert = await this.alertCtrl.create({
      header: 'Nový zoznam',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Názov zoznamu'
        },
        {
          name: 'owner',
          type: 'text',
          placeholder: 'Majiteľ zoznamu'
        }
      ],
      buttons: [
        {
          text: 'Zrušiť',
          role: 'Cancel'
        },
        {
          text: 'Pridať',
          handler: (data) => {
            const newShoppingList = {
              id: Date.now(),
              name: data.name,
              owner: data.owner,
              items: [],
            }
            this.shoppingLists.push(newShoppingList)
            this.saveShoppingList()
          }
        }
      ]
    })
    await alert.present();
  }

deleteShoppingList(id: number) {
  this.shoppingLists = this.shoppingLists.filter(item => item.id !== id);
  this.saveShoppingList();
}
 
}
