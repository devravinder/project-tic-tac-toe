package com.paravar.tictactoe.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "game")
@Data
public class GameProperties {
    private int idleTimeoutMinutes = 5;
    private int disconnectTimeoutSeconds = 30;
    private int disconnectStrikeSeconds = 10;
    private int maxDisconnectStrikes = 3;
}
