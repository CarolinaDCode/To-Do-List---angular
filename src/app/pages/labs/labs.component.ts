import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})

export class LabsComponent { 
  welcome = 'Bienvenido';
  tasks = signal([
    'Instalar el angular CLI',
    'Crear proyecto',
    'Crear componente',
    'Crear servicio'
  ]);

  name = signal('Juan Jose Molina');
  age = '30 años';
  disabled = true;
  img = 'https://static.eldiario.es/clip/ab74aa95-3656-424c-8ca1-dce590aabb97_16-9-discover-aspect-ratio_default_0.jpg';
  
  person = signal({
    nombre : 'Diana',
    age : 30,
    edad : '30',
    signo : 'Geminis',
    comidaFav : 'Ceviche',
    avatar : 'https://www.purina.es/sites/default/files/2021-12/Welcoming_teaser.jpg'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });

  nameCtrl = new FormControl('nicolas',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(
      value => console.log(value));
  }

  clickHandler(){
    alert('Hola');
  }

  changeHandler(event: Event){
    const input =  event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  keydownHandler(event: KeyboardEvent){
    const input =  event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
  }

  changeName(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        nombre: newValue
      }
    })
  }
}
