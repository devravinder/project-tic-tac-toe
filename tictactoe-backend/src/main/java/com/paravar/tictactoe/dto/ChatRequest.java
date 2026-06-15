package com.paravar.tictactoe.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String gameId;
    private String sender;
    private String content;
}
