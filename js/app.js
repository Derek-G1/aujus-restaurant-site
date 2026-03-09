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

const errorHeadline = document.getElementById("errorHeadline");
const errorBody = document.getElementById("errorBody");
const errorCta = document.getElementById("errorCta");

if (errorHeadline && errorBody && errorCta) {
  const errorMessages = [
    {
      headline: "Whoops! This page got fully dipped.",
      body: "We couldn't find the page you were looking for. It might have gotten lost in the au jus, or someone already ate it.",
      button: "Return to the Beef",
      href: "/"
    },
    {
      headline: "Where's the beef?",
      body: "Definitely not here. The page you're looking for has gone missing, been moved, or eighty-sixed from the menu. Let's get you back to the good stuff.",
      button: "Return to Home",
      href: "/"
    },
    {
      headline: "Too much hot giardiniera?",
      body: "Looks like this page couldn't handle the heat and disappeared. Don't worry, we've got plenty of other things on the menu.",
      button: "Head Back Home",
      href: "/"
    },
    {
      headline: "Sandwich Not Found.",
      body: "We searched the kitchen, but the page you're looking for just isn't here.",
      button: "Return to Home",
      href: "/"
    },
    {
      headline: "This page got shredded.",
      body: "We looked for it high and low, but it's nowhere on the menu. Let's get you back to something delicious.",
      button: "Return Home",
      href: "/"
    },
    {
      headline: "The kitchen can't find that order.",
      body: "Looks like this page never made it out of the window. Head back and we'll get you something better.",
      button: "Back to Home",
      href: "/"
    },
    {
      headline: "Lost in the gravy.",
      body: "The page you wanted has slipped away into the au jus. Good news: the rest of the site is still hot and ready.",
      button: "Return to Home",
      href: "/"
    },
    {
      headline: "Wrong turn in Parma.",
      body: "You've landed somewhere that doesn't exist. Let's get you back to the real good stuff.",
      button: "Take Me Home",
      href: "/"
    },
    {
      headline: "This item isn't on the tray.",
      body: "The page you were looking for is missing, moved, or no longer being served.",
      button: "Back to the Menu",
      href: "/Menu.html"
    },
    {
      headline: "Order not ready.",
      body: "The page you asked for isn't here right now. But the rest of the site is still open.",
      button: "Return Home",
      href: "/"
    },
    {
      headline: "Beef not found.",
      body: "We checked the menu, the kitchen, and behind the counter. Nothing.",
      button: "Return to Home",
      href: "/"
    },
    {
      headline: "This page got the hot giardiniera treatment.",
      body: "A little too much heat, and now it's gone. Let's get you back somewhere safer.",
      button: "Head Home",
      href: "/"
    },
    {
      headline: "That page has been eighty-sixed.",
      body: "It's no longer available, but we've still got plenty worth checking out.",
      button: "Go Back Home",
      href: "/"
    },
    {
      headline: "Not on the menu.",
      body: "The page you're looking for isn't here, but there's still plenty to dig into.",
      button: "Return Home",
      href: "/"
    },
    {
      headline: "Someone already ate this page.",
      body: "We got here too late. Let's get you back to something that's still being served.",
      button: "Back to Home",
      href: "/"
    },
    {
      headline: "This page took a dip and never came back.",
      body: "We couldn't find what you were looking for, but the rest of the site is still fully loaded.",
      button: "Return to the Beef",
      href: "/"
    },
    {
      headline: "Page not on the menu.",
      body: "Looks like that link doesn't exist anymore.",
      button: "Return Home",
      href: "/"
    },
    {
      headline: "Oops. Wrong sandwich.",
      body: "That page isn't here, but we can still point you to the good stuff.",
      button: "Back Home",
      href: "/"
    }
  ];

  const now = new Date();
  const currentDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((currentDay - startOfYear) / 86400000);
  const messageIndex = dayOfYear % errorMessages.length;
  const currentMessage = errorMessages[messageIndex];

  errorHeadline.textContent = currentMessage.headline;
  errorBody.textContent = currentMessage.body;
  errorCta.textContent = currentMessage.button;
  errorCta.setAttribute("href", currentMessage.href);
}
