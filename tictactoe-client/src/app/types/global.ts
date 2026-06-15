export enum GameStatus {
        WAITING,
        IN_PROGRESS,
        FINISHED,
        ABANDONED
    }

export interface GameDto {
  id: string;
  playerX: string;
  playerO: string;
  board: string;
  status: GameStatus;
  currentTurn: string;
  winner: string;
  createdAt: Date;
  updatedAt: Date;
}