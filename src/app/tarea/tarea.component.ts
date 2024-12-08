import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit {
  notas: any[] = [];
  arrastrando: boolean = false;
  notaActual: number | null = null;
  offsetX: number = 0;
  offsetY: number = 0;
  mostrarAdvertencia: boolean = false; // Añadir esta línea

  crearNota() {
    const hayNotaVacia = this.notas.some(nota => nota.texto.trim() === '');
    if (hayNotaVacia) {
      this.mostrarAdvertencia = true;
      setTimeout(() => this.mostrarAdvertencia = false, 3000); // Oculta el mensaje después de 3 segundos
      return;
    }
    const nuevaNota = {
      texto: '',
      fecha: new Date(),
      posicion: { x: 100, y: 100 },
      rotacion: Math.random() * 30 - 15 // Rotación aleatoria entre -15 y 15 grados
    };
    this.notas.push(nuevaNota);
    this.guardarNotas();
  }

  eliminarNota(index: number) {
    this.notas.splice(index, 1);
    this.guardarNotas();
  }

  guardarNotas() {
    localStorage.setItem('notas', JSON.stringify(this.notas));
  }

  cargarNotas() {
    const notasGuardadas = localStorage.getItem('notas');
    if (notasGuardadas) {
      this.notas = JSON.parse(notasGuardadas);

      // Ordenar las notas por fecha
      this.notas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      // Ajustar posiciones para pantallas móviles
      if (window.innerWidth <= 768) {
        let yOffset = 0;
        this.notas.forEach(nota => {
          nota.posicion.x = 0; // No es necesario ajustar x, el CSS se encarga
          nota.posicion.y = yOffset; // Posicionar una debajo de otra
          yOffset += 220 + 40; // Incrementar el offset para la siguiente nota, considerando el margen inferior
        });
      } else {
        const margen = 20;
        const maxX = window.innerWidth - 200 - margen;
        const maxY = window.innerHeight - 200 - margen;

        this.notas.forEach(nota => {
          if (nota.posicion.x > maxX) {
            nota.posicion.x = maxX;
          }
          if (nota.posicion.y > maxY) {
            nota.posicion.y = maxY;
          }
        });
      }
    }
  }

  ngOnInit() {
    this.cargarNotas();
  }

  iniciarArrastre(event: MouseEvent, index: number) {
    this.arrastrando = true;
    this.notaActual = index;
    this.offsetX = event.clientX - this.notas[index].posicion.x;
    this.offsetY = event.clientY - this.notas[index].posicion.y;
  }

  @HostListener('document:mousemove', ['$event'])
  moverNota(event: MouseEvent) {
    if (this.arrastrando && this.notaActual !== null) {
      const nuevaX = event.clientX - this.offsetX;
      const nuevaY = event.clientY - this.offsetY;

      // Limitar la posición dentro de los límites de la pantalla con un margen de 30 píxeles
      const margen = 70;
      const maxX = window.innerWidth - 200 - margen; // Ancho de la nota
      const maxY = window.innerHeight - 200 - margen; // Alto de la nota

      this.notas[this.notaActual].posicion.x = Math.max(margen, Math.min(nuevaX, maxX));
      this.notas[this.notaActual].posicion.y = Math.max(margen, Math.min(nuevaY, maxY));

      this.guardarNotas();
    }
  }

  @HostListener('document:mouseup')
  detenerArrastre() {
    this.arrastrando = false;
    this.notaActual = null;
  }
}
