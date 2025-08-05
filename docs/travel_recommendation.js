// recommendation.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch JSON");
            }
            return response.json();
        })
        .then(data => {
            displayRecommendations(data.recommendations)
;
        })
        .catch(error => {
            console.error("Error loading recommendations:", error);
        });
});

function displayRecommendations(data) {
    const container = document.getElementById('recommendation-results');

    // Combine all categories
    const allPlaces = [
        ...data.countries.flatMap(country => country.cities),
        ...data.temples,
        ...data.beaches
    ];

    allPlaces.forEach(place => {
        const card = document.createElement('div');
        card.classList.add('place-card');

        card.innerHTML = `
            <img src="images/${extractImageFilename(place.imageUrl)}" alt="${place.name}" />
            <h3>${place.name}</h3>
            <p>${place.description}</p>
        `;

        container.appendChild(card);
    });
}

// Utility: Replace "enter_your_image_for_xyz.jpg" with actual filenames
function extractImageFilename(urlString) {
    const match = urlString.match(/enter_your_image_for_(.*)\.jpg/);
    return match ? match[1].replace(/-/g, '_') + '.jpg' : 'placeholder.jpg';
}

//handle search functionality


function handleSearch() {
    const input = document.getElementById("searchInput").value.toLowerCase().trim();
    const normalizedInput = normalizeKeyword(input);

    const destinations = {
        beach: ["Bora Bora", "Rio de Janeiro", "Sydney"],
        temple: ["Angkor Wat", "Kyoto", "Taj Mahal"],
        japan: ["Tokyo", "Kyoto"],
        india: ["Taj Mahal"],
        brazil: ["Rio de Janeiro", "Sao Paulo"],
        australia: ["Sydney", "Melbourne"],
        cambodia: ["Angkor Wat"]
    };

    let results = [];

    for (let keyword in destinations) {
        if (normalizedInput.includes(keyword)) {
            results = results.concat(destinations[keyword]);
        }
    }

    displayResults(results);
}

function normalizeKeyword(input) {
    // Convert plural to singular manually if needed
    if (input === "beaches") return "beach";
    if (input === "temples") return "temple";
    return input;
}

function displayResults(destinations) {
    const container = document.getElementById("searchResults");
    container.innerHTML = "";

    if (destinations.length === 0) {
        container.innerHTML = "<p>No destinations found for your search.</p>";
        return;
    }

    destinations.forEach(place => {
        const div = document.createElement("div");
        div.classList.add("result");
        div.textContent = place;
        container.appendChild(div);
    });
}


document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = document.getElementById('searchInput').value.toLowerCase().trim();

    if (!query) {
        alert("Please enter a keyword.");
        return;
    }

    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();

        // Search in temples
        const templeMatch = data.temples.find(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );

        // Search in beaches
        const beachMatch = data.beaches.find(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );

        // Search in countries and cities
        const countryMatch = data.countries.find(country =>
            country.name.toLowerCase().includes(query) ||
            country.cities.some(city => city.name.toLowerCase().includes(query) || city.description.toLowerCase().includes(query))
        );

        // Routing logic based on match
        if (beachMatch) {
            window.location.href = "travel_recommendation.html?type=beach";
        } else if (templeMatch) {
            window.location.href = "travel_recommendation.html?type=temple";
        } else if (countryMatch) {
            window.location.href = "travel_recommendation.html?country=" + countryMatch.name.toLowerCase();
        } else {
            alert("No matches found. Try searching for a city, country, temple, or beach.");
        }

    } catch (error) {
        console.error("Error loading data:", error);
        alert("Something went wrong while searching. Please try again.");
    }
});




/////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const keyword = input.value.trim().toLowerCase();

    if (!keyword) return;

    // Normalize keyword
    if (["beach", "beaches"].includes(keyword)) {
      window.location.href = "travel_recommendation.html?type=beach";
    } else if (["temple", "temples"].includes(keyword)) {
      window.location.href = "travel_recommendation.html?type=temple";
    } else {
      // Treat as country
      window.location.href = `travel_recommendation.html?country=${keyword}`;
    }
  });

  // Display recommendations if query exists
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const country = params.get("country");

  if (type || country) {
    fetch("travel_recommendation_api.json")
      .then((res) => res.json())
      .then((data) => {
        let results = [];

        if (type === "beach") {
          results = data.beaches;
        } else if (type === "temple") {
          results = data.temples;
        } else if (country) {
          const formatted = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
          const match = data.countries.find(
            (c) => c.name.toLowerCase() === formatted.toLowerCase()
          );
          if (match) results = match.cities;
        }

        displayRecommendations(results);
      })
      .catch((err) => {
        console.error("Error loading recommendations:", err);
      });
  }
});

function displayRecommendations(items) {
  const container = document.getElementById("recommendation-results");
  if (!items || items.length === 0) {
    container.innerHTML = "<p>No recommendations found.</p>";
    return;
  }

  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    const imageName = item.imageUrl.replace("enter_your_image_for_", "");

    card.innerHTML = `
      <h3>${item.name}</h3>
      <img src="images/${imageName}" alt="${item.name}" width="300">
      <p>${item.description}</p>
    `;

    container.appendChild(card);
  });
}
