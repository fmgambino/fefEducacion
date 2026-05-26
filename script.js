/* FEF Educación - Landing Page Sitio en Construcción */

/*
  ✅ MODIFICAR FECHA Y HORA DE INAUGURACIÓN AQUÍ
  Formato: YYYY-MM-DDTHH:mm:ss-03:00
  -03:00 representa la hora de Argentina.
*/
const LAUNCH_DATE_ARG = "2026-06-23T00:00:00-03:00";

const daysEl = document.querySelector("#days");
const hoursEl = document.querySelector("#hours");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const targetDateLabel = document.querySelector("#targetDateLabel");
const locationLabel = document.querySelector("#locationLabel");
const themeToggle = document.querySelector("#themeToggle");
const targetDate = new Date(LAUNCH_DATE_ARG);

const formatterArgentina = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires"
});

targetDateLabel.textContent = formatterArgentina.format(targetDate);

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = targetDate.getTime() - Date.now();

  if (distance <= 0) {
    document.querySelector("#countdown").innerHTML = `
      <div class="time-box" style="grid-column: 1 / -1;">
        <strong>¡Ya estamos online!</strong>
        <small>FEF Educación</small>
      </div>
    `;
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  daysEl.textContent = pad(Math.floor(totalSeconds / 86400));
  hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  secondsEl.textContent = pad(totalSeconds % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

async function detectCountry() {
  try {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo detectar país por IP");
    const data = await response.json();
    const country = data.country_name || data.country || "tu país";
    locationLabel.textContent = `Ingresando desde ${country} · Lanzamiento 00:00 ARG`;
  } catch {
    const locale = navigator.language || navigator.userLanguage || "es-AR";
    const region = locale.split("-")[1];
    if (region && "DisplayNames" in Intl) {
      const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
      locationLabel.textContent = `Ingresando desde ${regionNames.of(region)} · Lanzamiento 00:00 ARG`;
    } else {
      locationLabel.textContent = "Ubicación no disponible · Lanzamiento 00:00 ARG";
    }
  }
}

detectCountry();

const savedTheme = localStorage.getItem("fef-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
const initialTheme = savedTheme || (prefersLight ? "light" : "dark");
document.documentElement.setAttribute("data-theme", initialTheme);
updateThemeButton(initialTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("fef-theme", next);
  updateThemeButton(next);
});

function updateThemeButton(theme) {
  themeToggle.querySelector(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#070a13" : "#f6f8ff");
}

document.querySelector("#year").textContent = new Date().getFullYear();

if (window.AOS) {
  AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
}

if (window.particlesJS) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 900 } },
      color: { value: ["#7c3cff", "#00e5ff", "#00ff95"] },
      shape: { type: "circle" },
      opacity: { value: 0.35, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 145, color: "#00e5ff", opacity: 0.18, width: 1 },
      move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
      modes: { grab: { distance: 170, line_linked: { opacity: 0.35 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });
}

if (window.gsap) {
  gsap.from(".brand", { y: -18, opacity: 0, duration: 0.9, ease: "power3.out" });
  gsap.from(".theme-toggle", { y: -18, opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
  gsap.to(".orb-one", { x: 35, y: -25, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-two", { x: -30, y: 35, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
}
