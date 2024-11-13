import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameTableComponent } from './components/game-table/game.table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'match-three-game';
}
