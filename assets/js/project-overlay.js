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
    '  <div class="project-overlay-lightbox-stage"><button class="project-overlay-close" type="button" aria-label="Close image preview" data-overlay-lightbox-close>&times;</button><img class="project-overlay-lightbox-image" data-overlay-lightbox-image src="" alt=""><p class="project-overlay-lightbox-caption" data-overlay-lightbox-caption hidden></p></div>',
    "</div>",
  ].join("\n");

  function sanitizeImageSrc(src) {
    var value = String(src || "").trim();
    return value ? value : "";
  }

  function normalizeGalleryItem(item) {
    if (typeof item === "string") {
      var stringSrc = sanitizeImageSrc(item);
      return stringSrc ? { src: stringSrc, subtitle: "" } : null;
    }

    if (item && typeof item === "object") {
      var src = sanitizeImageSrc(item.src || item.url || item.href || "");
      if (!src) {
        return null;
      }

      var subtitle = String(item.subtitle || item.caption || item.label || "").trim();
      return {
        src: src,
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
        var linksEl = mount.querySelector("[data-overlay-links]");
        var projectGifs = Array.prototype.slice.call(document.querySelectorAll(".project-gif[data-gif]"));
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

        function buildStillFromGifSource(img, callback) {
          if (!img) {
            callback("");
            return;
          }

          var gifSrc = img.getAttribute("data-gif") || "";
          if (!gifSrc) {
            callback("");
            return;
          }

          var probe = new Image();
          probe.decoding = "async";
          probe.loading = "eager";

          probe.addEventListener("load", function () {
            try {
              var canvas = document.createElement("canvas");
              canvas.width = probe.naturalWidth || img.naturalWidth || 1;
              canvas.height = probe.naturalHeight || img.naturalHeight || 1;
              var ctx = canvas.getContext("2d");
              if (!ctx) {
                callback("");
                return;
              }
              ctx.drawImage(probe, 0, 0, canvas.width, canvas.height);
              var still = canvas.toDataURL("image/png");
              img.setAttribute("data-still-src", still);
              callback(still);
            } catch (err) {
              callback("");
            }
          });

          probe.addEventListener("error", function () {
            callback("");
          });

          probe.src = gifSrc;
        }

        function renderGallery() {
          if (!galleryImageEl) {
            return;
          }

          var hasImages = galleryItems.length > 0;
          var current = hasImages ? galleryItems[galleryIndex] : { src: "assets/img/gallery-placeholder-1.svg", subtitle: "" };
          var currentSrc = current && current.src ? current.src : "assets/img/gallery-placeholder-1.svg";
          var currentSubtitle = current && current.subtitle ? String(current.subtitle).trim() : "";
          galleryImageEl.setAttribute("src", currentSrc);
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
          lightboxImageEl.setAttribute("src", src);
          lightboxImageEl.setAttribute("alt", alt || "");
          if (lightboxCaptionEl) {
            var captionText = String(subtitle || "").trim();
            if (captionText) {
              lightboxCaptionEl.textContent = captionText;
              lightboxCaptionEl.hidden = false;
            } else {
              lightboxCaptionEl.textContent = "";
              lightboxCaptionEl.hidden = true;
            }
          }
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

        function freezeProjectGifs() {
          projectGifs.forEach(function (img) {
            if (!img) {
              return;
            }
            var currentSrc = img.getAttribute("src") || "";
            if (!img.hasAttribute("data-overlay-prev-src")) {
              img.setAttribute("data-overlay-prev-src", currentSrc);
            }
            var still = img.getAttribute("data-still-src");
            if (still) {
              img.setAttribute("src", still);
              return;
            }

            if (img.getAttribute("data-freeze-pending") === "true") {
              return;
            }

            img.setAttribute("data-freeze-pending", "true");
            buildStillFromGifSource(img, function (generatedStill) {
              img.removeAttribute("data-freeze-pending");
              if (!generatedStill) {
                return;
              }
              if (document.body.classList.contains("project-overlay-open")) {
                img.setAttribute("src", generatedStill);
              }
            });
          });
        }

        function restoreProjectGifs() {
          projectGifs.forEach(function (img) {
            if (!img || !img.hasAttribute("data-overlay-prev-src")) {
              return;
            }
            var still = img.getAttribute("data-still-src") || "";
            var previous = img.getAttribute("data-overlay-prev-src") || "";
            if (still) {
              img.setAttribute("src", still);
            } else if (previous) {
              img.setAttribute("src", previous);
            }
            img.removeAttribute("data-overlay-prev-src");
          });
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
            freezeProjectGifs();
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
          overlay.classList.remove("project-overlay--lightbox-open");
          overlay.classList.remove("project-overlay--scrolling");
          document.body.classList.remove("project-overlay-open");
          overlay.setAttribute("aria-hidden", "true");
          restoreProjectGifs();
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

        if (closeBtn) {
          closeBtn.addEventListener("click", closeOverlay);
        }

        if (galleryPrevBtn) {
          galleryPrevBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            stepGallery(-1);
          });
        }

        if (galleryNextBtn) {
          galleryNextBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            stepGallery(1);
          });
        }

        if (galleryImageEl) {
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
          if (isOpen && !isLightboxOpen && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
            event.preventDefault();
            stepGallery(event.key === "ArrowLeft" ? -1 : 1);
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
