package com.paravar.tictactoe.dto;

import lombok.Data;

@Data
public class MoveRequest {
    private String gameId;
    private String player;
    private int position;// 0-8
}
