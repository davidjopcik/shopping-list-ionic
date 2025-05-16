import { Component } from '@angular/core';
import { IonHeader, IonTitle, IonContent, IonText, IonItem, IonLabel, IonInput, IonButton, IonToolbar } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonToolbar, FormsModule, IonButton, IonInput, IonLabel, IonItem, IonText, IonContent, IonTitle, IonHeader]
})
export class ProfilePage {
  profile = {
    name: '',
    email: '',
    password: '',
    photo: ''
  };

  saveProfile() {
    localStorage.setItem('user-profile', JSON.stringify(this.profile));
    alert('Profil uložený!');
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.photo = reader.result as string;
      this.saveProfile(); 
    };
    reader.readAsDataURL(file); 
  }

  ngOnInit() {
    const data = localStorage.getItem('user-profile');
    if (data) {
      this.profile = JSON.parse(data);
    }
  }
}