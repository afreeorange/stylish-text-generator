
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    const glyphMap = {};
    base.forEach((char, i) => {
        glyphMap[char] = {
            "Bold Italic": boldItalic[i],
            Bold: bold[i],
            "Box Filled": boxFilled[i],
            Box: box[i],
            Circle: circle[i],
            "Cursive Bold": cursiveBold[i],
            Cursive: cursive[i],
            "Goth Bold": gothBold[i],
            Goth: goth[i],
            Italic: italic[i],
            Slash: slashSymbol[i],
            Stem: stemOutline[i],
            Strike: strike[i],
            Typewriter: typewriter[i],
            Wide: wide[i],
        };
    });
    const validGlyphs = base;
    const turnText = (chars, style) => chars.map((c) => (validGlyphs.includes(c) ? glyphMap[c][style] : c)).join("");
    const mapInput = (text) => {
        const chars = text.split("");
        const ret = {
            Bold: turnText(chars, "Bold"),
            "Bold Italic": turnText(chars, "Bold Italic"),
            Box: turnText(chars, "Box"),
            "Box Filled": turnText(chars, "Box Filled"),
            Circle: turnText(chars, "Circle"),
            Cursive: turnText(chars, "Cursive"),
            "Cursive Bold": turnText(chars, "Cursive Bold"),
            Goth: turnText(chars, "Goth"),
            "Goth Bold": turnText(chars, "Goth Bold"),
            Italic: turnText(chars, "Italic"),
            Slash: turnText(chars, "Slash"),
            Stem: turnText(chars, "Stem"),
            Strike: turnText(chars, "Strike"),
            Typewriter: turnText(chars, "Typewriter"),
            Wide: turnText(chars, "Wide"),
            "Alternating Case One": chars
                .map((c, i) => (i % 2 === 0 ? c : c.toUpperCase()))
                .join(""),
            "Alternating Case Two": chars
                .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c))
                .join(""),
        };
        return ret;
    };

    /* src/App.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (18:6) {#if show}
    function create_if_block(ctx) {
    	let div;
    	let t_value = /*styles*/ ctx[2][/*style*/ ctx[5]] + "";
    	let t;
    	let div_data_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "data-style", div_data_style_value = /*style*/ ctx[5]);
    			add_location(div, file, 18, 8, 491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*styles*/ 4 && t_value !== (t_value = /*styles*/ ctx[2][/*style*/ ctx[5]] + "")) set_data_dev(t, t_value);

    			if (dirty & /*styles*/ 4 && div_data_style_value !== (div_data_style_value = /*style*/ ctx[5])) {
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
    		source: "(18:6) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each Object.keys(styles) as style}
    function create_each_block(ctx) {
    	let p;
    	let small;
    	let t0_value = /*style*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[1] && create_if_block(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*style*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			small = element("small");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			add_location(small, file, 16, 6, 443);
    			add_location(p, file, 10, 4, 274);
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
    			if (dirty & /*styles*/ 4 && t0_value !== (t0_value = /*style*/ ctx[5] + "")) set_data_dev(t0, t0_value);

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
    		source: "(10:2) {#each Object.keys(styles) as style}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let input;
    	let t;
    	let main;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*styles*/ ctx[2]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			t = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(input, "placeholder", "type something...");
    			add_location(input, file, 6, 0, 163);
    			add_location(main, file, 8, 0, 224);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*text*/ ctx[0]);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}

    			if (dirty & /*document, Object, styles, navigator, show*/ 6) {
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
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
    	let text = `Southpark`;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	const click_handler = style => {
    		const e = document.querySelector(`[data-style="${style}"]`);
    		navigator.clipboard.writeText(e.innerText);
    	};

    	$$self.$capture_state = () => ({ mapInput, text, show, styles });

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

    	return [text, show, styles, input_input_handler, click_handler];
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
//# sourceMappingURL=bundle.js.map
