
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var base = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 𝗮 𝗯 𝗰 𝗱 𝗲 𝗳 𝗴 𝗵 𝗶 𝗷 𝗸 𝗹 𝗺 𝗻 𝗼 𝗽 𝗾 𝗿 𝘀 𝘁 𝘂 𝘃 𝘄 𝘅 𝘆 𝘇 𝗔 𝗕 𝗖 𝗗 𝗘 𝗙 𝗚 𝗛 𝗜 𝗝 𝗞 𝗟 𝗠 𝗡 𝗢 𝗣 𝗤 𝗥 𝗦 𝗧 𝗨 𝗩 𝗪 𝗫 𝗬 𝗭 𝟭 𝟮 𝟯 𝟰 𝟱 𝟲 𝟳 𝟴 𝟵 𝟬
    var bold = [
        "𝗮",
        "𝗯",
        "𝗰",
        "𝗱",
        "𝗲",
        "𝗳",
        "𝗴",
        "𝗵",
        "𝗶",
        "𝗷",
        "𝗸",
        "𝗹",
        "𝗺",
        "𝗻",
        "𝗼",
        "𝗽",
        "𝗾",
        "𝗿",
        "𝘀",
        "𝘁",
        "𝘂",
        "𝘃",
        "𝘄",
        "𝘅",
        "𝘆",
        "𝘇",
        "𝗔",
        "𝗕",
        "𝗖",
        "𝗗",
        "𝗘",
        "𝗙",
        "𝗚",
        "𝗛",
        "𝗜",
        "𝗝",
        "𝗞",
        "𝗟",
        "𝗠",
        "𝗡",
        "𝗢",
        "𝗣",
        "𝗤",
        "𝗥",
        "𝗦",
        "𝗧",
        "𝗨",
        "𝗩",
        "𝗪",
        "𝗫",
        "𝗬",
        "𝗭",
        "𝟭",
        "𝟮",
        "𝟯",
        "𝟰",
        "𝟱",
        "𝟲",
        "𝟳",
        "𝟴",
        "𝟵",
        "𝟬",
    ];

    // 𝙖 𝙗 𝙘 𝙙 𝙚 𝙛 𝙜 𝙝 𝙞 𝙟 𝙠 𝙡 𝙢 𝙣 𝙤 𝙥 𝙦 𝙧 𝙨 𝙩 𝙪 𝙫 𝙬 𝙭 𝙮 𝙯 𝘼 𝘽 𝘾 𝘿 𝙀 𝙁 𝙂 𝙃 𝙄 𝙅 𝙆 𝙇 𝙈 𝙉 𝙊 𝙋 𝙌 𝙍 𝙎 𝙏 𝙐 𝙑 𝙒 𝙓 𝙔 𝙕 1 2 3 4 5 6 7 8 9 0
    var boldItalic = [
        "𝙖",
        "𝙗",
        "𝙘",
        "𝙙",
        "𝙚",
        "𝙛",
        "𝙜",
        "𝙝",
        "𝙞",
        "𝙟",
        "𝙠",
        "𝙡",
        "𝙢",
        "𝙣",
        "𝙤",
        "𝙥",
        "𝙦",
        "𝙧",
        "𝙨",
        "𝙩",
        "𝙪",
        "𝙫",
        "𝙬",
        "𝙭",
        "𝙮",
        "𝙯",
        "𝘼",
        "𝘽",
        "𝘾",
        "𝘿",
        "𝙀",
        "𝙁",
        "𝙂",
        "𝙃",
        "𝙄",
        "𝙅",
        "𝙆",
        "𝙇",
        "𝙈",
        "𝙉",
        "𝙊",
        "𝙋",
        "𝙌",
        "𝙍",
        "𝙎",
        "𝙏",
        "𝙐",
        "𝙑",
        "𝙒",
        "𝙓",
        "𝙔",
        "𝙕",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 🄰 🄱 🄲 🄳 🄴 🄵 🄶 🄷 🄸 🄹 🄺 🄻 🄼 🄽 🄾 🄿 🅀 🅁 🅂 🅃 🅄 🅅 🅆 🅇 🅈 🅉 🄰 🄱 🄲 🄳 🄴 🄵 🄶 🄷 🄸 🄹 🄺 🄻 🄼 🄽 🄾 🄿 🅀 🅁 🅂 🅃 🅄 🅅 🅆 🅇 🅈 🅉 1 2 3 4 5 6 7 8 9 0
    var box = [
        "🄰",
        "🄱",
        "🄲",
        "🄳",
        "🄴",
        "🄵",
        "🄶",
        "🄷",
        "🄸",
        "🄹",
        "🄺",
        "🄻",
        "🄼",
        "🄽",
        "🄾",
        "🄿",
        "🅀",
        "🅁",
        "🅂",
        "🅃",
        "🅄",
        "🅅",
        "🅆",
        "🅇",
        "🅈",
        "🅉",
        "🄰",
        "🄱",
        "🄲",
        "🄳",
        "🄴",
        "🄵",
        "🄶",
        "🄷",
        "🄸",
        "🄹",
        "🄺",
        "🄻",
        "🄼",
        "🄽",
        "🄾",
        "🄿",
        "🅀",
        "🅁",
        "🅂",
        "🅃",
        "🅄",
        "🅅",
        "🅆",
        "🅇",
        "🅈",
        "🅉",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 🅰 🅱 🅲 🅳 🅴 🅵 🅶 🅷 🅸 🅹 🅺 🅻 🅼 🅽 🅾 🅿 🆀 🆁 🆂 🆃 🆄 🆅 🆆 🆇 🆈 🆉 🅰 🅱 🅲 🅳 🅴 🅵 🅶 🅷 🅸 🅹 🅺 🅻 🅼 🅽 🅾 🅿 🆀 🆁 🆂 🆃 🆄 🆅 🆆 🆇 🆈 🆉 1 2 3 4 5 6 7 8 9 0
    var boxFilled = [
        "🅰",
        "🅱",
        "🅲",
        "🅳",
        "🅴",
        "🅵",
        "🅶",
        "🅷",
        "🅸",
        "🅹",
        "🅺",
        "🅻",
        "🅼",
        "🅽",
        "🅾",
        "🅿",
        "🆀",
        "🆁",
        "🆂",
        "🆃",
        "🆄",
        "🆅",
        "🆆",
        "🆇",
        "🆈",
        "🆉",
        "🅰",
        "🅱",
        "🅲",
        "🅳",
        "🅴",
        "🅵",
        "🅶",
        "🅷",
        "🅸",
        "🅹",
        "🅺",
        "🅻",
        "🅼",
        "🅽",
        "🅾",
        "🅿",
        "🆀",
        "🆁",
        "🆂",
        "🆃",
        "🆄",
        "🆅",
        "🆆",
        "🆇",
        "🆈",
        "🆉",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // ⓐ ⓑ ⓒ ⓓ ⓔ ⓕ ⓖ ⓗ ⓘ ⓙ ⓚ ⓛ ⓜ ⓝ ⓞ ⓟ ⓠ ⓡ ⓢ ⓣ ⓤ ⓥ ⓦ ⓧ ⓨ ⓩ Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⓪
    var circle = [
        "ⓐ",
        "ⓑ",
        "ⓒ",
        "ⓓ",
        "ⓔ",
        "ⓕ",
        "ⓖ",
        "ⓗ",
        "ⓘ",
        "ⓙ",
        "ⓚ",
        "ⓛ",
        "ⓜ",
        "ⓝ",
        "ⓞ",
        "ⓟ",
        "ⓠ",
        "ⓡ",
        "ⓢ",
        "ⓣ",
        "ⓤ",
        "ⓥ",
        "ⓦ",
        "ⓧ",
        "ⓨ",
        "ⓩ",
        "Ⓐ",
        "Ⓑ",
        "Ⓒ",
        "Ⓓ",
        "Ⓔ",
        "Ⓕ",
        "Ⓖ",
        "Ⓗ",
        "Ⓘ",
        "Ⓙ",
        "Ⓚ",
        "Ⓛ",
        "Ⓜ",
        "Ⓝ",
        "Ⓞ",
        "Ⓟ",
        "Ⓠ",
        "Ⓡ",
        "Ⓢ",
        "Ⓣ",
        "Ⓤ",
        "Ⓥ",
        "Ⓦ",
        "Ⓧ",
        "Ⓨ",
        "Ⓩ",
        "①",
        "②",
        "③",
        "④",
        "⑤",
        "⑥",
        "⑦",
        "⑧",
        "⑨",
        "⓪,",
    ];

    // 𝒶 𝒷 𝒸 𝒹 𝑒 𝒻 𝑔 𝒽 𝒾 𝒿 𝓀 𝓁 𝓂 𝓃 𝑜 𝓅 𝓆 𝓇 𝓈 𝓉 𝓊 𝓋 𝓌 𝓍 𝓎 𝓏 𝒜 𝐵 𝒞 𝒟 𝐸 𝐹 𝒢 𝐻 𝐼 𝒥 𝒦 𝐿 𝑀 𝒩 𝒪 𝒫 𝒬 𝑅 𝒮 𝒯 𝒰 𝒱 𝒲 𝒳 𝒴 𝒵 𝟣 𝟤 𝟥 𝟦 𝟧 𝟨 𝟩 𝟪 𝟫 𝟢
    var cursive = [
        "𝒶",
        "𝒷",
        "𝒸",
        "𝒹",
        "𝑒",
        "𝒻",
        "𝑔",
        "𝒽",
        "𝒾",
        "𝒿",
        "𝓀",
        "𝓁",
        "𝓂",
        "𝓃",
        "𝑜",
        "𝓅",
        "𝓆",
        "𝓇",
        "𝓈",
        "𝓉",
        "𝓊",
        "𝓋",
        "𝓌",
        "𝓍",
        "𝓎",
        "𝓏",
        "𝒜",
        "𝐵",
        "𝒞",
        "𝒟",
        "𝐸",
        "𝐹",
        "𝒢",
        "𝐻",
        "𝐼",
        "𝒥",
        "𝒦",
        "𝐿",
        "𝑀",
        "𝒩",
        "𝒪",
        "𝒫",
        "𝒬",
        "𝑅",
        "𝒮",
        "𝒯",
        "𝒰",
        "𝒱",
        "𝒲",
        "𝒳",
        "𝒴",
        "𝒵",
        "𝟣",
        "𝟤",
        "𝟥",
        "𝟦",
        "𝟧",
        "𝟨",
        "𝟩",
        "𝟪",
        "𝟫",
        "𝟢",
    ];

    // 𝓪 𝓫 𝓬 𝓭 𝓮 𝓯 𝓰 𝓱 𝓲 𝓳 𝓴 𝓵 𝓶 𝓷 𝓸 𝓹 𝓺 𝓻 𝓼 𝓽 𝓾 𝓿 𝔀 𝔁 𝔂 𝔃 𝓐 𝓑 𝓒 𝓓 𝓔 𝓕 𝓖 𝓗 𝓘 𝓙 𝓚 𝓛 𝓜 𝓝 𝓞 𝓟 𝓠 𝓡 𝓢 𝓣 𝓤 𝓥 𝓦 𝓧 𝓨 𝓩 1 2 3 4 5 6 7 8 9 0
    var cursiveBold = [
        "𝓪",
        "𝓫",
        "𝓬",
        "𝓭",
        "𝓮",
        "𝓯",
        "𝓰",
        "𝓱",
        "𝓲",
        "𝓳",
        "𝓴",
        "𝓵",
        "𝓶",
        "𝓷",
        "𝓸",
        "𝓹",
        "𝓺",
        "𝓻",
        "𝓼",
        "𝓽",
        "𝓾",
        "𝓿",
        "𝔀",
        "𝔁",
        "𝔂",
        "𝔃",
        "𝓐",
        "𝓑",
        "𝓒",
        "𝓓",
        "𝓔",
        "𝓕",
        "𝓖",
        "𝓗",
        "𝓘",
        "𝓙",
        "𝓚",
        "𝓛",
        "𝓜",
        "𝓝",
        "𝓞",
        "𝓟",
        "𝓠",
        "𝓡",
        "𝓢",
        "𝓣",
        "𝓤",
        "𝓥",
        "𝓦",
        "𝓧",
        "𝓨",
        "𝓩",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 𝔞 𝔟 𝔠 𝔡 𝔢 𝔣 𝔤 𝔥 𝔦 𝔧 𝔨 𝔩 𝔪 𝔫 𝔬 𝔭 𝔮 𝔯 𝔰 𝔱 𝔲 𝔳 𝔴 𝔵 𝔶 𝔷 𝔄 𝔅 ℭ 𝔇 𝔈 𝔉 𝔊 ℌ ℑ 𝔍 𝔎 𝔏 𝔐 𝔑 𝔒 𝔓 𝔔 ℜ 𝔖 𝔗 𝔘 𝔙 𝔚 𝔛 𝔜 ℨ 1 2 3 4 5 6 7 8 9 0
    var goth = [
        "𝔞",
        "𝔟",
        "𝔠",
        "𝔡",
        "𝔢",
        "𝔣",
        "𝔤",
        "𝔥",
        "𝔦",
        "𝔧",
        "𝔨",
        "𝔩",
        "𝔪",
        "𝔫",
        "𝔬",
        "𝔭",
        "𝔮",
        "𝔯",
        "𝔰",
        "𝔱",
        "𝔲",
        "𝔳",
        "𝔴",
        "𝔵",
        "𝔶",
        "𝔷",
        "𝔄",
        "𝔅",
        "ℭ",
        "𝔇",
        "𝔈",
        "𝔉",
        "𝔊",
        "ℌ",
        "ℑ",
        "𝔍",
        "𝔎",
        "𝔏",
        "𝔐",
        "𝔑",
        "𝔒",
        "𝔓",
        "𝔔",
        "ℜ",
        "𝔖",
        "𝔗",
        "𝔘",
        "𝔙",
        "𝔚",
        "𝔛",
        "𝔜",
        "ℨ",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 𝖆 𝖇 𝖈 𝖉 𝖊 𝖋 𝖌 𝖍 𝖎 𝖏 𝖐 𝖑 𝖒 𝖓 𝖔 𝖕 𝖖 𝖗 𝖘 𝖙 𝖚 𝖛 𝖜 𝖝 𝖞 𝖟 𝕬 𝕭 𝕮 𝕯 𝕰 𝕱 𝕲 𝕳 𝕴 𝕵 𝕶 𝕷 𝕸 𝕹 𝕺 𝕻 𝕼 𝕽 𝕾 𝕿 𝖀 𝖁 𝖂 𝖃 𝖄 𝖅 1 2 3 4 5 6 7 8 9 0
    var gothBold = [
        "𝖆",
        "𝖇",
        "𝖈",
        "𝖉",
        "𝖊",
        "𝖋",
        "𝖌",
        "𝖍",
        "𝖎",
        "𝖏",
        "𝖐",
        "𝖑",
        "𝖒",
        "𝖓",
        "𝖔",
        "𝖕",
        "𝖖",
        "𝖗",
        "𝖘",
        "𝖙",
        "𝖚",
        "𝖛",
        "𝖜",
        "𝖝",
        "𝖞",
        "𝖟",
        "𝕬",
        "𝕭",
        "𝕮",
        "𝕯",
        "𝕰",
        "𝕱",
        "𝕲",
        "𝕳",
        "𝕴",
        "𝕵",
        "𝕶",
        "𝕷",
        "𝕸",
        "𝕹",
        "𝕺",
        "𝕻",
        "𝕼",
        "𝕽",
        "𝕾",
        "𝕿",
        "𝖀",
        "𝖁",
        "𝖂",
        "𝖃",
        "𝖄",
        "𝖅",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // 𝘢 𝘣 𝘤 𝘥 𝘦 𝘧 𝘨 𝘩 𝘪 𝘫 𝘬 𝘭 𝘮 𝘯 𝘰 𝘱 𝘲 𝘳 𝘴 𝘵 𝘶 𝘷 𝘸 𝘹 𝘺 𝘻 𝘈 𝘉 𝘊 𝘋 𝘌 𝘍 𝘎 𝘏 𝘐 𝘑 𝘒 𝘓 𝘔 𝘕 𝘖 𝘗 𝘘 𝘙 𝘚 𝘛 𝘜 𝘝 𝘞 𝘟 𝘠 𝘡 1 2 3 4 5 6 7 8 9 0
    var italic = [
        "𝘢",
        "𝘣",
        "𝘤",
        "𝘥",
        "𝘦",
        "𝘧",
        "𝘨",
        "𝘩",
        "𝘪",
        "𝘫",
        "𝘬",
        "𝘭",
        "𝘮",
        "𝘯",
        "𝘰",
        "𝘱",
        "𝘲",
        "𝘳",
        "𝘴",
        "𝘵",
        "𝘶",
        "𝘷",
        "𝘸",
        "𝘹",
        "𝘺",
        "𝘻",
        "𝘈",
        "𝘉",
        "𝘊",
        "𝘋",
        "𝘌",
        "𝘍",
        "𝘎",
        "𝘏",
        "𝘐",
        "𝘑",
        "𝘒",
        "𝘓",
        "𝘔",
        "𝘕",
        "𝘖",
        "𝘗",
        "𝘘",
        "𝘙",
        "𝘚",
        "𝘛",
        "𝘜",
        "𝘝",
        "𝘞",
        "𝘟",
        "𝘠",
        "𝘡",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
    ];

    // a̷ b̷ c̷ d̷ e̷ f̷ g̷ h̷ i̷ j̷ k̷ l̷ m̷ n̷ o̷ p̷ q̷ r̷ s̷ t̷ u̷ v̷ w̷ x̷ y̷ z̷ A̷ B̷ C̷ D̷ E̷ F̷ G̷ H̷ I̷ J̷ K̷ L̷ M̷ N̷ O̷ P̷ Q̷ R̷ S̷ T̷ U̷ V̷ W̷ X̷ Y̷ Z̷ 1̷ 2̷ 3̷ 4̷ 5̷ 6̷ 7̷ 8̷ 9̷ 0̷
    var slashSymbol = [
        "a̷",
        "b̷",
        "c̷",
        "d̷",
        "e̷",
        "f̷",
        "g̷",
        "h̷",
        "i̷",
        "j̷",
        "k̷",
        "l̷",
        "m̷",
        "n̷",
        "o̷",
        "p̷",
        "q̷",
        "r̷",
        "s̷",
        "t̷",
        "u̷",
        "v̷",
        "w̷",
        "x̷",
        "y̷",
        "z̷",
        "A̷",
        "B̷",
        "C̷",
        "D̷",
        "E̷",
        "F̷",
        "G̷",
        "H̷",
        "I̷",
        "J̷",
        "K̷",
        "L̷",
        "M̷",
        "N̷",
        "O̷",
        "P̷",
        "Q̷",
        "R̷",
        "S̷",
        "T̷",
        "U̷",
        "V̷",
        "W̷",
        "X̷",
        "Y̷",
        "Z̷",
        "1̷",
        "2̷",
        "3̷",
        "4̷",
        "5̷",
        "6̷",
        "7̷",
        "8̷",
        "9̷",
        "0̷",
    ];

    // 𝕒 𝕓 𝕔 𝕕 𝕖 𝕗 𝕘 𝕙 𝕚 𝕛 𝕜 𝕝 𝕞 𝕟 𝕠 𝕡 𝕢 𝕣 𝕤 𝕥 𝕦 𝕧 𝕨 𝕩 𝕪 𝕫 𝔸 𝔹 ℂ 𝔻 𝔼 𝔽 𝔾 ℍ 𝕀 𝕁 𝕂 𝕃 𝕄 ℕ 𝕆 ℙ ℚ ℝ 𝕊 𝕋 𝕌 𝕍 𝕎 𝕏 𝕐 ℤ 𝟙 𝟚 𝟛 𝟜 𝟝 𝟞 𝟟 𝟠 𝟡 𝟘
    var stemOutline = [
        "𝕒",
        "𝕓",
        "𝕔",
        "𝕕",
        "𝕖",
        "𝕗",
        "𝕘",
        "𝕙",
        "𝕚",
        "𝕛",
        "𝕜",
        "𝕝",
        "𝕞",
        "𝕟",
        "𝕠",
        "𝕡",
        "𝕢",
        "𝕣",
        "𝕤",
        "𝕥",
        "𝕦",
        "𝕧",
        "𝕨",
        "𝕩",
        "𝕪",
        "𝕫",
        "𝔸",
        "𝔹",
        "ℂ",
        "𝔻",
        "𝔼",
        "𝔽",
        "𝔾",
        "ℍ",
        "𝕀",
        "𝕁",
        "𝕂",
        "𝕃",
        "𝕄",
        "ℕ",
        "𝕆",
        "ℙ",
        "ℚ",
        "ℝ",
        "𝕊",
        "𝕋",
        "𝕌",
        "𝕍",
        "𝕎",
        "𝕏",
        "𝕐",
        "ℤ",
        "𝟙",
        "𝟚",
        "𝟛",
        "𝟜",
        "𝟝",
        "𝟞",
        "𝟟",
        "𝟠",
        "𝟡",
        "𝟘",
    ];

    // a̶ b̶ c̶ d̶ e̶ f̶ g̶ h̶ i̶ j̶ k̶ l̶ m̶ n̶ o̶ p̶ q̶ r̶ s̶ t̶ u̶ v̶ w̶ x̶ y̶ z̶ A̶ B̶ C̶ D̶ E̶ F̶ G̶ H̶ I̶ J̶ K̶ L̶ M̶ N̶ O̶ P̶ Q̶ R̶ S̶ T̶ U̶ V̶ W̶ X̶ Y̶ Z̶ 1̶ 2̶ 3̶ 4̶ 5̶ 6̶ 7̶ 8̶ 9̶ 0̶
    var strike = [
        "a̶",
        "b̶",
        "c̶",
        "d̶",
        "e̶",
        "f̶",
        "g̶",
        "h̶",
        "i̶",
        "j̶",
        "k̶",
        "l̶",
        "m̶",
        "n̶",
        "o̶",
        "p̶",
        "q̶",
        "r̶",
        "s̶",
        "t̶",
        "u̶",
        "v̶",
        "w̶",
        "x̶",
        "y̶",
        "z̶",
        "A̶",
        "B̶",
        "C̶",
        "D̶",
        "E̶",
        "F̶",
        "G̶",
        "H̶",
        "I̶",
        "J̶",
        "K̶",
        "L̶",
        "M̶",
        "N̶",
        "O̶",
        "P̶",
        "Q̶",
        "R̶",
        "S̶",
        "T̶",
        "U̶",
        "V̶",
        "W̶",
        "X̶",
        "Y̶",
        "Z̶",
        "1̶",
        "2̶",
        "3̶",
        "4̶",
        "5̶",
        "6̶",
        "7̶",
        "8̶",
        "9̶",
        "0̶",
    ];

    // 𝚊 𝚋 𝚌 𝚍 𝚎 𝚏 𝚐 𝚑 𝚒 𝚓 𝚔 𝚕 𝚖 𝚗 𝚘 𝚙 𝚚 𝚛 𝚜 𝚝 𝚞 𝚟 𝚠 𝚡 𝚢 𝚣 𝙰 𝙱 𝙲 𝙳 𝙴 𝙵 𝙶 𝙷 𝙸 𝙹 𝙺 𝙻 𝙼 𝙽 𝙾 𝙿 𝚀 𝚁 𝚂 𝚃 𝚄 𝚅 𝚆 𝚇 𝚈 𝚉 𝟷 𝟸 𝟹 𝟺 𝟻 𝟼 𝟽 𝟾 𝟿 𝟶
    var typewriter = [
        "𝚊",
        "𝚋",
        "𝚌",
        "𝚍",
        "𝚎",
        "𝚏",
        "𝚐",
        "𝚑",
        "𝚒",
        "𝚓",
        "𝚔",
        "𝚕",
        "𝚖",
        "𝚗",
        "𝚘",
        "𝚙",
        "𝚚",
        "𝚛",
        "𝚜",
        "𝚝",
        "𝚞",
        "𝚟",
        "𝚠",
        "𝚡",
        "𝚢",
        "𝚣",
        "𝙰",
        "𝙱",
        "𝙲",
        "𝙳",
        "𝙴",
        "𝙵",
        "𝙶",
        "𝙷",
        "𝙸",
        "𝙹",
        "𝙺",
        "𝙻",
        "𝙼",
        "𝙽",
        "𝙾",
        "𝙿",
        "𝚀",
        "𝚁",
        "𝚂",
        "𝚃",
        "𝚄",
        "𝚅",
        "𝚆",
        "𝚇",
        "𝚈",
        "𝚉",
        "𝟷",
        "𝟸",
        "𝟹",
        "𝟺",
        "𝟻",
        "𝟼",
        "𝟽",
        "𝟾",
        "𝟿",
        "𝟶",
    ];

    // ａ ｂ ｃ ｄ ｅ ｆ ｇ ｈ ｉ ｊ ｋ ｌ ｍ ｎ ｏ ｐ ｑ ｒ ｓ ｔ ｕ ｖ ｗ ｘ ｙ ｚ Ａ Ｂ Ｃ Ｄ Ｅ Ｆ Ｇ Ｈ Ｉ Ｊ Ｋ Ｌ Ｍ Ｎ Ｏ Ｐ Ｑ Ｒ Ｓ Ｔ Ｕ Ｖ Ｗ Ｘ Ｙ Ｚ １ ２ ３ ４ ５ ６ ７ ８ ９ ０
    var wide = [
        "ａ",
        "ｂ",
        "ｃ",
        "ｄ",
        "ｅ",
        "ｆ",
        "ｇ",
        "ｈ",
        "ｉ",
        "ｊ",
        "ｋ",
        "ｌ",
        "ｍ",
        "ｎ",
        "ｏ",
        "ｐ",
        "ｑ",
        "ｒ",
        "ｓ",
        "ｔ",
        "ｕ",
        "ｖ",
        "ｗ",
        "ｘ",
        "ｙ",
        "ｚ",
        "Ａ",
        "Ｂ",
        "Ｃ",
        "Ｄ",
        "Ｅ",
        "Ｆ",
        "Ｇ",
        "Ｈ",
        "Ｉ",
        "Ｊ",
        "Ｋ",
        "Ｌ",
        "Ｍ",
        "Ｎ",
        "Ｏ",
        "Ｐ",
        "Ｑ",
        "Ｒ",
        "Ｓ",
        "Ｔ",
        "Ｕ",
        "Ｖ",
        "Ｗ",
        "Ｘ",
        "Ｙ",
        "Ｚ",
        "１",
        "２",
        "３",
        "４",
        "５",
        "６",
        "７",
        "８",
        "９",
        "０",
    ];

    // ᵃ ᵇ ᶜ ᵈ ᵉ ᶠ ᵍ ʰ ᶦ ʲ ᵏ ˡ ᵐ ⁿ ᵒ ᵖ ᵠ ʳ ˢ ᵗ ᵘ ᵛ ʷ ˣ ʸ ᶻ ᴬ ᴮ ᶜ ᴰ ᴱ ᶠ ᴳ ᴴ ᴵ ᴶ ᴷ ᴸ ᴹ ᴺ ᴼ ᴾ ᵠ ᴿ ˢ ᵀ ᵁ ⱽ ᵂ ˣ ʸ ᶻ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁰
    var superscript = [
        "ᵃ",
        "ᵇ",
        "ᶜ",
        "ᵈ",
        "ᵉ",
        "ᶠ",
        "ᵍ",
        "ʰ",
        "ᶦ",
        "ʲ",
        "ᵏ",
        "ˡ",
        "ᵐ",
        "ⁿ",
        "ᵒ",
        "ᵖ",
        "ᵠ",
        "ʳ",
        "ˢ",
        "ᵗ",
        "ᵘ",
        "ᵛ",
        "ʷ",
        "ˣ",
        "ʸ",
        "ᶻ",
        "ᴬ",
        "ᴮ",
        "ᶜ",
        "ᴰ",
        "ᴱ",
        "ᶠ",
        "ᴳ",
        "ᴴ",
        "ᴵ",
        "ᴶ",
        "ᴷ",
        "ᴸ",
        "ᴹ",
        "ᴺ",
        "ᴼ",
        "ᴾ",
        "ᵠ",
        "ᴿ",
        "ˢ",
        "ᵀ",
        "ᵁ",
        "ⱽ",
        "ᵂ",
        "ˣ",
        "ʸ",
        "ᶻ",
        "¹",
        "²",
        "³",
        "⁴",
        "⁵",
        "⁶",
        "⁷",
        "⁸",
        "⁹",
        "⁰",
    ];

    // ₐ ᵦ 𝒸 𝒹 ₑ 𝒻 𝓰 ₕ ᵢ ⱼ ₖ ₗ ₘ ₙ ₒ ₚ ᵩ ᵣ ₛ ₜ ᵤ ᵥ 𝓌 ₓ ᵧ 𝓏 ₐ B C D ₑ F G ₕ ᵢ ⱼ ₖ ₗ ₘ ₙ ₒ ₚ Q ᵣ ₛ ₜ ᵤ ᵥ W ₓ Y Z ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₀
    var subscript = [
        "ₐ",
        "ᵦ",
        "𝒸",
        "𝒹",
        "ₑ",
        "𝒻",
        "𝓰",
        "ₕ",
        "ᵢ",
        "ⱼ",
        "ₖ",
        "ₗ",
        "ₘ",
        "ₙ",
        "ₒ",
        "ₚ",
        "ᵩ",
        "ᵣ",
        "ₛ",
        "ₜ",
        "ᵤ",
        "ᵥ",
        "𝓌",
        "ₓ",
        "ᵧ",
        "𝓏",
        "ₐ",
        "B",
        "C",
        "D",
        "ₑ",
        "F",
        "G",
        "ₕ",
        "ᵢ",
        "ⱼ",
        "ₖ",
        "ₗ",
        "ₘ",
        "ₙ",
        "ₒ",
        "ₚ",
        "Q",
        "ᵣ",
        "ₛ",
        "ₜ",
        "ᵤ",
        "ᵥ",
        "W",
        "ₓ",
        "Y",
        "Z",
        "₁",
        "₂",
        "₃",
        "₄",
        "₅",
        "₆",
        "₇",
        "₈",
        "₉",
        "₀",
    ];

    const glyphMap = {};
    base.forEach((char, i) => {
        glyphMap[char] = {
            Bold: bold[i],
            "Bold Italic": boldItalic[i],
            Box: box[i],
            "Box Filled": boxFilled[i],
            Circle: circle[i],
            Cursive: cursive[i],
            "Cursive Bold": cursiveBold[i],
            Goth: goth[i],
            "Goth Bold": gothBold[i],
            Italic: italic[i],
            Slash: slashSymbol[i],
            Stem: stemOutline[i],
            Strike: strike[i],
            Subscript: subscript[i],
            Superscript: superscript[i],
            Typewriter: typewriter[i],
            Wide: wide[i],
        };
    });
    const validGlyphs = base;
    const turnText = (chars, style) => chars.map((c) => (validGlyphs.includes(c) ? glyphMap[c][style] : c)).join("");
    const mapInput = (text) => {
        const chars = text.split("");
        const ret = {
            Italic: turnText(chars, "Italic"),
            Bold: turnText(chars, "Bold"),
            "Bold Italic": turnText(chars, "Bold Italic"),
            "Alternating Case One": chars
                .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
                .join(""),
            "Alternating Case Two": chars
                .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
                .join(""),
            Box: turnText(chars, "Box"),
            "Box Filled": turnText(chars, "Box Filled"),
            Circle: turnText(chars, "Circle"),
            Cursive: turnText(chars, "Cursive"),
            "Cursive Bold": turnText(chars, "Cursive Bold"),
            Goth: turnText(chars, "Goth"),
            "Goth Bold": turnText(chars, "Goth Bold"),
            Slash: turnText(chars, "Slash"),
            Stem: turnText(chars, "Stem"),
            Strike: turnText(chars, "Strike"),
            Subscript: turnText(chars, "Subscript"),
            Superscript: turnText(chars, "Superscript"),
            Typewriter: turnText(chars, "Typewriter"),
            Wide: turnText(chars, "Wide"),
        };
        return ret;
    };

    /* src/github.svg.rollup-plugin.svelte generated by Svelte v3.47.0 */

    const file$1 = "src/github.svg.rollup-plugin.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let path;

    	let svg_levels = [
    		{ "stroke-width": "0" },
    		{ viewBox: "0 0 32 32" },
    		{ height: "1.5em" },
    		{ width: "1.5em" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M19.906 17.847c.429 0 .79.21 1.102.636.31.422.468.944.468 1.56 0 .619-.156 1.141-.468 1.563s-.678.634-1.102.634c-.451 0-.839-.21-1.151-.634-.307-.422-.465-.944-.465-1.563s.153-1.139.465-1.56c.312-.427.702-.636 1.151-.636zm5.519-5.715c1.202 1.303 1.809 2.884 1.809 4.738 0 1.203-.142 2.286-.415 3.249-.278.958-.629 1.743-1.048 2.343a6.705 6.705 0 0 1-1.565 1.585c-.622.461-1.195.79-1.712 1.002s-1.112.376-1.785.49c-.665.117-1.168.18-1.517.198-.336.015-.702.022-1.097.022-.088 0-.385.01-.879.024-.482.02-.896.029-1.218.029s-.736-.01-1.218-.029a56.19 56.19 0 0 0-.879-.024c-.395 0-.764-.005-1.098-.022-.35-.017-.852-.08-1.514-.198a8.023 8.023 0 0 1-1.787-.49c-.517-.21-1.089-.541-1.708-1.002a6.832 6.832 0 0 1-1.568-1.585c-.419-.6-.772-1.385-1.048-2.343-.272-.963-.414-2.046-.414-3.249 0-1.854.605-3.435 1.81-4.738-.133-.065-.14-.714-.021-1.952.107-1.239.37-2.38.797-3.421 1.503.16 3.352 1.008 5.567 2.539.748-.195 1.772-.295 3.078-.295 1.37 0 2.394.1 3.079.295 1.009-.681 1.975-1.239 2.896-1.663.936-.419 1.609-.667 2.033-.731l.634-.145c.429 1.041.692 2.185.8 3.421.124 1.237.117 1.887-.015 1.952zm-9.373 12.551c2.703 0 4.741-.324 6.125-.973 1.38-.651 2.082-1.99 2.082-4.008 0-1.17-.441-2.15-1.322-2.932a2.991 2.991 0 0 0-1.595-.781c-.595-.098-1.514-.098-2.755 0-1.236.1-2.082.145-2.537.145-.619 0-1.291-.033-2.125-.098a65.737 65.737 0 0 0-1.954-.122 6.021 6.021 0 0 0-1.538.172c-.557.133-1.008.357-1.373.681-.84.75-1.266 1.725-1.266 2.932 0 2.019.684 3.357 2.05 4.006 1.365.653 3.397.975 6.101.975zm-3.909-6.836c.424 0 .789.21 1.098.636.31.422.467.944.467 1.56 0 .619-.155 1.141-.467 1.563-.309.422-.677.634-1.098.634-.455 0-.841-.21-1.153-.634-.309-.422-.467-.944-.467-1.563s.155-1.139.467-1.56c.312-.427.699-.636 1.153-.636z");
    			add_location(path, file$1, 0, 120, 120);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "stroke-width": "0" },
    				{ viewBox: "0 0 32 32" },
    				{ height: "1.5em" },
    				{ width: "1.5em" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Github_svg_rollup_plugin', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Github_svg_rollup_plugin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Github_svg_rollup_plugin",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (19:6) {#if show}
    function create_if_block(ctx) {
    	let div;
    	let t_value = /*styles*/ ctx[2][/*style*/ ctx[6]] + "";
    	let t;
    	let div_data_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "data-style", div_data_style_value = /*style*/ ctx[6]);
    			attr_dev(div, "class", "svelte-6e8yn4");
    			add_location(div, file, 19, 8, 582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*styles*/ 4 && t_value !== (t_value = /*styles*/ ctx[2][/*style*/ ctx[6]] + "")) set_data_dev(t, t_value);

    			if (dirty & /*styles*/ 4 && div_data_style_value !== (div_data_style_value = /*style*/ ctx[6])) {
    				attr_dev(div, "data-style", div_data_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(19:6) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#each Object.keys(styles) as style}
    function create_each_block(ctx) {
    	let p;
    	let small;
    	let t0_value = /*style*/ ctx[6] + "";
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[1] && create_if_block(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*style*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			small = element("small");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			attr_dev(small, "class", "svelte-6e8yn4");
    			add_location(small, file, 17, 6, 534);
    			attr_dev(p, "class", "svelte-6e8yn4");
    			add_location(p, file, 16, 4, 488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, small);
    			append_dev(small, t0);
    			append_dev(p, t1);
    			if (if_block) if_block.m(p, null);
    			append_dev(p, t2);

    			if (!mounted) {
    				dispose = listen_dev(p, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*styles*/ 4 && t0_value !== (t0_value = /*style*/ ctx[6] + "")) set_data_dev(t0, t0_value);

    			if (/*show*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(p, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:2) {#each Object.keys(styles) as style}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let input;
    	let t0;
    	let main;
    	let small;
    	let t2;
    	let t3;
    	let footer;
    	let a;
    	let githublogo;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*styles*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	githublogo = new Github_svg_rollup_plugin({ props: { class: "logo" }, $$inline: true });

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			main = element("main");
    			small = element("small");
    			small.textContent = "Click/tap to copy";
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			footer = element("footer");
    			a = element("a");
    			create_component(githublogo.$$.fragment);
    			attr_dev(input, "placeholder", "type something...");
    			attr_dev(input, "class", "svelte-6e8yn4");
    			add_location(input, file, 11, 0, 342);
    			attr_dev(small, "class", "svelte-6e8yn4");
    			add_location(small, file, 14, 2, 412);
    			attr_dev(main, "class", "svelte-6e8yn4");
    			add_location(main, file, 13, 0, 403);
    			attr_dev(a, "href", "https://github.com/afreeorange/stylish-text-generator");
    			attr_dev(a, "title", "Source on Github");
    			attr_dev(a, "class", "svelte-6e8yn4");
    			add_location(a, file, 28, 2, 699);
    			attr_dev(footer, "class", "svelte-6e8yn4");
    			add_location(footer, file, 27, 0, 688);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*text*/ ctx[0]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, small);
    			append_dev(main, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, a);
    			mount_component(githublogo, a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}

    			if (dirty & /*handleClick, Object, styles, show*/ 14) {
    				each_value = Object.keys(/*styles*/ ctx[2]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(githublogo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(githublogo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(footer);
    			destroy_component(githublogo);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let styles;
    	let show;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const handleClick = style => {
    		const e = document.querySelector(`[data-style="${style}"]`);
    		navigator.clipboard.writeText(e.innerText);
    	};

    	let text = ``;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	const click_handler = style => handleClick(style);

    	$$self.$capture_state = () => ({
    		mapInput,
    		GithubLogo: Github_svg_rollup_plugin,
    		handleClick,
    		text,
    		show,
    		styles
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('styles' in $$props) $$invalidate(2, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 1) {
    			$$invalidate(2, styles = mapInput(text));
    		}

    		if ($$self.$$.dirty & /*text*/ 1) {
    			$$invalidate(1, show = text.length === 0 ? false : true);
    		}
    	};

    	return [text, show, styles, handleClick, input_input_handler, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
