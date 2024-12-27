// Define countries and their cities (Arabic and English)
const countriesAndCities = {
  مصر: ["القاهرة", "الإسكندرية", "الجيزة"],
  الإمارات: ["دبي", "أبوظبي", "الشارقة"],
  السعودية: ["الرياض", "جدة", "مكة المكرمة"],
  الأردن: ["عمان", "إربد", "الزرقاء"],
  لبنان: ["بيروت", "طرابلس", "صيدا"],
};

const countriesAndCitiesEn = {
  Egypt: ["Cairo", "Alexandria", "Giza"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
  SaudiArabia: ["Riyadh", "Jeddah", "Mecca"],
  Jordan: ["Amman", "Irbid", "Zarqa"],
  Lebanon: ["Beirut", "Tripoli", "Sidon"],
};

// Select Elements
let countrySelect = document.querySelector(".select-location .country");
let citySelect = document.querySelector(".select-location .city");

// Set Country And City Based On Your Choice
let cityLocation = document.querySelector(".location .city");
let countryLocation = document.querySelector(".location .country");

// Prayer Times
let prayerTimes = document.querySelectorAll(".details > p:nth-of-type(2)");
let prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Populate country select options
Object.keys(countriesAndCities).forEach((country, index) => {
  let optionEl = document.createElement("option");
  const countryEn = Object.keys(countriesAndCitiesEn)[index]; // Get English equivalent
  optionEl.value = countryEn; // Use English name as value
  optionEl.textContent = country; // Display Arabic name
  countrySelect.appendChild(optionEl);
});

// Set default country to مصر (Egypt)
countrySelect.value = "Egypt"; // Default to Egypt
countryLocation.textContent = "مصر"; // Display مصر as the selected country in Arabic

// Populate cities for the default country (Egypt)
populateCities("Egypt");

// Function to populate city dropdown
function populateCities(selectedCountryEn) {
  // Clear the current city options
  citySelect.innerHTML = "";

  if (selectedCountryEn && countriesAndCitiesEn[selectedCountryEn]) {
    const countryArabic =
      Object.keys(countriesAndCities)[
        Object.keys(countriesAndCitiesEn).indexOf(selectedCountryEn)
      ];

    // Populate city select options
    countriesAndCitiesEn[selectedCountryEn].forEach((cityEn, index) => {
      let optionEl = document.createElement("option");
      const cityAr = countriesAndCities[countryArabic][index]; // Get Arabic equivalent
      console.log(optionEl.value);
      optionEl.textContent = cityAr; // Display Arabic name
      citySelect.appendChild(optionEl);
    });

    // Set default city
    citySelect.value = citySelect.options[0].value; // Default to the first city
    cityLocation.textContent = citySelect.options[0].textContent; // Display the first city in Arabic
  }
}

// Update city options when the country changes
countrySelect.addEventListener("change", function () {
  const selectedCountryEn = countrySelect.value;
  if (selectedCountryEn) {
    const countryArabic =
      Object.keys(countriesAndCities)[
        Object.keys(countriesAndCitiesEn).indexOf(selectedCountryEn)
      ];

    // Update displayed country in Arabic
    countryLocation.textContent = countryArabic;

    // Populate the cities for the selected country
    populateCities(selectedCountryEn);
  }
});

// Update displayed city when a city is selected
citySelect.addEventListener("change", function () {
  const selectedCityAr =
    citySelect.options[citySelect.selectedIndex].textContent;
  cityLocation.textContent = selectedCityAr; // Display the Arabic city name
});

// Select the date element
let dateElement = document.querySelector(".details .date");

// Call the API and update prayer times when a city is selected
citySelect.addEventListener("change", function () {
  const selectedCityAr =
    citySelect.options[citySelect.selectedIndex].textContent;
  const selectedCityEn =
    countriesAndCitiesEn[countrySelect.value][citySelect.selectedIndex];
  const selectedCountryAr = countryLocation.textContent;
  const selectedCountryEn = countrySelect.value;

  cityLocation.textContent = selectedCityAr; // Display the Arabic city name

  // Call the API to fetch and display prayer times
  getPrayerTimes(selectedCityEn, selectedCountryEn, 5); // Using method 2 (ISNA) as an example
});

// Function to get prayer times and display them
async function getPrayerTimes(city, country, method) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    const timings = data.data.timings;
    const dateInfo = data.data.date;

    // Convert date to Arabic
    const [day, month, year] = dateInfo.readable.split(" ");
    const formattedDate = new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(`${month} ${day}, ${year}`)); // Format date in Arabic

    // Display the Arabic date
    dateElement.textContent = `التاريخ: ${formattedDate}`; // Example: "التاريخ: الجمعة، 27 ديسمبر 2024"

    // Map prayer times correctly to the elements
    prayers.forEach((prayer, index) => {
      const time = timings[prayer]; // Get the prayer time by its key
      if (prayerTimes[index]) {
        prayerTimes[index].textContent = `${prayer}: ${time}`;
      }
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Initial API call for the default city and country
const defaultCityEn = countriesAndCitiesEn["Egypt"][0];
const defaultCountryEn = "Egypt";
getPrayerTimes(defaultCityEn, defaultCountryEn, 5);
