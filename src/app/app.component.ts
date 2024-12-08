import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TareaComponent } from './tarea/tarea.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TareaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lista_tareas';
}
