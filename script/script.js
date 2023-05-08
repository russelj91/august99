const API_URL = "https://api.spacexdata.com/v4/launches/";
const launchesList = document.querySelector("#launches-list");
const loadingIndicator = document.querySelector("#loading-indicator");
const noMoreDataMessage = document.querySelector("#no-more-data-message");
const launchItemTemplate = document.querySelector("#launch-item-template");
const searchInput = document.querySelector("#search-bar");

let loading = false;
let page = 1;
const maxPages = 1;

function getLaunches() {
  if (loading || page > maxPages) return;
  loading = true;
  loadingIndicator.style.display = "block";

  fetch(API_URL + "?page=" + page)
    .then((response) => response.json())
    .then((data) => {
      loading = false;
      loadingIndicator.style.display = "none";
      if (data.length > 0) {
        page++;
        data.forEach((launch, index) => {
          setTimeout(() => {
            const launchItem = launchItemTemplate.content.cloneNode(true);
            const missionName = launchItem.querySelector(".mission-name");
            const flightNumber = launchItem.querySelector(".flight-number");
            const launchYear = launchItem.querySelector(".launch-year");
            const details = launchItem.querySelector(".details");
            const launchImage = launchItem.querySelector(".launch-image");

            flightNumber.textContent = ` ${launch.flight_number} `;
            missionName.textContent = launch.name;
            launchYear.textContent = `(${launch.launch_year} ) `;
            details.textContent = launch.details || "No details available";
            launchImage.src = launch.links.patch.small;

            launchesList.appendChild(launchItem);
          }, index * 200); // delay each item by 500ms
        });
      } else {
        noMoreData.style.display = "block";
      }
    })
    .catch((error) => console.error(error));
}

function filterLaunches(keyword) {
  const launches = launchesList.querySelectorAll(".launch-item");
  launches.forEach((launch) => {
    const missionName = launch.querySelector(".mission-name");
    if (missionName.textContent.toLowerCase().includes(keyword.toLowerCase())) {
      launch.style.display = "block";
    } else {
      launch.style.display = "none";
    }
  });
}

function throttle(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

const throttledGetLaunches = throttle(getLaunches, 1000);

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    throttledGetLaunches();
  }
});

getLaunches();

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim();
  filterLaunches(keyword);
});
