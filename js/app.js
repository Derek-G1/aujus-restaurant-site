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

  hamburgerMenu.setAttribute("role", "button");
  hamburgerMenu.setAttribute("tabindex", "0");
  hamburgerMenu.setAttribute("aria-controls", "responsiveLinks");
  hamburgerMenu.setAttribute("aria-expanded", "false");
  hamburgerMenu.setAttribute("aria-label", "Toggle navigation menu");

  hamburgerMenu.addEventListener("click", toggleMobileMenu);
  hamburgerMenu.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMobileMenu();
    }
  });

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

const contactSubmitBtn = document.getElementById("contactSubmitBtn");
if (contactSubmitBtn != null) {
  contactSubmitBtn.addEventListener("click", validateForm);
}

const contactForm = document.getElementById("contactForm");
if (contactForm != null) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

function sendForm() {
  const submitBtn = document.getElementById("contactSubmitBtn");
  
  // Disable button to prevent double clicks
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending...";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../php/sendTheMailTo.php", true);
  const data = new FormData(document.getElementById("contactForm"));

  xhr.send(data);

  xhr.onload = function() {
    if (xhr.status != 200) {
      submitBtn.innerHTML = "Error - Try Again";
      submitBtn.disabled = false;
    } else {
      // Success State
      const alertModal = document.getElementById("alertModal");
      if (alertModal) alertModal.style.display = "block";
      document.getElementsByTagName("html")[0].style.overflow = "hidden";
      submitBtn.innerHTML = "Sent!";
    }
  };
}

// Helper to clear previous red borders/text
function resetValidation() {
  const inputs = ["name", "email", "phone", "message"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    const label = document.getElementById(id + "Label");
    if (el) el.style.border = ""; 
    if (label) {
      label.style.color = "";
      // Optional: Reset label text if you want to remove "Invalid:" prefix
      // label.innerHTML = label.innerHTML.replace("Invalid ", "").replace(":", "");
    }
  });
}

function validateForm() {
  // 1. CLEAR OLD ERRORS
  resetValidation();
  let isValid = true;

  // 2. HONEYPOT SPAM CHECK
  const honeypot = document.getElementById("website_check");
  if (honeypot && honeypot.value !== "") {
    console.log("Bot detected. Stopping submission.");
    return; // Silently fail for bots
  }

  // 3. GET FIELDS
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phone");
  const message = document.getElementById("message");

  // Regex Patterns
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // --- VALIDATION LOGIC ---

  // Name Validation
  if (name && name.value.trim() === "") {
    setError("name", "Name is required:");
    isValid = false;
  }

  // Email Validation (Crucial for contact forms)
  if (email) {
    if (email.value.trim() === "") {
      setError("email", "Email is required:");
      isValid = false;
    } else if (!emailRegex.test(email.value)) {
      setError("email", "Invalid email address:");
      isValid = false;
    }
  }

  // Phone Validation
  if (phoneNumber) {
    if (phoneNumber.value.trim() !== "" && !phoneNumber.value.match(phoneRegex)) {
      setError("phone", "Invalid phone number:");
      isValid = false;
    }
  }

  // Message Validation
  if (message && message.value.trim() === "") {
    setError("message", "Message cannot be empty:");
    isValid = false;
  }

  // 4. SEND IF VALID
  if (isValid) {
    sendForm();
  }
}

// Helper to apply red styles
function setError(elementId, errorMsg) {
  const el = document.getElementById(elementId);
  const label = document.getElementById(elementId + "Label");
  
  if (el) el.style.border = "1px solid red";
  if (label) {
    label.style.color = "red";
    label.innerHTML = errorMsg;
  }
}
