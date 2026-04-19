use wee_alloc::WeeAlloc;

pub mod snake;
pub mod utils;
pub mod world;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

pub use snake::{Direction, SnakeCell};
pub use world::{GameStatus, World};
