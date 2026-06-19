package com.paravar.tictactoe.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String playerX;
    private String playerO;

    // board stored as 9-char string
    private String board="         ";

    @Enumerated(EnumType.STRING)
    private GameStatus status = GameStatus.WAITING;

    // X or O
    private String currentTurn = "X";
    private String winner;

    //
    private String requestedBy;

    // connection tracking
    private int playerXDisconnects = 0;
    private int playerODisconnects = 0;
    private Instant playerXLastSeen;
    private Instant playerOLastSeen;


    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

}
