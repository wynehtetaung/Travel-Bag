const input = document.querySelector(".input-box")
const inputNew = document.querySelector(".input-box-new")
const inputConfirm = document.querySelector(".input-box-confirm")
showHide = document.querySelector(".show_hide")
showHideNew = document.querySelector(".new")
showHideConfirm = document.querySelector(".confirm")
indicator = document.querySelector(".indicator")
iconText = document.querySelector(".icon-text")
text = document.querySelector(".text")
div = document.querySelector(".input-group-addon")
//  js code to show & hide  prassword

showHide.addEventListener("click", () => {
  if (input.type === "password") {
    input.type = "text"
    showHide.classList.replace("fa-eye-slash", "fa-eye")
  } else {
    input.type = "password"
    showHide.classList.replace("fa-eye", "fa-eye-slash")
  }
})
showHideNew.addEventListener("click", () => {
  if (inputNew.type === "password") {
    inputNew.type = "text"
    showHideNew.classList.replace("fa-eye-slash", "fa-eye")
  } else {
    inputNew.type = "password"
    showHideNew.classList.replace("fa-eye", "fa-eye-slash")
  }
})
showHideConfirm.addEventListener("click", () => {
  if (inputConfirm.type === "password") {
    inputConfirm.type = "text"
    showHideConfirm.classList.replace("fa-eye-slash", "fa-eye")
  } else {
    inputConfirm.type = "password"
    showHideConfirm.classList.replace("fa-eye", "fa-eye-slash")
  }
})

// js code to show password strength (with regex)

let alphabet = /[a-zA-Z]/,
  numbers = /[0-9]/,
  schar = /[~,!,@,#,$,%,^,&,*,(,),_,+,-,=,{,},?,>,<]/

input.addEventListener("keyup", () => {
  indicator.classList.add("active")

  let val = input.value

  if (val.match(alphabet) || val.match(numbers) || val.match(schar)) {
    text.textContent = "စကားဝှက် အားနည်းနေပါသည်"
    showHide.style.color = "#FF6333"
    iconText.style.color = "#FF6333"
    input.style.borderColor = "#FF6333"
    div.style.borderColor = "#FF6333"
  }

  if (val.match(alphabet) && val.match(numbers) && val.length >= 6) {
    text.textContent = "စကားဝှက် အသင့်အတင့်ရှိပါသည်"
    showHide.style.color = "#cc8500"
    iconText.style.color = "#cc8500"
    input.style.borderColor = "#cc8500"
    div.style.borderColor = "#cc8500"
  }

  if (
    val.match(alphabet) &&
    val.match(numbers) &&
    val.match(schar) &&
    val.length >= 8
  ) {
    text.textContent = "စကားဝှက် အဆင်ပြေပါပြီ"
    showHide.style.color = "#22C32A"
    iconText.style.color = "#22C32A"
    input.style.borderColor = "#22C32A"
    div.style.borderColor = "#22C32A"
  }

  if (val == "") {
    indicator.classList.remove("active")
    showHide.style.color = ""
    input.style.borderColor = ""
  }
})
