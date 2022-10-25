const input = document.querySelector(".input-box");
showHide = document.querySelector(".show_hide");
indicator = document.querySelector(".indicator");
iconText = document.querySelector(".icon-text");
text = document.querySelector(".text");
//  js code to show & hide  prassword

showHide.addEventListener("click", () => {
  if (input.type === "password") {
    input.type = "text";
    showHide.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    showHide.classList.replace("fa-eye", "fa-eye-slash");
  }
});

// js code to show password strength (with regex)

let alphabet = /[a-zA-Z]/,
  numbers = /[0-9]/,
  schar = /[~,!,@,#,$,%,^,&,*,(,),_,+,-,=,{,},?,>,<]/;

input.addEventListener("keyup", () => {
  indicator.classList.add("active");

  let val = input.value;

  if (val.match(alphabet) || val.match(numbers) || val.match(schar)) {
    text.textContent = "စကားဝှက် အားနည်းနေပါသည်";
    showHide.style.color = "#FF6333";
    iconText.style.color = "#FF6333";
    input.style.borderColor = "#FF6333";
  }

  if (val.match(alphabet) && val.match(numbers) && val.length >= 6) {
    text.textContent = "စကားဝှက် အသင့်အတင့်ရှိပါသည်";
    showHide.style.color = "#cc8500";
    iconText.style.color = "#cc8500";
    input.style.borderColor = "#cc8500";
  }

  if (
    val.match(alphabet) &&
    val.match(numbers) &&
    val.match(schar) &&
    val.length >= 8
  ) {
    text.textContent = "စကားဝှက် အဆင်ပြေပါပြီ";
    showHide.style.color = "#22C32A";
    iconText.style.color = "#22C32A";
    input.style.borderColor = "#22C32A";
  }

  if (val == "") {
    indicator.classList.remove("active");
    showHide.style.color = "";
    input.style.borderColor = "";
  }
});
