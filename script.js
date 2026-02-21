const songs = [
  { name: "Khawne Gorachand Khawne Kaalaa", file: "songs/10.mp3", cover: "covers/10.jpg", duration: "04:12" },
  { name: "DARKHAAST", file: "songs/9.mp3", cover: "covers/9.jpg", duration: "07:11" },
  { name: "Tomake Chuye Dilam Female Version", file: "songs/8.mp3", cover: "covers/8.jpg", duration: "05:47" },
  { name: "Khat", file: "songs/7.mp3", cover: "covers/7.jpg", duration: "04:56" },
  { name: "Why This Kolaveri Di?", file: "songs/6.mp3", cover: "covers/6.jpg", duration: "04:20" },
  { name: "Hua Hain Aaj Pehli Baar", file: "songs/5.mp3", cover: "covers/5.jpg", duration: "05:09" },
  { name: "Nei Khoti Nei", file: "songs/4.mp3", cover: "covers/4.jpg", duration: "03:15" },
  { name: "Ehsaas", file: "songs/3.mp3", cover: "covers/3.jpg", duration: "03:53" },
  { name: "Long Distance Love", file: "songs/2.mp3", cover: "covers/2.jpg", duration: "04:42" }
];

const audio = new Audio(songs[0].file);
let currentIndex = 0;

const songList = document.getElementById("songList");
const masterPlay = document.getElementById("masterPlay");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentSong = document.getElementById("currentSong");
const footerTitle = document.getElementById("footerTitle");
const footerCover = document.getElementById("footerCover");
const heroCover = document.getElementById("heroCover");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const playingGif = document.getElementById("playingGif");
const homeSection = document.getElementById("homeSection");
const aboutSection = document.getElementById("about");
const homeLink = document.getElementById("homeLink");
const libraryLink = document.getElementById("libraryLink");
const aboutLink = document.getElementById("aboutLink");
const closeAboutBtn = document.getElementById("closeAboutBtn");

function formatTime(value) {
  if (!value || Number.isNaN(value)) return "00:00";
  const min = Math.floor(value / 60);
  const sec = Math.floor(value % 60);
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function renderSongs() {
  songList.innerHTML = songs
    .map(
      (song, index) => `
        <article class="song-item ${index === currentIndex ? "active" : ""}" data-index="${index}">
          <img src="${song.cover}" alt="${song.name}">
          <p class="song-name">${song.name}</p>
          <span class="song-duration">${song.duration}</span>
          <button class="play-btn" data-play-index="${index}" aria-label="Play ${song.name}">${index === currentIndex && !audio.paused ? "&#10074;&#10074;" : "&#9654;"}</button>
        </article>
      `
    )
    .join("");
}

function updateSongUI() {
  const song = songs[currentIndex];
  audio.src = song.file;
  currentSong.textContent = song.name;
  footerTitle.textContent = song.name;
  footerCover.src = song.cover;
  heroCover.src = song.cover;
  totalTime.textContent = song.duration;
  renderSongs();
}

function setPlayingState(isPlaying) {
  masterPlay.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9654;";
  playingGif.classList.toggle("active", isPlaying);
  renderSongs();
}

function playSong(index) {
  currentIndex = index;
  updateSongUI();
  audio.play();
  setPlayingState(true);
}

masterPlay.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    setPlayingState(true);
  } else {
    audio.pause();
    setPlayingState(false);
  }
});

prevBtn.addEventListener("click", () => {
  currentIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
  playSong(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
  playSong(currentIndex);
});

songList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-play-index]");
  if (!button) return;

  const index = Number(button.dataset.playIndex);
  if (index === currentIndex && !audio.paused) {
    audio.pause();
    setPlayingState(false);
    return;
  }

  playSong(index);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
  currentTime.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
});

audio.addEventListener("loadedmetadata", () => {
  totalTime.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  currentIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
  playSong(currentIndex);
});

function setActiveLink(linkElement) {
  homeLink.classList.remove("active-link");
  libraryLink.classList.remove("active-link");
  aboutLink.classList.remove("active-link");
  linkElement.classList.add("active-link");
}

function showHomeView() {
  homeSection.classList.remove("is-hidden");
  aboutSection.classList.add("is-hidden");
  setActiveLink(homeLink);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAboutView() {
  homeSection.classList.add("is-hidden");
  aboutSection.classList.remove("is-hidden");
  setActiveLink(aboutLink);
  aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  showHomeView();
});

libraryLink.addEventListener("click", (event) => {
  event.preventDefault();
  showHomeView();
});

aboutLink.addEventListener("click", (event) => {
  event.preventDefault();
  showAboutView();
});

closeAboutBtn.addEventListener("click", () => {
  showHomeView();
});

updateSongUI();
setPlayingState(false);
