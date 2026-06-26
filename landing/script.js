/* ==========================================================
   FEF Educación - Landing Page
   JS refactorizado y optimizado
   ========================================================== */

/*
  MODIFICAR FECHA Y HORA DE INAUGURACIÓN AQUÍ

  Formato recomendado:
  YYYY-MM-DDTHH:mm:ss-03:00

  -03:00 representa hora Argentina.
*/
const LAUNCH_DATE_ARG = "2026-07-15T00:00:00-03:00";

const $ = (selector) => document.querySelector(selector);

const elements = {
  days: $("#days"),
  hours: $("#hours"),
  minutes: $("#minutes"),
  seconds: $("#seconds"),
  targetDateLabel: $("#targetDateLabel"),
  locationLabel: $("#locationLabel"),
  themeToggle: $("#themeToggle"),
  year: $("#year"),
  scrollTop: $("#scrollTop")
};

const targetDate = new Date(LAUNCH_DATE_ARG);

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatTargetDate() {
  const formatter = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires"
  });

  elements.targetDateLabel.textContent = formatter.format(targetDate);
}

function updateCountdown() {
  const now = new Date();
  const distance = targetDate.getTime() - now.getTime();

  if (distance <= 0) {
    $("#countdown").innerHTML = `
      <article style="grid-column: 1 / -1;">
        <strong>¡Online!</strong>
        <span>FEF Educación ya está disponible</span>
      </article>
    `;
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);

  elements.days.textContent = pad(Math.floor(totalSeconds / 86400));
  elements.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  elements.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  elements.seconds.textContent = pad(totalSeconds % 60);
}

function detectCountryByLocale() {
  const locale = navigator.language || "es-AR";
  const region = locale.split("-")[1];

  if (!region) {
    elements.locationLabel.textContent = "Lanzamiento 00:00 ARG";
    return;
  }

  try {
    const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
    elements.locationLabel.textContent = `Ingresando desde ${regionNames.of(region)} · 00:00 ARG`;
  } catch {
    elements.locationLabel.textContent = "Lanzamiento 00:00 ARG";
  }
}

function initTheme() {
  // Primera visita: siempre modo oscuro.
  // Solo cambia si el usuario usa el botón y se guarda su preferencia.
  const savedTheme = localStorage.getItem("fef-theme");
  const initialTheme = savedTheme || "dark";

  document.documentElement.setAttribute("data-theme", initialTheme);

  elements.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("fef-theme", next);
  });
}

function initParticles() {
  if (typeof particlesJS === "undefined") return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 82, density: { enable: true, value_area: 960 } },
      color: { value: ["#19e8ff", "#a855f7", "#00ffb2"] },
      shape: { type: "circle" },
      opacity: { value: 0.35, random: true },
      size: { value: 2.5, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#19e8ff",
        opacity: 0.16,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.72,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out"
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 170, line_linked: { opacity: 0.32 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
}

/*
  Avión de papel: planeo natural
  - No acelera bruscamente.
  - El avión sigue una curva amplia.
  - Se balancea suavemente como si estuviera planeando.
  - La estela se dibuja y se desvanece detrás del avión.
*/
function initPaperPlaneFlight() {
  const plane = $("#paperPlane");
  const planeInner = document.querySelector(".paper-plane-inner");
  const path = $("#paperFlightPath");
  const trail = $(".live-trail");

  if (!plane || !path || !trail || typeof gsap === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    plane.style.opacity = "0.42";
    trail.style.opacity = "0.35";
    return;
  }

  if (window.MotionPathPlugin) {
    gsap.registerPlugin(MotionPathPlugin);
  }

  const pathLength = path.getTotalLength();
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const flightDuration = isMobile ? 38 : 44;

  gsap.set(trail, {
    strokeDasharray: `${pathLength * 0.22} ${pathLength}`,
    strokeDashoffset: pathLength,
    opacity: 0
  });

  gsap.set(plane, {
    opacity: 0,
    scale: isMobile ? 1.16 : 1,
    transformOrigin: "50% 50%"
  });

  gsap.set(planeInner, {
    transformOrigin: "50% 55%"
  });

  const master = gsap.timeline({
    repeat: -1,
    repeatDelay: 2.8
  });

  master
    .to(plane, {
      opacity: 1,
      duration: 2,
      ease: "sine.out"
    }, 0)
    .to(trail, {
      opacity: 1,
      duration: 2.4,
      ease: "sine.out"
    }, 0.25)
    .to(plane, {
      duration: flightDuration,
      ease: "none",
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      }
    }, 0)
    .to(trail, {
      strokeDashoffset: -pathLength * 0.92,
      duration: flightDuration,
      ease: "none"
    }, 0)
    .to(plane, {
      opacity: 0,
      duration: 2.6,
      ease: "sine.in"
    }, flightDuration - 2.3)
    .to(trail, {
      opacity: 0,
      duration: 3,
      ease: "sine.in"
    }, flightDuration - 1.8);

  // Balanceo independiente: sensación de hoja planeando.
  gsap.to(planeInner, {
    rotation: 6,
    y: -1.2,
    duration: 4.7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(planeInner, {
    x: 1.1,
    duration: 6.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

function initAOS() {
  if (typeof AOS === "undefined") return;

  AOS.init({
    duration: 900,
    once: true,
    easing: "ease-out-cubic"
  });
}

function initScrollTop() {
  elements.scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function init() {
  elements.year.textContent = new Date().getFullYear();

  formatTargetDate();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  detectCountryByLocale();
  initTheme();
  initParticles();
  initPaperPlaneFlight();
  initAOS();
  initScrollTop();
}

document.addEventListener("DOMContentLoaded", init);
