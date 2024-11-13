import { Component, OnInit } from '@angular/core';
import { Table } from '../../models/table.model';
import { CommonModule } from '@angular/common';
import { Gem } from '../../models/gem.model';
import { GemService } from '../../services/gem.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-game-table',
  standalone: true,
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css'],
  imports: [CommonModule]
})
export class GameTableComponent implements OnInit {
  table: Table;
  board: Gem[][];
  firstGem: Gem;
  secondGem: Gem;
  bombCount: number;
  readonly bombToClear: number = 500;
  message: string;

  constructor(
    private gemService: GemService,
    private boardService: BoardService
  ) {
    this.table = new Table().init();
    this.board = [];
    this.firstGem = new Gem();
    this.secondGem = new Gem();
    this.bombCount = 0;
    this.message = '';
  }

  ngOnInit() {
    this.initializeBoard();
    this.clearBombsOnBoard();
    this.updateBombCount();
  }

  /**
   * Initialize the board
   * @returns void
   */
  private initializeBoard(): void {
    this.board = this.table.board;
  }

  /**
   * Clear all bombs from the board
   * @returns void
   */
  private clearBombsOnBoard(): void {
    this.boardService.clearBombs(this.board, this.table);
  }

  /**
   * Update the bomb count
   * @returns void
   */
  private updateBombCount(): void {
    this.bombCount = this.boardService.getBombCount();
    this.checkGameOver();
  }

  /**
   * Check if the game is over
   * @returns void
  */
  private checkGameOver(): void {
    if (this.bombCount >= this.bombToClear) {
      this.message = 'Game Over! You have cleared enough bombs.';
    }
  }

  /**
   * Restart the game
   * @returns void
  */
  restartGame(): void {
    this.table = new Table().init();
    this.board = [];
    this.firstGem = new Gem();
    this.secondGem = new Gem();
    this.bombCount = 0;
    this.message = '';

    this.initializeBoard();
    this.clearBombsOnBoard();
  }

  /**
   * Select a gem on the board
   * @param gem
   * @returns void
  */
  selectGem(gem: Gem): void {
    if (this.isFirstGemNotSelected()) {
      this.firstGem = gem;
    } else if (this.isSecondGemNotSelected()) {
      this.secondGem = gem;
      this.handleGemSelection();
    }
  }

  /**
   * Check if the first gem is not selected
   * @returns boolean
   */
  private isFirstGemNotSelected(): boolean {
    return !this.firstGem || this.firstGem.type === '';
  }

  /**
   * Check if the second gem is not selected
   * @returns boolean
   */
  private isSecondGemNotSelected(): boolean {
    return !this.secondGem || this.secondGem.type === '';
  }

  /**
   * Handle the gem selection logic
   * @returns void
   */
  private handleGemSelection(): void {
    if (this.areGemsSwappable(this.firstGem, this.secondGem)) {
      this.gemService.swapGems(this.board, this.firstGem, this.secondGem);
      this.resetSelectedGems();
      this.boardService.clearBombs(this.board, this.table);
      if (this.bombCount === 0) {
        this.bombCount = this.boardService.getBombCount();
      } else {
        this.updateBombCount();
      }
    } else {
      this.firstGem = this.secondGem;
      this.secondGem = new Gem();
    }
  }

  /**
   * Reset the selected gems
   * @returns void
   */
  private resetSelectedGems(): void {
    this.firstGem = new Gem();
    this.secondGem = new Gem();
  }

  /**
   * Check if two gems are swappable
   * @param gem1
   * @param gem2
   * @returns boolean
   */
  private areGemsSwappable(gem1: Gem, gem2: Gem): boolean {
    const [row1, col1] = this.getGemPosition(gem1);
    const [row2, col2] = this.getGemPosition(gem2);

    this.gemService.swapGems(this.board, gem1, gem2);

    const isSwappable = this.isSwapCreatingMatch(row1, col1, row2, col2);

    this.gemService.swapGems(this.board, gem1, gem2);

    return isSwappable;
  }

  /**
   * Get the position of a gem on the board
   * @param gem
   * @returns [number, number]
   */
  private getGemPosition(gem: Gem): [number, number] {
    const row = this.gemService.getRow(this.board, gem);
    const col = this.gemService.getColumn(this.board, gem);
    return [row, col];
  }

  /**
   * Check if swapping two gems creates a match
   * @param row1
   * @param col1
   * @param row2
   * @param col2
   * @returns boolean
   */
  private isSwapCreatingMatch(row1: number, col1: number, row2: number, col2: number): boolean {
    return this.boardService.hasMatch(this.board, row1, col1, this.table) ||
      this.boardService.hasMatch(this.board, row2, col2, this.table);
  }
}
