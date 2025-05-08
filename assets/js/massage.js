const message = `Hai Ryo yamada,

Happy Birthday!

Hari ini aku pengen kamu ngerasain semua hal positif dan keajaiban yang cuma bisa didapetin kalo kamu ada di dunia ini. Semoga segala keinginanmu tercapai, apalagi yang kocak-kocak dan gak biasa, karena kamu tuh unik banget! Aku selalu bersyukur bisa ngeliat kamu jadi versi terbaik dari dirimu, yang kadang-kadang lucu banget pas lagi baper, tapi juga selalu bikin aku tersenyum tanpa henti.

Makasih udah jadi temen curhat, partner in crime, dan sumber inspirasi sehari-hari. Semoga tahun ini kamu makin kece, makin banyak momen bahagia, dan makin dicintai, karena kamu emang pantas dapetin semua itu. Jangan lupa, kita bakal terus jalan bareng, ngejar mimpi, dan ngelewatin segala drama hidup dengan tawa.

I love you <3`;

const messageText = document.getElementById('messageText');
const nextBtn = document.getElementById('nextBtn');

let index = 0;
const speed = 20;

function typeWriter() {
  if (index < message.length) {
    messageText.textContent += message.charAt(index);
    index++;
    messageText.parentElement.scrollTop = messageText.parentElement.scrollHeight;
    setTimeout(typeWriter, speed);
  } else {
    nextBtn.disabled = false;
  }
}

window.onload = typeWriter;