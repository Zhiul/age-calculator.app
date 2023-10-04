import { luxon } from "./luxon.js";

var DateTime = luxon.DateTime;

const ageCalculator = document.querySelector(".age-calculator");

const dayInput = document.querySelector("#day-input");
const monthInput = document.querySelector("#month-input");
const yearInput = document.querySelector("#year-input");

const inputs = [dayInput, monthInput, yearInput];

const calculateAgeButton = document.querySelector(".age-calculator-btn");

const daysOutput = document.querySelector("#days-output");
const monthsOutput = document.querySelector("#months-output");
const yearsOutput = document.querySelector("#years-output");

const outputs = [daysOutput, monthsOutput, yearsOutput];

const dayError = document.querySelector("#day-error");
const monthError = document.querySelector("#month-error");
const yearError = document.querySelector("#year-error");

const errors = [dayError, monthError, yearError];

function getAge(year, month, day) {
  console.log([year, month, day]);
  const birthDate = DateTime.fromISO(
    `${year}-${month.padStart(2, "0")}-${day}`
  );
  console.log(birthDate);
  const today = DateTime.now().startOf("day");

  const diff = today.diff(birthDate, ["years", "months", "days"]);

  return diff;
}

function displayAge(years, months, days) {
  const isDesktop = window.innerWidth >= 752;

  const year = yearInput.value;
  const month = monthInput.value;
  const day = dayInput.value;

  function isEmpty(value) {
    return (
      value == null || (typeof value === "string" && value.trim().length === 0)
    );
  }

  const yearInputIsEmpty = isEmpty(year);
  const monthInputIsEmpty = isEmpty(month);
  const dayInputIsEmpty = isEmpty(day);

  const allInputsAreEmpty = isEmpty(year) && isEmpty(month) && isEmpty(day);

  const yearIsInTheFuture = year > DateTime.now().year;
  const monthIsInvalid = month < 1 || month > 12;

  const monthDateInISOFormat = `${year}-${month
    .toString()
    .padStart(2, "0")}-01`;
  const daysInMonth =
    !yearIsInTheFuture && !monthIsInvalid
      ? DateTime.fromISO(monthDateInISOFormat).daysInMonth
      : false;

  const dayIsInvalid = day < 1 || day > daysInMonth || daysInMonth === false;

  if (
    allInputsAreEmpty ||
    yearIsInTheFuture ||
    monthIsInvalid ||
    dayIsInvalid
  ) {
    ageCalculator.dataset.valid = "false";

    for (const output of outputs) {
      output.textContent = "- -";
    }

    const mobileErrorMessage = "Invalid";

    for (const errorMSG of errors) {
      errorMSG.textContent = isDesktop ? "This field is required" : "Required";
    }

    if (allInputsAreEmpty) return;

    if (yearIsInTheFuture && !yearInputIsEmpty)
      yearError.textContent = isDesktop
        ? "Must be in the past"
        : mobileErrorMessage;

    if (monthIsInvalid && !monthInputIsEmpty)
      monthError.textContent = isDesktop
        ? "Must be a valid month"
        : mobileErrorMessage;

    if (dayIsInvalid && !dayInputIsEmpty)
      dayError.textContent = isDesktop
        ? "Must be a valid day"
        : mobileErrorMessage;

    return;
  }

  ageCalculator.dataset.valid = "true";

  for (const errorMSG of errors) {
    errorMSG.textContent = "";
  }

  yearsOutput.textContent = years;
  monthsOutput.textContent = months;
  daysOutput.textContent = days;
}

function calculateAge() {
  const { years, months, days } = getAge(
    yearInput.value,
    monthInput.value,
    dayInput.value
  );
  displayAge(years, months, days);
}

calculateAgeButton.addEventListener("click", calculateAge);
