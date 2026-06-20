package com.paravar.tictactoe.dto;

import com.paravar.tictactoe.model.GameStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class GameDto {
    private String id;
    private String playerX;
    private String playerO;
    private String board;
    private GameStatus status;
    private int playerXDisconnects;
    private int playerODisconnects;
    private String requestedBy;
    private String currentTurn;
    private String winner;
    private Instant createdAt;
    private Instant updatedAt;
}
