/*! For license information please see site-bundle.js.LICENSE.txt */ ! function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var n = t();
        for (var r in n)("object" == typeof exports ? exports : e)[r] = n[r]
    }
}(self, (function() {
    return function() {
        var e, t, n, r, o = {
                95318: function(e) {
                    e.exports = function(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    }, e.exports.__esModule = !0, e.exports.default = e.exports
                },
                98206: function(e) {},
                319: function(e, t, n) {},
                86254: function(e, t, n) {},
                54293: function(e, t) {},
                71949: function(e, t, n) {},
                34165: function(e, t, n) {
                    "use strict";
                    var r = n(95318);
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.default = function() {};
                    var o = r(n(319)),
                        i = r(n(43080));

                    function a(e) {}

                    function u(e, t) {}

                    function c(e, t) {}
                    e.exports = t.default
                },
                43080: function(e, t) {},
                54278: function(e, t, n) {
                    "use strict";
                    var r = n(95318);
                    Object.defineProperty(t, "mQ", {
                        enumerable: !0,
                        get: function() {
                            return i.default
                        }
                    });
                    var o = r(n(43080)),
                        i = r(n(34165))
                },
                76746: function(e, t) {
                    "use strict";
                    Object.defineProperty(t, "__esModule", {});
                    var n = Static.SQUARESPACE_CONTEXT.authenticatedAccount,
                        r = {},
                        o = {
                            getValue: function(e) {
                                return e && "string" == typeof e ? window.Static.SQUARESPACE_CONTEXT.tweakJSON[e] || window.Static.SQUARESPACE_CONTEXT.tweakJSON[e.replace("@", "").replace(".", "")] : (console.error("squarespace-core: Invalid tweak name " + e), null)
                            },
                            watch: function() {
                                var e = arguments;
                                if (n)
                                    if (0 !== arguments.length)
                                        if (1 !== arguments.length)
                                            if ("string" == typeof arguments[0] && "function" == typeof arguments[1]) {
                                                var t = arguments[0];
                                                r[t] || (r[t] = {
                                                    callbacks: []
                                                }), r[t].callbacks.push(arguments[1])
                                            } else arguments[0].constructor === Array && "function" == typeof arguments[1] && arguments[0].forEach((function(t) {
                                                r[t] || (r[t] = {
                                                    callbacks: []
                                                }), r[t].callbacks.push(e[1])
                                            }));
                                else "function" == typeof arguments[0] && r.all.callbacks.push(arguments[0]);
                                else console.error("squarespace-core: Tweak.watch must be called with at least one parameter")
                            }
                        };

                    function i() {}
                    n && ("complete" !== document.readyState ? window.addEventListener("load", i) : window.Y && window.Y.Global && i()), t.default = o, e.exports = t.default
                },
                82767: function(e, t, n) {
                    "use strict";
                    n.d(t, {
                        C1: function() {
                            return We
                        },
                        gL: function() {
                            return r
                        },
                        R4: function() {
                            return ze
                        }
                    });
                    var r = {};
                    n.r(r), n.d(r, {
                        instantiate: function() {
                            return Qe
                        }
                    });
                    var o = n(38336),
                        i = n(83686),
                        a = {
                            Header: function() {
                                return o.Z
                            },
                            SectionWrapperController: function() {
                                return i.Z
                            }
                        };

                    function p(e) {}
                    var h, v, g, m, b, y, w, x, S, k, O, E, R, P, L, A, I, _, C, T, j, N, M, D, F, B, z, q, G, H, V, W, U, Y, Z, Q, X, J, $, K, ee, te, ne, re, oe, ie = {};


                    function ce(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function(t) {
                                return Object.getOwnPropertyDescriptor(e, t).enumerable
                            }))), n.push.apply(n, r)
                        }
                        return n
                    }

                    function se(e) {}

                    function le(e, t, n) {}
                    var fe = se(se({}, ie), {}, {});

                    function de(e, t, n, r, o, i, a) {
                        try {
                            var u = e[i](a),
                                c = u.value
                        } catch (e) {
                            return void n(e)
                        }
                        u.done ? t(c) : Promise.resolve(c).then(r, o)
                    }

                    function pe(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, o) {
                                var i = e.apply(t, n);

                                function a(e) {
                                    de(i, r, o, a, u, "next", e)
                                }

                                function u(e) {
                                    de(i, r, o, a, u, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function he(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function(t) {
                                return Object.getOwnPropertyDescriptor(e, t).enumerable
                            }))), n.push.apply(n, r)
                        }
                        return n
                    }

                    function ve(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? he(Object(n), !0).forEach((function(t) {
                                ge(e, t, n[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : he(Object(n)).forEach((function(t) {
                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                            }))
                        }
                        return e
                    }

                    function ge(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    var me = n(83987).Z ? ve(ve({}, f), fe) : ve(ve({}, a), ie);

                    function be(e) {
                        return ye.apply(this, arguments)
                    }

                    function ye() {
                        return (ye = pe(regeneratorRuntime.mark((function e(t) {
                            var n, r;
                            return regeneratorRuntime.wrap((function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        if (n = me[t]) {
                                            e.next = 4;
                                            break
                                        }
                                        return console.warn("No controller found for name: ".concat(t)), e.abrupt("return");
                                    case 4:
                                        return e.prev = 4, e.next = 7, n();
                                    case 7:
                                        return r = e.sent, e.abrupt("return", r.default ? r.default : r);
                                    case 11:
                                        e.prev = 11, e.t0 = e.catch(4), console.error('Failure to load webpack chunk for "'.concat(t, '" controller'), e.t0);
                                    case 14:
                                    case "end":
                                        return e.stop()
                                }
                            }), e, null, [
                                [4, 11]
                            ])
                        })))).apply(this, arguments)
                    }

                    function we(e, t) {}

                    function xe(e, t, n) {}
                    var Se = function() {}(),
                        ke = "data-section-id",
                        Oe = "data-controllers-bound",
                        Ee = function(e, t) {
                            for (var n = 0, r = e; r !== t && null !== r;) r = r.parentNode, n++;
                            return null === r ? (console.warn("Encountered null parent for node before reaching root!", e, t), Number.POSITIVE_INFINITY) : n
                        },
                        Re = function(e, t) {
                            var n = Array.from(e.querySelectorAll("[".concat(t, "]")));
                            return e.hasAttribute(t) && n.push(e), n.sort((function(n, r) {
                                return 1 * (Ee(n, e) - Ee(r, e)) + .1 * (n.getAttribute(t) > r.getAttribute(t) ? 1 : -1)
                            })), n.flatMap((function(e) {
                                return e.getAttribute(t).split(",").map((function(t) {
                                    return {
                                        controllerName: t.trim(),
                                        controllerNode: e
                                    }
                                }))
                            }))
                        },
                        Pe = function(e) {
                            return Re(e, "data-controller")
                        },
                        Le = function(e, t) {
                            var n = t.getAttribute(Oe);
                            n ? t.setAttribute(Oe, n + "," + e) : t.setAttribute(Oe, e)
                        };

                    function Ae(e) {}

                    function Ie(e, t, n, r, o, i, a) {
                        try {
                            var u = e[i](a),
                                c = u.value
                        } catch (e) {
                            return void n(e)
                        }
                        u.done ? t(c) : Promise.resolve(c).then(r, o)
                    }

                    function _e(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, o) {
                                var i = e.apply(t, n);

                                function a(e) {
                                    Ie(i, r, o, a, u, "next", e)
                                }

                                function u(e) {
                                    Ie(i, r, o, a, u, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function Ce(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function Te(e, t, n) {}
                    var je = function() {
                        function e(t, n) {
                            ! function(e, t) {}(this, e), Te(this, "sectionId", null), Te(this, "sectionNode", null), Te(this, "controllerDataArrByNode", new Map), this.sectionId = t, this.sectionNode = n
                        }
                        var t, n, r, o, i, a, u;
                        return t = e, n = [{
                            key: "create",
                            value: (u = _e(regeneratorRuntime.mark((function e() {
                                var t = this;
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return e.next = 2, Promise.all(Pe(this.sectionNode).map(function() {
                                                var e = _e(regeneratorRuntime.mark((function e(n) {
                                                    var r, o;
                                                    return regeneratorRuntime.wrap((function(e) {
                                                        for (;;) switch (e.prev = e.next) {
                                                            case 0:
                                                                return r = n.controllerName, o = n.controllerNode, e.next = 3, t._createController({
                                                                    controllerName: r,
                                                                    controllerNode: o
                                                                });
                                                            case 3:
                                                            case "end":
                                                                return e.stop()
                                                        }
                                                    }), e)
                                                })));
                                                return function(t) {
                                                    return e.apply(this, arguments)
                                                }
                                            }()));
                                        case 2:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, this)
                            }))), function() {
                                return u.apply(this, arguments)
                            })
                        }, {}, {}, {}, {}, {}, {
                            key: "_createController",
                            value: (o = _e(regeneratorRuntime.mark((function e(t) {
                                var n, r, o, i, a;
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return n = t.controllerName, r = t.controllerNode, e.next = 4, be(n);
                                        case 4:
                                            if ("function" == typeof(o = e.sent)) {
                                                e.next = 8;
                                                break
                                            }
                                            return console.error("Could not load controller '".concat(n, "' because it was not a function ") + "(type '".concat(Ae(o), "', value '").concat(o, "')")), e.abrupt("return");
                                        case 8:
                                            try {
                                                i = o(r), Le(n, r), a = new Se(n, i), this.controllerDataArrByNode.get(r) ? this.controllerDataArrByNode.get(r).push(a) : this.controllerDataArrByNode.set(r, [a])
                                            } catch (e) {
                                                console.error("Controller '".concat(n, "' in section '").concat(this.sectionId, "' threw upon initialization"), e)
                                            }
                                        case 9:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, this)
                            }))), function(e) {
                                return o.apply(this, arguments)
                            })
                        }, {}, {}, {}], n && Ce(t.prototype, n), r && Ce(t, r), e
                    }();

                    function Ne(e, t, n, r, o, i, a) {}

                    function Me(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, o) {
                                var i = e.apply(t, n);

                                function a(e) {
                                    Ne(i, r, o, a, u, "next", e)
                                }

                                function u(e) {
                                    Ne(i, r, o, a, u, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function De(e, t) {}

                    function Fe(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function Be(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    var ze = function() {
                        function e(t) {
                            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                                r = n.catalogSections;
                            De(this, e), Be(this, "sectionControllersById", {}), Be(this, "sectionsNode", null), Be(this, "catalogSections", !1), this.sectionsNode = t, "boolean" == typeof r && (this.catalogSections = r)
                        }
                        var t, n, r, o, i;
                        return t = e, n = [{
                            key: "destroy",
                            value: function() {
                                var e = this;
                                Object.keys(this.sectionControllersById).forEach((function(t) {
                                    return e.sectionDeleted(t)
                                }))
                            }
                        }, {
                            key: "bootstrap",
                            value: function() {
                                var e = this;
                                if (!Object.keys(this.sectionControllersById).length) return Promise.all(function(e) {
                                    var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).deepSearch;
                                    return ("boolean" == typeof t && t ? Array.from(e.querySelectorAll("section[".concat(ke, "]"))) : Array.from(e.querySelectorAll(":scope > section[".concat(ke, "]")))).map((function(e) {
                                        return {
                                            sectionNode: e,
                                            sectionId: e.getAttribute(ke)
                                        }
                                    }))
                                }(this.sectionsNode, {
                                    deepSearch: this.catalogSections
                                }).map(function() {
                                    var t = Me(regeneratorRuntime.mark((function t(n) {
                                        var r, o;
                                        return regeneratorRuntime.wrap((function(t) {
                                            for (;;) switch (t.prev = t.next) {
                                                case 0:
                                                    return r = n.sectionId, o = n.sectionNode, t.next = 3, e.sectionCreated(r, o);
                                                case 3:
                                                case "end":
                                                    return t.stop()
                                            }
                                        }), t)
                                    })));
                                    return function(e) {
                                        return t.apply(this, arguments)
                                    }
                                }()));
                                console.warn("Bootstrap was called but SectionControllers already exist!")
                            }
                        }, {
                            key: "setSectionsNode",
                            value: function(e) {
                                this.destroy(), this.sectionsNode = e
                            }
                        }, {
                            key: "sectionCreated",
                            value: (i = Me(regeneratorRuntime.mark((function e(t, n) {
                                var r;
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return r = new je(t, n), this.sectionControllersById[t] = r, e.next = 4, r.create();
                                        case 4:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, this)
                            }))), function(e, t) {
                                return i.apply(this, arguments)
                            })
                        }, {
                            key: "sectionDeleted",
                            value: function(e) {
                                this.sectionControllersById[e].destroy(), delete this.sectionControllersById[e]
                            }
                        }, {
                            key: "sectionWillChange",
                            value: function(e, t, n) {
                                return this.sectionControllersById[e].willChange(t, n)
                            }
                        }, {
                            key: "sectionDidChange",
                            value: (o = Me(regeneratorRuntime.mark((function e(t, n, r) {
                                var o;
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return o = this.sectionControllersById[t], e.next = 3, o.didChange(n, r);
                                        case 3:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, this)
                            }))), function(e, t, n) {
                                return o.apply(this, arguments)
                            })
                        }], n && Fe(t.prototype, n), r && Fe(t, r), e
                    }();

                    function qe(e, t, n, r, o, i, a) {
                        try {
                            var u = e[i](a),
                                c = u.value
                        } catch (e) {
                            return void n(e)
                        }
                        u.done ? t(c) : Promise.resolve(c).then(r, o)
                    }

                    function Ge(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, o) {
                                var i = e.apply(t, n);

                                function a(e) {
                                    qe(i, r, o, a, u, "next", e)
                                }

                                function u(e) {
                                    qe(i, r, o, a, u, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function He(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function Ve(e, t, n) {}
                    var We = function() {
                            function e(t, n) {
                                ! function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, e), Ve(this, "node", null), Ve(this, "id", null), Ve(this, "controllerManager", null), this.node = t, this.id = n
                            }
                            var t, n, r, o, i;
                            return t = e, n = [{
                                key: "destroy",
                                value: function() {
                                    this.controllerManager && (this.controllerManager.destroy(), this.controllerManager = null)
                                }
                            }, {
                                key: "bootstrap",
                                value: (i = Ge(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (!this.controllerManager) {
                                                    e.next = 3;
                                                    break
                                                }
                                                return console.warn("Bootstrap was called but ControllerManager already exists!"), e.abrupt("return");
                                            case 3:
                                                return this.controllerManager = new je(this.id, this.node), e.next = 6, this.controllerManager.create();
                                            case 6:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "elementWillChange",
                                value: function(e, t, n) {
                                    return this.controllerManager.willChange(t, n)
                                }
                            }, {
                                key: "elementDidChange",
                                value: (o = Ge(regeneratorRuntime.mark((function e(t, n, r) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return this.node = n, e.next = 3, this.controllerManager.didChange(n, r);
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t, n) {
                                    return o.apply(this, arguments)
                                })
                            }], n && He(t.prototype, n), r && He(t, r), e
                        }(),
                        Ue = n(81267);

                },
                38336: function(e, t, n) {
                    "use strict";
                    n.d(t, {
                        h: function() {
                            return ae
                        },
                        Z: function() {
                            return ue
                        }
                    });
                    n(92338);
                    var r = n(76746),
                        o = n.n(r),
                        i = n(54278),
                        a = function(e) {
                            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50,
                                n = null,
                                r = function() {
                                    for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) o[i] = arguments[i];
                                    n || (n = setTimeout((function() {
                                        e.apply(void 0, o), n = null
                                    }), t))
                                };
                            return r.cancel = function() {
                                clearTimeout(n), n = null
                            }, r
                        },
                        u = n(45301),
                        c = n(71926),
                        s = n(53659);

                    function l(e) {
                        return l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, l(e)
                    }

                    function f(e, t) {}

                    function d(e, t) {
                        return d = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, d(e, t)
                    }

                    function p(e) {
                        var t = function() {
                            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                            if (Reflect.construct.sham) return !1;
                            if ("function" == typeof Proxy) return !0;
                            try {
                                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                            } catch (e) {
                                return !1
                            }
                        }();
                        return function() {
                            var n, r = g(e);
                            if (t) {
                                var o = g(this).constructor;
                                n = Reflect.construct(r, arguments, o)
                            } else n = r.apply(this, arguments);
                            return h(this, n)
                        }
                    }

                    function h(e, t) {
                        return !t || "object" !== l(t) && "function" != typeof t ? v(e) : t
                    }

                    function v(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function g(e) {
                        return g = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, g(e)
                    }

                    function m(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    var b = function(e) {
                        ! function(e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), t && d(e, t)
                        }(i, e);
                        var t, n, r, o = p(i);

                        function i(e) {
                            var t;
                            ! function(e, t) {}(this, i), m(v(t = o.call(this, e)), "onClick", (function() {
                                return t.props.onClick()
                            })), m(v(t), "open", (function() {
                                t.state.isOpen || t.updateOpenState(!0)
                            })), m(v(t), "close", (function() {
                                t.state.isOpen && t.updateOpenState(!1)
                            })), m(v(t), "updateOpenState", (function(e) {
                                t.setState({
                                    isOpen: e
                                });
                                var n = t.props,
                                    r = n.node,
                                    o = n.activeClass,
                                    i = n.openTitleSelector,
                                    a = n.closeTitleSelector,
                                    u = r.querySelector(i),
                                    c = r.querySelector(a);
                                e ? (r.classList.add(o), u.setAttribute("hidden", ""), c.removeAttribute("hidden")) : (r.classList.remove(o), u.removeAttribute("hidden"), c.setAttribute("hidden", ""))
                            }));
                            var n = t.props.node;
                            return t.state = {}, t.updateOpenState(!1), n.addEventListener("click", t.onClick), t
                        }
                        return t = i, (n = [{}]) && f(t.prototype, n), r && f(t, r), i
                    }(u.Z);

                    function y(e) {
                        return y = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, y(e)
                    }

                    function w(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function x(e, t) {
                        return x = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, x(e, t)
                    }

                    function S(e) {
                        var t = function() {
                            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                            if (Reflect.construct.sham) return !1;
                            if ("function" == typeof Proxy) return !0;
                            try {
                                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                            } catch (e) {
                                return !1
                            }
                        }();
                        return function() {
                            var n, r = E(e);
                            if (t) {
                                var o = E(this).constructor;
                                n = Reflect.construct(r, arguments, o)
                            } else n = r.apply(this, arguments);
                            return k(this, n)
                        }
                    }

                    function k(e, t) {
                        return !t || "object" !== y(t) && "function" != typeof t ? O(e) : t
                    }

                    function O(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function E(e) {
                        return E = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, E(e)
                    }

                    function R(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    m(b, "defaultProps", {
                        node: document.createElement("div"),
                        onClick: s.Z,
                        activeClass: "burger--active",
                        openTitleSelector: ".js-header-burger-open-title",
                        closeTitleSelector: ".js-header-burger-close-title"
                    });
                    var P = function(e) {
                        ! function(e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), t && x(e, t)
                        }(a, e);
                        var t, n, r, o = S(a);

                        function a(e) {
                            var t;
                            ! function(e, t) {}(this, a), R(O(t = o.call(this, e)), "initFolders", (function(e, t) {
                                return t.reduce((function(t, n) {
                                    return t[n.dataset.folder] = n, e.appendChild(n), t
                                }), {})
                            })), R(O(t), "setInitialState", (function() {})), R(O(t), "setActiveFolder", (function(e) {
                                var n = t.props.folderActiveClass;
                                e.classList.add(n), t.revertFocusContainment && t.revertFocusContainment(), t.revertFocusContainment = (0, i.mQ)({
                                    predicate: function(t) {
                                        return t.closest("[data-folder]") === e
                                    },
                                    root: t.ref.list,
                                    setFocusOnContain: !1,
                                    restoreFocusOnRevert: !1
                                })
                            })), R(O(t), "onKeyUp", (function(e) {
                                27 === e.keyCode && (e.stopPropagation(), 1 === t.depth.length ? t.props.header.closeMenuOverlay() : t.onParentFolderOpen(e))
                            })), R(O(t), "handleItemSelect", (function(e) {
                                var n = t.props.folderLinkSelector,
                                    r = e.target,
                                    o = document.location.hostname === e.target.hostname && document.location.pathname === e.target.pathname,
                                    i = "" !== e.target.hash;
                                o && i && t.props.header.closeMenuOverlay(), r.matches(n) && t.handleFolderSelect(e)
                            })), R(O(t), "handleFolderSelect", (function(e) {
                                var n = e.target.dataset.folderId;
                                if (t.folders[n]) {
                                    e.preventDefault();
                                    var r = t.folders[n];
                                    t.onSubFolderOpen(r);
                                    var o = t.props.controlBackSelector,
                                        i = r.querySelector(o);
                                    i && i.focus()
                                }
                            })), R(O(t), "onSubFolderOpen", (function(e) {
                                if (!t.depth.includes(e)) {
                                    var n = t.props.folderOpenClass,
                                        r = t.depth[t.depth.length - 1];
                                    e.scrollTop = 0, r.classList.add(n), t.setActiveFolder(e), t.depth.push(e)
                                }
                            })), R(O(t), "onParentFolderOpen", (function(e) {
                                e.preventDefault();
                                var n = t.props,
                                    r = n.folderActiveClass,
                                    o = n.folderOpenClass;
                                if (!(t.depth.length <= 1)) {
                                    var i = t.depth[t.depth.length - 1];
                                    i.classList.remove(r);
                                    var a = i.dataset.folder,
                                        u = t.props.folderLinkSelector,
                                        c = u.trim().substring(1, u.length - 1),
                                        s = document.querySelector("[".concat(c, '="').concat(a, '"]'));
                                    s && s.focus(), t.depth.pop(), (i = t.depth[t.depth.length - 1]).classList.remove(o), t.setActiveFolder(i)
                                }
                            })), R(O(t), "open", (function() {
                                t.setInitialState(), document.addEventListener("keyup", t.onKeyUp)
                            })), R(O(t), "close", (function() {
                                document.removeEventListener("keyup", t.onKeyUp), t.revertFocusContainment && t.revertFocusContainment()
                            }));
                            var n = t.props,
                                r = n.node,
                                u = n.listSelector,
                                c = n.folderSelector,
                                s = n.controlBackSelector;
                            return t.state = {}, t.depth = [], t.ref = {
                                list: r.querySelector(u),
                                folders: Array.from(r.querySelectorAll(c)),
                                controlBack: document.querySelectorAll(s)
                            }, t.folders = t.initFolders(t.ref.list, t.ref.folders), t.revertFocusContainment = null, t.setInitialState(), t.bindListeners(), t
                        }
                        return t = a, (n = [{
                            key: "bindListeners",
                            value: function() {
                                var e = this;
                                this.props.node.addEventListener("click", this.handleItemSelect), this.ref.controlBack && this.ref.controlBack.forEach((function(t) {
                                    return t.addEventListener("click", e.onParentFolderOpen)
                                }))
                            }
                        }, {
                            key: "unbindListeners",
                            value: function() {
                                var e = this;
                                this.ref.node.removeEventListener("click", this.handleItemSelect), this.ref.controlBack && this.ref.controlBack.forEach((function(t) {
                                    return t.removeEventListener("click", e.onParentFolderOpen)
                                }))
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                this.unbindListeners()
                            }
                        }]) && w(t.prototype, n), r && w(t, r), a
                    }(u.Z);

                    var q = function(e) {}(u.Z),
                        G = n(1678),
                        H = n(36871),
                        V = n.n(H),
                        W = n(11500);

                    function U(e) {
                        return U = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, U(e)
                    }

                    function Y(e) {}

                    function Z(e, t) {}

                    function Q(e, t) {}

                    function X(e, t) {}

                    function J(e, t) {}

                    function $(e, t) {
                        return $ = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, $(e, t)
                    }

                    function K(e) {
                        var t = function() {
                            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                            if (Reflect.construct.sham) return !1;
                            if ("function" == typeof Proxy) return !0;
                            try {
                                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
                            } catch (e) {
                                return !1
                            }
                        }();
                        return function() {
                            var n, r = ne(e);
                            if (t) {
                                var o = ne(this).constructor;
                                n = Reflect.construct(r, arguments, o)
                            } else n = r.apply(this, arguments);
                            return ee(this, n)
                        }
                    }

                    function ee(e, t) {
                        return !t || "object" !== U(t) && "function" != typeof t ? te(e) : t
                    }

                    function te(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function ne(e) {
                        return ne = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, ne(e)
                    }

                    function re(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    var oe = "true" === o().getValue("tweak-fixed-header");

                    function ie() {
                        return window.scrollY > 10
                    }
                    var ae = function(e) {
                        ! function(e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), t && $(e, t)
                        }(s, e);
                        var t, n, r, u = K(s);

                        function s(e) {
                            var t;
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, s), re(te(t = u.call(this)), "tweaks", ["header-vert-padding", "tweak-transparent-header", "header-logo-height", "tweak-fixed-header", "tweak-fixed-header-style", "section-theme", "header-horizontal-spacing", "tweak-portfolio-index-background-width"]), re(te(t), "bindGlobalEvents", (function(e) {
                                e.forEach((function(e) {
                                    var n = e.event,
                                        r = e.handler;
                                    return window.Y.Global.on(n, r, te(t))
                                }))
                            })), re(te(t), "unbindGlobalEvents", (function(e) {
                                t.onWindowLoadGlobalHandler && window.removeEventListener("load", t.onWindowLoadGlobalHandler), window.removeEventListener(G.CQ, t.updateNeighborSections), e.forEach((function(e) {
                                    var n = e.event,
                                        r = e.handler;
                                    return window.Y.Global.detach(n, r, te(t))
                                }))
                            })), re(te(t), "observeAnnouncementBar", (function() {
                                var e = t.node.querySelector(".sqs-announcement-bar-dropzone");
                                if (e) {
                                    t.announcementBarObserver = new MutationObserver(t.dispatchHeaderHeightChangeEvent), t.announcementBarObserver.observe(e, {
                                        childList: !0,
                                        subtree: !0,
                                        attributes: !0,
                                        attributeFilter: ["class"]
                                    })
                                }
                            })), re(te(t), "dispatchHeaderHeightChangeEvent", (function() {
                                var e = t.node.getBoundingClientRect().height;
                                window.dispatchEvent(new CustomEvent(G.CQ, {
                                    detail: {
                                        headerHeight: e
                                    }
                                }))
                            })), re(te(t), "createBurgers", (function() {
                                t.burgerMobile = new b({
                                    node: t.ref.burgerMobile,
                                    onClick: t.onToggle
                                }), t.burgerDesktop = new b({
                                    node: t.ref.burgerDesktop,
                                    onClick: t.onToggle
                                })
                            })), re(te(t), "determineBurgerVisibility", (function() {
                                var e = t.node.querySelectorAll(".header-menu-nav-item:not(.user-accounts-link)"),
                                    n = 0 === e.length && t.ref.burgerContainerMobile.classList.contains("menu-overlay-does-not-have-visible-non-navigation-items"),
                                    r = 0 === e.length && t.ref.burgerContainerDesktop.classList.contains("menu-overlay-does-not-have-visible-non-navigation-items");
                                t.ref.burgerMobile.classList.toggle("hide-burger", n), t.ref.burgerDesktop.classList.toggle("hide-burger", r)
                            })), re(te(t), "openBurgers", (function() {
                                t.burgerMobile.open(), t.burgerDesktop.open()
                            })), re(te(t), "closeBurgers", (function() {
                                t.burgerMobile.close(), t.burgerDesktop.close()
                            })), re(te(t), "hasSibling", (function() {
                                return !!t.node.nextElementSibling
                            })), re(te(t), "getPageSections", (function() {
                                return t.hasSibling() ? t.node.nextElementSibling.querySelectorAll(".page-section, .sqs-empty-section") : []
                            })), re(te(t), "getFirstSection", (function() {
                                return Z(t.getPageSections(), 1)[0]
                            })), re(te(t), "isFirstSectionInset", (function() {
                                var e = t.getFirstSection();
                                return e && e.classList.contains("background-width--inset")
                            })), re(te(t), "setBurgerDisplay", (function() {
                                var e = t.node.querySelector(".header-nav-list"),
                                    n = document.querySelector(".header-display-mobile").querySelector(t.props.burgerButtonSelector);
                                (e.childNodes.length < 1 || 1 === e.childNodes.length && 1 !== e.childNodes[0].nodeType) && n.classList.add("no-nav-links")
                            })), re(te(t), "onResize", (function(e) {
                                t.updateNeighborSections(e), t.toggleFocusContainerOnMenuVisibilityChange()
                            })), re(te(t), "updateHeaderShrinkState", (function() {
                                oe && (ie() ? t.node.classList.add("shrink") : window.setTimeout((function() {
                                    t.node.classList.remove("shrink")
                                }), 300))
                            })), re(te(t), "onScroll", (function() {
                                var e = null !== document.querySelector(".sqs-edit-mode-active"),
                                    n = null !== document.querySelector(".sqs-site-styles-active");
                                if (e || n) return t.node.classList.remove("shrink"), t.showHeader(), void c.Z.off(t.onScroll);
                                t.updateScrollDisplay(), t.scrollTop = window.scrollY
                            })), re(te(t), "updateScrollDisplay", (function() {
                                "scroll back" === t.state.scrollMode && t.handleScrollBack(), t.updateHeaderShrinkState()
                            })), re(te(t), "handleScrollBack", (function() {
                                var e = t.node.matches(":focus-within");
                                if (ie() && !e) {
                                    var n = window.scrollY > t.scrollTop ? "down" : "up";
                                    "up" === n ? t.showHeaderAfterEnoughScroll() : "down" === n && t.hideHeader()
                                } else t.showHeader()
                            })), re(te(t), "showHeaderAfterEnoughScroll", (function() {
                                var e = Date.now();
                                t.pos.distance += Math.abs(window.scrollY - t.scrollTop), e - t.pos.then > 500 && (t.pos.distance = 0), t.pos.distance > 200 && t.showHeader(), t.pos.then = e
                            })), re(te(t), "showHeader", (function() {
                                t.node.style.transform = "", t.ref.headerShadow && t.ref.headerShadow.style.removeProperty("opacity")
                            })), re(te(t), "hideHeader", (function() {
                                t.node.style.transform = "translateY(-100%)", t.ref.headerShadow && (t.ref.headerShadow.style.opacity = "0")
                            })), re(te(t), "onToggle", (function() {
                                t.state.isSwitching || (t.state.isOpen ? t.closeMenuOverlay() : t.openMenuOverlay())
                            })), re(te(t), "updateHeaderTheme", (function(e) {
                                (0, W.O)(t.node, V(), e)
                            })), re(te(t), "openMenuOverlay", (function() {
                                t.state.isOpen || (t.setState({
                                    isOpen: !0,
                                    isVisible: !0,
                                    isSwitching: !0
                                }), t.node.closest("body").classList.add(t.props.headerMenuOpenClass), t.overriddenHeaderTheme = V().find((function(e) {
                                    return t.node.classList.contains(e)
                                })), t.updateHeaderTheme(t.node.dataset.menuOverlayTheme), t.openBurgers(), t.menu.open(), t.revertFocusContainment = (0, i.mQ)({
                                    container: t.node,
                                    setFocusOnContain: !1
                                }), t.setState({
                                    isSwitching: !1
                                }))
                            })), re(te(t), "closeMenuOverlay", (function() {
                                t.state.isOpen && (t.setState({
                                    isOpen: !1,
                                    isVisible: !1,
                                    isSwitching: !1
                                }), t.node.closest("body").classList.remove(t.props.headerMenuOpenClass), t.updateHeaderTheme(t.overriddenHeaderTheme), t.closeBurgers(), t.menu.close(), t.revertFocusContainment && t.revertFocusContainment(), t.setState({
                                    isSwitching: !1
                                }))
                            })), re(te(t), "isMenuVisible", (function() {
                                return "visible" === window.getComputedStyle(t.ref.menu).visibility
                            })), re(te(t), "offsetFirstSectionBackground", (function(e) {
                                var n = t.getFirstSection();
                                if (n) {
                                    var r = n.querySelector(".section-background");
                                    r && (t.isFirstSectionInset() ? r.style.top = "".concat(e, "px") : r.style.top = "")
                                }
                            })), re(te(t), "toggleHeaderTransparentOverride", (function(e) {
                                var n = t.node.querySelector(".header-announcement-bar-wrapper");
                                e ? n.classList.add(G.L8) : n.classList.remove(G.L8)
                            })), re(te(t), "updateNeighborSections", (function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                                    n = t.getPageSections(),
                                    r = Z(n, 2),
                                    o = r[0],
                                    i = r[1],
                                    a = "number" == typeof e ? e : t.node.getBoundingClientRect().height;
                                if (o) {
                                    var u = o.classList.contains("gallery-section"),
                                        c = o.classList.contains("collection-type-portfolio-hover") || o.classList.contains("collection-type-portfolio-index-background"),
                                        s = o.classList.contains("layout-engine-section"),
                                        l = o.querySelector(".section-background");
                                    if (c) {
                                        var f = "full" === o.querySelector(".portfolio-hover").dataset.width || "inset" === o.querySelector(".portfolio-hover").dataset.width,
                                            d = o.querySelector(".portfolio-hover-items"),
                                            p = o.querySelector(".section-background");
                                        f ? (o.style.paddingTop = "".concat(a, "px"), d.style.paddingTop = "", p && (p.style.top = "".concat(a, "px")), t.toggleHeaderTransparentOverride(!0)) : (o.style.paddingTop = "", d.style.paddingTop = "".concat(a, "px"), p && (p.style.top = ""), t.toggleHeaderTransparentOverride(!1))
                                    } else o.style.paddingTop = "".concat(a, "px"), u || t.offsetFirstSectionBackground(a);
                                    l && s && (t.isFirstSectionInset() ? l.style.top = "".concat(a, "px") : l.style.top = ""), t.updateSectionWrapper(o, !0)
                                }
                                i && (i.style.paddingTop && (i.style.paddingTop = ""), t.updateSectionWrapper(i, !1)), t.ref.menu.style.paddingTop = "".concat(a, "px"), window.Y && window.Y.Global && window.Y.Global.fire("headerHeight", {
                                    headerHeight: a
                                }), t.addPaddingToSystemPages()
                            })), re(te(t), "toggleFocusContainerOnMenuVisibilityChange", (function() {
                                t.state.isOpen && (!t.state.isVisible && t.isMenuVisible() ? (t.revertFocusContainment = (0, i.mQ)({
                                    container: t.node
                                }), t.setState({
                                    isVisible: !0
                                })) : t.state.isVisible && !t.isMenuVisible() && (t.revertFocusContainment && t.revertFocusContainment(), t.setState({
                                    isVisible: !1
                                })))
                            })), re(te(t), "addPaddingToSystemPages", (function() {
                                var e = document.querySelector(".system-page"),
                                    n = t.node.getBoundingClientRect().height;
                                e && (e.style.paddingTop = "".concat(n, "px"))
                            })), re(te(t), "updateSectionWrapper", (function(e, n) {
                                var r, o, i = e.dataset.sectionId,
                                    a = null === (r = "sqs-site-frame" === (null == (o = window.frameElement) ? void 0 : o.id) ? o.ownerDocument : null) || void 0 === r ? void 0 : r.querySelector('[data-template-getter="section-editor-ui-'.concat(i, '"]')),
                                    u = '[data-template-getter="section-wrapper"]',
                                    c = a ? a.querySelector(u) : e.querySelector(u);
                                if (c) {
                                    var s = t.node.getBoundingClientRect().height,
                                        l = "calc(100% - ".concat(s, "px)");
                                    c.style.height = n ? l : "100%", c.style.top = n ? s + "px" : 0
                                }
                            })), t.node = e, t.state = {
                                isOpen: !1,
                                isVisible: !1,
                                isSwitching: !1,
                                scrollMode: o().getValue("tweak-fixed-header-style").toLowerCase()
                            };
                            var n = t.props,
                                r = n.burgerContainerSelector,
                                l = n.burgerButtonSelector,
                                f = n.navWrapperSelector,
                                d = n.navListSelector,
                                p = n.menuSelector,
                                h = n.titleLogoSelector,
                                v = n.headerShadowSelector,
                                g = t.node.querySelector(".header-display-desktop"),
                                m = t.node.querySelector(".header-display-mobile"),
                                y = m.querySelector(l),
                                w = g.querySelector(l),
                                x = m.querySelector(r),
                                S = g.querySelector(r);
                            t.ref = {
                                burgerContainerDesktop: S,
                                burgerContainerMobile: x,
                                burgerDesktop: w,
                                burgerMobile: y,
                                navWrapper: t.node.querySelector(f),
                                navList: t.node.querySelector(d),
                                menu: t.node.querySelector(p),
                                titleLogo: t.node.querySelector(h),
                                headerShadow: t.node.querySelector(v)
                            }, t.updateHeaderShrinkState(), t.pos = {
                                distance: 0,
                                then: 0
                            }, t.createBurgers(), t.determineBurgerVisibility(), t.menu = new P({
                                node: t.ref.menu,
                                header: te(t)
                            }), t.scrollTop = window.scrollY, t.onScroll = a(t.onScroll, 100), t.setBurgerDisplay(), t.globalEvents = [{
                                event: "frame:device:change",
                                handler: t.closeMenuOverlay
                            }, {
                                event: "header:menuOverlay:opened",
                                handler: t.openMenuOverlay
                            }, {
                                event: "header:menuOverlay:closed",
                                handler: t.closeMenuOverlay
                            }], t.observeAnnouncementBar(), t.bindListeners(), t.onResize(), Y(t.node.querySelectorAll(t.props.folderTitleSelector)).forEach((function(e) {
                                e.addEventListener("click", (function(e) {
                                    e.preventDefault()
                                }))
                            }));
                            var k = t.node.querySelector("#multilingual-language-picker-desktop"),
                                O = t.node.querySelector("#multilingual-language-picker-mobile");
                            k && O && new q({
                                headerNode: t.node
                            }).checkWeglotAndInitialize();
                            return t
                        }
                        return t = s, (n = [{
                            key: "bindListeners",
                            value: function() {
                                var e = this;
                                oe && (c.Z.on(this.onScroll), this.node.addEventListener("focusin", this.showHeader)), "complete" === document.readyState ? this.bindGlobalEvents(this.globalEvents) : (this.onWindowLoadGlobalHandler = function() {
                                    return e.bindGlobalEvents(e.globalEvents)
                                }, window.addEventListener("load", this.onWindowLoadGlobalHandler)), window.addEventListener(G.CQ, this.updateNeighborSections), this.ref.titleLogo && (this.ref.titleLogo.complete && this.updateNeighborSections(), this.ref.titleLogo.addEventListener("load", this.updateNeighborSections)), this.resizeObserver = new ResizeObserver((function(t) {
                                    var n = t[0].contentRect.height;
                                    "fixed" === window.getComputedStyle(e.ref.menu).position && e.onResize(n)
                                })), this.resizeObserver.observe(this.node)
                            }
                        }, {
                            key: "unbindListeners",
                            value: function() {
                                this.unbindGlobalEvents(this.globalEvents), this.node.removeEventListener("focusin", this.showHeader), this.onScroll.cancel && this.onScroll.cancel(), c.Z.off(this.onScroll), this.ref.titleLogo && this.ref.titleLogo.removeEventListener("load", this.updateNeighborSections)
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                this.unbindListeners(), this.announcementBarObserver && this.announcementBarObserver.disconnect()
                            }
                        }]) && J(t.prototype, n), r && J(t, r), s
                    }(u.Z);
                    re(ae, "defaultProps", {
                        headerMenuOpenClass: "header--menu-open",
                        burgerContainerSelector: ".header-burger",
                        burgerButtonSelector: ".header-burger-btn",
                        navWrapperSelector: ".header-nav-wrapper",
                        navListSelector: ".header-nav-list",
                        menuSelector: ".header-menu",
                        folderTitleSelector: ".header-nav-folder-title",
                        titleLogoSelector: ".header-title-logo img",
                        headerShadowSelector: ".header-dropshadow",
                        themesClasses: V()
                    });
                    var ue = function(e) {
                        return new ae(e)
                    }
                },
                83686: function(e, t, n) {},
                1678: function(e, t, n) {},
                36871: function(e) {
                    e.exports = ["white", "white-bold", "light", "light-bold", "dark", "dark-bold", "black", "black-bold", "bright", "bright-inverse"]
                },
                45301: function(e, t, n) {
                    "use strict";

                    function r(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function(t) {
                                return Object.getOwnPropertyDescriptor(e, t).enumerable
                            }))), n.push.apply(n, r)
                        }
                        return n
                    }

                    function o(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? r(Object(n), !0).forEach((function(t) {
                                a(e, t, n[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                            }))
                        }
                        return e
                    }

                    function i(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n.d(t, {
                        Z: function() {
                            return u
                        }
                    });
                    var u = function() {
                        function e(t) {
                            var n = this;
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), a(this, "setState", (function(e) {
                                n.state = o(o({}, n.state), e)
                            })), this.props = o(o({}, this.constructor.defaultProps), t), this.state = o(o({}, this.constructor.defaultState), this.constructor.state), window.Y && window.Y.Global && window.Y.Global.after("frame:device:change", this.flushResizeOnDeviceChange, this)
                        }
                        var t, n, r;
                        return t = e, (n = [{
                            key: "flushResizeOnDeviceChange",
                            value: function() {
                                this.onResize && this.onResize.flush && this.onResize.flush()
                            }
                        }, {
                            key: "destroy",
                            value: function() {
                                window.Y && window.Y.Global && window.Y.Global.detach("frame:device:change", this.flushResizeOnDeviceChange, this)
                            }
                        }]) && i(t.prototype, n), r && i(t, r), e
                    }();
                    a(u, "defaultProps", {}), a(u, "defaultState", {})
                },
                8477: function(e, t, n) {},
                81267: function(e, t, n) {},
                79305: function(e, t, n) {},
                83987: function(e, t) {},
                53659: function(e, t, n) {},
                73020: function(e, t, n) {
                    "use strict";
                    n.d(t, {
                        a: function() {
                            return o
                        }
                    });
                    n(92338);
                    var r = /[^[.\]]+/g,
                        o = function e(t, n) {
                            var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                            if (null == t) return o;
                            var i = Array.isArray(n) ? n : n.match(r);
                            return i.length ? e(t[i.shift()], i, o) : t
                        }
                },
                71926: function(e, t, n) {},
                11500: function(e, t, n) {
                    "use strict";
                    n.d(t, {
                        O: function() {
                            return r
                        }
                    });
                    n(92338);

                    function r(e, t, n) {
                        ! function(e, t) {
                            t.forEach((function(t) {
                                "string" == typeof t && e.classList.remove(t)
                            }))
                        }(e, t), n && e.classList.add(n)
                    }
                },
                86382: function() {},
                35666: function(e) {
                    var t = function(e) {
                        "use strict";
                        var t, n = Object.prototype,
                            r = n.hasOwnProperty,
                            o = "function" == typeof Symbol ? Symbol : {},
                            i = o.iterator || "@@iterator",
                            a = o.asyncIterator || "@@asyncIterator",
                            u = o.toStringTag || "@@toStringTag";

                        function c(e, t, n) {
                            return Object.defineProperty(e, t, {
                                value: n,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }), e[t]
                        }
                        try {
                            c({}, "")
                        } catch (e) {
                            c = function(e, t, n) {
                                return e[t] = n
                            }
                        }

                        function s(e, t, n, r) {
                            var o = t && t.prototype instanceof g ? t : g,
                                i = Object.create(o.prototype),
                                a = new L(r || []);
                            return i._invoke = function(e, t, n) {
                                var r = f;
                                return function(o, i) {
                                    if (r === p) throw new Error("Generator is already running");
                                    if (r === h) {
                                        if ("throw" === o) throw i;
                                        return I()
                                    }
                                    for (n.method = o, n.arg = i;;) {
                                        var a = n.delegate;
                                        if (a) {
                                            var u = E(a, n);
                                            if (u) {
                                                if (u === v) continue;
                                                return u
                                            }
                                        }
                                        if ("next" === n.method) n.sent = n._sent = n.arg;
                                        else if ("throw" === n.method) {
                                            if (r === f) throw r = h, n.arg;
                                            n.dispatchException(n.arg)
                                        } else "return" === n.method && n.abrupt("return", n.arg);
                                        r = p;
                                        var c = l(e, t, n);
                                        if ("normal" === c.type) {
                                            if (r = n.done ? h : d, c.arg === v) continue;
                                            return {
                                                value: c.arg,
                                                done: n.done
                                            }
                                        }
                                        "throw" === c.type && (r = h, n.method = "throw", n.arg = c.arg)
                                    }
                                }
                            }(e, n, a), i
                        }

                        function l(e, t, n) {
                            try {
                                return {
                                    type: "normal",
                                    arg: e.call(t, n)
                                }
                            } catch (e) {
                                return {
                                    type: "throw",
                                    arg: e
                                }
                            }
                        }
                        e.wrap = s;
                        var f = "suspendedStart",
                            d = "suspendedYield",
                            p = "executing",
                            h = "completed",
                            v = {};

                        function g() {}

                        function m() {}

                        function b() {}
                        var y = {};
                        c(y, i, (function() {
                            return this
                        }));
                        var w = Object.getPrototypeOf,
                            x = w && w(w(A([])));
                        x && x !== n && r.call(x, i) && (y = x);
                        var S = b.prototype = g.prototype = Object.create(y);

                        function k(e) {
                            ["next", "throw", "return"].forEach((function(t) {
                                c(e, t, (function(e) {
                                    return this._invoke(t, e)
                                }))
                            }))
                        }

                        function O(e, t) {
                            function n(o, i, a, u) {
                                var c = l(e[o], e, i);
                                if ("throw" !== c.type) {
                                    var s = c.arg,
                                        f = s.value;
                                    return f && "object" == typeof f && r.call(f, "__await") ? t.resolve(f.__await).then((function(e) {
                                        n("next", e, a, u)
                                    }), (function(e) {
                                        n("throw", e, a, u)
                                    })) : t.resolve(f).then((function(e) {
                                        s.value = e, a(s)
                                    }), (function(e) {
                                        return n("throw", e, a, u)
                                    }))
                                }
                                u(c.arg)
                            }
                            var o;
                            this._invoke = function(e, r) {
                                function i() {
                                    return new t((function(t, o) {
                                        n(e, r, t, o)
                                    }))
                                }
                                return o = o ? o.then(i, i) : i()
                            }
                        }

                        function E(e, n) {
                            var r = e.iterator[n.method];
                            if (r === t) {
                                if (n.delegate = null, "throw" === n.method) {
                                    if (e.iterator.return && (n.method = "return", n.arg = t, E(e, n), "throw" === n.method)) return v;
                                    n.method = "throw", n.arg = new TypeError("The iterator does not provide a 'throw' method")
                                }
                                return v
                            }
                            var o = l(r, e.iterator, n.arg);
                            if ("throw" === o.type) return n.method = "throw", n.arg = o.arg, n.delegate = null, v;
                            var i = o.arg;
                            return i ? i.done ? (n[e.resultName] = i.value, n.next = e.nextLoc, "return" !== n.method && (n.method = "next", n.arg = t), n.delegate = null, v) : i : (n.method = "throw", n.arg = new TypeError("iterator result is not an object"), n.delegate = null, v)
                        }

                        function R(e) {
                            var t = {
                                tryLoc: e[0]
                            };
                            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
                        }

                        function P(e) {
                            var t = e.completion || {};
                            t.type = "normal", delete t.arg, e.completion = t
                        }

                        function L(e) {
                            this.tryEntries = [{
                                tryLoc: "root"
                            }], e.forEach(R, this), this.reset(!0)
                        }

                        function A(e) {
                            if (e) {
                                var n = e[i];
                                if (n) return n.call(e);
                                if ("function" == typeof e.next) return e;
                                if (!isNaN(e.length)) {
                                    var o = -1,
                                        a = function n() {
                                            for (; ++o < e.length;)
                                                if (r.call(e, o)) return n.value = e[o], n.done = !1, n;
                                            return n.value = t, n.done = !0, n
                                        };
                                    return a.next = a
                                }
                            }
                            return {
                                next: I
                            }
                        }

                        function I() {
                            return {
                                value: t,
                                done: !0
                            }
                        }
                        return m.prototype = b, c(S, "constructor", b), c(b, "constructor", m), m.displayName = c(b, u, "GeneratorFunction"), e.isGeneratorFunction = function(e) {
                            var t = "function" == typeof e && e.constructor;
                            return !!t && (t === m || "GeneratorFunction" === (t.displayName || t.name))
                        }, e.mark = function(e) {
                            return Object.setPrototypeOf ? Object.setPrototypeOf(e, b) : (e.__proto__ = b, c(e, u, "GeneratorFunction")), e.prototype = Object.create(S), e
                        }, e.awrap = function(e) {
                            return {
                                __await: e
                            }
                        }, k(O.prototype), c(O.prototype, a, (function() {
                            return this
                        })), e.AsyncIterator = O, e.async = function(t, n, r, o, i) {
                            void 0 === i && (i = Promise);
                            var a = new O(s(t, n, r, o), i);
                            return e.isGeneratorFunction(n) ? a : a.next().then((function(e) {
                                return e.done ? e.value : a.next()
                            }))
                        }, k(S), c(S, u, "Generator"), c(S, i, (function() {
                            return this
                        })), c(S, "toString", (function() {
                            return "[object Generator]"
                        })), e.keys = function(e) {
                            var t = [];
                            for (var n in e) t.push(n);
                            return t.reverse(),
                                function n() {
                                    for (; t.length;) {
                                        var r = t.pop();
                                        if (r in e) return n.value = r, n.done = !1, n
                                    }
                                    return n.done = !0, n
                                }
                        }, e.values = A, L.prototype = {
                            constructor: L,
                            reset: function(e) {
                                if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(P), !e)
                                    for (var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = t)
                            },
                            stop: function() {
                                this.done = !0;
                                var e = this.tryEntries[0].completion;
                                if ("throw" === e.type) throw e.arg;
                                return this.rval
                            },
                            dispatchException: function(e) {
                                if (this.done) throw e;
                                var n = this;

                                function o(r, o) {
                                    return u.type = "throw", u.arg = e, n.next = r, o && (n.method = "next", n.arg = t), !!o
                                }
                                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                    var a = this.tryEntries[i],
                                        u = a.completion;
                                    if ("root" === a.tryLoc) return o("end");
                                    if (a.tryLoc <= this.prev) {
                                        var c = r.call(a, "catchLoc"),
                                            s = r.call(a, "finallyLoc");
                                        if (c && s) {
                                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                                            if (this.prev < a.finallyLoc) return o(a.finallyLoc)
                                        } else if (c) {
                                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0)
                                        } else {
                                            if (!s) throw new Error("try statement without catch or finally");
                                            if (this.prev < a.finallyLoc) return o(a.finallyLoc)
                                        }
                                    }
                                }
                            },
                            abrupt: function(e, t) {
                                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                    var o = this.tryEntries[n];
                                    if (o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                                        var i = o;
                                        break
                                    }
                                }
                                i && ("break" === e || "continue" === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
                                var a = i ? i.completion : {};
                                return a.type = e, a.arg = t, i ? (this.method = "next", this.next = i.finallyLoc, v) : this.complete(a)
                            },
                            complete: function(e, t) {
                                if ("throw" === e.type) throw e.arg;
                                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), v
                            },
                            finish: function(e) {
                                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                    var n = this.tryEntries[t];
                                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), P(n), v
                                }
                            },
                            catch: function(e) {
                                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                    var n = this.tryEntries[t];
                                    if (n.tryLoc === e) {
                                        var r = n.completion;
                                        if ("throw" === r.type) {
                                            var o = r.arg;
                                            P(n)
                                        }
                                        return o
                                    }
                                }
                                throw new Error("illegal catch attempt")
                            },
                            delegateYield: function(e, n, r) {
                                return this.delegate = {
                                    iterator: A(e),
                                    resultName: n,
                                    nextLoc: r
                                }, "next" === this.method && (this.arg = t), v
                            }
                        }, e
                    }(e.exports);
                    try {
                        regeneratorRuntime = t
                    } catch (e) {
                        "object" == typeof globalThis ? globalThis.regeneratorRuntime = t : Function("r", "regeneratorRuntime = r")(t)
                    }
                },
                92338: function(e) {}
            },
            i = {};

        function a(e) {
            var t = i[e];
            if (void 0 !== t) return t.exports;
            var n = i[e] = {
                id: e,
                loaded: !1,
                exports: {}
            };
            return o[e].call(n.exports, n, n.exports, a), n.loaded = !0, n.exports
        }
        a.m = o, a.n = function(e) {
                var t = e && e.__esModule ? function() {
                    return e.default
                } : function() {
                    return e
                };
                return a.d(t, {
                    a: t
                }), t
            }, t = Object.getPrototypeOf ? function(e) {
                return Object.getPrototypeOf(e)
            } : function(e) {
                return e.__proto__
            }, a.t = function(n, r) {
                if (1 & r && (n = this(n)), 8 & r) return n;
                if ("object" == typeof n && n) {
                    if (4 & r && n.__esModule) return n;
                    if (16 & r && "function" == typeof n.then) return n
                }
                var o = Object.create(null);
                a.r(o);
                var i = {};
                e = e || [null, t({}), t([]), t(t)];
                for (var u = 2 & r && n;
                    "object" == typeof u && !~e.indexOf(u); u = t(u)) Object.getOwnPropertyNames(u).forEach((function(e) {
                    i[e] = function() {
                        return n[e]
                    }
                }));
                return i.default = function() {
                    return n
                }, a.d(o, i), o
            }, a.d = function(e, t) {
                for (var n in t) a.o(t, n) && !a.o(e, n) && Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: t[n]
                })
            }, a.f = {}, a.e = function(e) {}, a.u = function(e) {}, a.g = function() {
                if ("object" == typeof globalThis) return globalThis;
                try {
                    return this || new Function("return this")()
                } catch (e) {
                    if ("object" == typeof window) return window
                }
            }(), a.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }, n = {}, r = "new-bedford-framework:", a.l = function(e, t, o, i) {
                if (n[e]) n[e].push(t);
                else {}
            }, a.r = function(e) {}, a.nmd = function(e) {},
            function() {}(),
            function() {}();
        var u = {};
        return function() {
            "use strict";
            a.r(u);
            a(92338), a(35666);
            var e = (0, a(73020).a)(window, "Static.SQUARESPACE_CONTEXT.templateScriptsRootUrl"),
                t = "scripts/";
            "localhost" === window.location.hostname ? a.p = window.location.origin + "/" : e && e.endsWith(t) && (a.p = e.slice(0, -t.length));
            a(86382),
                function() {
                    if ("function" == typeof window.CustomEvent) return !1;
                    window.CustomEvent = function(e, t) {
                        t = t || {
                            bubbles: !1,
                            cancelable: !1,
                            detail: null
                        };
                        var n = document.createEvent("CustomEvent");
                        return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n
                    }
                }();

            var h = a(81267),
                v = a(82767);

  

            function w(e, t, n, r, o, i, a) {
                try {
                    var u = e[i](a),
                        c = u.value
                } catch (e) {
                    return void n(e)
                }
                u.done ? t(c) : Promise.resolve(c).then(r, o)
            }

            function x(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise((function(r, o) {
                        var i = e.apply(t, n);

                        function a(e) {
                            w(i, r, o, a, u, "next", e)
                        }

                        function u(e) {
                            w(i, r, o, a, u, "throw", e)
                        }
                        a(void 0)
                    }))
                }
            }

            function O() {
                return (O = x(regeneratorRuntime.mark((function e() {
                    var t, r, o, a, u, c, l;
                    return regeneratorRuntime.wrap((function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                return t = [], r = null, o = null, a = null, (u = document.querySelector("[data-page-sections]")) && (r = new v.R4(u), t.push(r.bootstrap())), (c = document.querySelector("[data-footer-sections]")) && (o = new v.R4(c), t.push(o.bootstrap())), (l = document.querySelector("#header")) && (a = new v.C1(l, "header"), t.push(a.bootstrap())), e.prev = 7, e.next = 10, Promise.all([].concat(t, [S({
                                    pageSectionEventsManager: r,
                                    footerSectionEventsManager: o,
                                    headerEventsManager: a
                                })]));
                            case 10:
                                e.next = 15;
                                break;
                            case 12:
                                e.prev = 12, e.t0 = e.catch(7), console.error("Error bootstrapping controllers", e.t0);
                            case 15:
                                return e.prev = 15, s.Z && (window.addEventListener("pagehide", (function() {
                                    var e, t, n;
                                    null === (e = r) || void 0 === e || e.destroy(), null === (t = o) || void 0 === t || t.destroy(), null === (n = a) || void 0 === n || n.destroy()
                                })), window.addEventListener("beforeunload", (function() {}))), e.finish(15);
                            case 18:
                                i(), d(), (0, n.J)(), b();
                            case 22:
                            case "end":
                                return e.stop()
                        }
                    }), e, null, [
                        [7, 12, 15, 18]
                    ])
                })))).apply(this, arguments)
            }
            var E = !1;

            function R() {
                if (!E && ["interactive", "complete"].includes(document.readyState)) return E = !0,
                    function() {
                        return O.apply(this, arguments)
                    }()
            }
            window.addEventListener("DOMContentLoaded", (function() {
                R()
            })), R()
        }(), u
    }()
}));