use super::*;

#[test]
fn snake_cell_initialization() {
    let cell = SnakeCell(42);
    assert_eq!(cell.0, 42);
}

#[test]
fn direction_variants() {
    assert_ne!(Direction::Up, Direction::Down);
    assert_ne!(Direction::Left, Direction::Right);
}
