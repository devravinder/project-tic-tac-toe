package com.paravar.tictactoe.service;

import com.paravar.tictactoe.dto.GameDto;
import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.model.GameStatus;
import com.paravar.tictactoe.repository.GameRepository;
import com.paravar.tictactoe.util.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    private static final int[][] WIN_PATTERNS = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // rows
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // columns
            {0, 4, 8}, {2, 4, 6}             // diagonals
    };

    public Game createGame(String playerName) {
        Game game = new Game();
        game.setPlayerX(playerName);
        game.setPlayerXLastSeen(Instant.now());
        return gameRepository.save(game);
    }

    public Game joinGame(String gameId, String playerName) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getStatus() != GameStatus.WAITING) {
            throw new RuntimeException("Game is not available to join");
        }

        game.setStatus(GameStatus.IN_PROGRESS);
        game.setPlayerO(playerName);
        game.setPlayerOLastSeen(Instant.now());
        game.setUpdatedAt(Instant.now());
        return gameRepository.save(game);
    }

    public List<Game> getAvailableGames() {
        return gameRepository.findByStatus(GameStatus.WAITING);
    }

    public Game getGame(String gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public Game makeMove(String gameId, String player, int position) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new RuntimeException("Game is not in progress");
        }

        String symbol = getPlayerSymbol(game, player);
        if (!symbol.equals(game.getCurrentTurn())) {
            throw new RuntimeException("Not your turn");
        }

        char[] board = game.getBoard().toCharArray();
        if (board[position] != AppConstants.EMPTY_CHAR) {
            throw new RuntimeException("Position already taken");
        }

        board[position] = symbol.charAt(0);
        game.setBoard(new String(board));


        // Check win
        String winner = checkWinner(board);
        if (winner != null) {
            game.setWinner(winner.equals("X") ? game.getPlayerX() : game.getPlayerO());
            game.setStatus(GameStatus.FINISHED);
        } else if (!new String(board).contains(AppConstants.EMPTY_CHAR+"")) {
            game.setWinner("DRAW");
            game.setStatus(GameStatus.FINISHED);
        } else {
            game.setCurrentTurn(symbol.equals("X") ? "O" : "X");
        }

        game.setUpdatedAt(Instant.now());
        return gameRepository.save(game);
    }

    public Game resign(String gameId, String player) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new RuntimeException("Game is not in progress");
        }

        String symbol = getPlayerSymbol(game, player);
        game.setWinner(symbol.equals("X") ? game.getPlayerO() : game.getPlayerX());
        game.setCurrentTurn(symbol);
        game.setStatus(GameStatus.FINISHED);
        game.setUpdatedAt(Instant.now());

        return gameRepository.save(game);
    }
    public Game restart(String gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (game.getStatus() != GameStatus.FINISHED) {
            throw new RuntimeException("You can't restart the Game");
        }

        game.setStatus(GameStatus.IN_PROGRESS);
        game.setBoard("         ");
        game.setWinner(null);
        game.setPlayerODisconnects(0);
        game.setPlayerXDisconnects(0);
        game.setUpdatedAt(Instant.now());

        return gameRepository.save(game);
    }

    public void heartbeat(String gameId, String player) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (player.equals(game.getPlayerX())) {
            game.setPlayerXLastSeen(Instant.now());
        } else if (player.equals(game.getPlayerO())) {
            game.setPlayerOLastSeen(Instant.now());
        }

        gameRepository.save(game);
    }

    public GameDto toDto(Game game) {
        GameDto dto = new GameDto();
        dto.setId(game.getId());
        dto.setPlayerX(game.getPlayerX());
        dto.setPlayerO(game.getPlayerO());
        dto.setBoard(game.getBoard());
        dto.setStatus(game.getStatus());
        dto.setCurrentTurn(game.getCurrentTurn());
        dto.setWinner(game.getWinner());
        dto.setCreatedAt(game.getCreatedAt());
        dto.setUpdatedAt(game.getUpdatedAt());
        return dto;
    }

    private String getPlayerSymbol(Game game, String player) {
        if (player.equals(game.getPlayerX())) return "X";
        if (player.equals(game.getPlayerO())) return "O";
        throw new RuntimeException("Player not in this game");
    }

    private String checkWinner(char[] board) {
        for (int[] pattern : WIN_PATTERNS) {
            if (board[pattern[0]] != AppConstants.EMPTY_CHAR &&
                    board[pattern[0]] == board[pattern[1]] &&
                    board[pattern[1]] == board[pattern[2]]) {
                return String.valueOf(board[pattern[0]]);
            }
        }
        return null;
    }
}