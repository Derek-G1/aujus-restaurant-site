// Hamburger menu animation on click and toggle nav items
document.getElementById("hamburgerMenu").addEventListener("click", () => {
  const navItems = document.getElementsByClassName("navItem");
  document.getElementById("responsiveLinks").classList.toggle("showOnMobile");
  document.getElementById("hamburgerMenu").classList.toggle("hamActive");
  document.getElementById("logoHolder").classList.toggle("hamOpenLogo");
});

const contactSubmitBtn = document.getElementById("contactSubmitBtn");
if (contactSubmitBtn != null) {
  contactSubmitBtn.addEventListener("click", validateForm);
}

const contactForm = document.getElementById("contactForm");
if (contactForm != null) {
  //prevent default action of contact form
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

async function sendForm() {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "../php/sendTheMailTo.php", true);
  const data = new FormData(document.getElementById("contactForm"));

  xhr.send(data);

  console.log(data);

  xhr.onload = function() {
    if (xhr.status != 200) {
      document.getElementById("contactSubmitBtn").innerHTML = "Error";
    } else {
      document.getElementById("alertModal").style.display = "block";
      document.getElementsByTagName("html")[0].style.overflow = "hidden";
      document.getElementById("contactSubmitBtn").disabled = true;
    }
  };
}

function validateForm() {
  let isValid = true;
  const phoneNumber = document.getElementById("phone");
  const message = document.getElementById("message");
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  // Ensure elements exist before accessing properties
  if (!phoneNumber || !message) {
    console.error("Form elements not found");
    return;
  }

  if (phoneNumber.value.trim() == "") {
    console.log("valid empty phone number");
  } else {
    if (phoneNumber.value.match(phoneRegex)) {
      console.log("valid phone number");
    } else {
      phoneNumber.style.border = "1px solid red";
      const phoneLabel = document.getElementById("phoneLabel");
      if (phoneLabel) {
        phoneLabel.style.color = "red";
        phoneLabel.innerHTML = "Invalid phone number:";
      }
      isValid = false;
    }
  }

  if (message.value.trim() != "") {
    console.log("valid message");
  } else {
    message.style.border = "1px solid red";
    const messageLabel = document.getElementById("messageLabel");
    if (messageLabel) {
      messageLabel.style.color = "red";
      messageLabel.innerHTML = "message cannot be empty:";
    }
    isValid = false;
  }

  if (isValid) {
    sendForm();
  }
}
