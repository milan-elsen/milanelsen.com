/*
 * Wordmark easter egg.
 *
 * The wordmark is split into three masked segments -- milan / elsen / .com -- and
 * hovering it plays one of the enabled animations in the ANIMATIONS registry below,
 * picked at random (never the same one twice in a row). Nothing new starts while a
 * run is playing.
 *
 * Turning animations on and off: flip "enabled" in ANIMATIONS. Only enabled ones
 * are picked on hover; disabled ones can still be played with the testing hooks
 * below, so each can be worked on in isolation, or named in WORKING_ON so every
 * hover plays it.
 *
 * Adding an animation: write an async function that takes the context described
 * at createContext() and resolves when it's finished, then add it to ANIMATIONS.
 * It must leave every segment where it found it. Anything started through
 * ctx.animate() is cancelled automatically once it resolves, so ending on a
 * "forwards" fill is fine.
 *
 * Testing a specific animation:
 *   - add ?wordmark=<name> to the URL, e.g. /?wordmark=accordion -- every hover
 *     then plays that one, enabled or not
 *   - or from the browser console:
 *       wordmark.list()                  every animation, on/off, what it does
 *       wordmark.play("fall-pop")        play one now
 *       wordmark.force("flap-flip")      use it for every hover until reload
 *       wordmark.force(null)             back to random
 *
 * Sequenced from script rather than :hover because the element moves out from
 * under the cursor, which drops :hover and would cancel the run halfway, and
 * because some animations depend on measured positions CSS cannot express.
 */
