// Hamburger menu animation on click and toggle nav items
document.getElementById("hamburgerMenu").addEventListener("click", () => {
  navItems = document.getElementsByClassName("navItem");
  document.getElementById("responsiveLinks").classList.toggle("showOnMobile");
  hamburgerMenu.classList.toggle("hamActive");
  document.getElementById("logoHolder").classList.toggle("hamOpenLogo");

});

if (document.getElementById("contactSubmitBtn") != null) {
  document
    .getElementById("contactSubmitBtn")
    .addEventListener("click", validateForm);
}
if (document.getElementById("contactForm") != null) {
  //prevent default action of contact form
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

async function sendForm() {
  let xhr = new XMLHttpRequest();


  xhr.open("POST", "../php/sendTheMailTo.php", true);
  data = new FormData(document.getElementById("contactForm"));

  xhr.send(data);

  console.log(data);
  
  xhr.onload = function () {
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
  isValid = true;
  phoneNumber = document.getElementById("phone");
  message = document.getElementById("message");
  phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  if (phoneNumber.value.trim() == "") {
    console.log("valid empty phone number");
  } else {
    if (phoneNumber.value.match(phoneRegex)) {
      console.log("valid phone number");
    } else {
      phoneNumber.style.border = "1px solid red";
      document.getElementById("phoneLabel").style.color = "red";
      document.getElementById("phoneLabel").innerHTML = "Invalid phone number:";
      isValid = false;
    }
  }

  if (message.value.trim() != "") {
    console.log("valid message");
  } else {
    message.style.border = "1px solid red";
    document.getElementById("messageLabel").style.color = "red";
    document.getElementById("messageLabel").innerHTML =
      "message cannot be empty:";
    isValid = false;
  }

  

  if (isValid) {
    sendForm();
  }
}
