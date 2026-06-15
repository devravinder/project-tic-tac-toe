package com.paravar.tictactoe.repository;

import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.model.GameStatus;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface GameRepository extends JpaRepository<@NonNull Game, @NonNull String> {

    List<@NonNull Game> findByStatus(GameStatus status);
    List<@NonNull Game> findByStatusAndCreatedAtBefore(GameStatus status, Instant before);

}
