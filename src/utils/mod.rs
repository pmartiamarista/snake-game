#[cfg(target_arch = "wasm32")]
pub fn random(max: usize) -> usize {
    (js_sys::Math::random() * max as f64) as usize
}

#[cfg(not(target_arch = "wasm32"))]
pub fn random(max: usize) -> usize {
    max / 2
}
