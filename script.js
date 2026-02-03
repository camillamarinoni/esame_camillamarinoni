document.addEventListener("DOMContentLoaded", () => {
  initCalendar();
  initAccordion();
  initBookingConfetti();
});

/* CALENDARIO */
function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  const timeSelection = document.getElementById("timeSelection");
  const timeButtonsContainer = document.querySelector(".time-buttons");
  const selectedInfo = document.getElementById("selectedInfo");
  const monthYearEl = document.getElementById("monthYear");
  const weekDaysEl = document.getElementById("weekDays");

  // Se non siamo nella pagina contatti, esci
  if (!calendarEl || !timeSelection || !timeButtonsContainer || !selectedInfo || !monthYearEl || !weekDaysEl) return;

  let selectedDate = null;
  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const monthNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  // Render giorni settimana
  weekDaysEl.innerHTML = "";
  weekDays.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;
    weekDaysEl.appendChild(dayDiv);
  });

  function generateCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarEl.innerHTML = "";

    // offset: lunedì=0
    const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
    const offset = (firstDay + 6) % 7;

    for (let i = 0; i < offset; i++) {
      calendarEl.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      dayDiv.addEventListener("click", () => selectDay(day, month, year));
      calendarEl.appendChild(dayDiv);
    }
  }

  function selectDay(day, month, year) {
    selectedDate = new Date(year, month, day);
    selectedInfo.textContent = `Data selezionata: ${selectedDate.toLocaleDateString("it-IT")}`;
    timeSelection.style.display = "block";
    generateTimeButtons();
  }

  function generateTimeButtons() {
    timeButtonsContainer.innerHTML = "";
    times.forEach(time => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = time;
      btn.addEventListener("click", () => selectTime(time));
      timeButtonsContainer.appendChild(btn);
    });
  }

  function selectTime(time) {
    selectedInfo.textContent = `Stai prenotando per il ${selectedDate.toLocaleDateString("it-IT")} alle ${time}`;
  }

  generateCalendar();
}

/* ACCORDION */
function initAccordion() {
  const buttons = document.querySelectorAll(".accordion button");
  if (!buttons.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Chiude gli altri
      buttons.forEach(btn => {
        if (btn !== button) {
          btn.classList.remove("active");
          btn.nextElementSibling.style.maxHeight = null;
        }
      });

      // Toggle corrente
      button.classList.toggle("active");
      const panel = button.nextElementSibling;

      if (button.classList.contains("active")) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = null;
      }
    });
  });
}

/* CONFERMA CON CORIANDOLI */
function initBookingConfetti() {
  const selectedInfo = document.getElementById("selectedInfo");
  const confirmBtn = document.getElementById("confirmBookingBtn");

  if (!selectedInfo || !confirmBtn) return;

  // Mostra bottone quando c'è una selezione
  const observer = new MutationObserver(() => {
    const hasText = selectedInfo.textContent.trim().length > 0;
    confirmBtn.style.display = hasText ? "inline-block" : "none";
  });

  observer.observe(selectedInfo, {
    childList: true,
    characterData: true,
    subtree: true
  });

  confirmBtn.addEventListener("click", () => {
    confirmBtn.textContent = "Prenotazione confermata ✓";
    confirmBtn.disabled = true;

    // Se confetti non è caricato, non fare nulla
    if (typeof confetti !== "function") return;

    const duration = 1800;
    const end = Date.now() + duration;
    const fuchsia = "#ff004f";

    (function frame() {
      confetti({
        particleCount: 8,
        spread: 360,
        startVelocity: 45,
        gravity: 0.9,
        ticks: 300,
        colors: [fuchsia],
        origin: { x: Math.random(), y: Math.random() * 0.4 }
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  });
}
