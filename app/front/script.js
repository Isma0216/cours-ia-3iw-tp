/* =========================================================
   Châtillon Boxing Club — ACSC92
   Interactions front
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Menu mobile (burger) ---------- */
  var burger = document.getElementById("burger");
  var mobilePanel = document.getElementById("mobilePanel");

  if (burger && mobilePanel) {
    burger.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.textContent = isOpen ? "✕" : "☰";
    });

    // Referme le menu quand on clique un lien
    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰";
      });
    });
  }

  /* ---------- 2. Onglets fiches disciplines ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".disc-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".disc-panel"));

  function activateTab(tab) {
    var targetId = tab.getAttribute("aria-controls");

    tabs.forEach(function (t) {
      t.setAttribute("aria-selected", String(t === tab));
    });

    panels.forEach(function (panel) {
      var isTarget = panel.id === targetId;
      panel.classList.toggle("active", isTarget);
      if (isTarget) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  tabs.forEach(function (tab, index) {
    // Clic
    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    // Navigation clavier (flèches gauche/droite, Home, Fin)
    tab.addEventListener("keydown", function (e) {
      var newIndex = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        newIndex = 0;
      } else if (e.key === "End") {
        newIndex = tabs.length - 1;
      }
      if (newIndex !== null) {
        e.preventDefault();
        tabs[newIndex].focus();
        activateTab(tabs[newIndex]);
      }
    });
  });

  /* ---------- 3. Lien de nav actif au scroll ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a")
  );
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = "#" + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
