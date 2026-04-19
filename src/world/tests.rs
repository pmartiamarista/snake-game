use super::*;

#[test]
fn correctly_initializes_game() {
    let world = World::new(8, 11);
    assert_eq!(world.width(), 8);
    assert_eq!(world.game_status(), None);
}

#[test]
fn detects_playing_status_correctly() {
    let mut world = World::new(8, 11);
    world.start_game();
    assert_eq!(world.game_status(), Some(GameStatus::Played));
}

#[test]
fn pauses_game_properly_check() {
    let mut world = World::new(8, 11);
    world.start_game();
    world.toggle_pause();
    assert_eq!(world.game_status(), Some(GameStatus::Paused));
    world.toggle_pause();
    assert_eq!(world.game_status(), Some(GameStatus::Played));
}

#[test]
fn game_restarts_reset_values_flag_properly() {
    let mut world = World::new(8, 11);
    world.start_game();
    world.score = 5;
    world.restart_game(5);
    assert_eq!(world.score(), 0);
    assert_eq!(world.game_status(), Some(GameStatus::Played));
}
