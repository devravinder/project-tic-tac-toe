export enum GameStatus {
        WAITING,
        IN_PROGRESS,
        FINISHED,
        ABANDONED,
        DRAW_REQUESTED,
        RESTART_REQUESTED
    }

export interface GameDto {
  id: string;
  playerX: string;
  playerO: string;
  board: string;
  status: GameStatus;
  requestedBy: string
  currentTurn: string;
  winner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDto {
  id: string;
  gameId: string;
  sender: string;
  content: string;
  timestamp: string;
}