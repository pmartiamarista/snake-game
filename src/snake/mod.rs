use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Clone, Copy, Debug)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left,
}

#[derive(PartialEq, Clone, Copy, Debug)]
pub struct SnakeCell(pub usize);

#[derive(Clone, Debug)]
pub struct Snake {
    pub(crate) body: Vec<SnakeCell>,
    pub(crate) direction: Direction,
}

impl Snake {
    pub(crate) fn new(spawn_index: usize, size: usize) -> Snake {
        let mut body = vec![];
        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }
        Snake {
            body,
            direction: Direction::Right,
        }
    }
}

#[cfg(test)]
mod tests;