(function () {
  "use strict";

  var EXPO_OUT = [0.16, 1, 0.3, 1];

  /* ---------------------------------------------------------------- helpers */

  function bezier(curve) {
    return "cubic-bezier(" + curve.join(", ") + ")";
  }

  // Sub-pixel on purpose: rounding to whole pixels makes slow movement step
  // visibly, and neighbours rounding opposite ways can overlap by nearly a pixel.
  function tx(px) {
    return "translateX(" + px.toFixed(2) + "px)";
  }

  /* Fraction of the duration at which a cubic-bezier easing reaches the given
     progress. Solved by bisection -- both coordinates are monotonic for the
     curves used here. */
  function timeAtProgress(curve, progress) {
    function at(s, p1, p2) {
      var u = 1 - s;
      return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s;
    }
    var lo = 0;
    var hi = 1;
    for (var i = 0; i < 30; i++) {
      var s = (lo + hi) / 2;
      if (at(s, curve[1], curve[3]) < progress) {
        lo = s;
      } else {
        hi = s;
      }
    }
    return at((lo + hi) / 2, curve[0], curve[2]);
  }

  /* The value of a cubic-bezier easing at the given fraction of its duration. */
  function easeAt(curve, x) {
    function at(s, p1, p2) {
      var u = 1 - s;
      return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s;
    }
    var lo = 0;
    var hi = 1;
    for (var i = 0; i < 30; i++) {
      var s = (lo + hi) / 2;
      if (at(s, curve[0], curve[2]) < x) {
        lo = s;
      } else {
        hi = s;
      }
    }
    return at((lo + hi) / 2, curve[1], curve[3]);
  }

  /* The right edge animations align to: the project list on the home page, the
     text column on imprint and privacy, the content column elsewhere. Never past
     the contact rail -- the content column runs underneath it on some pages. */
  function alignmentEdge(brand) {
    var target =
      document.querySelector(".project-grid") ||
      document.querySelector(".list-block-content") ||
      document.querySelector("#content.site") ||
      brand.parentNode;
    var edge = target.getBoundingClientRect().right;
    var rail = document.querySelector(".side-rail");
    if (rail && rail.offsetParent !== null) {
      edge = Math.min(edge, rail.getBoundingClientRect().left - 24);
    }
    return edge;
  }

  /* Each segment rises back into place from below its mask, left to right. The
     "backwards" fill holds a segment out of sight through its own delay, so this
     can start in the same tick that whatever came before is cancelled. */
  function rise(ctx) {
    return ctx.all(
      ctx.segs.map(function (seg, i) {
        return ctx.animate(
          seg,
          [{ transform: "translateY(150%)" }, { transform: "translateY(0)" }],
          { duration: 560, delay: i * 90, easing: bezier(EXPO_OUT), fill: "backwards" }
        );
      })
    );
  }

  /* Splits the three words into one span per letter, for animations that move
     letters individually, and puts the words back when the animation finishes.
     Kerning between the split letters moves them by well under a pixel. The masks
     are lifted meanwhile -- they'd clip letters travelling sideways. */
  function splitLetters(ctx) {
    var letters = [];
    ctx.segs.forEach(function (seg) {
      var word = seg.textContent;
      seg.textContent = "";
      Array.from(word).forEach(function (ch) {
        var span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = ch;
        seg.appendChild(span);
        letters.push(span);
      });
      ctx.defer(function () {
        seg.textContent = word;
      });
    });
    ctx.clips.forEach(function (clip) {
      clip.style.clipPath = "none";
      ctx.defer(function () {
        clip.style.clipPath = "";
      });
    });
    return letters;
  }

  /* Copies of every letter, each in its own span at exactly the same place, in a
     layer over the whole window; the real wordmark is hidden meanwhile. For
     animations that take letters far across the page -- in the header they'd
     pass behind the project images, and could stretch the page's scroll height.
     Returns { marks: [{ ch, rect }], copies: [span], fontPx }, in reading order. */
  function liftLetters(ctx) {
    // Where every letter is, measured from the text itself.
    var style = window.getComputedStyle(ctx.brand);
    var fontPx = parseFloat(style.fontSize);
    var marks = [];
    ctx.segs.forEach(function (seg) {
      var text = seg.firstChild;
      for (var c = 0; c < text.length; c++) {
        var range = document.createRange();
        range.setStart(text, c);
        range.setEnd(text, c + 1);
        marks.push({ ch: text.data[c], rect: range.getBoundingClientRect() });
      }
    });

    // Copies in a layer over the whole window, the real wordmark hidden meanwhile.
    var layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:2147483000;";
    var copies = marks.map(function (m) {
      var el = document.createElement("span");
      el.textContent = m.ch;
      el.style.cssText =
        "position:absolute;white-space:pre;line-height:normal;will-change:transform,opacity;" +
        "left:" + m.rect.left + "px;top:" + m.rect.top + "px;";
      ["fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "color", "textTransform"].forEach(
        function (prop) {
          el.style[prop] = style[prop];
        }
      );
      layer.appendChild(el);
      return el;
    });
    document.body.appendChild(layer);
    // Line the copies' glyphs up with the originals exactly, whatever the
    // difference in how the two boxes are measured.
    copies.forEach(function (el, n) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var r = range.getBoundingClientRect();
      el.style.left = marks[n].rect.left + (marks[n].rect.left - r.left) + "px";
      el.style.top = marks[n].rect.top + (marks[n].rect.top - r.top) + "px";
    });
    ctx.clips.forEach(function (clip) {
      clip.style.visibility = "hidden";
    });
    ctx.defer(function () {
      layer.remove();
      ctx.clips.forEach(function (clip) {
        clip.style.visibility = "";
      });
    });
    return { marks: marks, copies: copies, fontPx: fontPx };
  }

  /* ------------------------------------------------------------- animations */

  /* Justifies out across the page -- ".com" flush with the project list, "elsen"
     centred between -- holds, then "milan" sets off right, picks up "elsen", then
     ".com", and the whole wordmark leaves the window before rising back in. */
  async function spreadSweep(ctx) {
    var SPREAD_MS = 820;
    var HOLD_MS = 1000;
    var OFFSTAGE_MS = 70; // beat spent out of frame before rising back in

    var c = ctx.clips;
    var lead = c[0].getBoundingClientRect();
    var mid = c[1].getBoundingClientRect();
    var end = c[2].getBoundingClientRect();

    var endShift = alignmentEdge(ctx.brand) - end.right;
    var midShift = lead.right + (end.left + endShift - lead.right - mid.width) / 2 - mid.left;
    // Too narrow to open up: the shifts would go negative and pull the segments
    // backwards over each other. Sit still instead.
    if (endShift < 0) {
      endShift = 0;
      midShift = 0;
    }

    var spread = { duration: SPREAD_MS, easing: bezier(EXPO_OUT), fill: "forwards" };
    ctx.animate(c[1], [{ transform: tx(0) }, { transform: tx(midShift) }], spread);
    await ctx.all([ctx.animate(c[2], [{ transform: tx(0) }, { transform: tx(endShift) }], spread)]);

    await ctx.wait(HOLD_MS);

    /* All three run on one timeline with one easing, each keyframe set linear in
       that shared progress: a segment holds until "milan" has covered the gap to
       it, then moves with "milan". Deriving everything from the same eased
       progress keeps them touching whatever the curve -- separate transitions
       would drift apart. */
    var gapToMid = mid.left + midShift - lead.right;
    var gapToEnd = end.left + endShift - (mid.right + midShift);
    var toClear = window.innerWidth - (lead.left + gapToMid + gapToEnd) + 40;
    var d = gapToMid + gapToEnd + toClear;
    /* Same curve as the spread, and the duration scaled by distance, so the two
       stages move at the same speed at every point of the curve rather than just
       sharing its shape: the same quick start, then the same long glide -- this
       time easing off the edge of the window instead of into place. */
    var sweepMs = endShift > 0 ? SPREAD_MS * (d / endShift) : SPREAD_MS;
    var sweep = { duration: sweepMs, easing: bezier(EXPO_OUT), fill: "forwards" };

    ctx.animate(c[0], [{ transform: tx(0) }, { transform: tx(d) }], sweep);
    ctx.animate(
      c[1],
      [
        { offset: 0, transform: tx(midShift) },
        { offset: gapToMid / d, transform: tx(midShift) },
        { offset: 1, transform: tx(midShift + d - gapToMid) }
      ],
      sweep
    );
    ctx.animate(
      c[2],
      [
        { offset: 0, transform: tx(endShift) },
        { offset: (gapToMid + gapToEnd) / d, transform: tx(endShift) },
        { offset: 1, transform: tx(endShift + d - gapToMid - gapToEnd) }
      ],
      sweep
    );

    // The glide ends 40px past the edge, so the last of it plays out unseen. Come
    // back in as soon as "milan" -- the trailing word -- is out of the window.
    var goneAt = (window.innerWidth - lead.left) / d;
    await ctx.wait(timeAtProgress(EXPO_OUT, goneAt) * sweepMs + OFFSTAGE_MS);
    ctx.cancelAll();
    await rise(ctx);
  }

  /* Each letter slides right until the wordmark sits flush with the right edge of
     the project list, and straight back home.
     It moves like an accordion: the letters leave one after another, from the
     right, spaced so "milan"'s "m" only sets off as ".com"'s "m" arrives, so the
     wordmark stretches across the page and closes up against the edge. Once that
     last letter has arrived they hold for a moment, then it leads the way home,
     the rest following in turn.
     Each letter is simulated on a spring trailing its own guide, which is where
     the stretch and the soft landings come from, and letters push each other
     apart if they touch rather than passing through. Both directions run as one
     simulation, so the letters settle into the hold and set off from it on the
     same springs.
     The landings are kept gentle on purpose: with arrivals spread out, a bouncier
     one sends each letter's rebound into the next arriving, and they clatter. */
  async function accordion(ctx) {
    var TRAVEL_MS = 520; // one letter's guide, from setting off to arriving
    var EDGE_HOLD_MS = 500; // the hold with them all closed up against the edge
    var PERIOD_MS = 300; // the spring each letter hangs from: longer is looser
    var DAMPING = 0.8; // lower is bouncier -- below about 0.75 letters collide
    var STEP_MS = 0.25; // simulation step
    var FRAME_MS = 1000 / 120; // sampled for every frame a ProMotion display draws

    var letters = splitLetters(ctx);
    var n = letters.length;
    var d = alignmentEdge(ctx.brand) - letters[n - 1].getBoundingClientRect().right;
    if (d <= 0) {
      return; // no room to move on a viewport this narrow
    }
    // Landing at home overshoots past the wordmark's left edge; on a narrow window
    // it sits only a little way in. Keep it inside the window.
    var roomLeft = Math.max(0, letters[0].getBoundingClientRect().left - 4);

    var stagger = TRAVEL_MS / (n - 1); // each end's last letter sets off as its first arrives
    var w = (2 * Math.PI) / PERIOD_MS;
    var stiffness = w * w;
    var friction = 2 * DAMPING * w;
    // Where letters touch they meet a much stiffer spring, so they push apart
    // smoothly instead of overlapping or stopping dead.
    var wc = (2 * Math.PI) / 10;
    var contactStiffness = wc * wc;
    var contactFriction = 2 * 0.9 * wc;

    function smootherstep(x) {
      return x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (6 * x - 15) + 10);
    }

    /* Everything is in "distance travelled" terms: 0 at home, d at the right edge.
       Letters are indexed left to right. Going out, the rightmost sets off first;
       coming home, the leftmost -- which is also the last to have arrived. */
    var pos = [];
    var vel = [];
    var samples = [];
    for (var i = 0; i < n; i++) {
      pos.push(0);
      vel.push(0);
      samples.push([]);
    }
    var homeAt = null; // the moment the last letter arrives; the return starts a hold later
    var nextFrame = 0;
    var t = 0;
    for (; t < 8000; t += STEP_MS) {
      if (t >= nextFrame) {
        for (i = 0; i < n; i++) {
          samples[i].push({ t: t, pos: pos[i] });
        }
        nextFrame += FRAME_MS;
      }
      if (homeAt === null && pos[0] >= d - 1.5) {
        homeAt = t;
      }

      var acc = [];
      for (i = 0; i < n; i++) {
        var out = smootherstep((t - (n - 1 - i) * stagger) / TRAVEL_MS);
        var back = homeAt === null ? 0 : smootherstep((t - homeAt - EDGE_HOLD_MS - i * stagger) / TRAVEL_MS);
        acc.push(stiffness * (d * (out - back) - pos[i]) - friction * vel[i]);
      }
      // A letter can never get past its right-hand neighbour, whichever way
      // they're going: they all travel the same distance from touching.
      for (i = 0; i < n - 1; i++) {
        var squash = pos[i] - pos[i + 1];
        if (squash > 0) {
          var push = contactStiffness * squash + contactFriction * Math.max(0, vel[i] - vel[i + 1]);
          acc[i] -= push / 2;
          acc[i + 1] += push / 2;
        }
      }
      var settled = homeAt !== null && t > homeAt + EDGE_HOLD_MS + (n - 1) * stagger + TRAVEL_MS;
      for (i = 0; i < n; i++) {
        vel[i] += acc[i] * STEP_MS;
        pos[i] += vel[i] * STEP_MS;
        if (pos[i] < -roomLeft) {
          pos[i] = -roomLeft;
          vel[i] = Math.max(vel[i], 0);
        }
        if (Math.abs(pos[i]) > 0.3 || Math.abs(vel[i]) > 0.004) {
          settled = false;
        }
      }
      if (settled) {
        break;
      }
    }

    var total = t;
    await ctx.all(
      letters.map(function (letter, i) {
        var keyframes = samples[i].map(function (f) {
          return { offset: f.t / total, transform: tx(f.pos) };
        });
        keyframes.push({ offset: 1, transform: tx(0) });
        return ctx.animate(letter, keyframes, { duration: total });
      })
    );
  }

  /* A word wheel, after the "blur text scroller". The wordmark blurs and fades
     out, a fan of words fades in already on the first of WORDS, steps through
     them with an arrow pointing at the current one, and lands on milanelsen.com:
     ●, graphics, motion, interaction, technology, milanelsen.com.
     The words sit like spokes on a wheel whose hub is far off to the left, so the
     ones above tilt up and the ones below tilt down, curving back slightly; the
     further a word is from the arrow, the fainter and blurrier it gets. Each step
     is a quick scroll on a spring that settles softly, then a pause.
     The wordmark sits near the top of the window, so passed words scroll up off
     the page and the upcoming ones show below. There's no room for the arrow in
     the left margin, so it slides in and nudges the words over while the wheel
     turns, and slides away as the wordmark lands back exactly where it was. */
  async function wordWheel(ctx) {
    // DOT is drawn rather than typed: neither font has a solid circle, and the
    // fallback fonts' versions sit at the wrong size and height.
    var DOT = "\u25cf";
    var WORDS = [DOT, "graphics", "motion", "interaction", "technology"];
    var LEAVE_MS = 260; // the wordmark blurring and fading out
    var FAN_AT = 180; // the fan starts fading in (overlapping the end of that)
    var INTRO_MS = 340; // the fan fading in, the arrow sliding in
    var HOLD_MS = 620; // pause on each word
    var OUTRO_MS = 380; // arrow slides away, the fan folds back to the wordmark
    var STEP_PERIOD_MS = 260; // the spring each step rides: shorter is snappier
    var STEP_DAMPING = 0.72; // lower settles with more of a bounce
    var LINE_EM = 1.05; // spacing between words on the wheel
    var HUB_EM = 8; // how far left the wheel's hub is: nearer curves more
    var FADE = 0.45; // each word further out keeps this share of the opacity
    var BLUR_PX = 1.8; // blur added per word further out
    var LEAVE_BLUR_PX = 4; // blur the wordmark fades out through
    var NUDGE_PX = 3; // how far the arrow gets pushed as the wheel turns
    var FRAME_MS = 1000 / 120;
    var STEP_MS = 0.25;

    var brand = ctx.brand;
    var home = ctx.segs.map(function (seg) {
      return seg.textContent;
    }).join("");
    var words = WORDS.concat([home]);
    var last = words.length - 1;
    var fontPx = parseFloat(window.getComputedStyle(brand).fontSize);
    var hub = HUB_EM * fontPx;
    var perWord = (LINE_EM * fontPx) / hub; // radians between neighbouring words
    var markH = 0.93 * fontPx; // the arrow's height
    var arrowW = markH * (104.06 / 91.94); // at the arrow's own proportions
    var arrowGap = 0.26 * fontPx;
    var shiftFull = arrowW + arrowGap;

    // Hide the real wordmark (it keeps its space) and lay the wheel over it.
    var position = brand.style.position;
    brand.style.position = "relative";
    ctx.clips.forEach(function (clip) {
      clip.style.visibility = "hidden";
    });
    var stage = document.createElement("span");
    stage.setAttribute("aria-hidden", "true");
    stage.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;white-space:nowrap;";
    var boxH = brand.getBoundingClientRect().height;
    var dotD = 0.5 * markH; // the dot: half the arrow's height, on the same line
    /* Room above and below each word for its ascenders and descenders. The
       wordmark's line-height is tight enough that a g or p hangs below the word's
       box, and Safari crops a filtered element to its box -- every word here
       carries a blur filter -- cutting the descenders off. Padded out and shifted
       back by the same amount, the letters stay exactly where they were.
       Content-box, so the padding is added to a set height rather than taken out
       of it -- the site's border-box would crop the bottom of the dot. */
    var pad = 0.3 * fontPx;

    function lineEl(text, origin) {
      var el = document.createElement("span");
      el.style.cssText =
        "position:absolute;left:0;top:" + (-pad).toFixed(2) + "px;" +
        "padding:" + pad.toFixed(2) + "px 0;box-sizing:content-box;" +
        "will-change:transform,opacity,filter;" +
        (origin ? "transform-origin:" + origin + ";" : "");
      if (text === DOT) {
        // A solid circle, centred on the same line as the arrow.
        el.style.width = dotD.toFixed(2) + "px";
        el.style.height = boxH.toFixed(2) + "px";
        var dot = document.createElement("span");
        dot.style.cssText =
          "position:absolute;left:0;border-radius:50%;background:currentColor;" +
          "width:" + dotD.toFixed(2) + "px;height:" + dotD.toFixed(2) + "px;" +
          "top:" + (pad + (boxH - dotD) / 2).toFixed(2) + "px;";
        el.appendChild(dot);
      } else {
        el.textContent = text;
      }
      stage.appendChild(el);
      return el;
    }
    var leaving = lineEl(home); // the wordmark as it blends out
    var lines = words.map(function (word) {
      return lineEl(word, -hub + "px 50%");
    });
    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    /* SlimArrow, cropped to the arrow plus a small margin: while it animates it's
       drawn into a layer the size of its box, which would shave the antialiased
       edges off an arrow cropped flush. The box grows by the margin so the arrow
       itself keeps its size and place. */
    var ARROW_MARGIN = 3; // in the arrow's own units
    var perUnit = markH / 91.94;
    var edge = ARROW_MARGIN * perUnit;
    arrow.setAttribute(
      "viewBox",
      (12.82 - ARROW_MARGIN) + " " + (36.72 - ARROW_MARGIN) + " " +
        (104.06 + 2 * ARROW_MARGIN) + " " + (91.94 + 2 * ARROW_MARGIN)
    );
    arrow.setAttribute("width", (arrowW + 2 * edge).toFixed(2));
    arrow.setAttribute("height", (markH + 2 * edge).toFixed(2));
    // In the site's green, so the pointer reads apart from the black words.
    arrow.style.cssText =
      "position:absolute;overflow:visible;color:var(--ink);" +
      "left:" + (-edge).toFixed(2) + "px;top:" + ((boxH - markH) / 2 - edge).toFixed(2) + "px;";
    arrow.innerHTML =
      '<path fill="currentColor" d="M92.59,90.4H12.82s0-15.42,0-15.42h79.81s0-6.29,0-6.29l-7.72-1.03c-4.84-.65-8.87-3.29-12.42-6.55' +
      'l-14.17-13.51,10.99-10.88,47.57,45.96-47.52,45.98-11.05-10.84,14.59-14.02c3.81-3.27,8.14-5.64,13.19-6.28l6.61-.84-.1-6.27Z"/>';
    stage.appendChild(arrow);
    brand.appendChild(stage);
    ctx.defer(function () {
      stage.remove();
      brand.style.position = position;
      ctx.clips.forEach(function (clip) {
        clip.style.visibility = "";
      });
    });

    function smootherstep(x) {
      return x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (6 * x - 15) + 10);
    }

    /* The scroll position, in words: 0 on the first of WORDS, `last` on
       milanelsen.com. Its target jumps one word at each step; the position
       follows on a spring, so every step is quick and settles softly. */
    var firstStep = FAN_AT + INTRO_MS + HOLD_MS * 0.8;
    var stepAt = [];
    for (var n = 0; n < last; n++) {
      stepAt.push(firstStep + n * HOLD_MS);
    }
    var outroAt = stepAt[last - 1] + HOLD_MS * 0.85;
    var w = (2 * Math.PI) / STEP_PERIOD_MS;
    var k = w * w;
    var c = 2 * STEP_DAMPING * w;
    var pos = 0;
    var vel = 0;
    var samples = [];
    var fastest = 1e-9;
    var nextFrame = 0;
    var t = 0;
    for (; t < 12000; t += STEP_MS) {
      if (t >= nextFrame) {
        samples.push({ t: t, pos: pos, vel: vel });
        nextFrame += FRAME_MS;
      }
      var target = 0;
      while (target < stepAt.length && t >= stepAt[target]) {
        target++;
      }
      vel += (k * (target - pos) - c * vel) * STEP_MS;
      pos += vel * STEP_MS;
      fastest = Math.max(fastest, Math.abs(vel));
      if (t > outroAt + OUTRO_MS && Math.abs(pos - last) < 0.002 && Math.abs(vel) < 0.00002) {
        break;
      }
    }
    samples.push({ t: t, pos: last, vel: 0 });
    var total = t;

    // The fan fading in. Only the intro: at the end the landed word stays.
    function fanIn(time) {
      return smootherstep((time - FAN_AT) / INTRO_MS);
    }
    // How present the arrow and the neighbouring words are: in, hold, out.
    function presence(time) {
      return fanIn(time) * (1 - smootherstep((time - outroAt) / OUTRO_MS));
    }

    var leavingFrames = [];
    var lineFrames = lines.map(function () {
      return [];
    });
    var arrowFrames = [];
    samples.forEach(function (f, i) {
      var offset = i === samples.length - 1 ? 1 : f.t / total;
      var gone = smootherstep(f.t / LEAVE_MS);
      leavingFrames.push({
        offset: offset,
        opacity: (1 - gone).toFixed(4),
        filter: "blur(" + (LEAVE_BLUR_PX * gone).toFixed(3) + "px)"
      });
      var fan = fanIn(f.t);
      var p = presence(f.t);
      var shift = shiftFull * p;
      lines.forEach(function (el, j) {
        var d = j - f.pos; // words from the arrow: negative above, positive below
        var near = Math.max(0, 1 - Math.abs(d)); // only the current word shows alone
        var opacity = fan * Math.pow(FADE, Math.abs(d)) * (p + (1 - p) * near);
        if (Math.abs(d) > 3.5) {
          opacity = 0;
        }
        lineFrames[j].push({
          offset: offset,
          transform: "translateX(" + shift.toFixed(2) + "px) rotate(" + (d * perWord).toFixed(5) + "rad)",
          opacity: opacity.toFixed(4),
          filter: "blur(" + (BLUR_PX * Math.abs(d) * p).toFixed(3) + "px)"
        });
      });
      arrowFrames.push({
        offset: offset,
        transform: "translateX(" + ((p - 1) * shiftFull + (NUDGE_PX * f.vel) / fastest).toFixed(2) + "px)",
        opacity: p.toFixed(4)
      });
    });

    var timing = { duration: total, fill: "both" };
    var anims = [ctx.animate(leaving, leavingFrames, timing)];
    lines.forEach(function (el, j) {
      anims.push(ctx.animate(el, lineFrames[j], timing));
    });
    anims.push(ctx.animate(arrow, arrowFrames, timing));
    await ctx.all(anims);
  }

  /* The letters drop out of the wordmark and fall under gravity -- each with a
     little tilt, spin and drift of its own -- until they're out past the bottom
     edge of the window. After a beat they burst back up like confetti, after the
     "zero gravity" reference, which isn't a gravity arc at all: things shoot up
     almost instantly, hang weightless for a moment, drifting and slowly turning,
     then drop away. Here the letters all appear, fading in, across a strip a
     few centimetres below the middle of the wordmark, and spray out of it like a
     confetti cannon -- a soft one: each lifts up past its own place, floats there
     at its own random angle, swaying like paper, then drops into place and lands
     with a small give. Everything random resolves to nothing on landing.
     The wordmark sits only about 10px below the top of the window, so most
     letters shoot out past its top edge and float there before dropping back in.
     The letters fly in a layer over the whole window -- see liftLetters().
     Everything random is rolled fresh on every run. */
  async function fallPop(ctx) {
    // The fall
    var GRAVITY = 0.006; // px/ms^2
    var FALL_SPREAD_MS = 220; // letters let go at random within this window
    var DRIFT = 0.06; // max sideways speed while falling, px/ms
    var SPIN = 0.09; // max spin while falling, deg/ms
    var GONE_MS = 160; // everything out of sight before the burst
    // The pop back up
    var BURST_MS = 180; // letters launch at random within this window -- a soft puff, not a bang
    var APPEAR_MS = 60; // a letter first shows up where it spawns, before it launches
    var FADE_MS = 420; // it fades in over this long from the moment it appears, well into the launch
    var SHOOT_MS = 420; // the launch: a gentle ease-out up to the top
    var FLOAT_MS = 150; // the weightless hang at the top...
    var FLOAT_JITTER_MS = 50; // ...give or take this much, per letter
    var FLOAT_RISE_PX = 2; // how far it keeps drifting up while it hangs
    var DROP_MS_PER_SQRT_PX = 24; // the drop into place takes longer from higher up,
    // in proportion to the square root of the height, as a real fall does
    var FLUTTER_EM = 0.14; // max side-to-side sway while it floats, like paper
    var FLUTTER_TURN = 8; // max rocking that goes with the sway, degrees
    var CM = 96 / 2.54; // CSS pixels in a centimetre
    var CANNON_CM = 2.5; // every letter reappears this far below the middle of the
    // wordmark, and sprays out from there like a confetti cannon...
    var CANNON_WIDTH_CM = 3; // ...somewhere across a muzzle this wide
    var PAST_MIN_EM = 0.6; // how far past their place they shoot...
    var PAST_MAX_EM = 1.6; // ...up to this far
    var SCATTER_EM = 0.45; // max sideways offset at the top of its flight
    var FLOAT_DRIFT_EM = 0.25; // max sideways drift while it hangs
    var TILT = 22; // max tilt it shoots up at, degrees
    var FLOAT_TURN = 16; // max extra turn while it hangs, degrees
    var START_SCALE = 0.8; // letters grow in from this size as they fade in
    var ABSORB_MS = 18; // the springy give on landing: longer sinks deeper
    var SETTLE_MS = 200;
    var FRAME_MS = 1000 / 120;

    function rand(lo, hi) {
      return lo + Math.random() * (hi - lo);
    }

    function smootherstep(u) {
      u = Math.min(Math.max(u, 0), 1);
      return u * u * u * (u * (u * 6 - 15) + 10);
    }

    var lifted = liftLetters(ctx);
    var fontPx = lifted.fontPx;
    var marks = lifted.marks;
    var copies = lifted.copies;

    var viewH = window.innerHeight;
    // The cannon's muzzle: below the middle of the wordmark.
    var cannonX =
      (Math.min.apply(null, marks.map(function (m) { return m.rect.left; })) +
        Math.max.apply(null, marks.map(function (m) { return m.rect.right; }))) / 2;
    var cannonDepth = CANNON_CM * CM;
    var flights = marks.map(function (m) {
      var drop = viewH - m.rect.top + m.rect.height + 20; // down to just out of view
      var letGo = rand(0, FALL_SPREAD_MS);
      var depth = cannonDepth; // reappears at the cannon, this far below its place
      var past = rand(PAST_MIN_EM, PAST_MAX_EM) * fontPx; // shoots this far past its place
      var dropMs = DROP_MS_PER_SQRT_PX * Math.sqrt(past);
      // A letter near the left edge can't drift out past it.
      var leftRoom = Math.max(0, m.rect.left - 4);
      var floatMs = FLOAT_MS + rand(-FLOAT_JITTER_MS, FLOAT_JITTER_MS);
      return {
        drop: drop,
        letGo: letGo,
        outAt: letGo + Math.sqrt((2 * drop) / GRAVITY),
        drift: rand(-DRIFT, DRIFT),
        spin: rand(-SPIN, SPIN),
        depth: depth,
        past: past,
        floatMs: floatMs,
        dropMs: dropMs,
        flightMs: APPEAR_MS + SHOOT_MS + floatMs + dropMs,
        landSpeed: (2 * past) / dropMs, // speed at the end of the drop, carried into the landing
        flutterX: rand(0.5, 1) * FLUTTER_EM * fontPx * (Math.random() < 0.5 ? -1 : 1),
        flutterTurn: rand(0.5, 1) * FLUTTER_TURN,
        flutterCycles: rand(0.8, 1.4), // sways per second
        flutterPhase: rand(0, 2 * Math.PI),
        // from somewhere across the cannon's muzzle
        startX: cannonX + rand(-0.5, 0.5) * CANNON_WIDTH_CM * CM - (m.rect.left + m.rect.width / 2),
        topX: Math.max(-leftRoom, rand(-SCATTER_EM, SCATTER_EM) * fontPx),
        floatX: rand(-FLOAT_DRIFT_EM, FLOAT_DRIFT_EM) * fontPx,
        startTilt: rand(-TILT, TILT),
        topTilt: rand(-TILT, TILT),
        floatTurn: rand(-FLOAT_TURN, FLOAT_TURN),
        launch: 0 // set once everyone's out
      };
    });
    var allOut = Math.max.apply(null, flights.map(function (f) { return f.outAt; }));
    flights.forEach(function (f) {
      f.launch = allOut + GONE_MS + rand(0, BURST_MS);
    });
    var total =
      Math.max.apply(null, flights.map(function (f) { return f.launch + f.flightMs; })) + SETTLE_MS;

    function place(f, t) {
      var x = 0;
      var y = 0;
      var r = 0;
      var scale = 1;
      var opacity = 1;
      if (t < f.launch) {
        // Falling from rest; once it's out of view it waits below, unseen.
        var s = Math.max(0, t - f.letGo);
        y = 0.5 * GRAVITY * s * s;
        if (y >= f.drop) {
          y = f.drop;
          opacity = 0;
        }
        x = f.drift * s;
        r = f.spin * s;
      } else {
        var tau = t - f.launch;
        if (tau < f.flightMs) {
          var topY = -f.past; // the top of its flight, just above its place
          var shootAt = APPEAR_MS;
          var floatStart = shootAt + SHOOT_MS;
          var floatEnd = floatStart + f.floatMs;
          // Fades in and grows from small from the moment it appears, well into
          // the launch, so it's seen lifting off rather than just being there.
          var fade = smootherstep(tau / FADE_MS);
          scale = START_SCALE + (1 - START_SCALE) * fade;
          opacity = fade;
          // A paper-like sway, easing in after the launch and out before landing.
          var sway = Math.sin(f.flutterPhase + (2 * Math.PI * f.flutterCycles * tau) / 1000);
          var swayIn = smootherstep((tau - shootAt) / SHOOT_MS);
          if (tau < shootAt) {
            // Shows up where it spawns, so you see where it starts before it goes.
            y = f.depth;
            x = f.startX;
            r = f.startTilt;
          } else if (tau < floatStart) {
            // The launch: a soft cubic ease-out, arriving at the top with no
            // speed left -- a puff of air rather than a blast.
            var u = (tau - shootAt) / SHOOT_MS;
            var shoot = 1 - Math.pow(1 - u, 3);
            y = f.depth + (topY - f.depth) * shoot;
            x = f.startX + (f.topX - f.startX) * shoot + f.flutterX * sway * swayIn;
            r = f.startTilt + (f.topTilt - f.startTilt) * shoot + f.flutterTurn * sway * swayIn;
          } else if (tau < floatEnd) {
            // Weightless: keeps drifting up a touch, sideways and turning slowly.
            var v = (tau - floatStart) / f.floatMs;
            var ease = Math.sin(Math.PI * v);
            y = topY - FLOAT_RISE_PX * ease * ease;
            x = f.topX + f.floatX * smootherstep(v) + f.flutterX * sway;
            r = f.topTilt + f.floatTurn * smootherstep(v) + f.flutterTurn * sway;
          } else {
            // The drop: from rest, accelerating like a fall, into place. Drift,
            // sway and tilt resolve on the way so it lands straight.
            var w = (tau - floatEnd) / f.dropMs;
            var sink = w * w;
            var settle = 1 - smootherstep(w);
            y = topY + (0 - topY) * sink;
            x = (f.topX + f.floatX + f.flutterX * sway) * settle;
            r = (f.topTilt + f.floatTurn + f.flutterTurn * sway) * settle;
          }
        } else {
          // Landed: it sinks a little with the speed it came down at and springs
          // back -- critically damped, so it settles without bouncing.
          var since = tau - f.flightMs;
          y = f.landSpeed * since * Math.exp(-since / ABSORB_MS);
        }
      }
      return {
        transform:
          "translate(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px) rotate(" + r.toFixed(2) + "deg) scale(" +
          scale.toFixed(4) + ")",
        opacity: opacity.toFixed(3)
      };
    }

    var timing = { duration: total, fill: "both" };
    await ctx.all(
      copies.map(function (el, n) {
        var f = flights[n];
        var frames = [];
        for (var t = 0; t < total; t += FRAME_MS) {
          // Reappearing is a jump, not a move: pin both sides of it to the same
          // instant, or the keyframes would slide the letter up through the page.
          if (t > f.launch && t - FRAME_MS <= f.launch) {
            var before = place(f, f.launch - 0.001);
            var after = place(f, f.launch);
            frames.push({ offset: f.launch / total, transform: before.transform, opacity: before.opacity });
            frames.push({ offset: f.launch / total, transform: after.transform, opacity: after.opacity });
          }
          var at = place(f, t);
          frames.push({ offset: t / total, transform: at.transform, opacity: at.opacity });
        }
        frames.push({ offset: 1, transform: "translate(0px, 0px) rotate(0deg) scale(1)", opacity: 1 });
        return ctx.animate(el, frames, timing);
      })
    );
  }

  /* After the "ANTINOMY" reference: the letters stretch down, one after another
     from left to right, each to its own random depth up to REACH_CM below the
     wordmark (never past the bottom of the window), hold there, then pull back
     up into shape in a looser order. The "." stays as it is.
     Not a scale -- that would blur the letters and fatten every horizontal
     stroke. Each letter is drawn sharp, at the screen's own resolution, into a
     canvas. It's cut across at two rows of pixels, one above and one below its
     middle, and each cut row is repeated downwards -- the same as cutting the
     outline there and extending it straight down, so the strokes become long
     clean lines and every curve keeps its exact shape. With a cut above and
     below, an "e" grows both above and below its crossbar and an "s" through
     both of its curves. Where the lower part of a letter splits into separate
     legs -- "m", "n" -- it's cut once, through the legs, and each leg stretches
     by its own random amount. See analyse(). */
  async function stretch(ctx) {
    var STRETCH_MS = 720; // one letter reaching all the way down
    var STRETCH_STAGGER_MS = 45; // the next letter to the right starts this much later
    var STRETCH_JITTER_MS = 30; // ...give or take up to this much
    var HOLD_MS = 260; // all of them at full stretch
    var RETURN_MS = 680; // one letter pulling back up
    var RETURN_SPREAD_MS = 420; // letters start pulling back at random within this window
    var REACH_CM = 5; // how far below the wordmark's baseline the longest reach...
    var REACH_VARIANCE = 0.75; // ...and each letter falls short of that by up to this share, at random
    var LEG_VARIANCE = 0.5; // each leg of an "m" or "n" falls short of its letter's reach by up to this...
    var LEG_MIN_GAP = 0.15; // ...and the legs of one letter differ by at least this share, never just a hair
    var CM = 96 / 2.54; // CSS pixels in a centimetre
    var OUT = [0.22, 1, 0.36, 1];
    var IN_OUT = [0.65, 0, 0.35, 1];
    var PAD = 2; // CSS px of room around each glyph in its canvas
    // Pairs drawn on a canvas look a touch tighter than the page's own text sets
    // them, and the second letter seems to jump towards the first as the
    // animation starts: it goes this many device pixels right instead.
    var NUDGE = { se: 1, co: 1 };

    var lifted = liftLetters(ctx);
    var layer = lifted.copies[0].parentNode;
    var style = window.getComputedStyle(ctx.brand);
    var font = style.fontStyle + " " + style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
    var dpr = window.devicePixelRatio || 1;
    var measure = document.createElement("canvas").getContext("2d");
    measure.font = font;
    var viewH = window.innerHeight;

    /* Where a glyph is cut, from its pixels:
       - cuts: two rows to repeat, the best above and the best below the
         letter's waist (see below), within its main body (so the dot above an
         "i" stays as it is). Best means: reaching across the letter's whole
         width, so both sides extend rather than one; changing little from the
         rows either side, so the lines run on from strokes as upright as
         possible; and no heavier than the letter's typical row, so never a
         crossbar or an arch top.
       - legs: where the lower part of the letter splits into separate upright
         strips all the way down, as in "m" and "n": the row they split at, each
         strip's columns and the one row to cut them at. Null when it doesn't. */
    function analyse(alpha, w, h) {
      var inkTop = h;
      var inkBottom = -1;
      var inkLeft = w;
      var inkRight = -1;
      var rowInk = [];
      for (var y = 0; y < h; y++) {
        rowInk[y] = 0;
        for (var x = 0; x < w; x++) {
          var a = alpha[y * w + x];
          rowInk[y] += a;
          if (a > 64) {
            inkTop = Math.min(inkTop, y);
            inkBottom = Math.max(inkBottom, y);
            inkLeft = Math.min(inkLeft, x);
            inkRight = Math.max(inkRight, x);
          }
        }
      }
      var inkW = Math.max(1, inkRight - inkLeft + 1);

      // The main body: the tallest run of rows with ink in them.
      var bodyTop = inkTop;
      var bodyBottom = inkTop;
      var start = -1;
      for (y = inkTop; y <= inkBottom + 1; y++) {
        var inked = y <= inkBottom && rowInk[y] > 255;
        if (inked && start < 0) {
          start = y;
        } else if (!inked && start >= 0) {
          if (y - start > bodyBottom - bodyTop) {
            bodyTop = start;
            bodyBottom = y;
          }
          start = -1;
        }
      }
      var inks = rowInk.slice(bodyTop, bodyBottom).sort(function (a, b) {
        return a - b;
      });
      var typical = inks[Math.floor(inks.length / 2)] || 1;

      function score(y) {
        var change = 0;
        var first = -1;
        var last = -1;
        for (var x = 0; x < w; x++) {
          var here = alpha[y * w + x];
          change += Math.abs(alpha[(y - 1) * w + x] - here) + Math.abs(alpha[(y + 1) * w + x] - here);
          if (here > 128) {
            if (first < 0) {
              first = x;
            }
            last = x;
          }
        }
        var span = first < 0 ? 0 : (last - first + 1) / inkW;
        return 3 * (1 - span) + (3 * change) / (255 * inkW) + 3 * Math.max(0, rowInk[y] / typical - 1.3);
      }
      function best(from, to) {
        var pick = Math.round((from + to) / 2);
        var lowest = Infinity;
        for (var y = Math.round(from); y <= Math.round(to); y++) {
          var s = score(y);
          if (s < lowest) {
            lowest = s;
            pick = y;
          }
        }
        return pick;
      }
      /* The waist: the heaviest band across the middle of the letter, if it has
         one -- the crossbar of an "e", the spine of an "s". One cut goes above
         it and one below, so both halves stretch and it stays in the middle;
         cut both above it and it ends up squashed at the bottom. Without one,
         the letter is simply split in half. */
      var bodyH = bodyBottom - bodyTop;
      var waistTop = Math.round(bodyTop + bodyH / 2);
      var waistBottom = waistTop - 1;
      var heaviest = -1;
      for (y = Math.round(bodyTop + 0.3 * bodyH); y <= Math.round(bodyTop + 0.7 * bodyH); y++) {
        if (heaviest < 0 || rowInk[y] > rowInk[heaviest]) {
          heaviest = y;
        }
      }
      if (rowInk[heaviest] > 1.3 * typical) {
        waistTop = heaviest;
        waistBottom = heaviest;
        while (rowInk[waistTop - 1] > 1.15 * typical) {
          waistTop--;
        }
        while (rowInk[waistBottom + 1] > 1.15 * typical) {
          waistBottom++;
        }
      }
      var upper = [bodyTop + 0.15 * bodyH, waistTop - 2];
      var lower = [waistBottom + 2, bodyBottom - 1 - 0.15 * bodyH];
      var cuts = [
        upper[1] >= upper[0] ? best(upper[0], upper[1]) : waistTop - 1,
        lower[1] >= lower[0] ? best(lower[0], lower[1]) : waistBottom + 1
      ];

      // Legs: grow a band upwards from the bottom of the ink while its columns
      // still fall into two or more separate strips.
      var legs = null;
      var used = new Uint8Array(w);
      for (y = inkBottom; y >= inkTop; y--) {
        for (x = 0; x < w; x++) {
          if (alpha[y * w + x] > 64) {
            used[x] = 1;
          }
        }
        var strips = [];
        for (x = 0; x < w; x++) {
          if (used[x] && (x === 0 || !used[x - 1])) {
            strips.push({ from: x, to: x + 1 });
          } else if (used[x]) {
            strips[strips.length - 1].to = x + 1;
          }
        }
        if (strips.length < 2) {
          break;
        }
        legs = { top: y, strips: strips };
      }
      if (legs && inkBottom - legs.top < 0.4 * (inkBottom - inkTop)) {
        legs = null;
      }
      if (legs) {
        // Each strip runs to halfway across the gaps either side, so the faint
        // edge pixels go with it.
        var s = legs.strips;
        var bounds = [0];
        for (var k = 1; k < s.length; k++) {
          bounds.push(Math.round((s[k - 1].to + s[k].from) / 2));
        }
        bounds.push(w);
        legs.strips = s.map(function (_, k) {
          return { from: bounds[k], to: bounds[k + 1] };
        });
        legs.cut = best(legs.top + 2, inkBottom - 0.15 * (inkBottom - legs.top));
      }
      return { cuts: cuts, legs: legs };
    }

    /* Each leg's share of its letter's stretch: random, within LEG_VARIANCE of
       the whole, at least LEG_MIN_GAP apart from each other, in random order. */
    function legLengths(count) {
      var gap = Math.min(LEG_MIN_GAP, LEG_VARIANCE / Math.max(1, count - 1));
      var room = LEG_VARIANCE - gap * (count - 1);
      var shares = [];
      for (var i = 0; i < count; i++) {
        shares.push(Math.random() * room);
      }
      shares.sort(function (a, b) {
        return a - b;
      });
      shares = shares.map(function (share, i) {
        return 1 - (share + i * gap);
      });
      for (i = shares.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = shares[i];
        shares[i] = shares[j];
        shares[j] = tmp;
      }
      return shares;
    }

    function reachLine(baseline) {
      var reach = REACH_CM * CM * (1 - Math.random() * REACH_VARIANCE);
      return Math.min(viewH, baseline + reach);
    }

    var letters = [];
    lifted.copies.forEach(function (el, n) {
      var ch = lifted.marks[n].ch;
      if (ch === ".") {
        return; // stays as it is, as its copy
      }
      // Where the glyph's pen starts, and its baseline: a zero-size inline-block
      // sits with its bottom on the baseline.
      var range = document.createRange();
      range.selectNodeContents(el);
      var penX = range.getBoundingClientRect().left;
      var marker = document.createElement("span");
      marker.style.cssText = "display:inline-block;width:0;height:0;";
      el.appendChild(marker);
      var baseline = marker.getBoundingClientRect().bottom;
      marker.remove();
      var m = measure.measureText(ch);

      // The canvas, snapped to whole device pixels so nothing gets resampled.
      var nudge = n > 0 ? (NUDGE[lifted.marks[n - 1].ch + ch] || 0) / dpr : 0;
      var left = Math.floor((penX - m.actualBoundingBoxLeft - PAD) * dpr) / dpr;
      var top = Math.floor((baseline - m.actualBoundingBoxAscent - PAD) * dpr) / dpr;
      var w = Math.ceil((penX + m.actualBoundingBoxRight + PAD - left) * dpr);
      var h = Math.ceil((baseline + m.actualBoundingBoxDescent + PAD - top) * dpr);
      var inkBottom = baseline + m.actualBoundingBoxDescent;
      var extend = Math.max(0, Math.round((reachLine(baseline) - inkBottom) * dpr));

      // The glyph itself, drawn once.
      var glyph = document.createElement("canvas");
      glyph.width = w;
      glyph.height = h;
      var g = glyph.getContext("2d");
      g.scale(dpr, dpr);
      g.font = font;
      g.fillStyle = style.color;
      g.textBaseline = "alphabetic";
      g.fillText(ch, penX - left, baseline - top);
      var data = g.getImageData(0, 0, w, h).data;
      var alpha = new Uint8Array(w * h);
      for (var p = 0; p < w * h; p++) {
        alpha[p] = data[p * 4 + 3];
      }
      var shape = analyse(alpha, w, h);
      // The parts that stretch, each by its own amount: the legs, or the letter
      // as a whole, its stretch shared between its two cuts.
      var legShares = shape.legs ? legLengths(shape.legs.strips.length) : null;
      var parts = shape.legs
        ? shape.legs.strips.map(function (strip, k) {
            return {
              from: strip.from,
              to: strip.to,
              top: shape.legs.top,
              cuts: [shape.legs.cut],
              extend: Math.round(extend * legShares[k])
            };
          })
        : [{ from: 0, to: w, top: 0, cuts: shape.cuts, extend: extend }];

      var shown = document.createElement("canvas");
      shown.width = w;
      shown.height = h + extend;
      shown.style.cssText =
        "position:absolute;left:" + (left + nudge) + "px;top:" + top + "px;" +
        "width:" + w / dpr + "px;height:" + (h + extend) / dpr + "px;";
      layer.appendChild(shown);
      var out = shown.getContext("2d");
      out.imageSmoothingEnabled = false;

      el.style.visibility = "hidden";

      letters.push({
        glyph: glyph,
        out: out,
        w: w,
        h: h,
        top: shape.legs ? shape.legs.top : 0,
        parts: parts,
        extend: extend,
        drawn: -1
      });
    });

    /* Draws rows [part.top, h) of a glyph's columns [part.from, part.to) with
       `px` device pixels of stretch shared between the part's cuts: the rows
       down to each cut as they are, the cut row repeated, then on. Whole device
       pixels throughout, so nothing gets resampled. */
    function drawPart(l, part, px) {
      var o = l.out;
      var x0 = part.from;
      var cw = part.to - part.from;
      var from = part.top;
      var shift = 0;
      part.cuts.forEach(function (cut, i) {
        var add = Math.round((px * (i + 1)) / part.cuts.length) - Math.round((px * i) / part.cuts.length);
        if (cut > from) {
          o.drawImage(l.glyph, x0, from, cw, cut - from, x0, from + shift, cw, cut - from);
        }
        if (add > 0) {
          o.drawImage(l.glyph, x0, cut, cw, 1, x0, cut + shift, cw, add);
        }
        shift += add;
        from = cut;
      });
      o.drawImage(l.glyph, x0, from, cw, l.h - from, x0, from + shift, cw, l.h - from);
    }

    // Draws a letter at `k` of its full stretch: whatever is above its legs as
    // it is, then each part stretched by its own share.
    function draw(l, k) {
      var key = Math.round(k * 2000);
      if (key === l.drawn) {
        return;
      }
      l.drawn = key;
      l.out.clearRect(0, 0, l.w, l.h + l.extend);
      if (l.top > 0) {
        l.out.drawImage(l.glyph, 0, 0, l.w, l.top, 0, 0, l.w, l.top);
      }
      l.parts.forEach(function (part) {
        drawPart(l, part, Math.round(part.extend * k));
      });
    }

    // Retract in a shuffled order.
    var order = letters.map(function (_, n) {
      return n;
    });
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i];
      order[i] = order[j];
      order[j] = tmp;
    }
    var stretchAt = letters.map(function (_, n) {
      return Math.max(0, n * STRETCH_STAGGER_MS + (Math.random() * 2 - 1) * STRETCH_JITTER_MS);
    });
    var holdEnd = Math.max.apply(null, stretchAt) + STRETCH_MS + HOLD_MS;
    var returnAt = [];
    order.forEach(function (n, rank) {
      returnAt[n] = holdEnd + (rank / Math.max(1, order.length - 1)) * RETURN_SPREAD_MS;
    });
    var total = holdEnd + RETURN_SPREAD_MS + RETURN_MS;

    function reach(n, t) {
      if (t < stretchAt[n]) {
        return 0;
      }
      if (t < stretchAt[n] + STRETCH_MS) {
        return easeAt(OUT, (t - stretchAt[n]) / STRETCH_MS);
      }
      if (t < returnAt[n]) {
        return 1;
      }
      if (t < returnAt[n] + RETURN_MS) {
        return 1 - easeAt(IN_OUT, (t - returnAt[n]) / RETURN_MS);
      }
      return 0;
    }

    function render(t) {
      letters.forEach(function (l, n) {
        draw(l, reach(n, t));
      });
    }
    render(0);

    // Redrawn every frame, on a clock that's cancelled along with everything
    // else if the run is cut short.
    var clock = ctx.animate(layer, [{ opacity: 1 }, { opacity: 1 }], { duration: total });
    (function frame() {
      if (clock.playState !== "running" && clock.playState !== "pending") {
        return;
      }
      if (clock.currentTime !== null) {
        render(clock.currentTime);
      }
      window.requestAnimationFrame(frame);
    })();
    await ctx.all([clock]);
  }

  /* After two "repeater" references: copies of the wordmark tile the window in
     a grid lined up with it, flickering in like an old TV screen -- a few at
     first, then more and more, faster and faster -- hold, then flicker out
     until only the wordmark is left. Most copies simply switch on (and off)
     once, at a random moment. The rest flicker: the grid is redrawn in quick
     frames, and in each one a flickering copy is on or off at random, with the
     chance of being on climbing to certain (and back down at the end) -- plus
     the odd frame where they all dip or flash together, rows that flicker
     together, and now and then a clipped word. Hard cuts throughout; only the
     page behind blurs in and out softly. */
  async function grid(ctx) {
    var ROW_PITCH = 1.25; // rows, in line heights apart
    var MIN_GAP_EM = 0.5; // at least this much room between copies side by side
    var IN_MS = 1600; // the grid flickering in...
    var HOLD_MS = 1000; // ...holding, full...
    var OUT_MS = 600; // ...and flickering out
    var ACCEL = 3; // the build-up speeds up: by a share of the way in, that share to this power is on
    var FLICKERY = 0.35; // share of copies that flicker; the rest switch on and off once
    var FRAME_MS = 45; // the flicker's frame: a flickering copy can change once per frame
    var DIP = 0.04; // share of frames where the flickering copies all dip nearly dark...
    var FLASH = 0.04; // ...or flash nearly all on
    var ROW_JITTER = 0.12; // how much a row's chance of being on wanders from frame to frame
    var GLITCH = 0.08; // share of flickering copies coming on that show a clipped word instead
    var BLUR_PX = 1.5; // how much the page behind blurs while the grid is up
    var BLUR_MS = 250; // the blur coming on, and going off at the end

    var brand = ctx.brand;
    var style = window.getComputedStyle(brand);
    var home = ctx.segs.map(function (seg) {
      return seg.textContent;
    }).join("");
    var range = document.createRange();
    range.selectNodeContents(brand);
    var mark = range.getBoundingClientRect(); // the wordmark's text, as laid out
    var fontPx = parseFloat(style.fontSize);
    var viewW = window.innerWidth;
    var viewH = window.innerHeight;

    /* Two layers over the window: one that blurs the page behind, at a fixed
       strength and faded in and out by its opacity, and above it the grid.
       Kept apart so the blur isn't worked out again every time a copy changes.
       The wordmark gets blurred with the page, so a sharp copy stands in. */
    var root = document.createElement("div");
    root.setAttribute("aria-hidden", "true");
    root.style.cssText = "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:2147483000;";
    var backdrop = document.createElement("div");
    backdrop.style.cssText =
      "position:absolute;inset:0;opacity:0;will-change:opacity;" +
      "-webkit-backdrop-filter:blur(" + BLUR_PX + "px);backdrop-filter:blur(" + BLUR_PX + "px);";
    var layer = document.createElement("div");
    layer.style.cssText = "position:absolute;inset:0;contain:layout paint;";
    root.appendChild(backdrop);
    root.appendChild(layer);
    document.body.appendChild(root);
    ctx.clips.forEach(function (clip) {
      clip.style.visibility = "hidden";
    });
    ctx.defer(function () {
      root.remove();
      ctx.clips.forEach(function (clip) {
        clip.style.visibility = "";
      });
    });

    // One copy, not yet showing. The whole word is always there, switched on
    // and off -- or clipped short -- by visibility and a clip, which only
    // repaint, rather than by changing its text, which lays it out again.
    // Placed by its text rather than its box, so it lines up with the wordmark
    // exactly.
    var offset = null;
    function copy(x, y) {
      var el = document.createElement("span");
      el.textContent = home;
      el.style.cssText = "position:absolute;white-space:pre;line-height:normal;visibility:hidden;";
      ["fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "color", "textTransform"].forEach(
        function (prop) {
          el.style[prop] = style[prop];
        }
      );
      layer.appendChild(el);
      if (!offset) {
        el.style.left = "0px";
        el.style.top = "0px";
        var r = document.createRange();
        r.selectNodeContents(el);
        var box = r.getBoundingClientRect();
        offset = { x: box.left, y: box.top };
      }
      el.style.left = x - offset.x + "px";
      el.style.top = y - offset.y + "px";
      return el;
    }
    copy(mark.left, mark.top).style.visibility = "visible"; // the wordmark's stand-in

    // The grid: columns spread evenly between the wordmark's left margin and the
    // same margin on the right, rows down from the wordmark.
    var gap = MIN_GAP_EM * fontPx;
    var cols = Math.max(1, Math.floor((viewW - 2 * mark.left + gap) / (mark.width + gap)));
    var colPitch = cols > 1 ? (viewW - 2 * mark.left - mark.width) / (cols - 1) : 0;
    var rowPitch = ROW_PITCH * mark.height;
    var rows = Math.floor((viewH - mark.top - mark.height) / rowPitch) + 1;

    var copies = []; // [row][col], the wordmark's own place empty
    for (var r = 0; r < rows; r++) {
      copies.push([]);
      for (var c = 0; c < cols; c++) {
        copies[r].push(r === 0 && c === 0 ? null : copy(mark.left + c * colPitch, mark.top + r * rowPitch));
      }
    }

    // The frames, worked out up front as a list of changes to make: how much of
    // each copy shows from when -- 0 off, 1 the whole word, or clipped short.
    var events = []; // { t, el, shown }
    var showing = new Map();
    function show(el, t, shown) {
      if (showing.get(el) !== shown) {
        showing.set(el, shown);
        events.push({ t: t, el: el, shown: shown });
      }
    }
    var flickery = new Set();
    copies.forEach(function (row) {
      row.forEach(function (el) {
        if (!el) {
          return;
        }
        if (Math.random() < FLICKERY) {
          flickery.add(el);
        } else {
          // Steady: on once at a random moment, off once at another.
          show(el, IN_MS * Math.pow(Math.random(), 1 / ACCEL), 1);
          show(el, IN_MS + HOLD_MS + OUT_MS * Math.random(), 0);
        }
      });
    });
    function flickerFrame(t, chance) {
      var screen = Math.random() < DIP ? -0.8 : Math.random() < FLASH ? 0.5 : 0;
      copies.forEach(function (row) {
        var rowShift = (Math.random() * 2 - 1) * ROW_JITTER;
        row.forEach(function (el) {
          if (!flickery.has(el)) {
            return;
          }
          // Dips, flashes and row flicker scale with the chance, so they
          // don't bring on a crowd while it's still meant to be a few.
          var on = Math.random() < chance + (screen + rowShift) * Math.min(1, 2 * chance);
          show(el, t, !on ? 0 : Math.random() < GLITCH ? 0.15 + 0.7 * Math.random() : 1);
        });
      });
    }
    var OUT_AT = IN_MS + HOLD_MS;
    for (var t = 0; t < IN_MS; t += FRAME_MS) {
      flickerFrame(t, Math.pow(t / IN_MS, ACCEL));
    }
    copies.forEach(function (row) {
      row.forEach(function (el) {
        if (el) {
          show(el, IN_MS, 1);
        }
      });
    });
    for (t = OUT_AT; t < OUT_AT + OUT_MS; t += FRAME_MS) {
      flickerFrame(t, 1 - Math.pow((t - OUT_AT) / OUT_MS, 0.8));
    }
    copies.forEach(function (row) {
      row.forEach(function (el) {
        if (el) {
          show(el, OUT_AT + OUT_MS, 0);
        }
      });
    });

    events.sort(function (a, b) {
      return a.t - b.t;
    });
    var total = OUT_AT + OUT_MS + FRAME_MS;
    var next = 0;
    function apply(t) {
      while (next < events.length && events[next].t <= t) {
        var e = events[next];
        e.el.style.visibility = e.shown > 0 ? "visible" : "hidden";
        var clipped = e.shown > 0 && e.shown < 1;
        e.el.style.clipPath = clipped ? "inset(0 " + ((1 - e.shown) * 100).toFixed(1) + "% 0 0)" : "";
        next++;
      }
    }

    // The blur fading in and out doubles as the clock the grid is stepped
    // along by, every frame -- cancelled along with everything else if the
    // run is cut short.
    var clock = ctx.animate(
      backdrop,
      [
        { offset: 0, opacity: 0 },
        { offset: BLUR_MS / total, opacity: 1 },
        { offset: 1 - BLUR_MS / total, opacity: 1 },
        { offset: 1, opacity: 0 }
      ],
      { duration: total }
    );
    (function frame() {
      if (clock.playState !== "running" && clock.playState !== "pending") {
        return;
      }
      if (clock.currentTime !== null) {
        apply(clock.currentTime);
      }
      window.requestAnimationFrame(frame);
    })();
    await ctx.all([clock]);
  }

  /* Split-flap departure board, letter by letter: each letter flips a full turn
     over its horizontal axis, one after another from left to right, overshooting
     slightly before settling -- the flip travels along the wordmark as a wave. */
  async function flapFlip(ctx) {
    var SPIN_MS = 900;
    var STAGGER_MS = 45; // the next letter to the right starts this much later
    var letters = splitLetters(ctx);
    await ctx.all(
      letters.map(function (letter, i) {
        return ctx.animate(
          letter,
          [
            { transform: "perspective(600px) rotateX(0deg)" },
            { transform: "perspective(600px) rotateX(-360deg)" }
          ],
          { duration: SPIN_MS, delay: i * STAGGER_MS, easing: "cubic-bezier(0.34, 1.3, 0.64, 1)" }
        );
      })
    );
  }

  // While working on one animation: every hover plays it, whatever is enabled.
  // null for the random rotation -- set it back before publishing.
  var WORKING_ON = null;

  // Set "enabled" to false to take an animation out of the random rotation.
  var ANIMATIONS = {
    "spread-sweep": {
      run: spreadSweep,
      enabled: true,
      about: "spreads across the page, sweeps off to the right, rises back in"
    },
    "accordion": {
      run: accordion,
      enabled: true,
      about: "the letters string out right to the project list's edge like an accordion, and back"
    },
    "word-wheel": {
      run: wordWheel,
      enabled: true,
      about: "a word wheel: \u25cf, graphics, motion, interaction, technology, and back to milanelsen.com"
    },
    "fall-pop": {
      run: fallPop,
      enabled: true,
      about: "the letters fall out of the bottom of the window and burst back up into place like confetti"
    },
    "flap-flip": {
      run: flapFlip,
      enabled: true,
      about: "each letter flips a full turn, one after another, like a split-flap departure board"
    },
    "stretch": {
      run: stretch,
      enabled: true,
      about: "the letters stretch down, each by up to about 5cm, one after another, and pull back into shape"
    },
    "grid": {
      run: grid,
      enabled: true,
      about: "copies of the wordmark type themselves in all over the window in a grid, and clear away"
    }
  };
  var NAMES = Object.keys(ANIMATIONS);

  /* ------------------------------------------------------------------ core */

  /* What an animation receives:
       brand, clips (the three masks), segs (the three words inside them)
       animate(el, keyframes, timing)  el.animate(), tracked for cleanup
       all(animations)                 resolves when they have all finished
       wait(ms)                        resolves after a delay
       cancelAll()                     cancel everything started so far
       defer(fn)                       run fn once the animation has finished,
                                       to undo anything it changed besides
                                       animations -- e.g. splitLetters() */
  function createContext(brand, clips, segs) {
    var tracked = [];
    var deferred = [];
    return {
      brand: brand,
      clips: clips,
      segs: segs,
      animate: function (el, keyframes, timing) {
        var a = el.animate(keyframes, timing);
        tracked.push(a);
        return a;
      },
      all: function (animations) {
        return Promise.all(
          animations.map(function (a) {
            // finished rejects when an animation is cancelled; that is not an error.
            return a.finished.catch(function () {});
          })
        );
      },
      wait: function (ms) {
        return new Promise(function (resolve) {
          window.setTimeout(resolve, ms);
        });
      },
      cancelAll: function () {
        tracked.forEach(function (a) {
          a.cancel();
        });
        tracked = [];
      },
      defer: function (fn) {
        deferred.push(fn);
      },
      cleanUp: function () {
        this.cancelAll();
        deferred.splice(0).forEach(function (fn) {
          fn();
        });
      }
    };
  }

  function isKnown(name) {
    if (Object.prototype.hasOwnProperty.call(ANIMATIONS, name)) {
      return true;
    }
    console.warn('[wordmark] no animation called "' + name + '". Available: ' + NAMES.join(", "));
    return false;
  }

  function createPlayer(brand) {
    var clips = Array.prototype.slice.call(brand.querySelectorAll(".brand-clip"));
    var segs = Array.prototype.slice.call(brand.querySelectorAll(".brand-seg"));
    var playing = false;
    // Every animation ends with the wordmark back under a cursor that may never
    // have moved, and landing there fires mouseenter again -- so "not while
    // playing" alone would replay in a loop for as long as the cursor rests on it.
    // Instead, a run that ends under the cursor disarms hovering until the cursor
    // has actually been seen away from it (see the mousemove listener below).
    var armed = true;
    var pointer = null; // last known cursor position
    var last = null;
    var forced = null;
    var current = null; // the run playing, as a promise that settles when it's done

    function pick() {
      if (forced) {
        return forced;
      }
      var enabled = NAMES.filter(function (n) {
        return ANIMATIONS[n].enabled;
      });
      // Avoid a back-to-back repeat -- unless it's the only one enabled.
      var fresh = enabled.filter(function (n) {
        return n !== last;
      });
      var pool = fresh.length ? fresh : enabled;
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }

    /* Judged from the recorded coordinates rather than :hover, which browsers
       don't reliably refresh when an element moves under a cursor that hasn't.
       Uses the browser's own hit-testing, plus a couple of pixels of margin so a
       cursor resting exactly on an edge counts as on it. */
    function cursorOnWordmark() {
      if (!pointer) {
        return false;
      }
      var hit = document.elementFromPoint(pointer.x, pointer.y);
      if (hit && brand.contains(hit)) {
        return true;
      }
      var boxes = [brand].concat(clips, segs).map(function (el) {
        return el.getBoundingClientRect();
      });
      var edge = 2;
      return boxes.some(function (r) {
        return (
          pointer.x >= r.left - edge &&
          pointer.x <= r.right + edge &&
          pointer.y >= r.top - edge &&
          pointer.y <= r.bottom + edge
        );
      });
    }

    function run(name) {
      if (!name || playing) {
        return Promise.resolve(false);
      }
      playing = true;
      last = name;
      var ctx = createContext(brand, clips, segs);
      if (forced) {
        console.info('[wordmark] playing "' + name + '"');
      }

      current = Promise.resolve()
        .then(function () {
          return ANIMATIONS[name].run(ctx);
        })
        .catch(function (err) {
          console.error('[wordmark] "' + name + '" failed', err);
        })
        .then(function () {
          ctx.cleanUp();
          playing = false;
          current = null;
          armed = !cursorOnWordmark();
          return true;
        });
      return current;
    }

    /* Re-arming needs the cursor actually seen off the wordmark. Not mouseleave:
       whenever the page shifts under a still cursor -- even by a fraction of a
       pixel, as splitting and restoring the letters does -- browsers re-test
       what's under it and fire leave/enter events on their own, and a cursor
       resting on an edge flips between the two. Letting those re-arm made it
       loop. The browser's own re-tests report the unchanged position, which
       still reads as "on", so they can't re-arm it. */
    document.addEventListener("mousemove", function (e) {
      pointer = { x: e.clientX, y: e.clientY };
      if (!armed && !playing && !cursorOnWordmark()) {
        armed = true;
      }
    }, { passive: true });

    return {
      hover: function (e) {
        pointer = { x: e.clientX, y: e.clientY };
        if (!armed) {
          return Promise.resolve(false);
        }
        return run(pick());
      },
      play: function (name) {
        return isKnown(name) ? run(name) : Promise.resolve(false);
      },
      force: function (name) {
        if (name === null || name === undefined) {
          forced = null;
        } else if (isKnown(name)) {
          forced = name;
        }
        return forced;
      },
      // Settles once the run playing now has finished, or straight away.
      settled: function () {
        return current || Promise.resolve();
      },
      // No hovering until the cursor has been seen away from the wordmark.
      disarm: function () {
        armed = false;
      }
    };
  }

  function init() {
    var brand = document.querySelector(".brand");
    if (!brand || brand.querySelectorAll(".brand-clip").length < 3 || !brand.animate) {
      return;
    }
    var player = createPlayer(brand);

    /* The wordmark links home. Clicked mid-animation, it lets the animation
       finish before following the link, rather than cutting it off. And the
       page it lands on opens with the cursor resting on its wordmark, which
       would start a fresh animation straight away -- so it's told, and waits
       until the cursor has been off the wordmark first. */
    var ARRIVED = "wordmark-arrived";
    try {
      if (window.sessionStorage.getItem(ARRIVED)) {
        window.sessionStorage.removeItem(ARRIVED);
        player.disarm();
      }
    } catch (err) {
      // Storage blocked: the next page may start an animation on arrival.
    }
    brand.addEventListener("click", function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return; // opening in a new tab or window: nothing to wait for
      }
      try {
        window.sessionStorage.setItem(ARRIVED, "1");
      } catch (err) {
        // Storage blocked: see above.
      }
      e.preventDefault();
      var href = brand.href;
      player.settled().then(function () {
        window.location.href = href;
      });
    });

    var fromUrl = new URLSearchParams(window.location.search).get("wordmark") || WORKING_ON;
    if (fromUrl) {
      player.force(fromUrl);
    }

    // Always available from the console, for testing.
    window.wordmark = {
      list: function () {
        var out = {};
        NAMES.forEach(function (n) {
          out[n] = (ANIMATIONS[n].enabled ? "on  - " : "off - ") + ANIMATIONS[n].about;
        });
        return out;
      },
      play: player.play,
      force: player.force
    };

    // Hovering is off for visitors who asked for reduced motion; the console
    // helpers above still work, so it can be tested with that setting on.
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!(reduced && reduced.matches)) {
      brand.addEventListener("mouseenter", player.hover);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
