package com.paravar.tictactoe.dto;

import lombok.Data;

@Data
public class HeartBeatRequest {
    private String gameId;
    private String player;
}
