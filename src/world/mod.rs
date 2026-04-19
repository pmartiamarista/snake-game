use crate::snake::{Direction, Snake, SnakeCell};
use crate::utils::random;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum GameStatus {
    Won,
    Lost,
    Played,
    Paused,
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
    reward_cell: usize,
    status: Option<GameStatus>,
    score: usize,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_idx: usize) -> World {
        let snake = Snake::new(snake_idx, 3);
        let size = width * width;
        let body = &snake.body;

        World {
            width,
            size,
            reward_cell: World::gen_reward_cell(size, body),
            snake,
            next_cell: None,
            status: None,
            score: 0,
        }
    }

    fn gen_reward_cell(max: usize, snake_body: &[SnakeCell]) -> usize {
        let mut reward_cell;
        loop {
            reward_cell = random(max);
            if !snake_body.contains(&SnakeCell(reward_cell)) {
                break;
            }
        }
        reward_cell
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn start_game(&mut self) {
        self.status = Some(GameStatus::Played);
    }

    fn reset_game_state(&mut self) {
        self.next_cell = None;
        self.status = Some(GameStatus::Played);
        self.score = 0;
    }

    pub fn restart_game(&mut self, snake_idx: usize) {
        self.snake = Snake::new(snake_idx, 3);
        self.reward_cell = World::gen_reward_cell(self.size, &self.snake.body);
        self.reset_game_state();
    }

    pub fn toggle_pause(&mut self) {
        match self.status {
            Some(GameStatus::Played) => self.status = Some(GameStatus::Paused),
            Some(GameStatus::Paused) => self.status = Some(GameStatus::Played),
            _ => {}
        }
    }

    pub fn game_status(&self) -> Option<GameStatus> {
        self.status
    }

    pub fn game_status_text(&self) -> String {
        match self.status {
            Some(GameStatus::Won) => String::from("You have won!"),
            Some(GameStatus::Lost) => String::from("You have lost!"),
            Some(GameStatus::Played) => String::from("Playing"),
            Some(GameStatus::Paused) => String::from("Paused"),
            None => String::from("Ready"),
        }
    }

    pub fn game_button_text(&self) -> String {
        match self.status {
            Some(GameStatus::Won) | Some(GameStatus::Lost) => String::from("Restart"),
            Some(GameStatus::Played) => String::from("Pause"),
            Some(GameStatus::Paused) => String::from("Resume"),
            None => String::from("Start Game"),
        }
    }

    pub fn reward_cell(&self) -> usize {
        self.reward_cell
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn change_snake_direction(&mut self, direction: Direction) {
        let next_cell = self.gen_next_snake_cell(&direction);
        if self.snake.body[1].0 == next_cell.0 {
            return;
        }
        self.next_cell = Some(next_cell);
        self.snake.direction = direction;
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn score(&self) -> usize {
        self.score
    }

    pub fn step(&mut self) {
        if let Some(GameStatus::Played) = self.status {
            let temp = self.snake.body.clone();
            self.update_snake_head();
            self.update_snake_body(&temp);
            self.check_collision();
            self.check_reward();
        }
    }

    fn update_snake_head(&mut self) {
        match self.next_cell {
            Some(cell) => {
                self.snake.body[0] = cell;
                self.next_cell = None;
            }
            None => {
                self.snake.body[0] = self.gen_next_snake_cell(&self.snake.direction);
            }
        }
    }

    fn update_snake_body(&mut self, temp: &[SnakeCell]) {
        let len = self.snake.body.len();
        for i in 1..len {
            self.snake.body[i] = SnakeCell(temp[i - 1].0);
        }
    }

    fn check_collision(&mut self) {
        let head_idx = self.snake_head_idx();
        let len = self.snake.body.len();
        for i in 1..len {
            if self.snake.body[i].0 == head_idx {
                self.status = Some(GameStatus::Lost);
                return;
            }
        }
    }

    fn check_reward(&mut self) {
        if self.reward_cell == self.snake_head_idx() {
            self.score += 1;
            if self.snake_length() < self.size {
                self.reward_cell = World::gen_reward_cell(self.size, &self.snake.body);
            } else {
                self.reward_cell = 1000;
            }
            self.snake.body.push(SnakeCell(self.snake.body[1].0));
        }
    }

    fn gen_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        match direction {
            Direction::Right => {
                let threshold = (row + 1) * self.width;
                if snake_idx + 1 == threshold {
                    SnakeCell(threshold - self.width)
                } else {
                    SnakeCell(snake_idx + 1)
                }
            }
            Direction::Left => {
                let threshold = row * self.width;
                if snake_idx == threshold {
                    SnakeCell(threshold + (self.width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            }
            Direction::Up => {
                let threshold = snake_idx - (row * self.width);
                if snake_idx == threshold {
                    SnakeCell((self.size - self.width) + threshold)
                } else {
                    SnakeCell(snake_idx - self.width)
                }
            }
            Direction::Down => {
                let threshold = snake_idx + ((self.width - row) * self.width);
                if snake_idx + self.width == threshold {
                    SnakeCell(threshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_idx + self.width)
                }
            }
        }
    }
}

#[cfg(test)]
mod tests;
