export const getUtilityLibrary = () => {
  ("use strict");

  /**
   *  Constants
   */

  var VERSION = "2.1";

  // var DEBUG_MODE = {{Debug Mode}};
  const DEBUG_MODE = false;

  var DATA_LAYER_NAME = "dataLayer";

  var EVENT_SAMPLE_RATE = 300;

  /**
   *    Compatibility
   **/

  (function () {
    // CustomEvent Polyfill
    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    }

    if (typeof window.CustomEvent != "function") {
      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    }
  })();

  // base object
  var _ = {};

  /**
   * GTM Functions
   */

  /**
   *  Push arbitrary object to dataLayer
   *  @method dataLayerPush
   *  @param {Object} value - data object to be pushed to dataLayer
   *
   */
  _.dataLayerPush = function (value) {
    window[DATA_LAYER_NAME].push(value);
  };

  /**
   * Generic JS Helper Functions
   */

  /**
   * Transforms text setting into a boolean variable
   * @method settingToBool
   * @param  {string}
   * @return {bool}
   */
  _.settingToBool = function (setting) {
    setting = setting.toLowerCase();
    if (["true", "yes", "enabled"].indexOf(setting) > -1) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Split a comma separated list of arguments into a clean array
   * @method settingToArray
   * @param  {string}
   * @return {array}
   */
  _.settingToArray = function (value) {
    return _.map(value.split(","), function (item) {
      return item.trim();
    });
  };

  /**
   * Convert milliseconds to seconds
   * @method millisecondsToSeconds
   * @param  {integer} value
   * @return {float}
   */
  _.millisecondsToSeconds = function (value) {
    return Math.round(value / 1000, 2);
  };

  /**
   * Convert milliseconds to the nearest whole number of seconds
   * @method millisecondsToSeconds
   * @param  {integer} value
   * @return {integer}
   */
  _.millisecondsToSecondsInt = function (value) {
    return Math.round(_.millisecondsToSeconds(value), 0);
  };

  /**
   * Converts value to array
   * @method toArray
   * @param  {Object} value - array-like object
   * @return {array}
   */
  _.toArray = function (value) {
    if (!value) {
      return [];
    }
    return Array.prototype.slice.call(value);
  };

  /**
   * Generic Logging Utility - only logs in debug mode
   * Accepts multiple arguments
   * @return {null}
   */
  _.log = function () {
    //   if({{Debug Mode}}){
    if (DEBUG_MODE) {
      console.log.apply(null, _.toArray(arguments));
    }
  };

  /**
   * Basic string hash utility
   * @method hash
   * @param  {string} s - input string
   * @return {string}
   */
  _.hash = function (s) {
    return s.split("").reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  };

  /**
   * Iterates over input objects and assigns properties to new object left-to-right
   * @param {...object} objects to be combined
   * @return {object}
   */
  _.extend = function () {
    var objects = _.toArray(arguments);
    var newObject = {};
    var key;
    var i;

    function _extend(consumer, provider) {
      var key;
      for (key in provider) {
        if (!consumer.hasOwnProperty(key)) {
          consumer[key] = provider[key];
        }
      }
      return consumer;
    }

    for (i in objects) {
      objects[i] = _extend(newObject, objects[i]);
    }

    return newObject;
  };

  /**
   * Creates an array of values by running each element in collection
   * through an iteratee. Iteratee invoked with 3 arguments - value, index, collection
   * @param  {array}  arr - collection to iterate over
   * @param  {Function} fn - iterator function
   * @param  {context} context - context for iterator function
   * @return {array} resulting array
   */
  _.map = function (arr, fn, context) {
    var i,
      results = [];
    context = context || window;
    for (i = 0; i < arr.length; i++) {
      results.push(fn.call(context, arr[i], i, arr));
    }
    return results;
  };

  /**
   * Create an object with the same keys as obj and values generated
   * by running each own enumerable string key property through iteratee
   * @param  {object} obj - object to iterate over
   * @param  {Function} fn - iteratee
   * @param  {object} context - context of function
   * @return {object} resulting object
   */
  _.mapObject = function (obj, fn, context) {
    var i,
      results = [];
    context = context || window;
    for (var key in obj) {
      results.push(fn.call(context, obj[key], key));
    }
    return results;
  };

  /**
   * Generate timestamp string
   * @return {string}
   */
  _.timestamp = function () {
    return new Date().toString();
  };

  /**
   * Creates new throttled function that will invoke at most once per every wait
   * milliseconds
   * @param  {function} func - function to throttle
   * @param  {integer} wait - number of miliseconds to throttle invocations to
   * @return {function} returns new throttled function
   */
  _.throttle = function (func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function () {
      previous = new Date();
      timeout = null;
      result = func.apply(context, args);
    };
    return function () {
      var now = new Date();
      if (!previous) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  /**
   * DOM functions
   */

  /**
   * Delay function invocation until DOM is safe to manipulate
   * @param  {Function} fn - DOM ready callback
   * @return {null}
   */
  _.onReady = function (fn) {
    if (document.readyState != "loading") {
      fn();
    } else if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState != "loading") fn();
      });
    }
  };

  /**
   * Cross-browser event handler utility
   * @param {Element} el - DOM element to attach listener to
   * @param {string}  evt - event name
   * @param {Function}  fn - callback function
   * @return {Function} function to call to remove event listener
   */
  _.addEvent = function (el, evt, fn) {
    if (el.addEventListener) {
      _fn = fn;
      el.addEventListener(evt, fn);
    } else {
      _fn = function (evt) {
        fn.call(null, el, evt);
      };
      if (el.attachEvent) {
        el.attachEvent("on" + evt, _fn);
      } else if (
        typeof el["on" + evt] === "undefined" ||
        el["on" + evt] === null
      ) {
        el["on" + evt] = _fn;
      }
    }
    return function () {
      _.removeEvent(el, evt, fn);
    };
  };

  /**
   * Create and emit a custom event on a particular DOM element
   * @param  {Element} target DOM element
   * @param  {String} type   event name
   * @param  {Object} opts   object to be passed to listeners
   * @return {null}
   */
  _.emitEvent = function (target, type, opts) {
    var event = new CustomEvent(type, opts || {});
    target.dispatchEvent(event);
  };

  /**
   * Cross-browser remove event handler utilty
   * @param  {Element}   el - DOM element
   * @param  {String}   evt - event name
   * @param  {Function} fn - callback function
   * @return {null}
   */
  _.removeEvent = function (el, evt, fn) {
    if (el.removeEventListener) {
      return el.removeEventListener(evt, fn);
    }
    if (el.detachEvent) {
      return el.detachEvent("on" + evt, fn);
    }
    if (el["on" + evt] === fn) {
      return (el["on"] = null);
    }
  };

  /**
   * Asyncronously load external JS library
   * @param  {String}   src      URL to JavaScript file
   * @param  {Function} callback function to call when JS file is loaded
   * @return {null}
   */
  _.loadScript = function (src, callback) {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = src;
    s.onload = callback;
    var x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  };

  /**
   * Utility function - Check whether element is within the viewport
   * @param  {Element}  el     - target element
   * @param  {integer}  bounds - additional padding around element
   * @return {Boolean}         - Whether element is in viewport
   */
  _.isInView = function isInView(el, bounds) {
    var rect = el.getBoundingClientRect();
    return (
      (((((rect.bottom == rect.top) == rect.left) == rect.right) ==
        rect.height) ==
        rect.width) ==
        0 &&
      rect.top + rect.height >= 0 &&
      rect.left + rect.width >= 0 &&
      rect.bottom - rect.height <=
        (window.innerHeight || document.documentElement.clientHeight) +
          bounds &&
      rect.right - rect.width <=
        (window.innerWidth || document.documentElement.clientWidth) + bounds
    );
  };

  /**
   * Utility function - Checks whether element is visible on page by recursively checking
   * visibility of parent elements
   * @param  {Element}  element target element
   * @return {Boolean}         Whether element is visible or not
   */
  _.isVisible = function isVisible(element) {
    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     */
    function _isVisible(el, t, r, b, l, w, h) {
      var p = el.parentNode,
        VISIBLE_PADDING = 2;

      if (!_elementInDocument(el)) {
        return false;
      }

      //-- Return true for document node
      if (9 === p.nodeType) {
        return true;
      }

      //-- Return false if our element is invisible
      if (
        "0" === _getStyle(el, "opacity") ||
        "none" === _getStyle(el, "display") ||
        "hidden" === _getStyle(el, "visibility")
      ) {
        return false;
      }

      if (
        "undefined" === typeof t ||
        "undefined" === typeof r ||
        "undefined" === typeof b ||
        "undefined" === typeof l ||
        "undefined" === typeof w ||
        "undefined" === typeof h
      ) {
        t = el.offsetTop;
        l = el.offsetLeft;
        b = t + el.offsetHeight;
        r = l + el.offsetWidth;
        w = el.offsetWidth;
        h = el.offsetHeight;
      }
      //-- If we have a parent, let's continue:
      if (p) {
        //-- Check if the parent can hide its children.
        if (
          "hidden" === _getStyle(p, "overflow") ||
          "scroll" === _getStyle(p, "overflow")
        ) {
          //-- Only check if the offset is different for the parent
          if (
            //-- If the target element is to the right of the parent elm
            l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
            //-- If the target element is to the left of the parent elm
            l + w - VISIBLE_PADDING < p.scrollLeft ||
            //-- If the target element is under the parent elm
            t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
            //-- If the target element is above the parent elm
            t + h - VISIBLE_PADDING < p.scrollTop
          ) {
            //-- Our target element is out of bounds:
            return false;
          }
        }
        //-- Add the offset parent's left/top coords to our element's offset:
        if (el.offsetParent === p) {
          l += p.offsetLeft;
          t += p.offsetTop;
        }
        //-- Let's recursively check upwards:
        return _isVisible(p, t, r, b, l, w, h);
      }
      return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
      if (window.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null)[property];
      }
      if (el.currentStyle) {
        return el.currentStyle[property];
      }
    }

    function _elementInDocument(element) {
      while ((element = element.parentNode)) {
        if (element == document) {
          return true;
        }
      }
      return false;
    }

    return _isVisible(element);
  };

  /**
   * Helper function - is the object a DOM node
   * @param  {Object}  o element to be tested
   * @return {Boolean}   whether object is DOM node or not
   */
  function isNode(o) {
    return typeof Node === "object"
      ? o instanceof Node
      : o &&
          typeof o === "object" &&
          typeof o.nodeType === "number" &&
          typeof o.nodeName === "string";
  }

  /**
   * Helper function - callback when element appears within viewport
   * @param  {[type]}   element  [description]
   * @param  {[type]}   bounds   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  function trackElement(element, bounds, callback) {
    var fired = false;
    var change = _.throttle(function () {
      if (_.isInView(element, bounds) && _.isVisible(element) && !fired) {
        fired = true;
        callback(element);
      }
    }, EVENT_SAMPLE_RATE);

    _.addEvent(window, "scroll", change);
    _.addEvent(window, "resize", change);
    _.addEvent(window, "click", change);
    if (window.jQuery) {
      jQuery(window).on("shown.bs.tab", change);
      jQuery(window).on("shown.bs.collapse", change);
    }
    _.onReady(change);
  }

  /**
   * Fire callback function when element is visible and enters the viewport
   * @param  {Element}   element - DOM element
   * @param  {integer}   bounds  - additional margin around object
   * @param  {Function} callback - function to fire on visible
   * @return {null}
   */
  _.onElementAppear = function (element, bounds, callback) {
    bounds = bounds || 25;
    if (isNode(element)) {
      trackElement(element, bounds, callback);
    }
  };

  /**
   * Generates a CSS identifier that can be used to distinguish the element on
   * the page
   * @param  {Element} el            - target element
   * @param  {Boolean} stopOnID      - only generate path up to an element with an ID
   * @param  {array} ignoreClasses   - list of classes to not include in path
   * @param  {array} ignoreElements - list of element types not to include in path
   *                                  default are "body" and "html"
   * @return {String}                - css path of element, e.g. "#parent > .list > li > a"
   */
  _.cssPath = function (el, stopOnID, ignoreClasses, ignoreElements) {
    stopOnID = stopOnID || false;
    ignoreElements = ignoreElements || [];
    ignoreElements = ["body", "html"].concat(ignoreElements);
    ignoreClasses = ignoreClasses || [];
    function map(arr, fn, context) {
      var i,
        results = [];
      context = context || window;
      for (i = 0; i < arr.length; i++) {
        results.push(fn.call(context, arr[i], i, arr));
      }
      return results;
    }
    function removeA(arr, el) {
      var what,
        _arr = [],
        i,
        a = arguments,
        L = a.length,
        ax;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].search(el) == -1) {
          _arr.push(arr[i]);
        }
      }
      return _arr;
    }
    if (!(el instanceof Element)) return;

    if (el.id !== "") {
      return "#" + el.id;
    } else {
      var path = [],
        i = 0;
      while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        var identifier = "";
        if (-1 === ignoreElements.indexOf(selector)) {
          var classes = Array.prototype.slice.call(el.classList);
          map(ignoreClasses, function (cl) {
            classes = removeA(classes, cl);
          });
          if (el.id) {
            identifier = "#" + el.id;
          } else if (classes.length > 0) {
            identifier = "." + classes.join(".");
          } else if (i == 0) {
            identifier = el.nodeName.toLowerCase();
          }

          if (identifier !== "") {
            path.unshift(identifier);
          }

          if (stopOnID && el.id) {
            break;
          }
        }
        el = el.parentNode;
        i++;
      }
      return path.join(" > ");
    }
  };

  /**
   * Recursively walk up the DOM and create a list of elements that match
   * a defined CSS selector
   * @param  {Element} elem    - child element
   * @param  {String} selector - CSS selector of target parent element
   * @return {Array.Eleement}  - array of matching parent elements
   */
  _.parent = function (elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(
              s
            ),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Setup parents array
    var parents = [];

    // Get matching parent elements
    for (; elem && elem !== document; elem = elem.parentNode) {
      // Add matching parents to array
      if (selector) {
        if (elem.matches(selector)) {
          parents.push(elem);
        }
      } else {
        parents.push(elem);
      }
    }

    return parents;
  };

  /**
   * Parse a URL string into its component parts
   * @param  {String} url - URL string
   * @return {Object}     - key/value of URL elements including key/value of query string
   */
  _.parseURL = function (url) {
    a = document.createElement("a");
    a.href = url;

    query = {};

    if (a.search != "") {
      var i,
        vars = a.search.replace("?", "").split("&");
      for (i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }

    return {
      protocol: a.protocol,
      hostname: a.hostname,
      port: a.port,
      path: a.pathname,
      search: a.search,
      hash: a.hash,
      host: a.host,
      query: query,
    };
  };

  /**
   * Convert string to TitleCase
   * @param  {String} str input string
   * @return {String}     output string
   */
  _.titleCase = function (str) {
    return _.map(str.split(" "), function (val) {
      return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
    }).join(" ");
  };

  /**
   * Get the root domain of any particular hostname regardless of how
   * many sub-domains
   * @param  {String} hostname
   * @return {String}          root domain
   */
  _.rootDomain = function (hostname) {
    parts = hostname.split(".");
    if (parts.length > 2) {
      return [parts[parts.length - 2], parts[parts.length - 1]].join(".");
    } else {
      return hostname;
    }
  };

  /**
   * Utility class that provides helpful methods for working with cookies
   * @type {Object}
   */
  _.cookie = {
    /**
     * Set a cookie
     * @param {String} name    - cookie name
     * @param {Object} value   - cookie value (must be JSON-serializable)
     * @param {Integer} seconds - cookie expiration in seconds
     * @param {String} path    - optional cookie path
     * @param {String} domain  - optional cookie domain
     * @param {Boolean} secure - whether to set the cookie secure flag
     */
    set: function (name, value, seconds, path, domain, secure) {
      var date = new Date(),
        expires = "",
        type = typeof value,
        valueToUse = "",
        secureFlag = "";
      path = path || "/";
      domain = domain || window.location.hostname;
      if (seconds) {
        date.setTime(date.getTime() + seconds * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      if (type === "object" && type !== "undefined") {
        if (!("JSON" in window))
          throw "Bummer, your browser doesn't support JSON parsing.";
        valueToUse = encodeURIComponent(JSON.stringify({ v: value }));
      } else {
        valueToUse = encodeURIComponent(value);
      }

      if (secure) {
        secureFlag = "; secure";
      }

      document.cookie =
        name +
        "=" +
        valueToUse +
        expires +
        "; domain=" +
        domain +
        "; path=" +
        path +
        secureFlag;
    },

    /**
     * Get a cookie by name
     * @param  {String} name cookie name
     * @return {Object}      value of cookie (de-serialized if needed)
     */
    get: function (name) {
      var nameEQ = name + "=",
        ca = document.cookie.split(";"),
        value = "",
        firstChar = "",
        parsed = {};
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          value = decodeURIComponent(c.substring(nameEQ.length, c.length));
          firstChar = value.substring(0, 1);
          if (firstChar == "{") {
            try {
              parsed = JSON.parse(value);
              if ("v" in parsed) return parsed.v;
            } catch (e) {
              return value;
            }
          }
          if (value == "undefined") return undefined;
          return value;
        }
      }
      return null;
    },
    /**
     * Remove cookie by name
     * @param  {String} name cookie name
     * @return {null}
     */
    remove: function (name) {
      this.set(name, "", -1);
    },

    /**
     * Increase value of cookie by 1
     * @param  {String} name - cookie name
     * @param  {Integer} days - extend cookie life by this many days
     * @return {null}
     */
    increment: function (name, days) {
      var value = this.get(name) || 0;
      this.set(name, parseInt(value, 10) + 1, days * 86400);
    },

    /**
     * Decrease value of cookie by 1
     * @param  {String} name - cookie name
     * @param  {Integer} days - extend cookie life by this many days
     * @return {null}
     */
    decrement: function (name, days) {
      var value = this.get(name) || 0;
      this.set(name, parseInt(value, 10) - 1, days * 86400);
    },
  };

  return _;
};
