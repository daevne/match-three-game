import { Gem } from './gem.model';

export class Table {
  maxRows = 10;
  maxCols = 10;
  board: Gem[][] = [];

  init(): Table {
    for (let i = 0; i < this.maxRows; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.maxCols; j++) {
        let gem = new Gem().init();
        gem.type = 'gem';
        this.board[i][j] = gem;
      }
    }
    return this;
  }
}

