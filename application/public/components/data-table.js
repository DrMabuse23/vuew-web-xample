/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "5a74");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

  "use strict";

  var LIBRARY = __webpack_require__("2d00");
  var $export = __webpack_require__("5ca1");
  var redefine = __webpack_require__("2aba");
  var hide = __webpack_require__("32e9");
  var Iterators = __webpack_require__("84f2");
  var $iterCreate = __webpack_require__("41a0");
  var setToStringTag = __webpack_require__("7f20");
  var getPrototypeOf = __webpack_require__("38fd");
  var ITERATOR = __webpack_require__("2b4c")('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';
  
  var returnThis = function () { return this; };
  
  module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    // Plug for library
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine(proto, key, methods[key]);
      } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  
  
  /***/ }),
  
  /***/ "0d58":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  var $keys = __webpack_require__("ce10");
  var enumBugKeys = __webpack_require__("e11e");
  
  module.exports = Object.keys || function keys(O) {
    return $keys(O, enumBugKeys);
  };
  
  
  /***/ }),
  
  /***/ "1495":
  /***/ (function(module, exports, __webpack_require__) {
  
  var dP = __webpack_require__("86cc");
  var anObject = __webpack_require__("cb7c");
  var getKeys = __webpack_require__("0d58");
  
  module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = getKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) dP.f(O, P = keys[i++], Properties[P]);
    return O;
  };
  
  
  /***/ }),
  
  /***/ "230e":
  /***/ (function(module, exports, __webpack_require__) {
  
  var isObject = __webpack_require__("d3f4");
  var document = __webpack_require__("7726").document;
  // typeof document.createElement is 'object' in old IE
  var is = isObject(document) && isObject(document.createElement);
  module.exports = function (it) {
    return is ? document.createElement(it) : {};
  };
  
  
  /***/ }),
  
  /***/ "2350":
  /***/ (function(module, exports) {
  
  /*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
  */
  // css base code, injected by the css-loader
  module.exports = function(useSourceMap) {
    var list = [];
  
    // return the list of modules as css string
    list.toString = function toString() {
      return this.map(function (item) {
        var content = cssWithMappingToString(item, useSourceMap);
        if(item[2]) {
          return "@media " + item[2] + "{" + content + "}";
        } else {
          return content;
        }
      }).join("");
    };
  
    // import a list of modules into the list
    list.i = function(modules, mediaQuery) {
      if(typeof modules === "string")
        modules = [[null, modules, ""]];
      var alreadyImportedModules = {};
      for(var i = 0; i < this.length; i++) {
        var id = this[i][0];
        if(typeof id === "number")
          alreadyImportedModules[id] = true;
      }
      for(i = 0; i < modules.length; i++) {
        var item = modules[i];
        // skip already imported module
        // this implementation is not 100% perfect for weird media query combinations
        //  when a module is imported multiple times with different media queries.
        //  I hope this will never occur (Hey this way we have smaller bundles)
        if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
          if(mediaQuery && !item[2]) {
            item[2] = mediaQuery;
          } else if(mediaQuery) {
            item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
          }
          list.push(item);
        }
      }
    };
    return list;
  };
  
  function cssWithMappingToString(item, useSourceMap) {
    var content = item[1] || '';
    var cssMapping = item[3];
    if (!cssMapping) {
      return content;
    }
  
    if (useSourceMap && typeof btoa === 'function') {
      var sourceMapping = toComment(cssMapping);
      var sourceURLs = cssMapping.sources.map(function (source) {
        return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
      });
  
      return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
    }
  
    return [content].join('\n');
  }
  
  // Adapted from convert-source-map (MIT)
  function toComment(sourceMap) {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
    var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  
    return '/*# ' + data + ' */';
  }
  
  
  /***/ }),
  
  /***/ "2aba":
  /***/ (function(module, exports, __webpack_require__) {
  
  var global = __webpack_require__("7726");
  var hide = __webpack_require__("32e9");
  var has = __webpack_require__("69a8");
  var SRC = __webpack_require__("ca5a")('src');
  var $toString = __webpack_require__("fa5b");
  var TO_STRING = 'toString';
  var TPL = ('' + $toString).split(TO_STRING);
  
  __webpack_require__("8378").inspectSource = function (it) {
    return $toString.call(it);
  };
  
  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      hide(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
  
  
  /***/ }),
  
  /***/ "2aeb":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  var anObject = __webpack_require__("cb7c");
  var dPs = __webpack_require__("1495");
  var enumBugKeys = __webpack_require__("e11e");
  var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE = 'prototype';
  
  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = __webpack_require__("230e")('iframe');
    var i = enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    __webpack_require__("fab2").appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
    return createDict();
  };
  
  module.exports = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : dPs(result, Properties);
  };
  
  
  /***/ }),
  
  /***/ "2b4c":
  /***/ (function(module, exports, __webpack_require__) {
  
  var store = __webpack_require__("5537")('wks');
  var uid = __webpack_require__("ca5a");
  var Symbol = __webpack_require__("7726").Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';
  
  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
  };
  
  $exports.store = store;
  
  
  /***/ }),
  
  /***/ "2d00":
  /***/ (function(module, exports) {
  
  module.exports = false;
  
  
  /***/ }),
  
  /***/ "2d95":
  /***/ (function(module, exports) {
  
  var toString = {}.toString;
  
  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };
  
  
  /***/ }),
  
  /***/ "32e9":
  /***/ (function(module, exports, __webpack_require__) {
  
  var dP = __webpack_require__("86cc");
  var createDesc = __webpack_require__("4630");
  module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
    return dP.f(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };
  
  
  /***/ }),
  
  /***/ "38fd":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  var has = __webpack_require__("69a8");
  var toObject = __webpack_require__("4bf8");
  var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
  var ObjectProto = Object.prototype;
  
  module.exports = Object.getPrototypeOf || function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO)) return O[IE_PROTO];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };
  
  
  /***/ }),
  
  /***/ "41a0":
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  var create = __webpack_require__("2aeb");
  var descriptor = __webpack_require__("4630");
  var setToStringTag = __webpack_require__("7f20");
  var IteratorPrototype = {};
  
  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  __webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });
  
  module.exports = function (Constructor, NAME, next) {
    Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  
  
  /***/ }),
  
  /***/ "4588":
  /***/ (function(module, exports) {
  
  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  
  
  /***/ }),
  
  /***/ "4630":
  /***/ (function(module, exports) {
  
  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  
  
  /***/ }),
  
  /***/ "4bf8":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 7.1.13 ToObject(argument)
  var defined = __webpack_require__("be13");
  module.exports = function (it) {
    return Object(defined(it));
  };
  
  
  /***/ }),
  
  /***/ "5537":
  /***/ (function(module, exports, __webpack_require__) {
  
  var core = __webpack_require__("8378");
  var global = __webpack_require__("7726");
  var SHARED = '__core-js_shared__';
  var store = global[SHARED] || (global[SHARED] = {});
  
  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: core.version,
    mode: __webpack_require__("2d00") ? 'pure' : 'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  
  
  /***/ }),
  
  /***/ "5a74":
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  
  // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
  // This file is imported into lib/wc client bundles.
  
  if (typeof window !== 'undefined') {
    if (Object({"NODE_ENV":"production","BASE_URL":"/"}).NEED_CURRENTSCRIPT_POLYFILL) {
      __webpack_require__("f6fd")
    }
  
    var i
    if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
      __webpack_require__.p = i[1] // eslint-disable-line
    }
  }
  
  // Indicate to webpack that this file can be concatenated
  /* harmony default export */ var setPublicPath = (null);
  
  // EXTERNAL MODULE: external "Vue"
  var external_Vue_ = __webpack_require__("8bbf");
  var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);
  
  // CONCATENATED MODULE: ./node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js
  const camelizeRE = /-(\w)/g;
  const camelize = str => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
  };
  
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = str => {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  };
  
  function getInitialProps (propsList) {
    const res = {};
    propsList.forEach(key => {
      res[key] = undefined;
    });
    return res
  }
  
  function injectHook (options, key, hook) {
    options[key] = [].concat(options[key] || []);
    options[key].unshift(hook);
  }
  
  function callHooks (vm, hook) {
    if (vm) {
      const hooks = vm.$options[hook] || [];
      hooks.forEach(hook => {
        hook.call(vm);
      });
    }
  }
  
  function createCustomEvent (name, args) {
    return new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      detail: args
    })
  }
  
  const isBoolean = val => /function Boolean/.test(String(val));
  const isNumber = val => /function Number/.test(String(val));
  
  function convertAttributeValue (value, name, { type } = {}) {
    if (isBoolean(type)) {
      if (value === 'true' || value === 'false') {
        return value === 'true'
      }
      if (value === '' || value === name) {
        return true
      }
      return value != null
    } else if (isNumber(type)) {
      const parsed = parseFloat(value, 10);
      return isNaN(parsed) ? value : parsed
    } else {
      return value
    }
  }
  
  function toVNodes (h, children) {
    const res = [];
    for (let i = 0, l = children.length; i < l; i++) {
      res.push(toVNode(h, children[i]));
    }
    return res
  }
  
  function toVNode (h, node) {
    if (node.nodeType === 3) {
      return node.data.trim() ? node.data : null
    } else if (node.nodeType === 1) {
      const data = {
        attrs: getAttributes(node),
        domProps: {
          innerHTML: node.innerHTML
        }
      };
      if (data.attrs.slot) {
        data.slot = data.attrs.slot;
        delete data.attrs.slot;
      }
      return h(node.tagName, data)
    } else {
      return null
    }
  }
  
  function getAttributes (node) {
    const res = {};
    for (let i = 0, l = node.attributes.length; i < l; i++) {
      const attr = node.attributes[i];
      res[attr.nodeName] = attr.nodeValue;
    }
    return res
  }
  
  function wrap (Vue, Component) {
    const isAsync = typeof Component === 'function' && !Component.cid;
    let isInitialized = false;
    let hyphenatedPropsList;
    let camelizedPropsList;
    let camelizedPropsMap;
  
    function initialize (Component) {
      if (isInitialized) return
  
      const options = typeof Component === 'function'
        ? Component.options
        : Component;
  
      // extract props info
      const propsList = Array.isArray(options.props)
        ? options.props
        : Object.keys(options.props || {});
      hyphenatedPropsList = propsList.map(hyphenate);
      camelizedPropsList = propsList.map(camelize);
      const originalPropsAsObject = Array.isArray(options.props) ? {} : options.props || {};
      camelizedPropsMap = camelizedPropsList.reduce((map, key, i) => {
        map[key] = originalPropsAsObject[propsList[i]];
        return map
      }, {});
  
      // proxy $emit to native DOM events
      injectHook(options, 'beforeCreate', function () {
        const emit = this.$emit;
        this.$emit = (name, ...args) => {
          this.$root.$options.customElement.dispatchEvent(createCustomEvent(name, args));
          return emit.call(this, name, ...args)
        };
      });
  
      injectHook(options, 'created', function () {
        // sync default props values to wrapper on created
        camelizedPropsList.forEach(key => {
          this.$root.props[key] = this[key];
        });
      });
  
      // proxy props as Element properties
      camelizedPropsList.forEach(key => {
        Object.defineProperty(CustomElement.prototype, key, {
          get () {
            return this._wrapper.props[key]
          },
          set (newVal) {
            this._wrapper.props[key] = newVal;
          },
          enumerable: false,
          configurable: true
        });
      });
  
      isInitialized = true;
    }
  
    function syncAttribute (el, key) {
      const camelized = camelize(key);
      const value = el.hasAttribute(key) ? el.getAttribute(key) : undefined;
      el._wrapper.props[camelized] = convertAttributeValue(
        value,
        key,
        camelizedPropsMap[camelized]
      );
    }
  
    class CustomElement extends HTMLElement {
      constructor () {
        super();
        this.attachShadow({ mode: 'open' });
  
        const wrapper = this._wrapper = new Vue({
          name: 'shadow-root',
          customElement: this,
          shadowRoot: this.shadowRoot,
          data () {
            return {
              props: {},
              slotChildren: []
            }
          },
          render (h) {
            return h(Component, {
              ref: 'inner',
              props: this.props
            }, this.slotChildren)
          }
        });
  
        // Use MutationObserver to react to future attribute & slot content change
        const observer = new MutationObserver(mutations => {
          let hasChildrenChange = false;
          for (let i = 0; i < mutations.length; i++) {
            const m = mutations[i];
            if (isInitialized && m.type === 'attributes' && m.target === this) {
              syncAttribute(this, m.attributeName);
            } else {
              hasChildrenChange = true;
            }
          }
          if (hasChildrenChange) {
            wrapper.slotChildren = Object.freeze(toVNodes(
              wrapper.$createElement,
              this.childNodes
            ));
          }
        });
        observer.observe(this, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });
      }
  
      get vueComponent () {
        return this._wrapper.$refs.inner
      }
  
      connectedCallback () {
        const wrapper = this._wrapper;
        if (!wrapper._isMounted) {
          // initialize attributes
          const syncInitialAttributes = () => {
            wrapper.props = getInitialProps(camelizedPropsList);
            hyphenatedPropsList.forEach(key => {
              syncAttribute(this, key);
            });
          };
  
          if (isInitialized) {
            syncInitialAttributes();
          } else {
            // async & unresolved
            Component().then(resolved => {
              if (resolved.__esModule || resolved[Symbol.toStringTag] === 'Module') {
                resolved = resolved.default;
              }
              initialize(resolved);
              syncInitialAttributes();
            });
          }
          // initialize children
          wrapper.slotChildren = Object.freeze(toVNodes(
            wrapper.$createElement,
            this.childNodes
          ));
          wrapper.$mount();
          this.shadowRoot.appendChild(wrapper.$el);
        } else {
          callHooks(this.vueComponent, 'activated');
        }
      }
  
      disconnectedCallback () {
        callHooks(this.vueComponent, 'deactivated');
      }
    }
  
    if (!isAsync) {
      initialize(Component);
    }
  
    return CustomElement
  }
  
  /* harmony default export */ var vue_wc_wrapper = (wrap);
  
  // EXTERNAL MODULE: ./node_modules/css-loader/lib/css-base.js
  var css_base = __webpack_require__("2350");
  
  // CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
  /**
   * Translates the list format produced by css-loader into something
   * easier to manipulate.
   */
  function listToStyles (parentId, list) {
    var styles = []
    var newStyles = {}
    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      var id = item[0]
      var css = item[1]
      var media = item[2]
      var sourceMap = item[3]
      var part = {
        id: parentId + ':' + i,
        css: css,
        media: media,
        sourceMap: sourceMap
      }
      if (!newStyles[id]) {
        styles.push(newStyles[id] = { id: id, parts: [part] })
      } else {
        newStyles[id].parts.push(part)
      }
    }
    return styles
  }
  
  // CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesShadow.js
  
  
  function addStylesToShadowDOM (parentId, list, shadowRoot) {
    var styles = listToStyles(parentId, list)
    addStyles(styles, shadowRoot)
  }
  
  /*
  type StyleObject = {
    id: number;
    parts: Array<StyleObjectPart>
  }
  
  type StyleObjectPart = {
    css: string;
    media: string;
    sourceMap: ?string
  }
  */
  
  function addStyles (styles /* Array<StyleObject> */, shadowRoot) {
    const injectedStyles =
      shadowRoot._injectedStyles ||
      (shadowRoot._injectedStyles = {})
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var style = injectedStyles[item.id]
      if (!style) {
        for (var j = 0; j < item.parts.length; j++) {
          addStyle(item.parts[j], shadowRoot)
        }
        injectedStyles[item.id] = true
      }
    }
  }
  
  function createStyleElement (shadowRoot) {
    var styleElement = document.createElement('style')
    styleElement.type = 'text/css'
    shadowRoot.appendChild(styleElement)
    return styleElement
  }
  
  function addStyle (obj /* StyleObjectPart */, shadowRoot) {
    var styleElement = createStyleElement(shadowRoot)
    var css = obj.css
    var media = obj.media
    var sourceMap = obj.sourceMap
  
    if (media) {
      styleElement.setAttribute('media', media)
    }
  
    if (sourceMap) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
      // http://stackoverflow.com/a/26603875
      css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
    }
  
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = css
    } else {
      while (styleElement.firstChild) {
        styleElement.removeChild(styleElement.firstChild)
      }
      styleElement.appendChild(document.createTextNode(css))
    }
  }
  
  // CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
  /* globals __VUE_SSR_CONTEXT__ */
  
  // IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
  // This module is a runtime utility for cleaner component module output and will
  // be included in the final webpack user bundle.
  
  function normalizeComponent (
    scriptExports,
    render,
    staticRenderFns,
    functionalTemplate,
    injectStyles,
    scopeId,
    moduleIdentifier, /* server only */
    shadowMode /* vue-cli only */
  ) {
    // Vue.extend constructor export interop
    var options = typeof scriptExports === 'function'
      ? scriptExports.options
      : scriptExports
  
    // render functions
    if (render) {
      options.render = render
      options.staticRenderFns = staticRenderFns
      options._compiled = true
    }
  
    // functional template
    if (functionalTemplate) {
      options.functional = true
    }
  
    // scopedId
    if (scopeId) {
      options._scopeId = 'data-v-' + scopeId
    }
  
    var hook
    if (moduleIdentifier) { // server build
      hook = function (context) {
        // 2.3 injection
        context =
          context || // cached call
          (this.$vnode && this.$vnode.ssrContext) || // stateful
          (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
        // 2.2 with runInNewContext: true
        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__
        }
        // inject component styles
        if (injectStyles) {
          injectStyles.call(this, context)
        }
        // register component module identifier for async chunk inferrence
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier)
        }
      }
      // used by ssr in case component is cached and beforeCreate
      // never gets called
      options._ssrRegister = hook
    } else if (injectStyles) {
      hook = shadowMode
        ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
        : injectStyles
    }
  
    if (hook) {
      if (options.functional) {
        // for template-only hot-reload because in that case the render fn doesn't
        // go through the normalizer
        options._injectStyles = hook
        // register for functioal component in vue file
        var originalRender = options.render
        options.render = function renderWithStyleInjection (h, context) {
          hook.call(context)
          return originalRender(h, context)
        }
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate
        options.beforeCreate = existing
          ? [].concat(existing, hook)
          : [hook]
      }
    }
  
    return {
      exports: scriptExports,
      options: options
    }
  }
  
  // EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
  var web_dom_iterable = __webpack_require__("ac6a");
  
  // CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */
  
  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };
  
  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  
  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      }
      return __assign.apply(this, arguments);
  }
  
  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }
  
  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  
  function __param(paramIndex, decorator) {
      return function (target, key) { decorator(target, key, paramIndex); }
  }
  
  function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }
  
  function __awaiter(thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }
  
  function __generator(thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  }
  
  function __exportStar(m, exports) {
      for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  
  function __values(o) {
      var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
      if (m) return m.call(o);
      return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
  }
  
  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }
  
  function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read(arguments[i]));
      return ar;
  }
  
  function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  
  function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
      function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
      function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
      function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
      function fulfill(value) { resume("next", value); }
      function reject(value) { resume("throw", value); }
      function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
  }
  
  function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
      function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
  }
  
  function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
      function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
      function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
  }
  
  function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
      return cooked;
  };
  
  function __importStar(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
      result.default = mod;
      return result;
  }
  
  function __importDefault(mod) {
      return (mod && mod.__esModule) ? mod : { default: mod };
  }
  
  // CONCATENATED MODULE: ./node_modules/vue-class-component/dist/vue-class-component.esm.js
  /**
    * vue-class-component v7.1.0
    * (c) 2015-present Evan You
    * @license MIT
    */
  
  
  // The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
  // which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
  // Without this check consumers will encounter hard to track down runtime errors.
  var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
  function copyReflectionMetadata(to, from) {
      forwardMetadata(to, from);
      Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
          forwardMetadata(to.prototype, from.prototype, key);
      });
      Object.getOwnPropertyNames(from).forEach(function (key) {
          forwardMetadata(to, from, key);
      });
  }
  function forwardMetadata(to, from, propertyKey) {
      var metaKeys = propertyKey
          ? Reflect.getOwnMetadataKeys(from, propertyKey)
          : Reflect.getOwnMetadataKeys(from);
      metaKeys.forEach(function (metaKey) {
          var metadata = propertyKey
              ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
              : Reflect.getOwnMetadata(metaKey, from);
          if (propertyKey) {
              Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
          }
          else {
              Reflect.defineMetadata(metaKey, metadata, to);
          }
      });
  }
  
  var fakeArray = { __proto__: [] };
  var hasProto = fakeArray instanceof Array;
  function createDecorator(factory) {
      return function (target, key, index) {
          var Ctor = typeof target === 'function'
              ? target
              : target.constructor;
          if (!Ctor.__decorators__) {
              Ctor.__decorators__ = [];
          }
          if (typeof index !== 'number') {
              index = undefined;
          }
          Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
      };
  }
  function mixins() {
      var Ctors = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          Ctors[_i] = arguments[_i];
      }
      return external_Vue_default.a.extend({ mixins: Ctors });
  }
  function isPrimitive(value) {
      var type = typeof value;
      return value == null || (type !== 'object' && type !== 'function');
  }
  function warn(message) {
      if (typeof console !== 'undefined') {
          console.warn('[vue-class-component] ' + message);
      }
  }
  
  function collectDataFromConstructor(vm, Component) {
      // override _init to prevent to init as Vue instance
      var originalInit = Component.prototype._init;
      Component.prototype._init = function () {
          var _this = this;
          // proxy to actual vm
          var keys = Object.getOwnPropertyNames(vm);
          // 2.2.0 compat (props are no longer exposed as self properties)
          if (vm.$options.props) {
              for (var key in vm.$options.props) {
                  if (!vm.hasOwnProperty(key)) {
                      keys.push(key);
                  }
              }
          }
          keys.forEach(function (key) {
              if (key.charAt(0) !== '_') {
                  Object.defineProperty(_this, key, {
                      get: function () { return vm[key]; },
                      set: function (value) { vm[key] = value; },
                      configurable: true
                  });
              }
          });
      };
      // should be acquired class property values
      var data = new Component();
      // restore original _init to avoid memory leak (#209)
      Component.prototype._init = originalInit;
      // create plain data object
      var plainData = {};
      Object.keys(data).forEach(function (key) {
          if (data[key] !== undefined) {
              plainData[key] = data[key];
          }
      });
      if (false) {}
      return plainData;
  }
  
  var $internalHooks = [
      'data',
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeDestroy',
      'destroyed',
      'beforeUpdate',
      'updated',
      'activated',
      'deactivated',
      'render',
      'errorCaptured',
      'serverPrefetch' // 2.6
  ];
  function componentFactory(Component, options) {
      if (options === void 0) { options = {}; }
      options.name = options.name || Component._componentTag || Component.name;
      // prototype props.
      var proto = Component.prototype;
      Object.getOwnPropertyNames(proto).forEach(function (key) {
          if (key === 'constructor') {
              return;
          }
          // hooks
          if ($internalHooks.indexOf(key) > -1) {
              options[key] = proto[key];
              return;
          }
          var descriptor = Object.getOwnPropertyDescriptor(proto, key);
          if (descriptor.value !== void 0) {
              // methods
              if (typeof descriptor.value === 'function') {
                  (options.methods || (options.methods = {}))[key] = descriptor.value;
              }
              else {
                  // typescript decorated data
                  (options.mixins || (options.mixins = [])).push({
                      data: function () {
                          var _a;
                          return _a = {}, _a[key] = descriptor.value, _a;
                      }
                  });
              }
          }
          else if (descriptor.get || descriptor.set) {
              // computed properties
              (options.computed || (options.computed = {}))[key] = {
                  get: descriptor.get,
                  set: descriptor.set
              };
          }
      });
      (options.mixins || (options.mixins = [])).push({
          data: function () {
              return collectDataFromConstructor(this, Component);
          }
      });
      // decorate options
      var decorators = Component.__decorators__;
      if (decorators) {
          decorators.forEach(function (fn) { return fn(options); });
          delete Component.__decorators__;
      }
      // find super
      var superProto = Object.getPrototypeOf(Component.prototype);
      var Super = superProto instanceof external_Vue_default.a
          ? superProto.constructor
          : external_Vue_default.a;
      var Extended = Super.extend(options);
      forwardStaticMembers(Extended, Component, Super);
      if (reflectionIsSupported) {
          copyReflectionMetadata(Extended, Component);
      }
      return Extended;
  }
  var reservedPropertyNames = [
      // Unique id
      'cid',
      // Super Vue constructor
      'super',
      // Component options that will be used by the component
      'options',
      'superOptions',
      'extendOptions',
      'sealedOptions',
      // Private assets
      'component',
      'directive',
      'filter'
  ];
  var shouldIgnore = {
      prototype: true,
      arguments: true,
      callee: true,
      caller: true
  };
  function forwardStaticMembers(Extended, Original, Super) {
      // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
      Object.getOwnPropertyNames(Original).forEach(function (key) {
          // Skip the properties that should not be overwritten
          if (shouldIgnore[key]) {
              return;
          }
          // Some browsers does not allow reconfigure built-in properties
          var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
          if (extendedDescriptor && !extendedDescriptor.configurable) {
              return;
          }
          var descriptor = Object.getOwnPropertyDescriptor(Original, key);
          // If the user agent does not support `__proto__` or its family (IE <= 10),
          // the sub class properties may be inherited properties from the super class in TypeScript.
          // We need to exclude such properties to prevent to overwrite
          // the component options object which stored on the extended constructor (See #192).
          // If the value is a referenced value (object or function),
          // we can check equality of them and exclude it if they have the same reference.
          // If it is a primitive value, it will be forwarded for safety.
          if (!hasProto) {
              // Only `cid` is explicitly exluded from property forwarding
              // because we cannot detect whether it is a inherited property or not
              // on the no `__proto__` environment even though the property is reserved.
              if (key === 'cid') {
                  return;
              }
              var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
              if (!isPrimitive(descriptor.value) &&
                  superDescriptor &&
                  superDescriptor.value === descriptor.value) {
                  return;
              }
          }
          // Warn if the users manually declare reserved properties
          if (false) {}
          Object.defineProperty(Extended, key, descriptor);
      });
  }
  
  function vue_class_component_esm_Component(options) {
      if (typeof options === 'function') {
          return componentFactory(options);
      }
      return function (Component) {
          return componentFactory(Component, options);
      };
  }
  vue_class_component_esm_Component.registerHooks = function registerHooks(keys) {
      $internalHooks.push.apply($internalHooks, keys);
  };
  
  /* harmony default export */ var vue_class_component_esm = (vue_class_component_esm_Component);
  
  
  // CONCATENATED MODULE: ./node_modules/vue-property-decorator/lib/vue-property-decorator.js
  /** vue-property-decorator verson 8.1.1 MIT LICENSE copyright 2018 kaorun343 */
  /// <reference types='reflect-metadata'/>
  
  
  
  
  /**
   * decorator of an inject
   * @param from key
   * @return PropertyDecorator
   */
  function Inject(options) {
      return createDecorator(function (componentOptions, key) {
          if (typeof componentOptions.inject === 'undefined') {
              componentOptions.inject = {};
          }
          if (!Array.isArray(componentOptions.inject)) {
              componentOptions.inject[key] = options || key;
          }
      });
  }
  /**
   * decorator of a provide
   * @param key key
   * @return PropertyDecorator | void
   */
  function Provide(key) {
      return createDecorator(function (componentOptions, k) {
          var provide = componentOptions.provide;
          if (typeof provide !== 'function' || !provide.managed) {
              var original_1 = componentOptions.provide;
              provide = componentOptions.provide = function () {
                  var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                  for (var i in provide.managed)
                      rv[provide.managed[i]] = this[i];
                  return rv;
              };
              provide.managed = {};
          }
          provide.managed[k] = key || k;
      });
  }
  /** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
  var reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
  function applyMetadata(options, target, key) {
      if (reflectMetadataIsSupported) {
          if (!Array.isArray(options) && typeof options !== 'function' && typeof options.type === 'undefined') {
              options.type = Reflect.getMetadata('design:type', target, key);
          }
      }
  }
  /**
   * decorator of model
   * @param  event event name
   * @param options options
   * @return PropertyDecorator
   */
  function Model(event, options) {
      if (options === void 0) { options = {}; }
      return function (target, key) {
          applyMetadata(options, target, key);
          createDecorator(function (componentOptions, k) {
              (componentOptions.props || (componentOptions.props = {}))[k] = options;
              componentOptions.model = { prop: k, event: event || k };
          })(target, key);
      };
  }
  /**
   * decorator of a prop
   * @param  options the options for the prop
   * @return PropertyDecorator | void
   */
  function Prop(options) {
      if (options === void 0) { options = {}; }
      return function (target, key) {
          applyMetadata(options, target, key);
          createDecorator(function (componentOptions, k) {
              (componentOptions.props || (componentOptions.props = {}))[k] = options;
          })(target, key);
      };
  }
  /**
   * decorator of a watch function
   * @param  path the path or the expression to observe
   * @param  WatchOption
   * @return MethodDecorator
   */
  function Watch(path, options) {
      if (options === void 0) { options = {}; }
      var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
      return createDecorator(function (componentOptions, handler) {
          if (typeof componentOptions.watch !== 'object') {
              componentOptions.watch = Object.create(null);
          }
          var watch = componentOptions.watch;
          if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
              watch[path] = [watch[path]];
          }
          else if (typeof watch[path] === 'undefined') {
              watch[path] = [];
          }
          watch[path].push({ handler: handler, deep: deep, immediate: immediate });
      });
  }
  // Code copied from Vue/src/shared/util.js
  var vue_property_decorator_hyphenateRE = /\B([A-Z])/g;
  var vue_property_decorator_hyphenate = function (str) { return str.replace(vue_property_decorator_hyphenateRE, '-$1').toLowerCase(); };
  /**
   * decorator of an event-emitter function
   * @param  event The name of the event
   * @return MethodDecorator
   */
  function Emit(event) {
      return function (_target, key, descriptor) {
          key = vue_property_decorator_hyphenate(key);
          var original = descriptor.value;
          descriptor.value = function emitter() {
              var _this = this;
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var emit = function (returnValue) {
                  if (returnValue !== undefined)
                      args.unshift(returnValue);
                  _this.$emit.apply(_this, [event || key].concat(args));
              };
              var returnValue = original.apply(this, args);
              if (isPromise(returnValue)) {
                  returnValue.then(function (returnValue) {
                      emit(returnValue);
                  });
              }
              else {
                  emit(returnValue);
              }
              return returnValue;
          };
      };
  }
  function isPromise(obj) {
      return obj instanceof Promise || (obj && typeof obj.then === 'function');
  }
  
  // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/ts-loader??ref--15-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/DataTable.vue?vue&type=script&lang=tsx&
  
  
  
  var DataTablevue_type_script_lang_tsx_DataTable = class DataTable extends external_Vue_default.a {
    created() {
      /* tslint:disable */
      console.log(this.mainData);
      /* tslint:enable */
    }
  
    render() {
      var h = arguments[0];
      return h("div", [h("h1", [this.msg]), h("table", [h("colgroup", {
        "attrs": {
          "span": "3"
        },
        "class": "columns"
      }), h("thead", [h("tr", [h("th", ["First name"]), h("th", ["Last name"]), h("th", ["Location"])])]), h("tbody", {
        "directives": [{
          name: "if",
          value: "mainData"
        }]
      }, [JSON.parse(this.mainData).forEach(element => {
        `
            ${JSON.stringify(element, null, 2)}
            <tr>
              <td>${element.users.first_name}</td>
              <td>${element.users.last_name}</td>
              <td>${element.sites.name}</td>
            </tr>
            `;
      })])])]);
    }
  
  };
  
  __decorate([Prop()], DataTablevue_type_script_lang_tsx_DataTable.prototype, "mainData", void 0);
  
  __decorate([Prop()], DataTablevue_type_script_lang_tsx_DataTable.prototype, "msg", void 0);
  
  DataTablevue_type_script_lang_tsx_DataTable = __decorate([vue_class_component_esm], DataTablevue_type_script_lang_tsx_DataTable);
  /* harmony default export */ var DataTablevue_type_script_lang_tsx_ = (DataTablevue_type_script_lang_tsx_DataTable);
  // CONCATENATED MODULE: ./src/components/DataTable.vue?vue&type=script&lang=tsx&
   /* harmony default export */ var components_DataTablevue_type_script_lang_tsx_ = (DataTablevue_type_script_lang_tsx_); 
  // CONCATENATED MODULE: ./src/components/DataTable.vue
  var render, staticRenderFns
  
  
  function injectStyles (context) {
    
    
  }
  
  /* normalize component */
  
  var component = normalizeComponent(
    components_DataTablevue_type_script_lang_tsx_,
    render,
    staticRenderFns,
    false,
    injectStyles,
    "911f3c60",
    null
    ,true
  )
  
  /* harmony default export */ var components_DataTable = (component.exports);
  // CONCATENATED MODULE: ./src/main.ts?shadow
  
  
  
  external_Vue_default.a.config.productionTip = false;
  var DataTableElement = vue_wc_wrapper(external_Vue_default.a, components_DataTable);
  window.customElements.define('data-table', DataTableElement);
  // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-wc.js
  
  
  
  
  // runtime shared by every component chunk
  
  
  
  
  
  window.customElements.define('data-table', vue_wc_wrapper(external_Vue_default.a, /* Cannot get final name for export "default" in "./src/main.ts?shadow" (known exports: , known reexports: ) */ undefined))
  
  /***/ }),
  
  /***/ "5ca1":
  /***/ (function(module, exports, __webpack_require__) {
  
  var global = __webpack_require__("7726");
  var core = __webpack_require__("8378");
  var hide = __webpack_require__("32e9");
  var redefine = __webpack_require__("2aba");
  var ctx = __webpack_require__("9b43");
  var PROTOTYPE = 'prototype';
  
  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      // extend global
      if (target) redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) hide(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  global.core = core;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  module.exports = $export;
  
  
  /***/ }),
  
  /***/ "613b":
  /***/ (function(module, exports, __webpack_require__) {
  
  var shared = __webpack_require__("5537")('keys');
  var uid = __webpack_require__("ca5a");
  module.exports = function (key) {
    return shared[key] || (shared[key] = uid(key));
  };
  
  
  /***/ }),
  
  /***/ "626a":
  /***/ (function(module, exports, __webpack_require__) {
  
  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = __webpack_require__("2d95");
  // eslint-disable-next-line no-prototype-builtins
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  
  
  /***/ }),
  
  /***/ "6821":
  /***/ (function(module, exports, __webpack_require__) {
  
  // to indexed object, toObject with fallback for non-array-like ES3 strings
  var IObject = __webpack_require__("626a");
  var defined = __webpack_require__("be13");
  module.exports = function (it) {
    return IObject(defined(it));
  };
  
  
  /***/ }),
  
  /***/ "69a8":
  /***/ (function(module, exports) {
  
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };
  
  
  /***/ }),
  
  /***/ "6a99":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 7.1.1 ToPrimitive(input [, PreferredType])
  var isObject = __webpack_require__("d3f4");
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  module.exports = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };
  
  
  /***/ }),
  
  /***/ "7726":
  /***/ (function(module, exports) {
  
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  
  
  /***/ }),
  
  /***/ "77f1":
  /***/ (function(module, exports, __webpack_require__) {
  
  var toInteger = __webpack_require__("4588");
  var max = Math.max;
  var min = Math.min;
  module.exports = function (index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  };
  
  
  /***/ }),
  
  /***/ "79e5":
  /***/ (function(module, exports) {
  
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  
  
  /***/ }),
  
  /***/ "7f20":
  /***/ (function(module, exports, __webpack_require__) {
  
  var def = __webpack_require__("86cc").f;
  var has = __webpack_require__("69a8");
  var TAG = __webpack_require__("2b4c")('toStringTag');
  
  module.exports = function (it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };
  
  
  /***/ }),
  
  /***/ "8378":
  /***/ (function(module, exports) {
  
  var core = module.exports = { version: '2.6.9' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  
  
  /***/ }),
  
  /***/ "84f2":
  /***/ (function(module, exports) {
  
  module.exports = {};
  
  
  /***/ }),
  
  /***/ "86cc":
  /***/ (function(module, exports, __webpack_require__) {
  
  var anObject = __webpack_require__("cb7c");
  var IE8_DOM_DEFINE = __webpack_require__("c69a");
  var toPrimitive = __webpack_require__("6a99");
  var dP = Object.defineProperty;
  
  exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };
  
  
  /***/ }),
  
  /***/ "8bbf":
  /***/ (function(module, exports) {
  
  module.exports = Vue;
  
  /***/ }),
  
  /***/ "9b43":
  /***/ (function(module, exports, __webpack_require__) {
  
  // optional / simple context binding
  var aFunction = __webpack_require__("d8e8");
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };
  
  
  /***/ }),
  
  /***/ "9c6c":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
  module.exports = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };
  
  
  /***/ }),
  
  /***/ "9def":
  /***/ (function(module, exports, __webpack_require__) {
  
  // 7.1.15 ToLength
  var toInteger = __webpack_require__("4588");
  var min = Math.min;
  module.exports = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };
  
  
  /***/ }),
  
  /***/ "9e1e":
  /***/ (function(module, exports, __webpack_require__) {
  
  // Thank's IE8 for his funny defineProperty
  module.exports = !__webpack_require__("79e5")(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });
  
  
  /***/ }),
  
  /***/ "ac6a":
  /***/ (function(module, exports, __webpack_require__) {
  
  var $iterators = __webpack_require__("cadf");
  var getKeys = __webpack_require__("0d58");
  var redefine = __webpack_require__("2aba");
  var global = __webpack_require__("7726");
  var hide = __webpack_require__("32e9");
  var Iterators = __webpack_require__("84f2");
  var wks = __webpack_require__("2b4c");
  var ITERATOR = wks('iterator');
  var TO_STRING_TAG = wks('toStringTag');
  var ArrayValues = Iterators.Array;
  
  var DOMIterables = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };
  
  for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
    var NAME = collections[i];
    var explicit = DOMIterables[NAME];
    var Collection = global[NAME];
    var proto = Collection && Collection.prototype;
    var key;
    if (proto) {
      if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
      if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
      Iterators[NAME] = ArrayValues;
      if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
    }
  }
  
  
  /***/ }),
  
  /***/ "be13":
  /***/ (function(module, exports) {
  
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };
  
  
  /***/ }),
  
  /***/ "c366":
  /***/ (function(module, exports, __webpack_require__) {
  
  // false -> Array#indexOf
  // true  -> Array#includes
  var toIObject = __webpack_require__("6821");
  var toLength = __webpack_require__("9def");
  var toAbsoluteIndex = __webpack_require__("77f1");
  module.exports = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };
  
  
  /***/ }),
  
  /***/ "c69a":
  /***/ (function(module, exports, __webpack_require__) {
  
  module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
    return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
  });
  
  
  /***/ }),
  
  /***/ "ca5a":
  /***/ (function(module, exports) {
  
  var id = 0;
  var px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  
  
  /***/ }),
  
  /***/ "cadf":
  /***/ (function(module, exports, __webpack_require__) {
  
  "use strict";
  
  var addToUnscopables = __webpack_require__("9c6c");
  var step = __webpack_require__("d53b");
  var Iterators = __webpack_require__("84f2");
  var toIObject = __webpack_require__("6821");
  
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
    this._t = toIObject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys') return step(0, index);
    if (kind == 'values') return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators.Arguments = Iterators.Array;
  
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');
  
  
  /***/ }),
  
  /***/ "cb7c":
  /***/ (function(module, exports, __webpack_require__) {
  
  var isObject = __webpack_require__("d3f4");
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };
  
  
  /***/ }),
  
  /***/ "ce10":
  /***/ (function(module, exports, __webpack_require__) {
  
  var has = __webpack_require__("69a8");
  var toIObject = __webpack_require__("6821");
  var arrayIndexOf = __webpack_require__("c366")(false);
  var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
  
  module.exports = function (object, names) {
    var O = toIObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };
  
  
  /***/ }),
  
  /***/ "d3f4":
  /***/ (function(module, exports) {
  
  module.exports = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  
  
  /***/ }),
  
  /***/ "d53b":
  /***/ (function(module, exports) {
  
  module.exports = function (done, value) {
    return { value: value, done: !!done };
  };
  
  
  /***/ }),
  
  /***/ "d8e8":
  /***/ (function(module, exports) {
  
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };
  
  
  /***/ }),
  
  /***/ "e11e":
  /***/ (function(module, exports) {
  
  // IE 8- don't enum bug keys
  module.exports = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');
  
  
  /***/ }),
  
  /***/ "f6fd":
  /***/ (function(module, exports) {
  
  // document.currentScript polyfill by Adam Miller
  
  // MIT license
  
  (function(document){
    var currentScript = "currentScript",
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
    // If browser needs currentScript polyfill, add get currentScript() to the document object
    if (!(currentScript in document)) {
      Object.defineProperty(document, currentScript, {
        get: function(){
  
          // IE 6-10 supports script readyState
          // IE 10+ support stack trace
          try { throw new Error(); }
          catch (err) {
  
            // Find the second match for the "at" string to get file src url from stack.
            // Specifically works with the format of stack traces in IE.
            var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];
  
            // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
            for(i in scripts){
              if(scripts[i].src == res || scripts[i].readyState == "interactive"){
                return scripts[i];
              }
            }
  
            // If no match, return null
            return null;
          }
        }
      });
    }
  })(document);
  
  
  /***/ }),
  
  /***/ "fa5b":
  /***/ (function(module, exports, __webpack_require__) {
  
  module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);
  
  
  /***/ }),
  
  /***/ "fab2":
  /***/ (function(module, exports, __webpack_require__) {
  
  var document = __webpack_require__("7726").document;
  module.exports = document && document.documentElement;
  
  
  /***/ })
  
  /******/ });
  //# sourceMappingURL=data-table.js.map