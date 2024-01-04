import { CommonModule } from '@angular/common';
import { Component, Injector,signal, computed, effect, inject } from '@angular/core';
import { Task } from './../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal([
    'Instalar el angular CLI',
    'Crear proyecto',
    'Crear componente',
    'Crear servicio'
  ]);

  /**Será un Array Vacio */
  tareas = signal<Task[]>([]);

  filter = signal('all');
  tasksByFilter = computed(()=>{
    //Elementos que van a Reaccionar cuándo ellos cambien.
    const filter = this.filter();
    const tasks = this.tareas();
    if (filter === 'pending') {
      return tasks.filter(task=>!task.completed)
    };
    if (filter === 'completed') {
      return tasks.filter(task=>task.completed)
    }
    return tasks;
  })

  // '' => valor por defecto
  // nonNullable => valor no nulo
  // elementos requeridos
  // Validators.pattern() => validacion con expr. regular que cumpla con un patrón en especifico
    newsTaskCtrl = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ]
    });

  /**
  Diferencias entre Computed y Effect:
  Su utilidad, si bien ambos hacen tracking, viligan cada vez que algo cambia y
  respecto a eso, ejecutar una lógica, COMPUTED, siempre retorna, calcula un estado
  a partir de otros, EFFECT, no deberia retornar, en este caso cada vez que una tarea cambie
  la voy almacenar en el localStorage
  */
  /** 
   * En este caso effect nos sirve para hacer seguimiento a los cambios que existe en el objeto tareas.
   * Este Effect debe ser agregado en otro lugar que no sea el constructor, porque corre con el array 
   * que inicia en vacio y asi haya guardado tareas, al recargar inicia en vacio.
   * El effect lee cualquier actividad, incluso el estado inicial, que es el array en vacio
   */
    //Injector de effect
  injector = inject(Injector);

  /**
   * ngOnInit: Cuándo Inicializa el componente
   * Lectura: Se inicializa la aplicación, revisa si existe 'tasks',
   * si existe, lo almacena en el array.
   * Luego, evalua si hay cambios con effects y si hay los guarda en localStorage
   */
  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tareas.set(tasks);
    }
    this.trackTasks();
  }

  /**
   * Cuándo effect es utilizado en otro lugar que no seas el constructor,
   * debe ser utilizado con un inyector.
   */
  trackTasks(){
    effect(()=>{
      const tasks = this.tareas();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },{injector: this.injector})
  }

  newTaskCtrl = new FormControl();

  changeHandlerColor(){
    //FormControl tiene estados: esto nos 
    //permite saber si un input es válido o no
    //Si el dato ingresado por el input cumple con las
    //validaciones pasadas por newTaskCtrl, guarda el dato
    // en la lista
    // trim(): quita espacios (antes y despues de un texto)
    if (this.newTaskCtrl.valid){
      if (this.newTaskCtrl.value != null){
        const value = this.newTaskCtrl.value.trim();
        if (value !== '') {
          this.addTask(value); //Almacena el valor
          this.newTaskCtrl.setValue(''); //Cuándo el dato se almacena en la lista, limpia el input
        }
      }
    }
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTasks = input.value;
    this.addTask(newTasks);
    // this.tasks.update((tasks) => [...tasks, newTasks])
  }

  addTask(title: string){
    const newTasks = {
      id: Date.now(),
      title,
      completed: false
    };
    this.tareas.update((tareas) => [...tareas, newTasks])
  }

  deleteTask(index: number){
    // this.tasks.update((tasks) => tasks.filter((task, position)=> position !== index));
    this.tareas.update((tareas) => tareas.filter((tarea, position)=> position !== index));
  }

  updateTask(index: number) {
    console.log("ingreso tachar");
    this.tareas.update(prevState => {
      return prevState.map((task, position)=>{
        if(position === index){
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    });
    
    // this.tareas.mutate(state => {
    //   const currentTask = state[index];
    //   state[index] = {
    //     ...currentTask,
    //     completed: !currentTask.completed
    //   }
    // })
  }

  updateTaskEditingMode(index: number){
    console.log("ingreso edit");
    this.tareas.update(prevState => {
      return prevState.map((task, position)=>{
        if(position === index){
          return {
            ...task,
            editing: true
          }
        }
        //Solo se activará el edit para una sola tarea
        return {
          ...task,
          editing: false
        }
      })
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tareas.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task
      })
    })
  }

  changeFilter(filter: string){
    this.filter.set(filter);
  }
}
