import { Injectable } from '@angular/core';
import { Gem } from '../models/gem.model';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly MATCH_MIN_LENGTH = 3;
  bombCount: number = 0;

  clearBombs(board: Gem[][], table: Table): void {
    this.markAsBombs(board, table);
    while (!this.areAllBombsCleared(board)) {
      this.explodeGems(board);
      this.markAsBombs(board, table);
    }
  }

  markAsBombs(board: Gem[][], table: Table): void {
    for (let row = 0; row < table.maxRows; row++) {
      for (let col = 0; col < table.maxCols; col++) {
        if (this.hasMatch(board, row, col, table)) {
          board[row][col].type = 'bomb';
        }
      }
    }
  }

  hasMatch(board: Gem[][], row: number, col: number, table: Table): boolean {
    const targetColor = board[row][col].color;
    return this.hasHorizontalMatch(board, row, col, table, targetColor) ||
      this.hasVerticalMatch(board, row, col, table, targetColor);
  }

  private hasHorizontalMatch(board: Gem[][], row: number, col: number, table: Table, targetColor: string): boolean {
    let matchCount = 1;

    for (let i = col - 1; i >= 0 && board[row][i].color === targetColor; i--) {
      matchCount++;
    }

    for (let i = col + 1; i < table.maxCols && board[row][i].color === targetColor; i++) {
      matchCount++;
    }

    return matchCount >= this.MATCH_MIN_LENGTH;
  }

  private hasVerticalMatch(board: Gem[][], row: number, col: number, table: Table, targetColor: string): boolean {
    let matchCount = 1;

    for (let i = row - 1; i >= 0 && board[i][col].color === targetColor; i--) {
      matchCount++;
    }

    for (let i = row + 1; i < table.maxRows && board[i][col].color === targetColor; i++) {
      matchCount++;
    }

    return matchCount >= this.MATCH_MIN_LENGTH;
  }

  explodeGems(board: Gem[][]): void {
    for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
      for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
        if (board[rowIndex][colIndex].type === 'bomb') {
          this.bombCount++;
          this.dropGems(board, rowIndex, colIndex);
        }
      }
    }
  }

  private dropGems(board: Gem[][], rowIndex: number, colIndex: number): void {
    if (rowIndex === 0) {
      board[rowIndex][colIndex] = new Gem().init();
    } else {
      for (let i = rowIndex; i > 0; i--) {
        board[i][colIndex] = board[i - 1][colIndex];
      }
      board[0][colIndex] = new Gem().init();
    }
  }

  areAllBombsCleared(board: Gem[][]): boolean {
    for (let row of board) {
      for (let gem of row) {
        if (gem.type === 'bomb') {
          return false;
        }
      }
    }
    return true;
  }

  getBombCount(): number {
    return this.bombCount;
  }
}
