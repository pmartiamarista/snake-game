import { random } from './snippets/snake_game-027f5cd2d64d2885/frontend/utils/random.js';

let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}
/**
 * @enum {0 | 1 | 2 | 3}
 */
export const Direction = Object.freeze({
    Up: 0, "0": "Up",
    Right: 1, "1": "Right",
    Down: 2, "2": "Down",
    Left: 3, "3": "Left",
});
/**
 * @enum {0 | 1 | 2 | 3}
 */
export const GameStatus = Object.freeze({
    Won: 0, "0": "Won",
    Lost: 1, "1": "Lost",
    Played: 2, "2": "Played",
    Paused: 3, "3": "Paused",
});

const WorldFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_world_free(ptr >>> 0, 1));

export class World {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(World.prototype);
        obj.__wbg_ptr = ptr;
        WorldFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WorldFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_world_free(ptr, 0);
    }
    /**
     * @param {number} width
     * @param {number} snake_idx
     * @returns {World}
     */
    static new(width, snake_idx) {
        const ret = wasm.world_new(width, snake_idx);
        return World.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    width() {
        const ret = wasm.world_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    start_game() {
        wasm.world_start_game(this.__wbg_ptr);
    }
    /**
     * @param {number} snake_idx
     */
    restart_game(snake_idx) {
        wasm.world_restart_game(this.__wbg_ptr, snake_idx);
    }
    toggle_pause() {
        wasm.world_toggle_pause(this.__wbg_ptr);
    }
    /**
     * @returns {GameStatus | undefined}
     */
    game_status() {
        const ret = wasm.world_game_status(this.__wbg_ptr);
        return ret === 4 ? undefined : ret;
    }
    /**
     * @returns {string}
     */
    game_status_text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.world_game_status_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    game_button_text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.world_game_button_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    reward_cell() {
        const ret = wasm.world_reward_cell(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    snake_head_idx() {
        const ret = wasm.world_snake_head_idx(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {Direction} direction
     */
    change_snake_direction(direction) {
        wasm.world_change_snake_direction(this.__wbg_ptr, direction);
    }
    /**
     * @returns {number}
     */
    snake_length() {
        const ret = wasm.world_snake_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    snake_cells() {
        const ret = wasm.world_snake_cells(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    score() {
        const ret = wasm.world_score(this.__wbg_ptr);
        return ret >>> 0;
    }
    step() {
        wasm.world_step(this.__wbg_ptr);
    }
}
if (Symbol.dispose) World.prototype[Symbol.dispose] = World.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_random_30646da1bbe5b710 = function(arg0) {
        const ret = random(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_0;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('snake_game_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
