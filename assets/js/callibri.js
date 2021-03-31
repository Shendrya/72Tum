function callibridomain() {
    var a,
        b,
        c = "";
    return (
        (a = document.domain.split(".")),
        a.length > 2
            ? ((b = a.length > 3 ? 2 : 1), !0 === _callibri.allow_subdomains && (b -= 1), (c = (_callibri.allow_subdomains ? "" : ".") + a.slice(b, a.length).toString().replace(/,/g, ".")))
            : (c = (_callibri.allow_subdomains ? "" : ".") + document.domain),
        c
    );
}
function callibriSetCookieDomain(a, b, c, d, e) {
    "session" !== c ? (void 0 === e ? c.setMinutes(c.getMinutes() + 10) : c.setDate(c.getDate() + 100), (c = ";expires=" + c.toUTCString() + ";")) : (c = ""), (document.cookie = a + "=" + escape(b) + "; path=/; " + d + " " + c);
}
function callibriSetCookie(a, b, c, d, e) {
    var f = callibridomain();
    "session" !== e && (e = e ? new Date(new Date().getTime() + 24 * e * 60 * 60 * 1e3) : new Date());
    var g = _callibri.allow_subdomains ? "" : "domain=" + f + ";";
    d || callibriSetCookieDomain(a, b, e, g, c), (-1 === document.cookie.indexOf(a) || d) && ((g = ""), callibriSetCookieDomain(a, b, e, g, c));
}
function callibriGetCookie(a) {
    var b,
        c,
        d,
        e = document.cookie.split(";");
    for (b = 0; b < e.length; b++) if (((c = e[b].substr(0, e[b].indexOf("="))), (d = e[b].substr(e[b].indexOf("=") + 1)), (c = c.replace(/^\s+|\s+$/g, "")) == a)) return unescape(d);
    return !1;
}
function callibriXhrRequest() {
    for (
        var a,
            b = [
                function () {
                    return (a = callibriCheckIE8_9() ? new XDomainRequest() : new XMLHttpRequest());
                },
                function () {
                    return new ActiveXObject("Msxml2.XMLHTTP");
                },
                function () {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                },
                function () {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                },
            ],
            c = 0;
        c < b.length;
        c++
    ) {
        try {
            a = b[c]();
        } catch (a) {
            continue;
        }
        break;
    }
    return a;
}
function callibriMakeRequest(a, b, c, d, e, f) {
    try {
        var g, h, i, j, k;
        b = b || {};
        try {
            f = f || 3e4;
        } catch (a) {
            f = 3e4;
        }
        if (!(i = callibriXhrRequest())) return;
        if (((b.version = _callibri.version), (b = callibri_add_roistat_mark(b)), (b = callibriAddTimezoneData(b, a)), (b = callibriGetCalltouchSessionId(b, a)), a.match(/contactus$/))) {
            (b.ymclid = callibriGetMetrikaClientID(!0)), (b.gaclid = callibriGetGaClientID(!0)), (b.clbvid = _callibri.clbvid || null);
            var l = callibriSetPostDataFeedback(b);
            i.feedback_data = l;
        }
        if (
            (e || (e = _callibri.server_host),
            (h = document.location.protocol + "//" + e + a),
            i.open("POST", h, !0),
            (k = callibriCheckIE8_9()),
            (g = setTimeout(function () {
                i.abort();
            }, f)),
            k)
        )
            i.onload = function () {
                i.feedback_data && callibriRemoveElementItemLocalStorage("callibri_feedbacks", i.feedback_data), c && "function" == typeof c && c(i.responseText, 200);
            };
        else {
            try {
                d = d || "application/json";
            } catch (a) {
                d = "application/json";
            }
            i.setRequestHeader("Content-Type", d),
                (j = document.characterSet ? document.characterSet : document.charset),
                "utf-8" !== j.toString().toLowerCase() ? i.setRequestHeader("Accept", d + "; charset=" + j) : i.setRequestHeader("Accept", d),
                (i.onreadystatechange = function () {
                    (3 == i.readyState || 4 == i.readyState) && i.feedback_data && [200, 201, 204, 422].indexOf(i.status) > -1 && callibriRemoveElementItemLocalStorage("callibri_feedbacks", i.feedback_data),
                        4 == i.readyState && (clearTimeout(g), c && "function" == typeof c && c(i.responseText, i.status)),
                        4 == i.readyState &&
                            (0 === i.status || 500 == i.status || i.status >= 400) &&
                            _callibri.server_host !== e &&
                            ("/module/number" === a ? callibriFailRequestModule(i, e, a, b, d, c) : callibriMakeRequest(a, b, c, d, null, f));
                });
        }
        var m = JSON.stringify(b);
        _callibri.btr || i.send(m);
    } catch (a) {}
}
function callibriFailRequestModule(a, b, c, d, e, f) {
    var g = d.request_number || 0;
    if ([0, 429, 503].indexOf(a.status) > -1 && g < 3) {
        d.request_number = g + 1;
        var h = Math.ceil(500 * Math.random() + 500);
        setTimeout(callibriMakeRequest, h, c, d, f, e, b);
    } else console.error("Code: ", a.status, "error: ", a.responseText, { host: b, path: c }, d);
}
function supports_callibri_storage() {
    if (_callibri.localStorage_off) return !1;
    try {
        return localStorage.setItem("test_localstorage", "1"), localStorage.removeItem("test_localstorage"), !0;
    } catch (a) {
        return (_callibri.localStorage_off = !0), !1;
    }
}
function callibriGetItemLocalStorage(a) {
    if (supports_callibri_storage()) {
        var b = localStorage.getItem(a);
        return null === b && (b = callibriGetCookie(a)), b;
    }
    return callibriGetCookie(a);
}
function callibriSetItemStorage(a, b) {
    var c = !0;
    try {
        localStorage.setItem(a, b);
    } catch (a) {
        (_callibri.localStorage_off = !0), (c = !1);
    }
    return c;
}
function callibriSetItemLocalStorage(a, b) {
    var c = !0;
    if (supports_callibri_storage())
        if (b) {
            var d = callibriSetItemStorage(a, b);
            d && (c = !1);
        } else localStorage.removeItem(a), (c = !1 !== callibriGetCookie(a, b));
    c && callibriSetCookie(a, b);
}
function supports_callibri_session_storage() {
    if (_callibri.sessionStorage_off) return !1;
    try {
        return sessionStorage.setItem("test_sessionstorage", "1"), sessionStorage.removeItem("test_sessionstorage"), !0;
    } catch (a) {
        return (_callibri.sessionStorage_off = !0), !1;
    }
}
function callibriGetItemSessionStorage(a) {
    if (supports_callibri_session_storage()) {
        var b = sessionStorage.getItem(a);
        return null === b && (b = callibriGetCookie(a)), b;
    }
    return callibriGetCookie(a);
}
function callibriTrySetItemSessionStorage(a, b) {
    var c = !0;
    try {
        sessionStorage.setItem(a, b);
    } catch (a) {
        c = !1;
    }
    return c;
}
function callibriSetItemSessionStorage(a, b) {
    var c = !0;
    if (supports_callibri_session_storage())
        if (b) {
            var d = callibriTrySetItemSessionStorage(a, b);
            d && (c = !1);
        } else sessionStorage.removeItem(a), (c = !1 !== callibriGetCookie(a, b));
    c && callibriSetCookie(a, b);
}
function callibriFlushTempStorage() {
    if (supports_callibri_storage()) {
        var a = localStorage.getItem(_callibri.cookie_prefix + "timestamp_callibri");
        a = a ? new Date(a) : null;
        var b = new Date();
        if (a && (b - a) / 6e4 > 10) for (var c in localStorage) 0 == c.indexOf(_callibri.cookie_prefix) && c.match("callibri") && localStorage.removeItem(c);
        callibriSetItemStorage(_callibri.cookie_prefix + "timestamp_callibri", b.toString());
    }
}
function callibriRemoveElementItemLocalStorage(a, b) {
    var c,
        d = callibriGetItemLocalStorage(a),
        e = [];
    d = d ? JSON.parse(d) : [];
    for (var f = 0; f < d.length; f++) (c = d[f]), b !== c && e.push(c);
    (e = e.length > 0 ? JSON.stringify(e) : ""), callibriSetItemLocalStorage(a, JSON.stringify(e));
}
function callibriSetPostDataFeedback(a) {
    var b = "";
    for (var c in a.feedback) c && "number" !== c && "session_id" !== c && (b += c + "-:-" + a.feedback[c].toString() + "-;-");
    var d = callibriGetItemLocalStorage("callibri_feedbacks");
    return (d = d ? JSON.parse(d) : []), "object" != typeof d && (d = []), -1 === d.indexOf(b) && (d.push(b), callibriSetItemLocalStorage("callibri_feedbacks", JSON.stringify(d))), b;
}
function callibriSetLocalHooksUrl(a) {
    if (a.data.module_settings && a.data.module_settings.hooks_urls)
        try {
            (_callibri.exists_url = !0),
                callibriSetItemLocalStorage("callibri_hooks_urls", JSON.stringify(a.data.module_settings.hooks_urls)),
                callibriSetItemLocalStorage("callibri_hooks_urls_timestamp", new Date().toString()),
                delete a.data.module_settings.hooks_urls;
        } catch (a) {}
    return a;
}
function callibriReplacePhones() {
    for (var a = _callibri.objects.callibri.format, b = _callibri.objects.callibri.block_class.split(","), c = 0; c < b.length; c++) {
        callibriSetValueToBlocksByClass("." + b[c].replace(/\s/g, ""), _callibri.number, a);
    }
    if (_callibri.module_settings && _callibri.module_settings.elements) {
        var d,
            e = _callibri.module_settings.elements,
            f = e.length;
        for (c = 0; c < f; c++) (d = e[c]), callibriSetValueToBlocksByClass(d.element, _callibri.number, d.format);
    }
}
function callibriReplaceCopiesPhones() {
    if (_callibri.copies_phones) {
        var a,
            b,
            c,
            d,
            e,
            f = _callibri.copies_phones.length;
        for (a = 0; a < f; a++) for (b = _callibri.copies_phones[a], c = b.elements.length, d = 0; d < c; d++) (e = b.elements[d]), callibriSetValueToBlocksByClass(e.element, b.phone, e.format);
    }
}
function callibriPingCallback(a) {
    4 == a.readyState &&
        201 !== a.status &&
        (callibri_ping_interval && (clearInterval(callibri_ping_interval), (callibri_ping_interval = void 0)),
        _callibri.ping_attempt ? (_callibri.ping_attempt += 1) : (_callibri.ping_attempt = 1),
        (callibri_error_timeout = setTimeout(callibriPingNumber, Math.floor(Math.random() * Math.pow(2, _callibri.ping_attempt) * 1e3)))),
        4 == a.readyState && 201 === a.status && "undefined" == typeof callibri_ping_interval && ((callibri_ping_interval = setInterval(callibriPingNumber, 1e4)), (_callibri.ping_attempt = null));
}
function callibriDocumentHidden() {
    var a;
    return void 0 !== document.hidden ? (a = "hidden") : void 0 !== document.msHidden ? (a = "msHidden") : void 0 !== document.mozHidden ? (a = "mozHidden") : void 0 !== document.webkitHidden && (a = "webkitHidden"), document[a];
}
function callibriPingNumber(a) {
    try {
        if (!callibriDocumentHidden() || a) {
            var b = _callibri.number;
            if (_callibri.copies_phones) {
                var c,
                    d = _callibri.copies_phones.length;
                for (c = 0; c < d; c++) b += "_" + _callibri.copies_phones[c].phone;
            }
            var e = "/visit?s=" + _callibri.session_id + "&p=" + b;
            _callibri.ping_delete && (e += "&d=1"), callibriGetRequest("//" + _callibri.ws_server_host + e, callibriPingCallback);
        }
    } catch (a) {
        callibriSendError(a, "callibriPingNumber");
    }
}
function callibriSetLocalCookieValue(a, b) {
    var c = callibriGetResponse();
    if (c) {
        var d = JSON.parse(c);
        (d.data[a] = b), (d = JSON.stringify(d)), callibriSaveResponse(d);
    }
}
function callibriGetResponse() {
    var a = null;
    return (
        supports_callibri_storage() && (a = localStorage.getItem("callibri")),
        null == a && (a = callibriGetCookie(_callibri.cookie_prefix + "data")),
        a && a.indexOf('"unified_domain":') > -1 && (!_callibri.unified_domain || (_callibri.unified_domain && -1 === a.indexOf('"unified_domain":' + _callibri.unified_domain))) && (a = null),
        a
    );
}
function callibriFlushResponse(a) {
    if ((callibriSetCookie(_callibri.cookie_prefix + "data", "", void 0, !0), supports_callibri_storage()))
        try {
            localStorage.removeItem("callibri"), localStorage.removeItem("callibri_module_settings");
        } catch (a) {
            _callibri.localStorage_off = !0;
        }
    if (!(document.referrer || "").match("https?://" + location.host) || a) {
        callibriGetItemLocalStorage("callibri_visitor_send_event") && callibriSetItemLocalStorage("callibri_visitor_send_event", null);
    }
}
function callibriSaveResponse(a) {
    var b,
        c,
        d = !1;
    if ((supports_callibri_storage() && (_callibri.unified_domain && ((b = JSON.parse(a)), (b.unified_domain = _callibri.unified_domain), (a = JSON.stringify(b))), (d = callibriSetItemStorage("callibri", a))), !d)) {
        b = JSON.parse(a);
        var c = b.data.module_settings;
        _callibri.unified_domain && (b.unified_domain = _callibri.unified_domain),
            (b.data.module_settings = ""),
            (b = JSON.stringify(b)),
            c && supports_callibri_storage() && ((c.timestamp = new Date().valueOf()), callibriSetItemStorage("callibri_module_settings", JSON.stringify(c))),
            callibriSetCookie(_callibri.cookie_prefix + "data", b, void 0, !0);
    }
}
function callibri_change_channel() {
    if (_callibri.init && !_callibri.history_change) return !1;
    if (!(_callibri.landing_channels && _callibri.landing_channels.length > 0)) return !1;
    var a = !1;
    return (
        _callibri.landing_channels.some(function (a) {
            return a.id == _callibri.channel_id && ((_callibri.current_channel = a), !0);
        }),
        (!_callibri.current_channel || !callibri_group_check(_callibri.current_channel)) &&
            !(
                !(a = _callibri.landing_channels.some(function (a) {
                    return a.id != _callibri.channel_id && callibri_group_check(a);
                })) && !_callibri.current_channel
            ) &&
            (_callibri.dynamic && ((_callibri.ping_delete = !0), callibriPingNumber(!0)),
            (_callibri.stop_init = !0),
            (_callibri.get_request = !1),
            callibriSetCookie("callibri_get_request", "", void 0, !0, -1),
            (a || _callibri.pw) && (delete _callibri.module_settings, delete _callibri.number, delete _callibri.only_widget, callibriFlushResponse(!0), (_callibri.stop_init = !1), callibriInit(), (_callibri.ping_delete = !1)),
            !0)
    );
}
function callibriHandleResponse(a, b, c) {
    function d(a) {
        var b = !("v2" != _callibri.mv_version || !_callibri.chat_operator) && _callibri.chat_operator;
        (_callibri.history_change = !0), callibriInit(!1, !0), b && (_callibri.chat_operator = b), "function" == typeof callibriWidgetPageNavigate && callibriWidgetPageNavigate(a), (_callibri.history_change = !1);
    }
    function e() {
        d();
    }
    var f = !_callibri.init;
    try {
        var g, h, i;
        if (200 != b) return;
        if ((callibriSetItemLocalStorage("callibri_request_send", ""), (a = callibriCheckIE8_9() ? a.replace(/\\'/g, "'") : a), (h = JSON.parse(a)), void 0 === h.data || "object" != typeof h.data || "object" == typeof h.errors)) {
            callibriSetItemLocalStorage("callibri_nct", "1"), "string" == typeof h.errors && (h.errors = [[h.errors]]);
            for (var j in h.errors) {
                var k = "callibri error: " + h.errors[j].join(", ");
                void 0 !== console ? console.log(k) : window.console.log(k);
            }
            return;
        }
        if ("object" == typeof h.data && h.data.number && !h.data.only_widget && "object" != typeof h.errors) {
            if ((callibri_extend_ms(h), _callibri.stop_init || (c && callibri_change_channel()))) return;
            (g = h.data.number), h.data.session_id && callibriSetCookie(_callibri.cookie_prefix + "sessions_callibri", h.data.session_id, 1);
            var l = callibriGetResponse();
            l || ((h.expire_date = new Date().toString()), (h = callibriSetLocalHooksUrl(h)), (a = JSON.stringify(h)), callibriSaveResponse(a)),
                h.data.dynamic &&
                    (callibriSetItemLocalStorage("callibri_phone", _callibri.number),
                    h.data.copies_phones && callibriSetItemLocalStorage("callibri_copies_phones", JSON.stringify(h.data.copies_phones)),
                    _callibri.init ||
                        (supports_callibri_storage() &&
                            (window.addEventListener("storage", function (a) {
                                _callibri.stop_init || ("callibri_phone" == a.key && a.newValue && a.oldValue !== a.newValue && ((_callibri.number = a.newValue), callibriSetLocalCookieValue("number", a.newValue), callibriReplacePhones()));
                            }),
                            h.data.copies_phones &&
                                window.addEventListener("storage", function (a) {
                                    _callibri.stop_init ||
                                        ("callibri_copies_phones" == a.key &&
                                            a.newValue &&
                                            a.oldValue !== a.newValue &&
                                            ((_callibri.copies_phones = JSON.parse(a.newValue)), callibriSetLocalCookieValue("copies_phones", _callibri.copies_phones), callibriReplaceCopiesPhones()));
                                })),
                        h.data.ping && (l && callibriPingNumber(!0), (callibri_ping_interval = setInterval(callibriPingNumber, 1e4)))));
            for (var m = _callibri.objects.callibri, n = m.block_class.split(","), i = 0; i < n.length; i++) {
                callibriSetValueToBlocksByClass("." + n[i].replace(/\s/g, ""), g, m.format);
            }
            if ((!_callibri.init && h.data.webcalls && callibriWidgetStart(), h.data.module_settings)) {
                if (("string" == typeof h.data.module_settings.elements && (h.data.module_settings.elements = JSON.parse(h.data.module_settings.elements)), h.data.module_settings.elements)) {
                    var o,
                        p = h.data.module_settings.elements;
                    for (i = 0; i < p.length; i++) (o = p[i]), callibriSetValueToBlocksByClass(o.element, g, o.format);
                }
                if (h.data.module_settings.pseudo_links) {
                    var q = h.data.module_settings.pseudo_links;
                    for (i = 0; i < q.length; i++) callibriSetPseudoLink(q[i]);
                }
            }
            var r = h.data.copies_phones;
            if (void 0 !== r && null !== r)
                for (var s = 0; s < r.length; s++)
                    if (((copy = r[s]), copy.element_class)) callibriSetValueToBlocksByClass("." + copy.element_class, copy.phone, m.format);
                    else {
                        var t,
                            u,
                            v = copy.elements ? copy.elements.length : 0;
                        for (t = 0; t < v; t++) (u = copy.elements[t]), callibriSetValueToBlocksByClass(u.element, copy.phone, u.format);
                    }
            callibriUseFeedback(), callibriChangeEmails();
        } else if (h.data.module_settings) {
            if ((callibri_extend_ms(h), _callibri.stop_init || (c && callibri_change_channel()))) return;
            h.data.session_id && (callibriSetCookie(_callibri.cookie_prefix + "sessions_callibri", h.data.session_id, 1), callibriUseFeedback(), callibriChangeEmails()),
                (h.expire_date = new Date().toString()),
                (a = JSON.stringify(h)),
                callibriSaveResponse(a),
                _callibri.init ||
                    ("v2" != _callibri.mv_version && ("v2" === _callibri.mv_version || void 0 === h.data.module_settings.tabs || null === h.data.module_settings.tabs)) ||
                    ((h = callibriSetLocalHooksUrl(h)), callibriWidgetStart());
        } else callibriSetItemLocalStorage("callibri_nct", "1");
        _callibri.module_settings &&
            _callibri.module_settings.changeable_tags &&
            _callibri.module_settings.changeable_tags.length > 0 &&
            "function" == typeof MutationObserver &&
            document.querySelectorAll(_callibri.module_settings.changeable_tags).forEach(function (a) {
                var b = !1,
                    c = new MutationObserver(function (a) {
                        a.forEach(function (a) {
                            b || ((b = !0), c.disconnect(), callibriInit(!1, !0), "function" == typeof callibriSetOutsideActions && _callibri.module_settings.tabs && callibriSetOutsideActions());
                        });
                    }),
                    d = { attributes: !0, childList: !0, characterData: !0 };
                c.observe(a, d);
            });
    } catch (a) {
        void 0 !== console ? console.log(a.stack) : window.console.log(a), callibriSendError(a, "callibriHandleResponse");
    }
    (_callibri.init = !0),
        callibriAfterResponse(),
        (_callibri.get_request = !1),
        callibriSetCookie("callibri_get_request", "", void 0, !0, -1),
        h &&
            h.data &&
            (h.data.clbvid && (callibriSetCookie("clbvid", h.data.clbvid, void 0, !1, 4e3), callibriFindSyncMarks()),
            h.data.required_file && !document.querySelector("script[name=CallibriRequiredFile]") && callibriGetLibrary(h.data.required_file, function () {}, "CallibriRequiredFile")),
        f &&
            (!(function (a) {
                var b = a.pushState;
                a.pushState = function (c) {
                    return "function" == typeof a.onpushstate && a.onpushstate({ state: c }), setTimeout(d, 1, arguments[2]), b.apply(a, arguments);
                };
            })(window.history),
            window.addEventListener("popstate", e));
}
function callibri_extend_ms(a) {
    var b = _callibri.module_settings && _callibri.module_settings.tabs,
        c = _callibri.module_settings && _callibri.module_settings.hooks_groups,
        d = _callibri.module_settings && _callibri.module_settings.catchers_groups,
        e = _callibri.module_settings && _callibri.module_settings.quiz_hook,
        f = _callibri.module_settings && _callibri.module_settings.lcatcher,
        g = _callibri.chat_operator;
    callibri_extend(_callibri, a.data);
    try {
        _callibri.init || callibriGetGuid(),
            b && (_callibri.module_settings.tabs = b),
            c && (_callibri.module_settings.hooks_groups = c),
            d && (_callibri.module_settings.catchers_groups = d),
            f && (_callibri.module_settings.lcatcher = f),
            e && (_callibri.module_settings.quiz_hook = e),
            g && (_callibri.chat_operator = g);
    } catch (a) {
        callibriSendError(a, "callibri_extend_ms");
    }
}
function callibriFindSyncMarks() {
    if ((_callibri.number && !_callibri.cookie_fbc && !_callibri.cookie_fbp && _callibri.use_facebook_pixel) || (_callibri.session_id && !_callibri.roistat && _callibri.use_roistat)) {
        var a = function (a) {
                for (var b = 0; b < a.length; b++) if (callibriGetCookie(a[b])) return !0;
                return !1;
            },
            b = function (a) {
                for (var b, c = a, d = "?pid=" + _callibri.site_id + "&sid=" + _callibri.session_id + "&cvid=" + _callibri.clbvid, e = d.slice(), f = 0; f < c.length; f++) {
                    b = c[f];
                    var g = "roistat_visit" == b,
                        h = "cookie" + (g ? "_" : "") + b;
                    _callibri[h] || (_callibri[h] = callibriGetCookie(b)), _callibri[h] && (d += "&" + (g ? "roistat" : b.replace("_", "")) + "=" + _callibri[h]);
                }
                var i = "callibri_" + c.join("_");
                callibriGetItemLocalStorage(i) || d == e || (callibriGetRequest("//minimo.callibri.ru/" + d), callibriSetItemStorage(i, d));
            },
            c = function (a) {};
        _callibri.use_facebook_pixel && ((window.clb_fb_pixel = ["_fbc", "_fbp"]), callibri_wait(window, "clb_fb_pixel", a, 200, 250, b, c)),
            _callibri.use_roistat && ((window.clb_roistat = ["roistat_visit"]), callibri_wait(window, "clb_roistat", a, 200, 250, b, c));
    }
}
function callibriWidgetStart() {
    var a = _callibri.widget_path;
    if (!a) {
        document.querySelector('script[src*="callibri-a.akamaihd.net"]') && (_callibri.cdn_host = "callibri-a.akamaihd.net");
        var b = "v2" === _callibri.mv_version ? "/widget_v2.min.js" : "/widget.min.js";
        a = "//" + _callibri.cdn_host + b;
    }
    callibriGetLibrary(
        a,
        function () {
            callibriInitWidget();
        },
        "callibriWidget"
    );
}
function callibriUseFeedback() {
    _callibri.use_feedback && (_callibri.form_parser ? _callibri.form_parser.init() : (_callibri.form_parser = new CallibriFormParser()));
}
function callibriCollectionHas(a, b) {
    for (var c = 0; c < a.length; c++) if (a[c] == b) return !0;
    return !1;
}
function callibriFindParentSelector(a, b) {
    for (var c = document.querySelectorAll(b), d = a.parentNode; d && !callibriCollectionHas(c, d); ) d = d.parentNode;
    return d;
}
function callibriRemoveClass(a, b) {
    for (var c = 0; c < a.length; c++) a[c].className.toString().match(b) && (a[c].className = a[c].className.replace(b, ""));
}
function callibriSetPseudoLink(a) {
    for (var b, c = document.querySelectorAll(a.element), d = c.length, e = 0; e < d; e++)
        (b = c[e]),
            b.dataset.callibri_pseudo_link ||
                ((b.dataset.callibri_pseudo_link = !0),
                b.addEventListener(
                    "click",
                    function (b) {
                        if ((callibriChangeElement(b.target, a.format, a.element, _callibri.number), callibriReplacePhones(), "function" == typeof MutationObserver && !b.target.dataset.callibri_obs)) {
                            b.target.dataset.callibri_obs = !0;
                            var c = new MutationObserver(function (c) {
                                    c.forEach(function (c) {
                                        "href" !== c.attributeName && (callibriChangeElement(b.target, a.format, a.element, _callibri.number), callibriReplacePhones());
                                    });
                                }),
                                d = { attributes: !0 };
                            c.observe(b.target, d);
                        }
                    },
                    !1
                ));
}
function callibriChangeElement(a, b, c, d, e) {
    e || (e = callibriFormatOriginalNumber(d, b)), c.match(/\[href\*=tel\]/) || (a.innerHTML = e), "A" === a.tagName && (a.href.match(/^tel\:/i) ? (a.href = "tel:+" + d) : a.href.match(/^callto\:/i) && (a.href = "callto:+" + d));
}
function callibriFormatOriginalNumber(a, b) {
    a = a.substr(1);
    try {
        a = callibriFormatPhone(a, b);
    } catch (b) {
        a = callibriFormatPhone(a, "+7 (#{XXX}) #{XXX}-#{XX}-#{XX}");
    }
    return a;
}
function callibriSetValueToBlocksByClass(a, b, c) {
    try {
        if (void 0 !== b && "" !== b) {
            b.match(/^(7800)|(7804)/) && (c = c.replace("+7", "8"));
            var d = b;
            b = callibriFormatOriginalNumber(b, c);
            for (var e = document.querySelectorAll(a), f = 0; f < e.length; f++) "IMG" === e[f].tagName ? callibriChangeImage(e[f], b, !1) : callibriChangeElement(e[f], c, a, d, b);
        }
    } catch (a) {}
}
function callibriChangeImage(a, b, c) {
    var d = new Image(),
        e = _callibri.site_id.toString() + "_" + _callibri.number + "_default.png",
        f = document.location.protocol + "//callibri.ru/system/customs_sites_imgs/" + e;
    (d.onerror = d.onabort = function () {
        a.innerHTML = b;
    }),
        (d.onload = function () {
            (a.src = f), (a.alt = b);
        }),
        (d.src = f);
}
function callibriFormatPhone(a, b) {
    if ("undefined" != typeof callibri_numbers_format)
        for (var c in callibri_numbers_format)
            if (0 == a.indexOf(c)) {
                b = callibri_numbers_format[c];
                break;
            }
    for (var d = "", e = b.match(/#{(X)+}/gi), f = b, g = 0; g < e.length; g++) (f = f.replace(/#{(X)+}/i, "$$" + (g + 1))), (d += "(" + e[g].slice(2, -1).replace(/(X)/gi, "\\d") + ")");
    return (d = new RegExp(d)), a.replace(d, f);
}
function callibriBindReady(a) {
    function b() {
        try {
            document.documentElement.doScroll("left"), a();
        } catch (a) {
            setTimeout(b, 10);
        }
    }
    if ("loading" !== document.readyState) return void a();
    if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, !1);
    else if (document.attachEvent) {
        var c;
        try {
            c = null !== window.frameElement;
        } catch (a) {}
        document.documentElement.doScroll && !c && b(),
            document.attachEvent("onreadystatechange", function () {
                "interactive" === document.readyState && a();
            });
    } else if (window.addEventListener) window.addEventListener("load", a, !1);
    else if (window.attachEvent) window.attachEvent("onload", a);
    else {
        var d = window.onload;
        window.onload = function () {
            d && d(), a();
        };
    }
}
function callibri_extend(a, b) {
    for (var c in b) a[c] = b[c];
    return a;
}
function callibriCheckIE8_9() {
    return !!navigator.userAgent.match(/(MSIE 9\.0)|(MSIE 8\.0)/);
}
function callibriCheckIE8_9_10_11() {
    return !!(navigator.userAgent.match(/(MSIE 10\.0)|(MSIE 9\.0)|(MSIE 8\.0)/) || navigator.userAgent.indexOf("Trident/7.0") > -1);
}
function callibriCheckIE8_9_10() {
    return !!navigator.userAgent.match(/(MSIE 10\.0)|(MSIE 9\.0)|(MSIE 8\.0)/);
}
function callibriCheckIE8() {
    return !!navigator.userAgent.match(/(MSIE 8\.0)/);
}
function callibriCheckOperaMini() {
    return !!/opera mini/i.test(navigator.userAgent);
}
function callibriCheckIE10_11_Edge() {
    return !!(navigator.userAgent.match(/(MSIE 10\.0)/) || navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1);
}
function callibriSendError(a, b, c, d) {
    _callibri.debug && window.console.log(a);
}
function callibriReachGoal(a, b) {
    for (var c, d = a.length, e = 0; e < d; e++) (c = a[e]), b.reachGoal(c.name);
}
function callibriGetMetrikaClientID(a) {
    return _callibri.ya_client_id ? _callibri.ya_client_id : (_callibri.use_guid && !callibriGetCookie("callibri_ym_wait") && callibriSetCookie("callibri_ym_wait", "true", void 0, !0, 10), null);
}
function callibriGetCalltouchSessionId(a, b) {
    return ["/module/messages", "/module/contactus", "/module/callibri_callback", "/widget/catcher_message"].indexOf(b) < 0
        ? a
        : (_callibri.calltouch_session_id
              ? (a.calltouch = _callibri.calltouch_session_id)
              : _callibri.calltouch_site_id && !callibriGetCookie("callibri_calltouch_wait") && callibriSetCookie("callibri_calltouch_wait", "true", void 0, !0, 10),
          a);
}
function callibriGetGaClientID(a) {
    return _callibri.ga_client_id ? _callibri.ga_client_id : (_callibri.use_guid && !callibriGetCookie("callibri_ga_wait") && callibriSetCookie("callibri_ga_wait", "true", void 0, !0, 10), null);
}
function callibri_wait(a, b, c, d, e, f, g) {
    var h = "callibri_await_";
    if (!a[h + b + "_completed"]) {
        var i = function () {
            a[h + b + "_completed"] || ((a[h + b + "_completed"] = !0), a[h + b] && a[h + b].timer && (clearInterval(a[h + b].timer), (a[h + b] = null)), f(a[b]));
        };
        a[b] && g
            ? c(a[b])
                ? i()
                : (g(i),
                  setTimeout(function () {
                      callibri_wait(a, b, c, d, e, f);
                  }, 0))
            : c(a[b])
            ? i()
            : a[h + b] ||
              (a[h + b] = {
                  timer: setInterval(function () {
                      (c(a[b]) || e < ++a[h + b].attempt) && i();
                  }, d),
                  attempt: 0,
              });
    }
}
function callibriSendYa(a) {
    var b = function (a) {
        if (a && 0 !== a.indexOf("amp-") && ((_callibri.ya_client_id = a), (_callibri.dynamic || callibriGetCookie("callibri_ym_wait")) && !callibriGetItemLocalStorage("callibri_ya_client_id"))) {
            var b = "?pid=" + _callibri.site_id + "&sid=" + _callibri.session_id + "&cvid=" + _callibri.clbvid;
            (b += "&yaclientid=" + _callibri.ya_client_id),
                callibriGetRequest("//minimo.callibri.ru/" + b),
                callibriSetCookie("callibri_ym_wait", "", void 0, !0, -1),
                callibriSetItemLocalStorage("callibri_ya_client_id", _callibri.ya_client_id);
        }
    };
    if ("function" == typeof window.ym) {
        ym(_callibri.metrika.counter_id, "getClientID", b);
        var c = [{ callibri_session: _callibri.guid_key.toString() }];
        return _callibri.clbvid && c.push({ clbvid: _callibri.clbvid }), void ym(_callibri.metrika.counter_id, "params", c);
    }
    var d = a && a.getClientID;
    if (d || callibriGetCookie("_ym_uid"))
        if (d) b(a.getClientID()), a.params("callibri_session", _callibri.guid_key.toString()), _callibri.clbvid && a.params("clbvid", _callibri.clbvid);
        else {
            var e = callibriGetCookie("_ym_uid");
            e && b(e);
        }
}
function callibriSendCalltouch() {
    if ("function" != typeof window.ct);
    else {
        var a = window.ct("calltracking_params");
        if (!a) return !0;
        var b = a.filter(function (a) {
            return a.siteId == _callibri.calltouch_site_id;
        })[0];
        if (((current_counter_value = b ? b.sessionId : null), !current_counter_value)) return;
        if (((_callibri.calltouch_session_id = current_counter_value), (_callibri.dynamic || callibriGetCookie("callibri_calltouch_wait")) && !callibriGetItemLocalStorage("callibri_calltoucht_session_id"))) {
            var c = "?pid=" + _callibri.site_id + "&sid=" + _callibri.session_id + "&cvid=" + _callibri.clbvid;
            (c += "&calltouch=" + current_counter_value),
                callibriGetRequest("//minimo.callibri.ru/" + c),
                callibriSetCookie("callibri_calltouch_wait", "", void 0, !0, -1),
                callibriSetItemLocalStorage("callibri_calltoucht_session_id", _callibri.calltouch_session_id);
        }
    }
}
function callibriGetGuid() {
    if (_callibri.metrika) {
        var a = function (a) {
                return !!("function" == typeof window.ym || (a && a.getClientID) || callibriGetCookie("_ym_uid"));
            },
            b = function (a) {
                document.addEventListener("yacounter" + _callibri.metrika.counter_id + "inited", a);
            };
        callibri_wait(window, "yaCounter" + _callibri.metrika.counter_id, a, 50, 250, callibriSendYa, b);
    }
    if ((_callibri.google_analytics4 && callibriGoogleV4Clientid(), _callibri.calltouch_site_id)) {
        var a = function (a) {
            return !("function" != typeof window.ct || !window.ct("calltracking_params"));
        };
        callibri_wait(window, "calltouch", a, 50, 250, callibriSendCalltouch);
    }
    if (_callibri.use_guid) {
        _callibri.ga = "ga_ckpr" == window.GoogleAnalyticsObject ? "ga" : window.GoogleAnalyticsObject;
        var c = function (a) {
                return !!((a && a.getAll) || callibriGetCookie("_ga"));
            },
            d = function (a) {
                try {
                    if (
                        ((a && a.getAll) || !callibriGetCookie("_ga") ? (_callibri.ga_client_id = a.getAll()[0].get("clientId")) : (_callibri.ga_client_id = callibriGetCookie("_ga").replace(/GA\d+\.\d+\./, "")),
                        (_callibri.dynamic || callibriGetCookie("callibri_ga_wait")) && !callibriGetItemLocalStorage("callibri_ga_client_id"))
                    ) {
                        var b = "?pid=" + _callibri.site_id + "&sid=" + _callibri.session_id + "&cvid=" + _callibri.clbvid;
                        (b += "&gaclientid=" + _callibri.ga_client_id),
                            callibriGetRequest("//minimo.callibri.ru/" + b),
                            callibriSetCookie("callibri_ga_wait", "", void 0, !0, -1),
                            callibriSetItemLocalStorage("callibri_ga_client_id", _callibri.ga_client_id);
                    }
                    if (_callibri.ga_goals && _callibri.ga_goals.dimension) {
                        var c = "dimension" + _callibri.ga_goals.dimension.toString(),
                            d = "dimension" + (_callibri.ga_goals.dimension + 1).toString();
                        a("set", c, _callibri.guid_key), a("set", d, _callibri.ga_client_id), a("set", "&uid", _callibri.ga_client_id);
                    }
                } catch (a) {
                    callibriSendError(a, "callibriSendGa");
                }
            },
            e = function (a) {
                window[_callibri.ga](function () {
                    a(window[_callibri.ga]);
                });
            };
        callibri_wait(window, _callibri.ga, c, 200, 250, d, e);
    }
}
function callibriGoogleV4Clientid() {
    var a = function (a) {
            return !("function" != typeof a && !callibriGetCookie("_ga"));
        },
        b = function (a) {
            try {
                var b = a + "_ga",
                    c = function (a) {
                        if (a && (_callibri.dynamic || callibriGetCookie("callibri_ga4_wait")) && !callibriGetItemLocalStorage("callibri_ga4_client_id")) {
                            _callibri[b] = a;
                            var c = "?pid=" + _callibri.site_id + "&sid=" + _callibri.session_id + "&cvid=" + _callibri.clbvid;
                            (c += "&gaclientid=" + _callibri[b]),
                                callibriGetRequest("//minimo.callibri.ru/" + c),
                                callibriSetCookie("callibri_ga4_wait", "", void 0, !0, -1),
                                callibriSetItemLocalStorage("callibri_ga4_client_id", _callibri[b]);
                        }
                    };
                if ("function" == typeof a) return void a("get", _callibri.google_analytics4, "client_id", c);
                callibriGetCookie("_ga") && c(callibriGetCookie("_ga").replace(/GA\d+\.\d+\./, ""));
            } catch (a) {
                callibriSendError(a, "callibriSendGa4");
            }
        },
        c = function (a) {};
    callibri_wait(window, "gtag", a, 200, 250, b, c);
}
function callibriChangeEmails() {
    var a = [];
    if (
        (_callibri.module_settings &&
            _callibri.module_settings.email_elements &&
            (a = "string" == typeof _callibri.module_settings.email_elements ? JSON.parse(_callibri.module_settings.email_elements) : _callibri.module_settings.email_elements),
        0 != a.length && _callibri.session_id)
    ) {
        var b = callbriGetSubstituteEmail();
        if (b) {
            var c,
                d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l = a.length;
            for (g = 0; g < l; g++) for (f = a[g], c = document.querySelectorAll(f), e = c.length, h = 0; h < e; h++) (d = c[h]), callibriChangeEmailDOMElement(d, b);
            if (_callibri.copies_emails)
                for (l = _callibri.copies_emails.length, i = 0; i < l; i++)
                    for (k = _callibri.copies_emails[i], j = k.elements.length, g = 0; g < j; g++)
                        for (f = k.elements[g].element, c = document.querySelectorAll(f), e = c.length, h = 0; h < e; h++) (d = c[h]), callibriChangeEmailDOMElement(d, k.email);
        }
    }
}
function callbriGetSubstituteEmail() {
    var a;
    return _callibri.email ? (a = _callibri.email) : -1 != ["archive", "nolimit"].indexOf(_callibri.module_settings.email_type) && (a = _callibri.site_id.toString() + "-" + Number(_callibri.session_id).toString(36) + "@dr-mail.com"), a;
}
function callibriChangeEmailDOMElement(a, b) {
    if (
        ((a.innerHTML = a.innerHTML.replace(/([Р°-СЏРђ-РЇa-zA-Z0-9._-]+@[Р°-СЏРђ-РЇa-zA-Z0-9._-]+\.[Р°-СЏРђ-РЇa-zA-Z0-9._-]+)/gi, b)),
        "A" === a.tagName && 0 == a.href.indexOf("mailto") && (a.href = "mailto:" + b),
        b && _callibri.dynamic && !a.dataset.callibri_email)
    ) {
        a.dataset.callibri_email = b;
        var c = _callibri.mobile.isMobile ? "touchstart" : "mouseup";
        a.addEventListener(c, function (a) {
            callibriMakeRequest("/module/click", { session_id: _callibri.session_id, client_id: _callibri.site_id, key: a.target.dataset.callibri_email, event_type: "email", clbvid: _callibri.clbvid }),
                a.target.removeEventListener(a.type, arguments.callee, !0);
        });
    }
    return a;
}
function callibriGetLibrary(a, b, c, d) {
    if ("CallibriLidCatcher" === c || "callibri_rating" === c) return void callibriLoadLibraryFromScript(a, b, c, d);
    var e = "function" == typeof requirejs && "function" == typeof define;
    (_callibri.module_settings && _callibri.module_settings.requirejs) ||
        "function" != typeof requirejs ||
        !(function (a, b) {
            for (var c, d, e = a.split("."), f = b.split("."), g = Math.max(e.length, f.length), h = 0, i = 0; i < g && !h; i++) (c = parseInt(e[i], 10) || 0), (d = parseInt(f[i], 10) || 0), c < d && (h = 1), c > d && (h = -1);
            return -1 != h;
        })("2.1.13", requirejs.version) ||
        (e = !1);
    var f = callibriGetCookie("callibri_requirejs");
    if (e)
        requirejs([a], function (a) {
            (window[c] = a), b();
        }),
            callibriSetCookie("callibri_requirejs", "true");
    else {
        if (f)
            return void setTimeout(function () {
                callibriGetLibrary(a, b, c);
            }, 1e3);
        callibriLoadLibraryFromScript(a, b, c, d);
    }
}
function callibriLoadLibraryFromScript(a, b, c, d) {
    var e = document.getElementsByTagName("head")[0],
        f = document.createElement("script");
    f.setAttribute("charset", "utf-8"),
        f.setAttribute("type", "text/javascript"),
        f.setAttribute("src", a),
        f.setAttribute("name", c),
        (window["done_script_" + c] = !1),
        (f.onload = f.onreadystatechange = function () {
            var a = "done_script_" + this.getAttribute("name");
            window[a] || (this.readyState && "loaded" != this.readyState && "complete" != this.readyState) || ((window[a] = !0), b());
        }),
        "function" == typeof d && (f.onerror = d),
        e.appendChild(f);
}
function callibriGetRequest(a, b) {
    var c = callibriXhrRequest();
    c &&
        (c.open("GET", a, !0),
        b &&
            (c.onreadystatechange = function () {
                b(c);
            }),
        c.send());
}
function callibriLoadContentCallback(a, b, c) {
    if (a) {
        callibriCheckIE8_9_10_11() || !Object.assign || !Array.from || callibriCheckOperaMini()
            ? callibriGetLibrary("//cdn.callibri.ru/ie_polyfills.min.js", function () {
                  callibriHandleResponse(a, b, c);
              })
            : callibriHandleResponse(a, b, c);
        callibriBindReady(function () {
            _callibri.stop_init || (!_callibri.only_widget && _callibri.number && (callibriReplacePhones(), callibriReplaceCopiesPhones()), callibriUseFeedback(), callibriChangeEmails());
        });
    }
}
function callibriAfterResponse() {
    if (!_callibri.feedback_send) {
        _callibri.feedback_send = !0;
        var a = callibriGetItemLocalStorage("callibri_feedbacks");
        if ((callibriSetItemLocalStorage("callibri_feedbacks", ""), a && _callibri.init)) {
            a = JSON.parse(a);
            for (var b, c, d, e, f = 0; f < a.length; f++) {
                (c = a[f].split("-;-")), (b = { feedback: { session_id: _callibri.session_id, number: _callibri.number } });
                for (var g = 0; g < c.length; g++) (feed = c[g].split("-:-")), feed.length > 0 && ((d = feed[0]), (e = feed[1]), (b.feedback[d] = e));
                callibriMakeRequest("/module/contactus", b, null, null, _callibri.api_server_host);
            }
            callibriSetItemLocalStorage("callibri_feedbacks", "");
        }
    }
}
function callibriSetCookiePrefix() {
    "string" == typeof callibri_cookie_prefix
        ? ((_callibri.cookie_prefix = callibri_cookie_prefix + "_"), (_callibri.allow_subdomains = !1))
        : ((_callibri.cookie_prefix = "v1_"), _callibri.unified_domain && (_callibri.cookie_prefix += _callibri.unified_domain + "_"));
}
function callibriGetSessionCookie() {
    var a = callibriGetCookie(_callibri.cookie_prefix + "sessions_callibri") || null;
    return a || "v1_" == _callibri.cookie_prefix || (a = callibriGetCookie("v1_sessions_callibri") || null), a;
}
function callibriInit(a, b) {
    try {
        var c = callibriGetCookie("callibri_get_request"),
            d = new Date().valueOf();
        if (_callibri.get_request || (c && (d - Number(c)) / 1e3 < 30))
            return void (
                _callibri.get_request ||
                ((_callibri.get_request = !0),
                supports_callibri_storage() &&
                    window.addEventListener("storage", function (a) {
                        _callibri.stop_init || ("callibri" != a.key && "callibri_module_settings" != a.key) || !a.newValue || a.oldValue === a.newValue || (clearTimeout(window.callibri_get_request_timeout), callibriInit());
                    }),
                (callibri_get_request_timeout = setTimeout(function () {
                    (_callibri.get_request = !1), callibriInit(a, b);
                }, 3e3)))
            );
        (_callibri.get_request = !0),
            callibriSetCookie("callibri_get_request", d, void 0, !0),
            _callibri.mobile || (_callibri.mobile = {}),
            (_callibri.mobile.isMobile = !1),
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobi/i.test(navigator.userAgent) && ((_callibri.mobile.isMobile = !0), (_callibri.mobile.iPhone = !!/iPhone/i.test(navigator.userAgent))),
            callibriSetCookiePrefix(),
            (_callibri.version = "1563955557"),
            _callibri.server_host || (_callibri.server_host = "in.callibri.ru"),
            _callibri.cdn_host || (_callibri.cdn_host = "cdn.callibri.ru"),
            _callibri.module_host || (_callibri.module_host = "module.callibri.ru"),
            _callibri.ws_server_host || (_callibri.ws_server_host = "ws.callibri.ru"),
            _callibri.api_server_host || (_callibri.api_server_host = "api.callibri.ru");
        var e,
            f,
            g = 0;
        (e = _callibri.objects.callibri), (e.oid = "callibri"), e.format || (e.format = "+7 (#{XXX}) #{XXX}-#{XX}-#{XX}"), e.block_class || (e.block_class = "callibri_phone");
        var h = callibriGetSessionCookie();
        callibriFlushTempStorage();
        var i,
            j = callibriGetResponse(),
            k = new RegExp("^https?://" + document.domain),
            l = callibriGetCookie(_callibri.cookie_prefix + "referrer_callibri"),
            m = document.referrer,
            n = callibriGetItemLocalStorage(_callibri.cookie_prefix + "landing_callibri"),
            o = document.location.search && document.location.search.match(/utm_referrer=([^&]*)(&|$)/);
        if (o && o[1] && 0 !== o[1].indexOf("?"))
            try {
                m = decodeURIComponent(o[1]);
            } catch (a) {
                m = document.referrer;
            }
        var p = !1 === l;
        !1 === l && ((l = m), callibriSetCookie(_callibri.cookie_prefix + "referrer_callibri", l), callibriSetItemLocalStorage(_callibri.cookie_prefix + "search_callibri", i)),
            (i = document.location.search || ""),
            document.location.hash && document.location.hash.match("=") && (i += document.location.hash.replace(/^#/, i ? "&" : "?"));
        var q = a ? callibriLoadContentCallback : callibriHandleResponse;
        if (m && m.match(k)) {
            if (!h && !1 === p) {
                if (callibriGetItemLocalStorage("callibri_nct")) return;
                if ((f = callibriGetItemLocalStorage("callibri_request_send"))) return (f = JSON.parse(f)), void callibriMakeRequest("/module/number", f, q, "application/json", _callibri.module_host, 6e4);
                var r = m.split("?")[1];
                r && (i = "?" + r);
            }
        } else if ((n != window.location.href && callibriSetItemLocalStorage(_callibri.cookie_prefix + "landing_callibri", window.location.href), !b)) {
            var r = callibriGetItemLocalStorage(_callibri.cookie_prefix + "search_callibri"),
                s = l == m && i && i != r && i.match(/(\?utm_)|(&utm_)|(yclid=)|(gclid=)|(_openstat=)|(city=)/);
            (s || l != m || (n || "").replace(/\?.+/, "") != window.location.href.replace(/\?.+/, "")) &&
                ((j = ""), (l = m), (n = window.location.href), callibriFlushResponse(!0), callibriSetCookie(_callibri.cookie_prefix + "referrer_callibri", l), callibriSetItemLocalStorage(_callibri.cookie_prefix + "search_callibri", i));
        }
        if (
            navigator.userAgent
                .toLowerCase()
                .match(
                    "(StackRambler)|(googlebot)|(AdsBot-Google)|(APIs-Google)|(Mediapartners-Google)|(Google Page Speed)|(YandexBot)|(\\+https?:\\/\\/yandex.com\\/bots)|(\\+https?:\\/\\/www.google.com\\/bot.html)|(AdsBot-Google)|(AhrefsBot)|(aport)|(Slurp)|(msnbot)|(\\+https?:\\/\\/go.mail.ru\\/help\\/robots)|(yaDirectBot)|(yetibot)|(\\+https?:\\/\\/www\\.picsearch\\.com\\/bot\\.html)|(sape.bot)|(sape_context)|(gigabot)|(snapbot)|(qwartabot)|(aboutusbot)|(oozbot)|(bingbot)|(\\+https?:\\/\\/www\\.bing\\.com\\/bingbot\\.htm)|(SimplePie)|(SiteLockSpider)|(okhttp)|(ips-agent)|(BLEXBot)|(yanga.co.uk)|(scoutjet)|(similarpages)|(shrinktheweb.com)|(followsite.com)|(dataparksearch)|(feedfetcher-google)|(liveinternet.ru)|(xml-sitemaps.com)|(agama)|(metadatalabs.com)|(h1.hrn.ru)|(googlealert.com)|(seo-rus.com)|(Copyscape.com)|(domaintools.com)|(Nigma.ru)|(dotnetdotcom)|(alexa.com)|(megadownload.net)|(askpeter.info)|(igde.ru)|(ask.com)|(Questok.Ru bot)|(DnyzBot)|(SMTBot)|(PR-CY.RU)|(Baiduspider)|(Sogou web spider)|(Google-Adwords-DisplayAds-WebRender)|(Pulsepoint XT3 web scraper)|(vkShare)".toLowerCase()
                ) ||
            (i && i.match(/(\{STYPE\})|(\{SRC\})|(\{PTYPE\})|(\{POS\})|(\{PARAM127\})|(\{PHRASE\})|(%7BSTYPE%7D)|(%7BSRC%7D)|(%7BPTYPE%7D)|(%7BPOS%7D)|(%7BPARAM127%7D)|(%7BPHRASE%7D)/))
        )
            return;
        if (((_callibri.exists_url = !!callibriGetItemLocalStorage("callibri_hooks_urls") || null), _callibri.exists_url))
            try {
                var t = callibriGetItemLocalStorage("callibri_hooks_urls_timestamp"),
                    u = new Date(),
                    v = new Date(t),
                    g = v.getTime ? (u - v) / 1e3 / 60 : 60;
                _callibri.exists_url = g < 60 || null;
            } catch (a) {
                _callibri.exists_url = null;
            }
        f = {
            uid: document.domain,
            session_id: h,
            search: i,
            referrer: l,
            landing: document.location.href,
            exists_url: _callibri.exists_url,
            exists_cookie_lid_catcher: !!callibriGetCookie("callibri_catcher_was_shown") || null,
            clbvid: callibriGetCookie("clbvid") || null,
        };
        var w = callibriGetCookie("callibri_page_segment");
        w && (f.page_segment = w), _callibri.unified_domain && (f.unified_domain = _callibri.unified_domain);
        for (var x, y = ["_fbc", "_fbp"], z = 0; z < y.length; z++) (x = y[z]), (_callibri["cookie" + x] = callibriGetCookie(x)), _callibri["cookie" + x] && (f[x] = _callibri["cookie" + x]);
        try {
            if (j) {
                json = JSON.parse(j);
                var u = new Date(),
                    v = new Date(json.expire_date);
                (g = v.getTime ? (u - v) / 1e3 / 60 : 10), (_callibri.load_chat_history = callibriGetCookie(_callibri.cookie_prefix + "callibri_chat_history"));
            } else _callibri.load_chat_history = null !== f.session_id;
            if (j && g < 10)
                if (json.data.module_settings) q(j, 200, !0);
                else {
                    var A;
                    if ((supports_callibri_storage() && (A = localStorage.getItem("callibri_module_settings")), A)) (json.data.module_settings = JSON.parse(A)), (j = JSON.stringify(json)), q(j, 200, !0);
                    else {
                        var B = function (a) {
                            var b = callibriGetResponse();
                            if (a && b) {
                                (json = JSON.parse(b)), (json.data.module_settings = JSON.parse(a)), (json.data.module_settings.timestamp = new Date().valueOf());
                                try {
                                    localStorage.setItem("callibri_module_settings", JSON.stringify(json.data.module_settings));
                                } catch (a) {}
                                b = JSON.stringify(json);
                            }
                            if (b) {
                                ("complete" !== document.readyState ? callibriLoadContentCallback : callibriHandleResponse)(b, 200, !0);
                            }
                        };
                        callibriMakeRequest("/module/site_settings", { site_id: json.data.site_id, session_id: json.data.key }, B, null, _callibri.module_host);
                    }
                }
            else callibriFlushResponse(), callibriSetItemStorage("callibri_request_send", JSON.stringify(f)), callibriMakeRequest("/module/number", f, q, "application/json", _callibri.module_host, 6e4);
        } catch (a) {
            callibriMakeRequest("/module/number", f, q, "application/json", _callibri.module_host, 6e4);
        }
    } catch (a) {
        void 0 !== console ? console.log(a.stack) : window.console.log(a), console, callibriSendError(a, "callibriInit");
    }
    "function" == typeof callibriEtagiStartForm && callibriEtagiStartForm(0);
}
function CallibriSendForm(a, b, c, d, e) {
    var f = {};
    f.feedback = {
        name: "",
        phone: "",
        email: "",
        message: "",
        client_id: _callibri.site_id,
        number: _callibri.number,
        session_id: _callibri.session_id,
        page: document.location.protocol + "//" + document.location.host + document.location.pathname,
    };
    var g = f.feedback;
    return (
        a && (g.phone = callibriSetCorrectPhone(a)),
        b && (g.email = b),
        c && (g.name = c),
        d && (g.message = d),
        e && (g.form_name = e),
        !(!CallibriFormParser.prototype.validate_phone_email(f) || !_callibri.session_id) && (callibriMakeRequest("/module/contactus", f, null, null, _callibri.api_server_host), !0)
    );
}
function callibriValidEmail(a) {
    return /^(([^\uE000-\uF8FF\uD83C\uDC00-\uDFFF\uD83D\uDC00-\uDFFF\u2011-\u26FF\uD83E\uDD10-\uDDFFРђ-РЇР°-СЏ<>()\[\]\\.,;:\s@"]+(\.[^\uE000-\uF8FF\uD83C\uDC00-\uDFFF\uD83D\uDC00-\uDFFF\u2011-\u26FF\uD83E\uDD10-\uDDFFРђ-РЇР°-СЏ<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|((([a-zA-Z\-0-9]|[Рђ-РЇР°-СЏ\-0-9])+\.)+([a-zA-Z]{2,}|[Рђ-РЇР°-СЏ]{2,})))$/.test(
        String(a).toLowerCase()
    );
}
function callibriValidPhone(a) {
    return !(!a || a.length < 10 || a.length > 12 || !a.substring(2).match(/^(\d)\1*(?!\1)(\d)+$/g));
}
function callibriSetCorrectPhone(a) {
    return !!a && ((a = a.toString().replace(/\D/g, "")), 10 == a.length && (a = "7" + a), a);
}
function callibri_group_check(a, b) {
    function c(a) {
        for (var b = 0, c = Object.keys(a), f = 0; f < c.length; f++) {
            var g = c[f];
            a[g].some(function (a) {
                var c = a ? e.substring(0, a.length) : "false";
                if (
                    (a.indexOf("*") > -1 ? ((a = a.replace(/\*/gi, ".*")), ("=" != g && "^" != g) || ((a = "^" + a), "=" == g && (a += "$")), (g = "~"), (a = new RegExp(a))) : 0 === a.indexOf("?") && (a = a.slice(1)),
                    ">" == g && d.href.indexOf(a) > -1)
                )
                    b++;
                else if ("^" == g && c == a) b++;
                else if ("=" == g) {
                    var f = a.indexOf("?") > -1 ? e : e.replace(d.search, "");
                    (f = "/" == f[f.length - 1] ? f.substring(0, f.length - 1) : f), (a = "/" == a[a.length - 1] ? a.substring(0, a.length - 1) : a), f == a && b++;
                } else {
                    if ("~" != g || !e.match(a)) return;
                    b++;
                }
                return b;
            });
        }
        return b == c.length;
    }
    b || (b = document.location);
    var d = b,
        e = d.href.replace(b.protocol + "//", "");
    e = "www." == e.substring(0, 4) ? e.substring(4, e.length) : e;
    bool_include = bool_start = !1;
    return !(a.no_url_conditions && Object.keys(a.no_url_conditions).length > 0 && c(a.no_url_conditions)) && (!(a.url_conditions && Object.keys(a.url_conditions).length > 0) || c(a.url_conditions));
}
function callibri_add_roistat_mark(a) {
    if (!_callibri.use_roistat) return a;
    var b = _callibri.cookie_roistat_visit;
    return b || (b = callibriGetCookie("roistat_visit")), b ? ((a.roistat = b), a) : a;
}
function callibriAddTimezoneData(a, b) {
    if (["/module/messages", "/module/contactus", "/module/callibri_callback", "/widget/catcher_message"].indexOf(b) < 0) return a;
    var c = callibriGetTimezone();
    return (a.timezone_name = c.timezone_name), (a.timezone_offset = c.timezone_offset), a;
}
function callibriGetTimezone() {
    var a = 60 * new Date().getTimezoneOffset() * -1,
        b = "";
    try {
        b = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (a) {}
    return { timezone_offset: a, timezone_name: b };
}
if (!_callibri) var _callibri = { objects: { callibri: { block_class: "callibri_phone", format: "+7 (#{XXX}) #{XXX}-#{XX}-#{XX}" } } };
_callibri.objects || (_callibri.objects = { callibri: { block_class: "callibri_phone", format: "+7 (#{XXX}) #{XXX}-#{XX}-#{XX}" } }),
    (CallibriFormParser = function () {
        this.init();
    }),
    (CallibriFormParser.prototype = {
        init: function () {
            _callibri.use_feedback &&
                ((this.custom_forms = _callibri.feedback_settings.feedback_settings && void 0 === _callibri.feedback_settings.feedback_settings.length),
                this.setup_form(),
                this.setup_modal_forms(),
                this.iframe_message(),
                (this.init_parser = !0));
        },
        search_form: function () {
            var a = {};
            if (this.custom_forms) for (form_key in _callibri.feedback_settings.feedback_settings) a[form_key] = document.querySelectorAll(form_key);
            else a = { 0: document.querySelectorAll('form:not([data_form^="callibri"]):not([id^="callibri"]),.modal,#forma') };
            return a;
        },
        search_inputs: function (a, b) {
            var c,
                d = [];
            for (var e in b)
                if ("button" !== e) {
                    c = b[e];
                    try {
                        element = a.querySelector(c);
                    } catch (a) {
                        element = null;
                    }
                    element && d.push(element);
                }
            return d;
        },
        valid_form: function (a) {
            if ("FORM" === a.tagName || 0 === a.querySelectorAll("form").length || "forma" === a.id) {
                var b = a.querySelectorAll("input[type='password']");
                if (a.getAttribute("action") && a.getAttribute("action").split("?")[0].indexOf("search") > -1) return !1;
                if (0 === b.length) return !0;
            }
            return !1;
        },
        init_submit_form: function (a, b) {
            (_callibri.module_settings && _callibri.module_settings.only_button_click) || ((a = this.is_form(a)) && ((a.dataset.callibri_parse_form = 0 == b || b), a.addEventListener("submit", CallibriFormParser.prototype.send_form, !0)));
        },
        setup_form: function () {
            var a,
                b,
                c,
                d,
                e,
                f,
                g,
                h,
                i,
                j = this.search_form();
            for (form_key in j)
                for (a = j[form_key], h = 0 == form_key ? null : _callibri.feedback_settings.feedback_settings[form_key], b = a.length, f = 0; f < b; f++)
                    if (((e = a[f]), !e.dataset.callibri_parse_form && (0 != form_key || this.valid_form(e)))) {
                        if (((i = this.get_buttons(e, h)), (submit_buttons_length = i.length), submit_buttons_length > 0)) for (g = 0; g < submit_buttons_length; g++) (submit_button = i[g]), this.init_button(submit_button, h, form_key);
                        if (
                            (this.init_submit_form(e, form_key),
                            this.custom_forms && (c = this.search_inputs(e, h)) && c.length > 0 && ((e.dataset.callibri_parse_form = 0 == form_key || form_key), 0 === e.querySelectorAll("*[data-callibri_parse_form]").length))
                        )
                            for (inputs_length = c.length, g = 0; g < inputs_length; g++) (d = c[g]), d.addEventListener("blur", CallibriFormParser.prototype.send_form, !0), (d.dataset.callibri_parse_input = form_key);
                        _callibri.module_settings.keydown_form &&
                            e.addEventListener("keydown", function (a) {
                                ("Enter" !== a.key && 13 != a.which && 13 != a.keyCode) || CallibriFormParser.prototype.send_form(a);
                            });
                    }
        },
        get_buttons: function (a, b) {
            var c;
            return (
                this.custom_forms && ((button_selector = b.button), button_selector && (c = a.querySelectorAll(button_selector))),
                c ||
                    ((c =
                        a.querySelectorAll("input[type='submit']")[0] ||
                        a.querySelectorAll("button[type='submit']")[0] ||
                        a.querySelectorAll("button[id*=submit]")[0] ||
                        a.querySelectorAll("button")[0] ||
                        a.querySelectorAll(".button")[0] ||
                        a.querySelectorAll("input[name='submit']")[0] ||
                        void 0),
                    this.custom_forms ||
                        (void 0 !== c && c.style.cssText.match("display: none") && (c = void 0),
                        void 0 === c && "forma" === a.id && (c = a.querySelectorAll(".submit input[type='button']")[0]),
                        void 0 === c && (c = a.querySelector('a[class*="submit"],a[id*="submit"],input[class*="submit"],input[id*="submit"]') || void 0)),
                    (c = c ? [c] : [])),
                c
            );
        },
        is_form: function (a) {
            return "FORM" !== a.tagName && (a = a.querySelector("form")), a || null;
        },
        init_button: function (a, b, c) {
            a &&
                !a.dataset.callibri_parse_form &&
                (0 == c || b.phone || b.email) &&
                ((a.dataset.callibri_parse_form = 0 == c || c),
                a.addEventListener("keydown", CallibriFormParser.prototype.send_form, !0),
                _callibri.mobile.isMobile && (a.addEventListener("click", CallibriFormParser.prototype.send_form, !0), a.addEventListener("touchstart", CallibriFormParser.prototype.send_form, !0)),
                a.addEventListener("mousedown", CallibriFormParser.prototype.send_form, !0));
        },
        get_module_feedback_data: function (a, b) {
            var c,
                d,
                e,
                f = {
                    feedback: {
                        name: "",
                        phone: "",
                        email: "",
                        message: "",
                        company: "",
                        client_id: _callibri.site_id,
                        number: _callibri.number,
                        session_id: _callibri.session_id,
                        page: document.location.protocol + "//" + document.location.host + document.location.pathname,
                        custom_fields: {},
                    },
                },
                g = [],
                h = [],
                i = ["div", "label", "span", "p", "a"];
            if (b) {
                for (var j in b)
                    if ("button" !== j) {
                        c = b[j];
                        try {
                            element = a.querySelector(c);
                        } catch (a) {
                            element = null;
                        }
                        element &&
                            (i.indexOf(element.nodeName.toLowerCase()) > -1
                                ? (d = element.innerText)
                                : ((d = element.value),
                                  (e = d && "phone" == j && 0 == this.valid_phone(element.value)),
                                  (element.value && !e) || (g.push(j), ((element.dataset.required && "false" !== element.dataset.required) || element.required || "true" == element.getAttribute("aria-required")) && h.push(j))),
                            void 0 !== f.feedback[j] ? (f.feedback[j] = d) : (f.feedback.custom_fields[j] = d));
                    }
            } else
                for (
                    var c,
                        k = ["phone", "tel", "telephone", "zayavki[tel]", "zvonki[tel]", "telefon"],
                        l = ["msg", "text", "message"],
                        m = ["name", "fio", "zayavki[name]"],
                        n = "",
                        o = a.querySelectorAll("input:not([type='hidden']):not([type='checkbox']),textarea"),
                        p = 0;
                    p < o.length;
                    p++
                ) {
                    n = o[p].name.toLowerCase();
                    var c = o[p].value;
                    !f.feedback.email && c && c.indexOf("@") > 0 && o[p].value.length < 255
                        ? (f.feedback.email = c)
                        : !f.feedback.phone &&
                          callibriValidPhone(callibriSetCorrectPhone(c)) &&
                          (k.filter(function (a) {
                              return n.indexOf(a) > -1;
                          }).length > 0 ||
                              n.match("[\\(" + k.toString().replace(/,/gi, "\\)|\\(") + "\\)]"))
                        ? (f.feedback.phone = callibriSetCorrectPhone(c))
                        : !f.feedback.name && (m.indexOf(n) > -1 || n.match("(" + m.toString().replace(/,/gi, ")|(") + ")"))
                        ? (f.feedback.name = c)
                        : !f.feedback.message && (l.indexOf(n) > -1 || o[p].tagName.toLowerCase().match("textarea")) && (f.feedback.message = c);
                }
            return [f, 0 == g.length, 0 == h.length];
        },
        valid_phone: function (a) {
            return callibriValidPhone(callibriSetCorrectPhone(a));
        },
        validate_phone_email: function (a) {
            var b = !!(a.feedback.email && a.feedback.email.length > 0) && callibriValidEmail(a.feedback.email),
                c = !!(a.feedback.phone && a.feedback.phone.length > 0) && this.valid_phone(a.feedback.phone);
            return b || c;
        },
        send_feedback_form: function (a, b) {
            var c = null,
                d = a.dataset.callibri_parse_form;
            "true" !== d && (c = _callibri.feedback_settings.feedback_settings[d]);
            try {
                var e = this.get_module_feedback_data(a, c),
                    f = e[0],
                    g = e[1],
                    h = e[2];
                if ((0 == g && "blur" == b) || 0 == h) return !1;
                if (this.validate_phone_email(f)) {
                    f.feedback.form_name = this.feedback_form_name(a);
                    var i = _callibri.landing_service && _callibri.landing_service.allowVisitorEvent(6);
                    return (
                        i &&
                            ((f.feedback.page_segment_id = _callibri.landing_service.page_segment.id),
                            _callibri.landing_service.page_segment.ab_test && (f.feedback.page_segment_ab_test = _callibri.landing_service.page_segment.ab_experiment)),
                        callibriMakeRequest("/module/contactus", f, null, null, _callibri.api_server_host),
                        i && _callibri.landing_service.sendVisitorEvent(6),
                        !0
                    );
                }
            } catch (a) {
                return console.log(a), !1;
            }
            return !1;
        },
        get_form_target: function (a, b) {
            var c,
                d = "blur" == b ? a.dataset.callibri_parse_input : a.dataset.callibri_parse_form;
            return (
                ("submit" != b && "keydown" != b) || (c = a),
                (c = "true" == d ? c || a.form || document.querySelectorAll(".modal.in")[0] || (a.parentNode.className.indexOf("submit") < 0 ? a.parentNode : a.parentNode.parentNode) : c || callibriFindParentSelector(a, d))
            );
        },
        send_form: function (a) {
            if (13 == a.keyCode || "keydown" != a.type)
                try {
                    var b = CallibriFormParser.prototype.get_form_target(a.currentTarget, a.type);
                    if (_callibri.form_parser.send_feedback_form(b, a.type)) {
                        var c,
                            d = b.querySelectorAll("*[data-callibri_parse_form]"),
                            e = b.querySelectorAll("*[data-callibri_parse_input]"),
                            f = e.length;
                        (b = _callibri.form_parser.is_form(b)), b && b.removeEventListener("submit", arguments.callee, !0);
                        var g = d.length;
                        if (g > 0)
                            for (i = 0; i < g; i++)
                                (c = d[i]),
                                    c.removeEventListener("keydown", arguments.callee, !0),
                                    _callibri.mobile.isMobile && (c.removeEventListener("click", arguments.callee, !0), c.removeEventListener("touchstart", arguments.callee, !0)),
                                    c.removeEventListener("mousedown", arguments.callee, !0);
                        for (i = 0; i < f; i++) e[i].removeEventListener("blur", arguments.callee, !0);
                    }
                } catch (a) {
                    console.log(a);
                }
        },
        setup_modal_forms: function () {
            if (_callibri.feedback_settings && _callibri.feedback_settings.parser_init)
                try {
                    "function" == typeof jQuery && _callibri.feedback_settings.parser_init.jquery
                        ? this.init_parser ||
                          jQuery("body").on("click", _callibri.feedback_settings.parser_init.button, function () {
                              setTimeout(function () {
                                  CallibriFormParser.prototype.form_parser_search(0);
                              }, 2e3);
                          })
                        : this.search_form_button();
                } catch (a) {}
        },
        iframe_message: function () {
            try {
                if (_callibri.feedback_settings && _callibri.feedback_settings.iframe_selector) {
                    var a = document.querySelector(_callibri.module_settings.iframe_selector);
                    a.contentWindow.postMessage(callibriGetResponse(), a.src);
                }
            } catch (a) {}
        },
        search_form_button: function () {
            for (var a, b = document.querySelectorAll(_callibri.feedback_settings.parser_init.button), c = 0; c < b.length; c++)
                (a = b[c]),
                    "true" != a.dataset.callibri_search_form &&
                        (a.addEventListener(
                            "click",
                            function (a) {
                                setTimeout(function () {
                                    CallibriFormParser.prototype.form_parser_search(0);
                                }, 2e3),
                                    a.target.removeEventListener("click", arguments.callee, !0),
                                    (a.target.dataset.callibri_search_form = !1);
                            },
                            !0
                        ),
                        (a.dataset.callibri_search_form = !0));
        },
        form_parser_search: function (a) {
            for (var b = !0, c = document.querySelectorAll(_callibri.feedback_settings.parser_init.selector_forms), d = 0; d < c.length; d++)
                if (null === c[d].querySelector("[data-callibri_parse_form]")) {
                    _callibri.form_parser && _callibri.form_parser.init(), (b = !1);
                    break;
                }
            b && a < 15
                ? ((a += 1),
                  setTimeout(function () {
                      CallibriFormParser.prototype.form_parser_search(a);
                  }, 2e3))
                : CallibriFormParser.prototype.search_form_button();
        },
        feedback_form_name: function (a) {
            var b = a.dataset.callibri_form_name;
            if (!b) {
                var c = a.querySelector("*[data-callibri_form_name]");
                if (c) b = c.dataset.callibri_form_name;
                else if (!(b = a.getAttribute("id") || "")) {
                    var d = a.querySelector("form");
                    d && (b = d.getAttribute("id") || "");
                }
            }
            return b;
        },
    }),
    callibriInit(!0);
