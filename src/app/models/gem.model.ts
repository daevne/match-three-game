export class Gem {
  type: string = '';
  color: string = '';
  private possibleColors: string[] = ['lime', 'orange', 'darkorchid', 'yellow', 'aqua', 'red'];

  init(): Gem {
      this.color = this.defineColor();
      this.type = 'gem';
      return this;
  }

  defineColor(): string {
      let randomNumber = Math.floor(Math.random() * 6);

      return this.possibleColors[randomNumber];
  }
}
