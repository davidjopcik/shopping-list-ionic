import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { ShoppingList } from 'src/app/models/shopping-item';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonProgressBar } from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonProgressBar, IonFabButton, IonFab, IonIcon, IonItem, IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  shoppingLists: ShoppingList[] = [];
  public progress = 0;

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter(){
    this.loadShoppingLists()
  }

  ngOnInit() {
    this.loadShoppingLists()
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

  async addShoppingList() {
    console.log('Nova Funkcia sa spustila');
  const alert = await this.alertCtrl.create({
    header: 'Test Alert',
    message: 'Funguje to?',
    buttons: ['OK']
  });

  await alert.present();
}

  async addShoppingList1() {
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

  async deleteShoppingList(id: number, event: Event) {
    event.stopPropagation()
    const alert = await this.alertCtrl.create({
      header: 'Naozaj chcete vymazať zoznam ' + this.shoppingLists.filter(item => item.id == id)[0].name + "? ",
      buttons: [
        {
          text: 'Zrušiť',
          role: 'Cancel'
        },
        {
          text: 'Vymazať',
          handler: () => {
            this.shoppingLists = this.shoppingLists.filter(item => item.id !== id)
           this.saveShoppingList()
          }
        }
      ]
    })
    await alert.present()
    this.saveShoppingList()
  }
}
