package com.paravar.tictactoe.dto;

import lombok.Data;

@Data
public class GameActionRequest {
    private String gameId;
    private String player;
}
