import raf from "raf";
import isBrowser from "./isBrowser";

var SCROLL_TIME = 250;
var w = isBrowser ? window : {};
var d = isBrowser ? document : {};
var originalScroll = w.scroll || w.scrollTo;

var now =
  w.performance && w.performance.now
    ? w.performance.now.bind(w.performance)
    : Date.now;

/**
 * changes scroll position inside an element
 * @method scrollElement
 * @param {Number} x
 * @param {Number} y
 */

function scrollElement(x, y) {
  this.scrollLeft = x;
  this.scrollTop = y;
}

/**
 * returns result of applying ease math function to a number
 * @method ease
 * @param {Number} k
 * @returns {Number}
 */

function ease(k) {
  return 0.5 * (1 - Math.cos(Math.PI * k));
}

/**
 * self invoked function that, given a context, steps through scrolling
 * @method step
 * @param {Object} context
 */
function step(context) {
  var time = now();
  var elapsed = (time - context.startTime) / context.duration; // avoid elapsed times higher than one

  elapsed = elapsed > 1 ? 1 : elapsed; // apply easing to elapsed time

  var value = ease(elapsed);
  var currentX = context.startX + (context.x - context.startX) * value;
  var currentY = context.startY + (context.y - context.startY) * value;
  context.method.call(context.scrollable, currentX, currentY); // scroll more if we have not reached our destination

  if (currentX !== context.x || currentY !== context.y) {
    raf(step.bind(w, context));
  }
}

/**
 * scrolls element with a smooth behavior
 * @method smoothScroll
 * @param {Object|Node} el element to scroll
 * @param {Number} x target position x
 * @param {Number} y target position y
 * @param {Number} duration animation duration
 */

export default function smoothScroll(el, x, y) {
  var duration =
    arguments.length > 3 && arguments[3] !== undefined
      ? arguments[3]
      : SCROLL_TIME;

  if (!isBrowser) {
    return;
  }

  var scrollable;
  var startX;
  var startY;
  var method;
  var startTime = now(); // define scroll context

  if (el === d.body || el === w) {
    scrollable = w;
    startX = w.scrollX || w.pageXOffset;
    startY = w.scrollY || w.pageYOffset;
    method = originalScroll;
  } else {
    scrollable = el;
    startX = el.scrollLeft;
    startY = el.scrollTop;
    method = scrollElement;
  } // scroll looping over a frame

  step({
    duration: duration,
    scrollable: scrollable,
    method: method,
    startTime: startTime,
    startX: startX,
    startY: startY,
    x: x,
    y: y
  });
}
