import { Injectable } from '@angular/core';
import { Gem } from '../models/gem.model';

@Injectable({
  providedIn: 'root'
})
export class GemService {
  getRow(board: Gem[][], gem: Gem): number {
    return board.findIndex(row => row.includes(gem));
  }

  getColumn(board: Gem[][], gem: Gem): number {
    const row = this.getRow(board, gem);
    return board[row].indexOf(gem);
  }

  areGemsAdjacent(board: Gem[][], gem1: Gem, gem2: Gem): boolean {
    const [row1, col1] = this.getGemPosition(board, gem1);
    const [row2, col2] = this.getGemPosition(board, gem2);

    return (Math.abs(row1 - row2) + Math.abs(col1 - col2)) === 1;
  }

  swapGems(board: Gem[][], gem1: Gem, gem2: Gem): void {
    const [row1, col1] = this.getGemPosition(board, gem1);
    const [row2, col2] = this.getGemPosition(board, gem2);

    [board[row1][col1], board[row2][col2]] = [board[row2][col2], board[row1][col1]];
  }

  private getGemPosition(board: Gem[][], gem: Gem): [number, number] {
    const row = this.getRow(board, gem);
    const col = this.getColumn(board, gem);
    return [row, col];
  }
}
