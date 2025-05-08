const songs = [
  {
    title: "Karena Kamu",
    artist: "geisha",
    src: "../../../assets/audio/lagu1.mp3",
    cover: "../../../assets/images/cover1.jpg",
    duration: "03:54"
  },
  {
    title: "Mejaga Hati",
    artist: "Yovie & Nuno",
    src: "../../../assets/audio/lagu2.mp3",
    cover: "../../../assets/images/cover2.jpg",
    duration: "03:09"
  },
  {
    title: "Tanpa Cinta",
    artist: "Yovie & Nuno",
    src: "../../../assets/audio/lagu3.mp3",
    cover: "../../../assets/images/cover3.jpg",
    duration: "03:28"
  },
  {
    title: "Nothing's Gonna Change My Love For You",
    artist: "George Benson",
    src: "https://cdn.pixabay.com/download/audio/2022/03/23/audio_6d6d6d6d6d.mp3?filename=love-song-11669.mp3",
    cover: "https://placehold.co/300x120/png?text=Nothing's+Gonna+Change+My+Love+For+You+Cover",
    duration: "03:52"
  },
  {
    title: "How Deep Is Your Love",
    artist: "Bee Gees",
    src: "https://cdn.pixabay.com/download/audio/2022/03/23/audio_7e7e7e7e7e.mp3?filename=soft-melody-11670.mp3",
    cover: "https://placehold.co/300x120/png?text=How+Deep+Is+Your+Love+Cover",
    duration: "03:58"
  }
];

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const playlistEl = document.getElementById('playlist');

// Current song index
let currentSongIndex = 0;
let isPlaying = false;

// Load song
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  coverEl.src = song.cover;
  durationEl.textContent = song.duration;
  
  // Highlight current song in playlist
  const items = playlistEl.querySelectorAll('li');
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Play song
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause song
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Event listeners
playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', () => {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  loadSong(currentSongIndex);
  playSong();
});

nextBtn.addEventListener('click', () => {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  loadSong(currentSongIndex);
  playSong();
});

// Update progress bar
audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.value = progressPercent;
  
  // Update current time
  let minutes = Math.floor(currentTime / 60);
  let seconds = Math.floor(currentTime % 60);
  if (seconds < 10) seconds = '0' + seconds;
  currentTimeEl.textContent = `${minutes}:${seconds}`;
});

// Set progress
progress.addEventListener('input', () => {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Song ends
audio.addEventListener('ended', () => {
  nextBtn.click();
});

// Playlist click
playlistEl.querySelectorAll('li').forEach((item, index) => {
  item.addEventListener('click', () => {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    playSong();
  });
});

// Initialize
loadSong(currentSongIndex);

// Navigation buttons
document.querySelector('.next-btn').addEventListener('click', () => {
  window.location.href = 'tetris.html';
});

document.querySelector('.back-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});