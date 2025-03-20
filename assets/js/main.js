console.log(
  "%cLET JUSTICE BE DONE, %cTHOUGH THE HEAVENS FALL.",
  "color: red; font-weight: bold; font-size: 16px;",
  "color: white; background-color: black; font-weight: bold; font-size: 16px;"
);

/*
================================================
            MAİN
================================================
*/
async function fetchRepos() {
  const repoGrid = document.getElementById("repo-grid");
  repoGrid.innerHTML = ""; // Önceki içeriği temizle

  const username = "onurberk"; // GitHub kullanıcı adı
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Failed to fetch repos: ${response.statusText}`);
      return;
    }

    const repos = await response.json();

    // Tüm repoları ekrana ekle
    repos.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <a href="${repo.html_url}" target="_blank">
          <h2>${repo.name}</h2>
          <p>${repo.description || "No description available"}</p>
          <div class="stats">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>🍴 ${repo.forks_count}</span>
          </div>
          <button class="repo-button">View Project</button>
        </a>
      `;
      repoGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching repos:", error);
  }
}

// Carousel kaydırma fonksiyonu
let currentIndex = 0;

function moveSlide(direction) {
  const repoGrid = document.getElementById("repo-grid");
  const cards = document.querySelectorAll(".card");
  const cardWidth = cards[0].offsetWidth + 20; // Kart genişliği + gap

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = 0;
  } else if (currentIndex >= cards.length - 2) {
    currentIndex = cards.length - 3; // 3 kart gösteriliyorsa
  }

  repoGrid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Sayfa yüklendiğinde repoları çek
document.addEventListener("DOMContentLoaded", fetchRepos);
