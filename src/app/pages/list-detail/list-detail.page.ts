import { Component, IterableDiffers, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonCheckbox, IonLabel, IonInput, IonButton, IonFabButton, IonFab, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { ShoppingItem } from 'src/app/models/shopping-item';
import { ActivatedRoute } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss'],
  standalone: true,
  imports: [IonFooter, IonIcon, IonFab, IonButton, IonFabButton, IonInput, IonLabel, IonCheckbox, IonItem,  IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListDetailPage implements OnInit {
  listId!: number;
  listName: string = '';
  newItemName: string = "";
  items: ShoppingItem[] = [];
  purchased: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.listId = Number(this.route.snapshot.paramMap.get('id'))
    this.loadItems()

    const data = localStorage.getItem('shopping-lists');
  if (data) {
    const lists = JSON.parse(data);
    const currentList = lists.find((l: any) => l.id === this.listId);
    if (currentList) {
      this.listName = currentList.name;
    }
  }
  }

  get activeItems() {
    return this.items.filter(item => !item.purchased)
  }

  get purchasedItems() {
    return this.items.filter(item => item.purchased)
  }

  saveItems() {
    localStorage.setItem(`shopping-list-${this.listId}`, JSON.stringify(this.items));
  }

  loadItems() {
    const data = localStorage.getItem(`shopping-list-${this.listId}`);
    if (data) {
      this.items = JSON.parse(data);
    }
  }

  addItem(){
    if(this.newItemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: this.newItemName.trim(),
        purchased: false,
        selected: false,
      };
      this.items.push(newItem);
      this.newItemName = '';
      this.saveItems()      
    }
    
  }

  markPurchased(){
    this.items.forEach(item =>{
      console.log('Slected '+item.selected);
      console.log('purchased '+item.purchased);
      
      if(item.selected){
        item.purchased = true;
        item.selected = false;
      }
    })
    this.saveItems()
  }

  clearPurchased() {
    this.items = this.items.filter(item => !item.purchased)
    this.saveItems()
  }

  togglePurchasedVisibility() {
    this.purchased = !this.purchased; 
  }


}
