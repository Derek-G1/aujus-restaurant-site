// Hamburger menu animation on click and toggle nav items
const hamburgerMenu = document.getElementById("hamburgerMenu");
const responsiveLinks = document.getElementById("responsiveLinks");
const mobileNavBreakpoint = 1024;

if (hamburgerMenu && responsiveLinks) {
  const closeMobileMenu = () => {
    responsiveLinks.classList.remove("showOnMobile");
    hamburgerMenu.classList.remove("hamActive");
    hamburgerMenu.setAttribute("aria-expanded", "false");
  };

  const toggleMobileMenu = () => {
    const isOpen = responsiveLinks.classList.toggle("showOnMobile");
    hamburgerMenu.classList.toggle("hamActive", isOpen);
    hamburgerMenu.setAttribute("aria-expanded", String(isOpen));
  };

  hamburgerMenu.setAttribute("aria-expanded", "false");

  hamburgerMenu.addEventListener("click", toggleMobileMenu);

  responsiveLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= mobileNavBreakpoint) {
        closeMobileMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileNavBreakpoint) {
      closeMobileMenu();
    }
  });
}

const menuDisplayContainer = document.querySelector(".menu--display-modes[data-display-mode]");
const menuDisplayControl = document.querySelector("[data-display-options]");

if (menuDisplayContainer && menuDisplayControl) {
  const storageKey = "aujus-menu-display-mode";
  const displayLabels = {
    standard: "Standard",
    comfortable: "Comfortable",
    compact: "Compact"
  };
  const displayToggle = menuDisplayControl.querySelector("[data-display-toggle]");
  const displayPanel = menuDisplayControl.querySelector("[data-display-panel]");
  const displayCurrent = menuDisplayControl.querySelector("[data-display-current]");
  const displayChoices = Array.from(menuDisplayControl.querySelectorAll("[data-display-choice]"));

  const isValidMode = (value) => Object.prototype.hasOwnProperty.call(displayLabels, value);

  const closeDisplayPanel = () => {
    if (!displayToggle || !displayPanel) {
      return;
    }

    displayPanel.hidden = true;
    displayToggle.setAttribute("aria-expanded", "false");
    menuDisplayControl.classList.remove("is-open");
  };

  const openDisplayPanel = () => {
    if (!displayToggle || !displayPanel) {
      return;
    }

    displayPanel.hidden = false;
    displayToggle.setAttribute("aria-expanded", "true");
    menuDisplayControl.classList.add("is-open");
  };

  const persistMode = (mode) => {
    try {
      window.localStorage.setItem(storageKey, mode);
    } catch (error) {
      console.warn("Unable to save menu display mode.", error);
    }
  };

  const applyDisplayMode = (mode, persist = false) => {
    const nextMode = isValidMode(mode) ? mode : "standard";
    menuDisplayContainer.dataset.displayMode = nextMode;

    if (displayCurrent) {
      displayCurrent.textContent = displayLabels[nextMode];
    }

    displayChoices.forEach((choice) => {
      const isActive = choice.dataset.displayChoice === nextMode;
      choice.classList.toggle("is-active", isActive);
      choice.setAttribute("aria-pressed", String(isActive));
    });

    if (persist) {
      persistMode(nextMode);
    }
  };

  const getStoredMode = () => {
    try {
      const storedMode = window.localStorage.getItem(storageKey);
      return isValidMode(storedMode) ? storedMode : "standard";
    } catch (error) {
      return "standard";
    }
  };

  applyDisplayMode(getStoredMode());
  closeDisplayPanel();

  if (displayToggle && displayPanel) {
    displayToggle.addEventListener("click", () => {
      if (displayPanel.hidden) {
        openDisplayPanel();
      } else {
        closeDisplayPanel();
      }
    });
  }

  displayChoices.forEach((choice) => {
    choice.addEventListener("click", () => {
      applyDisplayMode(choice.dataset.displayChoice, true);
      closeDisplayPanel();

      if (displayToggle) {
        displayToggle.focus();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!menuDisplayControl.contains(event.target)) {
      closeDisplayPanel();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && displayPanel && !displayPanel.hidden) {
      closeDisplayPanel();

      if (displayToggle) {
        displayToggle.focus();
      }
    }
  });
}

const hoursSummaryCard = document.getElementById("homeHoursSummaryCard");

if (hoursSummaryCard) {
  const hoursTargetId = hoursSummaryCard.dataset.scrollTarget;
  const hoursTarget = hoursTargetId ? document.getElementById(hoursTargetId) : null;

  const scrollToHoursSection = () => {
    if (!hoursTarget) {
      return;
    }

    hoursTarget.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  hoursSummaryCard.addEventListener("click", scrollToHoursSection);
  hoursSummaryCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToHoursSection();
    }
  });
}
