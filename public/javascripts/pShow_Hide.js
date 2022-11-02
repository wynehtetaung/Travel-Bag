const input = document.querySelector(".input-box"),
  inputNew = document.querySelector(".input-box-new"),
  inputConfirm = document.querySelector(".input-box-confirm"),
  showHide = document.querySelector(".show_hide"),
  showHideNew = document.querySelector(".new"),
  showHideConfirm = document.querySelector(".confirm"),
  indicator = document.querySelector(".indicator"),
  iconText = document.querySelector(".icon-text"),
  text = document.querySelector(".text");
// div = document.querySelector(".input-group-addon");

// js code to show password strength (with regex)

let alphabet = /[a-zA-Z]/,
  numbers = /[0-9]/,
  schar = /[~,!,@,#,$,%,^,&,*,(,),_,+,-,=,{,},?,>,<]/;
window.addEventListener("load", function () {
  // console.log(input);
  input.addEventListener("keyup", () => {
    // console.log("ggg", input);
    $(".indicator").addClass("active");

    let val = input.value;

    if (val.match(alphabet) || val.match(numbers) || val.match(schar)) {
      $(".text").textContent = "စကားဝှက် အားနည်းနေပါသည်";
      $(".show_hide").css("color", "#FF6333");
      $(".icon-text").css("color", "#FF6333");
      $(".input-box").css("bodorColor", "#FF6333");
      // div.style.borderColor = "#FF6333";
    }

    if (val.match(alphabet) && val.match(numbers) && val.length >= 6) {
      $(".text").textContent = "စကားဝှက် အသင့်အတင့်ရှိပါသည်";
      $(".show_hide").css("color", "#cc8500");
      $(".icon-text").css("color", "#cc8500");
      $(".input-box").css("borderColor", "#cc8500");
      // div.style.borderColor = "#cc8500";
    }

    if (
      val.match(alphabet) &&
      val.match(numbers) &&
      val.match(schar) &&
      val.length >= 8
    ) {
      $(".text").textContent = "စကားဝှက် အဆင်ပြေပါပြီ";
      $(".show_hide").css("color", "#22C32A");
      $(".icon-text").css("color", "#22C32A");
      $(".input-box").css("borderColor", "#22C32A");
      // div.style.borderColor = "#22C32A";
    }

    if (val == "") {
      $(".indicator").remove("active");
      showHide.style.color = "";
      input.style.borderColor = "";
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
