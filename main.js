function searchingBody() {
    return $("body").addClass("searching"), $(".big-search-bar input").each(function() {
        $(this).blur()
    }), !0
}! function(a, b) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", b) : "object" == typeof module && module.exports ? module.exports = b() : a.EvEmitter = b()
}(this, function() {
    function a() {}
    var b = a.prototype;
    return b.on = function(a, b) {
        if (a && b) {
            var c = this._events = this._events || {},
                d = c[a] = c[a] || [];
            return -1 == d.indexOf(b) && d.push(b), this
        }
    }, b.once = function(a, b) {
        if (a && b) {
            this.on(a, b);
            var c = this._onceEvents = this._onceEvents || {},
                d = c[a] = c[a] || [];
            return d[b] = !0, this
        }
    }, b.off = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            var d = c.indexOf(b);
            return -1 != d && c.splice(d, 1), this
        }
    }, b.emitEvent = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            var d = 0,
                e = c[d];
            b = b || [];
            for (var f = this._onceEvents && this._onceEvents[a]; e;) {
                var g = f && f[e];
                g && (this.off(a, e), delete f[e]), e.apply(this, b), d += g ? 0 : 1, e = c[d]
            }
            return this
        }
    }, a
}),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(c) {
            return b(a, c)
        }) : "object" == typeof module && module.exports ? module.exports = b(a, require("ev-emitter")) : a.imagesLoaded = b(a, a.EvEmitter)
    }(window, function(a, b) {
        function c(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }

        function d(a) {
            var b = [];
            if (Array.isArray(a)) b = a;
            else if ("number" == typeof a.length)
                for (var c = 0; c < a.length; c++) b.push(a[c]);
            else b.push(a);
            return b
        }

        function e(a, b, f) {
            return this instanceof e ? ("string" == typeof a && (a = document.querySelectorAll(a)), this.elements = d(a), this.options = c({}, this.options), "function" == typeof b ? f = b : c(this.options, b), f && this.on("always", f), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function() {
                this.check()
            }.bind(this))) : new e(a, b, f)
        }

        function f(a) {
            this.img = a
        }

        function g(a, b) {
            this.url = a, this.element = b, this.img = new Image
        }
        var h = a.jQuery,
            i = a.console;
        e.prototype = Object.create(b.prototype), e.prototype.options = {}, e.prototype.getImages = function() {
            this.images = [], this.elements.forEach(this.addElementImages, this)
        }, e.prototype.addElementImages = function(a) {
            "IMG" == a.nodeName && this.addImage(a), this.options.background === !0 && this.addElementBackgroundImages(a);
            var b = a.nodeType;
            if (b && j[b]) {
                for (var c = a.querySelectorAll("img"), d = 0; d < c.length; d++) {
                    var e = c[d];
                    this.addImage(e)
                }
                if ("string" == typeof this.options.background) {
                    var f = a.querySelectorAll(this.options.background);
                    for (d = 0; d < f.length; d++) {
                        var g = f[d];
                        this.addElementBackgroundImages(g)
                    }
                }
            }
        };
        var j = {
            1: !0,
            9: !0,
            11: !0
        };
        return e.prototype.addElementBackgroundImages = function(a) {
            var b = getComputedStyle(a);
            if (b)
                for (var c = /url\((['"])?(.*?)\1\)/gi, d = c.exec(b.backgroundImage); null !== d;) {
                    var e = d && d[2];
                    e && this.addBackground(e, a), d = c.exec(b.backgroundImage)
                }
        }, e.prototype.addImage = function(a) {
            var b = new f(a);
            this.images.push(b)
        }, e.prototype.addBackground = function(a, b) {
            var c = new g(a, b);
            this.images.push(c)
        }, e.prototype.check = function() {
            function a(a, c, d) {
                setTimeout(function() {
                    b.progress(a, c, d)
                })
            }
            var b = this;
            return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(b) {
                b.once("progress", a), b.check()
            }) : void this.complete()
        }, e.prototype.progress = function(a, b, c) {
            this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emitEvent("progress", [this, a, b]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && i && i.log("progress: " + c, a, b)
        }, e.prototype.complete = function() {
            var a = this.hasAnyBroken ? "fail" : "done";
            if (this.isComplete = !0, this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
                var b = this.hasAnyBroken ? "reject" : "resolve";
                this.jqDeferred[b](this)
            }
        }, f.prototype = Object.create(b.prototype), f.prototype.check = function() {
            var a = this.getIsImageComplete();
            return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
        }, f.prototype.getIsImageComplete = function() {
            return this.img.complete && void 0 !== this.img.naturalWidth
        }, f.prototype.confirm = function(a, b) {
            this.isLoaded = a, this.emitEvent("progress", [this, this.img, b])
        }, f.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, f.prototype.onload = function() {
            this.confirm(!0, "onload"), this.unbindEvents()
        }, f.prototype.onerror = function() {
            this.confirm(!1, "onerror"), this.unbindEvents()
        }, f.prototype.unbindEvents = function() {
            this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
        }, g.prototype = Object.create(f.prototype), g.prototype.check = function() {
            this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
            var a = this.getIsImageComplete();
            a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
        }, g.prototype.unbindEvents = function() {
            this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
        }, g.prototype.confirm = function(a, b) {
            this.isLoaded = a, this.emitEvent("progress", [this, this.element, b])
        }, e.makeJQueryPlugin = function(b) {
            b = b || a.jQuery, b && (h = b, h.fn.imagesLoaded = function(a, b) {
                var c = new e(this, a, b);
                return c.jqDeferred.promise(h(this))
            })
        }, e.makeJQueryPlugin(), e
    }), ! function(a) {
    function b() {}

    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }

        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                            k = a.data(j, b);
                        if (k)
                            if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                var l = k[e].apply(k, g);
                                if (void 0 !== l) return l
                            } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b)
            }, a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
}(window),
    function(a) {
        function b(b) {
            var c = a.event;
            return c.target = c.target || c.srcElement || b, c
        }
        var c = document.documentElement,
            d = function() {};
        c.addEventListener ? d = function(a, b, c) {
            a.addEventListener(b, c, !1)
        } : c.attachEvent && (d = function(a, c, d) {
            a[c + d] = d.handleEvent ? function() {
                var c = b(a);
                d.handleEvent.call(d, c)
            } : function() {
                var c = b(a);
                d.call(a, c)
            }, a.attachEvent("on" + c, a[c + d])
        });
        var e = function() {};
        c.removeEventListener ? e = function(a, b, c) {
            a.removeEventListener(b, c, !1)
        } : c.detachEvent && (e = function(a, b, c) {
            a.detachEvent("on" + b, a[b + c]);
            try {
                delete a[b + c]
            } catch (d) {
                a[b + c] = void 0
            }
        });
        var f = {
            bind: d,
            unbind: e
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f : a.eventie = f
    }(window),
    function() {
        "use strict";

        function a() {}

        function b(a, b) {
            for (var c = a.length; c--;)
                if (a[c].listener === b) return c;
            return -1
        }

        function c(a) {
            return function() {
                return this[a].apply(this, arguments)
            }
        }
        var d = a.prototype,
            e = this,
            f = e.EventEmitter;
        d.getListeners = function(a) {
            var b, c, d = this._getEvents();
            if (a instanceof RegExp) {
                b = {};
                for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
            } else b = d[a] || (d[a] = []);
            return b
        }, d.flattenListeners = function(a) {
            var b, c = [];
            for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
            return c
        }, d.getListenersAsObject = function(a) {
            var b, c = this.getListeners(a);
            return c instanceof Array && (b = {}, b[a] = c), b || c
        }, d.addListener = function(a, c) {
            var d, e = this.getListenersAsObject(a),
                f = "object" == typeof c;
            for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
                listener: c,
                once: !1
            });
            return this
        }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
            return this.addListener(a, {
                listener: b,
                once: !0
            })
        }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
            return this.getListeners(a), this
        }, d.defineEvents = function(a) {
            for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
            return this
        }, d.removeListener = function(a, c) {
            var d, e, f = this.getListenersAsObject(a);
            for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
            return this
        }, d.off = c("removeListener"), d.addListeners = function(a, b) {
            return this.manipulateListeners(!1, a, b)
        }, d.removeListeners = function(a, b) {
            return this.manipulateListeners(!0, a, b)
        }, d.manipulateListeners = function(a, b, c) {
            var d, e, f = a ? this.removeListener : this.addListener,
                g = a ? this.removeListeners : this.addListeners;
            if ("object" != typeof b || b instanceof RegExp)
                for (d = c.length; d--;) f.call(this, b, c[d]);
            else
                for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
            return this
        }, d.removeEvent = function(a) {
            var b, c = typeof a,
                d = this._getEvents();
            if ("string" === c) delete d[a];
            else if (a instanceof RegExp)
                for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
            else delete this._events;
            return this
        }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
            var c, d, e, f, g = this.getListenersAsObject(a);
            for (e in g)
                if (g.hasOwnProperty(e))
                    for (d = g[e].length; d--;) c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
            return this
        }, d.trigger = c("emitEvent"), d.emit = function(a) {
            var b = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(a, b)
        }, d.setOnceReturnValue = function(a) {
            return this._onceReturnValue = a, this
        }, d._getOnceReturnValue = function() {
            return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
        }, d._getEvents = function() {
            return this._events || (this._events = {})
        }, a.noConflict = function() {
            return e.EventEmitter = f, a
        }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
            return a
        }) : "object" == typeof module && module.exports ? module.exports = a : e.EventEmitter = a
    }.call(this),
    function(a) {
        function b(a) {
            if (a) {
                if ("string" == typeof d[a]) return a;
                a = a.charAt(0).toUpperCase() + a.slice(1);
                for (var b, e = 0, f = c.length; f > e; e++)
                    if (b = c[e] + a, "string" == typeof d[b]) return b
            }
        }
        var c = "Webkit Moz ms Ms O".split(" "),
            d = document.documentElement.style;
        "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
            return b
        }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b
    }(window),
    function(a, b) {
        function c(a) {
            var b = parseFloat(a),
                c = -1 === a.indexOf("%") && !isNaN(b);
            return c && b
        }

        function d() {}

        function e() {
            for (var a = {
                width: 0,
                height: 0,
                innerWidth: 0,
                innerHeight: 0,
                outerWidth: 0,
                outerHeight: 0
            }, b = 0, c = h.length; c > b; b++) {
                var d = h[b];
                a[d] = 0
            }
            return a
        }

        function f(b) {
            function d() {
                if (!m) {
                    m = !0;
                    var d = a.getComputedStyle;
                    if (j = function() {
                            var a = d ? function(a) {
                                return d(a, null)
                            } : function(a) {
                                return a.currentStyle
                            };
                            return function(b) {
                                var c = a(b);
                                return c || g("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), c
                            }
                        }(), k = b("boxSizing")) {
                        var e = document.createElement("div");
                        e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style[k] = "border-box";
                        var f = document.body || document.documentElement;
                        f.appendChild(e);
                        var h = j(e);
                        l = 200 === c(h.width), f.removeChild(e)
                    }
                }
            }

            function f(a) {
                if (d(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                    var b = j(a);
                    if ("none" === b.display) return e();
                    var f = {};
                    f.width = a.offsetWidth, f.height = a.offsetHeight;
                    for (var g = f.isBorderBox = !(!k || !b[k] || "border-box" !== b[k]), m = 0, n = h.length; n > m; m++) {
                        var o = h[m],
                            p = b[o];
                        p = i(a, p);
                        var q = parseFloat(p);
                        f[o] = isNaN(q) ? 0 : q
                    }
                    var r = f.paddingLeft + f.paddingRight,
                        s = f.paddingTop + f.paddingBottom,
                        t = f.marginLeft + f.marginRight,
                        u = f.marginTop + f.marginBottom,
                        v = f.borderLeftWidth + f.borderRightWidth,
                        w = f.borderTopWidth + f.borderBottomWidth,
                        x = g && l,
                        y = c(b.width);
                    y !== !1 && (f.width = y + (x ? 0 : r + v));
                    var z = c(b.height);
                    return z !== !1 && (f.height = z + (x ? 0 : s + w)), f.innerWidth = f.width - (r + v), f.innerHeight = f.height - (s + w), f.outerWidth = f.width + t, f.outerHeight = f.height + u, f
                }
            }

            function i(b, c) {
                if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
                var d = b.style,
                    e = d.left,
                    f = b.runtimeStyle,
                    g = f && f.left;
                return g && (f.left = b.currentStyle.left), d.left = c, c = d.pixelLeft, d.left = e, g && (f.left = g), c
            }
            var j, k, l, m = !1;
            return f
        }
        var g = "undefined" == typeof console ? d : function(a) {
                console.error(a)
            },
            h = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], f) : "object" == typeof exports ? module.exports = f(require("desandro-get-style-property")) : a.getSize = f(a.getStyleProperty)
    }(window),
    function(a) {
        function b(a) {
            "function" == typeof a && (b.isReady ? a() : g.push(a))
        }

        function c(a) {
            var c = "readystatechange" === a.type && "complete" !== f.readyState;
            b.isReady || c || d()
        }

        function d() {
            b.isReady = !0;
            for (var a = 0, c = g.length; c > a; a++) {
                var d = g[a];
                d()
            }
        }

        function e(e) {
            return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)), b
        }
        var f = a.document,
            g = [];
        b.isReady = !1, "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
    }(window),
    function(a) {
        "use strict";

        function b(a, b) {
            return a[g](b)
        }

        function c(a) {
            if (!a.parentNode) {
                var b = document.createDocumentFragment();
                b.appendChild(a)
            }
        }

        function d(a, b) {
            c(a);
            for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++)
                if (d[e] === a) return !0;
            return !1
        }

        function e(a, d) {
            return c(a), b(a, d)
        }
        var f, g = function() {
            if (a.matches) return "matches";
            if (a.matchesSelector) return "matchesSelector";
            for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
                var e = b[c],
                    f = e + "MatchesSelector";
                if (a[f]) return f
            }
        }();
        if (g) {
            var h = document.createElement("div"),
                i = b(h, "div");
            f = i ? b : e
        } else f = d;
        "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
            return f
        }) : "object" == typeof exports ? module.exports = f : window.matchesSelector = f
    }(Element.prototype),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"], function(c, d) {
            return b(a, c, d)
        }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
    }(window, function(a, b, c) {
        var d = {};
        d.extend = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, d.modulo = function(a, b) {
            return (a % b + b) % b
        };
        var e = Object.prototype.toString;
        d.isArray = function(a) {
            return "[object Array]" == e.call(a)
        }, d.makeArray = function(a) {
            var b = [];
            if (d.isArray(a)) b = a;
            else if (a && "number" == typeof a.length)
                for (var c = 0, e = a.length; e > c; c++) b.push(a[c]);
            else b.push(a);
            return b
        }, d.indexOf = Array.prototype.indexOf ? function(a, b) {
            return a.indexOf(b)
        } : function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }, d.removeFrom = function(a, b) {
            var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
        }, d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(a) {
            return a instanceof HTMLElement
        } : function(a) {
            return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
        }, d.setText = function() {
            function a(a, c) {
                b = b || (void 0 !== document.documentElement.textContent ? "textContent" : "innerText"), a[b] = c
            }
            var b;
            return a
        }(), d.getParent = function(a, b) {
            for (; a != document.body;)
                if (a = a.parentNode, c(a, b)) return a
        }, d.getQueryElement = function(a) {
            return "string" == typeof a ? document.querySelector(a) : a
        }, d.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, d.filterFindElements = function(a, b) {
            a = d.makeArray(a);
            for (var e = [], f = 0, g = a.length; g > f; f++) {
                var h = a[f];
                if (d.isElement(h))
                    if (b) {
                        c(h, b) && e.push(h);
                        for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
                    } else e.push(h)
            }
            return e
        }, d.debounceMethod = function(a, b, c) {
            var d = a.prototype[b],
                e = b + "Timeout";
            a.prototype[b] = function() {
                var a = this[e];
                a && clearTimeout(a);
                var b = arguments,
                    f = this;
                this[e] = setTimeout(function() {
                    d.apply(f, b), delete f[e]
                }, c || 100)
            }
        }, d.toDashed = function(a) {
            return a.replace(/(.)([A-Z])/g, function(a, b, c) {
                return b + "-" + c
            }).toLowerCase()
        };
        var f = a.console;
        return d.htmlInit = function(c, e) {
            b(function() {
                for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                    var k, l = g[i],
                        m = l.getAttribute(h);
                    try {
                        k = m && JSON.parse(m)
                    } catch (a) {
                        f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id : "") + ": " + a);
                        continue
                    }
                    var n = new c(l, k),
                        o = a.jQuery;
                    o && o.data(l, e, n)
                }
            })
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"], function(c, d, e, f) {
            return b(a, c, d, e, f)
        }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {}, a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
    }(window, function(a, b, c, d, e) {
        "use strict";

        function f(a) {
            for (var b in a) return !1;
            return b = null, !0
        }

        function g(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }

        function h(a) {
            return a.replace(/([A-Z])/g, function(a) {
                return "-" + a.toLowerCase()
            })
        }
        var i = a.getComputedStyle,
            j = i ? function(a) {
                return i(a, null)
            } : function(a) {
                return a.currentStyle
            },
            k = d("transition"),
            l = d("transform"),
            m = k && l,
            n = !!d("perspective"),
            o = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "otransitionend",
                transition: "transitionend"
            }[k],
            p = ["transform", "transition", "transitionDuration", "transitionProperty"],
            q = function() {
                for (var a = {}, b = 0, c = p.length; c > b; b++) {
                    var e = p[b],
                        f = d(e);
                    f && f !== e && (a[e] = f)
                }
                return a
            }();
        e.extend(g.prototype, b.prototype), g.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.getSize = function() {
            this.size = c(this.element)
        }, g.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = q[c] || c;
                b[d] = a[c]
            }
        }, g.prototype.getPosition = function() {
            var a = j(this.element),
                b = this.layout.options,
                c = b.isOriginLeft,
                d = b.isOriginTop,
                e = a[c ? "left" : "right"],
                f = a[d ? "top" : "bottom"],
                g = this.layout.size,
                h = -1 != e.indexOf("%") ? parseFloat(e) / 100 * g.width : parseInt(e, 10),
                i = -1 != f.indexOf("%") ? parseFloat(f) / 100 * g.height : parseInt(f, 10);
            h = isNaN(h) ? 0 : h, i = isNaN(i) ? 0 : i, h -= c ? g.paddingLeft : g.paddingRight, i -= d ? g.paddingTop : g.paddingBottom, this.position.x = h, this.position.y = i
        }, g.prototype.layoutPosition = function() {
            var a = this.layout.size,
                b = this.layout.options,
                c = {},
                d = b.isOriginLeft ? "paddingLeft" : "paddingRight",
                e = b.isOriginLeft ? "left" : "right",
                f = b.isOriginLeft ? "right" : "left",
                g = this.position.x + a[d];
            c[e] = this.getXValue(g), c[f] = "";
            var h = b.isOriginTop ? "paddingTop" : "paddingBottom",
                i = b.isOriginTop ? "top" : "bottom",
                j = b.isOriginTop ? "bottom" : "top",
                k = this.position.y + a[h];
            c[i] = this.getYValue(k), c[j] = "", this.css(c), this.emitEvent("layout", [this])
        }, g.prototype.getXValue = function(a) {
            var b = this.layout.options;
            return b.percentPosition && !b.isHorizontal ? a / this.layout.size.width * 100 + "%" : a + "px"
        }, g.prototype.getYValue = function(a) {
            var b = this.layout.options;
            return b.percentPosition && b.isHorizontal ? a / this.layout.size.height * 100 + "%" : a + "px"
        }, g.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x,
                d = this.position.y,
                e = parseInt(a, 10),
                f = parseInt(b, 10),
                g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c,
                i = b - d,
                j = {};
            j.transform = this.getTranslate(h, i), this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, g.prototype.getTranslate = function(a, b) {
            var c = this.layout.options;
            return a = c.isOriginLeft ? a : -a, b = c.isOriginTop ? b : -b, n ? "translate3d(" + a + "px, " + b + "px, 0)" : "translate(" + a + "px, " + b + "px)"
        }, g.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition()
        }, g.prototype.moveTo = m ? g.prototype._transitionTo : g.prototype.goTo, g.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10)
        }, g.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
        }, g.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transn;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0
        };
        var r = "opacity," + h(q.transform || "transform");
        g.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: r,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(o, this, !1))
        }, g.prototype.transition = g.prototype[k ? "_transition" : "_nonTransition"], g.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a)
        }, g.prototype.onotransitionend = function(a) {
            this.ontransitionend(a)
        };
        var s = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        g.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transn,
                    c = s[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                    var d = b.onEnd[c];
                    d.call(this), delete b.onEnd[c]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, g.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(o, this, !1), this.isTransitioning = !1
        }, g.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b)
        };
        var t = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return g.prototype.removeTransitionStyles = function() {
            this.css(t)
        }, g.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, g.prototype.remove = function() {
            if (!k || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.once("transitionEnd", function() {
                a.removeElem()
            }), this.hide()
        }, g.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("visibleStyle");
            b[c] = this.onRevealTransitionEnd, this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, g.prototype.getHideRevealTransitionEndProperty = function(a) {
            var b = this.layout.options[a];
            if (b.opacity) return "opacity";
            for (var c in b) return c
        }, g.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options,
                b = {},
                c = this.getHideRevealTransitionEndProperty("hiddenStyle");
            b[c] = this.onHideTransitionEnd, this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: b
            })
        }, g.prototype.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, g.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, g
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(c, d, e, f, g) {
            return b(a, c, d, e, f, g)
        }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
    }(window, function(a, b, c, d, e, f) {
        "use strict";

        function g(a, b) {
            var c = e.getQueryElement(a);
            if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
            this.element = c, i && (this.$element = i(this.element)), this.options = e.extend({}, this.constructor.defaults), this.option(b);
            var d = ++k;
            this.element.outlayerGUID = d, l[d] = this, this._create(), this.options.isInitLayout && this.layout()
        }
        var h = a.console,
            i = a.jQuery,
            j = function() {},
            k = 0,
            l = {};
        return g.namespace = "outlayer", g.Item = f, g.defaults = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            isResizingContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, e.extend(g.prototype, c.prototype), g.prototype.option = function(a) {
            e.extend(this.options, a)
        }, g.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e.extend(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
        }, g.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, g.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e],
                    h = new c(g, this);
                d.push(h)
            }
            return d
        }, g.prototype._filterFindItemElements = function(a) {
            return e.filterFindElements(a, this.options.itemSelector)
        }, g.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a
        }, g.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0
        }, g.prototype._init = g.prototype.layout, g.prototype._resetLayout = function() {
            this.getSize()
        }, g.prototype.getSize = function() {
            this.size = d(this.element)
        }, g.prototype._getMeasurement = function(a, b) {
            var c, f = this.options[a];
            f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
        }, g.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout()
        }, g.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e)
            }
            return b
        }, g.prototype._layoutItems = function(a, b) {
            if (this._emitCompleteOnItems("layout", a), a && a.length) {
                for (var c = [], d = 0, e = a.length; e > d; d++) {
                    var f = a[d],
                        g = this._getItemLayoutPosition(f);
                    g.item = f, g.isInstant = b || f.isLayoutInstant, c.push(g)
                }
                this._processLayoutQueue(c)
            }
        }, g.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, g.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant)
            }
        }, g.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c)
        }, g.prototype._postLayout = function() {
            this.resizeContainer()
        }, g.prototype.resizeContainer = function() {
            if (this.options.isResizingContainer) {
                var a = this._getContainerSize();
                a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
            }
        }, g.prototype._getContainerSize = j, g.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px"
            }
        }, g.prototype._emitCompleteOnItems = function(a, b) {
            function c() {
                e.dispatchEvent(a + "Complete", null, [b])
            }

            function d() {
                g++, g === f && c()
            }
            var e = this,
                f = b.length;
            if (!b || !f) return void c();
            for (var g = 0, h = 0, i = b.length; i > h; h++) {
                var j = b[h];
                j.once(a, d)
            }
        }, g.prototype.dispatchEvent = function(a, b, c) {
            var d = b ? [b].concat(c) : c;
            if (this.emitEvent(a, d), i)
                if (this.$element = this.$element || i(this.element), b) {
                    var e = i.Event(b);
                    e.type = a, this.$element.trigger(e, c)
                } else this.$element.trigger(a, c)
        }, g.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0)
        }, g.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored
        }, g.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d)
                }
            }
        }, g.prototype.unstamp = function(a) {
            if (a = this._find(a))
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    e.removeFrom(this.stamps, d), this.unignore(d)
                }
        }, g.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
        }, g.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c)
                }
            }
        }, g.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(),
                b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            }
        }, g.prototype._manageStamp = j, g.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(),
                c = this._boundingRect,
                e = d(a),
                f = {
                    left: b.left - c.left - e.marginLeft,
                    top: b.top - c.top - e.marginTop,
                    right: c.right - b.right - e.marginRight,
                    bottom: c.bottom - b.bottom - e.marginBottom
                };
            return f
        }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.bindResize = function() {
            this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
        }, g.prototype.unbindResize = function() {
            this.isResizeBound && b.unbind(a, "resize", this), this.isResizeBound = !1
        }, g.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100)
        }, g.prototype.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, g.prototype.needsResizeLayout = function() {
            var a = d(this.element),
                b = this.size && a;
            return b && a.innerWidth !== this.size.innerWidth
        }, g.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b
        }, g.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b))
        }, g.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), this.reveal(b), this.layoutItems(c)
            }
        }, g.prototype.reveal = function(a) {
            this._emitCompleteOnItems("reveal", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.reveal()
            }
        }, g.prototype.hide = function(a) {
            this._emitCompleteOnItems("hide", a);
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.hide()
            }
        }, g.prototype.revealItemElements = function(a) {
            var b = this.getItems(a);
            this.reveal(b)
        }, g.prototype.hideItemElements = function(a) {
            var b = this.getItems(a);
            this.hide(b)
        }, g.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d
            }
        }, g.prototype.getItems = function(a) {
            a = e.makeArray(a);
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var f = a[c],
                    g = this.getItem(f);
                g && b.push(g)
            }
            return b
        }, g.prototype.remove = function(a) {
            var b = this.getItems(a);
            if (this._emitCompleteOnItems("remove", b), b && b.length)
                for (var c = 0, d = b.length; d > c; c++) {
                    var f = b[c];
                    f.remove(), e.removeFrom(this.items, f)
                }
        }, g.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy()
            }
            this.unbindResize();
            var e = this.element.outlayerGUID;
            delete l[e], delete this.element.outlayerGUID, i && i.removeData(this.element, this.constructor.namespace)
        }, g.data = function(a) {
            a = e.getQueryElement(a);
            var b = a && a.outlayerGUID;
            return b && l[b]
        }, g.create = function(a, b) {
            function c() {
                g.apply(this, arguments)
            }
            return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype), c.prototype.constructor = c, c.defaults = e.extend({}, g.defaults), e.extend(c.defaults, b), c.prototype.settings = {}, c.namespace = a, c.data = g.data, c.Item = function() {
                f.apply(this, arguments)
            }, c.Item.prototype = new f, e.htmlInit(c, a), i && i.bridget && i.bridget(a, c), c
        }, g.Item = f, g
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], b) : "object" == typeof exports ? module.exports = b(require("outlayer")) : (a.Isotope = a.Isotope || {},
            a.Isotope.Item = b(a.Outlayer))
    }(window, function(a) {
        "use strict";

        function b() {
            a.Item.apply(this, arguments)
        }
        b.prototype = new a.Item, b.prototype._create = function() {
            this.id = this.layout.itemGUID++, a.Item.prototype._create.call(this), this.sortData = {}
        }, b.prototype.updateSortData = function() {
            if (!this.isIgnored) {
                this.sortData.id = this.id, this.sortData["original-order"] = this.id, this.sortData.random = Math.random();
                var a = this.layout.options.getSortData,
                    b = this.layout._sorters;
                for (var c in a) {
                    var d = b[c];
                    this.sortData[c] = d(this.element, this)
                }
            }
        };
        var c = b.prototype.destroy;
        return b.prototype.destroy = function() {
            c.apply(this, arguments), this.css({
                display: ""
            })
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], b) : "object" == typeof exports ? module.exports = b(require("get-size"), require("outlayer")) : (a.Isotope = a.Isotope || {}, a.Isotope.LayoutMode = b(a.getSize, a.Outlayer))
    }(window, function(a, b) {
        "use strict";

        function c(a) {
            this.isotope = a, a && (this.options = a.options[this.namespace], this.element = a.element, this.items = a.filteredItems, this.size = a.size)
        }
        return function() {
            function a(a) {
                return function() {
                    return b.prototype[a].apply(this.isotope, arguments)
                }
            }
            for (var d = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], e = 0, f = d.length; f > e; e++) {
                var g = d[e];
                c.prototype[g] = a(g)
            }
        }(), c.prototype.needsVerticalResizeLayout = function() {
            var b = a(this.isotope.element),
                c = this.isotope.size && b;
            return c && b.innerHeight != this.isotope.size.innerHeight
        }, c.prototype._getMeasurement = function() {
            this.isotope._getMeasurement.apply(this, arguments)
        }, c.prototype.getColumnWidth = function() {
            this.getSegmentSize("column", "Width")
        }, c.prototype.getRowHeight = function() {
            this.getSegmentSize("row", "Height")
        }, c.prototype.getSegmentSize = function(a, b) {
            var c = a + b,
                d = "outer" + b;
            if (this._getMeasurement(c, d), !this[c]) {
                var e = this.getFirstItemSize();
                this[c] = e && e[d] || this.isotope.size["inner" + b]
            }
        }, c.prototype.getFirstItemSize = function() {
            var b = this.isotope.filteredItems[0];
            return b && b.element && a(b.element)
        }, c.prototype.layout = function() {
            this.isotope.layout.apply(this.isotope, arguments)
        }, c.prototype.getSize = function() {
            this.isotope.getSize(), this.size = this.isotope.size
        }, c.modes = {}, c.create = function(a, b) {
            function d() {
                c.apply(this, arguments)
            }
            return d.prototype = new c, b && (d.options = b), d.prototype.namespace = a, c.modes[a] = d, d
        }, c
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
    }(window, function(a, b, c) {
        var d = a.create("masonry");
        return d.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
            var a = this.cols;
            for (this.colYs = []; a--;) this.colYs.push(0);
            this.maxY = 0
        }, d.prototype.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var a = this.items[0],
                    c = a && a.element;
                this.columnWidth = c && b(c).outerWidth || this.containerWidth
            }
            var d = this.columnWidth += this.gutter,
                e = this.containerWidth + this.gutter,
                f = e / d,
                g = d - e % d,
                h = g && 1 > g ? "round" : "floor";
            f = Math[h](f), this.cols = Math.max(f, 1)
        }, d.prototype.getContainerWidth = function() {
            var a = this.options.isFitWidth ? this.element.parentNode : this.element,
                c = b(a);
            this.containerWidth = c && c.innerWidth
        }, d.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth % this.columnWidth,
                d = b && 1 > b ? "round" : "ceil",
                e = Math[d](a.size.outerWidth / this.columnWidth);
            e = Math.min(e, this.cols);
            for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
                x: this.columnWidth * h,
                y: g
            }, j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
            return i
        }, d.prototype._getColGroup = function(a) {
            if (2 > a) return this.colYs;
            for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
                var e = this.colYs.slice(d, d + a);
                b[d] = Math.max.apply(Math, e)
            }
            return b
        }, d.prototype._manageStamp = function(a) {
            var c = b(a),
                d = this._getElementOffset(a),
                e = this.options.isOriginLeft ? d.left : d.right,
                f = e + c.outerWidth,
                g = Math.floor(e / this.columnWidth);
            g = Math.max(0, g);
            var h = Math.floor(f / this.columnWidth);
            h -= f % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var i = (this.options.isOriginTop ? d.top : d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
        }, d.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var a = {
                height: this.maxY
            };
            return this.options.isFitWidth && (a.width = this._getContainerFitWidth()), a
        }, d.prototype._getContainerFitWidth = function() {
            for (var a = 0, b = this.cols; --b && 0 === this.colYs[b];) a++;
            return (this.cols - a) * this.columnWidth - this.gutter
        }, d.prototype.needsResizeLayout = function() {
            var a = this.containerWidth;
            return this.getContainerWidth(), a !== this.containerWidth
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode"), require("masonry-layout")) : b(a.Isotope.LayoutMode, a.Masonry)
    }(window, function(a, b) {
        "use strict";

        function c(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }
        var d = a.create("masonry"),
            e = d.prototype._getElementOffset,
            f = d.prototype.layout,
            g = d.prototype._getMeasurement;
        c(d.prototype, b.prototype), d.prototype._getElementOffset = e, d.prototype.layout = f, d.prototype._getMeasurement = g;
        var h = d.prototype.measureColumns;
        d.prototype.measureColumns = function() {
            this.items = this.isotope.filteredItems, h.call(this)
        };
        var i = d.prototype._manageStamp;
        return d.prototype._manageStamp = function() {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, i.apply(this, arguments)
        }, d
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode")) : b(a.Isotope.LayoutMode)
    }(window, function(a) {
        "use strict";
        var b = a.create("fitRows");
        return b.prototype._resetLayout = function() {
            this.x = 0, this.y = 0, this.maxY = 0, this._getMeasurement("gutter", "outerWidth")
        }, b.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = a.size.outerWidth + this.gutter,
                c = this.isotope.size.innerWidth + this.gutter;
            0 !== this.x && b + this.x > c && (this.x = 0, this.y = this.maxY);
            var d = {
                x: this.x,
                y: this.y
            };
            return this.maxY = Math.max(this.maxY, this.y + a.size.outerHeight), this.x += b, d
        }, b.prototype._getContainerSize = function() {
            return {
                height: this.maxY
            }
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], b) : "object" == typeof exports ? module.exports = b(require("../layout-mode")) : b(a.Isotope.LayoutMode)
    }(window, function(a) {
        "use strict";
        var b = a.create("vertical", {
            horizontalAlignment: 0
        });
        return b.prototype._resetLayout = function() {
            this.y = 0
        }, b.prototype._getItemLayoutPosition = function(a) {
            a.getSize();
            var b = (this.isotope.size.innerWidth - a.size.outerWidth) * this.options.horizontalAlignment,
                c = this.y;
            return this.y += a.size.outerHeight, {
                x: b,
                y: c
            }
        }, b.prototype._getContainerSize = function() {
            return {
                height: this.y
            }
        }, b
    }),
    function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "matches-selector/matches-selector", "fizzy-ui-utils/utils", "isotope/js/item", "isotope/js/layout-mode", "isotope/js/layout-modes/masonry", "isotope/js/layout-modes/fit-rows", "isotope/js/layout-modes/vertical"], function(c, d, e, f, g, h) {
            return b(a, c, d, e, f, g, h)
        }) : "object" == typeof exports ? module.exports = b(a, require("outlayer"), require("get-size"), require("desandro-matches-selector"), require("fizzy-ui-utils"), require("./item"), require("./layout-mode"), require("./layout-modes/masonry"), require("./layout-modes/fit-rows"), require("./layout-modes/vertical")) : a.Isotope = b(a, a.Outlayer, a.getSize, a.matchesSelector, a.fizzyUIUtils, a.Isotope.Item, a.Isotope.LayoutMode)
    }(window, function(a, b, c, d, e, f, g) {
        function h(a, b) {
            return function(c, d) {
                for (var e = 0, f = a.length; f > e; e++) {
                    var g = a[e],
                        h = c.sortData[g],
                        i = d.sortData[g];
                    if (h > i || i > h) {
                        var j = void 0 !== b[g] ? b[g] : b,
                            k = j ? 1 : -1;
                        return (h > i ? 1 : -1) * k
                    }
                }
                return 0
            }
        }
        var i = a.jQuery,
            j = String.prototype.trim ? function(a) {
                return a.trim()
            } : function(a) {
                return a.replace(/^\s+|\s+$/g, "")
            },
            k = document.documentElement,
            l = k.textContent ? function(a) {
                return a.textContent
            } : function(a) {
                return a.innerText
            },
            m = b.create("isotope", {
                layoutMode: "masonry",
                isJQueryFiltering: !0,
                sortAscending: !0
            });
        m.Item = f, m.LayoutMode = g, m.prototype._create = function() {
            this.itemGUID = 0, this._sorters = {}, this._getSorters(), b.prototype._create.call(this), this.modes = {}, this.filteredItems = this.items, this.sortHistory = ["original-order"];
            for (var a in g.modes) this._initLayoutMode(a)
        }, m.prototype.reloadItems = function() {
            this.itemGUID = 0, b.prototype.reloadItems.call(this)
        }, m.prototype._itemize = function() {
            for (var a = b.prototype._itemize.apply(this, arguments), c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.id = this.itemGUID++
            }
            return this._updateItemsSortData(a), a
        }, m.prototype._initLayoutMode = function(a) {
            var b = g.modes[a],
                c = this.options[a] || {};
            this.options[a] = b.options ? e.extend(b.options, c) : c, this.modes[a] = new b(this)
        }, m.prototype.layout = function() {
            return !this._isLayoutInited && this.options.isInitLayout ? void this.arrange() : void this._layout()
        }, m.prototype._layout = function() {
            var a = this._getIsInstant();
            this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, a), this._isLayoutInited = !0
        }, m.prototype.arrange = function(a) {
            function b() {
                d.reveal(c.needReveal), d.hide(c.needHide)
            }
            this.option(a), this._getIsInstant();
            var c = this._filter(this.items);
            this.filteredItems = c.matches;
            var d = this;
            this._bindArrangeComplete(), this._isInstant ? this._noTransition(b) : b(), this._sort(), this._layout()
        }, m.prototype._init = m.prototype.arrange, m.prototype._getIsInstant = function() {
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            return this._isInstant = a, a
        }, m.prototype._bindArrangeComplete = function() {
            function a() {
                b && c && d && e.dispatchEvent("arrangeComplete", null, [e.filteredItems])
            }
            var b, c, d, e = this;
            this.once("layoutComplete", function() {
                b = !0, a()
            }), this.once("hideComplete", function() {
                c = !0, a()
            }), this.once("revealComplete", function() {
                d = !0, a()
            })
        }, m.prototype._filter = function(a) {
            var b = this.options.filter;
            b = b || "*";
            for (var c = [], d = [], e = [], f = this._getFilterTest(b), g = 0, h = a.length; h > g; g++) {
                var i = a[g];
                if (!i.isIgnored) {
                    var j = f(i);
                    j && c.push(i), j && i.isHidden ? d.push(i) : j || i.isHidden || e.push(i)
                }
            }
            return {
                matches: c,
                needReveal: d,
                needHide: e
            }
        }, m.prototype._getFilterTest = function(a) {
            return i && this.options.isJQueryFiltering ? function(b) {
                return i(b.element).is(a)
            } : "function" == typeof a ? function(b) {
                return a(b.element)
            } : function(b) {
                return d(b.element, a)
            }
        }, m.prototype.updateSortData = function(a) {
            var b;
            a ? (a = e.makeArray(a), b = this.getItems(a)) : b = this.items, this._getSorters(), this._updateItemsSortData(b)
        }, m.prototype._getSorters = function() {
            var a = this.options.getSortData;
            for (var b in a) {
                var c = a[b];
                this._sorters[b] = n(c)
            }
        }, m.prototype._updateItemsSortData = function(a) {
            for (var b = a && a.length, c = 0; b && b > c; c++) {
                var d = a[c];
                d.updateSortData()
            }
        };
        var n = function() {
            function a(a) {
                if ("string" != typeof a) return a;
                var c = j(a).split(" "),
                    d = c[0],
                    e = d.match(/^\[(.+)\]$/),
                    f = e && e[1],
                    g = b(f, d),
                    h = m.sortDataParsers[c[1]];
                return a = h ? function(a) {
                    return a && h(g(a))
                } : function(a) {
                    return a && g(a)
                }
            }

            function b(a, b) {
                var c;
                return c = a ? function(b) {
                    return b.getAttribute(a)
                } : function(a) {
                    var c = a.querySelector(b);
                    return c && l(c)
                }
            }
            return a
        }();
        m.sortDataParsers = {
            parseInt: function(a) {
                return parseInt(a, 10)
            },
            parseFloat: function(a) {
                return parseFloat(a)
            }
        }, m.prototype._sort = function() {
            var a = this.options.sortBy;
            if (a) {
                var b = [].concat.apply(a, this.sortHistory),
                    c = h(b, this.options.sortAscending);
                this.filteredItems.sort(c), a != this.sortHistory[0] && this.sortHistory.unshift(a)
            }
        }, m.prototype._mode = function() {
            var a = this.options.layoutMode,
                b = this.modes[a];
            if (!b) throw new Error("No layout mode: " + a);
            return b.options = this.options[a], b
        }, m.prototype._resetLayout = function() {
            b.prototype._resetLayout.call(this), this._mode()._resetLayout()
        }, m.prototype._getItemLayoutPosition = function(a) {
            return this._mode()._getItemLayoutPosition(a)
        }, m.prototype._manageStamp = function(a) {
            this._mode()._manageStamp(a)
        }, m.prototype._getContainerSize = function() {
            return this._mode()._getContainerSize()
        }, m.prototype.needsResizeLayout = function() {
            return this._mode().needsResizeLayout()
        }, m.prototype.appended = function(a) {
            var b = this.addItems(a);
            if (b.length) {
                var c = this._filterRevealAdded(b);
                this.filteredItems = this.filteredItems.concat(c)
            }
        }, m.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                this._resetLayout(), this._manageStamps();
                var c = this._filterRevealAdded(b);
                this.layoutItems(this.filteredItems), this.filteredItems = c.concat(this.filteredItems), this.items = b.concat(this.items)
            }
        }, m.prototype._filterRevealAdded = function(a) {
            var b = this._filter(a);
            return this.hide(b.needHide), this.reveal(b.matches), this.layoutItems(b.matches, !0), b.matches
        }, m.prototype.insert = function(a) {
            var b = this.addItems(a);
            if (b.length) {
                var c, d, e = b.length;
                for (c = 0; e > c; c++) d = b[c], this.element.appendChild(d.element);
                var f = this._filter(b).matches;
                for (c = 0; e > c; c++) b[c].isLayoutInstant = !0;
                for (this.arrange(), c = 0; e > c; c++) delete b[c].isLayoutInstant;
                this.reveal(f)
            }
        };
        var o = m.prototype.remove;
        return m.prototype.remove = function(a) {
            a = e.makeArray(a);
            var b = this.getItems(a);
            o.call(this, a);
            var c = b && b.length;
            if (c)
                for (var d = 0; c > d; d++) {
                    var f = b[d];
                    e.removeFrom(this.filteredItems, f)
                }
        }, m.prototype.shuffle = function() {
            for (var a = 0, b = this.items.length; b > a; a++) {
                var c = this.items[a];
                c.sortData.random = Math.random()
            }
            this.options.sortBy = "random", this._sort(), this._layout()
        }, m.prototype._noTransition = function(a) {
            var b = this.options.transitionDuration;
            this.options.transitionDuration = 0;
            var c = a.call(this);
            return this.options.transitionDuration = b, c
        }, m.prototype.getFilteredItemElements = function() {
            for (var a = [], b = 0, c = this.filteredItems.length; c > b; b++) a.push(this.filteredItems[b].element);
            return a
        }, m
    }),
    function(a) {
        var b, c, d = a.event;
        b = d.special.debouncedresize = {
            setup: function() {
                a(this).on("resize", b.handler)
            },
            teardown: function() {
                a(this).off("resize", b.handler)
            },
            handler: function(a, e) {
                var f = this,
                    g = arguments,
                    h = function() {
                        a.type = "debouncedresize", d.dispatch.apply(f, g)
                    };
                c && clearTimeout(c), e ? h() : c = setTimeout(h, b.threshold)
            },
            threshold: 150
        }
    }(jQuery),
    function(a) {
        "use strict";
        a.fn.fitVids = function(b) {
            var c = {
                customSelector: null,
                ignore: null
            };
            if (!document.getElementById("fit-vids-style")) {
                var d = document.head || document.getElementsByTagName("head")[0],
                    e = ".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",
                    f = document.createElement("div");
                f.innerHTML = '<p>x</p><style id="fit-vids-style">' + e + "</style>", d.appendChild(f.childNodes[1])
            }
            return b && a.extend(c, b), this.each(function() {
                var b = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed"];
                c.customSelector && b.push(c.customSelector);
                var d = ".fitvidsignore";
                c.ignore && (d = d + ", " + c.ignore);
                var e = a(this).find(b.join(","));
                e = e.not("object object"), e = e.not(d), e.each(function(b) {
                    var c = a(this);
                    if (!(c.parents(d).length > 0 || "embed" === this.tagName.toLowerCase() && c.parent("object").length || c.parent(".fluid-width-video-wrapper").length)) {
                        c.css("height") || c.css("width") || !isNaN(c.attr("height")) && !isNaN(c.attr("width")) || (c.attr("height", 9), c.attr("width", 16));
                        var e = "object" === this.tagName.toLowerCase() || c.attr("height") && !isNaN(parseInt(c.attr("height"), 10)) ? parseInt(c.attr("height"), 10) : c.height(),
                            f = isNaN(parseInt(c.attr("width"), 10)) ? c.width() : parseInt(c.attr("width"), 10),
                            g = e / f;
                        if (!c.attr("id")) {
                            var h = "fitvid" + b;
                            c.attr("id", h)
                        }
                        c.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * g + "%"), c.removeAttr("height").removeAttr("width")
                    }
                })
            })
        }
    }(window.jQuery || window.Zepto),
    function(a) {
        a.fn.flexVerticalCenter = function(b) {
            var c = a.extend({
                cssAttribute: "margin-top",
                verticalOffset: 0,
                parentSelector: null,
                debounceTimeout: 25,
                deferTilWindowLoad: !1
            }, b || {});
            return this.each(function() {
                var b, d = a(this),
                    e = function() {
                        var a = c.parentSelector && d.parents(c.parentSelector).length ? d.parents(c.parentSelector).first().height() : d.parent().height();
                        d.css(c.cssAttribute, (a - d.height()) / 2 + parseInt(c.verticalOffset)), void 0 !== c.complete && c.complete()
                    };
                a(window).resize(function() {
                    clearTimeout(b), b = setTimeout(e, c.debounceTimeout)
                }), c.deferTilWindowLoad || e(), a(window).load(function() {
                    e()
                })
            })
        }
    }(jQuery),
    function(a) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function(a) {
        var b = -1,
            c = -1,
            d = function(a) {
                return parseFloat(a) || 0
            },
            e = function(b) {
                var c = 1,
                    e = a(b),
                    f = null,
                    g = [];
                return e.each(function() {
                    var b = a(this),
                        e = b.offset().top - d(b.css("margin-top")),
                        h = g.length > 0 ? g[g.length - 1] : null;
                    null === h ? g.push(b) : Math.floor(Math.abs(f - e)) <= c ? g[g.length - 1] = h.add(b) : g.push(b), f = e
                }), g
            },
            f = function(b) {
                var c = {
                    byRow: !0,
                    property: "height",
                    target: null,
                    remove: !1
                };
                return "object" == typeof b ? a.extend(c, b) : ("boolean" == typeof b ? c.byRow = b : "remove" === b && (c.remove = !0), c)
            },
            g = a.fn.matchHeight = function(b) {
                var c = f(b);
                if (c.remove) {
                    var d = this;
                    return this.css(c.property, ""), a.each(g._groups, function(a, b) {
                        b.elements = b.elements.not(d)
                    }), this
                }
                return this.length <= 1 && !c.target ? this : (g._groups.push({
                    elements: this,
                    options: c
                }), g._apply(this, c), this)
            };
        g.version = "master", g._groups = [], g._throttle = 80, g._maintainScroll = !1, g._beforeUpdate = null, g._afterUpdate = null, g._rows = e, g._parse = d, g._parseOptions = f, g._apply = function(b, c) {
            var h = f(c),
                i = a(b),
                j = [i],
                k = a(window).scrollTop(),
                l = a("html").outerHeight(!0),
                m = i.parents().filter(":hidden");
            return m.each(function() {
                var b = a(this);
                b.data("style-cache", b.attr("style"))
            }), m.css("display", "block"), h.byRow && !h.target && (i.each(function() {
                var b = a(this),
                    c = b.css("display");
                "inline-block" !== c && "flex" !== c && "inline-flex" !== c && (c = "block"), b.data("style-cache", b.attr("style")), b.css({
                    display: c,
                    "padding-top": "0",
                    "padding-bottom": "0",
                    "margin-top": "0",
                    "margin-bottom": "0",
                    "border-top-width": "0",
                    "border-bottom-width": "0",
                    height: "100px",
                    overflow: "hidden"
                })
            }), j = e(i), i.each(function() {
                var b = a(this);
                b.attr("style", b.data("style-cache") || "")
            })), a.each(j, function(b, c) {
                var e = a(c),
                    f = 0;
                if (h.target) f = h.target.outerHeight(!1);
                else {
                    if (h.byRow && e.length <= 1) return void e.css(h.property, "");
                    e.each(function() {
                        var b = a(this),
                            c = b.css("display");
                        "inline-block" !== c && "flex" !== c && "inline-flex" !== c && (c = "block");
                        var d = {
                            display: c
                        };
                        d[h.property] = "", b.css(d), b.outerHeight(!1) > f && (f = b.outerHeight(!1)), b.css("display", "")
                    })
                }
                e.each(function() {
                    var b = a(this),
                        c = 0;
                    h.target && b.is(h.target) || ("border-box" !== b.css("box-sizing") && (c += d(b.css("border-top-width")) + d(b.css("border-bottom-width")), c += d(b.css("padding-top")) + d(b.css("padding-bottom"))), b.css(h.property, f - c + "px"))
                })
            }), m.each(function() {
                var b = a(this);
                b.attr("style", b.data("style-cache") || null)
            }), g._maintainScroll && a(window).scrollTop(k / l * a("html").outerHeight(!0)), this
        }, g._applyDataApi = function() {
            var b = {};
            a("[data-match-height], [data-mh]").each(function() {
                var c = a(this),
                    d = c.attr("data-mh") || c.attr("data-match-height");
                d in b ? b[d] = b[d].add(c) : b[d] = c
            }), a.each(b, function() {
                this.matchHeight(!0)
            })
        };
        var h = function(b) {
            g._beforeUpdate && g._beforeUpdate(b, g._groups), a.each(g._groups, function() {
                g._apply(this.elements, this.options)
            }), g._afterUpdate && g._afterUpdate(b, g._groups)
        };
        g._update = function(d, e) {
            if (e && "resize" === e.type) {
                var f = a(window).width();
                if (f === b) return;
                b = f
            }
            d ? c === -1 && (c = setTimeout(function() {
                h(e), c = -1
            }, g._throttle)) : h(e)
        }, a(g._applyDataApi), a(window).bind("load", function(a) {
            g._update(!1, a)
        }), a(window).bind("resize orientationchange", function(a) {
            g._update(!0, a)
        })
    }), $.scrollTo = $.fn.scrollTo = function(a, b, c) {
    return this instanceof $ ? (c = $.extend({}, {
        gap: {
            x: 0,
            y: 0
        },
        animation: {
            easing: "swing",
            duration: 600,
            complete: $.noop,
            step: $.noop
        }
    }, c), this.each(function() {
        var d = $(this);
        d.stop().animate({
            scrollLeft: isNaN(Number(a)) ? $(b).offset().left + c.gap.x : a,
            scrollTop: isNaN(Number(b)) ? $(b).offset().top + c.gap.y : b
        }, c.animation)
    })) : $.fn.scrollTo.apply($("html, body"), arguments)
},
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function(a) {
        var b = Array.prototype.slice,
            c = Array.prototype.splice,
            d = {
                topSpacing: 0,
                bottomSpacing: 0,
                className: "is-sticky",
                wrapperClassName: "sticky-wrapper",
                center: !1,
                getWidthFrom: "",
                widthFromWrapper: !0,
                responsiveWidth: !1
            },
            e = a(window),
            f = a(document),
            g = [],
            h = e.height(),
            i = function() {
                for (var b = e.scrollTop(), c = f.height(), d = c - h, i = b > d ? d - b : 0, j = 0, k = g.length; j < k; j++) {
                    var l = g[j],
                        m = l.stickyWrapper.offset().top,
                        n = m - l.topSpacing - i;
                    if (l.stickyWrapper.css("height", l.stickyElement.outerHeight()), b <= n) null !== l.currentTop && (l.stickyElement.css({
                        width: "",
                        position: "",
                        top: ""
                    }), l.stickyElement.parent().removeClass(l.className), l.stickyElement.trigger("sticky-end", [l]), l.currentTop = null);
                    else {
                        var o = c - l.stickyElement.outerHeight() - l.topSpacing - l.bottomSpacing - b - i;
                        if (o < 0 ? o += l.topSpacing : o = l.topSpacing, l.currentTop !== o) {
                            var p;
                            l.getWidthFrom ? p = a(l.getWidthFrom).width() || null : l.widthFromWrapper && (p = l.stickyWrapper.width()), null == p && (p = l.stickyElement.width()), l.stickyElement.css("width", p).css("position", "fixed").css("top", o), l.stickyElement.parent().addClass(l.className), null === l.currentTop ? l.stickyElement.trigger("sticky-start", [l]) : l.stickyElement.trigger("sticky-update", [l]), l.currentTop === l.topSpacing && l.currentTop > o || null === l.currentTop && o < l.topSpacing ? l.stickyElement.trigger("sticky-bottom-reached", [l]) : null !== l.currentTop && o === l.topSpacing && l.currentTop < o && l.stickyElement.trigger("sticky-bottom-unreached", [l]), l.currentTop = o
                        }
                        var q = l.stickyWrapper.parent(),
                            r = l.stickyElement.offset().top + l.stickyElement.outerHeight() >= q.offset().top + q.outerHeight() && l.stickyElement.offset().top <= l.topSpacing;
                        r ? l.stickyElement.css("position", "absolute").css("top", "").css("bottom", 0) : l.stickyElement.css("position", "fixed").css("top", o).css("bottom", "")
                    }
                }
            },
            j = function() {
                h = e.height();
                for (var b = 0, c = g.length; b < c; b++) {
                    var d = g[b],
                        f = null;
                    d.getWidthFrom ? d.responsiveWidth && (f = a(d.getWidthFrom).width()) : d.widthFromWrapper && (f = d.stickyWrapper.width()), null != f && d.stickyElement.css("width", f)
                }
            },
            k = {
                init: function(b) {
                    var c = a.extend({}, d, b);
                    return this.each(function() {
                        var b = a(this),
                            e = b.attr("id"),
                            f = b.outerHeight(),
                            h = e ? e + "-" + d.wrapperClassName : d.wrapperClassName,
                            i = a("<div></div>").attr("id", h).addClass(c.wrapperClassName);
                        b.wrapAll(i);
                        var j = b.parent();
                        c.center && j.css({
                            width: b.outerWidth(),
                            marginLeft: "auto",
                            marginRight: "auto"
                        }), "right" === b.css("float") && b.css({
                            float: "none"
                        }).parent().css({
                            float: "right"
                        }), j.css("height", f), c.stickyElement = b, c.stickyWrapper = j, c.currentTop = null, g.push(c)
                    })
                },
                update: i,
                unstick: function(b) {
                    return this.each(function() {
                        for (var b = this, d = a(b), e = -1, f = g.length; f-- > 0;) g[f].stickyElement.get(0) === b && (c.call(g, f, 1), e = f);
                        e !== -1 && (d.unwrap(), d.css({
                            width: "",
                            position: "",
                            top: "",
                            float: ""
                        }))
                    })
                }
            };
        window.addEventListener ? (window.addEventListener("scroll", i, !1), window.addEventListener("resize", j, !1)) : window.attachEvent && (window.attachEvent("onscroll", i), window.attachEvent("onresize", j)), a.fn.sticky = function(c) {
            return k[c] ? k[c].apply(this, b.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.sticky") : k.init.apply(this, arguments)
        }, a.fn.unstick = function(c) {
            return k[c] ? k[c].apply(this, b.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.sticky") : k.unstick.apply(this, arguments)
        }, a(function() {
            setTimeout(i, 0)
        })
    });
var mejs = mejs || {};
mejs.version = "2.19.0", mejs.meIndex = 0, mejs.plugins = {
    silverlight: [{
        version: [3, 0],
        types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
    }],
    flash: [{
        version: [9, 0, 124],
        types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mpeg", "video/youtube", "video/x-youtube", "video/dailymotion", "video/x-dailymotion", "application/x-mpegURL"]
    }],
    youtube: [{
        version: null,
        types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]
    }],
    vimeo: [{
        version: null,
        types: ["video/vimeo", "video/x-vimeo"]
    }]
}, mejs.Utility = {
    encodeUrl: function(a) {
        return encodeURIComponent(a)
    },
    escapeHTML: function(a) {
        return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")
    },
    absolutizeUrl: function(a) {
        var b = document.createElement("div");
        return b.innerHTML = '<a href="' + this.escapeHTML(a) + '">x</a>', b.firstChild.href
    },
    getScriptPath: function(a) {
        for (var b, c, d, e, f, g, h = 0, i = "", j = "", k = document.getElementsByTagName("script"), l = k.length, m = a.length; l > h; h++) {
            for (e = k[h].src, c = e.lastIndexOf("/"), c > -1 ? (g = e.substring(c + 1), f = e.substring(0, c + 1)) : (g = e, f = ""), b = 0; m > b; b++)
                if (j = a[b], d = g.indexOf(j), d > -1) {
                    i = f;
                    break
                }
            if ("" !== i) break
        }
        return i
    },
    calculateTimeFormat: function(a, b, c) {
        0 > a && (a = 0), "undefined" == typeof c && (c = 25);
        var d = b.timeFormat,
            e = d[0],
            f = d[1] == d[0],
            g = f ? 2 : 1,
            h = ":",
            i = Math.floor(a / 3600) % 24,
            j = Math.floor(a / 60) % 60,
            k = Math.floor(a % 60),
            l = Math.floor((a % 1 * c).toFixed(3)),
            m = [
                [l, "f"],
                [k, "s"],
                [j, "m"],
                [i, "h"]
            ];
        d.length < g && (h = d[g]);
        for (var n = !1, o = 0, p = m.length; p > o; o++)
            if (-1 !== d.indexOf(m[o][1])) n = !0;
            else if (n) {
                for (var q = !1, r = o; p > r; r++)
                    if (m[r][0] > 0) {
                        q = !0;
                        break
                    }
                if (!q) break;
                f || (d = e + d), d = m[o][1] + h + d, f && (d = m[o][1] + d), e = m[o][1]
            }
        b.currentTimeFormat = d
    },
    twoDigitsString: function(a) {
        return 10 > a ? "0" + a : String(a)
    },
    secondsToTimeCode: function(a, b) {
        if (0 > a && (a = 0), "object" != typeof b) {
            var c = "m:ss";
            c = arguments[1] ? "hh:mm:ss" : c, c = arguments[2] ? c + ":ff" : c, b = {
                currentTimeFormat: c,
                framesPerSecond: arguments[3] || 25
            }
        }
        var d = b.framesPerSecond;
        "undefined" == typeof d && (d = 25);
        var c = b.currentTimeFormat,
            e = Math.floor(a / 3600) % 24,
            f = Math.floor(a / 60) % 60,
            g = Math.floor(a % 60),
            h = Math.floor((a % 1 * d).toFixed(3));
        lis = [
            [h, "f"],
            [g, "s"],
            [f, "m"],
            [e, "h"]
        ];
        var j = c;
        for (i = 0, len = lis.length; i < len; i++) j = j.replace(lis[i][1] + lis[i][1], this.twoDigitsString(lis[i][0])), j = j.replace(lis[i][1], lis[i][0]);
        return j
    },
    timeCodeToSeconds: function(a, b, c, d) {
        "undefined" == typeof c ? c = !1 : "undefined" == typeof d && (d = 25);
        var e = a.split(":"),
            f = parseInt(e[0], 10),
            g = parseInt(e[1], 10),
            h = parseInt(e[2], 10),
            i = 0,
            j = 0;
        return c && (i = parseInt(e[3]) / d), j = 3600 * f + 60 * g + h + i
    },
    convertSMPTEtoSeconds: function(a) {
        if ("string" != typeof a) return !1;
        a = a.replace(",", ".");
        var b = 0,
            c = -1 != a.indexOf(".") ? a.split(".")[1].length : 0,
            d = 1;
        a = a.split(":").reverse();
        for (var e = 0; e < a.length; e++) d = 1, e > 0 && (d = Math.pow(60, e)), b += Number(a[e]) * d;
        return Number(b.toFixed(c))
    },
    removeSwf: function(a) {
        var b = document.getElementById(a);
        b && /object|embed/i.test(b.nodeName) && (mejs.MediaFeatures.isIE ? (b.style.display = "none", function() {
            4 == b.readyState ? mejs.Utility.removeObjectInIE(a) : setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    },
    removeObjectInIE: function(a) {
        var b = document.getElementById(a);
        if (b) {
            for (var c in b) "function" == typeof b[c] && (b[c] = null);
            b.parentNode.removeChild(b)
        }
    }
}, mejs.PluginDetector = {
    hasPluginVersion: function(a, b) {
        var c = this.plugins[a];
        return b[1] = b[1] || 0, b[2] = b[2] || 0, c[0] > b[0] || c[0] == b[0] && c[1] > b[1] || c[0] == b[0] && c[1] == b[1] && c[2] >= b[2]
    },
    nav: window.navigator,
    ua: window.navigator.userAgent.toLowerCase(),
    plugins: [],
    addPlugin: function(a, b, c, d, e) {
        this.plugins[a] = this.detectPlugin(b, c, d, e)
    },
    detectPlugin: function(a, b, c, d) {
        var e, f, g, h = [0, 0, 0];
        if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[a]) {
            if (e = this.nav.plugins[a].description, e && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[b] || this.nav.mimeTypes[b].enabledPlugin))
                for (h = e.replace(a, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), f = 0; f < h.length; f++) h[f] = parseInt(h[f].match(/\d+/), 10)
        } else if ("undefined" != typeof window.ActiveXObject) try {
            g = new ActiveXObject(c), g && (h = d(g))
        } catch (a) {}
        return h
    }
}, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function(a) {
    var b = [],
        c = a.GetVariable("$version");
    return c && (c = c.split(" ")[1].split(","), b = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)]), b
}), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function(a) {
    var b = [0, 0, 0, 0],
        c = function(a, b, c, d) {
            for (; a.isVersionSupported(b[0] + "." + b[1] + "." + b[2] + "." + b[3]);) b[c] += d;
            b[c] -= d
        };
    return c(a, b, 0, 1), c(a, b, 1, 1), c(a, b, 2, 1e4), c(a, b, 2, 1e3), c(a, b, 2, 100), c(a, b, 2, 10), c(a, b, 2, 1), c(a, b, 3, 1), b
}), mejs.MediaFeatures = {
    init: function() {
        var a, b, c = this,
            d = document,
            e = mejs.PluginDetector.nav,
            f = mejs.PluginDetector.ua.toLowerCase(),
            g = ["source", "track", "audio", "video"];
        c.isiPad = null !== f.match(/ipad/i), c.isiPhone = null !== f.match(/iphone/i), c.isiOS = c.isiPhone || c.isiPad, c.isAndroid = null !== f.match(/android/i), c.isBustedAndroid = null !== f.match(/android 2\.[12]/), c.isBustedNativeHTTPS = "https:" === location.protocol && (null !== f.match(/android [12]\./) || null !== f.match(/macintosh.* version.* safari/)), c.isIE = -1 != e.appName.toLowerCase().indexOf("microsoft") || null !== e.appName.toLowerCase().match(/trident/gi), c.isChrome = null !== f.match(/chrome/gi), c.isChromium = null !== f.match(/chromium/gi), c.isFirefox = null !== f.match(/firefox/gi), c.isWebkit = null !== f.match(/webkit/gi), c.isGecko = null !== f.match(/gecko/gi) && !c.isWebkit && !c.isIE, c.isOpera = null !== f.match(/opera/gi), c.hasTouch = "ontouchstart" in window, c.svgAsImg = !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        for (a = 0; a < g.length; a++) b = document.createElement(g[a]);
        c.supportsMediaTag = "undefined" != typeof b.canPlayType || c.isBustedAndroid;
        try {
            b.canPlayType("video/mp4")
        } catch (a) {
            c.supportsMediaTag = !1
        }
        c.hasSemiNativeFullScreen = "undefined" != typeof b.webkitEnterFullscreen, c.hasNativeFullscreen = "undefined" != typeof b.requestFullscreen, c.hasWebkitNativeFullScreen = "undefined" != typeof b.webkitRequestFullScreen, c.hasMozNativeFullScreen = "undefined" != typeof b.mozRequestFullScreen, c.hasMsNativeFullScreen = "undefined" != typeof b.msRequestFullscreen, c.hasTrueNativeFullScreen = c.hasWebkitNativeFullScreen || c.hasMozNativeFullScreen || c.hasMsNativeFullScreen, c.nativeFullScreenEnabled = c.hasTrueNativeFullScreen, c.hasMozNativeFullScreen ? c.nativeFullScreenEnabled = document.mozFullScreenEnabled : c.hasMsNativeFullScreen && (c.nativeFullScreenEnabled = document.msFullscreenEnabled), c.isChrome && (c.hasSemiNativeFullScreen = !1), c.hasTrueNativeFullScreen && (c.fullScreenEventName = "", c.hasWebkitNativeFullScreen ? c.fullScreenEventName = "webkitfullscreenchange" : c.hasMozNativeFullScreen ? c.fullScreenEventName = "mozfullscreenchange" : c.hasMsNativeFullScreen && (c.fullScreenEventName = "MSFullscreenChange"), c.isFullScreen = function() {
            return c.hasMozNativeFullScreen ? d.mozFullScreen : c.hasWebkitNativeFullScreen ? d.webkitIsFullScreen : c.hasMsNativeFullScreen ? null !== d.msFullscreenElement : void 0
        }, c.requestFullScreen = function(a) {
            c.hasWebkitNativeFullScreen ? a.webkitRequestFullScreen() : c.hasMozNativeFullScreen ? a.mozRequestFullScreen() : c.hasMsNativeFullScreen && a.msRequestFullscreen()
        }, c.cancelFullScreen = function() {
            c.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : c.hasMozNativeFullScreen ? document.mozCancelFullScreen() : c.hasMsNativeFullScreen && document.msExitFullscreen()
        }), c.hasSemiNativeFullScreen && f.match(/mac os x 10_5/i) && (c.hasNativeFullScreen = !1, c.hasSemiNativeFullScreen = !1)
    }
}, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
    pluginType: "native",
    isFullScreen: !1,
    setCurrentTime: function(a) {
        this.currentTime = a
    },
    setMuted: function(a) {
        this.muted = a
    },
    setVolume: function(a) {
        this.volume = a
    },
    stop: function() {
        this.pause()
    },
    setSrc: function(a) {
        for (var b = this.getElementsByTagName("source"); b.length > 0;) this.removeChild(b[0]);
        if ("string" == typeof a) this.src = a;
        else {
            var c, d;
            for (c = 0; c < a.length; c++)
                if (d = a[c], this.canPlayType(d.type)) {
                    this.src = d.src;
                    break
                }
        }
    },
    setVideoSize: function(a, b) {
        this.width = a, this.height = b
    }
}, mejs.PluginMediaElement = function(a, b, c) {
    this.id = a, this.pluginType = b, this.src = c, this.events = {}, this.attributes = {}
}, mejs.PluginMediaElement.prototype = {
    pluginElement: null,
    pluginType: "",
    isFullScreen: !1,
    playbackRate: -1,
    defaultPlaybackRate: -1,
    seekable: [],
    played: [],
    paused: !0,
    ended: !1,
    seeking: !1,
    duration: 0,
    error: null,
    tagName: "",
    muted: !1,
    volume: 1,
    currentTime: 0,
    play: function() {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
    },
    load: function() {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
    },
    pause: function() {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
    },
    stop: function() {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
    },
    canPlayType: function(a) {
        var b, c, d, e = mejs.plugins[this.pluginType];
        for (b = 0; b < e.length; b++)
            if (d = e[b], mejs.PluginDetector.hasPluginVersion(this.pluginType, d.version))
                for (c = 0; c < d.types.length; c++)
                    if (a == d.types[c]) return "probably";
        return ""
    },
    positionFullscreenButton: function(a, b, c) {
        null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(a), Math.floor(b), c)
    },
    hideFullscreenButton: function() {
        null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
    },
    setSrc: function(a) {
        if ("string" == typeof a) this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a)), this.src = mejs.Utility.absolutizeUrl(a);
        else {
            var b, c;
            for (b = 0; b < a.length; b++)
                if (c = a[b], this.canPlayType(c.type)) {
                    this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src)), this.src = mejs.Utility.absolutizeUrl(c.src);
                    break
                }
        }
    },
    setCurrentTime: function(a) {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.seekTo(a) : this.pluginApi.setCurrentTime(a), this.currentTime = a)
    },
    setVolume: function(a) {
        null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.setVolume(100 * a) : this.pluginApi.setVolume(a), this.volume = a)
    },
    setMuted: function(a) {
        null != this.pluginApi && ("youtube" == this.pluginType ? (a ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = a, this.dispatchEvent({
            type: "volumechange"
        })) : this.pluginApi.setMuted(a), this.muted = a)
    },
    setVideoSize: function(a, b) {
        this.pluginElement && this.pluginElement.style && (this.pluginElement.style.width = a + "px", this.pluginElement.style.height = b + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(a, b)
    },
    setFullscreen: function(a) {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(a)
    },
    enterFullScreen: function() {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
    },
    exitFullScreen: function() {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
    },
    addEventListener: function(a, b, c) {
        this.events[a] = this.events[a] || [], this.events[a].push(b)
    },
    removeEventListener: function(a, b) {
        if (!a) return this.events = {}, !0;
        var c = this.events[a];
        if (!c) return !0;
        if (!b) return this.events[a] = [], !0;
        for (var d = 0; d < c.length; d++)
            if (c[d] === b) return this.events[a].splice(d, 1), !0;
        return !1
    },
    dispatchEvent: function(a) {
        var b, c = this.events[a.type];
        if (c)
            for (b = 0; b < c.length; b++) c[b].apply(this, [a])
    },
    hasAttribute: function(a) {
        return a in this.attributes
    },
    removeAttribute: function(a) {
        delete this.attributes[a]
    },
    getAttribute: function(a) {
        return this.hasAttribute(a) ? this.attributes[a] : ""
    },
    setAttribute: function(a, b) {
        this.attributes[a] = b
    },
    remove: function() {
        mejs.Utility.removeSwf(this.pluginElement.id), mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id)
    }
}, mejs.MediaPluginBridge = {
    pluginMediaElements: {},
    htmlMediaElements: {},
    registerPluginElement: function(a, b, c) {
        this.pluginMediaElements[a] = b, this.htmlMediaElements[a] = c
    },
    unregisterPluginElement: function(a) {
        delete this.pluginMediaElements[a], delete this.htmlMediaElements[a]
    },
    initPlugin: function(a) {
        var b = this.pluginMediaElements[a],
            c = this.htmlMediaElements[a];
        if (b) {
            switch (b.pluginType) {
                case "flash":
                    b.pluginElement = b.pluginApi = document.getElementById(a);
                    break;
                case "silverlight":
                    b.pluginElement = document.getElementById(b.id), b.pluginApi = b.pluginElement.Content.MediaElementJS
            }
            null != b.pluginApi && b.success && b.success(b, c)
        }
    },
    fireEvent: function(a, b, c) {
        var d, e, f, g = this.pluginMediaElements[a];
        if (g) {
            d = {
                type: b,
                target: g
            };
            for (e in c) g[e] = c[e], d[e] = c[e];
            f = c.bufferedTime || 0, d.target.buffered = d.buffered = {
                start: function(a) {
                    return 0
                },
                end: function(a) {
                    return f
                },
                length: 1
            }, g.dispatchEvent(d)
        }
    }
}, mejs.MediaElementDefaults = {
    mode: "auto",
    plugins: ["flash", "silverlight", "youtube", "vimeo"],
    enablePluginDebug: !1,
    httpsBasicAuthSite: !1,
    type: "",
    pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.js", "mediaelement-and-player.js", "mediaelement-and-player.min.js"]),
    flashName: "flashmediaelement.swf",
    flashStreamer: "",
    flashScriptAccess: "sameDomain",
    enablePluginSmoothing: !1,
    enablePseudoStreaming: !1,
    pseudoStreamingStartQueryParam: "start",
    silverlightName: "silverlightmediaelement.xap",
    defaultVideoWidth: 480,
    defaultVideoHeight: 270,
    pluginWidth: -1,
    pluginHeight: -1,
    pluginVars: [],
    timerRate: 250,
    startVolume: .8,
    success: function() {},
    error: function() {}
}, mejs.MediaElement = function(a, b) {
    return mejs.HtmlMediaElementShim.create(a, b)
}, mejs.HtmlMediaElementShim = {
    create: function(a, b) {
        var c, d, e = {},
            f = "string" == typeof a ? document.getElementById(a) : a,
            g = f.tagName.toLowerCase(),
            h = "audio" === g || "video" === g,
            i = h ? f.getAttribute("src") : f.getAttribute("href"),
            j = f.getAttribute("poster"),
            k = f.getAttribute("autoplay"),
            l = f.getAttribute("preload"),
            m = f.getAttribute("controls");
        for (d in mejs.MediaElementDefaults) e[d] = mejs.MediaElementDefaults[d];
        for (d in b) e[d] = b[d];
        return i = "undefined" == typeof i || null === i || "" == i ? null : i, j = "undefined" == typeof j || null === j ? "" : j, l = "undefined" == typeof l || null === l || "false" === l ? "none" : l, k = !("undefined" == typeof k || null === k || "false" === k), m = !("undefined" == typeof m || null === m || "false" === m), c = this.determinePlayback(f, e, mejs.MediaFeatures.supportsMediaTag, h, i), c.url = null !== c.url ? mejs.Utility.absolutizeUrl(c.url) : "", "native" == c.method ? (mejs.MediaFeatures.isBustedAndroid && (f.src = c.url, f.addEventListener("click", function() {
            f.play()
        }, !1)), this.updateNative(c, e, k, l)) : "" !== c.method ? this.createPlugin(c, e, j, k, l, m) : (this.createErrorMessage(c, e, j), this)
    },
    determinePlayback: function(a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, n, o, p, q = [],
            r = {
                method: "",
                url: "",
                htmlMediaElement: a,
                isVideo: "audio" != a.tagName.toLowerCase()
            };
        if ("undefined" != typeof b.type && "" !== b.type)
            if ("string" == typeof b.type) q.push({
                type: b.type,
                url: e
            });
            else
                for (f = 0; f < b.type.length; f++) q.push({
                    type: b.type[f],
                    url: e
                });
        else if (null !== e) k = this.formatType(e, a.getAttribute("type")), q.push({
            type: k,
            url: e
        });
        else
            for (f = 0; f < a.childNodes.length; f++) j = a.childNodes[f], 1 == j.nodeType && "source" == j.tagName.toLowerCase() && (e = j.getAttribute("src"), k = this.formatType(e, j.getAttribute("type")), p = j.getAttribute("media"), (!p || !window.matchMedia || window.matchMedia && window.matchMedia(p).matches) && q.push({
                type: k,
                url: e
            }));
        if (!d && q.length > 0 && null !== q[0].url && this.getTypeFromFile(q[0].url).indexOf("audio") > -1 && (r.isVideo = !1), mejs.MediaFeatures.isBustedAndroid && (a.canPlayType = function(a) {
                return null !== a.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
            }), mejs.MediaFeatures.isChromium && (a.canPlayType = function(a) {
                return null !== a.match(/video\/(webm|ogv|ogg)/gi) ? "maybe" : ""
            }), c && ("auto" === b.mode || "auto_plugin" === b.mode || "native" === b.mode) && (!mejs.MediaFeatures.isBustedNativeHTTPS || b.httpsBasicAuthSite !== !0)) {
            for (d || (o = document.createElement(r.isVideo ? "video" : "audio"), a.parentNode.insertBefore(o, a), a.style.display = "none", r.htmlMediaElement = a = o), f = 0; f < q.length; f++)
                if ("video/m3u8" == q[f].type || "" !== a.canPlayType(q[f].type).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/mp3/, "mpeg")).replace(/no/, "") || "" !== a.canPlayType(q[f].type.replace(/m4a/, "mp4")).replace(/no/, "")) {
                    r.method = "native", r.url = q[f].url;
                    break
                }
            if ("native" === r.method && (null !== r.url && (a.src = r.url), "auto_plugin" !== b.mode)) return r
        }
        if ("auto" === b.mode || "auto_plugin" === b.mode || "shim" === b.mode)
            for (f = 0; f < q.length; f++)
                for (k = q[f].type, g = 0; g < b.plugins.length; g++)
                    for (l = b.plugins[g], m = mejs.plugins[l], h = 0; h < m.length; h++)
                        if (n = m[h], null == n.version || mejs.PluginDetector.hasPluginVersion(l, n.version))
                            for (i = 0; i < n.types.length; i++)
                                if (k.toLowerCase() == n.types[i].toLowerCase()) return r.method = l, r.url = q[f].url, r;
        return "auto_plugin" === b.mode && "native" === r.method ? r : ("" === r.method && q.length > 0 && (r.url = q[0].url), r)
    },
    formatType: function(a, b) {
        return a && !b ? this.getTypeFromFile(a) : b && ~b.indexOf(";") ? b.substr(0, b.indexOf(";")) : b
    },
    getTypeFromFile: function(a) {
        a = a.split("?")[0];
        var b = a.substring(a.lastIndexOf(".") + 1).toLowerCase(),
            c = /(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b) ? "video/" : "audio/";
        return this.getTypeFromExtension(b, c)
    },
    getTypeFromExtension: function(a, b) {
        switch (b = b || "", a) {
            case "mp4":
            case "m4v":
            case "m4a":
            case "f4v":
            case "f4a":
                return b + "mp4";
            case "flv":
                return b + "x-flv";
            case "webm":
            case "webma":
            case "webmv":
                return b + "webm";
            case "ogg":
            case "oga":
            case "ogv":
                return b + "ogg";
            case "m3u8":
                return "application/x-mpegurl";
            case "ts":
                return b + "mp2t";
            default:
                return b + a
        }
    },
    createErrorMessage: function(a, b, c) {
        var d = a.htmlMediaElement,
            e = document.createElement("div"),
            f = b.customError;
        e.className = "me-cannotplay";
        try {
            e.style.width = d.width + "px", e.style.height = d.height + "px"
        } catch (a) {}
        f || (f = '<a href="' + a.url + '">', "" !== c && (f += '<img src="' + c + '" width="100%" height="100%" alt="" />'), f += "<span>" + mejs.i18n.t("Download File") + "</span></a>"), e.innerHTML = f, d.parentNode.insertBefore(e, d), d.style.display = "none", b.error(d)
    },
    createPlugin: function(a, b, c, d, e, f) {
        var g, h, i, j = a.htmlMediaElement,
            k = 1,
            l = 1,
            m = "me_" + a.method + "_" + mejs.meIndex++,
            n = new mejs.PluginMediaElement(m, a.method, a.url),
            o = document.createElement("div");
        n.tagName = j.tagName;
        for (var p = 0; p < j.attributes.length; p++) {
            var q = j.attributes[p];
            q.specified && n.setAttribute(q.name, q.value)
        }
        for (h = j.parentNode; null !== h && null != h.tagName && "body" !== h.tagName.toLowerCase() && null != h.parentNode && null != h.parentNode.tagName && null != h.parentNode.constructor && "ShadowRoot" === h.parentNode.constructor.name;) {
            if ("p" === h.parentNode.tagName.toLowerCase()) {
                h.parentNode.parentNode.insertBefore(h, h.parentNode);
                break
            }
            h = h.parentNode
        }
        switch (a.isVideo ? (k = b.pluginWidth > 0 ? b.pluginWidth : b.videoWidth > 0 ? b.videoWidth : null !== j.getAttribute("width") ? j.getAttribute("width") : b.defaultVideoWidth, l = b.pluginHeight > 0 ? b.pluginHeight : b.videoHeight > 0 ? b.videoHeight : null !== j.getAttribute("height") ? j.getAttribute("height") : b.defaultVideoHeight, k = mejs.Utility.encodeUrl(k), l = mejs.Utility.encodeUrl(l)) : b.enablePluginDebug && (k = 320, l = 240), n.success = b.success, mejs.MediaPluginBridge.registerPluginElement(m, n, j), o.className = "me-plugin", o.id = m + "_container", a.isVideo ? j.parentNode.insertBefore(o, j) : document.body.insertBefore(o, document.body.childNodes[0]), i = ["id=" + m, "jsinitfunction=mejs.MediaPluginBridge.initPlugin", "jscallbackfunction=mejs.MediaPluginBridge.fireEvent", "isvideo=" + (a.isVideo ? "true" : "false"), "autoplay=" + (d ? "true" : "false"), "preload=" + e, "width=" + k, "startvolume=" + b.startVolume, "timerrate=" + b.timerRate, "flashstreamer=" + b.flashStreamer, "height=" + l, "pseudostreamstart=" + b.pseudoStreamingStartQueryParam], null !== a.url && ("flash" == a.method ? i.push("file=" + mejs.Utility.encodeUrl(a.url)) : i.push("file=" + a.url)), b.enablePluginDebug && i.push("debug=true"), b.enablePluginSmoothing && i.push("smoothing=true"), b.enablePseudoStreaming && i.push("pseudostreaming=true"), f && i.push("controls=true"), b.pluginVars && (i = i.concat(b.pluginVars)), a.method) {
            case "silverlight":
                o.innerHTML = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + m + '" name="' + m + '" width="' + k + '" height="' + l + '" class="mejs-shim"><param name="initParams" value="' + i.join(",") + '" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="' + b.pluginPath + b.silverlightName + '" /></object>';
                break;
            case "flash":
                mejs.MediaFeatures.isIE ? (g = document.createElement("div"), o.appendChild(g), g.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + m + '" width="' + k + '" height="' + l + '" class="mejs-shim"><param name="movie" value="' + b.pluginPath + b.flashName + "?x=" + new Date + '" /><param name="flashvars" value="' + i.join("&amp;") + '" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + b.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>') : o.innerHTML = '<embed id="' + m + '" name="' + m + '" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="' + b.flashScriptAccess + '" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="' + b.pluginPath + b.flashName + '" flashvars="' + i.join("&") + '" width="' + k + '" height="' + l + '" scale="default"class="mejs-shim"></embed>';
                break;
            case "youtube":
                var r; - 1 != a.url.lastIndexOf("youtu.be") ? (r = a.url.substr(a.url.lastIndexOf("/") + 1), -1 != r.indexOf("?") && (r = r.substr(0, r.indexOf("?")))) : r = a.url.substr(a.url.lastIndexOf("=") + 1), youtubeSettings = {
                container: o,
                containerId: o.id,
                pluginMediaElement: n,
                pluginId: m,
                videoId: r,
                height: l,
                width: k
            }, mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0]) ? mejs.YouTubeApi.createFlash(youtubeSettings, b) : mejs.YouTubeApi.enqueueIframe(youtubeSettings);
                break;
            case "vimeo":
                var s = m + "_player";
                if (n.vimeoid = a.url.substr(a.url.lastIndexOf("/") + 1), o.innerHTML = '<iframe src="//player.vimeo.com/video/' + n.vimeoid + "?api=1&portrait=0&byline=0&title=0&player_id=" + s + '" width="' + k + '" height="' + l + '" frameborder="0" class="mejs-shim" id="' + s + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "function" == typeof $f) {
                    var t = $f(o.childNodes[0]);
                    t.addEvent("ready", function() {
                        function a(a, b, c, d) {
                            var e = {
                                type: c,
                                target: b
                            };
                            "timeupdate" == c && (b.currentTime = e.currentTime = d.seconds, b.duration = e.duration = d.duration), b.dispatchEvent(e)
                        }
                        t.playVideo = function() {
                            t.api("play")
                        }, t.stopVideo = function() {
                            t.api("unload")
                        }, t.pauseVideo = function() {
                            t.api("pause")
                        }, t.seekTo = function(a) {
                            t.api("seekTo", a)
                        }, t.setVolume = function(a) {
                            t.api("setVolume", a)
                        }, t.setMuted = function(a) {
                            a ? (t.lastVolume = t.api("getVolume"), t.api("setVolume", 0)) : (t.api("setVolume", t.lastVolume), delete t.lastVolume)
                        }, t.addEvent("play", function() {
                            a(t, n, "play"), a(t, n, "playing")
                        }), t.addEvent("pause", function() {
                            a(t, n, "pause")
                        }), t.addEvent("finish", function() {
                            a(t, n, "ended")
                        }), t.addEvent("playProgress", function(b) {
                            a(t, n, "timeupdate", b)
                        }), n.pluginElement = o, n.pluginApi = t, mejs.MediaPluginBridge.initPlugin(m)
                    })
                } else console.warn("You need to include froogaloop for vimeo to work")
        }
        return j.style.display = "none", j.removeAttribute("autoplay"), n
    },
    updateNative: function(a, b, c, d) {
        var e, f = a.htmlMediaElement;
        for (e in mejs.HtmlMediaElement) f[e] = mejs.HtmlMediaElement[e];
        return b.success(f, f), f
    }
}, mejs.YouTubeApi = {
    isIframeStarted: !1,
    isIframeLoaded: !1,
    loadIframeApi: function() {
        if (!this.isIframeStarted) {
            var a = document.createElement("script");
            a.src = "//www.youtube.com/player_api";
            var b = document.getElementsByTagName("script")[0];
            b.parentNode.insertBefore(a, b), this.isIframeStarted = !0
        }
    },
    iframeQueue: [],
    enqueueIframe: function(a) {
        this.isLoaded ? this.createIframe(a) : (this.loadIframeApi(), this.iframeQueue.push(a))
    },
    createIframe: function(a) {
        var b = a.pluginMediaElement,
            c = new YT.Player(a.containerId, {
                height: a.height,
                width: a.width,
                videoId: a.videoId,
                playerVars: {
                    controls: 0
                },
                events: {
                    onReady: function() {
                        a.pluginMediaElement.pluginApi = c, mejs.MediaPluginBridge.initPlugin(a.pluginId), setInterval(function() {
                            mejs.YouTubeApi.createEvent(c, b, "timeupdate")
                        }, 250)
                    },
                    onStateChange: function(a) {
                        mejs.YouTubeApi.handleStateChange(a.data, c, b)
                    }
                }
            })
    },
    createEvent: function(a, b, c) {
        var d = {
            type: c,
            target: b
        };
        if (a && a.getDuration) {
            b.currentTime = d.currentTime = a.getCurrentTime(), b.duration = d.duration = a.getDuration(), d.paused = b.paused, d.ended = b.ended, d.muted = a.isMuted(), d.volume = a.getVolume() / 100, d.bytesTotal = a.getVideoBytesTotal(), d.bufferedBytes = a.getVideoBytesLoaded();
            var e = d.bufferedBytes / d.bytesTotal * d.duration;
            d.target.buffered = d.buffered = {
                start: function(a) {
                    return 0
                },
                end: function(a) {
                    return e
                },
                length: 1
            }
        }
        b.dispatchEvent(d)
    },
    iFrameReady: function() {
        for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0;) {
            var a = this.iframeQueue.pop();
            this.createIframe(a)
        }
    },
    flashPlayers: {},
    createFlash: function(a) {
        this.flashPlayers[a.pluginId] = a;
        var b, c = "//www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=" + a.pluginId + "&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";
        mejs.MediaFeatures.isIE ? (b = document.createElement("div"), a.container.appendChild(b), b.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + a.pluginId + '" width="' + a.width + '" height="' + a.height + '" class="mejs-shim"><param name="movie" value="' + c + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + options.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /></object>') : a.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + a.pluginId + '" data="' + c + '" width="' + a.width + '" height="' + a.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="' + options.flashScriptAccess + '"><param name="wmode" value="transparent"></object>'
    },
    flashReady: function(a) {
        var b = this.flashPlayers[a],
            c = document.getElementById(a),
            d = b.pluginMediaElement;
        d.pluginApi = d.pluginElement = c, mejs.MediaPluginBridge.initPlugin(a), c.cueVideoById(b.videoId);
        var e = b.containerId + "_callback";
        window[e] = function(a) {
            mejs.YouTubeApi.handleStateChange(a, c, d)
        }, c.addEventListener("onStateChange", e), setInterval(function() {
            mejs.YouTubeApi.createEvent(c, d, "timeupdate")
        }, 250), mejs.YouTubeApi.createEvent(c, d, "canplay")
    },
    handleStateChange: function(a, b, c) {
        switch (a) {
            case -1:
                c.paused = !0, c.ended = !0, mejs.YouTubeApi.createEvent(b, c, "loadedmetadata");
                break;
            case 0:
                c.paused = !1, c.ended = !0, mejs.YouTubeApi.createEvent(b, c, "ended");
                break;
            case 1:
                c.paused = !1, c.ended = !1, mejs.YouTubeApi.createEvent(b, c, "play"), mejs.YouTubeApi.createEvent(b, c, "playing");
                break;
            case 2:
                c.paused = !0, c.ended = !1, mejs.YouTubeApi.createEvent(b, c, "pause");
                break;
            case 3:
                mejs.YouTubeApi.createEvent(b, c, "progress");
                break;
            case 5:
        }
    }
}, window.onYouTubePlayerAPIReady = function() {
    mejs.YouTubeApi.iFrameReady()
}, window.onYouTubePlayerReady = function(a) {
    mejs.YouTubeApi.flashReady(a)
}, window.mejs = mejs, window.MediaElement = mejs.MediaElement,
    function(a, b, c) {
        "use strict";
        var d = {
            locale: {
                language: b.i18n && b.i18n.locale.language || "",
                strings: b.i18n && b.i18n.locale.strings || {}
            },
            ietf_lang_regex: /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/,
            methods: {}
        };
        d.getLanguage = function() {
            var a = d.locale.language || window.navigator.userLanguage || window.navigator.language;
            return d.ietf_lang_regex.exec(a) ? a : null
        }, "undefined" != typeof mejsL10n && (d.locale.language = mejsL10n.language), d.methods.checkPlain = function(a) {
            var b, c, d = {
                "&": "&amp;",
                '"': "&quot;",
                "<": "&lt;",
                ">": "&gt;"
            };
            a = String(a);
            for (b in d) d.hasOwnProperty(b) && (c = new RegExp(b, "g"), a = a.replace(c, d[b]));
            return a
        }, d.methods.t = function(a, b) {
            return d.locale.strings && d.locale.strings[b.context] && d.locale.strings[b.context][a] && (a = d.locale.strings[b.context][a]), d.methods.checkPlain(a)
        }, d.t = function(a, b) {
            if ("string" == typeof a && a.length > 0) {
                var c = d.getLanguage();
                return b = b || {
                    context: c
                }, d.methods.t(a, b)
            }
            throw {
                name: "InvalidArgumentException",
                message: "First argument is either not a string or empty."
            }
        }, b.i18n = d
    }(document, mejs),
    function(a, b) {
        "use strict";
        "undefined" != typeof mejsL10n && (a[mejsL10n.language] = mejsL10n.strings)
    }(mejs.i18n.locale.strings), "undefined" != typeof jQuery ? mejs.$ = jQuery : "undefined" != typeof Zepto ? (mejs.$ = Zepto, Zepto.fn.outerWidth = function(a) {
    var b = $(this).width();
    return a && (b += parseInt($(this).css("margin-right"), 10), b += parseInt($(this).css("margin-left"), 10)), b
}) : "undefined" != typeof ender && (mejs.$ = ender),
    function(a) {
        mejs.MepDefaults = {
            poster: "",
            showPosterWhenEnded: !1,
            defaultVideoWidth: 480,
            defaultVideoHeight: 270,
            videoWidth: -1,
            videoHeight: -1,
            defaultAudioWidth: 400,
            defaultAudioHeight: 30,
            defaultSeekBackwardInterval: function(a) {
                return .05 * a.duration
            },
            defaultSeekForwardInterval: function(a) {
                return .05 * a.duration
            },
            setDimensions: !0,
            audioWidth: -1,
            audioHeight: -1,
            startVolume: .8,
            loop: !1,
            autoRewind: !0,
            enableAutosize: !0,
            timeFormat: "",
            alwaysShowHours: !1,
            showTimecodeFrameCount: !1,
            framesPerSecond: 25,
            autosizeProgress: !0,
            alwaysShowControls: !1,
            hideVideoControlsOnLoad: !1,
            clickToPlayPause: !0,
            iPadUseNativeControls: !1,
            iPhoneUseNativeControls: !1,
            AndroidUseNativeControls: !1,
            features: ["playpause", "current", "progress", "duration", "tracks", "volume", "fullscreen"],
            isVideo: !0,
            enableKeyboard: !0,
            pauseOtherPlayers: !0,
            keyActions: [{
                keys: [32, 179],
                action: function(a, b) {
                    b.paused || b.ended ? b.play() : b.pause()
                }
            }, {
                keys: [38],
                action: function(a, b) {
                    a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                    var c = Math.min(b.volume + .1, 1);
                    b.setVolume(c)
                }
            }, {
                keys: [40],
                action: function(a, b) {
                    a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer());
                    var c = Math.max(b.volume - .1, 0);
                    b.setVolume(c)
                }
            }, {
                keys: [37, 227],
                action: function(a, b) {
                    if (!isNaN(b.duration) && b.duration > 0) {
                        a.isVideo && (a.showControls(), a.startControlsTimer());
                        var c = Math.max(b.currentTime - a.options.defaultSeekBackwardInterval(b), 0);
                        b.setCurrentTime(c)
                    }
                }
            }, {
                keys: [39, 228],
                action: function(a, b) {
                    if (!isNaN(b.duration) && b.duration > 0) {
                        a.isVideo && (a.showControls(), a.startControlsTimer());
                        var c = Math.min(b.currentTime + a.options.defaultSeekForwardInterval(b), b.duration);
                        b.setCurrentTime(c)
                    }
                }
            }, {
                keys: [70],
                action: function(a, b) {
                    "undefined" != typeof a.enterFullScreen && (a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen())
                }
            }, {
                keys: [77],
                action: function(a, b) {
                    a.container.find(".mejs-volume-slider").css("display", "block"), a.isVideo && (a.showControls(), a.startControlsTimer()), a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                }
            }]
        }, mejs.mepIndex = 0, mejs.players = {}, mejs.MediaElementPlayer = function(b, c) {
            if (!(this instanceof mejs.MediaElementPlayer)) return new mejs.MediaElementPlayer(b, c);
            var d = this;
            return d.$media = d.$node = a(b), d.node = d.media = d.$media[0], d.node ? "undefined" != typeof d.node.player ? d.node.player : ("undefined" == typeof c && (c = d.$node.data("mejsoptions")), d.options = a.extend({}, mejs.MepDefaults, c), d.options.timeFormat || (d.options.timeFormat = "mm:ss", d.options.alwaysShowHours && (d.options.timeFormat = "hh:mm:ss"), d.options.showTimecodeFrameCount && (d.options.timeFormat += ":ff")), mejs.Utility.calculateTimeFormat(0, d.options, d.options.framesPerSecond || 25), d.id = "mep_" + mejs.mepIndex++, mejs.players[d.id] = d, d.init(), d) : void 0
        }, mejs.MediaElementPlayer.prototype = {
            hasFocus: !1,
            controlsAreVisible: !0,
            init: function() {
                var b = this,
                    c = mejs.MediaFeatures,
                    d = a.extend(!0, {}, b.options, {
                        success: function(a, c) {
                            b.meReady(a, c)
                        },
                        error: function(a) {
                            b.handleError(a)
                        }
                    }),
                    e = b.media.tagName.toLowerCase();
                if (b.isDynamic = "audio" !== e && "video" !== e, b.isDynamic ? b.isVideo = b.options.isVideo : b.isVideo = "audio" !== e && b.options.isVideo, c.isiPad && b.options.iPadUseNativeControls || c.isiPhone && b.options.iPhoneUseNativeControls) b.$media.attr("controls", "controls"), c.isiPad && null !== b.media.getAttribute("autoplay") && b.play();
                else if (c.isAndroid && b.options.AndroidUseNativeControls);
                else {
                    b.$media.removeAttr("controls");
                    var f = b.isVideo ? mejs.i18n.t("Video Player") : mejs.i18n.t("Audio Player");
                    a('<span class="mejs-offscreen">' + f + "</span>").insertBefore(b.$media), b.container = a('<div id="' + b.id + '" class="mejs-container ' + (mejs.MediaFeatures.svgAsImg ? "svg" : "no-svg") + '" tabindex="0" role="application" aria-label="' + f + '"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(b.$media[0].className).insertBefore(b.$media).focus(function(a) {
                        if (!b.controlsAreVisible) {
                            b.showControls(!0);
                            var c = b.container.find(".mejs-playpause-button > button");
                            c.focus()
                        }
                    }), b.container.addClass((c.isAndroid ? "mejs-android " : "") + (c.isiOS ? "mejs-ios " : "") + (c.isiPad ? "mejs-ipad " : "") + (c.isiPhone ? "mejs-iphone " : "") + (b.isVideo ? "mejs-video " : "mejs-audio ")), b.container.find(".mejs-mediaelement").append(b.$media), b.node.player = b, b.controls = b.container.find(".mejs-controls"), b.layers = b.container.find(".mejs-layers");
                    var g = b.isVideo ? "video" : "audio",
                        h = g.substring(0, 1).toUpperCase() + g.substring(1);
                    b.options[g + "Width"] > 0 || b.options[g + "Width"].toString().indexOf("%") > -1 ? b.width = b.options[g + "Width"] : "" !== b.media.style.width && null !== b.media.style.width ? b.width = b.media.style.width : null !== b.media.getAttribute("width") ? b.width = b.$media.attr("width") : b.width = b.options["default" + h + "Width"], b.options[g + "Height"] > 0 || b.options[g + "Height"].toString().indexOf("%") > -1 ? b.height = b.options[g + "Height"] : "" !== b.media.style.height && null !== b.media.style.height ? b.height = b.media.style.height : null !== b.$media[0].getAttribute("height") ? b.height = b.$media.attr("height") : b.height = b.options["default" + h + "Height"], b.setPlayerSize(b.width, b.height), d.pluginWidth = b.width, d.pluginHeight = b.height
                }
                mejs.MediaElement(b.$media[0], d), "undefined" != typeof b.container && b.controlsAreVisible && b.container.trigger("controlsshown")
            },
            showControls: function(a) {
                var b = this;
                a = "undefined" == typeof a || a, b.controlsAreVisible || (a ? (b.controls.css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                    b.controlsAreVisible = !0, b.container.trigger("controlsshown")
                }), b.container.find(".mejs-control").css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                    b.controlsAreVisible = !0
                })) : (b.controls.css("visibility", "visible").css("display", "block"), b.container.find(".mejs-control").css("visibility", "visible").css("display", "block"), b.controlsAreVisible = !0, b.container.trigger("controlsshown")), b.setControlsSize())
            },
            hideControls: function(b) {
                var c = this;
                b = "undefined" == typeof b || b, !c.controlsAreVisible || c.options.alwaysShowControls || c.keyboardAction || (b ? (c.controls.stop(!0, !0).fadeOut(200, function() {
                    a(this).css("visibility", "hidden").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")
                }), c.container.find(".mejs-control").stop(!0, !0).fadeOut(200, function() {
                    a(this).css("visibility", "hidden").css("display", "block")
                })) : (c.controls.css("visibility", "hidden").css("display", "block"), c.container.find(".mejs-control").css("visibility", "hidden").css("display", "block"), c.controlsAreVisible = !1, c.container.trigger("controlshidden")))
            },
            controlsTimer: null,
            startControlsTimer: function(a) {
                var b = this;
                a = "undefined" != typeof a ? a : 1500, b.killControlsTimer("start"), b.controlsTimer = setTimeout(function() {
                    b.hideControls(), b.killControlsTimer("hide")
                }, a)
            },
            killControlsTimer: function(a) {
                var b = this;
                null !== b.controlsTimer && (clearTimeout(b.controlsTimer), delete b.controlsTimer, b.controlsTimer = null)
            },
            controlsEnabled: !0,
            disableControls: function() {
                var a = this;
                a.killControlsTimer(), a.hideControls(!1), this.controlsEnabled = !1
            },
            enableControls: function() {
                var a = this;
                a.showControls(!1), a.controlsEnabled = !0
            },
            meReady: function(b, c) {
                var d, e, f = this,
                    g = mejs.MediaFeatures,
                    h = c.getAttribute("autoplay"),
                    i = !("undefined" == typeof h || null === h || "false" === h);
                if (!f.created) {
                    if (f.created = !0, f.media = b, f.domNode = c, !(g.isAndroid && f.options.AndroidUseNativeControls || g.isiPad && f.options.iPadUseNativeControls || g.isiPhone && f.options.iPhoneUseNativeControls)) {
                        f.buildposter(f, f.controls, f.layers, f.media), f.buildkeyboard(f, f.controls, f.layers, f.media), f.buildoverlays(f, f.controls, f.layers, f.media), f.findTracks();
                        for (d in f.options.features)
                            if (e = f.options.features[d], f["build" + e]) try {
                                f["build" + e](f, f.controls, f.layers, f.media)
                            } catch (a) {}
                        f.container.trigger("controlsready"), f.setPlayerSize(f.width, f.height), f.setControlsSize(), f.isVideo && (mejs.MediaFeatures.hasTouch ? f.$media.bind("touchstart", function() {
                            f.controlsAreVisible ? f.hideControls(!1) : f.controlsEnabled && f.showControls(!1)
                        }) : (f.clickToPlayPauseCallback = function() {
                            f.options.clickToPlayPause && (f.media.paused ? f.play() : f.pause())
                        }, f.media.addEventListener("click", f.clickToPlayPauseCallback, !1), f.container.bind("mouseenter", function() {
                            f.controlsEnabled && (f.options.alwaysShowControls || (f.killControlsTimer("enter"), f.showControls(), f.startControlsTimer(2500)))
                        }).bind("mousemove", function() {
                            f.controlsEnabled && (f.controlsAreVisible || f.showControls(), f.options.alwaysShowControls || f.startControlsTimer(2500))
                        }).bind("mouseleave", function() {
                            f.controlsEnabled && (f.media.paused || f.options.alwaysShowControls || f.startControlsTimer(1e3))
                        })), f.options.hideVideoControlsOnLoad && f.hideControls(!1), i && !f.options.alwaysShowControls && f.hideControls(), f.options.enableAutosize && f.media.addEventListener("loadedmetadata", function(a) {
                            f.options.videoHeight <= 0 && null === f.domNode.getAttribute("height") && !isNaN(a.target.videoHeight) && (f.setPlayerSize(a.target.videoWidth, a.target.videoHeight), f.setControlsSize(), f.media.setVideoSize(a.target.videoWidth, a.target.videoHeight))
                        }, !1)), b.addEventListener("play", function() {
                            var a;
                            for (a in mejs.players) {
                                var b = mejs.players[a];
                                b.id == f.id || !f.options.pauseOtherPlayers || b.paused || b.ended || b.pause(), b.hasFocus = !1
                            }
                            f.hasFocus = !0
                        }, !1), f.media.addEventListener("ended", function(b) {
                            if (f.options.autoRewind) try {
                                f.media.setCurrentTime(0), window.setTimeout(function() {
                                    a(f.container).find(".mejs-overlay-loading").parent().hide()
                                }, 20)
                            } catch (a) {}
                            f.media.pause(), f.setProgressRail && f.setProgressRail(), f.setCurrentRail && f.setCurrentRail(), f.options.loop ? f.play() : !f.options.alwaysShowControls && f.controlsEnabled && f.showControls()
                        }, !1), f.media.addEventListener("loadedmetadata", function(a) {
                            f.updateDuration && f.updateDuration(), f.updateCurrent && f.updateCurrent(), f.isFullScreen || (f.setPlayerSize(f.width, f.height), f.setControlsSize())
                        }, !1);
                        var j = null;
                        f.media.addEventListener("timeupdate", function() {
                            j !== this.duration && (j = this.duration, mejs.Utility.calculateTimeFormat(j, f.options, f.options.framesPerSecond || 25))
                        }, !1), f.container.focusout(function(b) {
                            if (b.relatedTarget) {
                                var c = a(b.relatedTarget);
                                f.keyboardAction && 0 === c.parents(".mejs-container").length && (f.keyboardAction = !1, f.hideControls(!0))
                            }
                        }), setTimeout(function() {
                            f.setPlayerSize(f.width, f.height), f.setControlsSize()
                        }, 50), f.globalBind("resize", function() {
                            f.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen || f.setPlayerSize(f.width, f.height), f.setControlsSize()
                        }), "youtube" == f.media.pluginType && (g.isiOS || g.isAndroid) && f.container.find(".mejs-overlay-play").hide()
                    }
                    i && "native" == b.pluginType && f.play(), f.options.success && ("string" == typeof f.options.success ? window[f.options.success](f.media, f.domNode, f) : f.options.success(f.media, f.domNode, f))
                }
            },
            handleError: function(a) {
                var b = this;
                b.controls && b.controls.hide(), b.options.error && b.options.error(a)
            },
            setPlayerSize: function(b, c) {
                var d = this;
                if (!d.options.setDimensions) return !1;
                if ("undefined" != typeof b && (d.width = b), "undefined" != typeof c && (d.height = c), d.height.toString().indexOf("%") > 0 || "none" !== d.$node.css("max-width") && "t.width" !== d.$node.css("max-width") || d.$node[0].currentStyle && "100%" === d.$node[0].currentStyle.maxWidth) {
                    var e = function() {
                            return d.isVideo ? d.media.videoWidth && d.media.videoWidth > 0 ? d.media.videoWidth : null !== d.media.getAttribute("width") ? d.media.getAttribute("width") : d.options.defaultVideoWidth : d.options.defaultAudioWidth
                        }(),
                        f = function() {
                            return d.isVideo ? d.media.videoHeight && d.media.videoHeight > 0 ? d.media.videoHeight : null !== d.media.getAttribute("height") ? d.media.getAttribute("height") : d.options.defaultVideoHeight : d.options.defaultAudioHeight
                        }(),
                        g = d.container.parent().closest(":visible").width(),
                        h = d.container.parent().closest(":visible").height(),
                        i = d.isVideo || !d.options.autosizeProgress ? parseInt(g * f / e, 10) : f;
                    isNaN(i) && (i = h), d.container.parent().length > 0 && "body" === d.container.parent()[0].tagName.toLowerCase() && (g = a(window).width(), i = a(window).height()), i && g && (d.container.width(g).height(i), d.$media.add(d.container.find(".mejs-shim")).width("100%").height("100%"), d.isVideo && d.media.setVideoSize && d.media.setVideoSize(g, i), d.layers.children(".mejs-layer").width("100%").height("100%"));
                } else d.container.width(d.width).height(d.height), d.layers.children(".mejs-layer").width(d.width).height(d.height)
            },
            setControlsSize: function() {
                var b = this,
                    c = 0,
                    d = 0,
                    e = b.controls.find(".mejs-time-rail"),
                    f = b.controls.find(".mejs-time-total"),
                    g = e.siblings(),
                    h = g.last(),
                    i = null;
                if (b.container.is(":visible") && e.length && e.is(":visible")) {
                    b.options && !b.options.autosizeProgress && (d = parseInt(e.css("width"), 10)), 0 !== d && d || (g.each(function() {
                        var b = a(this);
                        "absolute" != b.css("position") && b.is(":visible") && (c += a(this).outerWidth(!0))
                    }), d = b.controls.width() - c - (e.outerWidth(!0) - e.width()));
                    do e.width(d), f.width(d - (f.outerWidth(!0) - f.width())), "absolute" != h.css("position") && (i = h.length ? h.position() : null, d--); while (null !== i && i.top > 0 && d > 0);
                    b.container.trigger("controlsresize")
                }
            },
            buildposter: function(b, c, d, e) {
                var f = this,
                    g = a('<div class="mejs-poster mejs-layer"></div>').appendTo(d),
                    h = b.$media.attr("poster");
                "" !== b.options.poster && (h = b.options.poster), h ? f.setPoster(h) : g.hide(), e.addEventListener("play", function() {
                    g.hide()
                }, !1), b.options.showPosterWhenEnded && b.options.autoRewind && e.addEventListener("ended", function() {
                    g.show()
                }, !1)
            },
            setPoster: function(b) {
                var c = this,
                    d = c.container.find(".mejs-poster"),
                    e = d.find("img");
                0 === e.length && (e = a('<img width="100%" height="100%" alt="" />').appendTo(d)), e.attr("src", b), d.css({
                    "background-image": "url(" + b + ")"
                })
            },
            buildoverlays: function(b, c, d, e) {
                var f = this;
                if (b.isVideo) {
                    var g = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(d),
                        h = a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(d),
                        i = a('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(d).bind("click", function() {
                            f.options.clickToPlayPause && e.paused && e.play()
                        });
                    e.addEventListener("play", function() {
                        i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                    }, !1), e.addEventListener("playing", function() {
                        i.hide(), g.hide(), c.find(".mejs-time-buffering").hide(), h.hide()
                    }, !1), e.addEventListener("seeking", function() {
                        g.show(), c.find(".mejs-time-buffering").show()
                    }, !1), e.addEventListener("seeked", function() {
                        g.hide(), c.find(".mejs-time-buffering").hide()
                    }, !1), e.addEventListener("pause", function() {
                        mejs.MediaFeatures.isiPhone || i.show()
                    }, !1), e.addEventListener("waiting", function() {
                        g.show(), c.find(".mejs-time-buffering").show()
                    }, !1), e.addEventListener("loadeddata", function() {
                        g.show(), c.find(".mejs-time-buffering").show(), mejs.MediaFeatures.isAndroid && (e.canplayTimeout = window.setTimeout(function() {
                            if (document.createEvent) {
                                var a = document.createEvent("HTMLEvents");
                                return a.initEvent("canplay", !0, !0), e.dispatchEvent(a)
                            }
                        }, 300))
                    }, !1), e.addEventListener("canplay", function() {
                        g.hide(), c.find(".mejs-time-buffering").hide(), clearTimeout(e.canplayTimeout)
                    }, !1), e.addEventListener("error", function(a) {
                        f.handleError(a), g.hide(), i.hide(), h.show(), h.find(".mejs-overlay-error").html("Error loading this resource")
                    }, !1), e.addEventListener("keydown", function(a) {
                        f.onkeydown(b, e, a)
                    }, !1)
                }
            },
            buildkeyboard: function(b, c, d, e) {
                var f = this;
                f.container.keydown(function() {
                    f.keyboardAction = !0
                }), f.globalBind("keydown", function(c) {
                    return b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length, f.onkeydown(b, e, c)
                }), f.globalBind("click", function(c) {
                    b.hasFocus = 0 !== a(c.target).closest(".mejs-container").length
                })
            },
            onkeydown: function(a, b, c) {
                if (a.hasFocus && a.options.enableKeyboard)
                    for (var d = 0, e = a.options.keyActions.length; e > d; d++)
                        for (var f = a.options.keyActions[d], g = 0, h = f.keys.length; h > g; g++)
                            if (c.keyCode == f.keys[g]) return "function" == typeof c.preventDefault && c.preventDefault(), f.action(a, b, c.keyCode), !1;
                return !0
            },
            findTracks: function() {
                var b = this,
                    c = b.$media.find("track");
                b.tracks = [], c.each(function(c, d) {
                    d = a(d), b.tracks.push({
                        srclang: d.attr("srclang") ? d.attr("srclang").toLowerCase() : "",
                        src: d.attr("src"),
                        kind: d.attr("kind"),
                        label: d.attr("label") || "",
                        entries: [],
                        isLoaded: !1
                    })
                })
            },
            changeSkin: function(a) {
                this.container[0].className = "mejs-container " + a, this.setPlayerSize(this.width, this.height), this.setControlsSize()
            },
            play: function() {
                this.load(), this.media.play()
            },
            pause: function() {
                try {
                    this.media.pause()
                } catch (a) {}
            },
            load: function() {
                this.isLoaded || this.media.load(), this.isLoaded = !0
            },
            setMuted: function(a) {
                this.media.setMuted(a)
            },
            setCurrentTime: function(a) {
                this.media.setCurrentTime(a)
            },
            getCurrentTime: function() {
                return this.media.currentTime
            },
            setVolume: function(a) {
                this.media.setVolume(a)
            },
            getVolume: function() {
                return this.media.volume
            },
            setSrc: function(a) {
                this.media.setSrc(a)
            },
            remove: function() {
                var a, b, c = this;
                c.container.prev(".mejs-offscreen").remove();
                for (a in c.options.features)
                    if (b = c.options.features[a], c["clean" + b]) try {
                        c["clean" + b](c)
                    } catch (a) {}
                c.isDynamic ? c.$node.insertBefore(c.container) : (c.$media.prop("controls", !0), c.$node.clone().insertBefore(c.container).show(), c.$node.remove()), "native" !== c.media.pluginType && c.media.remove(), delete mejs.players[c.id], "object" == typeof c.container && c.container.remove(), c.globalUnbind(), delete c.node.player
            },
            rebuildtracks: function() {
                var a = this;
                a.findTracks(), a.buildtracks(a, a.controls, a.layers, a.media)
            },
            resetSize: function() {
                var a = this;
                setTimeout(function() {
                    a.setPlayerSize(a.width, a.height), a.setControlsSize()
                }, 50)
            }
        },
            function() {
                function b(b, d) {
                    var e = {
                        d: [],
                        w: []
                    };
                    return a.each((b || "").split(" "), function(a, b) {
                        var f = b + "." + d;
                        0 === f.indexOf(".") ? (e.d.push(f), e.w.push(f)) : e[c.test(b) ? "w" : "d"].push(f)
                    }), e.d = e.d.join(" "), e.w = e.w.join(" "), e
                }
                var c = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
                mejs.MediaElementPlayer.prototype.globalBind = function(c, d, e) {
                    var f = this,
                        g = f.node ? f.node.ownerDocument : document;
                    c = b(c, f.id), c.d && a(g).bind(c.d, d, e), c.w && a(window).bind(c.w, d, e)
                }, mejs.MediaElementPlayer.prototype.globalUnbind = function(c, d) {
                    var e = this,
                        f = e.node ? e.node.ownerDocument : document;
                    c = b(c, e.id), c.d && a(f).unbind(c.d, d), c.w && a(window).unbind(c.w, d)
                }
            }(), "undefined" != typeof a && (a.fn.mediaelementplayer = function(b) {
            return b === !1 ? this.each(function() {
                var b = a(this).data("mediaelementplayer");
                b && b.remove(), a(this).removeData("mediaelementplayer")
            }) : this.each(function() {
                a(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, b))
            }), this
        }, a(document).ready(function() {
            a(".mejs-player").mediaelementplayer()
        })), window.MediaElementPlayer = mejs.MediaElementPlayer
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            playText: mejs.i18n.t("Play"),
            pauseText: mejs.i18n.t("Pause")
        }), a.extend(MediaElementPlayer.prototype, {
            buildplaypause: function(b, c, d, e) {
                function f(a) {
                    "play" === a ? (i.removeClass("mejs-play").addClass("mejs-pause"), j.attr({
                        title: h.pauseText,
                        "aria-label": h.pauseText
                    })) : (i.removeClass("mejs-pause").addClass("mejs-play"), j.attr({
                        title: h.playText,
                        "aria-label": h.playText
                    }))
                }
                var g = this,
                    h = g.options,
                    i = a('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="' + g.id + '" title="' + h.playText + '" aria-label="' + h.playText + '"></button></div>').appendTo(c).click(function(a) {
                        return a.preventDefault(), e.paused ? e.play() : e.pause(), !1
                    }),
                    j = i.find("button");
                f("pse"), e.addEventListener("play", function() {
                    f("play")
                }, !1), e.addEventListener("playing", function() {
                    f("play")
                }, !1), e.addEventListener("pause", function() {
                    f("pse")
                }, !1), e.addEventListener("paused", function() {
                    f("pse")
                }, !1)
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            stopText: "Stop"
        }), a.extend(MediaElementPlayer.prototype, {
            buildstop: function(b, c, d, e) {
                var f = this;
                a('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="' + f.id + '" title="' + f.options.stopText + '" aria-label="' + f.options.stopText + '"></button></div>').appendTo(c).click(function() {
                    e.paused || e.pause(), e.currentTime > 0 && (e.setCurrentTime(0), e.pause(), c.find(".mejs-time-current").width("0px"), c.find(".mejs-time-handle").css("left", "0px"), c.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0, b.options)), c.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0, b.options)), d.find(".mejs-poster").show())
                })
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            progessHelpText: mejs.i18n.t("Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.")
        }), a.extend(MediaElementPlayer.prototype, {
            buildprogress: function(b, c, d, e) {
                a('<div class="mejs-time-rail"><span  class="mejs-time-total mejs-time-slider"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(c), c.find(".mejs-time-buffering").hide();
                var f = this,
                    g = c.find(".mejs-time-total"),
                    h = c.find(".mejs-time-loaded"),
                    i = c.find(".mejs-time-current"),
                    j = c.find(".mejs-time-handle"),
                    k = c.find(".mejs-time-float"),
                    l = c.find(".mejs-time-float-current"),
                    m = c.find(".mejs-time-slider"),
                    n = function(a) {
                        var c, d = g.offset(),
                            f = g.width(),
                            h = 0,
                            i = 0,
                            j = 0;
                        c = a.originalEvent && a.originalEvent.changedTouches ? a.originalEvent.changedTouches[0].pageX : a.changedTouches ? a.changedTouches[0].pageX : a.pageX, e.duration && (c < d.left ? c = d.left : c > f + d.left && (c = f + d.left), j = c - d.left, h = j / f, i = .02 >= h ? 0 : h * e.duration, o && i !== e.currentTime && e.setCurrentTime(i), mejs.MediaFeatures.hasTouch || (k.css("left", j), l.html(mejs.Utility.secondsToTimeCode(i, b.options)), k.show()))
                    },
                    o = !1,
                    p = !1,
                    q = 0,
                    r = !1,
                    s = b.options.autoRewind,
                    t = function(a) {
                        var c = e.currentTime,
                            d = mejs.i18n.t("Time Slider"),
                            f = mejs.Utility.secondsToTimeCode(c, b.options),
                            g = e.duration;
                        m.attr({
                            "aria-label": d,
                            "aria-valuemin": 0,
                            "aria-valuemax": g,
                            "aria-valuenow": c,
                            "aria-valuetext": f,
                            role: "slider",
                            tabindex: 0
                        })
                    },
                    u = function() {
                        var a = new Date;
                        a - q >= 1e3 && e.play()
                    };
                m.bind("focus", function(a) {
                    b.options.autoRewind = !1
                }), m.bind("blur", function(a) {
                    b.options.autoRewind = s
                }), m.bind("keydown", function(a) {
                    new Date - q >= 1e3 && (r = e.paused);
                    var b = a.keyCode,
                        c = e.duration,
                        d = e.currentTime;
                    switch (b) {
                        case 37:
                            d -= 1;
                            break;
                        case 39:
                            d += 1;
                            break;
                        case 38:
                            d += Math.floor(.1 * c);
                            break;
                        case 40:
                            d -= Math.floor(.1 * c);
                            break;
                        case 36:
                            d = 0;
                            break;
                        case 35:
                            d = c;
                            break;
                        case 10:
                            return void(e.paused ? e.play() : e.pause());
                        case 13:
                            return void(e.paused ? e.play() : e.pause());
                        default:
                            return
                    }
                    return d = 0 > d ? 0 : d >= c ? c : Math.floor(d), q = new Date, r || e.pause(), d < e.duration && !r && setTimeout(u, 1100), e.setCurrentTime(d), a.preventDefault(), a.stopPropagation(), !1
                }), g.bind("mousedown touchstart", function(a) {
                    (1 === a.which || 0 === a.which) && (o = !0, n(a), f.globalBind("mousemove.dur touchmove.dur", function(a) {
                        n(a)
                    }), f.globalBind("mouseup.dur touchend.dur", function(a) {
                        o = !1, k.hide(), f.globalUnbind(".dur")
                    }))
                }).bind("mouseenter", function(a) {
                    p = !0, f.globalBind("mousemove.dur", function(a) {
                        n(a)
                    }), mejs.MediaFeatures.hasTouch || k.show()
                }).bind("mouseleave", function(a) {
                    p = !1, o || (f.globalUnbind(".dur"), k.hide())
                }), e.addEventListener("progress", function(a) {
                    b.setProgressRail(a), b.setCurrentRail(a)
                }, !1), e.addEventListener("timeupdate", function(a) {
                    b.setProgressRail(a), b.setCurrentRail(a), t(a)
                }, !1), f.container.on("controlsresize", function() {
                    b.setProgressRail(), b.setCurrentRail()
                }), f.loaded = h, f.total = g, f.current = i, f.handle = j
            },
            setProgressRail: function(a) {
                var b = this,
                    c = void 0 !== a ? a.target : b.media,
                    d = null;
                c && c.buffered && c.buffered.length > 0 && c.buffered.end && c.duration ? d = c.buffered.end(c.buffered.length - 1) / c.duration : c && void 0 !== c.bytesTotal && c.bytesTotal > 0 && void 0 !== c.bufferedBytes ? d = c.bufferedBytes / c.bytesTotal : a && a.lengthComputable && 0 !== a.total && (d = a.loaded / a.total), null !== d && (d = Math.min(1, Math.max(0, d)), b.loaded && b.total && b.loaded.width(b.total.width() * d))
            },
            setCurrentRail: function() {
                var a = this;
                if (void 0 !== a.media.currentTime && a.media.duration && a.total && a.handle) {
                    var b = Math.round(a.total.width() * a.media.currentTime / a.media.duration),
                        c = b - Math.round(a.handle.outerWidth(!0) / 2);
                    a.current.width(b), a.handle.css("left", c)
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            duration: -1,
            timeAndDurationSeparator: "<span> | </span>"
        }), a.extend(MediaElementPlayer.prototype, {
            buildcurrent: function(b, c, d, e) {
                var f = this;
                a('<div class="mejs-time" role="timer" aria-live="off"><span class="mejs-currenttime">' + mejs.Utility.secondsToTimeCode(0, b.options) + "</span></div>").appendTo(c), f.currenttime = f.controls.find(".mejs-currenttime"), e.addEventListener("timeupdate", function() {
                    b.updateCurrent()
                }, !1)
            },
            buildduration: function(b, c, d, e) {
                var f = this;
                c.children().last().find(".mejs-currenttime").length > 0 ? a(f.options.timeAndDurationSeparator + '<span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span>").appendTo(c.find(".mejs-time")) : (c.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"), a('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">' + mejs.Utility.secondsToTimeCode(f.options.duration, f.options) + "</span></div>").appendTo(c)), f.durationD = f.controls.find(".mejs-duration"), e.addEventListener("timeupdate", function() {
                    b.updateDuration()
                }, !1)
            },
            updateCurrent: function() {
                var a = this;
                a.currenttime && a.currenttime.html(mejs.Utility.secondsToTimeCode(a.media.currentTime, a.options))
            },
            updateDuration: function() {
                var a = this;
                a.container.toggleClass("mejs-long-video", a.media.duration > 3600), a.durationD && (a.options.duration > 0 || a.media.duration) && a.durationD.html(mejs.Utility.secondsToTimeCode(a.options.duration > 0 ? a.options.duration : a.media.duration, a.options))
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            muteText: mejs.i18n.t("Mute Toggle"),
            allyVolumeControlText: mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),
            hideVolumeOnTouchDevices: !0,
            audioVolume: "horizontal",
            videoVolume: "vertical"
        }), a.extend(MediaElementPlayer.prototype, {
            buildvolume: function(b, c, d, e) {
                if (!mejs.MediaFeatures.isAndroid && !mejs.MediaFeatures.isiOS || !this.options.hideVolumeOnTouchDevices) {
                    var f = this,
                        g = f.isVideo ? f.options.videoVolume : f.options.audioVolume,
                        h = "horizontal" == g ? a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button></div><a href="javascript:void(0);" class="mejs-horizontal-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></a>').appendTo(c) : a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + f.id + '" title="' + f.options.muteText + '" aria-label="' + f.options.muteText + '"></button><a href="javascript:void(0);" class="mejs-volume-slider"><span class="mejs-offscreen">' + f.options.allyVolumeControlText + '</span><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></a></div>').appendTo(c),
                        i = f.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),
                        j = f.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),
                        k = f.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),
                        l = f.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),
                        m = function(a, b) {
                            if (!i.is(":visible") && "undefined" == typeof b) return i.show(), m(a, !0), void i.hide();
                            a = Math.max(0, a), a = Math.min(a, 1), 0 === a ? (h.removeClass("mejs-mute").addClass("mejs-unmute"), h.children("button").attr("title", mejs.i18n.t("Unmute")).attr("aria-label", mejs.i18n.t("Unmute"))) : (h.removeClass("mejs-unmute").addClass("mejs-mute"), h.children("button").attr("title", mejs.i18n.t("Mute")).attr("aria-label", mejs.i18n.t("Mute")));
                            var c = j.position();
                            if ("vertical" == g) {
                                var d = j.height(),
                                    e = d - d * a;
                                l.css("top", Math.round(c.top + e - l.height() / 2)), k.height(d - e), k.css("top", c.top + e)
                            } else {
                                var f = j.width(),
                                    n = f * a;
                                l.css("left", Math.round(c.left + n - l.width() / 2)), k.width(Math.round(n))
                            }
                        },
                        n = function(a) {
                            var b = null,
                                c = j.offset();
                            if ("vertical" === g) {
                                var d = j.height(),
                                    f = a.pageY - c.top;
                                if (b = (d - f) / d, 0 === c.top || 0 === c.left) return
                            } else {
                                var h = j.width(),
                                    i = a.pageX - c.left;
                                b = i / h
                            }
                            b = Math.max(0, b), b = Math.min(b, 1), m(b), 0 === b ? e.setMuted(!0) : e.setMuted(!1), e.setVolume(b)
                        },
                        o = !1,
                        p = !1;
                    h.hover(function() {
                        i.show(), p = !0
                    }, function() {
                        p = !1, o || "vertical" != g || i.hide()
                    });
                    var q = function(a) {
                        var b = Math.floor(100 * e.volume);
                        i.attr({
                            "aria-label": mejs.i18n.t("volumeSlider"),
                            "aria-valuemin": 0,
                            "aria-valuemax": 100,
                            "aria-valuenow": b,
                            "aria-valuetext": b + "%",
                            role: "slider",
                            tabindex: 0
                        })
                    };
                    i.bind("mouseover", function() {
                        p = !0
                    }).bind("mousedown", function(a) {
                        return n(a), f.globalBind("mousemove.vol", function(a) {
                            n(a)
                        }), f.globalBind("mouseup.vol", function() {
                            o = !1, f.globalUnbind(".vol"), p || "vertical" != g || i.hide()
                        }), o = !0, !1
                    }).bind("keydown", function(a) {
                        var b = a.keyCode,
                            c = e.volume;
                        switch (b) {
                            case 38:
                                c += .1;
                                break;
                            case 40:
                                c -= .1;
                                break;
                            default:
                                return !0
                        }
                        return o = !1, m(c), e.setVolume(c), !1
                    }), h.find("button").click(function() {
                        e.setMuted(!e.muted)
                    }), h.find("button").bind("focus", function() {
                        i.show()
                    }), e.addEventListener("volumechange", function(a) {
                        o || (e.muted ? (m(0), h.removeClass("mejs-mute").addClass("mejs-unmute")) : (m(e.volume), h.removeClass("mejs-unmute").addClass("mejs-mute"))), q(a)
                    }, !1), 0 === b.options.startVolume && e.setMuted(!0), "native" === e.pluginType && e.setVolume(b.options.startVolume), f.container.on("controlsresize", function() {
                        m(e.volume)
                    })
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            usePluginFullScreen: !0,
            newWindowCallback: function() {
                return ""
            },
            fullscreenText: mejs.i18n.t("Fullscreen")
        }), a.extend(MediaElementPlayer.prototype, {
            isFullScreen: !1,
            isNativeFullScreen: !1,
            isInIframe: !1,
            buildfullscreen: function(b, c, d, e) {
                if (b.isVideo) {
                    if (b.isInIframe = window.location != window.parent.location, mejs.MediaFeatures.hasTrueNativeFullScreen) {
                        var f = function(a) {
                            b.isFullScreen && (mejs.MediaFeatures.isFullScreen() ? (b.isNativeFullScreen = !0, b.setControlsSize()) : (b.isNativeFullScreen = !1, b.exitFullScreen()))
                        };
                        b.globalBind(mejs.MediaFeatures.fullScreenEventName, f)
                    }
                    var g = this,
                        h = a('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="' + g.id + '" title="' + g.options.fullscreenText + '" aria-label="' + g.options.fullscreenText + '"></button></div>').appendTo(c);
                    if ("native" === g.media.pluginType || !g.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox) h.click(function() {
                        var a = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || b.isFullScreen;
                        a ? b.exitFullScreen() : b.enterFullScreen()
                    });
                    else {
                        var i = null,
                            j = function() {
                                var a, b = document.createElement("x"),
                                    c = document.documentElement,
                                    d = window.getComputedStyle;
                                return "pointerEvents" in b.style && (b.style.pointerEvents = "auto", b.style.pointerEvents = "x", c.appendChild(b), a = d && "auto" === d(b, "").pointerEvents, c.removeChild(b), !!a)
                            }();
                        if (j && !mejs.MediaFeatures.isOpera) {
                            var k, l, m = !1,
                                n = function() {
                                    if (m) {
                                        for (var a in o) o[a].hide();
                                        h.css("pointer-events", ""), g.controls.css("pointer-events", ""), g.media.removeEventListener("click", g.clickToPlayPauseCallback), m = !1
                                    }
                                },
                                o = {},
                                p = ["top", "left", "right", "bottom"],
                                q = function() {
                                    var a = h.offset().left - g.container.offset().left,
                                        b = h.offset().top - g.container.offset().top,
                                        c = h.outerWidth(!0),
                                        d = h.outerHeight(!0),
                                        e = g.container.width(),
                                        f = g.container.height();
                                    for (k in o) o[k].css({
                                        position: "absolute",
                                        top: 0,
                                        left: 0
                                    });
                                    o.top.width(e).height(b), o.left.width(a).height(d).css({
                                        top: b
                                    }), o.right.width(e - a - c).height(d).css({
                                        top: b,
                                        left: a + c
                                    }), o.bottom.width(e).height(f - d - b).css({
                                        top: b + d
                                    })
                                };
                            for (g.globalBind("resize", function() {
                                q()
                            }), k = 0, l = p.length; l > k; k++) o[p[k]] = a('<div class="mejs-fullscreen-hover" />').appendTo(g.container).mouseover(n).hide();
                            h.on("mouseover", function() {
                                if (!g.isFullScreen) {
                                    var a = h.offset(),
                                        c = b.container.offset();
                                    e.positionFullscreenButton(a.left - c.left, a.top - c.top, !1), h.css("pointer-events", "none"), g.controls.css("pointer-events", "none"), g.media.addEventListener("click", g.clickToPlayPauseCallback);
                                    for (k in o) o[k].show();
                                    q(), m = !0
                                }
                            }), e.addEventListener("fullscreenchange", function(a) {
                                g.isFullScreen = !g.isFullScreen, g.isFullScreen ? g.media.removeEventListener("click", g.clickToPlayPauseCallback) : g.media.addEventListener("click", g.clickToPlayPauseCallback), n()
                            }), g.globalBind("mousemove", function(a) {
                                if (m) {
                                    var b = h.offset();
                                    (a.pageY < b.top || a.pageY > b.top + h.outerHeight(!0) || a.pageX < b.left || a.pageX > b.left + h.outerWidth(!0)) && (h.css("pointer-events", ""), g.controls.css("pointer-events", ""), m = !1)
                                }
                            })
                        } else h.on("mouseover", function() {
                            null !== i && (clearTimeout(i), delete i);
                            var a = h.offset(),
                                c = b.container.offset();
                            e.positionFullscreenButton(a.left - c.left, a.top - c.top, !0)
                        }).on("mouseout", function() {
                            null !== i && (clearTimeout(i), delete i), i = setTimeout(function() {
                                e.hideFullscreenButton()
                            }, 1500)
                        })
                    }
                    b.fullscreenBtn = h, g.globalBind("keydown", function(a) {
                        (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || g.isFullScreen) && 27 == a.keyCode && b.exitFullScreen()
                    }), g.normalHeight = 0, g.normalWidth = 0
                }
            },
            cleanfullscreen: function(a) {
                a.exitFullScreen()
            },
            containerSizeTimeout: null,
            enterFullScreen: function() {
                var b = this;
                if ("native" === b.media.pluginType || !mejs.MediaFeatures.isFirefox && !b.options.usePluginFullScreen) {
                    if (a(document.documentElement).addClass("mejs-fullscreen"), b.normalHeight = b.container.height(), b.normalWidth = b.container.width(), "native" === b.media.pluginType)
                        if (mejs.MediaFeatures.hasTrueNativeFullScreen) mejs.MediaFeatures.requestFullScreen(b.container[0]), b.isInIframe && setTimeout(function c() {
                            if (b.isNativeFullScreen) {
                                var d = window.devicePixelRatio || 1,
                                    e = .002,
                                    f = d * a(window).width(),
                                    g = screen.width,
                                    h = d * f;
                                Math.abs(g - f) > Math.abs(g - h) && (f = h);
                                var i = Math.abs(g - f),
                                    j = g * e;
                                i > j ? b.exitFullScreen() : setTimeout(c, 500)
                            }
                        }, 1e3);
                        else if (mejs.MediaFeatures.hasSemiNativeFullScreen) return void b.media.webkitEnterFullscreen();
                    if (b.isInIframe) {
                        var c = b.options.newWindowCallback(this);
                        if ("" !== c) {
                            if (!mejs.MediaFeatures.hasTrueNativeFullScreen) return b.pause(), void window.open(c, b.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no");
                            setTimeout(function() {
                                b.isNativeFullScreen || (b.pause(), window.open(c, b.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no"))
                            }, 250)
                        }
                    }
                    b.container.addClass("mejs-container-fullscreen").width("100%").height("100%"), b.containerSizeTimeout = setTimeout(function() {
                        b.container.css({
                            width: "100%",
                            height: "100%"
                        }), b.setControlsSize()
                    }, 500), "native" === b.media.pluginType ? b.$media.width("100%").height("100%") : (b.container.find(".mejs-shim").width("100%").height("100%"), b.media.setVideoSize(a(window).width(), a(window).height())), b.layers.children("div").width("100%").height("100%"), b.fullscreenBtn && b.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"), b.setControlsSize(), b.isFullScreen = !0, b.container.find(".mejs-captions-text").css("font-size", screen.width / b.width * 1 * 100 + "%"), b.container.find(".mejs-captions-position").css("bottom", "45px"), b.container.trigger("enteredfullscreen")
                }
            },
            exitFullScreen: function() {
                var b = this;
                return clearTimeout(b.containerSizeTimeout), "native" !== b.media.pluginType && mejs.MediaFeatures.isFirefox ? void b.media.setFullscreen(!1) : (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || b.isFullScreen) && mejs.MediaFeatures.cancelFullScreen(), a(document.documentElement).removeClass("mejs-fullscreen"), b.container.removeClass("mejs-container-fullscreen").width(b.normalWidth).height(b.normalHeight), "native" === b.media.pluginType ? b.$media.width(b.normalWidth).height(b.normalHeight) : (b.container.find(".mejs-shim").width(b.normalWidth).height(b.normalHeight), b.media.setVideoSize(b.normalWidth, b.normalHeight)), b.layers.children("div").width(b.normalWidth).height(b.normalHeight), b.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"), b.setControlsSize(), b.isFullScreen = !1, b.container.find(".mejs-captions-text").css("font-size", ""), b.container.find(".mejs-captions-position").css("bottom", ""), void b.container.trigger("exitedfullscreen"))
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
            defaultSpeed: "1.00",
            speedChar: "x"
        }), a.extend(MediaElementPlayer.prototype, {
            buildspeed: function(b, c, d, e) {
                var f = this;
                if ("native" == f.media.pluginType) {
                    for (var g = null, h = null, i = null, j = null, k = [], l = !1, m = 0, n = f.options.speeds.length; n > m; m++) {
                        var o = f.options.speeds[m];
                        "string" == typeof o ? (k.push({
                            name: o + f.options.speedChar,
                            value: o
                        }), o === f.options.defaultSpeed && (l = !0)) : (k.push(o), o.value === f.options.defaultSpeed && (l = !0))
                    }
                    l || k.push({
                        name: f.options.defaultSpeed + f.options.speedChar,
                        value: f.options.defaultSpeed
                    }), k.sort(function(a, b) {
                        return parseFloat(b.value) - parseFloat(a.value)
                    });
                    var p = function(a) {
                            for (m = 0, n = k.length; n > m; m++)
                                if (k[m].value === a) return k[m].name
                        },
                        q = '<div class="mejs-button mejs-speed-button"><button type="button">' + p(f.options.defaultSpeed) + '</button><div class="mejs-speed-selector"><ul>';
                    for (m = 0, il = k.length; m < il; m++) j = f.id + "-speed-" + k[m].value, q += '<li><input type="radio" name="speed" value="' + k[m].value + '" id="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? " checked" : "") + ' /><label for="' + j + '" ' + (k[m].value === f.options.defaultSpeed ? ' class="mejs-speed-selected"' : "") + ">" + k[m].name + "</label></li>";
                    q += "</ul></div></div>", g = a(q).appendTo(c), h = g.find(".mejs-speed-selector"), i = f.options.defaultSpeed, e.addEventListener("loadedmetadata", function(a) {
                        i && (e.playbackRate = parseFloat(i))
                    }, !0), h.on("click", 'input[type="radio"]', function() {
                        var b = a(this).attr("value");
                        i = b, e.playbackRate = parseFloat(b), g.find("button").html(p(b)), g.find(".mejs-speed-selected").removeClass("mejs-speed-selected"), g.find('input[type="radio"]:checked').next().addClass("mejs-speed-selected")
                    }), g.one("mouseenter focusin", function() {
                        h.height(g.find(".mejs-speed-selector ul").outerHeight(!0) + g.find(".mejs-speed-translations").outerHeight(!0)).css("top", -1 * h.height() + "px")
                    })
                }
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            startLanguage: "",
            tracksText: mejs.i18n.t("Captions/Subtitles"),
            tracksAriaLive: !1,
            hideCaptionsButtonWhenEmpty: !0,
            toggleCaptionsButtonWhenOnlyOne: !1,
            slidesSelector: ""
        }), a.extend(MediaElementPlayer.prototype, {
            hasChapters: !1,
            cleartracks: function(a, b, c, d) {
                a && (a.captions && a.captions.remove(), a.chapters && a.chapters.remove(), a.captionsText && a.captionsText.remove(), a.captionsButton && a.captionsButton.remove())
            },
            buildtracks: function(b, c, d, e) {
                if (0 !== b.tracks.length) {
                    var f, g = this,
                        h = g.options.tracksAriaLive ? 'role="log" aria-live="assertive" aria-atomic="false"' : "";
                    if (g.domNode.textTracks)
                        for (f = g.domNode.textTracks.length - 1; f >= 0; f--) g.domNode.textTracks[f].mode = "hidden";
                    g.cleartracks(b, c, d, e), b.chapters = a('<div class="mejs-chapters mejs-layer"></div>').prependTo(d).hide(), b.captions = a('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover" ' + h + '><span class="mejs-captions-text"></span></div></div>').prependTo(d).hide(), b.captionsText = b.captions.find(".mejs-captions-text"), b.captionsButton = a('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="' + g.id + '" title="' + g.options.tracksText + '" aria-label="' + g.options.tracksText + '"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="' + b.id + '_captions" id="' + b.id + '_captions_none" value="none" checked="checked" /><label for="' + b.id + '_captions_none">' + mejs.i18n.t("None") + "</label></li></ul></div></div>").appendTo(c);
                    var i = 0;
                    for (f = 0; f < b.tracks.length; f++) "subtitles" == b.tracks[f].kind && i++;
                    for (g.options.toggleCaptionsButtonWhenOnlyOne && 1 == i ? b.captionsButton.on("click", function() {
                        null === b.selectedTrack ? lang = b.tracks[0].srclang : lang = "none", b.setTrack(lang)
                    }) : (b.captionsButton.on("mouseenter focusin", function() {
                        a(this).find(".mejs-captions-selector").css("visibility", "visible")
                    }).on("click", "input[type=radio]", function() {
                        lang = this.value, b.setTrack(lang)
                    }), b.captionsButton.on("mouseleave focusout", function() {
                        a(this).find(".mejs-captions-selector").css("visibility", "hidden")
                    })), b.options.alwaysShowControls ? b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover") : b.container.bind("controlsshown", function() {
                        b.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")
                    }).bind("controlshidden", function() {
                        e.paused || b.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")
                    }), b.trackToLoad = -1, b.selectedTrack = null, b.isLoadingTrack = !1, f = 0; f < b.tracks.length; f++) "subtitles" == b.tracks[f].kind && b.addTrackButton(b.tracks[f].srclang, b.tracks[f].label);
                    b.loadNextTrack(), e.addEventListener("timeupdate", function(a) {
                        b.displayCaptions()
                    }, !1), "" !== b.options.slidesSelector && (b.slidesContainer = a(b.options.slidesSelector), e.addEventListener("timeupdate", function(a) {
                        b.displaySlides()
                    }, !1)), e.addEventListener("loadedmetadata", function(a) {
                        b.displayChapters()
                    }, !1), b.container.hover(function() {
                        b.hasChapters && (b.chapters.css("visibility", "visible"), b.chapters.fadeIn(200).height(b.chapters.find(".mejs-chapter").outerHeight()))
                    }, function() {
                        b.hasChapters && !e.paused && b.chapters.fadeOut(200, function() {
                            a(this).css("visibility", "hidden"), a(this).css("display", "block")
                        })
                    }), g.container.on("controlsresize", function() {
                        g.adjustLanguageBox()
                    }), null !== b.node.getAttribute("autoplay") && b.chapters.css("visibility", "hidden")
                }
            },
            setTrack: function(a) {
                var b, c = this;
                if ("none" == a) c.selectedTrack = null, c.captionsButton.removeClass("mejs-captions-enabled");
                else
                    for (b = 0; b < c.tracks.length; b++)
                        if (c.tracks[b].srclang == a) {
                            null === c.selectedTrack && c.captionsButton.addClass("mejs-captions-enabled"), c.selectedTrack = c.tracks[b], c.captions.attr("lang", c.selectedTrack.srclang), c.displayCaptions();
                            break
                        }
            },
            loadNextTrack: function() {
                var a = this;
                a.trackToLoad++, a.trackToLoad < a.tracks.length ? (a.isLoadingTrack = !0, a.loadTrack(a.trackToLoad)) : (a.isLoadingTrack = !1, a.checkForTracks())
            },
            loadTrack: function(b) {
                var c = this,
                    d = c.tracks[b],
                    e = function() {
                        d.isLoaded = !0, c.enableTrackButton(d.srclang, d.label), c.loadNextTrack()
                    };
                a.ajax({
                    url: d.src,
                    dataType: "text",
                    success: function(a) {
                        "string" == typeof a && /<tt\s+xml/gi.exec(a) ? d.entries = mejs.TrackFormatParser.dfxp.parse(a) : d.entries = mejs.TrackFormatParser.webvtt.parse(a), e(), "chapters" == d.kind && c.media.addEventListener("play", function(a) {
                            c.media.duration > 0 && c.displayChapters(d)
                        }, !1), "slides" == d.kind && c.setupSlides(d)
                    },
                    error: function() {
                        c.removeTrackButton(d.srclang), c.loadNextTrack()
                    }
                })
            },
            enableTrackButton: function(b, c) {
                var d = this;
                "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("input[value=" + b + "]").prop("disabled", !1).siblings("label").html(c), d.options.startLanguage == b && a("#" + d.id + "_captions_" + b).prop("checked", !0).trigger("click"), d.adjustLanguageBox()
            },
            removeTrackButton: function(a) {
                var b = this;
                b.captionsButton.find("input[value=" + a + "]").closest("li").remove(), b.adjustLanguageBox()
            },
            addTrackButton: function(b, c) {
                var d = this;
                "" === c && (c = mejs.language.codes[b] || b), d.captionsButton.find("ul").append(a('<li><input type="radio" name="' + d.id + '_captions" id="' + d.id + "_captions_" + b + '" value="' + b + '" disabled="disabled" /><label for="' + d.id + "_captions_" + b + '">' + c + " (loading)</label></li>")), d.adjustLanguageBox(), d.container.find(".mejs-captions-translations option[value=" + b + "]").remove()
            },
            adjustLanguageBox: function() {
                var a = this;
                a.captionsButton.find(".mejs-captions-selector").height(a.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0) + a.captionsButton.find(".mejs-captions-translations").outerHeight(!0))
            },
            checkForTracks: function() {
                var a = this,
                    b = !1;
                if (a.options.hideCaptionsButtonWhenEmpty) {
                    for (i = 0; i < a.tracks.length; i++)
                        if ("subtitles" == a.tracks[i].kind && a.tracks[i].isLoaded) {
                            b = !0;
                            break
                        }
                    b || (a.captionsButton.hide(), a.setControlsSize())
                }
            },
            displayCaptions: function() {
                if ("undefined" != typeof this.tracks) {
                    var a, b = this,
                        c = b.selectedTrack;
                    if (null !== c && c.isLoaded) {
                        for (a = 0; a < c.entries.times.length; a++)
                            if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop) return b.captionsText.html(c.entries.text[a]).attr("class", "mejs-captions-text " + (c.entries.times[a].identifier || "")), void b.captions.show().height(0);
                        b.captions.hide()
                    } else b.captions.hide()
                }
            },
            setupSlides: function(a) {
                var b = this;
                b.slides = a, b.slides.entries.imgs = [b.slides.entries.text.length], b.showSlide(0)
            },
            showSlide: function(b) {
                if ("undefined" != typeof this.tracks && "undefined" != typeof this.slidesContainer) {
                    var c = this,
                        d = c.slides.entries.text[b],
                        e = c.slides.entries.imgs[b];
                    "undefined" == typeof e || "undefined" == typeof e.fadeIn ? c.slides.entries.imgs[b] = e = a('<img src="' + d + '">').on("load", function() {
                        e.appendTo(c.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
                    }) : e.is(":visible") || e.is(":animated") || e.fadeIn().siblings(":visible").fadeOut()
                }
            },
            displaySlides: function() {
                if ("undefined" != typeof this.slides) {
                    var a, b = this,
                        c = b.slides;
                    for (a = 0; a < c.entries.times.length; a++)
                        if (b.media.currentTime >= c.entries.times[a].start && b.media.currentTime <= c.entries.times[a].stop) return void b.showSlide(a)
                }
            },
            displayChapters: function() {
                var a, b = this;
                for (a = 0; a < b.tracks.length; a++)
                    if ("chapters" == b.tracks[a].kind && b.tracks[a].isLoaded) {
                        b.drawChapters(b.tracks[a]), b.hasChapters = !0;
                        break
                    }
            },
            drawChapters: function(b) {
                var c, d, e = this,
                    f = 0,
                    g = 0;
                for (e.chapters.empty(), c = 0; c < b.entries.times.length; c++) d = b.entries.times[c].stop - b.entries.times[c].start, f = Math.floor(d / e.media.duration * 100), (f + g > 100 || c == b.entries.times.length - 1 && 100 > f + g) && (f = 100 - g), e.chapters.append(a('<div class="mejs-chapter" rel="' + b.entries.times[c].start + '" style="left: ' + g.toString() + "%;width: " + f.toString() + '%;"><div class="mejs-chapter-block' + (c == b.entries.times.length - 1 ? " mejs-chapter-block-last" : "") + '"><span class="ch-title">' + b.entries.text[c] + '</span><span class="ch-time">' + mejs.Utility.secondsToTimeCode(b.entries.times[c].start, e.options) + "&ndash;" + mejs.Utility.secondsToTimeCode(b.entries.times[c].stop, e.options) + "</span></div></div>")), g += f;
                e.chapters.find("div.mejs-chapter").click(function() {
                    e.media.setCurrentTime(parseFloat(a(this).attr("rel"))), e.media.paused && e.media.play()
                }), e.chapters.show()
            }
        }), mejs.language = {
            codes: {
                af: "Afrikaans",
                sq: "Albanian",
                ar: "Arabic",
                be: "Belarusian",
                bg: "Bulgarian",
                ca: "Catalan",
                zh: "Chinese",
                "zh-cn": "Chinese Simplified",
                "zh-tw": "Chinese Traditional",
                hr: "Croatian",
                cs: "Czech",
                da: "Danish",
                nl: "Dutch",
                en: "English",
                et: "Estonian",
                fl: "Filipino",
                fi: "Finnish",
                fr: "French",
                gl: "Galician",
                de: "German",
                el: "Greek",
                ht: "Haitian Creole",
                iw: "Hebrew",
                hi: "Hindi",
                hu: "Hungarian",
                is: "Icelandic",
                id: "Indonesian",
                ga: "Irish",
                it: "Italian",
                ja: "Japanese",
                ko: "Korean",
                lv: "Latvian",
                lt: "Lithuanian",
                mk: "Macedonian",
                ms: "Malay",
                mt: "Maltese",
                no: "Norwegian",
                fa: "Persian",
                pl: "Polish",
                pt: "Portuguese",
                ro: "Romanian",
                ru: "Russian",
                sr: "Serbian",
                sk: "Slovak",
                sl: "Slovenian",
                es: "Spanish",
                sw: "Swahili",
                sv: "Swedish",
                tl: "Tagalog",
                th: "Thai",
                tr: "Turkish",
                uk: "Ukrainian",
                vi: "Vietnamese",
                cy: "Welsh",
                yi: "Yiddish"
            }
        }, mejs.TrackFormatParser = {
            webvtt: {
                pattern_timecode: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
                parse: function(b) {
                    for (var c, d, e, f = 0, g = mejs.TrackFormatParser.split2(b, /\r?\n/), h = {
                        text: [],
                        times: []
                    }; f < g.length; f++) {
                        if (c = this.pattern_timecode.exec(g[f]), c && f < g.length) {
                            for (f - 1 >= 0 && "" !== g[f - 1] && (e = g[f - 1]), f++, d = g[f], f++;
                                 "" !== g[f] && f < g.length;) d = d + "\n" + g[f], f++;
                            d = a.trim(d).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), h.text.push(d), h.times.push({
                                identifier: e,
                                start: 0 === mejs.Utility.convertSMPTEtoSeconds(c[1]) ? .2 : mejs.Utility.convertSMPTEtoSeconds(c[1]),
                                stop: mejs.Utility.convertSMPTEtoSeconds(c[3]),
                                settings: c[5]
                            })
                        }
                        e = ""
                    }
                    return h
                }
            },
            dfxp: {
                parse: function(b) {
                    b = a(b).filter("tt");
                    var c, d, e = 0,
                        f = b.children("div").eq(0),
                        g = f.find("p"),
                        h = b.find("#" + f.attr("style")),
                        i = {
                            text: [],
                            times: []
                        };
                    if (h.length) {
                        var j = h.removeAttr("id").get(0).attributes;
                        if (j.length)
                            for (c = {}, e = 0; e < j.length; e++) c[j[e].name.split(":")[1]] = j[e].value
                    }
                    for (e = 0; e < g.length; e++) {
                        var k, l = {
                            start: null,
                            stop: null,
                            style: null
                        };
                        if (g.eq(e).attr("begin") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("begin"))), !l.start && g.eq(e - 1).attr("end") && (l.start = mejs.Utility.convertSMPTEtoSeconds(g.eq(e - 1).attr("end"))), g.eq(e).attr("end") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e).attr("end"))), !l.stop && g.eq(e + 1).attr("begin") && (l.stop = mejs.Utility.convertSMPTEtoSeconds(g.eq(e + 1).attr("begin"))), c) {
                            k = "";
                            for (var m in c) k += m + ":" + c[m] + ";"
                        }
                        k && (l.style = k), 0 === l.start && (l.start = .2), i.times.push(l), d = a.trim(g.eq(e).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), i.text.push(d), 0 === i.times.start && (i.times.start = 2)
                    }
                    return i
                }
            },
            split2: function(a, b) {
                return a.split(b)
            }
        }, 3 != "x\n\ny".split(/\n/gi).length && (mejs.TrackFormatParser.split2 = function(a, b) {
            var c, d = [],
                e = "";
            for (c = 0; c < a.length; c++) e += a.substring(c, c + 1), b.test(e) && (d.push(e.replace(b, "")), e = "");
            return d.push(e), d
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            contextMenuItems: [{
                render: function(a) {
                    return "undefined" == typeof a.enterFullScreen ? null : a.isFullScreen ? mejs.i18n.t("Turn off Fullscreen") : mejs.i18n.t("Go Fullscreen")
                },
                click: function(a) {
                    a.isFullScreen ? a.exitFullScreen() : a.enterFullScreen()
                }
            }, {
                render: function(a) {
                    return a.media.muted ? mejs.i18n.t("Unmute") : mejs.i18n.t("Mute")
                },
                click: function(a) {
                    a.media.muted ? a.setMuted(!1) : a.setMuted(!0)
                }
            }, {
                isSeparator: !0
            }, {
                render: function(a) {
                    return mejs.i18n.t("Download Video")
                },
                click: function(a) {
                    window.location.href = a.media.currentSrc
                }
            }]
        }), a.extend(MediaElementPlayer.prototype, {
            buildcontextmenu: function(b, c, d, e) {
                b.contextMenu = a('<div class="mejs-contextmenu"></div>').appendTo(a("body")).hide(), b.container.bind("contextmenu", function(a) {
                    return b.isContextMenuEnabled ? (a.preventDefault(), b.renderContextMenu(a.clientX - 1, a.clientY - 1), !1) : void 0
                }), b.container.bind("click", function() {
                    b.contextMenu.hide()
                }), b.contextMenu.bind("mouseleave", function() {
                    b.startContextMenuTimer()
                })
            },
            cleancontextmenu: function(a) {
                a.contextMenu.remove()
            },
            isContextMenuEnabled: !0,
            enableContextMenu: function() {
                this.isContextMenuEnabled = !0
            },
            disableContextMenu: function() {
                this.isContextMenuEnabled = !1
            },
            contextMenuTimeout: null,
            startContextMenuTimer: function() {
                var a = this;
                a.killContextMenuTimer(), a.contextMenuTimer = setTimeout(function() {
                    a.hideContextMenu(), a.killContextMenuTimer()
                }, 750)
            },
            killContextMenuTimer: function() {
                var a = this.contextMenuTimer;
                null != a && (clearTimeout(a), delete a, a = null)
            },
            hideContextMenu: function() {
                this.contextMenu.hide()
            },
            renderContextMenu: function(b, c) {
                for (var d = this, e = "", f = d.options.contextMenuItems, g = 0, h = f.length; h > g; g++)
                    if (f[g].isSeparator) e += '<div class="mejs-contextmenu-separator"></div>';
                    else {
                        var i = f[g].render(d);
                        null != i && (e += '<div class="mejs-contextmenu-item" data-itemindex="' + g + '" id="element-' + 1e6 * Math.random() + '">' + i + "</div>")
                    }
                d.contextMenu.empty().append(a(e)).css({
                    top: c,
                    left: b
                }).show(), d.contextMenu.find(".mejs-contextmenu-item").each(function() {
                    var b = a(this),
                        c = parseInt(b.data("itemindex"), 10),
                        e = d.options.contextMenuItems[c];
                    "undefined" != typeof e.show && e.show(b, d), b.click(function() {
                        "undefined" != typeof e.click && e.click(d), d.contextMenu.hide()
                    })
                }), setTimeout(function() {
                    d.killControlsTimer("rev3")
                }, 100)
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            skipBackInterval: 30,
            skipBackText: mejs.i18n.t("Skip back %1 seconds")
        }), a.extend(MediaElementPlayer.prototype, {
            buildskipback: function(b, c, d, e) {
                var f = this,
                    g = f.options.skipBackText.replace("%1", f.options.skipBackInterval);
                a('<div class="mejs-button mejs-skip-back-button"><button type="button" aria-controls="' + f.id + '" title="' + g + '" aria-label="' + g + '">' + f.options.skipBackInterval + "</button></div>").appendTo(c).click(function() {
                    e.setCurrentTime(Math.max(e.currentTime - f.options.skipBackInterval, 0)), a(this).find("button").blur()
                })
            }
        })
    }(mejs.$),
    function(a) {
        a.extend(mejs.MepDefaults, {
            postrollCloseText: mejs.i18n.t("Close")
        }), a.extend(MediaElementPlayer.prototype, {
            buildpostroll: function(b, c, d, e) {
                var f = this,
                    g = f.container.find('link[rel="postroll"]').attr("href");
                "undefined" != typeof g && (b.postroll = a('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + f.options.postrollCloseText + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(d).hide(), f.media.addEventListener("ended", function(c) {
                    a.ajax({
                        dataType: "html",
                        url: g,
                        success: function(a, b) {
                            d.find(".mejs-postroll-layer-content").html(a)
                        }
                    }), b.postroll.show()
                }, !1))
            }
        })
    }(mejs.$), jQuery(document).ready(function(a) {
    function b() {
        a(window).scrollTop() > c && !d.hasClass("is-fixed") ? d.addClass("is-fixed").find(".mobile-navigation-trigger").one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
            e.addClass("has-transitions")
        }) : a(window).scrollTop() <= c && (e.hasClass("is-visible") && !a("html").hasClass("no-csstransitions") ? e.addClass("is-hidden").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
            e.removeClass("is-visible is-hidden has-transitions"), d.removeClass("is-fixed"), a(".mobile-navigation-trigger").removeClass("menu-is-open")
        }) : e.hasClass("is-visible") && a("html").hasClass("no-csstransitions") ? (e.removeClass("is-visible has-transitions"), d.removeClass("is-fixed"), a(".mobile-navigation-trigger").removeClass("menu-is-open")) : (d.removeClass("is-fixed"), e.removeClass("has-transitions")))
    }
    var c = 300,
        d = a("#mobile-navigation-container"),
        e = d.find("nav.mobile-navigation");
    b(), a(window).scroll(function() {
        b()
    }), a(".mobile-navigation-trigger").on("click", function(b) {
        b.preventDefault(), a(this).toggleClass("menu-is-open"), e.off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend").toggleClass("is-visible")
    })
}), "function" != typeof Object.create && (Object.create = function(a) {
    function b() {}
    return b.prototype = a, new b
}),
    function(a, b, c) {
        var d = {
            init: function(b, c) {
                var d = this;
                d.$elem = a(c), d.options = a.extend({}, a.fn.owlCarousel.options, d.$elem.data(), b), d.userOptions = b, d.loadContent()
            },
            loadContent: function() {
                function b(a) {
                    var b, c = "";
                    if ("function" == typeof d.options.jsonSuccess) d.options.jsonSuccess.apply(this, [a]);
                    else {
                        for (b in a.owl) a.owl.hasOwnProperty(b) && (c += a.owl[b].item);
                        d.$elem.html(c)
                    }
                    d.logIn()
                }
                var c, d = this;
                "function" == typeof d.options.beforeInit && d.options.beforeInit.apply(this, [d.$elem]), "string" == typeof d.options.jsonPath ? (c = d.options.jsonPath, a.getJSON(c, b)) : d.logIn()
            },
            logIn: function() {
                var a = this;
                a.$elem.data("owl-originalStyles", a.$elem.attr("style")), a.$elem.data("owl-originalClasses", a.$elem.attr("class")), a.$elem.css({
                    opacity: 0
                }), a.orignalItems = a.options.items, a.checkBrowser(), a.wrapperWidth = 0, a.checkVisible = null, a.setVars()
            },
            setVars: function() {
                var a = this;
                return 0 !== a.$elem.children().length && (a.baseClass(), a.eventTypes(), a.$userItems = a.$elem.children(), a.itemsAmount = a.$userItems.length, a.wrapItems(), a.$owlItems = a.$elem.find(".owl-item"), a.$owlWrapper = a.$elem.find(".owl-wrapper"), a.playDirection = "next", a.prevItem = 0, a.prevArr = [0], a.currentItem = 0, a.customEvents(), void a.onStartup())
            },
            onStartup: function() {
                var a = this;
                a.updateItems(), a.calculateAll(), a.buildControls(), a.updateControls(), a.response(), a.moveEvents(), a.stopOnHover(), a.owlStatus(), a.options.transitionStyle !== !1 && a.transitionTypes(a.options.transitionStyle), a.options.autoPlay === !0 && (a.options.autoPlay = 5e3), a.play(), a.$elem.find(".owl-wrapper").css("display", "block"), a.$elem.is(":visible") ? a.$elem.css("opacity", 1) : a.watchVisibility(), a.onstartup = !1, a.eachMoveUpdate(), "function" == typeof a.options.afterInit && a.options.afterInit.apply(this, [a.$elem])
            },
            eachMoveUpdate: function() {
                var a = this;
                a.options.lazyLoad === !0 && a.lazyLoad(), a.options.autoHeight === !0 && a.autoHeight(), a.onVisibleItems(), "function" == typeof a.options.afterAction && a.options.afterAction.apply(this, [a.$elem])
            },
            updateVars: function() {
                var a = this;
                "function" == typeof a.options.beforeUpdate && a.options.beforeUpdate.apply(this, [a.$elem]), a.watchVisibility(), a.updateItems(), a.calculateAll(), a.updatePosition(), a.updateControls(), a.eachMoveUpdate(), "function" == typeof a.options.afterUpdate && a.options.afterUpdate.apply(this, [a.$elem])
            },
            reload: function() {
                var a = this;
                b.setTimeout(function() {
                    a.updateVars()
                }, 0)
            },
            watchVisibility: function() {
                var a = this;
                return a.$elem.is(":visible") === !1 && (a.$elem.css({
                    opacity: 0
                }), b.clearInterval(a.autoPlayInterval), b.clearInterval(a.checkVisible), void(a.checkVisible = b.setInterval(function() {
                    a.$elem.is(":visible") && (a.reload(), a.$elem.animate({
                        opacity: 1
                    }, 200), b.clearInterval(a.checkVisible))
                }, 500)))
            },
            wrapItems: function() {
                var a = this;
                a.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>'), a.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">'), a.wrapperOuter = a.$elem.find(".owl-wrapper-outer"), a.$elem.css("display", "block")
            },
            baseClass: function() {
                var a = this,
                    b = a.$elem.hasClass(a.options.baseClass),
                    c = a.$elem.hasClass(a.options.theme);
                b || a.$elem.addClass(a.options.baseClass), c || a.$elem.addClass(a.options.theme)
            },
            updateItems: function() {
                var b, c, d = this;
                if (d.options.responsive === !1) return !1;
                if (d.options.singleItem === !0) return d.options.items = d.orignalItems = 1, d.options.itemsCustom = !1, d.options.itemsDesktop = !1, d.options.itemsDesktopSmall = !1, d.options.itemsTablet = !1, d.options.itemsTabletSmall = !1, d.options.itemsMobile = !1, !1;
                if (b = a(d.options.responsiveBaseWidth).width(), b > (d.options.itemsDesktop[0] || d.orignalItems) && (d.options.items = d.orignalItems), d.options.itemsCustom !== !1)
                    for (d.options.itemsCustom.sort(function(a, b) {
                        return a[0] - b[0]
                    }), c = 0; c < d.options.itemsCustom.length; c += 1) d.options.itemsCustom[c][0] <= b && (d.options.items = d.options.itemsCustom[c][1]);
                else b <= d.options.itemsDesktop[0] && d.options.itemsDesktop !== !1 && (d.options.items = d.options.itemsDesktop[1]), b <= d.options.itemsDesktopSmall[0] && d.options.itemsDesktopSmall !== !1 && (d.options.items = d.options.itemsDesktopSmall[1]), b <= d.options.itemsTablet[0] && d.options.itemsTablet !== !1 && (d.options.items = d.options.itemsTablet[1]), b <= d.options.itemsTabletSmall[0] && d.options.itemsTabletSmall !== !1 && (d.options.items = d.options.itemsTabletSmall[1]), b <= d.options.itemsMobile[0] && d.options.itemsMobile !== !1 && (d.options.items = d.options.itemsMobile[1]);
                d.options.items > d.itemsAmount && d.options.itemsScaleUp === !0 && (d.options.items = d.itemsAmount)
            },
            response: function() {
                var c, d, e = this;
                return e.options.responsive === !0 && (d = a(b).width(), e.resizer = function() {
                    a(b).width() !== d && (e.options.autoPlay !== !1 && b.clearInterval(e.autoPlayInterval), b.clearTimeout(c), c = b.setTimeout(function() {
                        d = a(b).width(), e.updateVars()
                    }, e.options.responsiveRefreshRate))
                }, void a(b).resize(e.resizer))
            },
            updatePosition: function() {
                var a = this;
                a.jumpTo(a.currentItem), a.options.autoPlay !== !1 && a.checkAp()
            },
            appendItemsSizes: function() {
                var b = this,
                    c = 0,
                    d = b.itemsAmount - b.options.items;
                b.$owlItems.each(function(e) {
                    var f = a(this);
                    f.css({
                        width: b.itemWidth
                    }).data("owl-item", Number(e)), e % b.options.items !== 0 && e !== d || e > d || (c += 1), f.data("owl-roundPages", c)
                })
            },
            appendWrapperSizes: function() {
                var a = this,
                    b = a.$owlItems.length * a.itemWidth;
                a.$owlWrapper.css({
                    width: 2 * b,
                    left: 0
                }), a.appendItemsSizes()
            },
            calculateAll: function() {
                var a = this;
                a.calculateWidth(), a.appendWrapperSizes(), a.loops(), a.max()
            },
            calculateWidth: function() {
                var a = this;
                a.itemWidth = Math.round(a.$elem.width() / a.options.items)
            },
            max: function() {
                var a = this,
                    b = (a.itemsAmount * a.itemWidth - a.options.items * a.itemWidth) * -1;
                return a.options.items > a.itemsAmount ? (a.maximumItem = 0, b = 0, a.maximumPixels = 0) : (a.maximumItem = a.itemsAmount - a.options.items, a.maximumPixels = b), b
            },
            min: function() {
                return 0
            },
            loops: function() {
                var b, c, d, e = this,
                    f = 0,
                    g = 0;
                for (e.positionsInArray = [0], e.pagesInArray = [], b = 0; b < e.itemsAmount; b += 1) g += e.itemWidth, e.positionsInArray.push(-g), e.options.scrollPerPage === !0 && (c = a(e.$owlItems[b]), d = c.data("owl-roundPages"), d !== f && (e.pagesInArray[f] = e.positionsInArray[b], f = d))
            },
            buildControls: function() {
                var b = this;
                b.options.navigation !== !0 && b.options.pagination !== !0 || (b.owlControls = a('<div class="owl-controls"/>').toggleClass("clickable", !b.browser.isTouch).appendTo(b.$elem)), b.options.pagination === !0 && b.buildPagination(), b.options.navigation === !0 && b.buildButtons()
            },
            buildButtons: function() {
                var b = this,
                    c = a('<div class="owl-buttons"/>');
                b.owlControls.append(c), b.buttonPrev = a("<div/>", {
                    class: "owl-prev",
                    html: b.options.navigationText[0] || ""
                }), b.buttonNext = a("<div/>", {
                    class: "owl-next",
                    html: b.options.navigationText[1] || ""
                }), c.append(b.buttonPrev).append(b.buttonNext), c.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function(a) {
                    a.preventDefault()
                }), c.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function(c) {
                    c.preventDefault(), a(this).hasClass("owl-next") ? b.next() : b.prev()
                })
            },
            buildPagination: function() {
                var b = this;
                b.paginationWrapper = a('<div class="owl-pagination"/>'), b.owlControls.append(b.paginationWrapper), b.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(c) {
                    c.preventDefault(), Number(a(this).data("owl-page")) !== b.currentItem && b.goTo(Number(a(this).data("owl-page")), !0)
                })
            },
            updatePagination: function() {
                var b, c, d, e, f, g, h = this;
                if (h.options.pagination === !1) return !1;
                for (h.paginationWrapper.html(""), b = 0, c = h.itemsAmount - h.itemsAmount % h.options.items, e = 0; e < h.itemsAmount; e += 1) e % h.options.items === 0 && (b += 1, c === e && (d = h.itemsAmount - h.options.items), f = a("<div/>", {
                    class: "owl-page"
                }), g = a("<span></span>", {
                    text: h.options.paginationNumbers === !0 ? b : "",
                    class: h.options.paginationNumbers === !0 ? "owl-numbers" : ""
                }), f.append(g), f.data("owl-page", c === e ? d : e), f.data("owl-roundPages", b), h.paginationWrapper.append(f));
                h.checkPagination()
            },
            checkPagination: function() {
                var b = this;
                return b.options.pagination !== !1 && void b.paginationWrapper.find(".owl-page").each(function() {
                    a(this).data("owl-roundPages") === a(b.$owlItems[b.currentItem]).data("owl-roundPages") && (b.paginationWrapper.find(".owl-page").removeClass("active"), a(this).addClass("active"))
                })
            },
            checkNavigation: function() {
                var a = this;
                return a.options.navigation !== !1 && void(a.options.rewindNav === !1 && (0 === a.currentItem && 0 === a.maximumItem ? (a.buttonPrev.addClass("disabled"), a.buttonNext.addClass("disabled")) : 0 === a.currentItem && 0 !== a.maximumItem ? (a.buttonPrev.addClass("disabled"), a.buttonNext.removeClass("disabled")) : a.currentItem === a.maximumItem ? (a.buttonPrev.removeClass("disabled"), a.buttonNext.addClass("disabled")) : 0 !== a.currentItem && a.currentItem !== a.maximumItem && (a.buttonPrev.removeClass("disabled"), a.buttonNext.removeClass("disabled"))))
            },
            updateControls: function() {
                var a = this;
                a.updatePagination(), a.checkNavigation(), a.owlControls && (a.options.items >= a.itemsAmount ? a.owlControls.hide() : a.owlControls.show())
            },
            destroyControls: function() {
                var a = this;
                a.owlControls && a.owlControls.remove()
            },
            next: function(a) {
                var b = this;
                if (b.isTransition) return !1;
                if (b.currentItem += b.options.scrollPerPage === !0 ? b.options.items : 1, b.currentItem > b.maximumItem + (b.options.scrollPerPage === !0 ? b.options.items - 1 : 0)) {
                    if (b.options.rewindNav !== !0) return b.currentItem = b.maximumItem, !1;
                    b.currentItem = 0, a = "rewind"
                }
                b.goTo(b.currentItem, a)
            },
            prev: function(a) {
                var b = this;
                if (b.isTransition) return !1;
                if (b.options.scrollPerPage === !0 && b.currentItem > 0 && b.currentItem < b.options.items ? b.currentItem = 0 : b.currentItem -= b.options.scrollPerPage === !0 ? b.options.items : 1, b.currentItem < 0) {
                    if (b.options.rewindNav !== !0) return b.currentItem = 0, !1;
                    b.currentItem = b.maximumItem, a = "rewind"
                }
                b.goTo(b.currentItem, a)
            },
            goTo: function(a, c, d) {
                var e, f = this;
                return !f.isTransition && ("function" == typeof f.options.beforeMove && f.options.beforeMove.apply(this, [f.$elem]), a >= f.maximumItem ? a = f.maximumItem : a <= 0 && (a = 0), f.currentItem = f.owl.currentItem = a, f.options.transitionStyle !== !1 && "drag" !== d && 1 === f.options.items && f.browser.support3d === !0 ? (f.swapSpeed(0), f.browser.support3d === !0 ? f.transition3d(f.positionsInArray[a]) : f.css2slide(f.positionsInArray[a], 1), f.afterGo(), f.singleItemTransition(), !1) : (e = f.positionsInArray[a], f.browser.support3d === !0 ? (f.isCss3Finish = !1, c === !0 ? (f.swapSpeed("paginationSpeed"), b.setTimeout(function() {
                    f.isCss3Finish = !0
                }, f.options.paginationSpeed)) : "rewind" === c ? (f.swapSpeed(f.options.rewindSpeed), b.setTimeout(function() {
                    f.isCss3Finish = !0
                }, f.options.rewindSpeed)) : (f.swapSpeed("slideSpeed"), b.setTimeout(function() {
                    f.isCss3Finish = !0
                }, f.options.slideSpeed)), f.transition3d(e)) : c === !0 ? f.css2slide(e, f.options.paginationSpeed) : "rewind" === c ? f.css2slide(e, f.options.rewindSpeed) : f.css2slide(e, f.options.slideSpeed), void f.afterGo()))
            },
            jumpTo: function(a) {
                var b = this;
                "function" == typeof b.options.beforeMove && b.options.beforeMove.apply(this, [b.$elem]), a >= b.maximumItem || a === -1 ? a = b.maximumItem : a <= 0 && (a = 0), b.swapSpeed(0), b.browser.support3d === !0 ? b.transition3d(b.positionsInArray[a]) : b.css2slide(b.positionsInArray[a], 1), b.currentItem = b.owl.currentItem = a, b.afterGo()
            },
            afterGo: function() {
                var a = this;
                a.prevArr.push(a.currentItem), a.prevItem = a.owl.prevItem = a.prevArr[a.prevArr.length - 2], a.prevArr.shift(0), a.prevItem !== a.currentItem && (a.checkPagination(), a.checkNavigation(), a.eachMoveUpdate(), a.options.autoPlay !== !1 && a.checkAp()), "function" == typeof a.options.afterMove && a.prevItem !== a.currentItem && a.options.afterMove.apply(this, [a.$elem])
            },
            stop: function() {
                var a = this;
                a.apStatus = "stop", b.clearInterval(a.autoPlayInterval)
            },
            checkAp: function() {
                var a = this;
                "stop" !== a.apStatus && a.play()
            },
            play: function() {
                var a = this;
                return a.apStatus = "play", a.options.autoPlay !== !1 && (b.clearInterval(a.autoPlayInterval), void(a.autoPlayInterval = b.setInterval(function() {
                    a.next(!0)
                }, a.options.autoPlay)))
            },
            swapSpeed: function(a) {
                var b = this;
                "slideSpeed" === a ? b.$owlWrapper.css(b.addCssSpeed(b.options.slideSpeed)) : "paginationSpeed" === a ? b.$owlWrapper.css(b.addCssSpeed(b.options.paginationSpeed)) : "string" != typeof a && b.$owlWrapper.css(b.addCssSpeed(a))
            },
            addCssSpeed: function(a) {
                return {
                    "-webkit-transition": "all " + a + "ms ease",
                    "-moz-transition": "all " + a + "ms ease",
                    "-o-transition": "all " + a + "ms ease",
                    transition: "all " + a + "ms ease"
                }
            },
            removeTransition: function() {
                return {
                    "-webkit-transition": "",
                    "-moz-transition": "",
                    "-o-transition": "",
                    transition: ""
                }
            },
            doTranslate: function(a) {
                return {
                    "-webkit-transform": "translate3d(" + a + "px, 0px, 0px)",
                    "-moz-transform": "translate3d(" + a + "px, 0px, 0px)",
                    "-o-transform": "translate3d(" + a + "px, 0px, 0px)",
                    "-ms-transform": "translate3d(" + a + "px, 0px, 0px)",
                    transform: "translate3d(" + a + "px, 0px,0px)"
                }
            },
            transition3d: function(a) {
                var b = this;
                b.$owlWrapper.css(b.doTranslate(a))
            },
            css2move: function(a) {
                var b = this;
                b.$owlWrapper.css({
                    left: a
                })
            },
            css2slide: function(a, b) {
                var c = this;
                c.isCssFinish = !1, c.$owlWrapper.stop(!0, !0).animate({
                    left: a
                }, {
                    duration: b || c.options.slideSpeed,
                    complete: function() {
                        c.isCssFinish = !0
                    }
                })
            },
            checkBrowser: function() {
                var a, d, e, f, g = this,
                    h = "translate3d(0px, 0px, 0px)",
                    i = c.createElement("div");
                i.style.cssText = "  -moz-transform:" + h + "; -ms-transform:" + h + "; -o-transform:" + h + "; -webkit-transform:" + h + "; transform:" + h, a = /translate3d\(0px, 0px, 0px\)/g, d = i.style.cssText.match(a), e = null !== d && 1 === d.length, f = "ontouchstart" in b || b.navigator.msMaxTouchPoints, g.browser = {
                    support3d: e,
                    isTouch: f
                }
            },
            moveEvents: function() {
                var a = this;
                a.options.mouseDrag === !1 && a.options.touchDrag === !1 || (a.gestures(), a.disabledEvents())
            },
            eventTypes: function() {
                var a = this,
                    b = ["s", "e", "x"];
                a.ev_types = {}, a.options.mouseDrag === !0 && a.options.touchDrag === !0 ? b = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] : a.options.mouseDrag === !1 && a.options.touchDrag === !0 ? b = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : a.options.mouseDrag === !0 && a.options.touchDrag === !1 && (b = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]), a.ev_types.start = b[0], a.ev_types.move = b[1], a.ev_types.end = b[2]
            },
            disabledEvents: function() {
                var b = this;
                b.$elem.on("dragstart.owl", function(a) {
                    a.preventDefault()
                }), b.$elem.on("mousedown.disableTextSelect", function(b) {
                    return a(b.target).is("input, textarea, select, option")
                })
            },
            gestures: function() {
                function d(a) {
                    if (void 0 !== a.touches) return {
                        x: a.touches[0].pageX,
                        y: a.touches[0].pageY
                    };
                    if (void 0 === a.touches) {
                        if (void 0 !== a.pageX) return {
                            x: a.pageX,
                            y: a.pageY
                        };
                        if (void 0 === a.pageX) return {
                            x: a.clientX,
                            y: a.clientY
                        }
                    }
                }

                function e(b) {
                    "on" === b ? (a(c).on(i.ev_types.move, g), a(c).on(i.ev_types.end, h)) : "off" === b && (a(c).off(i.ev_types.move), a(c).off(i.ev_types.end))
                }

                function f(c) {
                    var f, g = c.originalEvent || c || b.event;
                    if (3 === g.which) return !1;
                    if (!(i.itemsAmount <= i.options.items)) {
                        if (i.isCssFinish === !1 && !i.options.dragBeforeAnimFinish) return !1;
                        if (i.isCss3Finish === !1 && !i.options.dragBeforeAnimFinish) return !1;
                        i.options.autoPlay !== !1 && b.clearInterval(i.autoPlayInterval), i.browser.isTouch === !0 || i.$owlWrapper.hasClass("grabbing") || i.$owlWrapper.addClass("grabbing"), i.newPosX = 0, i.newRelativeX = 0, a(this).css(i.removeTransition()), f = a(this).position(), j.relativePos = f.left, j.offsetX = d(g).x - f.left, j.offsetY = d(g).y - f.top, e("on"), j.sliding = !1, j.targetElement = g.target || g.srcElement
                    }
                }

                function g(e) {
                    var f, g, h = e.originalEvent || e || b.event;
                    i.newPosX = d(h).x - j.offsetX, i.newPosY = d(h).y - j.offsetY, i.newRelativeX = i.newPosX - j.relativePos, "function" == typeof i.options.startDragging && j.dragging !== !0 && 0 !== i.newRelativeX && (j.dragging = !0, i.options.startDragging.apply(i, [i.$elem])), (i.newRelativeX > 8 || i.newRelativeX < -8) && i.browser.isTouch === !0 && (void 0 !== h.preventDefault ? h.preventDefault() : h.returnValue = !1, j.sliding = !0), (i.newPosY > 10 || i.newPosY < -10) && j.sliding === !1 && a(c).off("touchmove.owl"), f = function() {
                        return i.newRelativeX / 5
                    }, g = function() {
                        return i.maximumPixels + i.newRelativeX / 5
                    }, i.newPosX = Math.max(Math.min(i.newPosX, f()), g()), i.browser.support3d === !0 ? i.transition3d(i.newPosX) : i.css2move(i.newPosX)
                }

                function h(c) {
                    var d, f, g, h = c.originalEvent || c || b.event;
                    h.target = h.target || h.srcElement, j.dragging = !1, i.browser.isTouch !== !0 && i.$owlWrapper.removeClass("grabbing"), i.newRelativeX < 0 ? i.dragDirection = i.owl.dragDirection = "left" : i.dragDirection = i.owl.dragDirection = "right", 0 !== i.newRelativeX && (d = i.getNewPosition(), i.goTo(d, !1, "drag"), j.targetElement === h.target && i.browser.isTouch !== !0 && (a(h.target).on("click.disable", function(b) {
                        b.stopImmediatePropagation(), b.stopPropagation(), b.preventDefault(), a(b.target).off("click.disable")
                    }), f = a._data(h.target, "events").click, g = f.pop(), f.splice(0, 0, g))), e("off")
                }
                var i = this,
                    j = {
                        offsetX: 0,
                        offsetY: 0,
                        baseElWidth: 0,
                        relativePos: 0,
                        position: null,
                        minSwipe: null,
                        maxSwipe: null,
                        sliding: null,
                        dargging: null,
                        targetElement: null
                    };
                i.isCssFinish = !0, i.$elem.on(i.ev_types.start, ".owl-wrapper", f)
            },
            getNewPosition: function() {
                var a = this,
                    b = a.closestItem();
                return b > a.maximumItem ? (a.currentItem = a.maximumItem, b = a.maximumItem) : a.newPosX >= 0 && (b = 0, a.currentItem = 0), b
            },
            closestItem: function() {
                var b = this,
                    c = b.options.scrollPerPage === !0 ? b.pagesInArray : b.positionsInArray,
                    d = b.newPosX,
                    e = null;
                return a.each(c, function(f, g) {
                    d - b.itemWidth / 20 > c[f + 1] && d - b.itemWidth / 20 < g && "left" === b.moveDirection() ? (e = g, b.options.scrollPerPage === !0 ? b.currentItem = a.inArray(e, b.positionsInArray) : b.currentItem = f) : d + b.itemWidth / 20 < g && d + b.itemWidth / 20 > (c[f + 1] || c[f] - b.itemWidth) && "right" === b.moveDirection() && (b.options.scrollPerPage === !0 ? (e = c[f + 1] || c[c.length - 1], b.currentItem = a.inArray(e, b.positionsInArray)) : (e = c[f + 1], b.currentItem = f + 1))
                }), b.currentItem
            },
            moveDirection: function() {
                var a, b = this;
                return b.newRelativeX < 0 ? (a = "right", b.playDirection = "next") : (a = "left", b.playDirection = "prev"), a
            },
            customEvents: function() {
                var a = this;
                a.$elem.on("owl.next", function() {
                    a.next()
                }), a.$elem.on("owl.prev", function() {
                    a.prev()
                }), a.$elem.on("owl.play", function(b, c) {
                    a.options.autoPlay = c, a.play(), a.hoverStatus = "play"
                }), a.$elem.on("owl.stop", function() {
                    a.stop(), a.hoverStatus = "stop"
                }), a.$elem.on("owl.goTo", function(b, c) {
                    a.goTo(c)
                }), a.$elem.on("owl.jumpTo", function(b, c) {
                    a.jumpTo(c)
                })
            },
            stopOnHover: function() {
                var a = this;
                a.options.stopOnHover === !0 && a.browser.isTouch !== !0 && a.options.autoPlay !== !1 && (a.$elem.on("mouseover", function() {
                    a.stop()
                }), a.$elem.on("mouseout", function() {
                    "stop" !== a.hoverStatus && a.play()
                }))
            },
            lazyLoad: function() {
                var b, c, d, e, f, g = this;
                if (g.options.lazyLoad === !1) return !1;
                for (b = 0; b < g.itemsAmount; b += 1) c = a(g.$owlItems[b]), "loaded" !== c.data("owl-loaded") && (d = c.data("owl-item"), e = c.find(".lazyOwl"), "string" == typeof e.data("src") ? (void 0 === c.data("owl-loaded") && (e.hide(), c.addClass("loading").data("owl-loaded", "checked")), f = g.options.lazyFollow !== !0 || d >= g.currentItem, f && d < g.currentItem + g.options.items && e.length && g.lazyPreload(c, e)) : c.data("owl-loaded", "loaded"))
            },
            lazyPreload: function(a, c) {
                function d() {
                    a.data("owl-loaded", "loaded").removeClass("loading"), c.removeAttr("data-src"), "fade" === g.options.lazyEffect ? c.fadeIn(400) : c.show(), "function" == typeof g.options.afterLazyLoad && g.options.afterLazyLoad.apply(this, [g.$elem])
                }

                function e() {
                    h += 1, g.completeImg(c.get(0)) || f === !0 ? d() : h <= 100 ? b.setTimeout(e, 100) : d()
                }
                var f, g = this,
                    h = 0;
                "DIV" === c.prop("tagName") ? (c.css("background-image", "url(" + c.data("src") + ")"), f = !0) : c[0].src = c.data("src"), e()
            },
            autoHeight: function() {
                function c() {
                    var c = a(f.$owlItems[f.currentItem]).height();
                    f.wrapperOuter.css("height", c + "px"), f.wrapperOuter.hasClass("autoHeight") || b.setTimeout(function() {
                        f.wrapperOuter.addClass("autoHeight")
                    }, 0)
                }

                function d() {
                    e += 1, f.completeImg(g.get(0)) ? c() : e <= 100 ? b.setTimeout(d, 100) : f.wrapperOuter.css("height", "")
                }
                var e, f = this,
                    g = a(f.$owlItems[f.currentItem]).find("img");
                void 0 !== g.get(0) ? (e = 0, d()) : c()
            },
            completeImg: function(a) {
                var b;
                return !!a.complete && (b = typeof a.naturalWidth, "undefined" === b || 0 !== a.naturalWidth)
            },
            onVisibleItems: function() {
                var b, c = this;
                for (c.options.addClassActive === !0 && c.$owlItems.removeClass("active"), c.visibleItems = [], b = c.currentItem; b < c.currentItem + c.options.items; b += 1) c.visibleItems.push(b), c.options.addClassActive === !0 && a(c.$owlItems[b]).addClass("active");
                c.owl.visibleItems = c.visibleItems
            },
            transitionTypes: function(a) {
                var b = this;
                b.outClass = "owl-" + a + "-out", b.inClass = "owl-" + a + "-in"
            },
            singleItemTransition: function() {
                function a(a) {
                    return {
                        position: "relative",
                        left: a + "px"
                    }
                }
                var b = this,
                    c = b.outClass,
                    d = b.inClass,
                    e = b.$owlItems.eq(b.currentItem),
                    f = b.$owlItems.eq(b.prevItem),
                    g = Math.abs(b.positionsInArray[b.currentItem]) + b.positionsInArray[b.prevItem],
                    h = Math.abs(b.positionsInArray[b.currentItem]) + b.itemWidth / 2,
                    i = "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend";
                b.isTransition = !0, b.$owlWrapper.addClass("owl-origin").css({
                    "-webkit-transform-origin": h + "px",
                    "-moz-perspective-origin": h + "px",
                    "perspective-origin": h + "px"
                }), f.css(a(g, 10)).addClass(c).on(i, function() {
                    b.endPrev = !0, f.off(i), b.clearTransStyle(f, c)
                }), e.addClass(d).on(i, function() {
                    b.endCurrent = !0, e.off(i), b.clearTransStyle(e, d)
                })
            },
            clearTransStyle: function(a, b) {
                var c = this;
                a.css({
                    position: "",
                    left: ""
                }).removeClass(b), c.endPrev && c.endCurrent && (c.$owlWrapper.removeClass("owl-origin"), c.endPrev = !1, c.endCurrent = !1, c.isTransition = !1)
            },
            owlStatus: function() {
                var a = this;
                a.owl = {
                    userOptions: a.userOptions,
                    baseElement: a.$elem,
                    userItems: a.$userItems,
                    owlItems: a.$owlItems,
                    currentItem: a.currentItem,
                    prevItem: a.prevItem,
                    visibleItems: a.visibleItems,
                    isTouch: a.browser.isTouch,
                    browser: a.browser,
                    dragDirection: a.dragDirection
                }
            },
            clearEvents: function() {
                var d = this;
                d.$elem.off(".owl owl mousedown.disableTextSelect"), a(c).off(".owl owl"), a(b).off("resize", d.resizer)
            },
            unWrap: function() {
                var a = this;
                0 !== a.$elem.children().length && (a.$owlWrapper.unwrap(), a.$userItems.unwrap().unwrap(), a.owlControls && a.owlControls.remove()), a.clearEvents(), a.$elem.attr("style", a.$elem.data("owl-originalStyles") || "").attr("class", a.$elem.data("owl-originalClasses"))
            },
            destroy: function() {
                var a = this;
                a.stop(), b.clearInterval(a.checkVisible), a.unWrap(), a.$elem.removeData()
            },
            reinit: function(b) {
                var c = this,
                    d = a.extend({}, c.userOptions, b);
                c.unWrap(), c.init(d, c.$elem)
            },
            addItem: function(a, b) {
                var c, d = this;
                return !!a && (0 === d.$elem.children().length ? (d.$elem.append(a), d.setVars(), !1) : (d.unWrap(), c = void 0 === b || b === -1 ? -1 : b, c >= d.$userItems.length || c === -1 ? d.$userItems.eq(-1).after(a) : d.$userItems.eq(c).before(a), void d.setVars()))
            },
            removeItem: function(a) {
                var b, c = this;
                return 0 !== c.$elem.children().length && (b = void 0 === a || a === -1 ? -1 : a, c.unWrap(), c.$userItems.eq(b).remove(), void c.setVars())
            }
        };
        a.fn.owlCarousel = function(b) {
            return this.each(function() {
                if (a(this).data("owl-init") === !0) return !1;
                a(this).data("owl-init", !0);
                var c = Object.create(d);
                c.init(b, this), a.data(this, "owlCarousel", c)
            })
        }, a.fn.owlCarousel.options = {
            items: 5,
            itemsCustom: !1,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [979, 3],
            itemsTablet: [768, 2],
            itemsTabletSmall: !1,
            itemsMobile: [479, 1],
            singleItem: !1,
            itemsScaleUp: !1,
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1e3,
            autoPlay: !1,
            stopOnHover: !1,
            navigation: !1,
            navigationText: ["prev", "next"],
            rewindNav: !0,
            scrollPerPage: !1,
            pagination: !0,
            paginationNumbers: !1,
            responsive: !0,
            responsiveRefreshRate: 200,
            responsiveBaseWidth: b,
            baseClass: "owl-carousel",
            theme: "owl-theme",
            lazyLoad: !1,
            lazyFollow: !0,
            lazyEffect: "fade",
            autoHeight: !1,
            jsonPath: !1,
            jsonSuccess: !1,
            dragBeforeAnimFinish: !0,
            mouseDrag: !0,
            touchDrag: !0,
            addClassActive: !1,
            transitionStyle: !1,
            beforeUpdate: !1,
            afterUpdate: !1,
            beforeInit: !1,
            afterInit: !1,
            beforeMove: !1,
            afterMove: !1,
            afterAction: !1,
            startDragging: !1,
            afterLazyLoad: !1
        }
    }(jQuery, window, document), ! function(a) {
    function b(a) {
        return new RegExp("(^|\\s+)" + a + "(\\s+|$)")
    }

    function c(a, b) {
        var c = d(a, b) ? f : e;
        c(a, b)
    }
    var d, e, f;
    "classList" in document.documentElement ? (d = function(a, b) {
        return a.classList.contains(b)
    }, e = function(a, b) {
        a.classList.add(b)
    }, f = function(a, b) {
        a.classList.remove(b)
    }) : (d = function(a, c) {
        return b(c).test(a.className)
    }, e = function(a, b) {
        d(a, b) || (a.className = a.className + " " + b)
    }, f = function(a, c) {
        a.className = a.className.replace(b(c), " ")
    });
    var g = {
        hasClass: d,
        addClass: e,
        removeClass: f,
        toggleClass: c,
        has: d,
        add: e,
        remove: f,
        toggle: c
    };
    "function" == typeof define && define.amd ? define("classie/classie", g) : "object" == typeof exports ? module.exports = g : a.classie = g
}(window),
    function(a, b) {
        "function" == typeof define && define.amd ? define("packery/js/rect", b) : "object" == typeof exports ? module.exports = b() : (a.Packery = a.Packery || {}, a.Packery.Rect = b())
    }(window, function() {
        function a(b) {
            for (var c in a.defaults) this[c] = a.defaults[c];
            for (c in b) this[c] = b[c]
        }
        var b = window.Packery = function() {};
        return b.Rect = a, a.defaults = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }, a.prototype.contains = function(a) {
            var b = a.width || 0,
                c = a.height || 0;
            return this.x <= a.x && this.y <= a.y && this.x + this.width >= a.x + b && this.y + this.height >= a.y + c
        }, a.prototype.overlaps = function(a) {
            var b = this.x + this.width,
                c = this.y + this.height,
                d = a.x + a.width,
                e = a.y + a.height;
            return this.x < d && b > a.x && this.y < e && c > a.y
        }, a.prototype.getMaximalFreeRects = function(b) {
            if (!this.overlaps(b)) return !1;
            var c, d = [],
                e = this.x + this.width,
                f = this.y + this.height,
                g = b.x + b.width,
                h = b.y + b.height;
            return this.y < b.y && (c = new a({
                x: this.x,
                y: this.y,
                width: this.width,
                height: b.y - this.y
            }), d.push(c)), e > g && (c = new a({
                x: g,
                y: this.y,
                width: e - g,
                height: this.height
            }), d.push(c)), f > h && (c = new a({
                x: this.x,
                y: h,
                width: this.width,
                height: f - h
            }), d.push(c)), this.x < b.x && (c = new a({
                x: this.x,
                y: this.y,
                width: b.x - this.x,
                height: this.height
            }), d.push(c)), d
        }, a.prototype.canFit = function(a) {
            return this.width >= a.width && this.height >= a.height
        }, a
    }),
    function(a, b) {
        if ("function" == typeof define && define.amd) define("packery/js/packer", ["./rect"], b);
        else if ("object" == typeof exports) module.exports = b(require("./rect"));
        else {
            var c = a.Packery = a.Packery || {};
            c.Packer = b(c.Rect)
        }
    }(window, function(a) {
        function b(a, b, c) {
            this.width = a || 0, this.height = b || 0, this.sortDirection = c || "downwardLeftToRight", this.reset()
        }
        b.prototype.reset = function() {
            this.spaces = [], this.newSpaces = [];
            var b = new a({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height
            });
            this.spaces.push(b), this.sorter = c[this.sortDirection] || c.downwardLeftToRight
        }, b.prototype.pack = function(a) {
            for (var b = 0, c = this.spaces.length; c > b; b++) {
                var d = this.spaces[b];
                if (d.canFit(a)) {
                    this.placeInSpace(a, d);
                    break
                }
            }
        }, b.prototype.placeInSpace = function(a, b) {
            a.x = b.x, a.y = b.y, this.placed(a)
        }, b.prototype.placed = function(a) {
            for (var b = [], c = 0, d = this.spaces.length; d > c; c++) {
                var e = this.spaces[c],
                    f = e.getMaximalFreeRects(a);
                f ? b.push.apply(b, f) : b.push(e)
            }
            this.spaces = b, this.mergeSortSpaces()
        }, b.prototype.mergeSortSpaces = function() {
            b.mergeRects(this.spaces), this.spaces.sort(this.sorter)
        }, b.prototype.addSpace = function(a) {
            this.spaces.push(a), this.mergeSortSpaces()
        }, b.mergeRects = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                if (d) {
                    var e = a.slice(0);
                    e.splice(b, 1);
                    for (var f = 0, g = 0, h = e.length; h > g; g++) {
                        var i = e[g],
                            j = b > g ? 0 : 1;
                        d.contains(i) && (a.splice(g + j - f, 1), f++)
                    }
                }
            }
            return a
        };
        var c = {
            downwardLeftToRight: function(a, b) {
                return a.y - b.y || a.x - b.x
            },
            rightwardTopToBottom: function(a, b) {
                return a.x - b.x || a.y - b.y
            }
        };
        return b
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("packery/js/item", ["get-style-property/get-style-property", "outlayer/outlayer", "./rect"], b) : "object" == typeof exports ? module.exports = b(require("desandro-get-style-property"), require("outlayer"), require("./rect")) : a.Packery.Item = b(a.getStyleProperty, a.Outlayer, a.Packery.Rect)
    }(window, function(a, b, c) {
        var d = a("transform"),
            e = function() {
                b.Item.apply(this, arguments)
            };
        e.prototype = new b.Item;
        var f = e.prototype._create;
        return e.prototype._create = function() {
            f.call(this), this.rect = new c, this.placeRect = new c
        }, e.prototype.dragStart = function() {
            this.getPosition(), this.removeTransitionStyles(), this.isTransitioning && d && (this.element.style[d] = "none"), this.getSize(), this.isPlacing = !0, this.needsPositioning = !1, this.positionPlaceRect(this.position.x, this.position.y), this.isTransitioning = !1, this.didDrag = !1
        }, e.prototype.dragMove = function(a, b) {
            this.didDrag = !0;
            var c = this.layout.size;
            a -= c.paddingLeft, b -= c.paddingTop, this.positionPlaceRect(a, b)
        }, e.prototype.dragStop = function() {
            this.getPosition();
            var a = this.position.x != this.placeRect.x,
                b = this.position.y != this.placeRect.y;
            this.needsPositioning = a || b, this.didDrag = !1
        }, e.prototype.positionPlaceRect = function(a, b, c) {
            this.placeRect.x = this.getPlaceRectCoord(a, !0), this.placeRect.y = this.getPlaceRectCoord(b, !1, c)
        }, e.prototype.getPlaceRectCoord = function(a, b, c) {
            var d = b ? "Width" : "Height",
                e = this.size["outer" + d],
                f = this.layout[b ? "columnWidth" : "rowHeight"],
                g = this.layout.size["inner" + d];
            b || (g = Math.max(g, this.layout.maxY), this.layout.rowHeight || (g -= this.layout.gutter));
            var h;
            if (f) {
                f += this.layout.gutter, g += b ? this.layout.gutter : 0, a = Math.round(a / f);
                var i;
                i = this.layout.options.isHorizontal ? b ? "ceil" : "floor" : b ? "floor" : "ceil";
                var j = Math[i](g / f);
                j -= Math.ceil(e / f), h = j
            } else h = g - e;
            return a = c ? a : Math.min(a, h), a *= f || 1, Math.max(0, a)
        }, e.prototype.copyPlaceRectPosition = function() {
            this.rect.x = this.placeRect.x, this.rect.y = this.placeRect.y
        }, e.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.layout.packer.addSpace(this.rect), this.emitEvent("remove", [this])
        }, e
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("packery/js/packery", ["classie/classie", "get-size/get-size", "outlayer/outlayer", "./rect", "./packer", "./item"], b) : "object" == typeof exports ? module.exports = b(require("desandro-classie"), require("get-size"), require("outlayer"), require("./rect"), require("./packer"), require("./item")) : a.Packery = b(a.classie, a.getSize, a.Outlayer, a.Packery.Rect, a.Packery.Packer, a.Packery.Item)
    }(window, function(a, b, c, d, e, f) {
        function g(a, b) {
            return a.position.y - b.position.y || a.position.x - b.position.x
        }

        function h(a, b) {
            return a.position.x - b.position.x || a.position.y - b.position.y
        }
        d.prototype.canFit = function(a) {
            return this.width >= a.width - 1 && this.height >= a.height - 1
        };
        var i = c.create("packery");
        return i.Item = f, i.prototype._create = function() {
            c.prototype._create.call(this), this.packer = new e, this.stamp(this.options.stamped);
            var a = this;
            this.handleDraggabilly = {
                dragStart: function() {
                    a.itemDragStart(this.element)
                },
                dragMove: function() {
                    a.itemDragMove(this.element, this.position.x, this.position.y)
                },
                dragEnd: function() {
                    a.itemDragEnd(this.element)
                }
            }, this.handleUIDraggable = {
                start: function(b) {
                    a.itemDragStart(b.currentTarget)
                },
                drag: function(b, c) {
                    a.itemDragMove(b.currentTarget, c.position.left, c.position.top)
                },
                stop: function(b) {
                    a.itemDragEnd(b.currentTarget)
                }
            }
        }, i.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurements();
            var a = this.packer;
            this.options.isHorizontal ? (a.width = Number.POSITIVE_INFINITY, a.height = this.size.innerHeight + this.gutter, a.sortDirection = "rightwardTopToBottom") : (a.width = this.size.innerWidth + this.gutter, a.height = Number.POSITIVE_INFINITY, a.sortDirection = "downwardLeftToRight"), a.reset(), this.maxY = 0, this.maxX = 0
        }, i.prototype._getMeasurements = function() {
            this._getMeasurement("columnWidth", "width"), this._getMeasurement("rowHeight", "height"), this._getMeasurement("gutter", "width")
        }, i.prototype._getItemLayoutPosition = function(a) {
            return this._packItem(a), a.rect
        }, i.prototype._packItem = function(a) {
            this._setRectSize(a.element, a.rect), this.packer.pack(a.rect), this._setMaxXY(a.rect)
        }, i.prototype._setMaxXY = function(a) {
            this.maxX = Math.max(a.x + a.width, this.maxX), this.maxY = Math.max(a.y + a.height, this.maxY)
        }, i.prototype._setRectSize = function(a, c) {
            var d = b(a),
                e = d.outerWidth,
                f = d.outerHeight;
            (e || f) && (e = this._applyGridGutter(e, this.columnWidth), f = this._applyGridGutter(f, this.rowHeight)), c.width = Math.min(e, this.packer.width), c.height = Math.min(f, this.packer.height)
        }, i.prototype._applyGridGutter = function(a, b) {
            if (!b) return a + this.gutter;
            b += this.gutter;
            var c = a % b,
                d = c && 1 > c ? "round" : "ceil";
            return a = Math[d](a / b) * b
        }, i.prototype._getContainerSize = function() {
            return this.options.isHorizontal ? {
                width: this.maxX - this.gutter
            } : {
                height: this.maxY - this.gutter
            }
        }, i.prototype._manageStamp = function(a) {
            var b, c = this.getItem(a);
            if (c && c.isPlacing) b = c.placeRect;
            else {
                var e = this._getElementOffset(a);
                b = new d({
                    x: this.options.isOriginLeft ? e.left : e.right,
                    y: this.options.isOriginTop ? e.top : e.bottom
                })
            }
            this._setRectSize(a, b), this.packer.placed(b), this._setMaxXY(b)
        }, i.prototype.sortItemsByPosition = function() {
            var a = this.options.isHorizontal ? h : g;
            this.items.sort(a)
        }, i.prototype.fit = function(a, b, c) {
            var d = this.getItem(a);
            d && (this._getMeasurements(), this.stamp(d.element), d.getSize(), d.isPlacing = !0, b = void 0 === b ? d.rect.x : b, c = void 0 === c ? d.rect.y : c, d.positionPlaceRect(b, c, !0), this._bindFitEvents(d), d.moveTo(d.placeRect.x, d.placeRect.y), this.layout(), this.unstamp(d.element), this.sortItemsByPosition(), d.isPlacing = !1, d.copyPlaceRectPosition())
        }, i.prototype._bindFitEvents = function(a) {
            function b() {
                d++, 2 == d && c.emitEvent("fitComplete", [a])
            }
            var c = this,
                d = 0;
            a.on("layout", function() {
                return b(), !0
            }), this.on("layoutComplete", function() {
                return b(), !0
            })
        }, i.prototype.resize = function() {
            var a = b(this.element),
                c = this.size && a,
                d = this.options.isHorizontal ? "innerHeight" : "innerWidth";
            c && a[d] == this.size[d] || this.layout()
        }, i.prototype.itemDragStart = function(a) {
            this.stamp(a);
            var b = this.getItem(a);
            b && b.dragStart()
        }, i.prototype.itemDragMove = function(a, b, c) {
            function d() {
                f.layout(), delete f.dragTimeout
            }
            var e = this.getItem(a);
            e && e.dragMove(b, c);
            var f = this;
            this.clearDragTimeout(), this.dragTimeout = setTimeout(d, 40)
        }, i.prototype.clearDragTimeout = function() {
            this.dragTimeout && clearTimeout(this.dragTimeout)
        }, i.prototype.itemDragEnd = function(b) {
            var c, d = this.getItem(b);
            if (d && (c = d.didDrag, d.dragStop()), !d || !c && !d.needsPositioning) return void this.unstamp(b);
            a.add(d.element, "is-positioning-post-drag");
            var e = this._getDragEndLayoutComplete(b, d);
            d.needsPositioning ? (d.on("layout", e), d.moveTo(d.placeRect.x, d.placeRect.y)) : d && d.copyPlaceRectPosition(), this.clearDragTimeout(), this.on("layoutComplete", e), this.layout()
        }, i.prototype._getDragEndLayoutComplete = function(b, c) {
            var d = c && c.needsPositioning,
                e = 0,
                f = d ? 2 : 1,
                g = this;
            return function() {
                return e++, e != f || (c && (a.remove(c.element, "is-positioning-post-drag"), c.isPlacing = !1, c.copyPlaceRectPosition()), g.unstamp(b), g.sortItemsByPosition(), d && g.emitEvent("dragItemPositioned", [c]), !0)
            }
        }, i.prototype.bindDraggabillyEvents = function(a) {
            a.on("dragStart", this.handleDraggabilly.dragStart), a.on("dragMove", this.handleDraggabilly.dragMove), a.on("dragEnd", this.handleDraggabilly.dragEnd)
        }, i.prototype.bindUIDraggableEvents = function(a) {
            a.on("dragstart", this.handleUIDraggable.start).on("drag", this.handleUIDraggable.drag).on("dragstop", this.handleUIDraggable.stop)
        }, i.Rect = d, i.Packer = e, i
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define(["isotope/js/layout-mode", "packery/js/packery", "get-size/get-size"], b) : "object" == typeof exports ? module.exports = b(require("isotope-layout/js/layout-mode"), require("packery"), require("get-size")) : b(a.Isotope.LayoutMode, a.Packery, a.getSize)
    }(window, function(a, b, c) {
        function d(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }
        var e = a.create("packery"),
            f = e.prototype._getElementOffset,
            g = e.prototype._getMeasurement;
        d(e.prototype, b.prototype), e.prototype._getElementOffset = f, e.prototype._getMeasurement = g;
        var h = e.prototype._resetLayout;
        e.prototype._resetLayout = function() {
            this.packer = this.packer || new b.Packer, h.apply(this, arguments)
        };
        var i = e.prototype._getItemLayoutPosition;
        e.prototype._getItemLayoutPosition = function(a) {
            return a.rect = a.rect || new b.Rect, i.call(this, a)
        };
        var j = e.prototype._manageStamp;
        return e.prototype._manageStamp = function() {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft, this.options.isOriginTop = this.isotope.options.isOriginTop, j.apply(this, arguments)
        }, e.prototype.needsResizeLayout = function() {
            var a = c(this.element),
                b = this.size && a,
                d = this.options.isHorizontal ? "innerHeight" : "innerWidth";
            return b && a[d] != this.size[d]
        }, e
    }), $(document).ready(function() {
    function a(a, b) {
        var c = $(b).position();
        return c.left > 515 ? "left" : c.left < 515 ? "right" : c.top < 110 ? "bottom" : "top"
    }

    function b(

    ) {
        $(".page-search-results .search-result-container.printed-material").length && $("<a/>", {
            class: "btn",
            html: '<i class="fa fa-book"></i> Printed Materials'
        }).attr("data-filter", ".printed-material").appendTo(".search-result-filters nav"), $(".page-search-results .search-result-container.audio-book").length && $("<a/>", {
            class: "btn",
            html: '<i class="fa fa-headphones"></i> Audio Books'
        }).attr("data-filter", ".audio-book").appendTo(".search-result-filters nav"), $(".page-search-results .search-result-container.ebook").length && $("<a/>", {
            class: "btn",
            html: '<i class="fa fa-cloud-download"></i> eBooks'
        }).attr("data-filter", ".ebook").appendTo(".search-result-filters nav"), $(".page-search-results .search-result-container.movie").length && $("<a/>", {
            class: "btn",
            html: '<i class="fa fa-desktop"></i> Movies'
        }).attr("data-filter", ".movie").appendTo(".search-result-filters nav"), $(".page-search-results .search-result-container.music-album").length && $("<a/>", {
            class: "btn",
            html: '<i class="fa fa-music"></i> Music'
        }).attr("data-filter", ".music-album").appendTo(".search-result-filters nav"), $(".page-search-results .search-results-grid .search-result").length < 1 && $(".search-results-section#books-and-media").remove(), $(".page-search-results .search-results-section").length > 1 && ($(".search-result-sections").hide(), $(".page-search-results .search-results-section").each(function() {
            $("<a/>", {
                class: "btn",
                href: "#" + $(this).attr("id"),
                html: $(this).attr("data-title") + " (" + $(this).find(".search-result").length + ")"
            }).appendTo(".search-result-sections")
        }), $(".search-result-sections").fadeIn()), $(".page-search-results .search-result").length < 1 && ($(".search-results-message-success").hide(), $(".search-results-message-fail").fadeIn())
    }
    $(".media-box-slider, .book-list-slider").owlCarousel({
        items: 5,
        itemsDesktop: [1199, 4],
        itemsTablet: [991, 3],
        itemsMobile: [767, 2]
    });
    new WOW({
        boxClass: "reveal",
        animateClass: "animated",
        offset: 40,
        mobile: !1
    }).init();
    $(".reveal").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
        $(this).removeClass("animated").removeClass("reveal")
    }), $("#primary-navigation").sticky({
        topSpacing: 0
    }), $(window).on("debouncedresize", function(a) {
        $("#primary-navigation").sticky("update")
    }), $(".copy-block .copy-column").matchHeight(), $(".half-width-feature-block .row>*").matchHeight(), $(".side-by-side-block .row>div").matchHeight(), $(".copy-full-bleed .row>div").matchHeight(), $(".three-column-text-column").matchHeight(), $(".card").matchHeight(), $(".profile-card h3, .product-card h3").matchHeight(), $(".video-block, .copy-block").fitVids();
    var c = $(".search-results-grid").isotope({
        itemSelector: ".search-result-container",
        layoutMode: "packery",
        sortBy: "random",
        getSortData: {
            title: ".catalog-item-title",
            author: ".catalog-item-author"
        }
    });
    c.imagesLoaded().progress(function(a, b) {
        b.img.height <= 1 && $(b.img).parents("div.search-result-container").addClass("no-image"), c.isotope("layout")
    }).always(function(a) {
        b()
    }), $(document).on("click", ".search-result-filters a", function() {
        var a = $(this).attr("data-filter");
        c.isotope({
            filter: a
        }), $(".search-result-filters a.active").removeClass("active"), $(this).addClass("active")
    });
    var d = $(".filtered-cards").isotope({
        layoutMode: "masonry",
        itemSelector: ".filtered-card"
    });
     $(".search-result-sorters a").on("click", function() {
        var a = $(this).attr("data-sort");
        c.isotope({
            sortBy: a
        }), $(".search-result-sorters a.active").removeClass("active"), $(this).addClass("active")
    }), $('[data-toggle="popover"]').popover({
        placement: function(b, c) {
            var d = $(c).offset();
            return height = $(document).outerHeight(), width = $(document).outerWidth(), vert = .5 * height - d.top, vertPlacement = vert > 0 ? "bottom" : "top", horiz = .5 * width - d.left, horizPlacement = horiz > 0 ? "right" : "left", a = Math.abs(horiz) > Math.abs(vert) ? horizPlacement : vertPlacement
        },
        trigger: "hover"
    }), $('[data-toggle="tooltip"]').tooltip(), $(document).on("click", "a[href*=#]", function() {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var a = $(this.hash);
            if (a = a.length && a, a.length) {
                var b = a.offset().top - $("#primary-navigation").outerHeight(!1);
                return $("html,body").animate({
                    scrollTop: b
                }, 350), !1
            }
        }
    }), $(".copy-block img").addClass("img-responsive").attr("data-action", "zoom"), $(".copy-block table").addClass("table"), $(window).scroll(function() {
        $(window).scrollTop() > 300 ? $("a.back-to-top").fadeIn("slow") : $("a.back-to-top").fadeOut("slow"), $(".navbar-nav").flexVerticalCenter({
            parentSelector: ".main-nav"
        })
    }), $(".navbar-nav").flexVerticalCenter({
        parentSelector: ".main-nav"
    }), $(".card.location-card h4").flexVerticalCenter(), $(".clickable-row").click(function() {
        window.document.location = $(this).data("href")
    })
}), ! function(a, b) {
    "function" == typeof define && define.amd ? define(b) : "object" == typeof exports ? module.exports = b(require, exports, module) : a.Tether = b()
}(this, function(a, b, c) {
    "use strict";

    function d(a, b) {
        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
    }

    function e(a) {
        var b = getComputedStyle(a) || {},
            c = b.position;
        if ("fixed" === c) return a;
        for (var d = a; d = d.parentNode;) {
            var e = void 0;
            try {
                e = getComputedStyle(d)
            } catch (a) {}
            if ("undefined" == typeof e || null === e) return d;
            var f = e,
                g = f.overflow,
                h = f.overflowX,
                i = f.overflowY;
            if (/(auto|scroll)/.test(g + i + h) && ("absolute" !== c || ["relative", "absolute", "fixed"].indexOf(e.position) >= 0)) return d
        }
        return document.body
    }

    function f(a) {
        var b = void 0;
        a === document ? (b = document, a = document.documentElement) : b = a.ownerDocument;
        var c = b.documentElement,
            d = {},
            e = a.getBoundingClientRect();
        for (var f in e) d[f] = e[f];
        var g = y(b);
        return d.top -= g.top, d.left -= g.left, "undefined" == typeof d.width && (d.width = document.body.scrollWidth - d.left - d.right), "undefined" == typeof d.height && (d.height = document.body.scrollHeight - d.top - d.bottom), d.top = d.top - c.clientTop, d.left = d.left - c.clientLeft, d.right = b.body.clientWidth - d.width - d.left, d.bottom = b.body.clientHeight - d.height - d.top, d
    }

    function g(a) {
        return a.offsetParent || document.documentElement
    }

    function h() {
        var a = document.createElement("div");
        a.style.width = "100%", a.style.height = "200px";
        var b = document.createElement("div");
        i(b.style, {
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            visibility: "hidden",
            width: "200px",
            height: "150px",
            overflow: "hidden"
        }), b.appendChild(a), document.body.appendChild(b);
        var c = a.offsetWidth;
        b.style.overflow = "scroll";
        var d = a.offsetWidth;
        c === d && (d = b.clientWidth), document.body.removeChild(b);
        var e = c - d;
        return {
            width: e,
            height: e
        }
    }

    function i() {
        var a = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
            b = [];
        return Array.prototype.push.apply(b, arguments), b.slice(1).forEach(function(b) {
            if (b)
                for (var c in b)({}).hasOwnProperty.call(b, c) && (a[c] = b[c])
        }), a
    }

    function j(a, b) {
        if ("undefined" != typeof a.classList) b.split(" ").forEach(function(b) {
            b.trim() && a.classList.remove(b)
        });
        else {
            var c = new RegExp("(^| )" + b.split(" ").join("|") + "( |$)", "gi"),
                d = m(a).replace(c, " ");
            n(a, d)
        }
    }

    function k(a, b) {
        if ("undefined" != typeof a.classList) b.split(" ").forEach(function(b) {
            b.trim() && a.classList.add(b)
        });
        else {
            j(a, b);
            var c = m(a) + (" " + b);
            n(a, c)
        }
    }

    function l(a, b) {
        if ("undefined" != typeof a.classList) return a.classList.contains(b);
        var c = m(a);
        return new RegExp("(^| )" + b + "( |$)", "gi").test(c)
    }

    function m(a) {
        return a.className instanceof SVGAnimatedString ? a.className.baseVal : a.className
    }

    function n(a, b) {
        a.setAttribute("class", b)
    }

    function o(a, b, c) {
        c.forEach(function(c) {
            -1 === b.indexOf(c) && l(a, c) && j(a, c)
        }), b.forEach(function(b) {
            l(a, b) || k(a, b)
        })
    }

    function d(a, b) {
        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
    }

    function p(a, b) {
        var c = arguments.length <= 2 || void 0 === arguments[2] ? 1 : arguments[2];
        return a + c >= b && b >= a - c
    }

    function q() {
        return "undefined" != typeof performance && "undefined" != typeof performance.now ? performance.now() : +new Date
    }

    function r() {
        for (var a = {
            top: 0,
            left: 0
        }, b = arguments.length, c = Array(b), d = 0; b > d; d++) c[d] = arguments[d];
        return c.forEach(function(b) {
            var c = b.top,
                d = b.left;
            "string" == typeof c && (c = parseFloat(c, 10)), "string" == typeof d && (d = parseFloat(d, 10)), a.top += c, a.left += d
        }), a
    }

    function s(a, b) {
        return "string" == typeof a.left && -1 !== a.left.indexOf("%") && (a.left = parseFloat(a.left, 10) / 100 * b.width), "string" == typeof a.top && -1 !== a.top.indexOf("%") && (a.top = parseFloat(a.top, 10) / 100 * b.height), a
    }

    function t(a, b) {
        return "scrollParent" === b ? b = a.scrollParent : "window" === b && (b = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset]), b === document && (b = b.documentElement), "undefined" != typeof b.nodeType && ! function() {
            var a = f(b),
                c = a,
                d = getComputedStyle(b);
            b = [c.left, c.top, a.width + c.left, a.height + c.top], R.forEach(function(a, c) {
                a = a[0].toUpperCase() + a.substr(1), "Top" === a || "Left" === a ? b[c] += parseFloat(d["border" + a + "Width"]) : b[c] -= parseFloat(d["border" + a + "Width"])
            })
        }(), b
    }
    var u = function() {
            function a(a, b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                }
            }
            return function(b, c, d) {
                return c && a(b.prototype, c), d && a(b, d), b
            }
        }(),
        v = void 0;
    "undefined" == typeof v && (v = {
        modules: []
    });
    var w = function() {
            var a = 0;
            return function() {
                return ++a
            }
        }(),
        x = {},
        y = function(a) {
            var b = a._tetherZeroElement;
            "undefined" == typeof b && (b = a.createElement("div"), b.setAttribute("data-tether-id", w()), i(b.style, {
                top: 0,
                left: 0,
                position: "absolute"
            }), a.body.appendChild(b), a._tetherZeroElement = b);
            var c = b.getAttribute("data-tether-id");
            if ("undefined" == typeof x[c]) {
                x[c] = {};
                var d = b.getBoundingClientRect();
                for (var e in d) x[c][e] = d[e];
                A(function() {
                    delete x[c]
                })
            }
            return x[c]
        },
        z = [],
        A = function(a) {
            z.push(a)
        },
        B = function() {
            for (var a = void 0; a = z.pop();) a()
        },
        C = function() {
            function a() {
                d(this, a)
            }
            return u(a, [{
                key: "on",
                value: function(a, b, c) {
                    var d = !(arguments.length <= 3 || void 0 === arguments[3]) && arguments[3];
                    "undefined" == typeof this.bindings && (this.bindings = {}), "undefined" == typeof this.bindings[a] && (this.bindings[a] = []), this.bindings[a].push({
                        handler: b,
                        ctx: c,
                        once: d
                    })
                }
            }, {
                key: "once",
                value: function(a, b, c) {
                    this.on(a, b, c, !0)
                }
            }, {
                key: "off",
                value: function(a, b) {
                    if ("undefined" == typeof this.bindings || "undefined" == typeof this.bindings[a])
                        if ("undefined" == typeof b) delete this.bindings[a];
                        else
                            for (var c = 0; c < this.bindings[a].length;) this.bindings[a][c].handler === b ? this.bindings[a].splice(c, 1) : ++c
                }
            }, {
                key: "trigger",
                value: function(a) {
                    if ("undefined" != typeof this.bindings && this.bindings[a]) {
                        for (var b = 0, c = arguments.length, d = Array(c > 1 ? c - 1 : 0), e = 1; c > e; e++) d[e - 1] = arguments[e];
                        for (; b < this.bindings[a].length;) {
                            var f = this.bindings[a][b],
                                g = f.handler,
                                h = f.ctx,
                                i = f.once,
                                j = h;
                            "undefined" == typeof j && (j = this), g.apply(j, d), i ? this.bindings[a].splice(b, 1) : ++b
                        }
                    }
                }
            }]), a
        }();
    v.Utils = {
        getScrollParent: e,
        getBounds: f,
        getOffsetParent: g,
        extend: i,
        addClass: k,
        removeClass: j,
        hasClass: l,
        updateClasses: o,
        defer: A,
        flush: B,
        uniqueId: w,
        Evented: C,
        getScrollBarSize: h
    };
    var D = function() {
            function a(a, b) {
                var c = [],
                    d = !0,
                    e = !1,
                    f = void 0;
                try {
                    for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                } catch (a) {
                    e = !0, f = a
                } finally {
                    try {
                        !d && h.return && h.return()
                    } finally {
                        if (e) throw f
                    }
                }
                return c
            }
            return function(b, c) {
                if (Array.isArray(b)) return b;
                if (Symbol.iterator in Object(b)) return a(b, c);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(),
        u = function() {
            function a(a, b) {
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                }
            }
            return function(b, c, d) {
                return c && a(b.prototype, c), d && a(b, d), b
            }
        }();
    if ("undefined" == typeof v) throw new Error("You must include the utils.js file before tether.js");
    var E = v.Utils,
        e = E.getScrollParent,
        f = E.getBounds,
        g = E.getOffsetParent,
        i = E.extend,
        k = E.addClass,
        j = E.removeClass,
        o = E.updateClasses,
        A = E.defer,
        B = E.flush,
        h = E.getScrollBarSize,
        F = function() {
            if ("undefined" == typeof document) return "";
            for (var a = document.createElement("div"), b = ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"], c = 0; c < b.length; ++c) {
                var d = b[c];
                if (void 0 !== a.style[d]) return d
            }
        }(),
        G = [],
        H = function() {
            G.forEach(function(a) {
                a.position(!1)
            }), B()
        };
    ! function() {
        var a = null,
            b = null,
            c = null,
            d = function d() {
                return "undefined" != typeof b && b > 16 ? (b = Math.min(b - 16, 250), void(c = setTimeout(d, 250))) : void("undefined" != typeof a && q() - a < 10 || ("undefined" != typeof c && (clearTimeout(c), c = null), a = q(), H(), b = q() - a))
            };
        "undefined" != typeof window && ["resize", "scroll", "touchmove"].forEach(function(a) {
            window.addEventListener(a, d)
        })
    }();
    var I = {
            center: "center",
            left: "right",
            right: "left"
        },
        J = {
            middle: "middle",
            top: "bottom",
            bottom: "top"
        },
        K = {
            top: 0,
            left: 0,
            middle: "50%",
            center: "50%",
            bottom: "100%",
            right: "100%"
        },
        L = function(a, b) {
            var c = a.left,
                d = a.top;
            return "auto" === c && (c = I[b.left]), "auto" === d && (d = J[b.top]), {
                left: c,
                top: d
            }
        },
        M = function(a) {
            var b = a.left,
                c = a.top;
            return "undefined" != typeof K[a.left] && (b = K[a.left]), "undefined" != typeof K[a.top] && (c = K[a.top]), {
                left: b,
                top: c
            }
        },
        N = function(a) {
            var b = a.split(" "),
                c = D(b, 2),
                d = c[0],
                e = c[1];
            return {
                top: d,
                left: e
            }
        },
        O = N,
        P = function() {
            function a(b) {
                var c = this;
                d(this, a), this.position = this.position.bind(this), G.push(this), this.history = [], this.setOptions(b, !1), v.modules.forEach(function(a) {
                    "undefined" != typeof a.initialize && a.initialize.call(c)
                }), this.position()
            }
            return u(a, [{
                key: "getClass",
                value: function() {
                    var a = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
                        b = this.options.classes;
                    return "undefined" != typeof b && b[a] ? this.options.classes[a] : this.options.classPrefix ? this.options.classPrefix + "-" + a : a
                }
            }, {
                key: "setOptions",
                value: function(a) {
                    var b = this,
                        c = arguments.length <= 1 || void 0 === arguments[1] || arguments[1],
                        d = {
                            offset: "0 0",
                            targetOffset: "0 0",
                            targetAttachment: "auto auto",
                            classPrefix: "tether"
                        };
                    this.options = i(d, a);
                    var f = this.options,
                        g = f.element,
                        h = f.target,
                        j = f.targetModifier;
                    if (this.element = g, this.target = h, this.targetModifier = j, "viewport" === this.target ? (this.target = document.body, this.targetModifier = "visible") : "scroll-handle" === this.target && (this.target = document.body, this.targetModifier = "scroll-handle"), ["element", "target"].forEach(function(a) {
                            if ("undefined" == typeof b[a]) throw new Error("Tether Error: Both element and target must be defined");
                            "undefined" != typeof b[a].jquery ? b[a] = b[a][0] : "string" == typeof b[a] && (b[a] = document.querySelector(b[a]))
                        }), k(this.element, this.getClass("element")), this.options.addTargetClasses !== !1 && k(this.target, this.getClass("target")), !this.options.attachment) throw new Error("Tether Error: You must provide an attachment");
                    this.targetAttachment = O(this.options.targetAttachment), this.attachment = O(this.options.attachment), this.offset = N(this.options.offset), this.targetOffset = N(this.options.targetOffset), "undefined" != typeof this.scrollParent && this.disable(), "scroll-handle" === this.targetModifier ? this.scrollParent = this.target : this.scrollParent = e(this.target), this.options.enabled !== !1 && this.enable(c)
                }
            }, {
                key: "getTargetBounds",
                value: function() {
                    if ("undefined" == typeof this.targetModifier) return f(this.target);
                    if ("visible" === this.targetModifier) {
                        if (this.target === document.body) return {
                            top: pageYOffset,
                            left: pageXOffset,
                            height: innerHeight,
                            width: innerWidth
                        };
                        var a = f(this.target),
                            b = {
                                height: a.height,
                                width: a.width,
                                top: a.top,
                                left: a.left
                            };
                        return b.height = Math.min(b.height, a.height - (pageYOffset - a.top)), b.height = Math.min(b.height, a.height - (a.top + a.height - (pageYOffset + innerHeight))), b.height = Math.min(innerHeight, b.height), b.height -= 2, b.width = Math.min(b.width, a.width - (pageXOffset - a.left)), b.width = Math.min(b.width, a.width - (a.left + a.width - (pageXOffset + innerWidth))), b.width = Math.min(innerWidth, b.width), b.width -= 2, b.top < pageYOffset && (b.top = pageYOffset), b.left < pageXOffset && (b.left = pageXOffset), b
                    }
                    if ("scroll-handle" === this.targetModifier) {
                        var a = void 0,
                            c = this.target;
                        c === document.body ? (c = document.documentElement, a = {
                            left: pageXOffset,
                            top: pageYOffset,
                            height: innerHeight,
                            width: innerWidth
                        }) : a = f(c);
                        var d = getComputedStyle(c),
                            e = c.scrollWidth > c.clientWidth || [d.overflow, d.overflowX].indexOf("scroll") >= 0 || this.target !== document.body,
                            g = 0;
                        e && (g = 15);
                        var h = a.height - parseFloat(d.borderTopWidth) - parseFloat(d.borderBottomWidth) - g,
                            b = {
                                width: 15,
                                height: .975 * h * (h / c.scrollHeight),
                                left: a.left + a.width - parseFloat(d.borderLeftWidth) - 15
                            },
                            i = 0;
                        408 > h && this.target === document.body && (i = -11e-5 * Math.pow(h, 2) - .00727 * h + 22.58), this.target !== document.body && (b.height = Math.max(b.height, 24));
                        var j = this.target.scrollTop / (c.scrollHeight - h);
                        return b.top = j * (h - b.height - i) + a.top + parseFloat(d.borderTopWidth), this.target === document.body && (b.height = Math.max(b.height, 24)), b
                    }
                }
            }, {
                key: "clearCache",
                value: function() {
                    this._cache = {}
                }
            }, {
                key: "cache",
                value: function(a, b) {
                    return "undefined" == typeof this._cache && (this._cache = {}), "undefined" == typeof this._cache[a] && (this._cache[a] = b.call(this)), this._cache[a]
                }
            }, {
                key: "enable",
                value: function() {
                    var a = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                    this.options.addTargetClasses !== !1 && k(this.target, this.getClass("enabled")), k(this.element, this.getClass("enabled")), this.enabled = !0, this.scrollParent !== document && this.scrollParent.addEventListener("scroll", this.position), a && this.position()
                }
            }, {
                key: "disable",
                value: function() {
                    j(this.target, this.getClass("enabled")), j(this.element, this.getClass("enabled")), this.enabled = !1, "undefined" != typeof this.scrollParent && this.scrollParent.removeEventListener("scroll", this.position)
                }
            }, {
                key: "destroy",
                value: function() {
                    var a = this;
                    this.disable(), G.forEach(function(b, c) {
                        return b === a ? void G.splice(c, 1) : void 0
                    })
                }
            }, {
                key: "updateAttachClasses",
                value: function(a, b) {
                    var c = this;
                    a = a || this.attachment, b = b || this.targetAttachment;
                    var d = ["left", "top", "bottom", "right", "middle", "center"];
                    "undefined" != typeof this._addAttachClasses && this._addAttachClasses.length && this._addAttachClasses.splice(0, this._addAttachClasses.length), "undefined" == typeof this._addAttachClasses && (this._addAttachClasses = []);
                    var e = this._addAttachClasses;
                    a.top && e.push(this.getClass("element-attached") + "-" + a.top), a.left && e.push(this.getClass("element-attached") + "-" + a.left), b.top && e.push(this.getClass("target-attached") + "-" + b.top), b.left && e.push(this.getClass("target-attached") + "-" + b.left);
                    var f = [];
                    d.forEach(function(a) {
                        f.push(c.getClass("element-attached") + "-" + a), f.push(c.getClass("target-attached") + "-" + a)
                    }), A(function() {
                        "undefined" != typeof c._addAttachClasses && (o(c.element, c._addAttachClasses, f), c.options.addTargetClasses !== !1 && o(c.target, c._addAttachClasses, f), delete c._addAttachClasses)
                    })
                }
            }, {
                key: "position",
                value: function() {
                    var a = this,
                        b = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                    if (this.enabled) {
                        this.clearCache();
                        var c = L(this.targetAttachment, this.attachment);
                        this.updateAttachClasses(this.attachment, c);
                        var d = this.cache("element-bounds", function() {
                                return f(a.element)
                            }),
                            e = d.width,
                            i = d.height;
                        if (0 === e && 0 === i && "undefined" != typeof this.lastSize) {
                            var j = this.lastSize;
                            e = j.width, i = j.height
                        } else this.lastSize = {
                            width: e,
                            height: i
                        };
                        var k = this.cache("target-bounds", function() {
                                return a.getTargetBounds()
                            }),
                            l = k,
                            m = s(M(this.attachment), {
                                width: e,
                                height: i
                            }),
                            n = s(M(c), l),
                            o = s(this.offset, {
                                width: e,
                                height: i
                            }),
                            p = s(this.targetOffset, l);
                        m = r(m, o), n = r(n, p);
                        for (var q = k.left + n.left - m.left, t = k.top + n.top - m.top, u = 0; u < v.modules.length; ++u) {
                            var w = v.modules[u],
                                x = w.position.call(this, {
                                    left: q,
                                    top: t,
                                    targetAttachment: c,
                                    targetPos: k,
                                    elementPos: d,
                                    offset: m,
                                    targetOffset: n,
                                    manualOffset: o,
                                    manualTargetOffset: p,
                                    scrollbarSize: z,
                                    attachment: this.attachment
                                });
                            if (x === !1) return !1;
                            "undefined" != typeof x && "object" == typeof x && (t = x.top, q = x.left)
                        }
                        var y = {
                                page: {
                                    top: t,
                                    left: q
                                },
                                viewport: {
                                    top: t - pageYOffset,
                                    bottom: pageYOffset - t - i + innerHeight,
                                    left: q - pageXOffset,
                                    right: pageXOffset - q - e + innerWidth
                                }
                            },
                            z = void 0;
                        return document.body.scrollWidth > window.innerWidth && (z = this.cache("scrollbar-size", h), y.viewport.bottom -= z.height), document.body.scrollHeight > window.innerHeight && (z = this.cache("scrollbar-size", h), y.viewport.right -= z.width), (-1 === ["", "static"].indexOf(document.body.style.position) || -1 === ["", "static"].indexOf(document.body.parentElement.style.position)) && (y.page.bottom = document.body.scrollHeight - t - i,
                            y.page.right = document.body.scrollWidth - q - e), "undefined" != typeof this.options.optimizations && this.options.optimizations.moveElement !== !1 && "undefined" == typeof this.targetModifier && ! function() {
                            var b = a.cache("target-offsetparent", function() {
                                    return g(a.target)
                                }),
                                c = a.cache("target-offsetparent-bounds", function() {
                                    return f(b)
                                }),
                                d = getComputedStyle(b),
                                e = c,
                                h = {};
                            if (["Top", "Left", "Bottom", "Right"].forEach(function(a) {
                                    h[a.toLowerCase()] = parseFloat(d["border" + a + "Width"])
                                }), c.right = document.body.scrollWidth - c.left - e.width + h.right, c.bottom = document.body.scrollHeight - c.top - e.height + h.bottom, y.page.top >= c.top + h.top && y.page.bottom >= c.bottom && y.page.left >= c.left + h.left && y.page.right >= c.right) {
                                var i = b.scrollTop,
                                    j = b.scrollLeft;
                                y.offset = {
                                    top: y.page.top - c.top + i - h.top,
                                    left: y.page.left - c.left + j - h.left
                                }
                            }
                        }(), this.move(y), this.history.unshift(y), this.history.length > 3 && this.history.pop(), b && B(), !0
                    }
                }
            }, {
                key: "move",
                value: function(a) {
                    var b = this;
                    if ("undefined" != typeof this.element.parentNode) {
                        var c = {};
                        for (var d in a) {
                            c[d] = {};
                            for (var e in a[d]) {
                                for (var f = !1, h = 0; h < this.history.length; ++h) {
                                    var j = this.history[h];
                                    if ("undefined" != typeof j[d] && !p(j[d][e], a[d][e])) {
                                        f = !0;
                                        break
                                    }
                                }
                                f || (c[d][e] = !0)
                            }
                        }
                        var k = {
                                top: "",
                                left: "",
                                right: "",
                                bottom: ""
                            },
                            l = function(a, c) {
                                var d = "undefined" != typeof b.options.optimizations,
                                    e = d ? b.options.optimizations.gpu : null;
                                if (e !== !1) {
                                    var f = void 0,
                                        g = void 0;
                                    a.top ? (k.top = 0, f = c.top) : (k.bottom = 0, f = -c.bottom), a.left ? (k.left = 0, g = c.left) : (k.right = 0, g = -c.right), k[F] = "translateX(" + Math.round(g) + "px) translateY(" + Math.round(f) + "px)", "msTransform" !== F && (k[F] += " translateZ(0)")
                                } else a.top ? k.top = c.top + "px" : k.bottom = c.bottom + "px", a.left ? k.left = c.left + "px" : k.right = c.right + "px"
                            },
                            m = !1;
                        if ((c.page.top || c.page.bottom) && (c.page.left || c.page.right) ? (k.position = "absolute", l(c.page, a.page)) : (c.viewport.top || c.viewport.bottom) && (c.viewport.left || c.viewport.right) ? (k.position = "fixed", l(c.viewport, a.viewport)) : "undefined" != typeof c.offset && c.offset.top && c.offset.left ? ! function() {
                                k.position = "absolute";
                                var d = b.cache("target-offsetparent", function() {
                                    return g(b.target)
                                });
                                g(b.element) !== d && A(function() {
                                    b.element.parentNode.removeChild(b.element), d.appendChild(b.element)
                                }), l(c.offset, a.offset), m = !0
                            }() : (k.position = "absolute", l({
                                top: !0,
                                left: !0
                            }, a.page)), !m) {
                            for (var n = !0, o = this.element.parentNode; o && "BODY" !== o.tagName;) {
                                if ("static" !== getComputedStyle(o).position) {
                                    n = !1;
                                    break
                                }
                                o = o.parentNode
                            }
                            n || (this.element.parentNode.removeChild(this.element), document.body.appendChild(this.element))
                        }
                        var q = {},
                            r = !1;
                        for (var e in k) {
                            var s = k[e],
                                t = this.element.style[e];
                            "" !== t && "" !== s && ["top", "left", "bottom", "right"].indexOf(e) >= 0 && (t = parseFloat(t), s = parseFloat(s)), t !== s && (r = !0, q[e] = s)
                        }
                        r && A(function() {
                            i(b.element.style, q)
                        })
                    }
                }
            }]), a
        }();
    P.modules = [], v.position = H;
    var Q = i(P, v),
        D = function() {
            function a(a, b) {
                var c = [],
                    d = !0,
                    e = !1,
                    f = void 0;
                try {
                    for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                } catch (a) {
                    e = !0, f = a
                } finally {
                    try {
                        !d && h.return && h.return()
                    } finally {
                        if (e) throw f
                    }
                }
                return c
            }
            return function(b, c) {
                if (Array.isArray(b)) return b;
                if (Symbol.iterator in Object(b)) return a(b, c);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(),
        E = v.Utils,
        f = E.getBounds,
        i = E.extend,
        o = E.updateClasses,
        A = E.defer,
        R = ["left", "top", "right", "bottom"];
    v.modules.push({
        position: function(a) {
            var b = this,
                c = a.top,
                d = a.left,
                e = a.targetAttachment;
            if (!this.options.constraints) return !0;
            var g = this.cache("element-bounds", function() {
                    return f(b.element)
                }),
                h = g.height,
                j = g.width;
            if (0 === j && 0 === h && "undefined" != typeof this.lastSize) {
                var k = this.lastSize;
                j = k.width, h = k.height
            }
            var l = this.cache("target-bounds", function() {
                    return b.getTargetBounds()
                }),
                m = l.height,
                n = l.width,
                p = [this.getClass("pinned"), this.getClass("out-of-bounds")];
            this.options.constraints.forEach(function(a) {
                var b = a.outOfBoundsClass,
                    c = a.pinnedClass;
                b && p.push(b), c && p.push(c)
            }), p.forEach(function(a) {
                ["left", "top", "right", "bottom"].forEach(function(b) {
                    p.push(a + "-" + b)
                })
            });
            var q = [],
                r = i({}, e),
                s = i({}, this.attachment);
            return this.options.constraints.forEach(function(a) {
                var f = a.to,
                    g = a.attachment,
                    i = a.pin;
                "undefined" == typeof g && (g = "");
                var k = void 0,
                    l = void 0;
                if (g.indexOf(" ") >= 0) {
                    var o = g.split(" "),
                        p = D(o, 2);
                    l = p[0], k = p[1]
                } else k = l = g;
                var u = t(b, f);
                ("target" === l || "both" === l) && (c < u[1] && "top" === r.top && (c += m, r.top = "bottom"), c + h > u[3] && "bottom" === r.top && (c -= m, r.top = "top")), "together" === l && (c < u[1] && "top" === r.top && ("bottom" === s.top ? (c += m, r.top = "bottom", c += h, s.top = "top") : "top" === s.top && (c += m, r.top = "bottom", c -= h, s.top = "bottom")), c + h > u[3] && "bottom" === r.top && ("top" === s.top ? (c -= m, r.top = "top", c -= h, s.top = "bottom") : "bottom" === s.top && (c -= m, r.top = "top", c += h, s.top = "top")), "middle" === r.top && (c + h > u[3] && "top" === s.top ? (c -= h, s.top = "bottom") : c < u[1] && "bottom" === s.top && (c += h, s.top = "top"))), ("target" === k || "both" === k) && (d < u[0] && "left" === r.left && (d += n, r.left = "right"), d + j > u[2] && "right" === r.left && (d -= n, r.left = "left")), "together" === k && (d < u[0] && "left" === r.left ? "right" === s.left ? (d += n, r.left = "right", d += j, s.left = "left") : "left" === s.left && (d += n, r.left = "right", d -= j, s.left = "right") : d + j > u[2] && "right" === r.left ? "left" === s.left ? (d -= n, r.left = "left", d -= j, s.left = "right") : "right" === s.left && (d -= n, r.left = "left", d += j, s.left = "left") : "center" === r.left && (d + j > u[2] && "left" === s.left ? (d -= j, s.left = "right") : d < u[0] && "right" === s.left && (d += j, s.left = "left"))), ("element" === l || "both" === l) && (c < u[1] && "bottom" === s.top && (c += h, s.top = "top"), c + h > u[3] && "top" === s.top && (c -= h, s.top = "bottom")), ("element" === k || "both" === k) && (d < u[0] && ("right" === s.left ? (d += j, s.left = "left") : "center" === s.left && (d += j / 2, s.left = "left")), d + j > u[2] && ("left" === s.left ? (d -= j, s.left = "right") : "center" === s.left && (d -= j / 2, s.left = "right"))), "string" == typeof i ? i = i.split(",").map(function(a) {
                    return a.trim()
                }) : i === !0 && (i = ["top", "left", "right", "bottom"]), i = i || [];
                var v = [],
                    w = [];
                c < u[1] && (i.indexOf("top") >= 0 ? (c = u[1], v.push("top")) : w.push("top")), c + h > u[3] && (i.indexOf("bottom") >= 0 ? (c = u[3] - h, v.push("bottom")) : w.push("bottom")), d < u[0] && (i.indexOf("left") >= 0 ? (d = u[0], v.push("left")) : w.push("left")), d + j > u[2] && (i.indexOf("right") >= 0 ? (d = u[2] - j, v.push("right")) : w.push("right")), v.length && ! function() {
                    var a = void 0;
                    a = "undefined" != typeof b.options.pinnedClass ? b.options.pinnedClass : b.getClass("pinned"), q.push(a), v.forEach(function(b) {
                        q.push(a + "-" + b)
                    })
                }(), w.length && ! function() {
                    var a = void 0;
                    a = "undefined" != typeof b.options.outOfBoundsClass ? b.options.outOfBoundsClass : b.getClass("out-of-bounds"), q.push(a), w.forEach(function(b) {
                        q.push(a + "-" + b)
                    })
                }(), (v.indexOf("left") >= 0 || v.indexOf("right") >= 0) && (s.left = r.left = !1), (v.indexOf("top") >= 0 || v.indexOf("bottom") >= 0) && (s.top = r.top = !1), (r.top !== e.top || r.left !== e.left || s.top !== b.attachment.top || s.left !== b.attachment.left) && b.updateAttachClasses(s, r)
            }), A(function() {
                b.options.addTargetClasses !== !1 && o(b.target, q, p), o(b.element, q, p)
            }), {
                top: c,
                left: d
            }
        }
    });
    var E = v.Utils,
        f = E.getBounds,
        o = E.updateClasses,
        A = E.defer;
    v.modules.push({
        position: function(a) {
            var b = this,
                c = a.top,
                d = a.left,
                e = this.cache("element-bounds", function() {
                    return f(b.element)
                }),
                g = e.height,
                h = e.width,
                i = this.getTargetBounds(),
                j = c + g,
                k = d + h,
                l = [];
            c <= i.bottom && j >= i.top && ["left", "right"].forEach(function(a) {
                var b = i[a];
                (b === d || b === k) && l.push(a)
            }), d <= i.right && k >= i.left && ["top", "bottom"].forEach(function(a) {
                var b = i[a];
                (b === c || b === j) && l.push(a)
            });
            var m = [],
                n = [],
                p = ["left", "top", "right", "bottom"];
            return m.push(this.getClass("abutted")), p.forEach(function(a) {
                m.push(b.getClass("abutted") + "-" + a)
            }), l.length && n.push(this.getClass("abutted")), l.forEach(function(a) {
                n.push(b.getClass("abutted") + "-" + a)
            }), A(function() {
                b.options.addTargetClasses !== !1 && o(b.target, n, m), o(b.element, n, m)
            }), !0
        }
    });
    var D = function() {
        function a(a, b) {
            var c = [],
                d = !0,
                e = !1,
                f = void 0;
            try {
                for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
            } catch (a) {
                e = !0, f = a
            } finally {
                try {
                    !d && h.return && h.return()
                } finally {
                    if (e) throw f
                }
            }
            return c
        }
        return function(b, c) {
            if (Array.isArray(b)) return b;
            if (Symbol.iterator in Object(b)) return a(b, c);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    return v.modules.push({
        position: function(a) {
            var b = a.top,
                c = a.left;
            if (this.options.shift) {
                var d = this.options.shift;
                "function" == typeof this.options.shift && (d = this.options.shift.call(this, {
                    top: b,
                    left: c
                }));
                var e = void 0,
                    f = void 0;
                if ("string" == typeof d) {
                    d = d.split(" "), d[1] = d[1] || d[0];
                    var g = d,
                        h = D(g, 2);
                    e = h[0], f = h[1], e = parseFloat(e, 10), f = parseFloat(f, 10)
                } else e = d.top, f = d.left;
                return b += e, c += f, {
                    top: b,
                    left: c
                }
            }
        }
    }), Q
}),
    function() {
        var a, b, c, d, e, f = function(a, b) {
                return function() {
                    return a.apply(b, arguments)
                }
            },
            g = [].indexOf || function(a) {
                for (var b = 0, c = this.length; b < c; b++)
                    if (b in this && this[b] === a) return b;
                return -1
            };
        b = function() {
            function a() {}
            return a.prototype.extend = function(a, b) {
                var c, d;
                for (c in b) d = b[c], null == a[c] && (a[c] = d);
                return a
            }, a.prototype.isMobile = function(a) {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
            }, a.prototype.createEvent = function(a, b, c, d) {
                var e;
                return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e
            }, a.prototype.emitEvent = function(a, b) {
                return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0
            }, a.prototype.addEvent = function(a, b, c) {
                return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c
            }, a.prototype.removeEvent = function(a, b, c) {
                return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b]
            }, a.prototype.innerHeight = function() {
                return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
            }, a
        }(), c = this.WeakMap || this.MozWeakMap || (c = function() {
            function a() {
                this.keys = [], this.values = []
            }
            return a.prototype.get = function(a) {
                var b, c, d, e, f;
                for (f = this.keys, b = d = 0, e = f.length; d < e; b = ++d)
                    if (c = f[b], c === a) return this.values[b]
            }, a.prototype.set = function(a, b) {
                var c, d, e, f, g;
                for (g = this.keys, c = e = 0, f = g.length; e < f; c = ++e)
                    if (d = g[c], d === a) return void(this.values[c] = b);
                return this.keys.push(a), this.values.push(b)
            }, a
        }()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function() {
            function a() {
                "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
            }
            return a.notSupported = !0, a.prototype.observe = function() {}, a
        }()), d = this.getComputedStyle || function(a, b) {
            return this.getPropertyValue = function(b) {
                var c;
                return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function(a, b) {
                    return b.toUpperCase()
                }), (null != (c = a.currentStyle) ? c[b] : void 0) || null
            }, this
        }, e = /(\-([a-z]){1})/g, this.WOW = function() {
            function e(a) {
                null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), null != a.scrollContainer && (this.config.scrollContainer = document.querySelector(a.scrollContainer)), this.animationNameCache = new c, this.wowEvent = this.util().createEvent(this.config.boxClass)
            }
            return e.prototype.defaults = {
                boxClass: "wow",
                animateClass: "animated",
                offset: 0,
                mobile: !0,
                live: !0,
                callback: null,
                scrollContainer: null
            }, e.prototype.init = function() {
                var a;
                return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
            }, e.prototype.start = function() {
                var b, c, d, e;
                if (this.stopped = !1, this.boxes = function() {
                        var a, c, d, e;
                        for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; a < c; a++) b = d[a], e.push(b);
                        return e
                    }.call(this), this.all = function() {
                        var a, c, d, e;
                        for (d = this.boxes, e = [], a = 0, c = d.length; a < c; a++) b = d[a], e.push(b);
                        return e
                    }.call(this), this.boxes.length)
                    if (this.disabled()) this.resetStyle();
                    else
                        for (e = this.boxes, c = 0, d = e.length; c < d; c++) b = e[c], this.applyStyle(b, !0);
                if (this.disabled() || (this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live) return new a(function(a) {
                    return function(b) {
                        var c, d, e, f, g;
                        for (g = [], c = 0, d = b.length; c < d; c++) f = b[c], g.push(function() {
                            var a, b, c, d;
                            for (c = f.addedNodes || [], d = [], a = 0, b = c.length; a < b; a++) e = c[a], d.push(this.doSync(e));
                            return d
                        }.call(a));
                        return g
                    }
                }(this)).observe(document.body, {
                    childList: !0,
                    subtree: !0
                })
            }, e.prototype.stop = function() {
                if (this.stopped = !0, this.util().removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval) return clearInterval(this.interval)
            }, e.prototype.sync = function(b) {
                if (a.notSupported) return this.doSync(this.element)
            }, e.prototype.doSync = function(a) {
                var b, c, d, e, f;
                if (null == a && (a = this.element), 1 === a.nodeType) {
                    for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; c < d; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0);
                    return f
                }
            }, e.prototype.show = function(a) {
                return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a
            }, e.prototype.applyStyle = function(a, b) {
                var c, d, e;
                return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function(f) {
                    return function() {
                        return f.customStyle(a, b, d, c, e)
                    }
                }(this))
            }, e.prototype.animate = function() {
                return "requestAnimationFrame" in window ? function(a) {
                    return window.requestAnimationFrame(a)
                } : function(a) {
                    return a()
                }
            }(), e.prototype.resetStyle = function() {
                var a, b, c, d, e;
                for (d = this.boxes, e = [], b = 0, c = d.length; b < c; b++) a = d[b], e.push(a.style.visibility = "visible");
                return e
            }, e.prototype.resetAnimation = function(a) {
                var b;
                if (a.type.toLowerCase().indexOf("animationend") >= 0) return b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()
            }, e.prototype.customStyle = function(a, b, c, d, e) {
                return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
                    animationDuration: c
                }), d && this.vendorSet(a.style, {
                    animationDelay: d
                }), e && this.vendorSet(a.style, {
                    animationIterationCount: e
                }), this.vendorSet(a.style, {
                    animationName: b ? "none" : this.cachedAnimationName(a)
                }), a
            }, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function(a, b) {
                var c, d, e, f;
                d = [];
                for (c in b) e = b[c], a["" + c] = e, d.push(function() {
                    var b, d, g, h;
                    for (g = this.vendors, h = [], b = 0, d = g.length; b < d; b++) f = g[b], h.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e);
                    return h
                }.call(this));
                return d
            }, e.prototype.vendorCSS = function(a, b) {
                var c, e, f, g, h, i;
                for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; c < e; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b);
                return g
            }, e.prototype.animationName = function(a) {
                var b;
                try {
                    b = this.vendorCSS(a, "animation-name").cssText
                } catch (c) {
                    b = d(a).getPropertyValue("animation-name")
                }
                return "none" === b ? "" : b
            }, e.prototype.cacheAnimationName = function(a) {
                return this.animationNameCache.set(a, this.animationName(a))
            }, e.prototype.cachedAnimationName = function(a) {
                return this.animationNameCache.get(a)
            }, e.prototype.scrollHandler = function() {
                return this.scrolled = !0
            }, e.prototype.scrollCallback = function() {
                var a;
                if (this.scrolled && (this.scrolled = !1, this.boxes = function() {
                        var b, c, d, e;
                        for (d = this.boxes, e = [], b = 0, c = d.length; b < c; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a));
                        return e
                    }.call(this), !this.boxes.length && !this.config.live)) return this.stop()
            }, e.prototype.offsetTop = function(a) {
                for (var b; void 0 === a.offsetTop;) a = a.parentNode;
                for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
                return b
            }, e.prototype.isVisible = function(a) {
                var b, c, d, e, f;
                return c = a.getAttribute("data-wow-offset") || this.config.offset, f = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, d <= e && b >= f
            }, e.prototype.util = function() {
                return null != this._util ? this._util : this._util = new b
            }, e.prototype.disabled = function() {
                return !this.config.mobile && this.util().isMobile(navigator.userAgent)
            }, e
        }()
    }.call(this), + function(a) {
    "use strict";

    function b() {
        this._activeZoom = this._initialScrollPosition = this._initialTouchPosition = this._touchMoveListener = null, this._$document = a(document), this._$window = a(window), this._$body = a(document.body), this._boundClick = a.proxy(this._clickHandler, this)
    }

    function c(b) {
        this._fullHeight = this._fullWidth = this._overlay = this._targetImageWrap = null, this._targetImage = b, this._$body = a(document.body)
    }
    b.prototype.listen = function() {
        this._$body.on("click", '[data-action="zoom"]', a.proxy(this._zoom, this))
    }, b.prototype._zoom = function(b) {
        var d = b.target;
        if (d && "IMG" == d.tagName && !this._$body.hasClass("zoom-overlay-open")) return b.metaKey || b.ctrlKey ? b.target.getAttribute("data-original") || window.open(b.target.src, "_blank") : void(d.width >= window.innerWidth - c.OFFSET || (this._activeZoomClose(!0), this._activeZoom = new c(d), this._activeZoom.zoomImage(), this._$window.on("scroll.zoom", a.proxy(this._scrollHandler, this)), this._$document.on("keyup.zoom", a.proxy(this._keyHandler, this)), this._$document.on("touchstart.zoom", a.proxy(this._touchStart, this)), document.addEventListener("click", this._boundClick, !0), b.stopPropagation()))
    }, b.prototype._activeZoomClose = function(a) {
        this._activeZoom && (a ? this._activeZoom.dispose() : this._activeZoom.close(), this._$window.off(".zoom"), this._$document.off(".zoom"), document.removeEventListener("click", this._boundClick, !0), this._activeZoom = null)
    }, b.prototype._scrollHandler = function(a) {
        null === this._initialScrollPosition && (this._initialScrollPosition = window.scrollY);
        var b = this._initialScrollPosition - window.scrollY;
        Math.abs(b) >= 40 && this._activeZoomClose()
    }, b.prototype._keyHandler = function(a) {
        27 == a.keyCode && this._activeZoomClose()
    }, b.prototype._clickHandler = function(a) {
        a.stopPropagation(), a.preventDefault(), this._activeZoomClose()
    }, b.prototype._touchStart = function(b) {
        this._initialTouchPosition = b.touches[0].pageY, a(b.target).on("touchmove.zoom", a.proxy(this._touchMove, this))
    }, b.prototype._touchMove = function(b) {
        Math.abs(b.touches[0].pageY - this._initialTouchPosition) > 10 && (this._activeZoomClose(), a(b.target).off("touchmove.zoom"))
    }, c.OFFSET = 80, c._MAX_WIDTH = 2560, c._MAX_HEIGHT = 4096, c.prototype.zoomImage = function() {
        var b = document.createElement("img");
        b.onload = a.proxy(function() {
            this._fullHeight = Number(b.height), this._fullWidth = Number(b.width), this._zoomOriginal()
        }, this), b.src = this._targetImage.src
    }, c.prototype._zoomOriginal = function() {
        this._targetImageWrap = document.createElement("div"), this._targetImageWrap.className = "zoom-img-wrap", this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage), this._targetImageWrap.appendChild(this._targetImage), a(this._targetImage).addClass("zoom-img").attr("data-action", "zoom-out"), this._overlay = document.createElement("div"), this._overlay.className = "zoom-overlay", document.body.appendChild(this._overlay), this._calculateZoom(), this._triggerAnimation()
    }, c.prototype._calculateZoom = function() {
        this._targetImage.offsetWidth;
        var a = this._fullWidth,
            b = this._fullHeight,
            d = (window.scrollY, a / this._targetImage.width),
            e = window.innerHeight - c.OFFSET,
            f = window.innerWidth - c.OFFSET,
            g = a / b,
            h = f / e;
        a < f && b < e ? this._imgScaleFactor = d : g < h ? this._imgScaleFactor = e / b * d : this._imgScaleFactor = f / a * d
    }, c.prototype._triggerAnimation = function() {
        this._targetImage.offsetWidth;
        var b = a(this._targetImage).offset(),
            c = a(window).scrollTop(),
            d = c + window.innerHeight / 2,
            e = window.innerWidth / 2,
            f = b.top + this._targetImage.height / 2,
            g = b.left + this._targetImage.width / 2;
        this._translateY = d - f, this._translateX = e - g, a(this._targetImage).css("transform", "scale(" + this._imgScaleFactor + ")"), a(this._targetImageWrap).css("transform", "translate(" + this._translateX + "px, " + this._translateY + "px) translateZ(0)"), this._$body.addClass("zoom-overlay-open")
    }, c.prototype.close = function() {
        this._$body.removeClass("zoom-overlay-open").addClass("zoom-overlay-transitioning"), a(this._targetImage).css("transform", ""), a(this._targetImageWrap).css("transform", ""), a(this._targetImage).one(a.support.transition.end, a.proxy(this.dispose, this)).emulateTransitionEnd(300)
    }, c.prototype.dispose = function() {
        this._targetImageWrap && this._targetImageWrap.parentNode && (a(this._targetImage).removeClass("zoom-img").attr("data-action", "zoom"), this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap), this._overlay.parentNode.removeChild(this._overlay), this._$body.removeClass("zoom-overlay-transitioning"))
    }, a(function() {
        (new b).listen()
    })
}(jQuery) + function(a) {
    "use strict";

    function b() {
        var a = document.createElement("bootstrap"),
            b = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var c in b)
            if (void 0 !== a.style[c]) return {
                end: b[c]
            };
        return !1
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1,
            d = this;
        a(this).one("bsTransitionEnd", function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function() {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
            bindType: a.support.transition.end,
            delegateType: a.support.transition.end,
            handle: function(b) {
                if (a(b.target).is(this)) return b.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery);