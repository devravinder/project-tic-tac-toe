package com.paravar.tictactoe.repository;

import com.paravar.tictactoe.model.Game;
import com.paravar.tictactoe.model.GameStatus;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<@NonNull Game, @NonNull String> {

    List<@NonNull Game> findByStatus(GameStatus status);
    List<@NonNull Game> findByStatusAndCreatedAtBefore(GameStatus status, Instant before);


    @Query("SELECT g FROM Game g WHERE g.status = :status AND (g.playerX = :player OR g.playerO = :player)")
    Optional<Game> findByStatusAndPlayer(
            @Param("status") GameStatus status,
            @Param("player") String player
    );

}
