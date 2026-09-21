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
 * below, so each can be worked on in isolation.
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
 *       wordmark.play("hop-wave")        play one now
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
     wordmark stretches across the page and closes up against the edge. The moment
     that last letter arrives it leads the way home, the rest following in turn --
     no pause at the far end.
     Each letter is simulated on a spring trailing its own guide, which is where
     the stretch and the soft landings come from, and letters push each other
     apart if they touch rather than passing through. Both directions run as one
     simulation so the turn at the far end carries momentum instead of stopping.
     The landings are kept gentle on purpose: with arrivals spread out, a bouncier
     one sends each letter's rebound into the next arriving, and they clatter. */
  async function accordion(ctx) {
    var TRAVEL_MS = 520; // one letter's guide, from setting off to arriving
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
    var homeAt = null; // when the return starts: the moment the last letter arrives
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
        var back = homeAt === null ? 0 : smootherstep((t - homeAt - i * stagger) / TRAVEL_MS);
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
      var settled = homeAt !== null && t > homeAt + (n - 1) * stagger + TRAVEL_MS;
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
    var arrowW = 0.72 * fontPx;
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
    var markH = 0.62 * fontPx; // the arrow's height
    var dotD = 0.75 * markH; // the dot: three quarters of the arrow, on the same line
    /* Room above and below each word for its ascenders and descenders. The
       wordmark's line-height is tight enough that a g or p hangs below the word's
       box, and Safari crops a filtered element to its box -- every word here
       carries a blur filter -- cutting the descenders off. Padded out and shifted
       back by the same amount, the letters stay exactly where they were. */
    var pad = 0.3 * fontPx;

    function lineEl(text, origin) {
      var el = document.createElement("span");
      el.style.cssText =
        "position:absolute;left:0;top:" + (-pad).toFixed(2) + "px;padding:" + pad.toFixed(2) + "px 0;" +
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
    arrow.setAttribute("viewBox", "0 0 24 20");
    arrow.setAttribute("width", arrowW.toFixed(2));
    arrow.setAttribute("height", markH.toFixed(2));
    arrow.style.cssText =
      "position:absolute;left:0;overflow:visible;top:" + ((boxH - markH) / 2).toFixed(2) + "px;";
    arrow.innerHTML =
      '<path d="M1 10H21M13 2L21 10L13 18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="butt" stroke-linejoin="miter"/>';
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

  /* A Mexican wave: each word crouches, hops, and lands with a squash, one after
     another. The hop is kept small -- there's little room above the wordmark. */
  async function hopWave(ctx) {
    await ctx.all(
      ctx.segs.map(function (seg, i) {
        return ctx.animate(
          seg,
          [
            { offset: 0, transform: "translateY(0) scale(1, 1)" },
            { offset: 0.15, transform: "translateY(0) scale(1.08, 0.88)", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
            { offset: 0.45, transform: "translateY(-30%) scale(0.95, 1.06)", easing: "cubic-bezier(0.6, 0, 0.8, 0.4)" },
            { offset: 0.7, transform: "translateY(0) scale(1.1, 0.86)" },
            { offset: 0.85, transform: "translateY(0) scale(0.97, 1.03)" },
            { offset: 1, transform: "translateY(0) scale(1, 1)" }
          ].map(function (k) {
            k.transformOrigin = "50% 100%";
            return k;
          }),
          { duration: 700, delay: i * 110 }
        );
      })
    );
  }

  /* Split-flap departure board: each word flips a full turn over its horizontal
     axis, one after another, overshooting slightly before settling. */
  async function flapFlip(ctx) {
    await ctx.all(
      ctx.segs.map(function (seg, i) {
        return ctx.animate(
          seg,
          [
            { transform: "perspective(600px) rotateX(0deg)" },
            { transform: "perspective(600px) rotateX(-360deg)" }
          ],
          { duration: 900, delay: i * 120, easing: "cubic-bezier(0.34, 1.3, 0.64, 1)" }
        );
      })
    );
  }

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
    "hop-wave": {
      run: hopWave,
      enabled: false,
      about: "each word crouches, hops and lands with a squash, like a wave"
    },
    "flap-flip": {
      run: flapFlip,
      enabled: false,
      about: "each word flips a full turn, like a split-flap departure board"
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

      return Promise.resolve()
        .then(function () {
          return ANIMATIONS[name].run(ctx);
        })
        .catch(function (err) {
          console.error('[wordmark] "' + name + '" failed', err);
        })
        .then(function () {
          ctx.cleanUp();
          playing = false;
          armed = !cursorOnWordmark();
          return true;
        });
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
      }
    };
  }

  function init() {
    var brand = document.querySelector(".brand");
    if (!brand || brand.querySelectorAll(".brand-clip").length < 3 || !brand.animate) {
      return;
    }
    var player = createPlayer(brand);

    var fromUrl = new URLSearchParams(window.location.search).get("wordmark");
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
