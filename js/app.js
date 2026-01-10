// Hamburger menu animation on click and toggle nav items
const hamburgerMenu = document.getElementById("hamburgerMenu");
if (hamburgerMenu) {
  hamburgerMenu.addEventListener("click", () => {
    document.getElementById("responsiveLinks").classList.toggle("showOnMobile");
    document.getElementById("hamburgerMenu").classList.toggle("hamActive");
    document.getElementById("logoHolder").classList.toggle("hamOpenLogo");
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