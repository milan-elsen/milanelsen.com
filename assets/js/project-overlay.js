(function () {
  var FALLBACK_OVERLAY_TEMPLATE = [
    '<div class="project-overlay" data-project-overlay role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="project-overlay-title">',
    '  <button class="project-overlay-close" type="button" aria-label="Close project overlay" data-overlay-close>&times;</button>',
    '  <div class="project-overlay-shell">',
    '    <section class="project-overlay-row project-overlay-row--top" aria-label="Overlay navigation">',
    '      <article class="project-overlay-panel"><p class="project-overlay-panel-label">Time</p><p class="project-overlay-panel-value" data-overlay-time>—</p></article>',
    '      <article class="project-overlay-panel"><p class="project-overlay-panel-label">School Project</p><p class="project-overlay-panel-value" data-overlay-school-project>—</p></article>',
    '      <article class="project-overlay-panel"><p class="project-overlay-panel-label">Outcome</p><p class="project-overlay-panel-value" data-overlay-result>—</p></article>',
    '      <article class="project-overlay-panel project-overlay-panel--close"><p class="project-overlay-panel-label">Team</p><p class="project-overlay-panel-value" data-overlay-team>—</p></article>',
    "    </section>",
    '    <section class="project-overlay-main" aria-live="polite">',
    '      <div class="project-overlay-main-layout">',
    '        <div class="project-overlay-main-copy">',
    '          <h2 id="project-overlay-title" data-overlay-title>Project title</h2>',
    '          <p data-overlay-subtitle hidden>Project subtitle</p>',
    '          <p data-overlay-meta>Project discipline</p>',
    '          <p data-overlay-summary>Select a project card to load this overlay with project-specific content.</p>',
    '          <div class="project-overlay-link-row" data-overlay-links hidden></div>',
    "        </div>",
    '        <article class="project-overlay-main-gallery" aria-label="Project gallery"><div class="project-overlay-gallery-frame"><img class="project-overlay-gallery-image" data-overlay-gallery-image src="assets/img/gallery-placeholder-1.svg" alt=""><p class="project-overlay-gallery-caption" data-overlay-gallery-caption hidden></p></div><div class="project-overlay-gallery-controls" aria-label="Gallery navigation"><button class="project-overlay-gallery-nav project-overlay-gallery-nav--prev" type="button" aria-label="Previous image" data-overlay-gallery-prev><svg class="project-overlay-gallery-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 6.5L9 12l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></button><button class="project-overlay-gallery-nav project-overlay-gallery-nav--next" type="button" aria-label="Next image" data-overlay-gallery-next><svg class="project-overlay-gallery-nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 6.5L9 12l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></article>',
    '        <article class="project-overlay-main-placeholder" aria-label="Gallery placeholder" hidden><p>Visual documentation is being prepared and will be added here soon<span class="project-overlay-placeholder-ellipsis" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span><span class="visually-hidden">...</span></p></article>',
    "      </div>",
    '      <div class="project-overlay-four-grid" aria-label="Project details">',
    '        <article class="project-overlay-detail"><h3>Context</h3><p data-overlay-context>Project context appears here.</p></article>',
    '        <article class="project-overlay-detail"><h3>Approach</h3><p data-overlay-approach>Approach details appear here.</p></article>',
    '        <article class="project-overlay-detail"><h3>Tools &amp; Technologies</h3><p data-overlay-tools>—</p></article>',
    '        <article class="project-overlay-detail"><h3>Skills</h3><p data-overlay-skills>—</p></article>',
    "      </div>",
    "    </section>",
    "  </div>",
    "</div>",
    '<div class="project-overlay-lightbox" data-overlay-lightbox hidden aria-hidden="true">',
    '  <div class="project-overlay-lightbox-stage"><button class="project-overlay-close" type="button" aria-label="Close image preview" data-overlay-lightbox-close>&times;</button><img class="project-overlay-lightbox-image" data-overlay-lightbox-image src="" alt=""><p class="project-overlay-lightbox-caption" data-overlay-lightbox-caption hidden></p><div class="project-overlay-lightbox-controls" data-overlay-lightbox-controls aria-label="Image navigation"><button class="project-overlay-gallery-nav project-overlay-lightbox-nav project-overlay-lightbox-nav--prev" type="button" aria-label="Previous image" data-overlay-lightbox-prev><svg class="project-overlay-gallery-nav-icon" viewBox="0 0 24 48" aria-hidden="true" focusable="false"><path d="M19 10L5 24l14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></button><button class="project-overlay-gallery-nav project-overlay-gallery-nav--next project-overlay-lightbox-nav project-overlay-lightbox-nav--next" type="button" aria-label="Next image" data-overlay-lightbox-next><svg class="project-overlay-gallery-nav-icon" viewBox="0 0 24 48" aria-hidden="true" focusable="false"><path d="M19 10L5 24l14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div>',
    "</div>",
  ].join("\n");

  function sanitizeImageSrc(src) {
    var value = String(src || "").trim();
    return value ? value : "";
  }

  /*
   * Modern image formats (JXL for HDR stills, AVIF) only decode in some browsers, so a
   * gallery item can carry fallbacks that are used where the primary format is unsupported.
   * Support is probed once with a 1x1 image per format rather than inferred from load
   * errors, so a single missing file never disables a format for the whole session.
   */
  var PROBE_SOURCES = {
    jxl: "data:image/jxl;base64,/woAkAEAE4gCALQAtZ8gAAAVKqOMG7yc6/nyQ4fFtI3rDG21bWEJY7O9MEhIOGwY4s3xwRCTShIA",
    avif: "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAAHwAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBIAAAAAAAE2NvbHJuY2x4AAEAAgAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAJ21kYXQSAAoHOAAGkBAgaTISGsJi5OYYYYFAAACQ",
  };
  var formatSupport = { jxl: null, avif: null };
  var formatProbeListeners = [];

  function imageExtension(src) {
    var match = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(String(src || ""));
    return match ? match[1].toLowerCase() : "";
  }

  function probeImageFormats() {
    Object.keys(PROBE_SOURCES).forEach(function (format) {
      var probe = new Image();
      probe.onload = function () {
        settleFormat(format, probe.naturalWidth > 0);
      };
      probe.onerror = function () {
        settleFormat(format, false);
      };
      probe.src = PROBE_SOURCES[format];
    });
  }

  function settleFormat(format, supported) {
    if (formatSupport[format] !== null) {
      return;
    }
    formatSupport[format] = !!supported;
    formatProbeListeners.forEach(function (listener) {
      try {
        listener();
      } catch (error) {
        /* a listener that throws must not block the others */
      }
    });
  }

  function onFormatProbe(listener) {
    if (typeof listener === "function") {
      formatProbeListeners.push(listener);
    }
  }

  /* Picks the first source this browser can decode; unprobed formats count as unsupported
     so nothing flashes a broken image, and the listener re-renders once probing settles. */
  function pickImageSource(item) {
    if (!item) {
      return "";
    }
    var sources = Array.isArray(item.sources) && item.sources.length ? item.sources : [item.src];
    for (var index = 0; index < sources.length; index += 1) {
      var candidate = sources[index];
      var support = formatSupport[imageExtension(candidate)];
      /* undefined: a format we never probe, such as JPEG, which every browser decodes. */
      if (support === true || support === undefined) {
        return candidate;
      }
    }
    return sources[sources.length - 1] || "";
  }

  function galleryItemSources(item, src) {
    var declared = item.fallback || item.fallbacks || item.fallbackSrc;
    var list = [src];
    if (typeof declared === "string") {
      list.push(sanitizeImageSrc(declared));
    } else if (Array.isArray(declared)) {
      declared.forEach(function (entry) {
        list.push(sanitizeImageSrc(entry));
      });
    } else if (PROBE_SOURCES[imageExtension(src)]) {
      /* No fallback declared: assume a sibling JPEG next to the modern original. */
      list.push(src.replace(/\.[a-z0-9]+(?=(?:[?#]|$))/i, ".jpg"));
    }
    return list.filter(Boolean);
  }

  function normalizeGalleryItem(item) {
    if (typeof item === "string") {
      var stringSrc = sanitizeImageSrc(item);
      return stringSrc ? { src: stringSrc, sources: galleryItemSources({}, stringSrc), subtitle: "" } : null;
    }

    if (item && typeof item === "object") {
      var src = sanitizeImageSrc(item.src || item.url || item.href || "");
      if (!src) {
        return null;
      }

      var subtitle = String(item.subtitle || item.caption || item.label || "").trim();
      return {
        src: src,
        sources: galleryItemSources(item, src),
        subtitle: subtitle,
      };
    }

    return null;
  }

  function normalizeGallery(galleryRaw) {
    if (Array.isArray(galleryRaw)) {
      var cleaned = galleryRaw.map(function (item) {
        return normalizeGalleryItem(item);
      }).filter(Boolean);
      if (cleaned.length > 0) {
        return cleaned;
      }
    } else if (typeof galleryRaw === "string") {
      var urls = galleryRaw.split("|").map(function (item) {
        var normalized = normalizeGalleryItem(item);
        return normalized;
      }).filter(Boolean);
      if (urls.length > 0) {
        return urls;
      }
    }
    return [
      { src: "assets/img/gallery-placeholder-1.svg", subtitle: "" },
      { src: "assets/img/gallery-placeholder-2.svg", subtitle: "" },
      { src: "assets/img/gallery-placeholder-3.svg", subtitle: "" },
    ];
  }

  function sanitizeHref(href) {
    var value = String(href || "").trim();
    if (!value) {
      return "";
    }

    if (/^(https?:|mailto:|tel:|\/|\.{1,2}\/|#)/i.test(value)) {
      return value;
    }

    return "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeTeamMembers(teamRaw) {
    var source = teamRaw;

    if (source && typeof source === "object" && !Array.isArray(source)) {
      if (Array.isArray(source.members)) {
        source = source.members;
      } else if (Array.isArray(source.people)) {
        source = source.people;
      } else if (typeof source.text === "string") {
        source = source.text;
      }
    }

    if (Array.isArray(source)) {
      return source.map(function (item) {
        if (typeof item === "string") {
          var text = item.trim();
          return text ? { name: text } : null;
        }

        if (item && typeof item === "object") {
          var name = String(item.name || item.label || item.title || "").trim();
          if (!name) {
            return null;
          }
          return {
            name: name,
            href: sanitizeHref(item.href || item.url || ""),
          };
        }

        return null;
      }).filter(Boolean);
    }

    if (typeof source === "string") {
      var text = source.trim();
      if (!text) {
        return [];
      }

      var lines = text.split(/\n+/).map(function (item) {
        return item.trim();
      }).filter(Boolean);

      if (lines.length > 1) {
        return lines.map(function (item) {
          return { name: item };
        });
      }

      return [{ name: text }];
    }

    return [];
  }

  function renderTeamMembers(teamRaw) {
    var members = normalizeTeamMembers(teamRaw);

    if (!members.length) {
      return "—";
    }

    return members.map(function (member) {
      var name = escapeHtml(member.name || "");
      if (!name) {
        return "";
      }

      if (member.href) {
        return '<a class="project-overlay-team-link" href="' + escapeHtml(member.href) + '" target="_blank" rel="noopener noreferrer">' + name + '<img class="external-icon" src="assets/icons/ArrowUpRight.svg" alt="" aria-hidden="true"></a>';
      }

      return '<span class="project-overlay-team-member">' + name + "</span>";
    }).filter(Boolean).join("<br>");
  }

  function normalizeMetaTags(metaRaw) {
    if (Array.isArray(metaRaw)) {
      return metaRaw.map(function (item) {
        return String(item || "").trim();
      }).filter(Boolean);
    }

    if (typeof metaRaw === "string") {
      return metaRaw.split(/[\n,]+/).map(function (item) {
        return item.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function renderMetaTags(metaRaw) {
    var tags = normalizeMetaTags(metaRaw);

    if (!tags.length) {
      return escapeHtml(String(metaRaw || "Project discipline"));
    }

    return tags.map(function (tag) {
      return '<span class="project-overlay-meta-pill"><span class="project-overlay-meta-marker" aria-hidden="true">●</span><span class="project-overlay-meta-label">' + escapeHtml(tag) + "</span></span>";
    }).join("");
  }

  function normalizeProjectLinks(linksRaw, legacyHref, legacyLabel) {
    if (Array.isArray(linksRaw)) {
      var cleaned = linksRaw.map(function (item) {
        if (typeof item === "string") {
          var stringHref = sanitizeHref(item);
          if (!stringHref) {
            return null;
          }
          return {
            label: "Open link",
            href: stringHref,
          };
        }

        if (item && typeof item === "object") {
          var href = sanitizeHref(item.href || item.url || "");
          if (!href) {
            return null;
          }

          return {
            label: String(item.label || item.name || item.title || "Open link").trim() || "Open link",
            href: href,
          };
        }

        return null;
      }).filter(Boolean);

      if (cleaned.length > 0) {
        return cleaned;
      }
    }

    var fallbackHref = sanitizeHref(legacyHref || "");
    if (fallbackHref) {
      return [{
        label: String(legacyLabel || "Open project link").trim() || "Open project link",
        href: fallbackHref,
      }];
    }

    return [];
  }

  function renderProjectLinks(links) {
    if (!Array.isArray(links) || links.length === 0) {
      return "";
    }

    return links.map(function (link) {
      var href = sanitizeHref(link && link.href ? link.href : "");
      if (!href) {
        return "";
      }
      var label = String(link.label || "Open link").trim() || "Open link";
      return '<a class="project-overlay-link" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer"><span>' + escapeHtml(label) + '</span><img class="external-icon" src="assets/icons/ArrowUpRight.svg" alt="" aria-hidden="true"></a>';
    }).filter(Boolean).join("");
  }

  function normalizeProjectDataShape(data) {
    if (!data || typeof data !== "object") {
      return {};
    }
    if (data.projects && typeof data.projects === "object") {
      return data.projects;
    }
    return data;
  }

  function parseCard(card, projectDataMap) {
    var meta = card.querySelector(".project-meta");
    var summary = card.querySelector("p:last-child");
    var gif = card.querySelector(".project-gif");
    var fallback = "Project";
    var title = fallback;

    if (gif) {
      var alt = gif.getAttribute("alt") || "";
      title = alt.replace(/^Preview of\s+/i, "").trim() || fallback;
    } else if (meta) {
      title = (meta.textContent || fallback).split(",")[0].trim() || fallback;
    }

    var cardMeta = meta ? meta.textContent.trim() : "Project discipline";
    var projectId = card.getAttribute("data-project-id") || "";
    var safeMap = normalizeProjectDataShape(projectDataMap);
    var projectData = projectId && safeMap[projectId] ? safeMap[projectId] : null;

    if (!projectData && safeMap && typeof safeMap === "object") {
      var normalizedTitle = (title || "").toLowerCase().replace(/\s+/g, " ").trim();
      Object.keys(safeMap).some(function (key) {
        var candidate = safeMap[key];
        var candidateTitle = candidate && candidate.title ? String(candidate.title).toLowerCase().replace(/\s+/g, " ").trim() : "";
        if (candidateTitle && candidateTitle === normalizedTitle) {
          projectData = candidate;
          return true;
        }
        return false;
      });
    }

    var fallbackPayload = {
      title: card.getAttribute("data-overlay-title") || title,
      subtitle: card.getAttribute("data-overlay-subtitle") || "",
      meta: card.getAttribute("data-overlay-meta") || cardMeta,
      summary: card.getAttribute("data-overlay-summary") || (summary ? summary.textContent.trim() : "Project details coming soon."),
      context: card.getAttribute("data-overlay-context") || "Context details coming soon.",
      approach: card.getAttribute("data-overlay-approach") || "Approach details coming soon.",
      outcome: card.getAttribute("data-overlay-outcome") || "Outcome details coming soon.",
      time: card.getAttribute("data-overlay-time") || "—",
      schoolProject: card.getAttribute("data-overlay-school-project") || "—",
      professor: card.getAttribute("data-overlay-professor") || card.getAttribute("data-overlay-supervising-professor") || "",
      result: card.getAttribute("data-overlay-result") || "—",
      team: card.getAttribute("data-overlay-team") || "—",
      tools: card.getAttribute("data-overlay-tools") || "—",
      skills: card.getAttribute("data-overlay-skills") || "—",
      gallery: normalizeGallery(card.getAttribute("data-overlay-gallery") || ""),
      state: card.getAttribute("data-overlay-state") || (card.classList.contains("is-archived") ? "Archive" : "Selected"),
      year: card.getAttribute("data-overlay-year") || "2026",
      linkHref: card.getAttribute("data-overlay-link-href") || "",
      linkLabel: card.getAttribute("data-overlay-link-label") || "Open project link",
      links: normalizeProjectLinks(card.getAttribute("data-overlay-links"), card.getAttribute("data-overlay-link-href"), card.getAttribute("data-overlay-link-label")),
    };

    if (!projectData) {
      if (!fallbackPayload.subtitle && fallbackPayload.meta.indexOf("\n") > -1) {
        var fallbackMetaParts = fallbackPayload.meta.split("\n");
        fallbackPayload.subtitle = (fallbackMetaParts.shift() || "").trim();
        fallbackPayload.meta = fallbackMetaParts.join("\n").trim() || "Project discipline";
      }
      return fallbackPayload;
    }

    var projectSubtitle = projectData.subtitle || fallbackPayload.subtitle;
    var projectMeta = projectData.meta || fallbackPayload.meta;
    if (!projectSubtitle && typeof projectMeta === "string" && projectMeta.indexOf("\n") > -1) {
      var projectMetaParts = projectMeta.split("\n");
      projectSubtitle = (projectMetaParts.shift() || "").trim();
      projectMeta = projectMetaParts.join("\n").trim() || "Project discipline";
    }

    return {
      title: projectData.title || fallbackPayload.title,
      subtitle: projectSubtitle,
      meta: projectMeta,
      summary: projectData.summary || fallbackPayload.summary,
      context: projectData.context || fallbackPayload.context,
      approach: projectData.approach || fallbackPayload.approach,
      outcome: projectData.outcome || fallbackPayload.outcome,
      time: projectData.time || fallbackPayload.time,
      schoolProject: projectData.schoolProject || projectData.semester || fallbackPayload.schoolProject,
      professor: projectData.supervisingProfessor || projectData.professor || fallbackPayload.professor,
      result: projectData.result || fallbackPayload.result,
      team: projectData.team || fallbackPayload.team,
      tools: projectData.tools || fallbackPayload.tools,
      skills: projectData.skills || fallbackPayload.skills,
      gallery: normalizeGallery(projectData.gallery || fallbackPayload.gallery),
      state: projectData.state || fallbackPayload.state,
      year: projectData.year || fallbackPayload.year,
      linkHref: projectData.linkHref || fallbackPayload.linkHref,
      linkLabel: projectData.linkLabel || fallbackPayload.linkLabel,
      links: normalizeProjectLinks(projectData.links, projectData.linkHref || fallbackPayload.linkHref, projectData.linkLabel || fallbackPayload.linkLabel),
      isPrivateProject: projectData.private === true || /^(independent|private)$/i.test(String(projectData.schoolProject || projectData.semester || "").trim()),
    };
  }

  function initOverlay() {
    if (!document.body.classList.contains("home-page")) {
      return;
    }

    var mount = document.getElementById("project-overlay-mount");
    if (!mount) {
      return;
    }

    probeImageFormats();

    function loadOverlayTemplate() {
      return fetch("assets/overlays/project-overlay.fragment", { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) {
            throw new Error("Overlay template load failed");
          }
          return res.text();
        })
        .catch(function () {
          return FALLBACK_OVERLAY_TEMPLATE;
        });
    }

    function loadProjectData() {
      function parseProjectDataText(text) {
        try {
          var cleaned = String(text || "").replace(/^\uFEFF/, "");
          return normalizeProjectDataShape(JSON.parse(cleaned || "{}"));
        } catch (err) {
          try {
            console.warn("Project JSON parse failed:", err);
          } catch (_ignore) {}
          return {};
        }
      }

      function requestJson(url, cacheMode) {
        return fetch(url, {
          cache: cacheMode,
        }).then(function (res) {
          if (!res.ok) {
            throw new Error("Project data request failed: " + res.status);
          }
          return res.text();
        });
      }

      var cacheBust = Date.now();
      var url = "assets/data/projects.json?cb=" + cacheBust;

      return requestJson(url, "reload")
        .then(function (rawText) {
          var parsed = parseProjectDataText(rawText);
          if (parsed && Object.keys(parsed).length > 0) {
            return parsed;
          }
          throw new Error("Project data is empty");
        })
        .catch(function () {
          return requestJson("assets/data/projects.json?cb=" + (cacheBust + 1), "no-store")
            .then(function (rawText) {
              var parsed = parseProjectDataText(rawText);
              return parsed && Object.keys(parsed).length > 0 ? parsed : {};
            })
            .catch(function () {
              return {};
            });
        });
    }

    Promise.all([loadOverlayTemplate(), loadProjectData()])
      .then(function (results) {
        var html = results[0];
        var projectDataMap = normalizeProjectDataShape(results[1] || {});
        mount.innerHTML = html;

        var overlay = mount.querySelector("[data-project-overlay]");
        var closePanel = mount.querySelector(".project-overlay-panel--close");
        var closeBtn = mount.querySelector("[data-overlay-close]");
        var titleEl = mount.querySelector("[data-overlay-title]");
        var subtitleEl = mount.querySelector("[data-overlay-subtitle]");
        var metaEl = mount.querySelector("[data-overlay-meta]");
        var summaryEl = mount.querySelector("[data-overlay-summary]");
        var contextEl = mount.querySelector("[data-overlay-context]");
        var approachEl = mount.querySelector("[data-overlay-approach]");
        var outcomeEl = mount.querySelector("[data-overlay-outcome]");
        var timeEl = mount.querySelector("[data-overlay-time]");
        var schoolProjectEl = mount.querySelector("[data-overlay-school-project]");
        var resultEl = mount.querySelector("[data-overlay-result]");
        var teamEl = mount.querySelector("[data-overlay-team]");
        var toolsEl = mount.querySelector("[data-overlay-tools]");
        var skillsEl = mount.querySelector("[data-overlay-skills]");
        var galleryImageEl = mount.querySelector("[data-overlay-gallery-image]");
        var galleryCaptionEl = mount.querySelector("[data-overlay-gallery-caption]");
        var galleryPrevBtn = mount.querySelector("[data-overlay-gallery-prev]");
        var galleryNextBtn = mount.querySelector("[data-overlay-gallery-next]");
        var galleryControlsEl = mount.querySelector(".project-overlay-gallery-controls");
        var galleryPanelEl = mount.querySelector(".project-overlay-main-gallery");
        var galleryPlaceholderEl = mount.querySelector(".project-overlay-main-placeholder");
        var lightboxEl = mount.querySelector("[data-overlay-lightbox]");
        var lightboxCloseBtn = mount.querySelector("[data-overlay-lightbox-close]");
        var lightboxImageEl = mount.querySelector("[data-overlay-lightbox-image]");
        var lightboxCaptionEl = mount.querySelector("[data-overlay-lightbox-caption]");
        var lightboxPrevBtn = mount.querySelector("[data-overlay-lightbox-prev]");
        var lightboxNextBtn = mount.querySelector("[data-overlay-lightbox-next]");
        var lightboxControlsEl = mount.querySelector("[data-overlay-lightbox-controls]");
        var linksEl = mount.querySelector("[data-overlay-links]");
        var isOpen = false;
        var isLightboxOpen = false;
        var galleryItems = [];
        var galleryIndex = 0;
        var lightboxReturnFocus = null;
        var lightboxHideTimer = 0;
        var lightboxOpenFrame = 0;
        var galleryCurrentSubtitle = "";
        var closeAnimationMs = 260;

        function formatProfessorLine(line) {
          var text = String(line || "").trim();
          if (!text) {
            return "";
          }
          var match = text.match(/^(.*?\bby:)\s*(.+)$/i);
          if (!match) {
            return escapeHtml(text);
          }
          return escapeHtml(match[1]) + ' <span class="project-overlay-professor-name">' + escapeHtml(match[2]) + "</span>";
        }

        function openCardOverlay(card) {
          if (!card) {
            return;
          }
          loadProjectData().then(function (freshMap) {
            if (freshMap && Object.keys(freshMap).length > 0) {
              projectDataMap = normalizeProjectDataShape(freshMap);
            }
            openOverlay(parseCard(card, projectDataMap));
          });
        }

        /* Last resort: if a chosen file is missing or corrupt, step through the remaining
           sources so a bad path degrades to the fallback instead of a broken image. */
        function setGalleryImageSrc(item, chosenSrc) {
          var sources = item && Array.isArray(item.sources) && item.sources.length ? item.sources : [chosenSrc];
          var attempt = Math.max(sources.indexOf(chosenSrc), 0);
          galleryImageEl.onerror = function () {
            if (attempt >= sources.length - 1) {
              galleryImageEl.onerror = null;
              return;
            }
            attempt += 1;
            galleryImageEl.setAttribute("src", sources[attempt]);
          };
          galleryImageEl.setAttribute("src", chosenSrc);
        }

        function renderGallery() {
          if (!galleryImageEl) {
            return;
          }

          var hasImages = galleryItems.length > 0;
          var current = hasImages ? galleryItems[galleryIndex] : { src: "assets/img/gallery-placeholder-1.svg", subtitle: "" };
          var currentSrc = pickImageSource(current) || "assets/img/gallery-placeholder-1.svg";
          var currentSubtitle = current && current.subtitle ? String(current.subtitle).trim() : "";
          setGalleryImageSrc(current, currentSrc);
          galleryImageEl.setAttribute("alt", (titleEl ? titleEl.textContent : "Project") + " gallery image");
          if (galleryCaptionEl) {
            if (currentSubtitle) {
              galleryCaptionEl.textContent = currentSubtitle;
              galleryCaptionEl.hidden = false;
            } else {
              galleryCaptionEl.textContent = "";
              galleryCaptionEl.hidden = true;
            }
          }
          galleryCurrentSubtitle = currentSubtitle;
          warmNeighbours();
          var canOpenLightbox = hasImages && !/gallery-placeholder-\d+\.svg$/i.test(currentSrc);
          galleryImageEl.classList.toggle("is-clickable", canOpenLightbox);
          galleryImageEl.setAttribute("tabindex", canOpenLightbox ? "0" : "-1");
          galleryImageEl.setAttribute("role", canOpenLightbox ? "button" : "img");
          galleryImageEl.setAttribute("aria-label", canOpenLightbox ? "Open image in full window preview" : (titleEl ? titleEl.textContent : "Project") + " gallery image");

          var canNavigate = galleryItems.length > 1;
          if (galleryControlsEl) {
            galleryControlsEl.hidden = !canNavigate;
            galleryControlsEl.style.display = canNavigate ? "" : "none";
          }
          if (galleryPrevBtn) {
            galleryPrevBtn.disabled = !canNavigate;
          }
          if (galleryNextBtn) {
            galleryNextBtn.disabled = !canNavigate;
          }
        }

        /* Probing is async, so an overlay opened in the first moments after load may have
           picked the fallback; re-render once the answer is in. */
        onFormatProbe(function () {
          if (isOpen) {
            renderGallery();
          }
        });

        function stepGallery(delta) {
          if (galleryItems.length < 2) {
            return;
          }
          galleryIndex = (galleryIndex + delta + galleryItems.length) % galleryItems.length;
          renderGallery();
        }

        function updateOverlayLayoutMode() {
          if (!overlay || !overlay.classList) {
            return;
          }

          if (!isOpen) {
            overlay.classList.remove("project-overlay--scrolling");
            return;
          }

          var shell = mount.querySelector(".project-overlay-shell");
          if (!shell) {
            overlay.classList.remove("project-overlay--scrolling");
            return;
          }

          var needsScroll = shell.scrollHeight > overlay.clientHeight - 2;
          overlay.classList.toggle("project-overlay--scrolling", !!needsScroll);
        }

        /* The CSS sizes the image from its aspect ratio so it fills the free space, larger
           or smaller than its own pixels. */
        function syncLightboxRatio() {
          if (lightboxImageEl.naturalWidth > 0 && lightboxImageEl.naturalHeight > 0) {
            lightboxImageEl.style.setProperty("--lightbox-ratio", String(lightboxImageEl.naturalWidth / lightboxImageEl.naturalHeight));
          }
        }

        function setLightboxContent(src, alt, subtitle) {
          resetZoom();
          lightboxImageEl.setAttribute("src", src);
          lightboxImageEl.setAttribute("alt", alt || "");
          syncLightboxRatio();
          if (lightboxCaptionEl) {
            var text = String(subtitle || "").trim();
            lightboxCaptionEl.textContent = text;
            lightboxCaptionEl.hidden = !text;
          }
        }

        /* The lightbox mirrors the gallery, so stepping it moves both in step and the
           overlay behind shows the same image once the preview closes. */
        function stepLightbox(delta) {
          if (!isLightboxOpen || galleryItems.length < 2) {
            return;
          }
          stepGallery(delta);
          setLightboxContent(
            galleryImageEl.getAttribute("src") || "",
            galleryImageEl.getAttribute("alt") || "",
            galleryCurrentSubtitle
          );
        }

        function neighbourSource(delta) {
          if (galleryItems.length < 2) {
            return "";
          }
          var item = galleryItems[(galleryIndex + delta + galleryItems.length) % galleryItems.length];
          return pickImageSource(item) || "";
        }

        /* Fetches and decodes the pictures on either side ahead of time, so a slide never
           starts with a half-loaded picture or decodes one mid-animation. The cache keeps
           the decoded images alive; it only ever holds this project's few pictures. */
        var decodedImages = {};

        function warmImage(src) {
          if (!src || decodedImages[src]) {
            return;
          }
          var image = new Image();
          image.decoding = "async";
          image.src = src;
          decodedImages[src] = image;
          if (image.decode) {
            image.decode().catch(function () {});
          }
        }

        function warmNeighbours() {
          warmImage(neighbourSource(1));
          warmImage(neighbourSource(-1));
        }

        /* Resolves once `image` can be drawn, or after `ms` at the latest. */
        function whenDecoded(image, ms) {
          var decoded = image.decode ? image.decode().catch(function () {}) : Promise.resolve();
          return Promise.race([decoded, new Promise(function (resolve) { window.setTimeout(resolve, ms); })]);
        }

        /* Carousel like a phone's photo viewer: during a horizontal drag the picture follows
           the finger exactly, with the neighbouring picture (a throwaway "peek" image in the
           same box) entering from the side it moves away from. On release it completes when
           dragged past a quarter of the width or flicked, and springs back otherwise, so
           reversing the drag cancels it. Buttons and keys run the same slide. Vertical drags
           still scroll (touch-action: pan-y on the gallery), and the click a drag leaves
           behind is swallowed so it doesn't open the lightbox or press an arrow. */
        function createCarousel(imgEl, options) {
          var gap = 24;
          var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          var peek = null;
          var peekDelta = 0;
          var settling = null;
          var drag = null;
          var swallowClick = false;

          /* One "page" of the carousel: the width of the area the picture sits in (the whole
             screen in the lightbox, the frame in the overlay), so the outgoing picture
             always leaves it completely, however narrow the picture itself is. */
          function boxWidth() {
            return Math.max(imgEl.offsetWidth, imgEl.parentNode.clientWidth) + gap;
          }

          function removePeek() {
            if (peek && peek.parentNode) {
              peek.parentNode.removeChild(peek);
            }
            peek = null;
            peekDelta = 0;
          }

          function ensurePeek(delta) {
            if (peek && peekDelta === delta) {
              return peek;
            }
            removePeek();
            var src = options.neighbour(delta);
            if (!src) {
              return null;
            }
            peek = document.createElement("img");
            peek.className = imgEl.className;
            ["is-zoomed", "is-dragging", "is-clickable"].forEach(function (name) {
              peek.classList.remove(name);
            });
            peek.classList.add("project-overlay-carousel-peek");
            peek.alt = "";
            peek.setAttribute("aria-hidden", "true");
            /* The copied class gives it the image's grid row, which would make an
               absolutely placed box measure from that row instead of the parent, and
               the lightbox image's transform transition, which would make it trail the
               finger. Inline styles beat both. */
            peek.style.gridArea = "auto";
            peek.style.transition = "none";
            peek.style.left = imgEl.offsetLeft + "px";
            peek.style.top = imgEl.offsetTop + "px";
            peek.style.width = imgEl.offsetWidth + "px";
            peek.style.height = imgEl.offsetHeight + "px";
            peek.style.transform = "translateX(" + delta * boxWidth() + "px)";
            peek.src = src;
            imgEl.parentNode.appendChild(peek);
            peekDelta = delta;
            return peek;
          }

          function place(offset) {
            imgEl.style.transition = "none";
            imgEl.style.transform = "translateX(" + offset + "px)";
            if (peek) {
              peek.style.transform = "translateX(" + (offset + peekDelta * boxWidth()) + "px)";
            }
          }

          /* Drops the offset without letting the CSS transform transition replay it. */
          function clearInline() {
            imgEl.style.transition = "none";
            imgEl.style.removeProperty("transform");
            void imgEl.offsetWidth;
            imgEl.style.removeProperty("transition");
            imgEl.parentNode.classList.remove("is-sliding");
          }

          function finishSettling() {
            if (settling) {
              settling();
            }
          }

          /* Animates from `offset` to rest (commit = false) or one picture over. The peek
             stays on top until the real image has decoded the same file, so the swap never
             flashes. */
          function settle(offset, delta, commit, speed) {
            var width = boxWidth();
            var target = commit ? -delta * width : 0;
            var duration = reduceMotion ? 0 : Math.max(160, Math.min(380, Math.abs(target - offset) / Math.max(speed || 0, 1.1)));
            var easing = "cubic-bezier(0.2, 0.7, 0.3, 1)";
            var animations = [];
            var done = false;

            function complete() {
              if (done) {
                return;
              }
              done = true;
              settling = null;
              animations.forEach(function (animation) {
                animation.cancel();
              });
              var leftover = peek;
              peek = null;
              peekDelta = 0;
              clearInline();
              if (!commit) {
                if (leftover && leftover.parentNode) {
                  leftover.parentNode.removeChild(leftover);
                }
                return;
              }
              options.commit(delta);
              if (!leftover) {
                return;
              }
              leftover.style.transform = "none";
              var drop = function () {
                if (leftover.parentNode) {
                  leftover.parentNode.removeChild(leftover);
                }
              };
              var decoded = imgEl.decode ? imgEl.decode().catch(function () {}) : Promise.resolve();
              Promise.race([decoded, new Promise(function (resolve) { window.setTimeout(resolve, 400); })]).then(drop);
            }

            settling = complete;
            if (!duration || !imgEl.animate) {
              complete();
              return;
            }
            imgEl.parentNode.classList.add("is-sliding");
            imgEl.style.transition = "none";
            imgEl.style.transform = "translateX(" + target + "px)";
            animations.push(imgEl.animate(
              [{ transform: "translateX(" + offset + "px)" }, { transform: "translateX(" + target + "px)" }],
              { duration: duration, easing: easing }
            ));
            if (peek) {
              var peekFrom = offset + peekDelta * width;
              var peekTo = target + peekDelta * width;
              peek.style.transform = "translateX(" + peekTo + "px)";
              animations.push(peek.animate(
                [{ transform: "translateX(" + peekFrom + "px)" }, { transform: "translateX(" + peekTo + "px)" }],
                { duration: duration, easing: easing }
              ));
            }
            animations[0].onfinish = complete;
            /* Hidden tabs pause animations; the timer still lands the slide. */
            window.setTimeout(complete, duration + 100);
          }

          function step(delta) {
            finishSettling();
            if (!options.enabled()) {
              options.commit(delta);
              return;
            }
            var incoming = ensurePeek(delta);
            if (!incoming) {
              options.commit(delta);
              return;
            }
            /* Waits (briefly) for the incoming picture so the slide runs on a drawn image;
               a press in the meantime lands this step at once and starts the next. */
            var started = false;
            settling = function () {
              if (!started) {
                started = true;
                settling = null;
                removePeek();
                options.commit(delta);
              }
            };
            whenDecoded(incoming, 250).then(function () {
              if (!started) {
                started = true;
                settle(0, delta, true, 0);
              }
            });
          }

          function cancelDrag() {
            if (drag && drag.active) {
              settle(drag.dx, peekDelta || 1, false, 0);
            }
            drag = null;
          }

          function attach(element) {
            element.addEventListener("touchstart", function (event) {
              if (event.touches.length !== 1) {
                cancelDrag();
                return;
              }
              finishSettling();
              if (!options.enabled() || !options.neighbour(1)) {
                drag = null;
                return;
              }
              var touch = event.touches[0];
              drag = {
                startX: touch.clientX,
                startY: touch.clientY,
                dx: 0,
                active: false,
                lastX: touch.clientX,
                lastTime: event.timeStamp,
                speed: 0
              };
            }, { passive: true });

            element.addEventListener("touchmove", function (event) {
              if (!drag || event.touches.length !== 1) {
                return;
              }
              var touch = event.touches[0];
              var dx = touch.clientX - drag.startX;
              var dy = touch.clientY - drag.startY;
              /* The browser commits to scrolling within the first few pixels, so while the
                 touch leans sideways it is claimed before that can happen; a clearly
                 vertical one is let go to scroll the page as usual. */
              if (!drag.active) {
                if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
                  drag = null;
                  return;
                }
                if (Math.abs(dx) >= Math.abs(dy) && event.cancelable) {
                  event.preventDefault();
                }
                if (Math.abs(dx) < 8) {
                  return;
                }
                drag.active = true;
                imgEl.parentNode.classList.add("is-sliding");
              }
              if (event.cancelable) {
                event.preventDefault();
              }
              var elapsed = event.timeStamp - drag.lastTime;
              if (elapsed > 0) {
                drag.speed = 0.6 * ((touch.clientX - drag.lastX) / elapsed) + 0.4 * drag.speed;
              }
              drag.lastX = touch.clientX;
              drag.lastTime = event.timeStamp;
              drag.dx = dx;
              if (dx !== 0) {
                ensurePeek(dx < 0 ? 1 : -1);
              }
              place(dx);
            }, { passive: false });

            function endDrag(event) {
              if (!drag) {
                return;
              }
              var current = drag;
              drag = null;
              if (!current.active) {
                return;
              }
              swallowClick = true;
              window.setTimeout(function () {
                swallowClick = false;
              }, 400);
              /* A pause before lifting the finger means no flick. */
              var speed = event.timeStamp - current.lastTime > 80 ? 0 : current.speed;
              var delta = current.dx < 0 ? 1 : -1;
              var along = -delta;
              var commit = event.type === "touchend" && (
                (Math.abs(current.dx) > boxWidth() * 0.25 && speed * along > -0.3) ||
                (Math.abs(current.dx) > 10 && speed * along > 0.35)
              );
              settle(current.dx, delta, commit, Math.abs(speed));
            }

            element.addEventListener("touchend", endDrag, { passive: true });
            element.addEventListener("touchcancel", endDrag, { passive: true });

            element.addEventListener("click", function (event) {
              if (swallowClick) {
                swallowClick = false;
                event.preventDefault();
                event.stopImmediatePropagation();
              }
            }, true);
          }

          return { attach: attach, step: step, finish: finishSettling };
        }

        /* Lightbox zoom: pinch on touch screens, trackpad pinch or the mouse wheel on
           desktop. A pinch works like Apple Photos: the picture stays pinned under the
           fingers, so moving them drags it along (on a trackpad, moving two fingers pans),
           it may shrink a little or sit off-centre while held, and it springs back to its
           normal size and place on release. Wheel and double-click zoom stay instead,
           within the image's bounds, can be dragged around, and reset on a second
           double-click, a step to another image or closing. */
        var zoomScale = 1;
        var zoomX = 0;
        var zoomY = 0;
        var zoomMax = 5;
        var zoomGestureMin = 0.5;

        function renderZoom() {
          if (zoomScale === 1 && zoomX === 0 && zoomY === 0) {
            lightboxImageEl.style.removeProperty("transform");
            lightboxImageEl.classList.remove("is-zoomed");
            return;
          }
          lightboxImageEl.classList.add("is-zoomed");
          lightboxImageEl.style.transform = "translate(" + zoomX + "px, " + zoomY + "px) scale(" + zoomScale + ")";
        }

        /* Settled zoom: at least normal size, and the enlarged image always covers its own
           unzoomed box. */
        function applyZoom() {
          if (zoomScale <= 1.001) {
            zoomScale = 1;
            zoomX = 0;
            zoomY = 0;
          } else {
            zoomScale = Math.min(zoomMax, zoomScale);
            var maxX = (lightboxImageEl.offsetWidth * (zoomScale - 1)) / 2;
            var maxY = (lightboxImageEl.offsetHeight * (zoomScale - 1)) / 2;
            zoomX = Math.max(-maxX, Math.min(maxX, zoomX));
            zoomY = Math.max(-maxY, Math.min(maxY, zoomY));
          }
          renderZoom();
        }

        /* Held gesture: free placement, only the scale is kept within reason. */
        function applyGestureZoom() {
          zoomScale = Math.max(zoomGestureMin, Math.min(zoomMax, zoomScale));
          renderZoom();
        }

        /* Removing the zoom transform lets the CSS transition ease the image home. */
        function resetZoom() {
          zoomScale = 1;
          zoomX = 0;
          zoomY = 0;
          renderZoom();
        }

        /* A new gesture starts from what is on screen, which may still be easing back
           from the last one. */
        function syncZoomFromScreen() {
          var rendered = new DOMMatrixReadOnly(window.getComputedStyle(lightboxImageEl).transform);
          zoomScale = rendered.a || 1;
          zoomX = rendered.e;
          zoomY = rendered.f;
        }

        /* Where the image's centre sits with no zoom applied. */
        function zoomRestCentre() {
          var rect = lightboxImageEl.getBoundingClientRect();
          var rendered = new DOMMatrixReadOnly(window.getComputedStyle(lightboxImageEl).transform);
          return { x: rect.left + rect.width / 2 - rendered.e, y: rect.top + rect.height / 2 - rendered.f };
        }

        /* Wheel steps: keeps the image point under (clientX, clientY) in place while the
           scale changes. */
        function zoomAt(nextScale, clientX, clientY, held) {
          var centre = zoomRestCentre();
          var offsetX = clientX - centre.x;
          var offsetY = clientY - centre.y;
          var scale = Math.max(held ? zoomGestureMin : 1, Math.min(zoomMax, nextScale));
          zoomX = offsetX - (scale * (offsetX - zoomX)) / zoomScale;
          zoomY = offsetY - (scale * (offsetY - zoomY)) / zoomScale;
          zoomScale = scale;
          if (held) {
            applyGestureZoom();
          } else {
            applyZoom();
          }
        }

        function bindLightboxZoom() {
          var touchCount = 0;
          var touchPinch = null;
          var pin = null;
          var panning = false;
          var panStartX = 0;
          var panStartY = 0;
          var panOriginX = 0;
          var panOriginY = 0;
          var mouseDragged = false;
          var trackpadHeld = false;
          var trackpadTimer = 0;

          /* Pins the image point under (clientX, clientY); moving that point later carries
             the image with it. */
          function pinAt(clientX, clientY) {
            syncZoomFromScreen();
            var centre = zoomRestCentre();
            pin = {
              centreX: centre.x,
              centreY: centre.y,
              pointX: (clientX - centre.x - zoomX) / zoomScale,
              pointY: (clientY - centre.y - zoomY) / zoomScale,
              scale: zoomScale
            };
          }

          function movePin(scale, clientX, clientY) {
            zoomScale = Math.max(zoomGestureMin, Math.min(zoomMax, scale));
            zoomX = clientX - pin.centreX - zoomScale * pin.pointX;
            zoomY = clientY - pin.centreY - zoomScale * pin.pointY;
            applyGestureZoom();
          }

          function releaseGesture() {
            pin = null;
            touchPinch = null;
            trackpadHeld = false;
            window.clearTimeout(trackpadTimer);
            resetZoom();
          }

          function touchGap(touches) {
            return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
          }

          function touchMid(touches) {
            return {
              x: (touches[0].clientX + touches[1].clientX) / 2,
              y: (touches[0].clientY + touches[1].clientY) / 2
            };
          }

          function startTouchPinch(touches) {
            var mid = touchMid(touches);
            pinAt(mid.x, mid.y);
            touchPinch = { gap: touchGap(touches) };
          }

          function startPan(clientX, clientY) {
            panning = true;
            panStartX = clientX;
            panStartY = clientY;
            panOriginX = zoomX;
            panOriginY = zoomY;
          }

          function movePan(clientX, clientY) {
            zoomX = panOriginX + clientX - panStartX;
            zoomY = panOriginY + clientY - panStartY;
            applyZoom();
          }

          /* A trackpad never says when the fingers lift; the events just stop. */
          function holdTrackpad() {
            trackpadHeld = true;
            window.clearTimeout(trackpadTimer);
            trackpadTimer = window.setTimeout(releaseGesture, 250);
          }

          /* Wheel: a mouse notch is ~100px of deltaY; trackpad pinches arrive as small
             ctrlKey deltas, so they get a stronger factor. While a trackpad pinch is held,
             plain wheel deltas are the two fingers moving and pan the image instead. */
          lightboxEl.addEventListener("wheel", function (event) {
            if (!isLightboxOpen) {
              return;
            }
            event.preventDefault();
            var unit = event.deltaMode === 1 ? 16 : 1;
            if (event.ctrlKey) {
              if (!trackpadHeld) {
                syncZoomFromScreen();
              }
              holdTrackpad();
              zoomAt(zoomScale * Math.exp(-event.deltaY * unit * 0.01), event.clientX, event.clientY, true);
              return;
            }
            if (trackpadHeld) {
              holdTrackpad();
              zoomX -= event.deltaX * unit;
              zoomY -= event.deltaY * unit;
              if (pin) {
                pin.centreX -= event.deltaX * unit;
                pin.centreY -= event.deltaY * unit;
              }
              applyGestureZoom();
              return;
            }
            zoomAt(zoomScale * Math.exp(-event.deltaY * unit * 0.0015), event.clientX, event.clientY, false);
          }, { passive: false });

          /* Safari reports trackpad pinches as gesture events rather than ctrlKey wheels.
             On iOS the same events accompany touch pinches, which the touch handlers own. */
          lightboxEl.addEventListener("gesturestart", function (event) {
            event.preventDefault();
            if (touchCount === 0) {
              trackpadHeld = true;
              window.clearTimeout(trackpadTimer);
              pinAt(event.clientX, event.clientY);
            }
          });

          lightboxEl.addEventListener("gesturechange", function (event) {
            event.preventDefault();
            if (touchCount === 0 && pin) {
              movePin(pin.scale * event.scale, event.clientX, event.clientY);
            }
          });

          lightboxEl.addEventListener("gestureend", function (event) {
            event.preventDefault();
            if (touchCount === 0) {
              releaseGesture();
            }
          });

          lightboxEl.addEventListener("touchstart", function (event) {
            touchCount = event.touches.length;
            if (touchCount >= 2) {
              panning = false;
              startTouchPinch(event.touches);
            } else if (touchCount === 1 && zoomScale > 1 && !event.target.closest("button")) {
              startPan(event.touches[0].clientX, event.touches[0].clientY);
            }
          }, { passive: true });

          lightboxEl.addEventListener("touchmove", function (event) {
            if (event.touches.length >= 2 && touchPinch) {
              event.preventDefault();
              var mid = touchMid(event.touches);
              movePin(pin.scale * touchGap(event.touches) / touchPinch.gap, mid.x, mid.y);
            } else if (event.touches.length === 1 && pin) {
              event.preventDefault();
              movePin(pin.scale, event.touches[0].clientX, event.touches[0].clientY);
            } else if (panning && event.touches.length === 1) {
              event.preventDefault();
              movePan(event.touches[0].clientX, event.touches[0].clientY);
            }
          }, { passive: false });

          /* Fingers lifting mid-pinch re-pin under the ones left, so nothing jumps; the
             last one lifting springs the image back. */
          function endTouch(event) {
            touchCount = event.touches.length;
            if (pin) {
              if (touchCount >= 2) {
                startTouchPinch(event.touches);
              } else if (touchCount === 1) {
                touchPinch = null;
                pinAt(event.touches[0].clientX, event.touches[0].clientY);
              } else {
                releaseGesture();
              }
              return;
            }
            if (touchCount === 0) {
              panning = false;
            }
          }

          lightboxEl.addEventListener("touchend", endTouch, { passive: true });
          lightboxEl.addEventListener("touchcancel", endTouch, { passive: true });

          lightboxImageEl.addEventListener("mousedown", function (event) {
            if (event.button !== 0 || zoomScale <= 1) {
              return;
            }
            event.preventDefault();
            mouseDragged = false;
            startPan(event.clientX, event.clientY);
            lightboxImageEl.classList.add("is-dragging");
          });

          window.addEventListener("mousemove", function (event) {
            if (!panning || touchCount) {
              return;
            }
            mouseDragged = true;
            movePan(event.clientX, event.clientY);
          });

          window.addEventListener("mouseup", function () {
            if (touchCount) {
              return;
            }
            panning = false;
            lightboxImageEl.classList.remove("is-dragging");
          });

          /* A drag released over the backdrop would otherwise count as a click on it and
             close the preview. */
          lightboxEl.addEventListener("click", function (event) {
            if (mouseDragged) {
              mouseDragged = false;
              event.stopImmediatePropagation();
            }
          }, true);

          lightboxImageEl.addEventListener("dblclick", function (event) {
            if (zoomScale > 1) {
              resetZoom();
            } else {
              zoomAt(2.5, event.clientX, event.clientY, false);
            }
          });
        }

        function updateLightboxNav() {
          var canNavigate = galleryItems.length > 1;
          [lightboxControlsEl, lightboxPrevBtn, lightboxNextBtn].forEach(function (element) {
            if (element) {
              element.hidden = !canNavigate;
            }
          });
        }

        function openLightbox(src, alt, subtitle) {
          if (!lightboxEl || !lightboxImageEl || !src) {
            return;
          }

          if (lightboxHideTimer) {
            window.clearTimeout(lightboxHideTimer);
            lightboxHideTimer = 0;
          }
          if (lightboxOpenFrame) {
            window.cancelAnimationFrame(lightboxOpenFrame);
            lightboxOpenFrame = 0;
          }

          lightboxReturnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
          setLightboxContent(src, alt, subtitle);
          updateLightboxNav();
          lightboxEl.hidden = false;
          lightboxEl.setAttribute("aria-hidden", "true");
          overlay.classList.add("project-overlay--lightbox-open");
          isLightboxOpen = true;
          lightboxOpenFrame = window.requestAnimationFrame(function () {
            lightboxOpenFrame = 0;
            if (!lightboxEl || !isLightboxOpen) {
              return;
            }
            lightboxEl.setAttribute("aria-hidden", "false");
            if (lightboxCloseBtn && typeof lightboxCloseBtn.focus === "function") {
              lightboxCloseBtn.focus({ preventScroll: true });
            }
          });
        }

        function closeLightbox() {
          if (!lightboxEl || !isLightboxOpen) {
            return;
          }

          if (lightboxCarousel) {
            lightboxCarousel.finish();
          }
          resetZoom();
          if (lightboxOpenFrame) {
            window.cancelAnimationFrame(lightboxOpenFrame);
            lightboxOpenFrame = 0;
          }
          lightboxEl.setAttribute("aria-hidden", "true");
          overlay.classList.remove("project-overlay--lightbox-open");
          isLightboxOpen = false;
          if (lightboxHideTimer) {
            window.clearTimeout(lightboxHideTimer);
          }
          lightboxHideTimer = window.setTimeout(function () {
            if (lightboxEl) {
              lightboxEl.hidden = true;
            }
            lightboxHideTimer = 0;
            if (lightboxReturnFocus && typeof lightboxReturnFocus.focus === "function" && document.contains(lightboxReturnFocus)) {
              lightboxReturnFocus.focus({ preventScroll: true });
            }
            lightboxReturnFocus = null;
          }, closeAnimationMs);
        }

        function setGalleryMode(showGallery) {
          if (galleryPanelEl) {
            galleryPanelEl.hidden = !showGallery;
            galleryPanelEl.style.display = showGallery ? "" : "none";
          }
          if (galleryPlaceholderEl) {
            galleryPlaceholderEl.hidden = showGallery;
            galleryPlaceholderEl.style.display = showGallery ? "none" : "";
          }
        }

        function hasRealGalleryItems(items) {
          if (!Array.isArray(items) || items.length === 0) {
            return false;
          }
          return items.some(function (src) {
            var currentSrc = typeof src === "string" ? src : (src && src.src ? src.src : "");
            return !/gallery-placeholder-\d+\.svg$/i.test(String(currentSrc || ""));
          });
        }

        function checkImageAvailable(src, callback) {
          if (!src) {
            callback(false);
            return;
          }
          var probe = new Image();
          probe.onload = function () {
            callback(true);
          };
          probe.onerror = function () {
            callback(false);
          };
          probe.src = src;
        }

        function ensureClosePanelBorder() {
          if (!closePanel) {
            return null;
          }

          var existing = closePanel.querySelector(".project-overlay-panel-border");
          if (existing) {
            return existing;
          }

          var ns = "http://www.w3.org/2000/svg";
          var svg = document.createElementNS(ns, "svg");
          svg.setAttribute("class", "project-overlay-panel-border");
          svg.setAttribute("aria-hidden", "true");
          var path = document.createElementNS(ns, "path");
          svg.appendChild(path);
          closePanel.appendChild(svg);
          return svg;
        }

        function renderClosePanelBorder() {
          if (!closePanel) {
            return;
          }

          var svg = ensureClosePanelBorder();
          if (!svg) {
            return;
          }

          var path = svg.querySelector("path");
          if (!path) {
            return;
          }

          var rect = closePanel.getBoundingClientRect();
          var width = rect.width;
          var height = rect.height;
          if (width < 2 || height < 2) {
            return;
          }

          var style = window.getComputedStyle(overlay || closePanel);
          var panelStyle = window.getComputedStyle(closePanel);
          var notch = parseFloat(style.getPropertyValue("--overlay-notch-size")) || 46;
          var closeSize = parseFloat(style.getPropertyValue("--overlay-close-size")) || 44;
          var radius = parseFloat(panelStyle.borderTopLeftRadius) || parseFloat(panelStyle.borderRadius) || 12;
          var isWidePlateau = window.innerWidth >= 1090;
          if (isWidePlateau) {
            closeSize = 35.2;
            notch = 40.1;
          }
          var inset = 0.5;
          var x0 = inset;
          var y0 = inset;
          var x1 = width - inset;
          var y1 = height - inset;
          var safeRadius = Math.max(2, Math.min(radius, (height - 1) / 2, (width - notch - 1) / 2));
          var buttonRadius = Math.max(safeRadius, Math.min(closeSize / 2, (width - 1) / 2, (height - 1) / 2));
          var safeNotch = Math.max(buttonRadius * 0.88, Math.min(notch, width - safeRadius * 1.8, height - safeRadius * 1.8));
          if (overlay) {
            overlay.style.setProperty("--overlay-notch-size-effective", safeNotch + "px");
          }

          var d = [
            "M", (x0 + safeRadius), y0,
            "H", (x1 - safeNotch - safeRadius),
            "Q", (x1 - safeNotch), y0, (x1 - safeNotch), (y0 + safeRadius),
            "V", (y0 + safeNotch - buttonRadius),
            "Q", (x1 - safeNotch), (y0 + safeNotch), (x1 - safeNotch + buttonRadius), (y0 + safeNotch),
            "H", (x1 - safeRadius),
            "Q", x1, (y0 + safeNotch), x1, (y0 + safeNotch + safeRadius),
            "V", (y1 - safeRadius),
            "Q", x1, y1, (x1 - safeRadius), y1,
            "H", (x0 + safeRadius),
            "Q", x0, y1, x0, (y1 - safeRadius),
            "V", (y0 + safeRadius),
            "Q", x0, y0, (x0 + safeRadius), y0,
            "Z",
          ].join(" ");

          svg.setAttribute("viewBox", "0 0 " + width + " " + height);
          path.setAttribute("d", d);
        }

        function openOverlay(payload) {
          if (!overlay) {
            return;
          }

          if (closePanel && closeBtn && closeBtn.parentElement !== closePanel) {
            closePanel.appendChild(closeBtn);
          }

          titleEl.textContent = payload.title;
          if (subtitleEl) {
            var subtitleText = payload.subtitle ? String(payload.subtitle).trim() : "";
            subtitleEl.textContent = subtitleText;
            subtitleEl.hidden = !subtitleText;
          }
          if (metaEl) {
            metaEl.innerHTML = renderMetaTags(payload.meta);
          }
          summaryEl.textContent = payload.summary;
          contextEl.textContent = payload.context;
          approachEl.textContent = payload.approach;
          if (outcomeEl) {
            outcomeEl.textContent = payload.outcome;
          }
          if (timeEl) {
            timeEl.textContent = payload.time;
          }
          if (schoolProjectEl) {
            var schoolText = payload.schoolProject ? String(payload.schoolProject).trim() : "";
            var professorText = payload.professor ? String(payload.professor).trim() : "";

            // Hide semester-style values (e.g. "Semester 4") per requested UI.
            if (/^semester\b/i.test(schoolText) || /^\d+$/.test(schoolText)) {
              schoolText = "";
            }

            var linesHtml = [];
            if (schoolText && schoolText !== "—") {
              linesHtml.push(escapeHtml(schoolText));
            }
            if (professorText && professorText !== "—") {
              professorText.split(/\n+/).forEach(function (line) {
                var formatted = formatProfessorLine(line);
                if (formatted) {
                  linesHtml.push(formatted);
                }
              });
            }

            schoolProjectEl.innerHTML = linesHtml.length ? linesHtml.join("<br>") : "—";
          }
          if (overlay) {
            overlay.classList.toggle("project-overlay--no-school", !!payload.isPrivateProject);
          }
          if (resultEl) {
            resultEl.textContent = payload.result;
          }
          if (teamEl) {
            teamEl.innerHTML = renderTeamMembers(payload.team);
          }
          if (toolsEl) {
            toolsEl.textContent = payload.tools;
          }
          if (skillsEl) {
            skillsEl.textContent = payload.skills;
          }
          galleryItems = payload.gallery && payload.gallery.length ? payload.gallery.slice() : [
            "assets/img/gallery-placeholder-1.svg",
            "assets/img/gallery-placeholder-2.svg",
            "assets/img/gallery-placeholder-3.svg",
          ];
          galleryIndex = 0;
          var showRealGallery = hasRealGalleryItems(galleryItems);
          setGalleryMode(showRealGallery);
          renderGallery();
          if (linksEl) {
            var renderedLinks = renderProjectLinks(payload.links);
            linksEl.innerHTML = renderedLinks;
            linksEl.hidden = !renderedLinks;
          }

          mount.hidden = false;
          requestAnimationFrame(function () {
            document.body.classList.add("project-overlay-open");
            overlay.setAttribute("aria-hidden", "false");
            document.dispatchEvent(new CustomEvent("project-overlay:open"));
            renderClosePanelBorder();
            isOpen = true;
            updateOverlayLayoutMode();
            closeLightbox();
          });
        }

        function closeOverlay() {
          if (!overlay || !isOpen) {
            return;
          }

          closeLightbox();
          if (galleryCarousel) {
            galleryCarousel.finish();
          }
          overlay.classList.remove("project-overlay--lightbox-open");
          overlay.classList.remove("project-overlay--scrolling");
          document.body.classList.remove("project-overlay-open");
          overlay.setAttribute("aria-hidden", "true");
          document.dispatchEvent(new CustomEvent("project-overlay:close"));
          isOpen = false;
          window.setTimeout(function () {
            mount.hidden = true;
          }, closeAnimationMs);
        }

        document.querySelectorAll(".home-page .project-card").forEach(function (card) {
          card.setAttribute("tabindex", "0");
          card.setAttribute("role", "button");
          card.setAttribute("aria-haspopup", "dialog");

          card.addEventListener("click", function () {
            openCardOverlay(card);
          });

          card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openCardOverlay(card);
            }
          });
        });

        var galleryCarousel = null;
        var lightboxCarousel = null;

        function slideGallery(delta) {
          if (galleryCarousel) {
            galleryCarousel.step(delta);
          } else {
            stepGallery(delta);
          }
        }

        function slideLightbox(delta) {
          if (!isLightboxOpen) {
            return;
          }
          if (lightboxCarousel) {
            lightboxCarousel.step(delta);
          } else {
            stepLightbox(delta);
          }
        }

        if (lightboxImageEl) {
          /* While enlarged, one finger pans the image instead of dragging the carousel. */
          lightboxCarousel = createCarousel(lightboxImageEl, {
            neighbour: neighbourSource,
            commit: stepLightbox,
            enabled: function () {
              return isLightboxOpen && zoomScale === 1;
            }
          });
          lightboxCarousel.attach(lightboxImageEl);
          if (lightboxEl) {
            bindLightboxZoom();
          }
          if (lightboxControlsEl) {
            lightboxCarousel.attach(lightboxControlsEl);
          }
          lightboxImageEl.addEventListener("load", syncLightboxRatio);
        }

        if (closeBtn) {
          closeBtn.addEventListener("click", closeOverlay);
        }

        if (galleryPrevBtn) {
          galleryPrevBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            slideGallery(-1);
          });
        }

        if (galleryNextBtn) {
          galleryNextBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            slideGallery(1);
          });
        }

        if (galleryImageEl) {
          galleryCarousel = createCarousel(galleryImageEl, {
            neighbour: neighbourSource,
            commit: stepGallery,
            enabled: function () {
              return !isLightboxOpen;
            }
          });
          galleryCarousel.attach(galleryImageEl);

          galleryImageEl.addEventListener("click", function () {
            if (!galleryImageEl.classList.contains("is-clickable")) {
              return;
            }
            openLightbox(galleryImageEl.getAttribute("src") || "", galleryImageEl.getAttribute("alt") || "", galleryCurrentSubtitle);
          });

          galleryImageEl.addEventListener("keydown", function (event) {
            if (!galleryImageEl.classList.contains("is-clickable")) {
              return;
            }
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openLightbox(galleryImageEl.getAttribute("src") || "", galleryImageEl.getAttribute("alt") || "", galleryCurrentSubtitle);
            }
          });
        }

        if (lightboxCloseBtn) {
          lightboxCloseBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            closeLightbox();
          });
        }

        if (lightboxPrevBtn) {
          lightboxPrevBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            slideLightbox(-1);
          });
        }

        if (lightboxNextBtn) {
          lightboxNextBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            slideLightbox(1);
          });
        }

        if (lightboxEl) {
          lightboxEl.addEventListener("click", function (event) {
            if (event.target === lightboxEl) {
              closeLightbox();
            }
          });
        }

        overlay.addEventListener("click", function (event) {
          if (isLightboxOpen) {
            return;
          }
          if (event.target === overlay) {
            closeOverlay();
          }
        });

        document.addEventListener("keydown", function (event) {
          if (isOpen && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            event.preventDefault();
            if (isLightboxOpen) {
              slideLightbox(event.key === "ArrowLeft" ? -1 : 1);
            } else {
              slideGallery(event.key === "ArrowLeft" ? -1 : 1);
            }
            return;
          }
          if (event.key === "Escape") {
            if (isLightboxOpen) {
              closeLightbox();
              return;
            }
            closeOverlay();
          }
        });

        window.addEventListener("resize", renderClosePanelBorder);
        window.addEventListener("resize", updateOverlayLayoutMode);
        renderClosePanelBorder();
      })
      .catch(function () {
        mount.hidden = true;
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOverlay);
  } else {
    initOverlay();
  }
})();
