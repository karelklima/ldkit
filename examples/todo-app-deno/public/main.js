var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x2 + '" is not supported');
});

// deno:https://esm.sh/stable/react@18.2.0/deno/react.js
var U = Object.create;
var C = Object.defineProperty;
var q = Object.getOwnPropertyDescriptor;
var A = Object.getOwnPropertyNames;
var M = Object.getPrototypeOf;
var z = Object.prototype.hasOwnProperty;
var k = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var B = (e, t, r, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let u of A(t))
      !z.call(e, u) && u !== r && C(e, u, { get: () => t[u], enumerable: !(o = q(t, u)) || o.enumerable });
  return e;
};
var H = (e, t, r) => (r = e != null ? U(M(e)) : {}, B(t || !e || !e.__esModule ? C(r, "default", { value: e, enumerable: true }) : r, e));
var D = k((n) => {
  "use strict";
  var y = Symbol.for("react.element"), W = Symbol.for("react.portal"), Y = Symbol.for("react.fragment"), G = Symbol.for("react.strict_mode"), J2 = Symbol.for("react.profiler"), K = Symbol.for("react.provider"), Q2 = Symbol.for("react.context"), X2 = Symbol.for("react.forward_ref"), Z2 = Symbol.for("react.suspense"), ee2 = Symbol.for("react.memo"), te2 = Symbol.for("react.lazy"), w = Symbol.iterator;
  function re(e) {
    return e === null || typeof e != "object" ? null : (e = w && e[w] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var x2 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, O = Object.assign, j = {};
  function p(e, t, r) {
    this.props = e, this.context = t, this.refs = j, this.updater = r || x2;
  }
  p.prototype.isReactComponent = {};
  p.prototype.setState = function(e, t) {
    if (typeof e != "object" && typeof e != "function" && e != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, t, "setState");
  };
  p.prototype.forceUpdate = function(e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  };
  function I() {
  }
  I.prototype = p.prototype;
  function v(e, t, r) {
    this.props = e, this.context = t, this.refs = j, this.updater = r || x2;
  }
  var S2 = v.prototype = new I();
  S2.constructor = v;
  O(S2, p.prototype);
  S2.isPureReactComponent = true;
  var b = Array.isArray, g = Object.prototype.hasOwnProperty, E = { current: null }, P = { key: true, ref: true, __self: true, __source: true };
  function T(e, t, r) {
    var o, u = {}, c = null, f = null;
    if (t != null)
      for (o in t.ref !== void 0 && (f = t.ref), t.key !== void 0 && (c = "" + t.key), t)
        g.call(t, o) && !P.hasOwnProperty(o) && (u[o] = t[o]);
    var i = arguments.length - 2;
    if (i === 1)
      u.children = r;
    else if (1 < i) {
      for (var s = Array(i), a = 0; a < i; a++)
        s[a] = arguments[a + 2];
      u.children = s;
    }
    if (e && e.defaultProps)
      for (o in i = e.defaultProps, i)
        u[o] === void 0 && (u[o] = i[o]);
    return { $$typeof: y, type: e, key: c, ref: f, props: u, _owner: E.current };
  }
  function ne2(e, t) {
    return { $$typeof: y, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
  }
  function R2(e) {
    return typeof e == "object" && e !== null && e.$$typeof === y;
  }
  function ue(e) {
    var t = { "=": "=0", ":": "=2" };
    return "$" + e.replace(/[=:]/g, function(r) {
      return t[r];
    });
  }
  var $2 = /\/+/g;
  function h(e, t) {
    return typeof e == "object" && e !== null && e.key != null ? ue("" + e.key) : t.toString(36);
  }
  function _(e, t, r, o, u) {
    var c = typeof e;
    (c === "undefined" || c === "boolean") && (e = null);
    var f = false;
    if (e === null)
      f = true;
    else
      switch (c) {
        case "string":
        case "number":
          f = true;
          break;
        case "object":
          switch (e.$$typeof) {
            case y:
            case W:
              f = true;
          }
      }
    if (f)
      return f = e, u = u(f), e = o === "" ? "." + h(f, 0) : o, b(u) ? (r = "", e != null && (r = e.replace($2, "$&/") + "/"), _(u, t, r, "", function(a) {
        return a;
      })) : u != null && (R2(u) && (u = ne2(u, r + (!u.key || f && f.key === u.key ? "" : ("" + u.key).replace($2, "$&/") + "/") + e)), t.push(u)), 1;
    if (f = 0, o = o === "" ? "." : o + ":", b(e))
      for (var i = 0; i < e.length; i++) {
        c = e[i];
        var s = o + h(c, i);
        f += _(c, t, r, s, u);
      }
    else if (s = re(e), typeof s == "function")
      for (e = s.call(e), i = 0; !(c = e.next()).done; )
        c = c.value, s = o + h(c, i++), f += _(c, t, r, s, u);
    else if (c === "object")
      throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
    return f;
  }
  function d(e, t, r) {
    if (e == null)
      return e;
    var o = [], u = 0;
    return _(e, o, "", "", function(c) {
      return t.call(r, c, u++);
    }), o;
  }
  function oe2(e) {
    if (e._status === -1) {
      var t = e._result;
      t = t(), t.then(function(r) {
        (e._status === 0 || e._status === -1) && (e._status = 1, e._result = r);
      }, function(r) {
        (e._status === 0 || e._status === -1) && (e._status = 2, e._result = r);
      }), e._status === -1 && (e._status = 0, e._result = t);
    }
    if (e._status === 1)
      return e._result.default;
    throw e._result;
  }
  var l = { current: null }, m = { transition: null }, se2 = { ReactCurrentDispatcher: l, ReactCurrentBatchConfig: m, ReactCurrentOwner: E };
  n.Children = { map: d, forEach: function(e, t, r) {
    d(e, function() {
      t.apply(this, arguments);
    }, r);
  }, count: function(e) {
    var t = 0;
    return d(e, function() {
      t++;
    }), t;
  }, toArray: function(e) {
    return d(e, function(t) {
      return t;
    }) || [];
  }, only: function(e) {
    if (!R2(e))
      throw Error("React.Children.only expected to receive a single React element child.");
    return e;
  } };
  n.Component = p;
  n.Fragment = Y;
  n.Profiler = J2;
  n.PureComponent = v;
  n.StrictMode = G;
  n.Suspense = Z2;
  n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = se2;
  n.cloneElement = function(e, t, r) {
    if (e == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
    var o = O({}, e.props), u = e.key, c = e.ref, f = e._owner;
    if (t != null) {
      if (t.ref !== void 0 && (c = t.ref, f = E.current), t.key !== void 0 && (u = "" + t.key), e.type && e.type.defaultProps)
        var i = e.type.defaultProps;
      for (s in t)
        g.call(t, s) && !P.hasOwnProperty(s) && (o[s] = t[s] === void 0 && i !== void 0 ? i[s] : t[s]);
    }
    var s = arguments.length - 2;
    if (s === 1)
      o.children = r;
    else if (1 < s) {
      i = Array(s);
      for (var a = 0; a < s; a++)
        i[a] = arguments[a + 2];
      o.children = i;
    }
    return { $$typeof: y, type: e.type, key: u, ref: c, props: o, _owner: f };
  };
  n.createContext = function(e) {
    return e = { $$typeof: Q2, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: K, _context: e }, e.Consumer = e;
  };
  n.createElement = T;
  n.createFactory = function(e) {
    var t = T.bind(null, e);
    return t.type = e, t;
  };
  n.createRef = function() {
    return { current: null };
  };
  n.forwardRef = function(e) {
    return { $$typeof: X2, render: e };
  };
  n.isValidElement = R2;
  n.lazy = function(e) {
    return { $$typeof: te2, _payload: { _status: -1, _result: e }, _init: oe2 };
  };
  n.memo = function(e, t) {
    return { $$typeof: ee2, type: e, compare: t === void 0 ? null : t };
  };
  n.startTransition = function(e) {
    var t = m.transition;
    m.transition = {};
    try {
      e();
    } finally {
      m.transition = t;
    }
  };
  n.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  };
  n.useCallback = function(e, t) {
    return l.current.useCallback(e, t);
  };
  n.useContext = function(e) {
    return l.current.useContext(e);
  };
  n.useDebugValue = function() {
  };
  n.useDeferredValue = function(e) {
    return l.current.useDeferredValue(e);
  };
  n.useEffect = function(e, t) {
    return l.current.useEffect(e, t);
  };
  n.useId = function() {
    return l.current.useId();
  };
  n.useImperativeHandle = function(e, t, r) {
    return l.current.useImperativeHandle(e, t, r);
  };
  n.useInsertionEffect = function(e, t) {
    return l.current.useInsertionEffect(e, t);
  };
  n.useLayoutEffect = function(e, t) {
    return l.current.useLayoutEffect(e, t);
  };
  n.useMemo = function(e, t) {
    return l.current.useMemo(e, t);
  };
  n.useReducer = function(e, t, r) {
    return l.current.useReducer(e, t, r);
  };
  n.useRef = function(e) {
    return l.current.useRef(e);
  };
  n.useState = function(e) {
    return l.current.useState(e);
  };
  n.useSyncExternalStore = function(e, t, r) {
    return l.current.useSyncExternalStore(e, t, r);
  };
  n.useTransition = function() {
    return l.current.useTransition();
  };
  n.version = "18.2.0";
});
var L = k((le2, V2) => {
  "use strict";
  V2.exports = D();
});
var F = H(L());
var { Children: ae, Component: pe, Fragment: ye, Profiler: de, PureComponent: _e, StrictMode: me, Suspense: he, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ve, cloneElement: Se, createContext: Ee, createElement: Re, createFactory: Ce, createRef: ke, forwardRef: we, isValidElement: be, lazy: $e, memo: xe, startTransition: Oe, unstable_act: je, useCallback: Ie, useContext: ge, useDebugValue: Pe, useDeferredValue: Te, useEffect: De, useId: Ve, useImperativeHandle: Le, useInsertionEffect: Ne, useLayoutEffect: Fe, useMemo: Ue, useReducer: qe, useRef: Ae, useState: Me, useSyncExternalStore: ze, useTransition: Be, version: He } = F;
var { default: N, ...ce } = F;
var We = N !== void 0 ? N : ce;

// deno:https://esm.sh/v92/scheduler@0.23.0/deno/scheduler.js
var __setImmediate$ = (cb, ...args) => setTimeout(cb, 0, ...args);
var U2 = Object.create;
var R = Object.defineProperty;
var X = Object.getOwnPropertyDescriptor;
var Z = Object.getOwnPropertyNames;
var $ = Object.getPrototypeOf;
var ee = Object.prototype.hasOwnProperty;
var B2 = (e, n) => () => (n || e((n = { exports: {} }).exports, n), n.exports);
var ne = (e, n, t, l) => {
  if (n && typeof n == "object" || typeof n == "function")
    for (let i of Z(n))
      !ee.call(e, i) && i !== t && R(e, i, { get: () => n[i], enumerable: !(l = X(n, i)) || l.enumerable });
  return e;
};
var te = (e, n, t) => (t = e != null ? U2($(e)) : {}, ne(n || !e || !e.__esModule ? R(t, "default", { value: e, enumerable: true }) : t, e));
var J = B2((r) => {
  "use strict";
  function T(e, n) {
    var t = e.length;
    e.push(n);
    e:
      for (; 0 < t; ) {
        var l = t - 1 >>> 1, i = e[l];
        if (0 < g(i, n))
          e[l] = n, e[t] = i, t = l;
        else
          break e;
      }
  }
  function o(e) {
    return e.length === 0 ? null : e[0];
  }
  function k2(e) {
    if (e.length === 0)
      return null;
    var n = e[0], t = e.pop();
    if (t !== n) {
      e[0] = t;
      e:
        for (var l = 0, i = e.length, y = i >>> 1; l < y; ) {
          var f = 2 * (l + 1) - 1, x2 = e[f], b = f + 1, m = e[b];
          if (0 > g(x2, t))
            b < i && 0 > g(m, x2) ? (e[l] = m, e[b] = t, l = b) : (e[l] = x2, e[f] = t, l = f);
          else if (b < i && 0 > g(m, t))
            e[l] = m, e[b] = t, l = b;
          else
            break e;
        }
    }
    return n;
  }
  function g(e, n) {
    var t = e.sortIndex - n.sortIndex;
    return t !== 0 ? t : e.id - n.id;
  }
  typeof performance == "object" && typeof performance.now == "function" ? (D2 = performance, r.unstable_now = function() {
    return D2.now();
  }) : (I = Date, q2 = I.now(), r.unstable_now = function() {
    return I.now() - q2;
  });
  var D2, I, q2, s = [], c = [], re = 1, a = null, u = 3, P = false, _ = false, p = false, Y = typeof setTimeout == "function" ? setTimeout : null, z2 = typeof clearTimeout == "function" ? clearTimeout : null, O = typeof __setImmediate$ < "u" ? __setImmediate$ : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function L2(e) {
    for (var n = o(c); n !== null; ) {
      if (n.callback === null)
        k2(c);
      else if (n.startTime <= e)
        k2(c), n.sortIndex = n.expirationTime, T(s, n);
      else
        break;
      n = o(c);
    }
  }
  function N2(e) {
    if (p = false, L2(e), !_)
      if (o(s) !== null)
        _ = true, M2(F2);
      else {
        var n = o(c);
        n !== null && j(N2, n.startTime - e);
      }
  }
  function F2(e, n) {
    _ = false, p && (p = false, z2(v), v = -1), P = true;
    var t = u;
    try {
      for (L2(n), a = o(s); a !== null && (!(a.expirationTime > n) || e && !H2()); ) {
        var l = a.callback;
        if (typeof l == "function") {
          a.callback = null, u = a.priorityLevel;
          var i = l(a.expirationTime <= n);
          n = r.unstable_now(), typeof i == "function" ? a.callback = i : a === o(s) && k2(s), L2(n);
        } else
          k2(s);
        a = o(s);
      }
      if (a !== null)
        var y = true;
      else {
        var f = o(c);
        f !== null && j(N2, f.startTime - n), y = false;
      }
      return y;
    } finally {
      a = null, u = t, P = false;
    }
  }
  var w = false, h = null, v = -1, A2 = 5, G = -1;
  function H2() {
    return !(r.unstable_now() - G < A2);
  }
  function C2() {
    if (h !== null) {
      var e = r.unstable_now();
      G = e;
      var n = true;
      try {
        n = h(true, e);
      } finally {
        n ? d() : (w = false, h = null);
      }
    } else
      w = false;
  }
  var d;
  typeof O == "function" ? d = function() {
    O(C2);
  } : typeof MessageChannel < "u" ? (E = new MessageChannel(), W = E.port2, E.port1.onmessage = C2, d = function() {
    W.postMessage(null);
  }) : d = function() {
    Y(C2, 0);
  };
  var E, W;
  function M2(e) {
    h = e, w || (w = true, d());
  }
  function j(e, n) {
    v = Y(function() {
      e(r.unstable_now());
    }, n);
  }
  r.unstable_IdlePriority = 5;
  r.unstable_ImmediatePriority = 1;
  r.unstable_LowPriority = 4;
  r.unstable_NormalPriority = 3;
  r.unstable_Profiling = null;
  r.unstable_UserBlockingPriority = 2;
  r.unstable_cancelCallback = function(e) {
    e.callback = null;
  };
  r.unstable_continueExecution = function() {
    _ || P || (_ = true, M2(F2));
  };
  r.unstable_forceFrameRate = function(e) {
    0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : A2 = 0 < e ? Math.floor(1e3 / e) : 5;
  };
  r.unstable_getCurrentPriorityLevel = function() {
    return u;
  };
  r.unstable_getFirstCallbackNode = function() {
    return o(s);
  };
  r.unstable_next = function(e) {
    switch (u) {
      case 1:
      case 2:
      case 3:
        var n = 3;
        break;
      default:
        n = u;
    }
    var t = u;
    u = n;
    try {
      return e();
    } finally {
      u = t;
    }
  };
  r.unstable_pauseExecution = function() {
  };
  r.unstable_requestPaint = function() {
  };
  r.unstable_runWithPriority = function(e, n) {
    switch (e) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        e = 3;
    }
    var t = u;
    u = e;
    try {
      return n();
    } finally {
      u = t;
    }
  };
  r.unstable_scheduleCallback = function(e, n, t) {
    var l = r.unstable_now();
    switch (typeof t == "object" && t !== null ? (t = t.delay, t = typeof t == "number" && 0 < t ? l + t : l) : t = l, e) {
      case 1:
        var i = -1;
        break;
      case 2:
        i = 250;
        break;
      case 5:
        i = 1073741823;
        break;
      case 4:
        i = 1e4;
        break;
      default:
        i = 5e3;
    }
    return i = t + i, e = { id: re++, callback: n, priorityLevel: e, startTime: t, expirationTime: i, sortIndex: -1 }, t > l ? (e.sortIndex = t, T(c, e), o(s) === null && e === o(c) && (p ? (z2(v), v = -1) : p = true, j(N2, t - l))) : (e.sortIndex = i, T(s, e), _ || P || (_ = true, M2(F2))), e;
  };
  r.unstable_shouldYield = H2;
  r.unstable_wrapCallback = function(e) {
    var n = u;
    return function() {
      var t = u;
      u = n;
      try {
        return e.apply(this, arguments);
      } finally {
        u = t;
      }
    };
  };
});
var Q = B2((ae2, K) => {
  "use strict";
  K.exports = J();
});
var V = te(Q());
var { unstable_now: oe, unstable_IdlePriority: se, unstable_ImmediatePriority: ce2, unstable_LowPriority: fe, unstable_NormalPriority: be2, unstable_Profiling: _e2, unstable_UserBlockingPriority: de2, unstable_cancelCallback: pe2, unstable_continueExecution: ve2, unstable_forceFrameRate: ye2, unstable_getCurrentPriorityLevel: me2, unstable_getFirstCallbackNode: ge2, unstable_next: he2, unstable_pauseExecution: ke2, unstable_requestPaint: Pe2, unstable_runWithPriority: we2, unstable_scheduleCallback: xe2, unstable_shouldYield: Ie2, unstable_wrapCallback: Ce2 } = V;
var { default: S, ...le } = V;
var Ee2 = S !== void 0 ? S : le;

// deno:https://esm.sh/v92/react-dom@18.2.0/deno/react-dom.js
var wa = Object.create;
var ru = Object.defineProperty;
var Sa = Object.getOwnPropertyDescriptor;
var ka = Object.getOwnPropertyNames;
var Ea = Object.getPrototypeOf;
var Ca = Object.prototype.hasOwnProperty;
var lu = ((e) => typeof __require != "undefined" ? __require : typeof Proxy != "undefined" ? new Proxy(e, { get: (n, t) => (typeof __require != "undefined" ? __require : n)[t] }) : e)(function(e) {
  if (typeof __require != "undefined")
    return __require.apply(this, arguments);
  throw new Error('Dynamic require of "' + e + '" is not supported');
});
var iu = (e, n) => () => (n || e((n = { exports: {} }).exports, n), n.exports);
var xa = (e, n, t, r) => {
  if (n && typeof n == "object" || typeof n == "function")
    for (let l of ka(n))
      !Ca.call(e, l) && l !== t && ru(e, l, { get: () => n[l], enumerable: !(r = Sa(n, l)) || r.enumerable });
  return e;
};
var Na = (e, n, t) => (t = e != null ? wa(Ea(e)) : {}, xa(n || !e || !e.__esModule ? ru(t, "default", { value: e, enumerable: true }) : t, e));
var da = iu((fe2) => {
  "use strict";
  var po = We, ae2 = Ee2;
  function v(e) {
    for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, t = 1; t < arguments.length; t++)
      n += "&args[]=" + encodeURIComponent(arguments[t]);
    return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var mo = /* @__PURE__ */ new Set(), gt = {};
  function Sn(e, n) {
    Hn(e, n), Hn(e + "Capture", n);
  }
  function Hn(e, n) {
    for (gt[e] = n, e = 0; e < n.length; e++)
      mo.add(n[e]);
  }
  var Fe2 = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), kl = Object.prototype.hasOwnProperty, _a = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, uu = {}, ou = {};
  function za(e) {
    return kl.call(ou, e) ? true : kl.call(uu, e) ? false : _a.test(e) ? ou[e] = true : (uu[e] = true, false);
  }
  function Pa(e, n, t, r) {
    if (t !== null && t.type === 0)
      return false;
    switch (typeof n) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        return r ? false : t !== null ? !t.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return false;
    }
  }
  function La(e, n, t, r) {
    if (n === null || typeof n > "u" || Pa(e, n, t, r))
      return true;
    if (r)
      return false;
    if (t !== null)
      switch (t.type) {
        case 3:
          return !n;
        case 4:
          return n === false;
        case 5:
          return isNaN(n);
        case 6:
          return isNaN(n) || 1 > n;
      }
    return false;
  }
  function ee2(e, n, t, r, l, i, u) {
    this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = t, this.propertyName = e, this.type = n, this.sanitizeURL = i, this.removeEmptyString = u;
  }
  var Y = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    Y[e] = new ee2(e, 0, false, e, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var n = e[0];
    Y[n] = new ee2(n, 1, false, e[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    Y[e] = new ee2(e, 2, false, e.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    Y[e] = new ee2(e, 2, false, e, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    Y[e] = new ee2(e, 3, false, e.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    Y[e] = new ee2(e, 3, true, e, null, false, false);
  });
  ["capture", "download"].forEach(function(e) {
    Y[e] = new ee2(e, 4, false, e, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(e) {
    Y[e] = new ee2(e, 6, false, e, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(e) {
    Y[e] = new ee2(e, 5, false, e.toLowerCase(), null, false, false);
  });
  var pi = /[\-:]([a-z])/g;
  function mi(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var n = e.replace(pi, mi);
    Y[n] = new ee2(n, 1, false, e, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var n = e.replace(pi, mi);
    Y[n] = new ee2(n, 1, false, e, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var n = e.replace(pi, mi);
    Y[n] = new ee2(n, 1, false, e, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(e) {
    Y[e] = new ee2(e, 1, false, e.toLowerCase(), null, false, false);
  });
  Y.xlinkHref = new ee2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(e) {
    Y[e] = new ee2(e, 1, false, e.toLowerCase(), null, true, true);
  });
  function hi(e, n, t, r) {
    var l = Y.hasOwnProperty(n) ? Y[n] : null;
    (l !== null ? l.type !== 0 : r || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (La(n, t, l, r) && (t = null), r || l === null ? za(n) && (t === null ? e.removeAttribute(n) : e.setAttribute(n, "" + t)) : l.mustUseProperty ? e[l.propertyName] = t === null ? l.type === 3 ? false : "" : t : (n = l.attributeName, r = l.attributeNamespace, t === null ? e.removeAttribute(n) : (l = l.type, t = l === 3 || l === 4 && t === true ? "" : "" + t, r ? e.setAttributeNS(r, n, t) : e.setAttribute(n, t))));
  }
  var Ve2 = po.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Vt = Symbol.for("react.element"), xn = Symbol.for("react.portal"), Nn = Symbol.for("react.fragment"), vi = Symbol.for("react.strict_mode"), El = Symbol.for("react.profiler"), ho = Symbol.for("react.provider"), vo = Symbol.for("react.context"), yi = Symbol.for("react.forward_ref"), Cl = Symbol.for("react.suspense"), xl = Symbol.for("react.suspense_list"), gi = Symbol.for("react.memo"), He2 = Symbol.for("react.lazy");
  Symbol.for("react.scope");
  Symbol.for("react.debug_trace_mode");
  var yo = Symbol.for("react.offscreen");
  Symbol.for("react.legacy_hidden");
  Symbol.for("react.cache");
  Symbol.for("react.tracing_marker");
  var su = Symbol.iterator;
  function Jn(e) {
    return e === null || typeof e != "object" ? null : (e = su && e[su] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var F2 = Object.assign, br;
  function it(e) {
    if (br === void 0)
      try {
        throw Error();
      } catch (t) {
        var n = t.stack.trim().match(/\n( *(at )?)/);
        br = n && n[1] || "";
      }
    return `
` + br + e;
  }
  var el = false;
  function nl(e, n) {
    if (!e || el)
      return "";
    el = true;
    var t = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (n)
        if (n = function() {
          throw Error();
        }, Object.defineProperty(n.prototype, "props", { set: function() {
          throw Error();
        } }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(n, []);
          } catch (d) {
            var r = d;
          }
          Reflect.construct(e, [], n);
        } else {
          try {
            n.call();
          } catch (d) {
            r = d;
          }
          e.call(n.prototype);
        }
      else {
        try {
          throw Error();
        } catch (d) {
          r = d;
        }
        e();
      }
    } catch (d) {
      if (d && r && typeof d.stack == "string") {
        for (var l = d.stack.split(`
`), i = r.stack.split(`
`), u = l.length - 1, o = i.length - 1; 1 <= u && 0 <= o && l[u] !== i[o]; )
          o--;
        for (; 1 <= u && 0 <= o; u--, o--)
          if (l[u] !== i[o]) {
            if (u !== 1 || o !== 1)
              do
                if (u--, o--, 0 > o || l[u] !== i[o]) {
                  var s = `
` + l[u].replace(" at new ", " at ");
                  return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
                }
              while (1 <= u && 0 <= o);
            break;
          }
      }
    } finally {
      el = false, Error.prepareStackTrace = t;
    }
    return (e = e ? e.displayName || e.name : "") ? it(e) : "";
  }
  function Ta(e) {
    switch (e.tag) {
      case 5:
        return it(e.type);
      case 16:
        return it("Lazy");
      case 13:
        return it("Suspense");
      case 19:
        return it("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = nl(e.type, false), e;
      case 11:
        return e = nl(e.type.render, false), e;
      case 1:
        return e = nl(e.type, true), e;
      default:
        return "";
    }
  }
  function Nl(e) {
    if (e == null)
      return null;
    if (typeof e == "function")
      return e.displayName || e.name || null;
    if (typeof e == "string")
      return e;
    switch (e) {
      case Nn:
        return "Fragment";
      case xn:
        return "Portal";
      case El:
        return "Profiler";
      case vi:
        return "StrictMode";
      case Cl:
        return "Suspense";
      case xl:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case vo:
          return (e.displayName || "Context") + ".Consumer";
        case ho:
          return (e._context.displayName || "Context") + ".Provider";
        case yi:
          var n = e.render;
          return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case gi:
          return n = e.displayName || null, n !== null ? n : Nl(e.type) || "Memo";
        case He2:
          n = e._payload, e = e._init;
          try {
            return Nl(e(n));
          } catch {
          }
      }
    return null;
  }
  function Ma(e) {
    var n = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (n.displayName || "Context") + ".Consumer";
      case 10:
        return (n._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = n.render, e = e.displayName || e.name || "", n.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return n;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Nl(n);
      case 8:
        return n === vi ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof n == "function")
          return n.displayName || n.name || null;
        if (typeof n == "string")
          return n;
    }
    return null;
  }
  function tn(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function go(e) {
    var n = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function Da(e) {
    var n = go(e) ? "checked" : "value", t = Object.getOwnPropertyDescriptor(e.constructor.prototype, n), r = "" + e[n];
    if (!e.hasOwnProperty(n) && typeof t < "u" && typeof t.get == "function" && typeof t.set == "function") {
      var l = t.get, i = t.set;
      return Object.defineProperty(e, n, { configurable: true, get: function() {
        return l.call(this);
      }, set: function(u) {
        r = "" + u, i.call(this, u);
      } }), Object.defineProperty(e, n, { enumerable: t.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(u) {
        r = "" + u;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[n];
      } };
    }
  }
  function At(e) {
    e._valueTracker || (e._valueTracker = Da(e));
  }
  function wo(e) {
    if (!e)
      return false;
    var n = e._valueTracker;
    if (!n)
      return true;
    var t = n.getValue(), r = "";
    return e && (r = go(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== t ? (n.setValue(e), true) : false;
  }
  function mr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function _l(e, n) {
    var t = n.checked;
    return F2({}, n, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: t ?? e._wrapperState.initialChecked });
  }
  function au(e, n) {
    var t = n.defaultValue == null ? "" : n.defaultValue, r = n.checked != null ? n.checked : n.defaultChecked;
    t = tn(n.value != null ? n.value : t), e._wrapperState = { initialChecked: r, initialValue: t, controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null };
  }
  function So(e, n) {
    n = n.checked, n != null && hi(e, "checked", n, false);
  }
  function zl(e, n) {
    So(e, n);
    var t = tn(n.value), r = n.type;
    if (t != null)
      r === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + t) : e.value !== "" + t && (e.value = "" + t);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    n.hasOwnProperty("value") ? Pl(e, n.type, t) : n.hasOwnProperty("defaultValue") && Pl(e, n.type, tn(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
  }
  function cu(e, n, t) {
    if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
      var r = n.type;
      if (!(r !== "submit" && r !== "reset" || n.value !== void 0 && n.value !== null))
        return;
      n = "" + e._wrapperState.initialValue, t || n === e.value || (e.value = n), e.defaultValue = n;
    }
    t = e.name, t !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, t !== "" && (e.name = t);
  }
  function Pl(e, n, t) {
    (n !== "number" || mr(e.ownerDocument) !== e) && (t == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + t && (e.defaultValue = "" + t));
  }
  var ut = Array.isArray;
  function In(e, n, t, r) {
    if (e = e.options, n) {
      n = {};
      for (var l = 0; l < t.length; l++)
        n["$" + t[l]] = true;
      for (t = 0; t < e.length; t++)
        l = n.hasOwnProperty("$" + e[t].value), e[t].selected !== l && (e[t].selected = l), l && r && (e[t].defaultSelected = true);
    } else {
      for (t = "" + tn(t), n = null, l = 0; l < e.length; l++) {
        if (e[l].value === t) {
          e[l].selected = true, r && (e[l].defaultSelected = true);
          return;
        }
        n !== null || e[l].disabled || (n = e[l]);
      }
      n !== null && (n.selected = true);
    }
  }
  function Ll(e, n) {
    if (n.dangerouslySetInnerHTML != null)
      throw Error(v(91));
    return F2({}, n, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function fu(e, n) {
    var t = n.value;
    if (t == null) {
      if (t = n.children, n = n.defaultValue, t != null) {
        if (n != null)
          throw Error(v(92));
        if (ut(t)) {
          if (1 < t.length)
            throw Error(v(93));
          t = t[0];
        }
        n = t;
      }
      n == null && (n = ""), t = n;
    }
    e._wrapperState = { initialValue: tn(t) };
  }
  function ko(e, n) {
    var t = tn(n.value), r = tn(n.defaultValue);
    t != null && (t = "" + t, t !== e.value && (e.value = t), n.defaultValue == null && e.defaultValue !== t && (e.defaultValue = t)), r != null && (e.defaultValue = "" + r);
  }
  function du(e) {
    var n = e.textContent;
    n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
  }
  function Eo(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Tl(e, n) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Eo(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Bt, Co = function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(n, t, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(n, t, r, l);
      });
    } : e;
  }(function(e, n) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = n;
    else {
      for (Bt = Bt || document.createElement("div"), Bt.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>", n = Bt.firstChild; e.firstChild; )
        e.removeChild(e.firstChild);
      for (; n.firstChild; )
        e.appendChild(n.firstChild);
    }
  });
  function wt(e, n) {
    if (n) {
      var t = e.firstChild;
      if (t && t === e.lastChild && t.nodeType === 3) {
        t.nodeValue = n;
        return;
      }
    }
    e.textContent = n;
  }
  var at = { animationIterationCount: true, aspectRatio: true, borderImageOutset: true, borderImageSlice: true, borderImageWidth: true, boxFlex: true, boxFlexGroup: true, boxOrdinalGroup: true, columnCount: true, columns: true, flex: true, flexGrow: true, flexPositive: true, flexShrink: true, flexNegative: true, flexOrder: true, gridArea: true, gridRow: true, gridRowEnd: true, gridRowSpan: true, gridRowStart: true, gridColumn: true, gridColumnEnd: true, gridColumnSpan: true, gridColumnStart: true, fontWeight: true, lineClamp: true, lineHeight: true, opacity: true, order: true, orphans: true, tabSize: true, widows: true, zIndex: true, zoom: true, fillOpacity: true, floodOpacity: true, stopOpacity: true, strokeDasharray: true, strokeDashoffset: true, strokeMiterlimit: true, strokeOpacity: true, strokeWidth: true }, Oa = ["Webkit", "ms", "Moz", "O"];
  Object.keys(at).forEach(function(e) {
    Oa.forEach(function(n) {
      n = n + e.charAt(0).toUpperCase() + e.substring(1), at[n] = at[e];
    });
  });
  function xo(e, n, t) {
    return n == null || typeof n == "boolean" || n === "" ? "" : t || typeof n != "number" || n === 0 || at.hasOwnProperty(e) && at[e] ? ("" + n).trim() : n + "px";
  }
  function No(e, n) {
    e = e.style;
    for (var t in n)
      if (n.hasOwnProperty(t)) {
        var r = t.indexOf("--") === 0, l = xo(t, n[t], r);
        t === "float" && (t = "cssFloat"), r ? e.setProperty(t, l) : e[t] = l;
      }
  }
  var Ra = F2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function Ml(e, n) {
    if (n) {
      if (Ra[e] && (n.children != null || n.dangerouslySetInnerHTML != null))
        throw Error(v(137, e));
      if (n.dangerouslySetInnerHTML != null) {
        if (n.children != null)
          throw Error(v(60));
        if (typeof n.dangerouslySetInnerHTML != "object" || !("__html" in n.dangerouslySetInnerHTML))
          throw Error(v(61));
      }
      if (n.style != null && typeof n.style != "object")
        throw Error(v(62));
    }
  }
  function Dl(e, n) {
    if (e.indexOf("-") === -1)
      return typeof n.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var Ol = null;
  function wi(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Rl = null, Un = null, jn = null;
  function pu(e) {
    if (e = Ut(e)) {
      if (typeof Rl != "function")
        throw Error(v(280));
      var n = e.stateNode;
      n && (n = Hr(n), Rl(e.stateNode, e.type, n));
    }
  }
  function _o(e) {
    Un ? jn ? jn.push(e) : jn = [e] : Un = e;
  }
  function zo() {
    if (Un) {
      var e = Un, n = jn;
      if (jn = Un = null, pu(e), n)
        for (e = 0; e < n.length; e++)
          pu(n[e]);
    }
  }
  function Po(e, n) {
    return e(n);
  }
  function Lo() {
  }
  var tl = false;
  function To(e, n, t) {
    if (tl)
      return e(n, t);
    tl = true;
    try {
      return Po(e, n, t);
    } finally {
      tl = false, (Un !== null || jn !== null) && (Lo(), zo());
    }
  }
  function St(e, n) {
    var t = e.stateNode;
    if (t === null)
      return null;
    var r = Hr(t);
    if (r === null)
      return null;
    t = r[n];
    e:
      switch (n) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
          break e;
        default:
          e = false;
      }
    if (e)
      return null;
    if (t && typeof t != "function")
      throw Error(v(231, n, typeof t));
    return t;
  }
  var Fl = false;
  if (Fe2)
    try {
      En = {}, Object.defineProperty(En, "passive", { get: function() {
        Fl = true;
      } }), window.addEventListener("test", En, En), window.removeEventListener("test", En, En);
    } catch {
      Fl = false;
    }
  var En;
  function Fa(e, n, t, r, l, i, u, o, s) {
    var d = Array.prototype.slice.call(arguments, 3);
    try {
      n.apply(t, d);
    } catch (m) {
      this.onError(m);
    }
  }
  var ct = false, hr = null, vr = false, Il = null, Ia = { onError: function(e) {
    ct = true, hr = e;
  } };
  function Ua(e, n, t, r, l, i, u, o, s) {
    ct = false, hr = null, Fa.apply(Ia, arguments);
  }
  function ja(e, n, t, r, l, i, u, o, s) {
    if (Ua.apply(this, arguments), ct) {
      if (ct) {
        var d = hr;
        ct = false, hr = null;
      } else
        throw Error(v(198));
      vr || (vr = true, Il = d);
    }
  }
  function kn(e) {
    var n = e, t = e;
    if (e.alternate)
      for (; n.return; )
        n = n.return;
    else {
      e = n;
      do
        n = e, (n.flags & 4098) !== 0 && (t = n.return), e = n.return;
      while (e);
    }
    return n.tag === 3 ? t : null;
  }
  function Mo(e) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null)
        return n.dehydrated;
    }
    return null;
  }
  function mu(e) {
    if (kn(e) !== e)
      throw Error(v(188));
  }
  function Va(e) {
    var n = e.alternate;
    if (!n) {
      if (n = kn(e), n === null)
        throw Error(v(188));
      return n !== e ? null : e;
    }
    for (var t = e, r = n; ; ) {
      var l = t.return;
      if (l === null)
        break;
      var i = l.alternate;
      if (i === null) {
        if (r = l.return, r !== null) {
          t = r;
          continue;
        }
        break;
      }
      if (l.child === i.child) {
        for (i = l.child; i; ) {
          if (i === t)
            return mu(l), e;
          if (i === r)
            return mu(l), n;
          i = i.sibling;
        }
        throw Error(v(188));
      }
      if (t.return !== r.return)
        t = l, r = i;
      else {
        for (var u = false, o = l.child; o; ) {
          if (o === t) {
            u = true, t = l, r = i;
            break;
          }
          if (o === r) {
            u = true, r = l, t = i;
            break;
          }
          o = o.sibling;
        }
        if (!u) {
          for (o = i.child; o; ) {
            if (o === t) {
              u = true, t = i, r = l;
              break;
            }
            if (o === r) {
              u = true, r = i, t = l;
              break;
            }
            o = o.sibling;
          }
          if (!u)
            throw Error(v(189));
        }
      }
      if (t.alternate !== r)
        throw Error(v(190));
    }
    if (t.tag !== 3)
      throw Error(v(188));
    return t.stateNode.current === t ? e : n;
  }
  function Do(e) {
    return e = Va(e), e !== null ? Oo(e) : null;
  }
  function Oo(e) {
    if (e.tag === 5 || e.tag === 6)
      return e;
    for (e = e.child; e !== null; ) {
      var n = Oo(e);
      if (n !== null)
        return n;
      e = e.sibling;
    }
    return null;
  }
  var Ro = ae2.unstable_scheduleCallback, hu = ae2.unstable_cancelCallback, Aa = ae2.unstable_shouldYield, Ba = ae2.unstable_requestPaint, j = ae2.unstable_now, Ha = ae2.unstable_getCurrentPriorityLevel, Si = ae2.unstable_ImmediatePriority, Fo = ae2.unstable_UserBlockingPriority, yr = ae2.unstable_NormalPriority, Wa = ae2.unstable_LowPriority, Io = ae2.unstable_IdlePriority, jr = null, Pe3 = null;
  function Qa(e) {
    if (Pe3 && typeof Pe3.onCommitFiberRoot == "function")
      try {
        Pe3.onCommitFiberRoot(jr, e, void 0, (e.current.flags & 128) === 128);
      } catch {
      }
  }
  var Ee3 = Math.clz32 ? Math.clz32 : Ya, $a = Math.log, Ka = Math.LN2;
  function Ya(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - ($a(e) / Ka | 0) | 0;
  }
  var Ht = 64, Wt = 4194304;
  function ot(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function gr(e, n) {
    var t = e.pendingLanes;
    if (t === 0)
      return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, u = t & 268435455;
    if (u !== 0) {
      var o = u & ~l;
      o !== 0 ? r = ot(o) : (i &= u, i !== 0 && (r = ot(i)));
    } else
      u = t & ~l, u !== 0 ? r = ot(u) : i !== 0 && (r = ot(i));
    if (r === 0)
      return 0;
    if (n !== 0 && n !== r && (n & l) === 0 && (l = r & -r, i = n & -n, l >= i || l === 16 && (i & 4194240) !== 0))
      return n;
    if ((r & 4) !== 0 && (r |= t & 16), n = e.entangledLanes, n !== 0)
      for (e = e.entanglements, n &= r; 0 < n; )
        t = 31 - Ee3(n), l = 1 << t, r |= e[t], n &= ~l;
    return r;
  }
  function Xa(e, n) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return n + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ga(e, n) {
    for (var t = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var u = 31 - Ee3(i), o = 1 << u, s = l[u];
      s === -1 ? ((o & t) === 0 || (o & r) !== 0) && (l[u] = Xa(o, n)) : s <= n && (e.expiredLanes |= o), i &= ~o;
    }
  }
  function Ul(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Uo() {
    var e = Ht;
    return Ht <<= 1, (Ht & 4194240) === 0 && (Ht = 64), e;
  }
  function rl(e) {
    for (var n = [], t = 0; 31 > t; t++)
      n.push(e);
    return n;
  }
  function Ft(e, n, t) {
    e.pendingLanes |= n, n !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, n = 31 - Ee3(n), e[n] = t;
  }
  function Za(e, n) {
    var t = e.pendingLanes & ~n;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= n, e.mutableReadLanes &= n, e.entangledLanes &= n, n = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < t; ) {
      var l = 31 - Ee3(t), i = 1 << l;
      n[l] = 0, r[l] = -1, e[l] = -1, t &= ~i;
    }
  }
  function ki(e, n) {
    var t = e.entangledLanes |= n;
    for (e = e.entanglements; t; ) {
      var r = 31 - Ee3(t), l = 1 << r;
      l & n | e[r] & n && (e[r] |= n), t &= ~l;
    }
  }
  var P = 0;
  function jo(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Vo, Ei, Ao, Bo, Ho, jl = false, Qt = [], Xe = null, Ge = null, Ze = null, kt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), Qe = [], Ja = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function vu(e, n) {
    switch (e) {
      case "focusin":
      case "focusout":
        Xe = null;
        break;
      case "dragenter":
      case "dragleave":
        Ge = null;
        break;
      case "mouseover":
      case "mouseout":
        Ze = null;
        break;
      case "pointerover":
      case "pointerout":
        kt.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Et.delete(n.pointerId);
    }
  }
  function qn(e, n, t, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: n, domEventName: t, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, n !== null && (n = Ut(n), n !== null && Ei(n)), e) : (e.eventSystemFlags |= r, n = e.targetContainers, l !== null && n.indexOf(l) === -1 && n.push(l), e);
  }
  function qa(e, n, t, r, l) {
    switch (n) {
      case "focusin":
        return Xe = qn(Xe, e, n, t, r, l), true;
      case "dragenter":
        return Ge = qn(Ge, e, n, t, r, l), true;
      case "mouseover":
        return Ze = qn(Ze, e, n, t, r, l), true;
      case "pointerover":
        var i = l.pointerId;
        return kt.set(i, qn(kt.get(i) || null, e, n, t, r, l)), true;
      case "gotpointercapture":
        return i = l.pointerId, Et.set(i, qn(Et.get(i) || null, e, n, t, r, l)), true;
    }
    return false;
  }
  function Wo(e) {
    var n = cn(e.target);
    if (n !== null) {
      var t = kn(n);
      if (t !== null) {
        if (n = t.tag, n === 13) {
          if (n = Mo(t), n !== null) {
            e.blockedOn = n, Ho(e.priority, function() {
              Ao(t);
            });
            return;
          }
        } else if (n === 3 && t.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function lr(e) {
    if (e.blockedOn !== null)
      return false;
    for (var n = e.targetContainers; 0 < n.length; ) {
      var t = Vl(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
      if (t === null) {
        t = e.nativeEvent;
        var r = new t.constructor(t.type, t);
        Ol = r, t.target.dispatchEvent(r), Ol = null;
      } else
        return n = Ut(t), n !== null && Ei(n), e.blockedOn = t, false;
      n.shift();
    }
    return true;
  }
  function yu(e, n, t) {
    lr(e) && t.delete(n);
  }
  function ba() {
    jl = false, Xe !== null && lr(Xe) && (Xe = null), Ge !== null && lr(Ge) && (Ge = null), Ze !== null && lr(Ze) && (Ze = null), kt.forEach(yu), Et.forEach(yu);
  }
  function bn(e, n) {
    e.blockedOn === n && (e.blockedOn = null, jl || (jl = true, ae2.unstable_scheduleCallback(ae2.unstable_NormalPriority, ba)));
  }
  function Ct(e) {
    function n(l) {
      return bn(l, e);
    }
    if (0 < Qt.length) {
      bn(Qt[0], e);
      for (var t = 1; t < Qt.length; t++) {
        var r = Qt[t];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Xe !== null && bn(Xe, e), Ge !== null && bn(Ge, e), Ze !== null && bn(Ze, e), kt.forEach(n), Et.forEach(n), t = 0; t < Qe.length; t++)
      r = Qe[t], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Qe.length && (t = Qe[0], t.blockedOn === null); )
      Wo(t), t.blockedOn === null && Qe.shift();
  }
  var Vn = Ve2.ReactCurrentBatchConfig, wr = true;
  function ec(e, n, t, r) {
    var l = P, i = Vn.transition;
    Vn.transition = null;
    try {
      P = 1, Ci(e, n, t, r);
    } finally {
      P = l, Vn.transition = i;
    }
  }
  function nc(e, n, t, r) {
    var l = P, i = Vn.transition;
    Vn.transition = null;
    try {
      P = 4, Ci(e, n, t, r);
    } finally {
      P = l, Vn.transition = i;
    }
  }
  function Ci(e, n, t, r) {
    if (wr) {
      var l = Vl(e, n, t, r);
      if (l === null)
        cl(e, n, r, Sr, t), vu(e, r);
      else if (qa(l, e, n, t, r))
        r.stopPropagation();
      else if (vu(e, r), n & 4 && -1 < Ja.indexOf(e)) {
        for (; l !== null; ) {
          var i = Ut(l);
          if (i !== null && Vo(i), i = Vl(e, n, t, r), i === null && cl(e, n, r, Sr, t), i === l)
            break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else
        cl(e, n, r, null, t);
    }
  }
  var Sr = null;
  function Vl(e, n, t, r) {
    if (Sr = null, e = wi(r), e = cn(e), e !== null)
      if (n = kn(e), n === null)
        e = null;
      else if (t = n.tag, t === 13) {
        if (e = Mo(n), e !== null)
          return e;
        e = null;
      } else if (t === 3) {
        if (n.stateNode.current.memoizedState.isDehydrated)
          return n.tag === 3 ? n.stateNode.containerInfo : null;
        e = null;
      } else
        n !== e && (e = null);
    return Sr = e, null;
  }
  function Qo(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Ha()) {
          case Si:
            return 1;
          case Fo:
            return 4;
          case yr:
          case Wa:
            return 16;
          case Io:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ke = null, xi = null, ir = null;
  function $o() {
    if (ir)
      return ir;
    var e, n = xi, t = n.length, r, l = "value" in Ke ? Ke.value : Ke.textContent, i = l.length;
    for (e = 0; e < t && n[e] === l[e]; e++)
      ;
    var u = t - e;
    for (r = 1; r <= u && n[t - r] === l[i - r]; r++)
      ;
    return ir = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function ur(e) {
    var n = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function $t() {
    return true;
  }
  function gu() {
    return false;
  }
  function ce3(e) {
    function n(t, r, l, i, u) {
      this._reactName = t, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var o in e)
        e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === false) ? $t : gu, this.isPropagationStopped = gu, this;
    }
    return F2(n.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var t = this.nativeEvent;
      t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = false), this.isDefaultPrevented = $t);
    }, stopPropagation: function() {
      var t = this.nativeEvent;
      t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = true), this.isPropagationStopped = $t);
    }, persist: function() {
    }, isPersistent: $t }), n;
  }
  var Gn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ni = ce3(Gn), It = F2({}, Gn, { view: 0, detail: 0 }), tc = ce3(It), ll, il, et, Vr = F2({}, It, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: _i, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== et && (et && e.type === "mousemove" ? (ll = e.screenX - et.screenX, il = e.screenY - et.screenY) : il = ll = 0, et = e), ll);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : il;
  } }), wu = ce3(Vr), rc = F2({}, Vr, { dataTransfer: 0 }), lc = ce3(rc), ic = F2({}, It, { relatedTarget: 0 }), ul = ce3(ic), uc = F2({}, Gn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), oc = ce3(uc), sc = F2({}, Gn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), ac = ce3(sc), cc = F2({}, Gn, { data: 0 }), Su = ce3(cc), fc = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, dc = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" }, pc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function mc(e) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(e) : (e = pc[e]) ? !!n[e] : false;
  }
  function _i() {
    return mc;
  }
  var hc = F2({}, It, { key: function(e) {
    if (e.key) {
      var n = fc[e.key] || e.key;
      if (n !== "Unidentified")
        return n;
    }
    return e.type === "keypress" ? (e = ur(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? dc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: _i, charCode: function(e) {
    return e.type === "keypress" ? ur(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ur(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), vc = ce3(hc), yc = F2({}, Vr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ku = ce3(yc), gc = F2({}, It, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: _i }), wc = ce3(gc), Sc = F2({}, Gn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), kc = ce3(Sc), Ec = F2({}, Vr, { deltaX: function(e) {
    return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
  }, deltaY: function(e) {
    return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
  }, deltaZ: 0, deltaMode: 0 }), Cc = ce3(Ec), xc = [9, 13, 27, 32], zi = Fe2 && "CompositionEvent" in window, ft = null;
  Fe2 && "documentMode" in document && (ft = document.documentMode);
  var Nc = Fe2 && "TextEvent" in window && !ft, Ko = Fe2 && (!zi || ft && 8 < ft && 11 >= ft), Eu = String.fromCharCode(32), Cu = false;
  function Yo(e, n) {
    switch (e) {
      case "keyup":
        return xc.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function Xo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var _n = false;
  function _c(e, n) {
    switch (e) {
      case "compositionend":
        return Xo(n);
      case "keypress":
        return n.which !== 32 ? null : (Cu = true, Eu);
      case "textInput":
        return e = n.data, e === Eu && Cu ? null : e;
      default:
        return null;
    }
  }
  function zc(e, n) {
    if (_n)
      return e === "compositionend" || !zi && Yo(e, n) ? (e = $o(), ir = xi = Ke = null, _n = false, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length)
            return n.char;
          if (n.which)
            return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return Ko && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var Pc = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function xu(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n === "input" ? !!Pc[e.type] : n === "textarea";
  }
  function Go(e, n, t, r) {
    _o(r), n = kr(n, "onChange"), 0 < n.length && (t = new Ni("onChange", "change", null, t, r), e.push({ event: t, listeners: n }));
  }
  var dt = null, xt = null;
  function Lc(e) {
    us(e, 0);
  }
  function Ar(e) {
    var n = Ln(e);
    if (wo(n))
      return e;
  }
  function Tc(e, n) {
    if (e === "change")
      return n;
  }
  var Zo = false;
  Fe2 && (Fe2 ? (Yt = "oninput" in document, Yt || (ol = document.createElement("div"), ol.setAttribute("oninput", "return;"), Yt = typeof ol.oninput == "function"), Kt = Yt) : Kt = false, Zo = Kt && (!document.documentMode || 9 < document.documentMode));
  var Kt, Yt, ol;
  function Nu() {
    dt && (dt.detachEvent("onpropertychange", Jo), xt = dt = null);
  }
  function Jo(e) {
    if (e.propertyName === "value" && Ar(xt)) {
      var n = [];
      Go(n, xt, e, wi(e)), To(Lc, n);
    }
  }
  function Mc(e, n, t) {
    e === "focusin" ? (Nu(), dt = n, xt = t, dt.attachEvent("onpropertychange", Jo)) : e === "focusout" && Nu();
  }
  function Dc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ar(xt);
  }
  function Oc(e, n) {
    if (e === "click")
      return Ar(n);
  }
  function Rc(e, n) {
    if (e === "input" || e === "change")
      return Ar(n);
  }
  function Fc(e, n) {
    return e === n && (e !== 0 || 1 / e === 1 / n) || e !== e && n !== n;
  }
  var xe3 = typeof Object.is == "function" ? Object.is : Fc;
  function Nt(e, n) {
    if (xe3(e, n))
      return true;
    if (typeof e != "object" || e === null || typeof n != "object" || n === null)
      return false;
    var t = Object.keys(e), r = Object.keys(n);
    if (t.length !== r.length)
      return false;
    for (r = 0; r < t.length; r++) {
      var l = t[r];
      if (!kl.call(n, l) || !xe3(e[l], n[l]))
        return false;
    }
    return true;
  }
  function _u(e) {
    for (; e && e.firstChild; )
      e = e.firstChild;
    return e;
  }
  function zu(e, n) {
    var t = _u(e);
    e = 0;
    for (var r; t; ) {
      if (t.nodeType === 3) {
        if (r = e + t.textContent.length, e <= n && r >= n)
          return { node: t, offset: n - e };
        e = r;
      }
      e: {
        for (; t; ) {
          if (t.nextSibling) {
            t = t.nextSibling;
            break e;
          }
          t = t.parentNode;
        }
        t = void 0;
      }
      t = _u(t);
    }
  }
  function qo(e, n) {
    return e && n ? e === n ? true : e && e.nodeType === 3 ? false : n && n.nodeType === 3 ? qo(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : false : false;
  }
  function bo() {
    for (var e = window, n = mr(); n instanceof e.HTMLIFrameElement; ) {
      try {
        var t = typeof n.contentWindow.location.href == "string";
      } catch {
        t = false;
      }
      if (t)
        e = n.contentWindow;
      else
        break;
      n = mr(e.document);
    }
    return n;
  }
  function Pi(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
  }
  function Ic(e) {
    var n = bo(), t = e.focusedElem, r = e.selectionRange;
    if (n !== t && t && t.ownerDocument && qo(t.ownerDocument.documentElement, t)) {
      if (r !== null && Pi(t)) {
        if (n = r.start, e = r.end, e === void 0 && (e = n), "selectionStart" in t)
          t.selectionStart = n, t.selectionEnd = Math.min(e, t.value.length);
        else if (e = (n = t.ownerDocument || document) && n.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = t.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = zu(t, i);
          var u = zu(t, r);
          l && u && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== u.node || e.focusOffset !== u.offset) && (n = n.createRange(), n.setStart(l.node, l.offset), e.removeAllRanges(), i > r ? (e.addRange(n), e.extend(u.node, u.offset)) : (n.setEnd(u.node, u.offset), e.addRange(n)));
        }
      }
      for (n = [], e = t; e = e.parentNode; )
        e.nodeType === 1 && n.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof t.focus == "function" && t.focus(), t = 0; t < n.length; t++)
        e = n[t], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Uc = Fe2 && "documentMode" in document && 11 >= document.documentMode, zn = null, Al = null, pt = null, Bl = false;
  function Pu(e, n, t) {
    var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
    Bl || zn == null || zn !== mr(r) || (r = zn, "selectionStart" in r && Pi(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), pt && Nt(pt, r) || (pt = r, r = kr(Al, "onSelect"), 0 < r.length && (n = new Ni("onSelect", "select", null, n, t), e.push({ event: n, listeners: r }), n.target = zn)));
  }
  function Xt(e, n) {
    var t = {};
    return t[e.toLowerCase()] = n.toLowerCase(), t["Webkit" + e] = "webkit" + n, t["Moz" + e] = "moz" + n, t;
  }
  var Pn = { animationend: Xt("Animation", "AnimationEnd"), animationiteration: Xt("Animation", "AnimationIteration"), animationstart: Xt("Animation", "AnimationStart"), transitionend: Xt("Transition", "TransitionEnd") }, sl = {}, es = {};
  Fe2 && (es = document.createElement("div").style, "AnimationEvent" in window || (delete Pn.animationend.animation, delete Pn.animationiteration.animation, delete Pn.animationstart.animation), "TransitionEvent" in window || delete Pn.transitionend.transition);
  function Br(e) {
    if (sl[e])
      return sl[e];
    if (!Pn[e])
      return e;
    var n = Pn[e], t;
    for (t in n)
      if (n.hasOwnProperty(t) && t in es)
        return sl[e] = n[t];
    return e;
  }
  var ns = Br("animationend"), ts = Br("animationiteration"), rs = Br("animationstart"), ls = Br("transitionend"), is = /* @__PURE__ */ new Map(), Lu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ln(e, n) {
    is.set(e, n), Sn(n, [e]);
  }
  for (Gt = 0; Gt < Lu.length; Gt++)
    Zt = Lu[Gt], Tu = Zt.toLowerCase(), Mu = Zt[0].toUpperCase() + Zt.slice(1), ln(Tu, "on" + Mu);
  var Zt, Tu, Mu, Gt;
  ln(ns, "onAnimationEnd");
  ln(ts, "onAnimationIteration");
  ln(rs, "onAnimationStart");
  ln("dblclick", "onDoubleClick");
  ln("focusin", "onFocus");
  ln("focusout", "onBlur");
  ln(ls, "onTransitionEnd");
  Hn("onMouseEnter", ["mouseout", "mouseover"]);
  Hn("onMouseLeave", ["mouseout", "mouseover"]);
  Hn("onPointerEnter", ["pointerout", "pointerover"]);
  Hn("onPointerLeave", ["pointerout", "pointerover"]);
  Sn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  Sn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  Sn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  Sn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  Sn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  Sn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var st = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), jc = new Set("cancel close invalid load scroll toggle".split(" ").concat(st));
  function Du(e, n, t) {
    var r = e.type || "unknown-event";
    e.currentTarget = t, ja(r, n, void 0, e), e.currentTarget = null;
  }
  function us(e, n) {
    n = (n & 4) !== 0;
    for (var t = 0; t < e.length; t++) {
      var r = e[t], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (n)
          for (var u = r.length - 1; 0 <= u; u--) {
            var o = r[u], s = o.instance, d = o.currentTarget;
            if (o = o.listener, s !== i && l.isPropagationStopped())
              break e;
            Du(l, o, d), i = s;
          }
        else
          for (u = 0; u < r.length; u++) {
            if (o = r[u], s = o.instance, d = o.currentTarget, o = o.listener, s !== i && l.isPropagationStopped())
              break e;
            Du(l, o, d), i = s;
          }
      }
    }
    if (vr)
      throw e = Il, vr = false, Il = null, e;
  }
  function T(e, n) {
    var t = n[Kl];
    t === void 0 && (t = n[Kl] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    t.has(r) || (os(n, e, 2, false), t.add(r));
  }
  function al(e, n, t) {
    var r = 0;
    n && (r |= 4), os(t, e, r, n);
  }
  var Jt = "_reactListening" + Math.random().toString(36).slice(2);
  function _t(e) {
    if (!e[Jt]) {
      e[Jt] = true, mo.forEach(function(t) {
        t !== "selectionchange" && (jc.has(t) || al(t, false, e), al(t, true, e));
      });
      var n = e.nodeType === 9 ? e : e.ownerDocument;
      n === null || n[Jt] || (n[Jt] = true, al("selectionchange", false, n));
    }
  }
  function os(e, n, t, r) {
    switch (Qo(n)) {
      case 1:
        var l = ec;
        break;
      case 4:
        l = nc;
        break;
      default:
        l = Ci;
    }
    t = l.bind(null, n, t, e), l = void 0, !Fl || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (l = true), r ? l !== void 0 ? e.addEventListener(n, t, { capture: true, passive: l }) : e.addEventListener(n, t, true) : l !== void 0 ? e.addEventListener(n, t, { passive: l }) : e.addEventListener(n, t, false);
  }
  function cl(e, n, t, r, l) {
    var i = r;
    if ((n & 1) === 0 && (n & 2) === 0 && r !== null)
      e:
        for (; ; ) {
          if (r === null)
            return;
          var u = r.tag;
          if (u === 3 || u === 4) {
            var o = r.stateNode.containerInfo;
            if (o === l || o.nodeType === 8 && o.parentNode === l)
              break;
            if (u === 4)
              for (u = r.return; u !== null; ) {
                var s = u.tag;
                if ((s === 3 || s === 4) && (s = u.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l))
                  return;
                u = u.return;
              }
            for (; o !== null; ) {
              if (u = cn(o), u === null)
                return;
              if (s = u.tag, s === 5 || s === 6) {
                r = i = u;
                continue e;
              }
              o = o.parentNode;
            }
          }
          r = r.return;
        }
    To(function() {
      var d = i, m = wi(t), h = [];
      e: {
        var p = is.get(e);
        if (p !== void 0) {
          var g = Ni, S2 = e;
          switch (e) {
            case "keypress":
              if (ur(t) === 0)
                break e;
            case "keydown":
            case "keyup":
              g = vc;
              break;
            case "focusin":
              S2 = "focus", g = ul;
              break;
            case "focusout":
              S2 = "blur", g = ul;
              break;
            case "beforeblur":
            case "afterblur":
              g = ul;
              break;
            case "click":
              if (t.button === 2)
                break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              g = wu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              g = lc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              g = wc;
              break;
            case ns:
            case ts:
            case rs:
              g = oc;
              break;
            case ls:
              g = kc;
              break;
            case "scroll":
              g = tc;
              break;
            case "wheel":
              g = Cc;
              break;
            case "copy":
            case "cut":
            case "paste":
              g = ac;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              g = ku;
          }
          var k2 = (n & 4) !== 0, U3 = !k2 && e === "scroll", c = k2 ? p !== null ? p + "Capture" : null : p;
          k2 = [];
          for (var a = d, f; a !== null; ) {
            f = a;
            var y = f.stateNode;
            if (f.tag === 5 && y !== null && (f = y, c !== null && (y = St(a, c), y != null && k2.push(zt(a, y, f)))), U3)
              break;
            a = a.return;
          }
          0 < k2.length && (p = new g(p, S2, null, t, m), h.push({ event: p, listeners: k2 }));
        }
      }
      if ((n & 7) === 0) {
        e: {
          if (p = e === "mouseover" || e === "pointerover", g = e === "mouseout" || e === "pointerout", p && t !== Ol && (S2 = t.relatedTarget || t.fromElement) && (cn(S2) || S2[Ie3]))
            break e;
          if ((g || p) && (p = m.window === m ? m : (p = m.ownerDocument) ? p.defaultView || p.parentWindow : window, g ? (S2 = t.relatedTarget || t.toElement, g = d, S2 = S2 ? cn(S2) : null, S2 !== null && (U3 = kn(S2), S2 !== U3 || S2.tag !== 5 && S2.tag !== 6) && (S2 = null)) : (g = null, S2 = d), g !== S2)) {
            if (k2 = wu, y = "onMouseLeave", c = "onMouseEnter", a = "mouse", (e === "pointerout" || e === "pointerover") && (k2 = ku, y = "onPointerLeave", c = "onPointerEnter", a = "pointer"), U3 = g == null ? p : Ln(g), f = S2 == null ? p : Ln(S2), p = new k2(y, a + "leave", g, t, m), p.target = U3, p.relatedTarget = f, y = null, cn(m) === d && (k2 = new k2(c, a + "enter", S2, t, m), k2.target = f, k2.relatedTarget = U3, y = k2), U3 = y, g && S2)
              n: {
                for (k2 = g, c = S2, a = 0, f = k2; f; f = Cn(f))
                  a++;
                for (f = 0, y = c; y; y = Cn(y))
                  f++;
                for (; 0 < a - f; )
                  k2 = Cn(k2), a--;
                for (; 0 < f - a; )
                  c = Cn(c), f--;
                for (; a--; ) {
                  if (k2 === c || c !== null && k2 === c.alternate)
                    break n;
                  k2 = Cn(k2), c = Cn(c);
                }
                k2 = null;
              }
            else
              k2 = null;
            g !== null && Ou(h, p, g, k2, false), S2 !== null && U3 !== null && Ou(h, U3, S2, k2, true);
          }
        }
        e: {
          if (p = d ? Ln(d) : window, g = p.nodeName && p.nodeName.toLowerCase(), g === "select" || g === "input" && p.type === "file")
            var E = Tc;
          else if (xu(p))
            if (Zo)
              E = Rc;
            else {
              E = Dc;
              var C2 = Mc;
            }
          else
            (g = p.nodeName) && g.toLowerCase() === "input" && (p.type === "checkbox" || p.type === "radio") && (E = Oc);
          if (E && (E = E(e, d))) {
            Go(h, E, t, m);
            break e;
          }
          C2 && C2(e, p, d), e === "focusout" && (C2 = p._wrapperState) && C2.controlled && p.type === "number" && Pl(p, "number", p.value);
        }
        switch (C2 = d ? Ln(d) : window, e) {
          case "focusin":
            (xu(C2) || C2.contentEditable === "true") && (zn = C2, Al = d, pt = null);
            break;
          case "focusout":
            pt = Al = zn = null;
            break;
          case "mousedown":
            Bl = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Bl = false, Pu(h, t, m);
            break;
          case "selectionchange":
            if (Uc)
              break;
          case "keydown":
          case "keyup":
            Pu(h, t, m);
        }
        var x2;
        if (zi)
          e: {
            switch (e) {
              case "compositionstart":
                var N2 = "onCompositionStart";
                break e;
              case "compositionend":
                N2 = "onCompositionEnd";
                break e;
              case "compositionupdate":
                N2 = "onCompositionUpdate";
                break e;
            }
            N2 = void 0;
          }
        else
          _n ? Yo(e, t) && (N2 = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (N2 = "onCompositionStart");
        N2 && (Ko && t.locale !== "ko" && (_n || N2 !== "onCompositionStart" ? N2 === "onCompositionEnd" && _n && (x2 = $o()) : (Ke = m, xi = "value" in Ke ? Ke.value : Ke.textContent, _n = true)), C2 = kr(d, N2), 0 < C2.length && (N2 = new Su(N2, e, null, t, m), h.push({ event: N2, listeners: C2 }), x2 ? N2.data = x2 : (x2 = Xo(t), x2 !== null && (N2.data = x2)))), (x2 = Nc ? _c(e, t) : zc(e, t)) && (d = kr(d, "onBeforeInput"), 0 < d.length && (m = new Su("onBeforeInput", "beforeinput", null, t, m), h.push({ event: m, listeners: d }), m.data = x2));
      }
      us(h, n);
    });
  }
  function zt(e, n, t) {
    return { instance: e, listener: n, currentTarget: t };
  }
  function kr(e, n) {
    for (var t = n + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = St(e, t), i != null && r.unshift(zt(e, i, l)), i = St(e, n), i != null && r.push(zt(e, i, l))), e = e.return;
    }
    return r;
  }
  function Cn(e) {
    if (e === null)
      return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ou(e, n, t, r, l) {
    for (var i = n._reactName, u = []; t !== null && t !== r; ) {
      var o = t, s = o.alternate, d = o.stateNode;
      if (s !== null && s === r)
        break;
      o.tag === 5 && d !== null && (o = d, l ? (s = St(t, i), s != null && u.unshift(zt(t, s, o))) : l || (s = St(t, i), s != null && u.push(zt(t, s, o)))), t = t.return;
    }
    u.length !== 0 && e.push({ event: n, listeners: u });
  }
  var Vc = /\r\n?/g, Ac = /\u0000|\uFFFD/g;
  function Ru(e) {
    return (typeof e == "string" ? e : "" + e).replace(Vc, `
`).replace(Ac, "");
  }
  function qt(e, n, t) {
    if (n = Ru(n), Ru(e) !== n && t)
      throw Error(v(425));
  }
  function Er() {
  }
  var Hl = null, Wl = null;
  function Ql(e, n) {
    return e === "textarea" || e === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var $l = typeof setTimeout == "function" ? setTimeout : void 0, Bc = typeof clearTimeout == "function" ? clearTimeout : void 0, Fu = typeof Promise == "function" ? Promise : void 0, Hc = typeof queueMicrotask == "function" ? queueMicrotask : typeof Fu < "u" ? function(e) {
    return Fu.resolve(null).then(e).catch(Wc);
  } : $l;
  function Wc(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function fl(e, n) {
    var t = n, r = 0;
    do {
      var l = t.nextSibling;
      if (e.removeChild(t), l && l.nodeType === 8)
        if (t = l.data, t === "/$") {
          if (r === 0) {
            e.removeChild(l), Ct(n);
            return;
          }
          r--;
        } else
          t !== "$" && t !== "$?" && t !== "$!" || r++;
      t = l;
    } while (t);
    Ct(n);
  }
  function Je(e) {
    for (; e != null; e = e.nextSibling) {
      var n = e.nodeType;
      if (n === 1 || n === 3)
        break;
      if (n === 8) {
        if (n = e.data, n === "$" || n === "$!" || n === "$?")
          break;
        if (n === "/$")
          return null;
      }
    }
    return e;
  }
  function Iu(e) {
    e = e.previousSibling;
    for (var n = 0; e; ) {
      if (e.nodeType === 8) {
        var t = e.data;
        if (t === "$" || t === "$!" || t === "$?") {
          if (n === 0)
            return e;
          n--;
        } else
          t === "/$" && n++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Zn = Math.random().toString(36).slice(2), ze2 = "__reactFiber$" + Zn, Pt = "__reactProps$" + Zn, Ie3 = "__reactContainer$" + Zn, Kl = "__reactEvents$" + Zn, Qc = "__reactListeners$" + Zn, $c = "__reactHandles$" + Zn;
  function cn(e) {
    var n = e[ze2];
    if (n)
      return n;
    for (var t = e.parentNode; t; ) {
      if (n = t[Ie3] || t[ze2]) {
        if (t = n.alternate, n.child !== null || t !== null && t.child !== null)
          for (e = Iu(e); e !== null; ) {
            if (t = e[ze2])
              return t;
            e = Iu(e);
          }
        return n;
      }
      e = t, t = e.parentNode;
    }
    return null;
  }
  function Ut(e) {
    return e = e[ze2] || e[Ie3], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Ln(e) {
    if (e.tag === 5 || e.tag === 6)
      return e.stateNode;
    throw Error(v(33));
  }
  function Hr(e) {
    return e[Pt] || null;
  }
  var Yl = [], Tn = -1;
  function un(e) {
    return { current: e };
  }
  function M2(e) {
    0 > Tn || (e.current = Yl[Tn], Yl[Tn] = null, Tn--);
  }
  function L2(e, n) {
    Tn++, Yl[Tn] = e.current, e.current = n;
  }
  var rn = {}, J2 = un(rn), re = un(false), hn = rn;
  function Wn(e, n) {
    var t = e.type.contextTypes;
    if (!t)
      return rn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === n)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in t)
      l[i] = n[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function le2(e) {
    return e = e.childContextTypes, e != null;
  }
  function Cr() {
    M2(re), M2(J2);
  }
  function Uu(e, n, t) {
    if (J2.current !== rn)
      throw Error(v(168));
    L2(J2, n), L2(re, t);
  }
  function ss(e, n, t) {
    var r = e.stateNode;
    if (n = n.childContextTypes, typeof r.getChildContext != "function")
      return t;
    r = r.getChildContext();
    for (var l in r)
      if (!(l in n))
        throw Error(v(108, Ma(e) || "Unknown", l));
    return F2({}, t, r);
  }
  function xr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || rn, hn = J2.current, L2(J2, e), L2(re, re.current), true;
  }
  function ju(e, n, t) {
    var r = e.stateNode;
    if (!r)
      throw Error(v(169));
    t ? (e = ss(e, n, hn), r.__reactInternalMemoizedMergedChildContext = e, M2(re), M2(J2), L2(J2, e)) : M2(re), L2(re, t);
  }
  var Me2 = null, Wr = false, dl = false;
  function as(e) {
    Me2 === null ? Me2 = [e] : Me2.push(e);
  }
  function Kc(e) {
    Wr = true, as(e);
  }
  function on() {
    if (!dl && Me2 !== null) {
      dl = true;
      var e = 0, n = P;
      try {
        var t = Me2;
        for (P = 1; e < t.length; e++) {
          var r = t[e];
          do
            r = r(true);
          while (r !== null);
        }
        Me2 = null, Wr = false;
      } catch (l) {
        throw Me2 !== null && (Me2 = Me2.slice(e + 1)), Ro(Si, on), l;
      } finally {
        P = n, dl = false;
      }
    }
    return null;
  }
  var Mn = [], Dn = 0, Nr = null, _r = 0, de3 = [], pe3 = 0, vn = null, De2 = 1, Oe2 = "";
  function sn(e, n) {
    Mn[Dn++] = _r, Mn[Dn++] = Nr, Nr = e, _r = n;
  }
  function cs(e, n, t) {
    de3[pe3++] = De2, de3[pe3++] = Oe2, de3[pe3++] = vn, vn = e;
    var r = De2;
    e = Oe2;
    var l = 32 - Ee3(r) - 1;
    r &= ~(1 << l), t += 1;
    var i = 32 - Ee3(n) + l;
    if (30 < i) {
      var u = l - l % 5;
      i = (r & (1 << u) - 1).toString(32), r >>= u, l -= u, De2 = 1 << 32 - Ee3(n) + l | t << l | r, Oe2 = i + e;
    } else
      De2 = 1 << i | t << l | r, Oe2 = e;
  }
  function Li(e) {
    e.return !== null && (sn(e, 1), cs(e, 1, 0));
  }
  function Ti(e) {
    for (; e === Nr; )
      Nr = Mn[--Dn], Mn[Dn] = null, _r = Mn[--Dn], Mn[Dn] = null;
    for (; e === vn; )
      vn = de3[--pe3], de3[pe3] = null, Oe2 = de3[--pe3], de3[pe3] = null, De2 = de3[--pe3], de3[pe3] = null;
  }
  var se2 = null, oe2 = null, D2 = false, ke3 = null;
  function fs(e, n) {
    var t = me3(5, null, null, 0);
    t.elementType = "DELETED", t.stateNode = n, t.return = e, n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t);
  }
  function Vu(e, n) {
    switch (e.tag) {
      case 5:
        var t = e.type;
        return n = n.nodeType !== 1 || t.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, se2 = e, oe2 = Je(n.firstChild), true) : false;
      case 6:
        return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, se2 = e, oe2 = null, true) : false;
      case 13:
        return n = n.nodeType !== 8 ? null : n, n !== null ? (t = vn !== null ? { id: De2, overflow: Oe2 } : null, e.memoizedState = { dehydrated: n, treeContext: t, retryLane: 1073741824 }, t = me3(18, null, null, 0), t.stateNode = n, t.return = e, e.child = t, se2 = e, oe2 = null, true) : false;
      default:
        return false;
    }
  }
  function Xl(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Gl(e) {
    if (D2) {
      var n = oe2;
      if (n) {
        var t = n;
        if (!Vu(e, n)) {
          if (Xl(e))
            throw Error(v(418));
          n = Je(t.nextSibling);
          var r = se2;
          n && Vu(e, n) ? fs(r, t) : (e.flags = e.flags & -4097 | 2, D2 = false, se2 = e);
        }
      } else {
        if (Xl(e))
          throw Error(v(418));
        e.flags = e.flags & -4097 | 2, D2 = false, se2 = e;
      }
    }
  }
  function Au(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
      e = e.return;
    se2 = e;
  }
  function bt(e) {
    if (e !== se2)
      return false;
    if (!D2)
      return Au(e), D2 = true, false;
    var n;
    if ((n = e.tag !== 3) && !(n = e.tag !== 5) && (n = e.type, n = n !== "head" && n !== "body" && !Ql(e.type, e.memoizedProps)), n && (n = oe2)) {
      if (Xl(e))
        throw ds(), Error(v(418));
      for (; n; )
        fs(e, n), n = Je(n.nextSibling);
    }
    if (Au(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e)
        throw Error(v(317));
      e: {
        for (e = e.nextSibling, n = 0; e; ) {
          if (e.nodeType === 8) {
            var t = e.data;
            if (t === "/$") {
              if (n === 0) {
                oe2 = Je(e.nextSibling);
                break e;
              }
              n--;
            } else
              t !== "$" && t !== "$!" && t !== "$?" || n++;
          }
          e = e.nextSibling;
        }
        oe2 = null;
      }
    } else
      oe2 = se2 ? Je(e.stateNode.nextSibling) : null;
    return true;
  }
  function ds() {
    for (var e = oe2; e; )
      e = Je(e.nextSibling);
  }
  function Qn() {
    oe2 = se2 = null, D2 = false;
  }
  function Mi(e) {
    ke3 === null ? ke3 = [e] : ke3.push(e);
  }
  var Yc = Ve2.ReactCurrentBatchConfig;
  function we3(e, n) {
    if (e && e.defaultProps) {
      n = F2({}, n), e = e.defaultProps;
      for (var t in e)
        n[t] === void 0 && (n[t] = e[t]);
      return n;
    }
    return n;
  }
  var zr = un(null), Pr = null, On = null, Di = null;
  function Oi() {
    Di = On = Pr = null;
  }
  function Ri(e) {
    var n = zr.current;
    M2(zr), e._currentValue = n;
  }
  function Zl(e, n, t) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & n) !== n ? (e.childLanes |= n, r !== null && (r.childLanes |= n)) : r !== null && (r.childLanes & n) !== n && (r.childLanes |= n), e === t)
        break;
      e = e.return;
    }
  }
  function An(e, n) {
    Pr = e, Di = On = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & n) !== 0 && (te2 = true), e.firstContext = null);
  }
  function ve3(e) {
    var n = e._currentValue;
    if (Di !== e)
      if (e = { context: e, memoizedValue: n, next: null }, On === null) {
        if (Pr === null)
          throw Error(v(308));
        On = e, Pr.dependencies = { lanes: 0, firstContext: e };
      } else
        On = On.next = e;
    return n;
  }
  var fn = null;
  function Fi(e) {
    fn === null ? fn = [e] : fn.push(e);
  }
  function ps(e, n, t, r) {
    var l = n.interleaved;
    return l === null ? (t.next = t, Fi(n)) : (t.next = l.next, l.next = t), n.interleaved = t, Ue2(e, r);
  }
  function Ue2(e, n) {
    e.lanes |= n;
    var t = e.alternate;
    for (t !== null && (t.lanes |= n), t = e, e = e.return; e !== null; )
      e.childLanes |= n, t = e.alternate, t !== null && (t.childLanes |= n), t = e, e = e.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var We2 = false;
  function Ii(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ms(e, n) {
    e = e.updateQueue, n.updateQueue === e && (n.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Re2(e, n) {
    return { eventTime: e, lane: n, tag: 0, payload: null, callback: null, next: null };
  }
  function qe2(e, n, t) {
    var r = e.updateQueue;
    if (r === null)
      return null;
    if (r = r.shared, (_ & 2) !== 0) {
      var l = r.pending;
      return l === null ? n.next = n : (n.next = l.next, l.next = n), r.pending = n, Ue2(e, t);
    }
    return l = r.interleaved, l === null ? (n.next = n, Fi(r)) : (n.next = l.next, l.next = n), r.interleaved = n, Ue2(e, t);
  }
  function or(e, n, t) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (t & 4194240) !== 0)) {
      var r = n.lanes;
      r &= e.pendingLanes, t |= r, n.lanes = t, ki(e, t);
    }
  }
  function Bu(e, n) {
    var t = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, t === r)) {
      var l = null, i = null;
      if (t = t.firstBaseUpdate, t !== null) {
        do {
          var u = { eventTime: t.eventTime, lane: t.lane, tag: t.tag, payload: t.payload, callback: t.callback, next: null };
          i === null ? l = i = u : i = i.next = u, t = t.next;
        } while (t !== null);
        i === null ? l = i = n : i = i.next = n;
      } else
        l = i = n;
      t = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = t;
      return;
    }
    e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = n : e.next = n, t.lastBaseUpdate = n;
  }
  function Lr(e, n, t, r) {
    var l = e.updateQueue;
    We2 = false;
    var i = l.firstBaseUpdate, u = l.lastBaseUpdate, o = l.shared.pending;
    if (o !== null) {
      l.shared.pending = null;
      var s = o, d = s.next;
      s.next = null, u === null ? i = d : u.next = d, u = s;
      var m = e.alternate;
      m !== null && (m = m.updateQueue, o = m.lastBaseUpdate, o !== u && (o === null ? m.firstBaseUpdate = d : o.next = d, m.lastBaseUpdate = s));
    }
    if (i !== null) {
      var h = l.baseState;
      u = 0, m = d = s = null, o = i;
      do {
        var p = o.lane, g = o.eventTime;
        if ((r & p) === p) {
          m !== null && (m = m.next = { eventTime: g, lane: 0, tag: o.tag, payload: o.payload, callback: o.callback, next: null });
          e: {
            var S2 = e, k2 = o;
            switch (p = n, g = t, k2.tag) {
              case 1:
                if (S2 = k2.payload, typeof S2 == "function") {
                  h = S2.call(g, h, p);
                  break e;
                }
                h = S2;
                break e;
              case 3:
                S2.flags = S2.flags & -65537 | 128;
              case 0:
                if (S2 = k2.payload, p = typeof S2 == "function" ? S2.call(g, h, p) : S2, p == null)
                  break e;
                h = F2({}, h, p);
                break e;
              case 2:
                We2 = true;
            }
          }
          o.callback !== null && o.lane !== 0 && (e.flags |= 64, p = l.effects, p === null ? l.effects = [o] : p.push(o));
        } else
          g = { eventTime: g, lane: p, tag: o.tag, payload: o.payload, callback: o.callback, next: null }, m === null ? (d = m = g, s = h) : m = m.next = g, u |= p;
        if (o = o.next, o === null) {
          if (o = l.shared.pending, o === null)
            break;
          p = o, o = p.next, p.next = null, l.lastBaseUpdate = p, l.shared.pending = null;
        }
      } while (1);
      if (m === null && (s = h), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = m, n = l.shared.interleaved, n !== null) {
        l = n;
        do
          u |= l.lane, l = l.next;
        while (l !== n);
      } else
        i === null && (l.shared.lanes = 0);
      gn |= u, e.lanes = u, e.memoizedState = h;
    }
  }
  function Hu(e, n, t) {
    if (e = n.effects, n.effects = null, e !== null)
      for (n = 0; n < e.length; n++) {
        var r = e[n], l = r.callback;
        if (l !== null) {
          if (r.callback = null, r = t, typeof l != "function")
            throw Error(v(191, l));
          l.call(r);
        }
      }
  }
  var hs = new po.Component().refs;
  function Jl(e, n, t, r) {
    n = e.memoizedState, t = t(r, n), t = t == null ? n : F2({}, n, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
  }
  var Qr = { isMounted: function(e) {
    return (e = e._reactInternals) ? kn(e) === e : false;
  }, enqueueSetState: function(e, n, t) {
    e = e._reactInternals;
    var r = b(), l = en(e), i = Re2(r, l);
    i.payload = n, t != null && (i.callback = t), n = qe2(e, i, l), n !== null && (Ce3(n, e, l, r), or(n, e, l));
  }, enqueueReplaceState: function(e, n, t) {
    e = e._reactInternals;
    var r = b(), l = en(e), i = Re2(r, l);
    i.tag = 1, i.payload = n, t != null && (i.callback = t), n = qe2(e, i, l), n !== null && (Ce3(n, e, l, r), or(n, e, l));
  }, enqueueForceUpdate: function(e, n) {
    e = e._reactInternals;
    var t = b(), r = en(e), l = Re2(t, r);
    l.tag = 2, n != null && (l.callback = n), n = qe2(e, l, r), n !== null && (Ce3(n, e, r, t), or(n, e, r));
  } };
  function Wu(e, n, t, r, l, i, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, u) : n.prototype && n.prototype.isPureReactComponent ? !Nt(t, r) || !Nt(l, i) : true;
  }
  function vs(e, n, t) {
    var r = false, l = rn, i = n.contextType;
    return typeof i == "object" && i !== null ? i = ve3(i) : (l = le2(n) ? hn : J2.current, r = n.contextTypes, i = (r = r != null) ? Wn(e, l) : rn), n = new n(t, i), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = Qr, e.stateNode = n, n._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), n;
  }
  function Qu(e, n, t, r) {
    e = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(t, r), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(t, r), n.state !== e && Qr.enqueueReplaceState(n, n.state, null);
  }
  function ql(e, n, t, r) {
    var l = e.stateNode;
    l.props = t, l.state = e.memoizedState, l.refs = hs, Ii(e);
    var i = n.contextType;
    typeof i == "object" && i !== null ? l.context = ve3(i) : (i = le2(n) ? hn : J2.current, l.context = Wn(e, i)), l.state = e.memoizedState, i = n.getDerivedStateFromProps, typeof i == "function" && (Jl(e, n, i, t), l.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (n = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), n !== l.state && Qr.enqueueReplaceState(l, l.state, null), Lr(e, t, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function nt(e, n, t) {
    if (e = t.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (t._owner) {
        if (t = t._owner, t) {
          if (t.tag !== 1)
            throw Error(v(309));
          var r = t.stateNode;
        }
        if (!r)
          throw Error(v(147, e));
        var l = r, i = "" + e;
        return n !== null && n.ref !== null && typeof n.ref == "function" && n.ref._stringRef === i ? n.ref : (n = function(u) {
          var o = l.refs;
          o === hs && (o = l.refs = {}), u === null ? delete o[i] : o[i] = u;
        }, n._stringRef = i, n);
      }
      if (typeof e != "string")
        throw Error(v(284));
      if (!t._owner)
        throw Error(v(290, e));
    }
    return e;
  }
  function er(e, n) {
    throw e = Object.prototype.toString.call(n), Error(v(31, e === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : e));
  }
  function $u(e) {
    var n = e._init;
    return n(e._payload);
  }
  function ys(e) {
    function n(c, a) {
      if (e) {
        var f = c.deletions;
        f === null ? (c.deletions = [a], c.flags |= 16) : f.push(a);
      }
    }
    function t(c, a) {
      if (!e)
        return null;
      for (; a !== null; )
        n(c, a), a = a.sibling;
      return null;
    }
    function r(c, a) {
      for (c = /* @__PURE__ */ new Map(); a !== null; )
        a.key !== null ? c.set(a.key, a) : c.set(a.index, a), a = a.sibling;
      return c;
    }
    function l(c, a) {
      return c = nn(c, a), c.index = 0, c.sibling = null, c;
    }
    function i(c, a, f) {
      return c.index = f, e ? (f = c.alternate, f !== null ? (f = f.index, f < a ? (c.flags |= 2, a) : f) : (c.flags |= 2, a)) : (c.flags |= 1048576, a);
    }
    function u(c) {
      return e && c.alternate === null && (c.flags |= 2), c;
    }
    function o(c, a, f, y) {
      return a === null || a.tag !== 6 ? (a = wl(f, c.mode, y), a.return = c, a) : (a = l(a, f), a.return = c, a);
    }
    function s(c, a, f, y) {
      var E = f.type;
      return E === Nn ? m(c, a, f.props.children, y, f.key) : a !== null && (a.elementType === E || typeof E == "object" && E !== null && E.$$typeof === He2 && $u(E) === a.type) ? (y = l(a, f.props), y.ref = nt(c, a, f), y.return = c, y) : (y = pr(f.type, f.key, f.props, null, c.mode, y), y.ref = nt(c, a, f), y.return = c, y);
    }
    function d(c, a, f, y) {
      return a === null || a.tag !== 4 || a.stateNode.containerInfo !== f.containerInfo || a.stateNode.implementation !== f.implementation ? (a = Sl(f, c.mode, y), a.return = c, a) : (a = l(a, f.children || []), a.return = c, a);
    }
    function m(c, a, f, y, E) {
      return a === null || a.tag !== 7 ? (a = mn(f, c.mode, y, E), a.return = c, a) : (a = l(a, f), a.return = c, a);
    }
    function h(c, a, f) {
      if (typeof a == "string" && a !== "" || typeof a == "number")
        return a = wl("" + a, c.mode, f), a.return = c, a;
      if (typeof a == "object" && a !== null) {
        switch (a.$$typeof) {
          case Vt:
            return f = pr(a.type, a.key, a.props, null, c.mode, f), f.ref = nt(c, null, a), f.return = c, f;
          case xn:
            return a = Sl(a, c.mode, f), a.return = c, a;
          case He2:
            var y = a._init;
            return h(c, y(a._payload), f);
        }
        if (ut(a) || Jn(a))
          return a = mn(a, c.mode, f, null), a.return = c, a;
        er(c, a);
      }
      return null;
    }
    function p(c, a, f, y) {
      var E = a !== null ? a.key : null;
      if (typeof f == "string" && f !== "" || typeof f == "number")
        return E !== null ? null : o(c, a, "" + f, y);
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case Vt:
            return f.key === E ? s(c, a, f, y) : null;
          case xn:
            return f.key === E ? d(c, a, f, y) : null;
          case He2:
            return E = f._init, p(c, a, E(f._payload), y);
        }
        if (ut(f) || Jn(f))
          return E !== null ? null : m(c, a, f, y, null);
        er(c, f);
      }
      return null;
    }
    function g(c, a, f, y, E) {
      if (typeof y == "string" && y !== "" || typeof y == "number")
        return c = c.get(f) || null, o(a, c, "" + y, E);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case Vt:
            return c = c.get(y.key === null ? f : y.key) || null, s(a, c, y, E);
          case xn:
            return c = c.get(y.key === null ? f : y.key) || null, d(a, c, y, E);
          case He2:
            var C2 = y._init;
            return g(c, a, f, C2(y._payload), E);
        }
        if (ut(y) || Jn(y))
          return c = c.get(f) || null, m(a, c, y, E, null);
        er(a, y);
      }
      return null;
    }
    function S2(c, a, f, y) {
      for (var E = null, C2 = null, x2 = a, N2 = a = 0, H2 = null; x2 !== null && N2 < f.length; N2++) {
        x2.index > N2 ? (H2 = x2, x2 = null) : H2 = x2.sibling;
        var z2 = p(c, x2, f[N2], y);
        if (z2 === null) {
          x2 === null && (x2 = H2);
          break;
        }
        e && x2 && z2.alternate === null && n(c, x2), a = i(z2, a, N2), C2 === null ? E = z2 : C2.sibling = z2, C2 = z2, x2 = H2;
      }
      if (N2 === f.length)
        return t(c, x2), D2 && sn(c, N2), E;
      if (x2 === null) {
        for (; N2 < f.length; N2++)
          x2 = h(c, f[N2], y), x2 !== null && (a = i(x2, a, N2), C2 === null ? E = x2 : C2.sibling = x2, C2 = x2);
        return D2 && sn(c, N2), E;
      }
      for (x2 = r(c, x2); N2 < f.length; N2++)
        H2 = g(x2, c, N2, f[N2], y), H2 !== null && (e && H2.alternate !== null && x2.delete(H2.key === null ? N2 : H2.key), a = i(H2, a, N2), C2 === null ? E = H2 : C2.sibling = H2, C2 = H2);
      return e && x2.forEach(function(Ae2) {
        return n(c, Ae2);
      }), D2 && sn(c, N2), E;
    }
    function k2(c, a, f, y) {
      var E = Jn(f);
      if (typeof E != "function")
        throw Error(v(150));
      if (f = E.call(f), f == null)
        throw Error(v(151));
      for (var C2 = E = null, x2 = a, N2 = a = 0, H2 = null, z2 = f.next(); x2 !== null && !z2.done; N2++, z2 = f.next()) {
        x2.index > N2 ? (H2 = x2, x2 = null) : H2 = x2.sibling;
        var Ae2 = p(c, x2, z2.value, y);
        if (Ae2 === null) {
          x2 === null && (x2 = H2);
          break;
        }
        e && x2 && Ae2.alternate === null && n(c, x2), a = i(Ae2, a, N2), C2 === null ? E = Ae2 : C2.sibling = Ae2, C2 = Ae2, x2 = H2;
      }
      if (z2.done)
        return t(c, x2), D2 && sn(c, N2), E;
      if (x2 === null) {
        for (; !z2.done; N2++, z2 = f.next())
          z2 = h(c, z2.value, y), z2 !== null && (a = i(z2, a, N2), C2 === null ? E = z2 : C2.sibling = z2, C2 = z2);
        return D2 && sn(c, N2), E;
      }
      for (x2 = r(c, x2); !z2.done; N2++, z2 = f.next())
        z2 = g(x2, c, N2, z2.value, y), z2 !== null && (e && z2.alternate !== null && x2.delete(z2.key === null ? N2 : z2.key), a = i(z2, a, N2), C2 === null ? E = z2 : C2.sibling = z2, C2 = z2);
      return e && x2.forEach(function(ga) {
        return n(c, ga);
      }), D2 && sn(c, N2), E;
    }
    function U3(c, a, f, y) {
      if (typeof f == "object" && f !== null && f.type === Nn && f.key === null && (f = f.props.children), typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case Vt:
            e: {
              for (var E = f.key, C2 = a; C2 !== null; ) {
                if (C2.key === E) {
                  if (E = f.type, E === Nn) {
                    if (C2.tag === 7) {
                      t(c, C2.sibling), a = l(C2, f.props.children), a.return = c, c = a;
                      break e;
                    }
                  } else if (C2.elementType === E || typeof E == "object" && E !== null && E.$$typeof === He2 && $u(E) === C2.type) {
                    t(c, C2.sibling), a = l(C2, f.props), a.ref = nt(c, C2, f), a.return = c, c = a;
                    break e;
                  }
                  t(c, C2);
                  break;
                } else
                  n(c, C2);
                C2 = C2.sibling;
              }
              f.type === Nn ? (a = mn(f.props.children, c.mode, y, f.key), a.return = c, c = a) : (y = pr(f.type, f.key, f.props, null, c.mode, y), y.ref = nt(c, a, f), y.return = c, c = y);
            }
            return u(c);
          case xn:
            e: {
              for (C2 = f.key; a !== null; ) {
                if (a.key === C2)
                  if (a.tag === 4 && a.stateNode.containerInfo === f.containerInfo && a.stateNode.implementation === f.implementation) {
                    t(c, a.sibling), a = l(a, f.children || []), a.return = c, c = a;
                    break e;
                  } else {
                    t(c, a);
                    break;
                  }
                else
                  n(c, a);
                a = a.sibling;
              }
              a = Sl(f, c.mode, y), a.return = c, c = a;
            }
            return u(c);
          case He2:
            return C2 = f._init, U3(c, a, C2(f._payload), y);
        }
        if (ut(f))
          return S2(c, a, f, y);
        if (Jn(f))
          return k2(c, a, f, y);
        er(c, f);
      }
      return typeof f == "string" && f !== "" || typeof f == "number" ? (f = "" + f, a !== null && a.tag === 6 ? (t(c, a.sibling), a = l(a, f), a.return = c, c = a) : (t(c, a), a = wl(f, c.mode, y), a.return = c, c = a), u(c)) : t(c, a);
    }
    return U3;
  }
  var $n = ys(true), gs = ys(false), jt = {}, Le2 = un(jt), Lt = un(jt), Tt = un(jt);
  function dn(e) {
    if (e === jt)
      throw Error(v(174));
    return e;
  }
  function Ui(e, n) {
    switch (L2(Tt, n), L2(Lt, e), L2(Le2, jt), e = n.nodeType, e) {
      case 9:
      case 11:
        n = (n = n.documentElement) ? n.namespaceURI : Tl(null, "");
        break;
      default:
        e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = Tl(n, e);
    }
    M2(Le2), L2(Le2, n);
  }
  function Kn() {
    M2(Le2), M2(Lt), M2(Tt);
  }
  function ws(e) {
    dn(Tt.current);
    var n = dn(Le2.current), t = Tl(n, e.type);
    n !== t && (L2(Lt, e), L2(Le2, t));
  }
  function ji(e) {
    Lt.current === e && (M2(Le2), M2(Lt));
  }
  var O = un(0);
  function Tr(e) {
    for (var n = e; n !== null; ) {
      if (n.tag === 13) {
        var t = n.memoizedState;
        if (t !== null && (t = t.dehydrated, t === null || t.data === "$?" || t.data === "$!"))
          return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
        if ((n.flags & 128) !== 0)
          return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === e)
        break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === e)
          return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var pl = [];
  function Vi() {
    for (var e = 0; e < pl.length; e++)
      pl[e]._workInProgressVersionPrimary = null;
    pl.length = 0;
  }
  var sr = Ve2.ReactCurrentDispatcher, ml = Ve2.ReactCurrentBatchConfig, yn = 0, R2 = null, A2 = null, W = null, Mr = false, mt = false, Mt = 0, Xc = 0;
  function X2() {
    throw Error(v(321));
  }
  function Ai(e, n) {
    if (n === null)
      return false;
    for (var t = 0; t < n.length && t < e.length; t++)
      if (!xe3(e[t], n[t]))
        return false;
    return true;
  }
  function Bi(e, n, t, r, l, i) {
    if (yn = i, R2 = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, sr.current = e === null || e.memoizedState === null ? qc : bc, e = t(r, l), mt) {
      i = 0;
      do {
        if (mt = false, Mt = 0, 25 <= i)
          throw Error(v(301));
        i += 1, W = A2 = null, n.updateQueue = null, sr.current = ef, e = t(r, l);
      } while (mt);
    }
    if (sr.current = Dr, n = A2 !== null && A2.next !== null, yn = 0, W = A2 = R2 = null, Mr = false, n)
      throw Error(v(300));
    return e;
  }
  function Hi() {
    var e = Mt !== 0;
    return Mt = 0, e;
  }
  function _e3() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return W === null ? R2.memoizedState = W = e : W = W.next = e, W;
  }
  function ye3() {
    if (A2 === null) {
      var e = R2.alternate;
      e = e !== null ? e.memoizedState : null;
    } else
      e = A2.next;
    var n = W === null ? R2.memoizedState : W.next;
    if (n !== null)
      W = n, A2 = e;
    else {
      if (e === null)
        throw Error(v(310));
      A2 = e, e = { memoizedState: A2.memoizedState, baseState: A2.baseState, baseQueue: A2.baseQueue, queue: A2.queue, next: null }, W === null ? R2.memoizedState = W = e : W = W.next = e;
    }
    return W;
  }
  function Dt(e, n) {
    return typeof n == "function" ? n(e) : n;
  }
  function hl(e) {
    var n = ye3(), t = n.queue;
    if (t === null)
      throw Error(v(311));
    t.lastRenderedReducer = e;
    var r = A2, l = r.baseQueue, i = t.pending;
    if (i !== null) {
      if (l !== null) {
        var u = l.next;
        l.next = i.next, i.next = u;
      }
      r.baseQueue = l = i, t.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var o = u = null, s = null, d = i;
      do {
        var m = d.lane;
        if ((yn & m) === m)
          s !== null && (s = s.next = { lane: 0, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null }), r = d.hasEagerState ? d.eagerState : e(r, d.action);
        else {
          var h = { lane: m, action: d.action, hasEagerState: d.hasEagerState, eagerState: d.eagerState, next: null };
          s === null ? (o = s = h, u = r) : s = s.next = h, R2.lanes |= m, gn |= m;
        }
        d = d.next;
      } while (d !== null && d !== i);
      s === null ? u = r : s.next = o, xe3(r, n.memoizedState) || (te2 = true), n.memoizedState = r, n.baseState = u, n.baseQueue = s, t.lastRenderedState = r;
    }
    if (e = t.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, R2.lanes |= i, gn |= i, l = l.next;
      while (l !== e);
    } else
      l === null && (t.lanes = 0);
    return [n.memoizedState, t.dispatch];
  }
  function vl(e) {
    var n = ye3(), t = n.queue;
    if (t === null)
      throw Error(v(311));
    t.lastRenderedReducer = e;
    var r = t.dispatch, l = t.pending, i = n.memoizedState;
    if (l !== null) {
      t.pending = null;
      var u = l = l.next;
      do
        i = e(i, u.action), u = u.next;
      while (u !== l);
      xe3(i, n.memoizedState) || (te2 = true), n.memoizedState = i, n.baseQueue === null && (n.baseState = i), t.lastRenderedState = i;
    }
    return [i, r];
  }
  function Ss() {
  }
  function ks(e, n) {
    var t = R2, r = ye3(), l = n(), i = !xe3(r.memoizedState, l);
    if (i && (r.memoizedState = l, te2 = true), r = r.queue, Wi(xs.bind(null, t, r, e), [e]), r.getSnapshot !== n || i || W !== null && W.memoizedState.tag & 1) {
      if (t.flags |= 2048, Ot(9, Cs.bind(null, t, r, l, n), void 0, null), Q2 === null)
        throw Error(v(349));
      (yn & 30) !== 0 || Es(t, n, l);
    }
    return l;
  }
  function Es(e, n, t) {
    e.flags |= 16384, e = { getSnapshot: n, value: t }, n = R2.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, R2.updateQueue = n, n.stores = [e]) : (t = n.stores, t === null ? n.stores = [e] : t.push(e));
  }
  function Cs(e, n, t, r) {
    n.value = t, n.getSnapshot = r, Ns(n) && _s(e);
  }
  function xs(e, n, t) {
    return t(function() {
      Ns(n) && _s(e);
    });
  }
  function Ns(e) {
    var n = e.getSnapshot;
    e = e.value;
    try {
      var t = n();
      return !xe3(e, t);
    } catch {
      return true;
    }
  }
  function _s(e) {
    var n = Ue2(e, 1);
    n !== null && Ce3(n, e, 1, -1);
  }
  function Ku(e) {
    var n = _e3();
    return typeof e == "function" && (e = e()), n.memoizedState = n.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Dt, lastRenderedState: e }, n.queue = e, e = e.dispatch = Jc.bind(null, R2, e), [n.memoizedState, e];
  }
  function Ot(e, n, t, r) {
    return e = { tag: e, create: n, destroy: t, deps: r, next: null }, n = R2.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, R2.updateQueue = n, n.lastEffect = e.next = e) : (t = n.lastEffect, t === null ? n.lastEffect = e.next = e : (r = t.next, t.next = e, e.next = r, n.lastEffect = e)), e;
  }
  function zs() {
    return ye3().memoizedState;
  }
  function ar(e, n, t, r) {
    var l = _e3();
    R2.flags |= e, l.memoizedState = Ot(1 | n, t, void 0, r === void 0 ? null : r);
  }
  function $r(e, n, t, r) {
    var l = ye3();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (A2 !== null) {
      var u = A2.memoizedState;
      if (i = u.destroy, r !== null && Ai(r, u.deps)) {
        l.memoizedState = Ot(n, t, i, r);
        return;
      }
    }
    R2.flags |= e, l.memoizedState = Ot(1 | n, t, i, r);
  }
  function Yu(e, n) {
    return ar(8390656, 8, e, n);
  }
  function Wi(e, n) {
    return $r(2048, 8, e, n);
  }
  function Ps(e, n) {
    return $r(4, 2, e, n);
  }
  function Ls(e, n) {
    return $r(4, 4, e, n);
  }
  function Ts(e, n) {
    if (typeof n == "function")
      return e = e(), n(e), function() {
        n(null);
      };
    if (n != null)
      return e = e(), n.current = e, function() {
        n.current = null;
      };
  }
  function Ms(e, n, t) {
    return t = t != null ? t.concat([e]) : null, $r(4, 4, Ts.bind(null, n, e), t);
  }
  function Qi() {
  }
  function Ds(e, n) {
    var t = ye3();
    n = n === void 0 ? null : n;
    var r = t.memoizedState;
    return r !== null && n !== null && Ai(n, r[1]) ? r[0] : (t.memoizedState = [e, n], e);
  }
  function Os(e, n) {
    var t = ye3();
    n = n === void 0 ? null : n;
    var r = t.memoizedState;
    return r !== null && n !== null && Ai(n, r[1]) ? r[0] : (e = e(), t.memoizedState = [e, n], e);
  }
  function Rs(e, n, t) {
    return (yn & 21) === 0 ? (e.baseState && (e.baseState = false, te2 = true), e.memoizedState = t) : (xe3(t, n) || (t = Uo(), R2.lanes |= t, gn |= t, e.baseState = true), n);
  }
  function Gc(e, n) {
    var t = P;
    P = t !== 0 && 4 > t ? t : 4, e(true);
    var r = ml.transition;
    ml.transition = {};
    try {
      e(false), n();
    } finally {
      P = t, ml.transition = r;
    }
  }
  function Fs() {
    return ye3().memoizedState;
  }
  function Zc(e, n, t) {
    var r = en(e);
    if (t = { lane: r, action: t, hasEagerState: false, eagerState: null, next: null }, Is(e))
      Us(n, t);
    else if (t = ps(e, n, t, r), t !== null) {
      var l = b();
      Ce3(t, e, r, l), js(t, n, r);
    }
  }
  function Jc(e, n, t) {
    var r = en(e), l = { lane: r, action: t, hasEagerState: false, eagerState: null, next: null };
    if (Is(e))
      Us(n, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = n.lastRenderedReducer, i !== null))
        try {
          var u = n.lastRenderedState, o = i(u, t);
          if (l.hasEagerState = true, l.eagerState = o, xe3(o, u)) {
            var s = n.interleaved;
            s === null ? (l.next = l, Fi(n)) : (l.next = s.next, s.next = l), n.interleaved = l;
            return;
          }
        } catch {
        } finally {
        }
      t = ps(e, n, l, r), t !== null && (l = b(), Ce3(t, e, r, l), js(t, n, r));
    }
  }
  function Is(e) {
    var n = e.alternate;
    return e === R2 || n !== null && n === R2;
  }
  function Us(e, n) {
    mt = Mr = true;
    var t = e.pending;
    t === null ? n.next = n : (n.next = t.next, t.next = n), e.pending = n;
  }
  function js(e, n, t) {
    if ((t & 4194240) !== 0) {
      var r = n.lanes;
      r &= e.pendingLanes, t |= r, n.lanes = t, ki(e, t);
    }
  }
  var Dr = { readContext: ve3, useCallback: X2, useContext: X2, useEffect: X2, useImperativeHandle: X2, useInsertionEffect: X2, useLayoutEffect: X2, useMemo: X2, useReducer: X2, useRef: X2, useState: X2, useDebugValue: X2, useDeferredValue: X2, useTransition: X2, useMutableSource: X2, useSyncExternalStore: X2, useId: X2, unstable_isNewReconciler: false }, qc = { readContext: ve3, useCallback: function(e, n) {
    return _e3().memoizedState = [e, n === void 0 ? null : n], e;
  }, useContext: ve3, useEffect: Yu, useImperativeHandle: function(e, n, t) {
    return t = t != null ? t.concat([e]) : null, ar(4194308, 4, Ts.bind(null, n, e), t);
  }, useLayoutEffect: function(e, n) {
    return ar(4194308, 4, e, n);
  }, useInsertionEffect: function(e, n) {
    return ar(4, 2, e, n);
  }, useMemo: function(e, n) {
    var t = _e3();
    return n = n === void 0 ? null : n, e = e(), t.memoizedState = [e, n], e;
  }, useReducer: function(e, n, t) {
    var r = _e3();
    return n = t !== void 0 ? t(n) : n, r.memoizedState = r.baseState = n, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: n }, r.queue = e, e = e.dispatch = Zc.bind(null, R2, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var n = _e3();
    return e = { current: e }, n.memoizedState = e;
  }, useState: Ku, useDebugValue: Qi, useDeferredValue: function(e) {
    return _e3().memoizedState = e;
  }, useTransition: function() {
    var e = Ku(false), n = e[0];
    return e = Gc.bind(null, e[1]), _e3().memoizedState = e, [n, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, n, t) {
    var r = R2, l = _e3();
    if (D2) {
      if (t === void 0)
        throw Error(v(407));
      t = t();
    } else {
      if (t = n(), Q2 === null)
        throw Error(v(349));
      (yn & 30) !== 0 || Es(r, n, t);
    }
    l.memoizedState = t;
    var i = { value: t, getSnapshot: n };
    return l.queue = i, Yu(xs.bind(null, r, i, e), [e]), r.flags |= 2048, Ot(9, Cs.bind(null, r, i, t, n), void 0, null), t;
  }, useId: function() {
    var e = _e3(), n = Q2.identifierPrefix;
    if (D2) {
      var t = Oe2, r = De2;
      t = (r & ~(1 << 32 - Ee3(r) - 1)).toString(32) + t, n = ":" + n + "R" + t, t = Mt++, 0 < t && (n += "H" + t.toString(32)), n += ":";
    } else
      t = Xc++, n = ":" + n + "r" + t.toString(32) + ":";
    return e.memoizedState = n;
  }, unstable_isNewReconciler: false }, bc = { readContext: ve3, useCallback: Ds, useContext: ve3, useEffect: Wi, useImperativeHandle: Ms, useInsertionEffect: Ps, useLayoutEffect: Ls, useMemo: Os, useReducer: hl, useRef: zs, useState: function() {
    return hl(Dt);
  }, useDebugValue: Qi, useDeferredValue: function(e) {
    var n = ye3();
    return Rs(n, A2.memoizedState, e);
  }, useTransition: function() {
    var e = hl(Dt)[0], n = ye3().memoizedState;
    return [e, n];
  }, useMutableSource: Ss, useSyncExternalStore: ks, useId: Fs, unstable_isNewReconciler: false }, ef = { readContext: ve3, useCallback: Ds, useContext: ve3, useEffect: Wi, useImperativeHandle: Ms, useInsertionEffect: Ps, useLayoutEffect: Ls, useMemo: Os, useReducer: vl, useRef: zs, useState: function() {
    return vl(Dt);
  }, useDebugValue: Qi, useDeferredValue: function(e) {
    var n = ye3();
    return A2 === null ? n.memoizedState = e : Rs(n, A2.memoizedState, e);
  }, useTransition: function() {
    var e = vl(Dt)[0], n = ye3().memoizedState;
    return [e, n];
  }, useMutableSource: Ss, useSyncExternalStore: ks, useId: Fs, unstable_isNewReconciler: false };
  function Yn(e, n) {
    try {
      var t = "", r = n;
      do
        t += Ta(r), r = r.return;
      while (r);
      var l = t;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: n, stack: l, digest: null };
  }
  function yl(e, n, t) {
    return { value: e, source: null, stack: t ?? null, digest: n ?? null };
  }
  function bl(e, n) {
    try {
      console.error(n.value);
    } catch (t) {
      setTimeout(function() {
        throw t;
      });
    }
  }
  var nf = typeof WeakMap == "function" ? WeakMap : Map;
  function Vs(e, n, t) {
    t = Re2(-1, t), t.tag = 3, t.payload = { element: null };
    var r = n.value;
    return t.callback = function() {
      Rr || (Rr = true, ai = r), bl(e, n);
    }, t;
  }
  function As(e, n, t) {
    t = Re2(-1, t), t.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = n.value;
      t.payload = function() {
        return r(l);
      }, t.callback = function() {
        bl(e, n);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (t.callback = function() {
      bl(e, n), typeof r != "function" && (be3 === null ? be3 = /* @__PURE__ */ new Set([this]) : be3.add(this));
      var u = n.stack;
      this.componentDidCatch(n.value, { componentStack: u !== null ? u : "" });
    }), t;
  }
  function Xu(e, n, t) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new nf();
      var l = /* @__PURE__ */ new Set();
      r.set(n, l);
    } else
      l = r.get(n), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(n, l));
    l.has(t) || (l.add(t), e = vf.bind(null, e, n, t), n.then(e, e));
  }
  function Gu(e) {
    do {
      var n;
      if ((n = e.tag === 13) && (n = e.memoizedState, n = n !== null ? n.dehydrated !== null : true), n)
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Zu(e, n, t, r, l) {
    return (e.mode & 1) === 0 ? (e === n ? e.flags |= 65536 : (e.flags |= 128, t.flags |= 131072, t.flags &= -52805, t.tag === 1 && (t.alternate === null ? t.tag = 17 : (n = Re2(-1, 1), n.tag = 2, qe2(t, n, 1))), t.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var tf = Ve2.ReactCurrentOwner, te2 = false;
  function q2(e, n, t, r) {
    n.child = e === null ? gs(n, null, t, r) : $n(n, e.child, t, r);
  }
  function Ju(e, n, t, r, l) {
    t = t.render;
    var i = n.ref;
    return An(n, l), r = Bi(e, n, t, r, i, l), t = Hi(), e !== null && !te2 ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, je2(e, n, l)) : (D2 && t && Li(n), n.flags |= 1, q2(e, n, r, l), n.child);
  }
  function qu(e, n, t, r, l) {
    if (e === null) {
      var i = t.type;
      return typeof i == "function" && !qi(i) && i.defaultProps === void 0 && t.compare === null && t.defaultProps === void 0 ? (n.tag = 15, n.type = i, Bs(e, n, i, r, l)) : (e = pr(t.type, null, r, n, n.mode, l), e.ref = n.ref, e.return = n, n.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var u = i.memoizedProps;
      if (t = t.compare, t = t !== null ? t : Nt, t(u, r) && e.ref === n.ref)
        return je2(e, n, l);
    }
    return n.flags |= 1, e = nn(i, r), e.ref = n.ref, e.return = n, n.child = e;
  }
  function Bs(e, n, t, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Nt(i, r) && e.ref === n.ref)
        if (te2 = false, n.pendingProps = r = i, (e.lanes & l) !== 0)
          (e.flags & 131072) !== 0 && (te2 = true);
        else
          return n.lanes = e.lanes, je2(e, n, l);
    }
    return ei(e, n, t, r, l);
  }
  function Hs(e, n, t) {
    var r = n.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
      if ((n.mode & 1) === 0)
        n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, L2(Fn, ue), ue |= t;
      else {
        if ((t & 1073741824) === 0)
          return e = i !== null ? i.baseLanes | t : t, n.lanes = n.childLanes = 1073741824, n.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, n.updateQueue = null, L2(Fn, ue), ue |= e, null;
        n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : t, L2(Fn, ue), ue |= r;
      }
    else
      i !== null ? (r = i.baseLanes | t, n.memoizedState = null) : r = t, L2(Fn, ue), ue |= r;
    return q2(e, n, l, t), n.child;
  }
  function Ws(e, n) {
    var t = n.ref;
    (e === null && t !== null || e !== null && e.ref !== t) && (n.flags |= 512, n.flags |= 2097152);
  }
  function ei(e, n, t, r, l) {
    var i = le2(t) ? hn : J2.current;
    return i = Wn(n, i), An(n, l), t = Bi(e, n, t, r, i, l), r = Hi(), e !== null && !te2 ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, je2(e, n, l)) : (D2 && r && Li(n), n.flags |= 1, q2(e, n, t, l), n.child);
  }
  function bu(e, n, t, r, l) {
    if (le2(t)) {
      var i = true;
      xr(n);
    } else
      i = false;
    if (An(n, l), n.stateNode === null)
      cr(e, n), vs(n, t, r), ql(n, t, r, l), r = true;
    else if (e === null) {
      var u = n.stateNode, o = n.memoizedProps;
      u.props = o;
      var s = u.context, d = t.contextType;
      typeof d == "object" && d !== null ? d = ve3(d) : (d = le2(t) ? hn : J2.current, d = Wn(n, d));
      var m = t.getDerivedStateFromProps, h = typeof m == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      h || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (o !== r || s !== d) && Qu(n, u, r, d), We2 = false;
      var p = n.memoizedState;
      u.state = p, Lr(n, r, u, l), s = n.memoizedState, o !== r || p !== s || re.current || We2 ? (typeof m == "function" && (Jl(n, t, m, r), s = n.memoizedState), (o = We2 || Wu(n, t, o, r, p, s, d)) ? (h || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = r, n.memoizedState = s), u.props = r, u.state = s, u.context = d, r = o) : (typeof u.componentDidMount == "function" && (n.flags |= 4194308), r = false);
    } else {
      u = n.stateNode, ms(e, n), o = n.memoizedProps, d = n.type === n.elementType ? o : we3(n.type, o), u.props = d, h = n.pendingProps, p = u.context, s = t.contextType, typeof s == "object" && s !== null ? s = ve3(s) : (s = le2(t) ? hn : J2.current, s = Wn(n, s));
      var g = t.getDerivedStateFromProps;
      (m = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (o !== h || p !== s) && Qu(n, u, r, s), We2 = false, p = n.memoizedState, u.state = p, Lr(n, r, u, l);
      var S2 = n.memoizedState;
      o !== h || p !== S2 || re.current || We2 ? (typeof g == "function" && (Jl(n, t, g, r), S2 = n.memoizedState), (d = We2 || Wu(n, t, d, r, p, S2, s) || false) ? (m || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, S2, s), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, S2, s)), typeof u.componentDidUpdate == "function" && (n.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (n.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (n.flags |= 1024), n.memoizedProps = r, n.memoizedState = S2), u.props = r, u.state = S2, u.context = s, r = d) : (typeof u.componentDidUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (n.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && p === e.memoizedState || (n.flags |= 1024), r = false);
    }
    return ni(e, n, t, r, i, l);
  }
  function ni(e, n, t, r, l, i) {
    Ws(e, n);
    var u = (n.flags & 128) !== 0;
    if (!r && !u)
      return l && ju(n, t, false), je2(e, n, i);
    r = n.stateNode, tf.current = n;
    var o = u && typeof t.getDerivedStateFromError != "function" ? null : r.render();
    return n.flags |= 1, e !== null && u ? (n.child = $n(n, e.child, null, i), n.child = $n(n, null, o, i)) : q2(e, n, o, i), n.memoizedState = r.state, l && ju(n, t, true), n.child;
  }
  function Qs(e) {
    var n = e.stateNode;
    n.pendingContext ? Uu(e, n.pendingContext, n.pendingContext !== n.context) : n.context && Uu(e, n.context, false), Ui(e, n.containerInfo);
  }
  function eo(e, n, t, r, l) {
    return Qn(), Mi(l), n.flags |= 256, q2(e, n, t, r), n.child;
  }
  var ti = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ri(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function $s(e, n, t) {
    var r = n.pendingProps, l = O.current, i = false, u = (n.flags & 128) !== 0, o;
    if ((o = u) || (o = e !== null && e.memoizedState === null ? false : (l & 2) !== 0), o ? (i = true, n.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), L2(O, l & 1), e === null)
      return Gl(n), e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((n.mode & 1) === 0 ? n.lanes = 1 : e.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824, null) : (u = r.children, e = r.fallback, i ? (r = n.mode, i = n.child, u = { mode: "hidden", children: u }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = u) : i = Xr(u, r, 0, null), e = mn(e, r, t, null), i.return = n, e.return = n, i.sibling = e, n.child = i, n.child.memoizedState = ri(t), n.memoizedState = ti, e) : $i(n, u));
    if (l = e.memoizedState, l !== null && (o = l.dehydrated, o !== null))
      return rf(e, n, u, r, o, l, t);
    if (i) {
      i = r.fallback, u = n.mode, l = e.child, o = l.sibling;
      var s = { mode: "hidden", children: r.children };
      return (u & 1) === 0 && n.child !== l ? (r = n.child, r.childLanes = 0, r.pendingProps = s, n.deletions = null) : (r = nn(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), o !== null ? i = nn(o, i) : (i = mn(i, u, t, null), i.flags |= 2), i.return = n, r.return = n, r.sibling = i, n.child = r, r = i, i = n.child, u = e.child.memoizedState, u = u === null ? ri(t) : { baseLanes: u.baseLanes | t, cachePool: null, transitions: u.transitions }, i.memoizedState = u, i.childLanes = e.childLanes & ~t, n.memoizedState = ti, r;
    }
    return i = e.child, e = i.sibling, r = nn(i, { mode: "visible", children: r.children }), (n.mode & 1) === 0 && (r.lanes = t), r.return = n, r.sibling = null, e !== null && (t = n.deletions, t === null ? (n.deletions = [e], n.flags |= 16) : t.push(e)), n.child = r, n.memoizedState = null, r;
  }
  function $i(e, n) {
    return n = Xr({ mode: "visible", children: n }, e.mode, 0, null), n.return = e, e.child = n;
  }
  function nr(e, n, t, r) {
    return r !== null && Mi(r), $n(n, e.child, null, t), e = $i(n, n.pendingProps.children), e.flags |= 2, n.memoizedState = null, e;
  }
  function rf(e, n, t, r, l, i, u) {
    if (t)
      return n.flags & 256 ? (n.flags &= -257, r = yl(Error(v(422))), nr(e, n, u, r)) : n.memoizedState !== null ? (n.child = e.child, n.flags |= 128, null) : (i = r.fallback, l = n.mode, r = Xr({ mode: "visible", children: r.children }, l, 0, null), i = mn(i, l, u, null), i.flags |= 2, r.return = n, i.return = n, r.sibling = i, n.child = r, (n.mode & 1) !== 0 && $n(n, e.child, null, u), n.child.memoizedState = ri(u), n.memoizedState = ti, i);
    if ((n.mode & 1) === 0)
      return nr(e, n, u, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r)
        var o = r.dgst;
      return r = o, i = Error(v(419)), r = yl(i, r, void 0), nr(e, n, u, r);
    }
    if (o = (u & e.childLanes) !== 0, te2 || o) {
      if (r = Q2, r !== null) {
        switch (u & -u) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (r.suspendedLanes | u)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Ue2(e, l), Ce3(r, e, l, -1));
      }
      return Ji(), r = yl(Error(v(421))), nr(e, n, u, r);
    }
    return l.data === "$?" ? (n.flags |= 128, n.child = e.child, n = yf.bind(null, e), l._reactRetry = n, null) : (e = i.treeContext, oe2 = Je(l.nextSibling), se2 = n, D2 = true, ke3 = null, e !== null && (de3[pe3++] = De2, de3[pe3++] = Oe2, de3[pe3++] = vn, De2 = e.id, Oe2 = e.overflow, vn = n), n = $i(n, r.children), n.flags |= 4096, n);
  }
  function no(e, n, t) {
    e.lanes |= n;
    var r = e.alternate;
    r !== null && (r.lanes |= n), Zl(e.return, n, t);
  }
  function gl(e, n, t, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: n, rendering: null, renderingStartTime: 0, last: r, tail: t, tailMode: l } : (i.isBackwards = n, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = t, i.tailMode = l);
  }
  function Ks(e, n, t) {
    var r = n.pendingProps, l = r.revealOrder, i = r.tail;
    if (q2(e, n, r.children, t), r = O.current, (r & 2) !== 0)
      r = r & 1 | 2, n.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e:
          for (e = n.child; e !== null; ) {
            if (e.tag === 13)
              e.memoizedState !== null && no(e, t, n);
            else if (e.tag === 19)
              no(e, t, n);
            else if (e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === n)
              break e;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === n)
                break e;
              e = e.return;
            }
            e.sibling.return = e.return, e = e.sibling;
          }
      r &= 1;
    }
    if (L2(O, r), (n.mode & 1) === 0)
      n.memoizedState = null;
    else
      switch (l) {
        case "forwards":
          for (t = n.child, l = null; t !== null; )
            e = t.alternate, e !== null && Tr(e) === null && (l = t), t = t.sibling;
          t = l, t === null ? (l = n.child, n.child = null) : (l = t.sibling, t.sibling = null), gl(n, false, l, t, i);
          break;
        case "backwards":
          for (t = null, l = n.child, n.child = null; l !== null; ) {
            if (e = l.alternate, e !== null && Tr(e) === null) {
              n.child = l;
              break;
            }
            e = l.sibling, l.sibling = t, t = l, l = e;
          }
          gl(n, true, t, null, i);
          break;
        case "together":
          gl(n, false, null, null, void 0);
          break;
        default:
          n.memoizedState = null;
      }
    return n.child;
  }
  function cr(e, n) {
    (n.mode & 1) === 0 && e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2);
  }
  function je2(e, n, t) {
    if (e !== null && (n.dependencies = e.dependencies), gn |= n.lanes, (t & n.childLanes) === 0)
      return null;
    if (e !== null && n.child !== e.child)
      throw Error(v(153));
    if (n.child !== null) {
      for (e = n.child, t = nn(e, e.pendingProps), n.child = t, t.return = n; e.sibling !== null; )
        e = e.sibling, t = t.sibling = nn(e, e.pendingProps), t.return = n;
      t.sibling = null;
    }
    return n.child;
  }
  function lf(e, n, t) {
    switch (n.tag) {
      case 3:
        Qs(n), Qn();
        break;
      case 5:
        ws(n);
        break;
      case 1:
        le2(n.type) && xr(n);
        break;
      case 4:
        Ui(n, n.stateNode.containerInfo);
        break;
      case 10:
        var r = n.type._context, l = n.memoizedProps.value;
        L2(zr, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = n.memoizedState, r !== null)
          return r.dehydrated !== null ? (L2(O, O.current & 1), n.flags |= 128, null) : (t & n.child.childLanes) !== 0 ? $s(e, n, t) : (L2(O, O.current & 1), e = je2(e, n, t), e !== null ? e.sibling : null);
        L2(O, O.current & 1);
        break;
      case 19:
        if (r = (t & n.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r)
            return Ks(e, n, t);
          n.flags |= 128;
        }
        if (l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), L2(O, O.current), r)
          break;
        return null;
      case 22:
      case 23:
        return n.lanes = 0, Hs(e, n, t);
    }
    return je2(e, n, t);
  }
  var Ys, li, Xs, Gs;
  Ys = function(e, n) {
    for (var t = n.child; t !== null; ) {
      if (t.tag === 5 || t.tag === 6)
        e.appendChild(t.stateNode);
      else if (t.tag !== 4 && t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === n)
        break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === n)
          return;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  };
  li = function() {
  };
  Xs = function(e, n, t, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = n.stateNode, dn(Le2.current);
      var i = null;
      switch (t) {
        case "input":
          l = _l(e, l), r = _l(e, r), i = [];
          break;
        case "select":
          l = F2({}, l, { value: void 0 }), r = F2({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Ll(e, l), r = Ll(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Er);
      }
      Ml(t, r);
      var u;
      t = null;
      for (d in l)
        if (!r.hasOwnProperty(d) && l.hasOwnProperty(d) && l[d] != null)
          if (d === "style") {
            var o = l[d];
            for (u in o)
              o.hasOwnProperty(u) && (t || (t = {}), t[u] = "");
          } else
            d !== "dangerouslySetInnerHTML" && d !== "children" && d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (gt.hasOwnProperty(d) ? i || (i = []) : (i = i || []).push(d, null));
      for (d in r) {
        var s = r[d];
        if (o = l?.[d], r.hasOwnProperty(d) && s !== o && (s != null || o != null))
          if (d === "style")
            if (o) {
              for (u in o)
                !o.hasOwnProperty(u) || s && s.hasOwnProperty(u) || (t || (t = {}), t[u] = "");
              for (u in s)
                s.hasOwnProperty(u) && o[u] !== s[u] && (t || (t = {}), t[u] = s[u]);
            } else
              t || (i || (i = []), i.push(d, t)), t = s;
          else
            d === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, o = o ? o.__html : void 0, s != null && o !== s && (i = i || []).push(d, s)) : d === "children" ? typeof s != "string" && typeof s != "number" || (i = i || []).push(d, "" + s) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && (gt.hasOwnProperty(d) ? (s != null && d === "onScroll" && T("scroll", e), i || o === s || (i = [])) : (i = i || []).push(d, s));
      }
      t && (i = i || []).push("style", t);
      var d = i;
      (n.updateQueue = d) && (n.flags |= 4);
    }
  };
  Gs = function(e, n, t, r) {
    t !== r && (n.flags |= 4);
  };
  function tt(e, n) {
    if (!D2)
      switch (e.tailMode) {
        case "hidden":
          n = e.tail;
          for (var t = null; n !== null; )
            n.alternate !== null && (t = n), n = n.sibling;
          t === null ? e.tail = null : t.sibling = null;
          break;
        case "collapsed":
          t = e.tail;
          for (var r = null; t !== null; )
            t.alternate !== null && (r = t), t = t.sibling;
          r === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
      }
  }
  function G(e) {
    var n = e.alternate !== null && e.alternate.child === e.child, t = 0, r = 0;
    if (n)
      for (var l = e.child; l !== null; )
        t |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else
      for (l = e.child; l !== null; )
        t |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = t, n;
  }
  function uf(e, n, t) {
    var r = n.pendingProps;
    switch (Ti(n), n.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return G(n), null;
      case 1:
        return le2(n.type) && Cr(), G(n), null;
      case 3:
        return r = n.stateNode, Kn(), M2(re), M2(J2), Vi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (bt(n) ? n.flags |= 4 : e === null || e.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, ke3 !== null && (di(ke3), ke3 = null))), li(e, n), G(n), null;
      case 5:
        ji(n);
        var l = dn(Tt.current);
        if (t = n.type, e !== null && n.stateNode != null)
          Xs(e, n, t, r, l), e.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);
        else {
          if (!r) {
            if (n.stateNode === null)
              throw Error(v(166));
            return G(n), null;
          }
          if (e = dn(Le2.current), bt(n)) {
            r = n.stateNode, t = n.type;
            var i = n.memoizedProps;
            switch (r[ze2] = n, r[Pt] = i, e = (n.mode & 1) !== 0, t) {
              case "dialog":
                T("cancel", r), T("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                T("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < st.length; l++)
                  T(st[l], r);
                break;
              case "source":
                T("error", r);
                break;
              case "img":
              case "image":
              case "link":
                T("error", r), T("load", r);
                break;
              case "details":
                T("toggle", r);
                break;
              case "input":
                au(r, i), T("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, T("invalid", r);
                break;
              case "textarea":
                fu(r, i), T("invalid", r);
            }
            Ml(t, i), l = null;
            for (var u in i)
              if (i.hasOwnProperty(u)) {
                var o = i[u];
                u === "children" ? typeof o == "string" ? r.textContent !== o && (i.suppressHydrationWarning !== true && qt(r.textContent, o, e), l = ["children", o]) : typeof o == "number" && r.textContent !== "" + o && (i.suppressHydrationWarning !== true && qt(r.textContent, o, e), l = ["children", "" + o]) : gt.hasOwnProperty(u) && o != null && u === "onScroll" && T("scroll", r);
              }
            switch (t) {
              case "input":
                At(r), cu(r, i, true);
                break;
              case "textarea":
                At(r), du(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = Er);
            }
            r = l, n.updateQueue = r, r !== null && (n.flags |= 4);
          } else {
            u = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Eo(t)), e === "http://www.w3.org/1999/xhtml" ? t === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(t, { is: r.is }) : (e = u.createElement(t), t === "select" && (u = e, r.multiple ? u.multiple = true : r.size && (u.size = r.size))) : e = u.createElementNS(e, t), e[ze2] = n, e[Pt] = r, Ys(e, n, false, false), n.stateNode = e;
            e: {
              switch (u = Dl(t, r), t) {
                case "dialog":
                  T("cancel", e), T("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  T("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < st.length; l++)
                    T(st[l], e);
                  l = r;
                  break;
                case "source":
                  T("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  T("error", e), T("load", e), l = r;
                  break;
                case "details":
                  T("toggle", e), l = r;
                  break;
                case "input":
                  au(e, r), l = _l(e, r), T("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = F2({}, r, { value: void 0 }), T("invalid", e);
                  break;
                case "textarea":
                  fu(e, r), l = Ll(e, r), T("invalid", e);
                  break;
                default:
                  l = r;
              }
              Ml(t, l), o = l;
              for (i in o)
                if (o.hasOwnProperty(i)) {
                  var s = o[i];
                  i === "style" ? No(e, s) : i === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Co(e, s)) : i === "children" ? typeof s == "string" ? (t !== "textarea" || s !== "") && wt(e, s) : typeof s == "number" && wt(e, "" + s) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (gt.hasOwnProperty(i) ? s != null && i === "onScroll" && T("scroll", e) : s != null && hi(e, i, s, u));
                }
              switch (t) {
                case "input":
                  At(e), cu(e, r, false);
                  break;
                case "textarea":
                  At(e), du(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + tn(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? In(e, !!r.multiple, i, false) : r.defaultValue != null && In(e, !!r.multiple, r.defaultValue, true);
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Er);
              }
              switch (t) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = true;
                  break e;
                default:
                  r = false;
              }
            }
            r && (n.flags |= 4);
          }
          n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
        }
        return G(n), null;
      case 6:
        if (e && n.stateNode != null)
          Gs(e, n, e.memoizedProps, r);
        else {
          if (typeof r != "string" && n.stateNode === null)
            throw Error(v(166));
          if (t = dn(Tt.current), dn(Le2.current), bt(n)) {
            if (r = n.stateNode, t = n.memoizedProps, r[ze2] = n, (i = r.nodeValue !== t) && (e = se2, e !== null))
              switch (e.tag) {
                case 3:
                  qt(r.nodeValue, t, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== true && qt(r.nodeValue, t, (e.mode & 1) !== 0);
              }
            i && (n.flags |= 4);
          } else
            r = (t.nodeType === 9 ? t : t.ownerDocument).createTextNode(r), r[ze2] = n, n.stateNode = r;
        }
        return G(n), null;
      case 13:
        if (M2(O), r = n.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (D2 && oe2 !== null && (n.mode & 1) !== 0 && (n.flags & 128) === 0)
            ds(), Qn(), n.flags |= 98560, i = false;
          else if (i = bt(n), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i)
                throw Error(v(318));
              if (i = n.memoizedState, i = i !== null ? i.dehydrated : null, !i)
                throw Error(v(317));
              i[ze2] = n;
            } else
              Qn(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            G(n), i = false;
          } else
            ke3 !== null && (di(ke3), ke3 = null), i = true;
          if (!i)
            return n.flags & 65536 ? n : null;
        }
        return (n.flags & 128) !== 0 ? (n.lanes = t, n) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (n.child.flags |= 8192, (n.mode & 1) !== 0 && (e === null || (O.current & 1) !== 0 ? B3 === 0 && (B3 = 3) : Ji())), n.updateQueue !== null && (n.flags |= 4), G(n), null);
      case 4:
        return Kn(), li(e, n), e === null && _t(n.stateNode.containerInfo), G(n), null;
      case 10:
        return Ri(n.type._context), G(n), null;
      case 17:
        return le2(n.type) && Cr(), G(n), null;
      case 19:
        if (M2(O), i = n.memoizedState, i === null)
          return G(n), null;
        if (r = (n.flags & 128) !== 0, u = i.rendering, u === null)
          if (r)
            tt(i, false);
          else {
            if (B3 !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = n.child; e !== null; ) {
                if (u = Tr(e), u !== null) {
                  for (n.flags |= 128, tt(i, false), r = u.updateQueue, r !== null && (n.updateQueue = r, n.flags |= 4), n.subtreeFlags = 0, r = t, t = n.child; t !== null; )
                    i = t, e = r, i.flags &= 14680066, u = i.alternate, u === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = u.childLanes, i.lanes = u.lanes, i.child = u.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = u.memoizedProps, i.memoizedState = u.memoizedState, i.updateQueue = u.updateQueue, i.type = u.type, e = u.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), t = t.sibling;
                  return L2(O, O.current & 1 | 2), n.child;
                }
                e = e.sibling;
              }
            i.tail !== null && j() > Xn && (n.flags |= 128, r = true, tt(i, false), n.lanes = 4194304);
          }
        else {
          if (!r)
            if (e = Tr(u), e !== null) {
              if (n.flags |= 128, r = true, t = e.updateQueue, t !== null && (n.updateQueue = t, n.flags |= 4), tt(i, true), i.tail === null && i.tailMode === "hidden" && !u.alternate && !D2)
                return G(n), null;
            } else
              2 * j() - i.renderingStartTime > Xn && t !== 1073741824 && (n.flags |= 128, r = true, tt(i, false), n.lanes = 4194304);
          i.isBackwards ? (u.sibling = n.child, n.child = u) : (t = i.last, t !== null ? t.sibling = u : n.child = u, i.last = u);
        }
        return i.tail !== null ? (n = i.tail, i.rendering = n, i.tail = n.sibling, i.renderingStartTime = j(), n.sibling = null, t = O.current, L2(O, r ? t & 1 | 2 : t & 1), n) : (G(n), null);
      case 22:
      case 23:
        return Zi(), r = n.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (n.flags |= 8192), r && (n.mode & 1) !== 0 ? (ue & 1073741824) !== 0 && (G(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : G(n), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(v(156, n.tag));
  }
  function of(e, n) {
    switch (Ti(n), n.tag) {
      case 1:
        return le2(n.type) && Cr(), e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 3:
        return Kn(), M2(re), M2(J2), Vi(), e = n.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (n.flags = e & -65537 | 128, n) : null;
      case 5:
        return ji(n), null;
      case 13:
        if (M2(O), e = n.memoizedState, e !== null && e.dehydrated !== null) {
          if (n.alternate === null)
            throw Error(v(340));
          Qn();
        }
        return e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 19:
        return M2(O), null;
      case 4:
        return Kn(), null;
      case 10:
        return Ri(n.type._context), null;
      case 22:
      case 23:
        return Zi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var tr = false, Z2 = false, sf = typeof WeakSet == "function" ? WeakSet : Set, w = null;
  function Rn(e, n) {
    var t = e.ref;
    if (t !== null)
      if (typeof t == "function")
        try {
          t(null);
        } catch (r) {
          I(e, n, r);
        }
      else
        t.current = null;
  }
  function ii(e, n, t) {
    try {
      t();
    } catch (r) {
      I(e, n, r);
    }
  }
  var to = false;
  function af(e, n) {
    if (Hl = wr, e = bo(), Pi(e)) {
      if ("selectionStart" in e)
        var t = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          t = (t = e.ownerDocument) && t.defaultView || window;
          var r = t.getSelection && t.getSelection();
          if (r && r.rangeCount !== 0) {
            t = r.anchorNode;
            var l = r.anchorOffset, i = r.focusNode;
            r = r.focusOffset;
            try {
              t.nodeType, i.nodeType;
            } catch {
              t = null;
              break e;
            }
            var u = 0, o = -1, s = -1, d = 0, m = 0, h = e, p = null;
            n:
              for (; ; ) {
                for (var g; h !== t || l !== 0 && h.nodeType !== 3 || (o = u + l), h !== i || r !== 0 && h.nodeType !== 3 || (s = u + r), h.nodeType === 3 && (u += h.nodeValue.length), (g = h.firstChild) !== null; )
                  p = h, h = g;
                for (; ; ) {
                  if (h === e)
                    break n;
                  if (p === t && ++d === l && (o = u), p === i && ++m === r && (s = u), (g = h.nextSibling) !== null)
                    break;
                  h = p, p = h.parentNode;
                }
                h = g;
              }
            t = o === -1 || s === -1 ? null : { start: o, end: s };
          } else
            t = null;
        }
      t = t || { start: 0, end: 0 };
    } else
      t = null;
    for (Wl = { focusedElem: e, selectionRange: t }, wr = false, w = n; w !== null; )
      if (n = w, e = n.child, (n.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = n, w = e;
      else
        for (; w !== null; ) {
          n = w;
          try {
            var S2 = n.alternate;
            if ((n.flags & 1024) !== 0)
              switch (n.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (S2 !== null) {
                    var k2 = S2.memoizedProps, U3 = S2.memoizedState, c = n.stateNode, a = c.getSnapshotBeforeUpdate(n.elementType === n.type ? k2 : we3(n.type, k2), U3);
                    c.__reactInternalSnapshotBeforeUpdate = a;
                  }
                  break;
                case 3:
                  var f = n.stateNode.containerInfo;
                  f.nodeType === 1 ? f.textContent = "" : f.nodeType === 9 && f.documentElement && f.removeChild(f.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(v(163));
              }
          } catch (y) {
            I(n, n.return, y);
          }
          if (e = n.sibling, e !== null) {
            e.return = n.return, w = e;
            break;
          }
          w = n.return;
        }
    return S2 = to, to = false, S2;
  }
  function ht(e, n, t) {
    var r = n.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && ii(n, t, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Kr(e, n) {
    if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
      var t = n = n.next;
      do {
        if ((t.tag & e) === e) {
          var r = t.create;
          t.destroy = r();
        }
        t = t.next;
      } while (t !== n);
    }
  }
  function ui(e) {
    var n = e.ref;
    if (n !== null) {
      var t = e.stateNode;
      switch (e.tag) {
        case 5:
          e = t;
          break;
        default:
          e = t;
      }
      typeof n == "function" ? n(e) : n.current = e;
    }
  }
  function Zs(e) {
    var n = e.alternate;
    n !== null && (e.alternate = null, Zs(n)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (n = e.stateNode, n !== null && (delete n[ze2], delete n[Pt], delete n[Kl], delete n[Qc], delete n[$c])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Js(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ro(e) {
    e:
      for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || Js(e.return))
            return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.flags & 2 || e.child === null || e.tag === 4)
            continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2))
          return e.stateNode;
      }
  }
  function oi(e, n, t) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, n ? t.nodeType === 8 ? t.parentNode.insertBefore(e, n) : t.insertBefore(e, n) : (t.nodeType === 8 ? (n = t.parentNode, n.insertBefore(e, t)) : (n = t, n.appendChild(e)), t = t._reactRootContainer, t != null || n.onclick !== null || (n.onclick = Er));
    else if (r !== 4 && (e = e.child, e !== null))
      for (oi(e, n, t), e = e.sibling; e !== null; )
        oi(e, n, t), e = e.sibling;
  }
  function si(e, n, t) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, n ? t.insertBefore(e, n) : t.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null))
      for (si(e, n, t), e = e.sibling; e !== null; )
        si(e, n, t), e = e.sibling;
  }
  var $2 = null, Se2 = false;
  function Be2(e, n, t) {
    for (t = t.child; t !== null; )
      qs(e, n, t), t = t.sibling;
  }
  function qs(e, n, t) {
    if (Pe3 && typeof Pe3.onCommitFiberUnmount == "function")
      try {
        Pe3.onCommitFiberUnmount(jr, t);
      } catch {
      }
    switch (t.tag) {
      case 5:
        Z2 || Rn(t, n);
      case 6:
        var r = $2, l = Se2;
        $2 = null, Be2(e, n, t), $2 = r, Se2 = l, $2 !== null && (Se2 ? (e = $2, t = t.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(t) : e.removeChild(t)) : $2.removeChild(t.stateNode));
        break;
      case 18:
        $2 !== null && (Se2 ? (e = $2, t = t.stateNode, e.nodeType === 8 ? fl(e.parentNode, t) : e.nodeType === 1 && fl(e, t), Ct(e)) : fl($2, t.stateNode));
        break;
      case 4:
        r = $2, l = Se2, $2 = t.stateNode.containerInfo, Se2 = true, Be2(e, n, t), $2 = r, Se2 = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Z2 && (r = t.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, u = i.destroy;
            i = i.tag, u !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && ii(t, n, u), l = l.next;
          } while (l !== r);
        }
        Be2(e, n, t);
        break;
      case 1:
        if (!Z2 && (Rn(t, n), r = t.stateNode, typeof r.componentWillUnmount == "function"))
          try {
            r.props = t.memoizedProps, r.state = t.memoizedState, r.componentWillUnmount();
          } catch (o) {
            I(t, n, o);
          }
        Be2(e, n, t);
        break;
      case 21:
        Be2(e, n, t);
        break;
      case 22:
        t.mode & 1 ? (Z2 = (r = Z2) || t.memoizedState !== null, Be2(e, n, t), Z2 = r) : Be2(e, n, t);
        break;
      default:
        Be2(e, n, t);
    }
  }
  function lo(e) {
    var n = e.updateQueue;
    if (n !== null) {
      e.updateQueue = null;
      var t = e.stateNode;
      t === null && (t = e.stateNode = new sf()), n.forEach(function(r) {
        var l = gf.bind(null, e, r);
        t.has(r) || (t.add(r), r.then(l, l));
      });
    }
  }
  function ge3(e, n) {
    var t = n.deletions;
    if (t !== null)
      for (var r = 0; r < t.length; r++) {
        var l = t[r];
        try {
          var i = e, u = n, o = u;
          e:
            for (; o !== null; ) {
              switch (o.tag) {
                case 5:
                  $2 = o.stateNode, Se2 = false;
                  break e;
                case 3:
                  $2 = o.stateNode.containerInfo, Se2 = true;
                  break e;
                case 4:
                  $2 = o.stateNode.containerInfo, Se2 = true;
                  break e;
              }
              o = o.return;
            }
          if ($2 === null)
            throw Error(v(160));
          qs(i, u, l), $2 = null, Se2 = false;
          var s = l.alternate;
          s !== null && (s.return = null), l.return = null;
        } catch (d) {
          I(l, n, d);
        }
      }
    if (n.subtreeFlags & 12854)
      for (n = n.child; n !== null; )
        bs(n, e), n = n.sibling;
  }
  function bs(e, n) {
    var t = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ge3(n, e), Ne2(e), r & 4) {
          try {
            ht(3, e, e.return), Kr(3, e);
          } catch (k2) {
            I(e, e.return, k2);
          }
          try {
            ht(5, e, e.return);
          } catch (k2) {
            I(e, e.return, k2);
          }
        }
        break;
      case 1:
        ge3(n, e), Ne2(e), r & 512 && t !== null && Rn(t, t.return);
        break;
      case 5:
        if (ge3(n, e), Ne2(e), r & 512 && t !== null && Rn(t, t.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            wt(l, "");
          } catch (k2) {
            I(e, e.return, k2);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, u = t !== null ? t.memoizedProps : i, o = e.type, s = e.updateQueue;
          if (e.updateQueue = null, s !== null)
            try {
              o === "input" && i.type === "radio" && i.name != null && So(l, i), Dl(o, u);
              var d = Dl(o, i);
              for (u = 0; u < s.length; u += 2) {
                var m = s[u], h = s[u + 1];
                m === "style" ? No(l, h) : m === "dangerouslySetInnerHTML" ? Co(l, h) : m === "children" ? wt(l, h) : hi(l, m, h, d);
              }
              switch (o) {
                case "input":
                  zl(l, i);
                  break;
                case "textarea":
                  ko(l, i);
                  break;
                case "select":
                  var p = l._wrapperState.wasMultiple;
                  l._wrapperState.wasMultiple = !!i.multiple;
                  var g = i.value;
                  g != null ? In(l, !!i.multiple, g, false) : p !== !!i.multiple && (i.defaultValue != null ? In(l, !!i.multiple, i.defaultValue, true) : In(l, !!i.multiple, i.multiple ? [] : "", false));
              }
              l[Pt] = i;
            } catch (k2) {
              I(e, e.return, k2);
            }
        }
        break;
      case 6:
        if (ge3(n, e), Ne2(e), r & 4) {
          if (e.stateNode === null)
            throw Error(v(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (k2) {
            I(e, e.return, k2);
          }
        }
        break;
      case 3:
        if (ge3(n, e), Ne2(e), r & 4 && t !== null && t.memoizedState.isDehydrated)
          try {
            Ct(n.containerInfo);
          } catch (k2) {
            I(e, e.return, k2);
          }
        break;
      case 4:
        ge3(n, e), Ne2(e);
        break;
      case 13:
        ge3(n, e), Ne2(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Xi = j())), r & 4 && lo(e);
        break;
      case 22:
        if (m = t !== null && t.memoizedState !== null, e.mode & 1 ? (Z2 = (d = Z2) || m, ge3(n, e), Z2 = d) : ge3(n, e), Ne2(e), r & 8192) {
          if (d = e.memoizedState !== null, (e.stateNode.isHidden = d) && !m && (e.mode & 1) !== 0)
            for (w = e, m = e.child; m !== null; ) {
              for (h = w = m; w !== null; ) {
                switch (p = w, g = p.child, p.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    ht(4, p, p.return);
                    break;
                  case 1:
                    Rn(p, p.return);
                    var S2 = p.stateNode;
                    if (typeof S2.componentWillUnmount == "function") {
                      r = p, t = p.return;
                      try {
                        n = r, S2.props = n.memoizedProps, S2.state = n.memoizedState, S2.componentWillUnmount();
                      } catch (k2) {
                        I(r, t, k2);
                      }
                    }
                    break;
                  case 5:
                    Rn(p, p.return);
                    break;
                  case 22:
                    if (p.memoizedState !== null) {
                      uo(h);
                      continue;
                    }
                }
                g !== null ? (g.return = p, w = g) : uo(h);
              }
              m = m.sibling;
            }
          e:
            for (m = null, h = e; ; ) {
              if (h.tag === 5) {
                if (m === null) {
                  m = h;
                  try {
                    l = h.stateNode, d ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (o = h.stateNode, s = h.memoizedProps.style, u = s != null && s.hasOwnProperty("display") ? s.display : null, o.style.display = xo("display", u));
                  } catch (k2) {
                    I(e, e.return, k2);
                  }
                }
              } else if (h.tag === 6) {
                if (m === null)
                  try {
                    h.stateNode.nodeValue = d ? "" : h.memoizedProps;
                  } catch (k2) {
                    I(e, e.return, k2);
                  }
              } else if ((h.tag !== 22 && h.tag !== 23 || h.memoizedState === null || h === e) && h.child !== null) {
                h.child.return = h, h = h.child;
                continue;
              }
              if (h === e)
                break e;
              for (; h.sibling === null; ) {
                if (h.return === null || h.return === e)
                  break e;
                m === h && (m = null), h = h.return;
              }
              m === h && (m = null), h.sibling.return = h.return, h = h.sibling;
            }
        }
        break;
      case 19:
        ge3(n, e), Ne2(e), r & 4 && lo(e);
        break;
      case 21:
        break;
      default:
        ge3(n, e), Ne2(e);
    }
  }
  function Ne2(e) {
    var n = e.flags;
    if (n & 2) {
      try {
        e: {
          for (var t = e.return; t !== null; ) {
            if (Js(t)) {
              var r = t;
              break e;
            }
            t = t.return;
          }
          throw Error(v(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (wt(l, ""), r.flags &= -33);
            var i = ro(e);
            si(e, i, l);
            break;
          case 3:
          case 4:
            var u = r.stateNode.containerInfo, o = ro(e);
            oi(e, o, u);
            break;
          default:
            throw Error(v(161));
        }
      } catch (s) {
        I(e, e.return, s);
      }
      e.flags &= -3;
    }
    n & 4096 && (e.flags &= -4097);
  }
  function cf(e, n, t) {
    w = e, ea(e, n, t);
  }
  function ea(e, n, t) {
    for (var r = (e.mode & 1) !== 0; w !== null; ) {
      var l = w, i = l.child;
      if (l.tag === 22 && r) {
        var u = l.memoizedState !== null || tr;
        if (!u) {
          var o = l.alternate, s = o !== null && o.memoizedState !== null || Z2;
          o = tr;
          var d = Z2;
          if (tr = u, (Z2 = s) && !d)
            for (w = l; w !== null; )
              u = w, s = u.child, u.tag === 22 && u.memoizedState !== null ? oo(l) : s !== null ? (s.return = u, w = s) : oo(l);
          for (; i !== null; )
            w = i, ea(i, n, t), i = i.sibling;
          w = l, tr = o, Z2 = d;
        }
        io(e, n, t);
      } else
        (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, w = i) : io(e, n, t);
    }
  }
  function io(e) {
    for (; w !== null; ) {
      var n = w;
      if ((n.flags & 8772) !== 0) {
        var t = n.alternate;
        try {
          if ((n.flags & 8772) !== 0)
            switch (n.tag) {
              case 0:
              case 11:
              case 15:
                Z2 || Kr(5, n);
                break;
              case 1:
                var r = n.stateNode;
                if (n.flags & 4 && !Z2)
                  if (t === null)
                    r.componentDidMount();
                  else {
                    var l = n.elementType === n.type ? t.memoizedProps : we3(n.type, t.memoizedProps);
                    r.componentDidUpdate(l, t.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                  }
                var i = n.updateQueue;
                i !== null && Hu(n, i, r);
                break;
              case 3:
                var u = n.updateQueue;
                if (u !== null) {
                  if (t = null, n.child !== null)
                    switch (n.child.tag) {
                      case 5:
                        t = n.child.stateNode;
                        break;
                      case 1:
                        t = n.child.stateNode;
                    }
                  Hu(n, u, t);
                }
                break;
              case 5:
                var o = n.stateNode;
                if (t === null && n.flags & 4) {
                  t = o;
                  var s = n.memoizedProps;
                  switch (n.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      s.autoFocus && t.focus();
                      break;
                    case "img":
                      s.src && (t.src = s.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (n.memoizedState === null) {
                  var d = n.alternate;
                  if (d !== null) {
                    var m = d.memoizedState;
                    if (m !== null) {
                      var h = m.dehydrated;
                      h !== null && Ct(h);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(v(163));
            }
          Z2 || n.flags & 512 && ui(n);
        } catch (p) {
          I(n, n.return, p);
        }
      }
      if (n === e) {
        w = null;
        break;
      }
      if (t = n.sibling, t !== null) {
        t.return = n.return, w = t;
        break;
      }
      w = n.return;
    }
  }
  function uo(e) {
    for (; w !== null; ) {
      var n = w;
      if (n === e) {
        w = null;
        break;
      }
      var t = n.sibling;
      if (t !== null) {
        t.return = n.return, w = t;
        break;
      }
      w = n.return;
    }
  }
  function oo(e) {
    for (; w !== null; ) {
      var n = w;
      try {
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            var t = n.return;
            try {
              Kr(4, n);
            } catch (s) {
              I(n, t, s);
            }
            break;
          case 1:
            var r = n.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = n.return;
              try {
                r.componentDidMount();
              } catch (s) {
                I(n, l, s);
              }
            }
            var i = n.return;
            try {
              ui(n);
            } catch (s) {
              I(n, i, s);
            }
            break;
          case 5:
            var u = n.return;
            try {
              ui(n);
            } catch (s) {
              I(n, u, s);
            }
        }
      } catch (s) {
        I(n, n.return, s);
      }
      if (n === e) {
        w = null;
        break;
      }
      var o = n.sibling;
      if (o !== null) {
        o.return = n.return, w = o;
        break;
      }
      w = n.return;
    }
  }
  var ff = Math.ceil, Or = Ve2.ReactCurrentDispatcher, Ki = Ve2.ReactCurrentOwner, he3 = Ve2.ReactCurrentBatchConfig, _ = 0, Q2 = null, V2 = null, K = 0, ue = 0, Fn = un(0), B3 = 0, Rt = null, gn = 0, Yr = 0, Yi = 0, vt = null, ne2 = null, Xi = 0, Xn = 1 / 0, Te2 = null, Rr = false, ai = null, be3 = null, rr = false, Ye = null, Fr = 0, yt = 0, ci = null, fr = -1, dr = 0;
  function b() {
    return (_ & 6) !== 0 ? j() : fr !== -1 ? fr : fr = j();
  }
  function en(e) {
    return (e.mode & 1) === 0 ? 1 : (_ & 2) !== 0 && K !== 0 ? K & -K : Yc.transition !== null ? (dr === 0 && (dr = Uo()), dr) : (e = P, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Qo(e.type)), e);
  }
  function Ce3(e, n, t, r) {
    if (50 < yt)
      throw yt = 0, ci = null, Error(v(185));
    Ft(e, t, r), ((_ & 2) === 0 || e !== Q2) && (e === Q2 && ((_ & 2) === 0 && (Yr |= t), B3 === 4 && $e2(e, K)), ie(e, r), t === 1 && _ === 0 && (n.mode & 1) === 0 && (Xn = j() + 500, Wr && on()));
  }
  function ie(e, n) {
    var t = e.callbackNode;
    Ga(e, n);
    var r = gr(e, e === Q2 ? K : 0);
    if (r === 0)
      t !== null && hu(t), e.callbackNode = null, e.callbackPriority = 0;
    else if (n = r & -r, e.callbackPriority !== n) {
      if (t != null && hu(t), n === 1)
        e.tag === 0 ? Kc(so.bind(null, e)) : as(so.bind(null, e)), Hc(function() {
          (_ & 6) === 0 && on();
        }), t = null;
      else {
        switch (jo(r)) {
          case 1:
            t = Si;
            break;
          case 4:
            t = Fo;
            break;
          case 16:
            t = yr;
            break;
          case 536870912:
            t = Io;
            break;
          default:
            t = yr;
        }
        t = sa(t, na.bind(null, e));
      }
      e.callbackPriority = n, e.callbackNode = t;
    }
  }
  function na(e, n) {
    if (fr = -1, dr = 0, (_ & 6) !== 0)
      throw Error(v(327));
    var t = e.callbackNode;
    if (Bn() && e.callbackNode !== t)
      return null;
    var r = gr(e, e === Q2 ? K : 0);
    if (r === 0)
      return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || n)
      n = Ir(e, r);
    else {
      n = r;
      var l = _;
      _ |= 2;
      var i = ra();
      (Q2 !== e || K !== n) && (Te2 = null, Xn = j() + 500, pn(e, n));
      do
        try {
          mf();
          break;
        } catch (o) {
          ta(e, o);
        }
      while (1);
      Oi(), Or.current = i, _ = l, V2 !== null ? n = 0 : (Q2 = null, K = 0, n = B3);
    }
    if (n !== 0) {
      if (n === 2 && (l = Ul(e), l !== 0 && (r = l, n = fi(e, l))), n === 1)
        throw t = Rt, pn(e, 0), $e2(e, r), ie(e, j()), t;
      if (n === 6)
        $e2(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !df(l) && (n = Ir(e, r), n === 2 && (i = Ul(e), i !== 0 && (r = i, n = fi(e, i))), n === 1))
          throw t = Rt, pn(e, 0), $e2(e, r), ie(e, j()), t;
        switch (e.finishedWork = l, e.finishedLanes = r, n) {
          case 0:
          case 1:
            throw Error(v(345));
          case 2:
            an(e, ne2, Te2);
            break;
          case 3:
            if ($e2(e, r), (r & 130023424) === r && (n = Xi + 500 - j(), 10 < n)) {
              if (gr(e, 0) !== 0)
                break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                b(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = $l(an.bind(null, e, ne2, Te2), n);
              break;
            }
            an(e, ne2, Te2);
            break;
          case 4:
            if ($e2(e, r), (r & 4194240) === r)
              break;
            for (n = e.eventTimes, l = -1; 0 < r; ) {
              var u = 31 - Ee3(r);
              i = 1 << u, u = n[u], u > l && (l = u), r &= ~i;
            }
            if (r = l, r = j() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * ff(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = $l(an.bind(null, e, ne2, Te2), r);
              break;
            }
            an(e, ne2, Te2);
            break;
          case 5:
            an(e, ne2, Te2);
            break;
          default:
            throw Error(v(329));
        }
      }
    }
    return ie(e, j()), e.callbackNode === t ? na.bind(null, e) : null;
  }
  function fi(e, n) {
    var t = vt;
    return e.current.memoizedState.isDehydrated && (pn(e, n).flags |= 256), e = Ir(e, n), e !== 2 && (n = ne2, ne2 = t, n !== null && di(n)), e;
  }
  function di(e) {
    ne2 === null ? ne2 = e : ne2.push.apply(ne2, e);
  }
  function df(e) {
    for (var n = e; ; ) {
      if (n.flags & 16384) {
        var t = n.updateQueue;
        if (t !== null && (t = t.stores, t !== null))
          for (var r = 0; r < t.length; r++) {
            var l = t[r], i = l.getSnapshot;
            l = l.value;
            try {
              if (!xe3(i(), l))
                return false;
            } catch {
              return false;
            }
          }
      }
      if (t = n.child, n.subtreeFlags & 16384 && t !== null)
        t.return = n, n = t;
      else {
        if (n === e)
          break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === e)
            return true;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return true;
  }
  function $e2(e, n) {
    for (n &= ~Yi, n &= ~Yr, e.suspendedLanes |= n, e.pingedLanes &= ~n, e = e.expirationTimes; 0 < n; ) {
      var t = 31 - Ee3(n), r = 1 << t;
      e[t] = -1, n &= ~r;
    }
  }
  function so(e) {
    if ((_ & 6) !== 0)
      throw Error(v(327));
    Bn();
    var n = gr(e, 0);
    if ((n & 1) === 0)
      return ie(e, j()), null;
    var t = Ir(e, n);
    if (e.tag !== 0 && t === 2) {
      var r = Ul(e);
      r !== 0 && (n = r, t = fi(e, r));
    }
    if (t === 1)
      throw t = Rt, pn(e, 0), $e2(e, n), ie(e, j()), t;
    if (t === 6)
      throw Error(v(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = n, an(e, ne2, Te2), ie(e, j()), null;
  }
  function Gi(e, n) {
    var t = _;
    _ |= 1;
    try {
      return e(n);
    } finally {
      _ = t, _ === 0 && (Xn = j() + 500, Wr && on());
    }
  }
  function wn(e) {
    Ye !== null && Ye.tag === 0 && (_ & 6) === 0 && Bn();
    var n = _;
    _ |= 1;
    var t = he3.transition, r = P;
    try {
      if (he3.transition = null, P = 1, e)
        return e();
    } finally {
      P = r, he3.transition = t, _ = n, (_ & 6) === 0 && on();
    }
  }
  function Zi() {
    ue = Fn.current, M2(Fn);
  }
  function pn(e, n) {
    e.finishedWork = null, e.finishedLanes = 0;
    var t = e.timeoutHandle;
    if (t !== -1 && (e.timeoutHandle = -1, Bc(t)), V2 !== null)
      for (t = V2.return; t !== null; ) {
        var r = t;
        switch (Ti(r), r.tag) {
          case 1:
            r = r.type.childContextTypes, r != null && Cr();
            break;
          case 3:
            Kn(), M2(re), M2(J2), Vi();
            break;
          case 5:
            ji(r);
            break;
          case 4:
            Kn();
            break;
          case 13:
            M2(O);
            break;
          case 19:
            M2(O);
            break;
          case 10:
            Ri(r.type._context);
            break;
          case 22:
          case 23:
            Zi();
        }
        t = t.return;
      }
    if (Q2 = e, V2 = e = nn(e.current, null), K = ue = n, B3 = 0, Rt = null, Yi = Yr = gn = 0, ne2 = vt = null, fn !== null) {
      for (n = 0; n < fn.length; n++)
        if (t = fn[n], r = t.interleaved, r !== null) {
          t.interleaved = null;
          var l = r.next, i = t.pending;
          if (i !== null) {
            var u = i.next;
            i.next = l, r.next = u;
          }
          t.pending = r;
        }
      fn = null;
    }
    return e;
  }
  function ta(e, n) {
    do {
      var t = V2;
      try {
        if (Oi(), sr.current = Dr, Mr) {
          for (var r = R2.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Mr = false;
        }
        if (yn = 0, W = A2 = R2 = null, mt = false, Mt = 0, Ki.current = null, t === null || t.return === null) {
          B3 = 1, Rt = n, V2 = null;
          break;
        }
        e: {
          var i = e, u = t.return, o = t, s = n;
          if (n = K, o.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
            var d = s, m = o, h = m.tag;
            if ((m.mode & 1) === 0 && (h === 0 || h === 11 || h === 15)) {
              var p = m.alternate;
              p ? (m.updateQueue = p.updateQueue, m.memoizedState = p.memoizedState, m.lanes = p.lanes) : (m.updateQueue = null, m.memoizedState = null);
            }
            var g = Gu(u);
            if (g !== null) {
              g.flags &= -257, Zu(g, u, o, i, n), g.mode & 1 && Xu(i, d, n), n = g, s = d;
              var S2 = n.updateQueue;
              if (S2 === null) {
                var k2 = /* @__PURE__ */ new Set();
                k2.add(s), n.updateQueue = k2;
              } else
                S2.add(s);
              break e;
            } else {
              if ((n & 1) === 0) {
                Xu(i, d, n), Ji();
                break e;
              }
              s = Error(v(426));
            }
          } else if (D2 && o.mode & 1) {
            var U3 = Gu(u);
            if (U3 !== null) {
              (U3.flags & 65536) === 0 && (U3.flags |= 256), Zu(U3, u, o, i, n), Mi(Yn(s, o));
              break e;
            }
          }
          i = s = Yn(s, o), B3 !== 4 && (B3 = 2), vt === null ? vt = [i] : vt.push(i), i = u;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, n &= -n, i.lanes |= n;
                var c = Vs(i, s, n);
                Bu(i, c);
                break e;
              case 1:
                o = s;
                var a = i.type, f = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof a.getDerivedStateFromError == "function" || f !== null && typeof f.componentDidCatch == "function" && (be3 === null || !be3.has(f)))) {
                  i.flags |= 65536, n &= -n, i.lanes |= n;
                  var y = As(i, o, n);
                  Bu(i, y);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        ia(t);
      } catch (E) {
        n = E, V2 === t && t !== null && (V2 = t = t.return);
        continue;
      }
      break;
    } while (1);
  }
  function ra() {
    var e = Or.current;
    return Or.current = Dr, e === null ? Dr : e;
  }
  function Ji() {
    (B3 === 0 || B3 === 3 || B3 === 2) && (B3 = 4), Q2 === null || (gn & 268435455) === 0 && (Yr & 268435455) === 0 || $e2(Q2, K);
  }
  function Ir(e, n) {
    var t = _;
    _ |= 2;
    var r = ra();
    (Q2 !== e || K !== n) && (Te2 = null, pn(e, n));
    do
      try {
        pf();
        break;
      } catch (l) {
        ta(e, l);
      }
    while (1);
    if (Oi(), _ = t, Or.current = r, V2 !== null)
      throw Error(v(261));
    return Q2 = null, K = 0, B3;
  }
  function pf() {
    for (; V2 !== null; )
      la(V2);
  }
  function mf() {
    for (; V2 !== null && !Aa(); )
      la(V2);
  }
  function la(e) {
    var n = oa(e.alternate, e, ue);
    e.memoizedProps = e.pendingProps, n === null ? ia(e) : V2 = n, Ki.current = null;
  }
  function ia(e) {
    var n = e;
    do {
      var t = n.alternate;
      if (e = n.return, (n.flags & 32768) === 0) {
        if (t = uf(t, n, ue), t !== null) {
          V2 = t;
          return;
        }
      } else {
        if (t = of(t, n), t !== null) {
          t.flags &= 32767, V2 = t;
          return;
        }
        if (e !== null)
          e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          B3 = 6, V2 = null;
          return;
        }
      }
      if (n = n.sibling, n !== null) {
        V2 = n;
        return;
      }
      V2 = n = e;
    } while (n !== null);
    B3 === 0 && (B3 = 5);
  }
  function an(e, n, t) {
    var r = P, l = he3.transition;
    try {
      he3.transition = null, P = 1, hf(e, n, t, r);
    } finally {
      he3.transition = l, P = r;
    }
    return null;
  }
  function hf(e, n, t, r) {
    do
      Bn();
    while (Ye !== null);
    if ((_ & 6) !== 0)
      throw Error(v(327));
    t = e.finishedWork;
    var l = e.finishedLanes;
    if (t === null)
      return null;
    if (e.finishedWork = null, e.finishedLanes = 0, t === e.current)
      throw Error(v(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = t.lanes | t.childLanes;
    if (Za(e, i), e === Q2 && (V2 = Q2 = null, K = 0), (t.subtreeFlags & 2064) === 0 && (t.flags & 2064) === 0 || rr || (rr = true, sa(yr, function() {
      return Bn(), null;
    })), i = (t.flags & 15990) !== 0, (t.subtreeFlags & 15990) !== 0 || i) {
      i = he3.transition, he3.transition = null;
      var u = P;
      P = 1;
      var o = _;
      _ |= 4, Ki.current = null, af(e, t), bs(t, e), Ic(Wl), wr = !!Hl, Wl = Hl = null, e.current = t, cf(t, e, l), Ba(), _ = o, P = u, he3.transition = i;
    } else
      e.current = t;
    if (rr && (rr = false, Ye = e, Fr = l), i = e.pendingLanes, i === 0 && (be3 = null), Qa(t.stateNode, r), ie(e, j()), n !== null)
      for (r = e.onRecoverableError, t = 0; t < n.length; t++)
        l = n[t], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Rr)
      throw Rr = false, e = ai, ai = null, e;
    return (Fr & 1) !== 0 && e.tag !== 0 && Bn(), i = e.pendingLanes, (i & 1) !== 0 ? e === ci ? yt++ : (yt = 0, ci = e) : yt = 0, on(), null;
  }
  function Bn() {
    if (Ye !== null) {
      var e = jo(Fr), n = he3.transition, t = P;
      try {
        if (he3.transition = null, P = 16 > e ? 16 : e, Ye === null)
          var r = false;
        else {
          if (e = Ye, Ye = null, Fr = 0, (_ & 6) !== 0)
            throw Error(v(331));
          var l = _;
          for (_ |= 4, w = e.current; w !== null; ) {
            var i = w, u = i.child;
            if ((w.flags & 16) !== 0) {
              var o = i.deletions;
              if (o !== null) {
                for (var s = 0; s < o.length; s++) {
                  var d = o[s];
                  for (w = d; w !== null; ) {
                    var m = w;
                    switch (m.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ht(8, m, i);
                    }
                    var h = m.child;
                    if (h !== null)
                      h.return = m, w = h;
                    else
                      for (; w !== null; ) {
                        m = w;
                        var p = m.sibling, g = m.return;
                        if (Zs(m), m === d) {
                          w = null;
                          break;
                        }
                        if (p !== null) {
                          p.return = g, w = p;
                          break;
                        }
                        w = g;
                      }
                  }
                }
                var S2 = i.alternate;
                if (S2 !== null) {
                  var k2 = S2.child;
                  if (k2 !== null) {
                    S2.child = null;
                    do {
                      var U3 = k2.sibling;
                      k2.sibling = null, k2 = U3;
                    } while (k2 !== null);
                  }
                }
                w = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && u !== null)
              u.return = i, w = u;
            else
              e:
                for (; w !== null; ) {
                  if (i = w, (i.flags & 2048) !== 0)
                    switch (i.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ht(9, i, i.return);
                    }
                  var c = i.sibling;
                  if (c !== null) {
                    c.return = i.return, w = c;
                    break e;
                  }
                  w = i.return;
                }
          }
          var a = e.current;
          for (w = a; w !== null; ) {
            u = w;
            var f = u.child;
            if ((u.subtreeFlags & 2064) !== 0 && f !== null)
              f.return = u, w = f;
            else
              e:
                for (u = a; w !== null; ) {
                  if (o = w, (o.flags & 2048) !== 0)
                    try {
                      switch (o.tag) {
                        case 0:
                        case 11:
                        case 15:
                          Kr(9, o);
                      }
                    } catch (E) {
                      I(o, o.return, E);
                    }
                  if (o === u) {
                    w = null;
                    break e;
                  }
                  var y = o.sibling;
                  if (y !== null) {
                    y.return = o.return, w = y;
                    break e;
                  }
                  w = o.return;
                }
          }
          if (_ = l, on(), Pe3 && typeof Pe3.onPostCommitFiberRoot == "function")
            try {
              Pe3.onPostCommitFiberRoot(jr, e);
            } catch {
            }
          r = true;
        }
        return r;
      } finally {
        P = t, he3.transition = n;
      }
    }
    return false;
  }
  function ao(e, n, t) {
    n = Yn(t, n), n = Vs(e, n, 1), e = qe2(e, n, 1), n = b(), e !== null && (Ft(e, 1, n), ie(e, n));
  }
  function I(e, n, t) {
    if (e.tag === 3)
      ao(e, e, t);
    else
      for (; n !== null; ) {
        if (n.tag === 3) {
          ao(n, e, t);
          break;
        } else if (n.tag === 1) {
          var r = n.stateNode;
          if (typeof n.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (be3 === null || !be3.has(r))) {
            e = Yn(t, e), e = As(n, e, 1), n = qe2(n, e, 1), e = b(), n !== null && (Ft(n, 1, e), ie(n, e));
            break;
          }
        }
        n = n.return;
      }
  }
  function vf(e, n, t) {
    var r = e.pingCache;
    r !== null && r.delete(n), n = b(), e.pingedLanes |= e.suspendedLanes & t, Q2 === e && (K & t) === t && (B3 === 4 || B3 === 3 && (K & 130023424) === K && 500 > j() - Xi ? pn(e, 0) : Yi |= t), ie(e, n);
  }
  function ua(e, n) {
    n === 0 && ((e.mode & 1) === 0 ? n = 1 : (n = Wt, Wt <<= 1, (Wt & 130023424) === 0 && (Wt = 4194304)));
    var t = b();
    e = Ue2(e, n), e !== null && (Ft(e, n, t), ie(e, t));
  }
  function yf(e) {
    var n = e.memoizedState, t = 0;
    n !== null && (t = n.retryLane), ua(e, t);
  }
  function gf(e, n) {
    var t = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (t = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(v(314));
    }
    r !== null && r.delete(n), ua(e, t);
  }
  var oa;
  oa = function(e, n, t) {
    if (e !== null)
      if (e.memoizedProps !== n.pendingProps || re.current)
        te2 = true;
      else {
        if ((e.lanes & t) === 0 && (n.flags & 128) === 0)
          return te2 = false, lf(e, n, t);
        te2 = (e.flags & 131072) !== 0;
      }
    else
      te2 = false, D2 && (n.flags & 1048576) !== 0 && cs(n, _r, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var r = n.type;
        cr(e, n), e = n.pendingProps;
        var l = Wn(n, J2.current);
        An(n, t), l = Bi(null, n, r, e, l, t);
        var i = Hi();
        return n.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, le2(r) ? (i = true, xr(n)) : i = false, n.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ii(n), l.updater = Qr, n.stateNode = l, l._reactInternals = n, ql(n, r, e, t), n = ni(null, n, r, true, i, t)) : (n.tag = 0, D2 && i && Li(n), q2(null, n, l, t), n = n.child), n;
      case 16:
        r = n.elementType;
        e: {
          switch (cr(e, n), e = n.pendingProps, l = r._init, r = l(r._payload), n.type = r, l = n.tag = Sf(r), e = we3(r, e), l) {
            case 0:
              n = ei(null, n, r, e, t);
              break e;
            case 1:
              n = bu(null, n, r, e, t);
              break e;
            case 11:
              n = Ju(null, n, r, e, t);
              break e;
            case 14:
              n = qu(null, n, r, we3(r.type, e), t);
              break e;
          }
          throw Error(v(306, r, ""));
        }
        return n;
      case 0:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : we3(r, l), ei(e, n, r, l, t);
      case 1:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : we3(r, l), bu(e, n, r, l, t);
      case 3:
        e: {
          if (Qs(n), e === null)
            throw Error(v(387));
          r = n.pendingProps, i = n.memoizedState, l = i.element, ms(e, n), Lr(n, r, null, t);
          var u = n.memoizedState;
          if (r = u.element, i.isDehydrated)
            if (i = { element: r, isDehydrated: false, cache: u.cache, pendingSuspenseBoundaries: u.pendingSuspenseBoundaries, transitions: u.transitions }, n.updateQueue.baseState = i, n.memoizedState = i, n.flags & 256) {
              l = Yn(Error(v(423)), n), n = eo(e, n, r, t, l);
              break e;
            } else if (r !== l) {
              l = Yn(Error(v(424)), n), n = eo(e, n, r, t, l);
              break e;
            } else
              for (oe2 = Je(n.stateNode.containerInfo.firstChild), se2 = n, D2 = true, ke3 = null, t = gs(n, null, r, t), n.child = t; t; )
                t.flags = t.flags & -3 | 4096, t = t.sibling;
          else {
            if (Qn(), r === l) {
              n = je2(e, n, t);
              break e;
            }
            q2(e, n, r, t);
          }
          n = n.child;
        }
        return n;
      case 5:
        return ws(n), e === null && Gl(n), r = n.type, l = n.pendingProps, i = e !== null ? e.memoizedProps : null, u = l.children, Ql(r, l) ? u = null : i !== null && Ql(r, i) && (n.flags |= 32), Ws(e, n), q2(e, n, u, t), n.child;
      case 6:
        return e === null && Gl(n), null;
      case 13:
        return $s(e, n, t);
      case 4:
        return Ui(n, n.stateNode.containerInfo), r = n.pendingProps, e === null ? n.child = $n(n, null, r, t) : q2(e, n, r, t), n.child;
      case 11:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : we3(r, l), Ju(e, n, r, l, t);
      case 7:
        return q2(e, n, n.pendingProps, t), n.child;
      case 8:
        return q2(e, n, n.pendingProps.children, t), n.child;
      case 12:
        return q2(e, n, n.pendingProps.children, t), n.child;
      case 10:
        e: {
          if (r = n.type._context, l = n.pendingProps, i = n.memoizedProps, u = l.value, L2(zr, r._currentValue), r._currentValue = u, i !== null)
            if (xe3(i.value, u)) {
              if (i.children === l.children && !re.current) {
                n = je2(e, n, t);
                break e;
              }
            } else
              for (i = n.child, i !== null && (i.return = n); i !== null; ) {
                var o = i.dependencies;
                if (o !== null) {
                  u = i.child;
                  for (var s = o.firstContext; s !== null; ) {
                    if (s.context === r) {
                      if (i.tag === 1) {
                        s = Re2(-1, t & -t), s.tag = 2;
                        var d = i.updateQueue;
                        if (d !== null) {
                          d = d.shared;
                          var m = d.pending;
                          m === null ? s.next = s : (s.next = m.next, m.next = s), d.pending = s;
                        }
                      }
                      i.lanes |= t, s = i.alternate, s !== null && (s.lanes |= t), Zl(i.return, t, n), o.lanes |= t;
                      break;
                    }
                    s = s.next;
                  }
                } else if (i.tag === 10)
                  u = i.type === n.type ? null : i.child;
                else if (i.tag === 18) {
                  if (u = i.return, u === null)
                    throw Error(v(341));
                  u.lanes |= t, o = u.alternate, o !== null && (o.lanes |= t), Zl(u, t, n), u = i.sibling;
                } else
                  u = i.child;
                if (u !== null)
                  u.return = i;
                else
                  for (u = i; u !== null; ) {
                    if (u === n) {
                      u = null;
                      break;
                    }
                    if (i = u.sibling, i !== null) {
                      i.return = u.return, u = i;
                      break;
                    }
                    u = u.return;
                  }
                i = u;
              }
          q2(e, n, l.children, t), n = n.child;
        }
        return n;
      case 9:
        return l = n.type, r = n.pendingProps.children, An(n, t), l = ve3(l), r = r(l), n.flags |= 1, q2(e, n, r, t), n.child;
      case 14:
        return r = n.type, l = we3(r, n.pendingProps), l = we3(r.type, l), qu(e, n, r, l, t);
      case 15:
        return Bs(e, n, n.type, n.pendingProps, t);
      case 17:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : we3(r, l), cr(e, n), n.tag = 1, le2(r) ? (e = true, xr(n)) : e = false, An(n, t), vs(n, r, l), ql(n, r, l, t), ni(null, n, r, true, e, t);
      case 19:
        return Ks(e, n, t);
      case 22:
        return Hs(e, n, t);
    }
    throw Error(v(156, n.tag));
  };
  function sa(e, n) {
    return Ro(e, n);
  }
  function wf(e, n, t, r) {
    this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function me3(e, n, t, r) {
    return new wf(e, n, t, r);
  }
  function qi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Sf(e) {
    if (typeof e == "function")
      return qi(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === yi)
        return 11;
      if (e === gi)
        return 14;
    }
    return 2;
  }
  function nn(e, n) {
    var t = e.alternate;
    return t === null ? (t = me3(e.tag, n, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = n, t.type = e.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = e.flags & 14680064, t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, n = e.dependencies, t.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t;
  }
  function pr(e, n, t, r, l, i) {
    var u = 2;
    if (r = e, typeof e == "function")
      qi(e) && (u = 1);
    else if (typeof e == "string")
      u = 5;
    else
      e:
        switch (e) {
          case Nn:
            return mn(t.children, l, i, n);
          case vi:
            u = 8, l |= 8;
            break;
          case El:
            return e = me3(12, t, n, l | 2), e.elementType = El, e.lanes = i, e;
          case Cl:
            return e = me3(13, t, n, l), e.elementType = Cl, e.lanes = i, e;
          case xl:
            return e = me3(19, t, n, l), e.elementType = xl, e.lanes = i, e;
          case yo:
            return Xr(t, l, i, n);
          default:
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case ho:
                  u = 10;
                  break e;
                case vo:
                  u = 9;
                  break e;
                case yi:
                  u = 11;
                  break e;
                case gi:
                  u = 14;
                  break e;
                case He2:
                  u = 16, r = null;
                  break e;
              }
            throw Error(v(130, e == null ? e : typeof e, ""));
        }
    return n = me3(u, t, n, l), n.elementType = e, n.type = r, n.lanes = i, n;
  }
  function mn(e, n, t, r) {
    return e = me3(7, e, r, n), e.lanes = t, e;
  }
  function Xr(e, n, t, r) {
    return e = me3(22, e, r, n), e.elementType = yo, e.lanes = t, e.stateNode = { isHidden: false }, e;
  }
  function wl(e, n, t) {
    return e = me3(6, e, null, n), e.lanes = t, e;
  }
  function Sl(e, n, t) {
    return n = me3(4, e.children !== null ? e.children : [], e.key, n), n.lanes = t, n.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, n;
  }
  function kf(e, n, t, r, l) {
    this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = rl(0), this.expirationTimes = rl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function bi(e, n, t, r, l, i, u, o, s) {
    return e = new kf(e, n, t, o, s), n === 1 ? (n = 1, i === true && (n |= 8)) : n = 0, i = me3(3, null, null, n), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: t, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ii(i), e;
  }
  function Ef(e, n, t) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: xn, key: r == null ? null : "" + r, children: e, containerInfo: n, implementation: t };
  }
  function aa(e) {
    if (!e)
      return rn;
    e = e._reactInternals;
    e: {
      if (kn(e) !== e || e.tag !== 1)
        throw Error(v(170));
      var n = e;
      do {
        switch (n.tag) {
          case 3:
            n = n.stateNode.context;
            break e;
          case 1:
            if (le2(n.type)) {
              n = n.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        n = n.return;
      } while (n !== null);
      throw Error(v(171));
    }
    if (e.tag === 1) {
      var t = e.type;
      if (le2(t))
        return ss(e, t, n);
    }
    return n;
  }
  function ca(e, n, t, r, l, i, u, o, s) {
    return e = bi(t, r, true, e, l, i, u, o, s), e.context = aa(null), t = e.current, r = b(), l = en(t), i = Re2(r, l), i.callback = n ?? null, qe2(t, i, l), e.current.lanes = l, Ft(e, l, r), ie(e, r), e;
  }
  function Gr(e, n, t, r) {
    var l = n.current, i = b(), u = en(l);
    return t = aa(t), n.context === null ? n.context = t : n.pendingContext = t, n = Re2(i, u), n.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (n.callback = r), e = qe2(l, n, u), e !== null && (Ce3(e, l, u, i), or(e, l, u)), u;
  }
  function Ur(e) {
    if (e = e.current, !e.child)
      return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function co(e, n) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var t = e.retryLane;
      e.retryLane = t !== 0 && t < n ? t : n;
    }
  }
  function eu(e, n) {
    co(e, n), (e = e.alternate) && co(e, n);
  }
  function Cf() {
    return null;
  }
  var fa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function nu(e) {
    this._internalRoot = e;
  }
  Zr.prototype.render = nu.prototype.render = function(e) {
    var n = this._internalRoot;
    if (n === null)
      throw Error(v(409));
    Gr(e, n, null, null);
  };
  Zr.prototype.unmount = nu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var n = e.containerInfo;
      wn(function() {
        Gr(null, e, null, null);
      }), n[Ie3] = null;
    }
  };
  function Zr(e) {
    this._internalRoot = e;
  }
  Zr.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var n = Bo();
      e = { blockedOn: null, target: e, priority: n };
      for (var t = 0; t < Qe.length && n !== 0 && n < Qe[t].priority; t++)
        ;
      Qe.splice(t, 0, e), t === 0 && Wo(e);
    }
  };
  function tu(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Jr(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function fo() {
  }
  function xf(e, n, t, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var d = Ur(u);
          i.call(d);
        };
      }
      var u = ca(n, r, e, 0, null, false, false, "", fo);
      return e._reactRootContainer = u, e[Ie3] = u.current, _t(e.nodeType === 8 ? e.parentNode : e), wn(), u;
    }
    for (; l = e.lastChild; )
      e.removeChild(l);
    if (typeof r == "function") {
      var o = r;
      r = function() {
        var d = Ur(s);
        o.call(d);
      };
    }
    var s = bi(e, 0, false, null, null, false, false, "", fo);
    return e._reactRootContainer = s, e[Ie3] = s.current, _t(e.nodeType === 8 ? e.parentNode : e), wn(function() {
      Gr(n, s, t, r);
    }), s;
  }
  function qr(e, n, t, r, l) {
    var i = t._reactRootContainer;
    if (i) {
      var u = i;
      if (typeof l == "function") {
        var o = l;
        l = function() {
          var s = Ur(u);
          o.call(s);
        };
      }
      Gr(n, u, e, l);
    } else
      u = xf(t, n, e, l, r);
    return Ur(u);
  }
  Vo = function(e) {
    switch (e.tag) {
      case 3:
        var n = e.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var t = ot(n.pendingLanes);
          t !== 0 && (ki(n, t | 1), ie(n, j()), (_ & 6) === 0 && (Xn = j() + 500, on()));
        }
        break;
      case 13:
        wn(function() {
          var r = Ue2(e, 1);
          if (r !== null) {
            var l = b();
            Ce3(r, e, 1, l);
          }
        }), eu(e, 1);
    }
  };
  Ei = function(e) {
    if (e.tag === 13) {
      var n = Ue2(e, 134217728);
      if (n !== null) {
        var t = b();
        Ce3(n, e, 134217728, t);
      }
      eu(e, 134217728);
    }
  };
  Ao = function(e) {
    if (e.tag === 13) {
      var n = en(e), t = Ue2(e, n);
      if (t !== null) {
        var r = b();
        Ce3(t, e, n, r);
      }
      eu(e, n);
    }
  };
  Bo = function() {
    return P;
  };
  Ho = function(e, n) {
    var t = P;
    try {
      return P = e, n();
    } finally {
      P = t;
    }
  };
  Rl = function(e, n, t) {
    switch (n) {
      case "input":
        if (zl(e, t), n = t.name, t.type === "radio" && n != null) {
          for (t = e; t.parentNode; )
            t = t.parentNode;
          for (t = t.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]'), n = 0; n < t.length; n++) {
            var r = t[n];
            if (r !== e && r.form === e.form) {
              var l = Hr(r);
              if (!l)
                throw Error(v(90));
              wo(r), zl(r, l);
            }
          }
        }
        break;
      case "textarea":
        ko(e, t);
        break;
      case "select":
        n = t.value, n != null && In(e, !!t.multiple, n, false);
    }
  };
  Po = Gi;
  Lo = wn;
  var Nf = { usingClientEntryPoint: false, Events: [Ut, Ln, Hr, _o, zo, Gi] }, rt = { findFiberByHostInstance: cn, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, _f = { bundleType: rt.bundleType, version: rt.version, rendererPackageName: rt.rendererPackageName, rendererConfig: rt.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Ve2.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Do(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: rt.findFiberByHostInstance || Cf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && (lt = __REACT_DEVTOOLS_GLOBAL_HOOK__, !lt.isDisabled && lt.supportsFiber))
    try {
      jr = lt.inject(_f), Pe3 = lt;
    } catch {
    }
  var lt;
  fe2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Nf;
  fe2.createPortal = function(e, n) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!tu(n))
      throw Error(v(200));
    return Ef(e, n, null, t);
  };
  fe2.createRoot = function(e, n) {
    if (!tu(e))
      throw Error(v(299));
    var t = false, r = "", l = fa;
    return n != null && (n.unstable_strictMode === true && (t = true), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onRecoverableError !== void 0 && (l = n.onRecoverableError)), n = bi(e, 1, false, null, null, t, false, r, l), e[Ie3] = n.current, _t(e.nodeType === 8 ? e.parentNode : e), new nu(n);
  };
  fe2.findDOMNode = function(e) {
    if (e == null)
      return null;
    if (e.nodeType === 1)
      return e;
    var n = e._reactInternals;
    if (n === void 0)
      throw typeof e.render == "function" ? Error(v(188)) : (e = Object.keys(e).join(","), Error(v(268, e)));
    return e = Do(n), e = e === null ? null : e.stateNode, e;
  };
  fe2.flushSync = function(e) {
    return wn(e);
  };
  fe2.hydrate = function(e, n, t) {
    if (!Jr(n))
      throw Error(v(200));
    return qr(null, e, n, true, t);
  };
  fe2.hydrateRoot = function(e, n, t) {
    if (!tu(e))
      throw Error(v(405));
    var r = t != null && t.hydratedSources || null, l = false, i = "", u = fa;
    if (t != null && (t.unstable_strictMode === true && (l = true), t.identifierPrefix !== void 0 && (i = t.identifierPrefix), t.onRecoverableError !== void 0 && (u = t.onRecoverableError)), n = ca(n, null, e, 1, t ?? null, l, false, i, u), e[Ie3] = n.current, _t(e), r)
      for (e = 0; e < r.length; e++)
        t = r[e], l = t._getVersion, l = l(t._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [t, l] : n.mutableSourceEagerHydrationData.push(t, l);
    return new Zr(n);
  };
  fe2.render = function(e, n, t) {
    if (!Jr(n))
      throw Error(v(200));
    return qr(null, e, n, false, t);
  };
  fe2.unmountComponentAtNode = function(e) {
    if (!Jr(e))
      throw Error(v(40));
    return e._reactRootContainer ? (wn(function() {
      qr(null, null, e, false, function() {
        e._reactRootContainer = null, e[Ie3] = null;
      });
    }), true) : false;
  };
  fe2.unstable_batchedUpdates = Gi;
  fe2.unstable_renderSubtreeIntoContainer = function(e, n, t, r) {
    if (!Jr(t))
      throw Error(v(200));
    if (e == null || e._reactInternals === void 0)
      throw Error(v(38));
    return qr(e, n, t, false, r);
  };
  fe2.version = "18.2.0-next-9e3b772b8-20220608";
});
var ha = iu((Tf, ma) => {
  "use strict";
  function pa() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pa);
      } catch (e) {
        console.error(e);
      }
  }
  pa(), ma.exports = da();
});
var ya = Na(ha());
var { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Mf, createPortal: Df, createRoot: Of, findDOMNode: Rf, flushSync: Ff, hydrate: If, hydrateRoot: Uf, render: jf, unmountComponentAtNode: Vf, unstable_batchedUpdates: Af, unstable_renderSubtreeIntoContainer: Bf, version: Hf } = ya;
var { default: va, ...zf } = ya;

// deno:file:///C:/Users/Karel/Projekty/opendata-mvcr/ldkit/examples/todo-app-deno/src/main.tsx
var App = () => /* @__PURE__ */ We.createElement(We.Fragment, null, "Whoaaaa");
jf(
  /* @__PURE__ */ We.createElement(We.StrictMode, null, /* @__PURE__ */ We.createElement(App, null)),
  document.getElementById("app")
);
var x = 2;
export {
  x
};
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
