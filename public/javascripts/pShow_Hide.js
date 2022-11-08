const input = document.querySelector(".input-box"),
  inputNew = document.querySelector(".input-box-new"),
  inputConfirm = document.querySelector(".input-box-confirm"),
  showHide = document.querySelector(".show_hide"),
  showHideNew = document.querySelector(".new"),
  showHideConfirm = document.querySelector(".confirm"),
  indicator = document.querySelector(".indicator"),
  iconText = document.querySelector(".icon-text"),
  text = document.querySelector(".text"),
  errorIcon = document.querySelector(".error-icon");

// js code to show password strength (with regex)

let alphabet = /[a-zA-Z]/,
  numbers = /[0-9]/,
  schar = /[~,!,@,#,$,%,^,&,*,(,),_,+,-,=,{,},?,>,<]/;
window.addEventListener("load", function () {
  input.addEventListener("keyup", () => {
    $(".indicator").addClass("active");

    let val = input.value;

    if (val.match(alphabet) || val.match(numbers) || val.match(schar)) {
      text.textContent = "စကားဝှက် အားနည်းနေပါသည်";
      $(".icon-text").css("color", "#FF6333");
      $(".error_icon").css("color", "#FF6333");
    }

    if (val.match(alphabet) && val.match(numbers) && val.length >= 6) {
      text.textContent = "စကားဝှက် အသင့်အတင့်ရှိပါသည်";
      $(".icon-text").css("color", "#cc8500");
      $(".error_icon").css("color", "#cc8500");
    }

    if (
      val.match(alphabet) &&
      val.match(numbers) &&
      val.match(schar) &&
      val.length >= 8
    ) {
      text.textContent = "စကားဝှက် အဆင်ပြေပါပြီ";
      $(".icon-text").css("color", "#22C32A");
      $(".error_icon").css("color", "#22C32A");
    }

    if (val == "") {
      $(".indicator").remove("active");
      showHide.style.color = "";
      input.style.borderColor = "";
      text.textContent = "";
      $(".error_icon").css("color", "white");
    }
  });
  showHide.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      showHide.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      input.type = "password";
      showHide.classList.replace("fa-eye", "fa-eye-slash");
    }
  });
  $(".new").click(() => {
    if (inputNew.type === "password") {
      inputNew.type = "text";
      showHideNew.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      inputNew.type = "password";
      showHideNew.classList.replace("fa-eye", "fa-eye-slash");
    }
  });
  $(".confirm").click(() => {
    if (inputConfirm.type === "password") {
      inputConfirm.type = "text";
      showHideConfirm.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      inputConfirm.type = "password";
      showHideConfirm.classList.replace("fa-eye", "fa-eye-slash");
    }
  });
});
