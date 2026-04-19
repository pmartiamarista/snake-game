#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(module = "/frontend/utils/random.js")]
extern "C" {
    pub fn random(max: usize) -> usize;
}

#[cfg(not(target_arch = "wasm32"))]
pub fn random(max: usize) -> usize {
    max / 2
}
