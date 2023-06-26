let lastCode = "CO23069";
let month = parseInt(lastCode.slice(4, 6));
console.log("month", month)
let nombre = parseInt(lastCode.slice(6));
let actuelMonth = new Date().getMonth() + 1;
console.log("actuel month", actuelMonth)
let year = new Date().getFullYear().toString().slice(2);
if (actuelMonth === month) {
  nombre += 1;
} else {
  nombre = 1;
}
let code = "CO" + year + actuelMonth.toString().padStart(2, "0") + nombre;
console.log(code);
