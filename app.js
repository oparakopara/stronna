const services = [
  {
    id: "marco-polo-kielce-lopuszno",
    carrier: "Marco Polo",
    from: "Kielce",
    to: "Łopuszno",
    schedules: {
      week: ["5:50", "7:00", "8:40", "9:35", "10:45", "12:15", "12:40", "13:35", "14:25", "15:10", "16:25", "17:10", "19:50"],
      sat: ["7:10", "9:35", "12:40", "15:25", "17:10", "19:15"],
      sun: []
    }
  },
  {
    id: "marco-polo-lopuszno-kielce",
    carrier: "Marco Polo",
    from: "Łopuszno",
    to: "Kielce",
    schedules: {
      week: ["4:50", "5:55", "6:50", "8:25", "9:35", "10:55", "11:45", "12:40", "13:35", "13:55", "15:15", "16:10", "18:50"],
      sat: ["6:10", "8:25", "11:45", "13:35", "16:10", "18:15"],
      sun: []
    }
  },
  {
    id: "pks-wloszczowa-kielce-lopuszno",
    carrier: "PKS Włoszczowa",
    from: "Kielce",
    to: "Łopuszno",
    schedules: {
      week: ["7:20", "10:15", "11:40", "13:50", "16:45"],
      sat: [],
      sun: []
    }
  },
  {
    id: "pks-wloszczowa-lopuszno-kielce",
    carrier: "PKS Włoszczowa",
    from: "Łopuszno",
    to: "Kielce",
    schedules: {
      week: ["6:28", "8:33", "9:43", "12:03", "15:38"],
      sat: [],
      sun: []
    }
  },
  {
    id: "speed-lines-kielce-lopuszno",
    carrier: "SPEED LINES",
    from: "Kielce",
    to: "Łopuszno",
    schedules: {
      week: ["6:55", "8:55", "11:40", "13:15", "14:15", "15:05"],
      sat: [],
      sun: []
    }
  },
  {
    id: "speed-lines-lopuszno-kielce",
    carrier: "SPEED LINES",
    from: "Łopuszno",
    to: "Kielce",
    schedules: {
      week: ["7:50", "10:15", "12:35", "14:10", "15:10"],
      sat: [],
      sun: []
    }
  },
  {
    id: "oparka-kielce-lopuszno",
    carrier: "Oparka PKS Kielce",
    from: "Kielce",
    to: "Łopuszno",
    schedules: {
      week: ["6:35", "6:55", "8:15", "9:10", "10:05", "11:15", "12:00", "13:05", "14:10", "14:40", "15:30", "15:55", "16:55", "17:35", "18:30", "19:05"],
      sat: [],
      sun: []
    }
  },
  {
    id: "oparka-lopuszno-kielce",
    carrier: "Oparka PKS Kielce",
    from: "Łopuszno",
    to: "Kielce",
    schedules: {
      week: ["5:30", "5:45", "6:40", "7:25", "7:50", "9:05", "9:50", "11:15", "13:10", "13:45", "14:30", "15:00", "15:30", "16:40", "17:05", "17:50"],
      sat: [],
      sun: []
    }
  },
  {
    id: "ikar-kielce-lopuszno",
    carrier: "IKAR",
    from: "Kielce",
    to: "Łopuszno",
    schedules: {
      week: ["8:00", "12:10", "15:45", "19:10"],
      sat: ["10:00", "15:50"],
      sun: ["10:00", "15:50"]
    }
  },
  {
    id: "ikar-lopuszno-kielce",
    carrier: "IKAR",
    from: "Łopuszno",
    to: "Kielce",
    schedules: {
      week: ["7:03", "11:13", "14:28", "18:18"],
      sat: ["8:43", "14:28"],
      sun: ["8:43", "14:28"]
    }
  }
];

const stopOptions = [...new Set(services.flatMap((service) => [service.from, service.to]))];
const tabLabels = {
  week: "Poniedziałek - Piątek",
  sat: "Sobota",
  sun: "Niedziela / Święta"
};

let currentTab = "week";
let selectedCarrier = services[0]?.carrier || "";

function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function scoreSuggestion(query, option) {
  const q = normalizeText(query);
  const target = normalizeText(option);

  if (!q) return 1;
  if (target === q) return 200;
  if (target.startsWith(q)) return 140 - (target.length - q.length);
  if (target.includes(q)) return 110 - target.indexOf(q);

  let score = 0;
  let pointer = 0;

  for (const char of q) {
    const foundAt = target.indexOf(char, pointer);
    if (foundAt === -1) return 0;
    score += foundAt === pointer ? 14 : 8;
    pointer = foundAt + 1;
  }

  score -= Math.max(0, target.length - q.length);
  return score;
}

function getSuggestions(query) {
  if (!query.trim()) {
    return stopOptions.slice(0, 6);
  }

  return stopOptions
    .map((option) => ({ option, score: scoreSuggestion(query, option) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.option)
    .slice(0, 6);
}

function renderSuggestions(inputId, boxId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);
  const matches = getSuggestions(input.value);

  if (matches.length === 0) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  box.innerHTML = matches
    .map((option) => `<button type="button" class="suggestion-item block w-full px-4 py-3 text-left text-sm transition hover:bg-blue-50 dark:hover:bg-slate-800">${option}</button>`)
    .join("");
  box.classList.remove("hidden");

  box.querySelectorAll(".suggestion-item").forEach((button) => {
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      input.value = button.textContent;
      box.classList.add("hidden");
      search();
    });
  });
}

function getServicesForRoute(from, to) {
  const start = normalizeText(from);
  const end = normalizeText(to);
  return services.filter((service) =>
    normalizeText(service.from) === start && normalizeText(service.to) === end
  );
}

function getRoutePairs() {
  const seen = new Set();
  const pairs = [];

  services.forEach((service) => {
    const key = `${service.from}|${service.to}`;
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push({ from: service.from, to: service.to });
    }
  });

  return pairs;
}

function getCarrierOptions() {
  return [...new Set(services.map((service) => service.carrier))];
}

function getFlattenedDepartures(tab) {
  return services.flatMap((service) =>
    service.schedules[tab].map((time) => ({
      service,
      time,
      minutes: toMin(time)
    }))
  );
}

function detectInitialTab() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return "week";
  if (day === 6) return "sat";
  return "sun";
}

function getNextTabForSearch(tab) {
  if (tab === "sat") return "sun";
  if (tab === "sun") return "week";
  return "week";
}

function getNextScheduleDate(tab) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 8; i += 1) {
    const candidate = new Date(date);
    candidate.setDate(date.getDate() + i);
    const day = candidate.getDay();
    const candidateTab = day >= 1 && day <= 5 ? "week" : day === 6 ? "sat" : "sun";
    if (candidateTab === tab) return candidate;
  }

  return null;
}

function formatNextScheduleLabel(tab) {
  const date = getNextScheduleDate(tab);
  if (!date) return tabLabels[tab];
  return date.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function getNextAvailableTrip(routeServices, fromTime, startTab = currentTab) {
  const sameDay = routeServices
    .flatMap((service) =>
      service.schedules[startTab].map((time) => ({
        carrier: service.carrier,
        time,
        minutes: toMin(time)
      }))
    )
    .filter((item) => item.minutes >= fromTime)
    .sort((a, b) => a.minutes - b.minutes)[0];

  if (sameDay) {
    return { tab: startTab, time: sameDay.time, carrier: sameDay.carrier, sameDay: true };
  }

  const nextTab = getNextTabForSearch(startTab);
  const nextDay = routeServices
    .flatMap((service) =>
      service.schedules[nextTab].map((time) => ({
        carrier: service.carrier,
        time,
        minutes: toMin(time)
      }))
    )
    .sort((a, b) => a.minutes - b.minutes)[0];

  return nextDay
    ? { tab: nextTab, time: nextDay.time, carrier: nextDay.carrier, sameDay: false }
    : null;
}

function updateNextBus(cur) {
  const preview = document.getElementById("nextRoutesPreview");
  const carrierSelector = document.getElementById("carrierSelector");
  const departuresList = document.getElementById("nextDeparturesList");
  const allDepartures = getFlattenedDepartures(currentTab).sort((a, b) => a.minutes - b.minutes);
  const upcoming = allDepartures.filter((item) => item.minutes >= cur);
  const carrierOptions = getCarrierOptions();

  preview.innerHTML = getRoutePairs()
    .map((route) => `${route.from} → ${route.to}`)
    .join(" • ");

  if (!carrierOptions.includes(selectedCarrier)) {
    selectedCarrier = carrierOptions[0] || "";
  }

  if (upcoming.length) {
    const best = upcoming[0];
    document.getElementById("nextBus").innerText = `${best.service.from} → ${best.service.to} o ${best.time}`;
    document.getElementById("nextInfo").innerText = `${best.service.carrier} • ${tabLabels[currentTab]}`;
  } else {
    document.getElementById("nextBus").innerText = "Wybierz przewoźnika";
    document.getElementById("nextInfo").innerText = `${tabLabels[currentTab]} • kursy wybranego przewoźnika poniżej.`;
  }

  carrierSelector.innerHTML = carrierOptions
    .map((carrier) => {
      const active = carrier === selectedCarrier;
      return `<button type="button" class="carrier-card carrier-card-ui rounded-2xl border px-4 py-3 text-left text-sm font-bold ${active ? "border-white bg-white text-blue-700 shadow-lg shadow-blue-950/20" : "border-white/20 bg-white/10 text-white hover:bg-white/15"}" data-carrier="${carrier}">${carrier}</button>`;
    })
    .join("");

  const groupedMarkup = services
    .filter((service) => service.carrier === selectedCarrier)
    .map((service) => {
      const times = service.schedules[currentTab];
      const nextTime = times.find((time) => toMin(time) >= cur) || times[0] || "brak kursów";
      const chips = times.length
        ? times
            .map((time) => {
              const active = time === nextTime;
              return `<span class="rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-white text-blue-700" : "bg-white/10 text-white"}">${time}</span>`;
            })
            .join("")
        : `<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">Brak kursów</span>`;

      return `<div class="departure-item rounded-2xl border border-white/15 bg-white/8 p-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-semibold">${service.from} → ${service.to}</div>
            <div class="mt-1 text-sm text-blue-100">${service.carrier}</div>
          </div>
          <div class="text-right text-xs text-blue-100">${times.length ? `Najbliższy: ${nextTime}` : "Bez kursów"}</div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">${chips}</div>
      </div>`;
    })
    .join("");

  departuresList.classList.remove("departures-animate");
  void departuresList.offsetWidth;
  departuresList.innerHTML = groupedMarkup;
  departuresList.classList.add("departures-animate");
  document.querySelectorAll(".carrier-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCarrier = button.dataset.carrier;
      render();
    });
  });
}

function render() {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  updateNextBus(cur);
}

function setActiveTabButton(tab, btn) {
  document.querySelectorAll(".tabBtn").forEach((button) => {
    button.classList.remove("bg-blue-600", "text-white");
    button.classList.add("bg-slate-200", "dark:bg-slate-800");
  });

  btn.classList.remove("bg-slate-200", "dark:bg-slate-800");
  btn.classList.add("bg-blue-600", "text-white");
}

function showTab(tab, btn) {
  currentTab = tab;
  setActiveTabButton(tab, btn);
  render();
  if (document.getElementById("from").value || document.getElementById("to").value || document.getElementById("time").value) {
    search();
  }
}

function useCurrentTime() {
  const now = new Date();
  const formatted = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  document.getElementById("time").value = formatted;
  search();
}

function swapStops() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  search();
}

function setQuickTime(value) {
  document.getElementById("time").value = value;
  search();
}

function renderQuickTimes() {
  const quickTimes = ["06:00", "07:00", "08:00", "12:00", "15:00", "18:00", "20:00"];
  const container = document.getElementById("quickTimes");
  container.innerHTML = quickTimes
    .map((time) => `<button type="button" class="rounded-full bg-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" data-time="${time}">${time}</button>`)
    .join("");

  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => setQuickTime(button.dataset.time));
  });
}

function search() {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const time = document.getElementById("time").value;
  const result = document.getElementById("result");

  if (!from || !to || !time) {
    result.className = "mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200";
    result.innerHTML = "Uzupełnij skąd, dokąd i godzinę, a od razu policzymy najbliższy kurs.";
    return;
  }

  const routeServices = getServicesForRoute(from, to);
  if (!routeServices.length) {
    const hints = getSuggestions(from).concat(getSuggestions(to)).filter((value, index, arr) => arr.indexOf(value) === index).slice(0, 3);
    result.className = "mt-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200";
    result.innerHTML = `Tej trasy nie rozpoznaję. Spróbuj jednej z nazw: <strong>${hints.join(", ") || stopOptions.join(", ")}</strong>.`;
    return;
  }

  const requested = toMin(time);
  const sameDayTimes = routeServices
    .flatMap((service) =>
      service.schedules[currentTab].map((departure) => ({
        carrier: service.carrier,
        time: departure,
        minutes: toMin(departure)
      }))
    )
    .filter((item) => item.minutes >= requested)
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, 5);

  if (sameDayTimes.length) {
    result.className = "mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100";
    result.innerHTML = `
      <div class="text-xs uppercase tracking-[0.18em] opacity-70">Wynik wyszukiwania</div>
      <div class="mt-2 text-xl font-black">${from} → ${to}</div>
      <div class="mt-3 space-y-2">
        ${sameDayTimes.map((item) => `<div class="flex items-center justify-between gap-3 rounded-2xl bg-white/60 px-3 py-2 dark:bg-white/10"><span class="font-semibold">${item.time}</span><span class="text-sm">${item.carrier}</span></div>`).join("")}
      </div>
      <div class="mt-2 text-sm opacity-80">Dzień rozkładu: ${tabLabels[currentTab]}.</div>
    `;
    return;
  }

  const fallback = getNextAvailableTrip(routeServices, requested, currentTab);
  if (!fallback) {
    result.className = "mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300";
    result.innerHTML = `Brak kursów dla trasy <strong>${from} → ${to}</strong> w wybranych zakładkach.`;
    return;
  }

  result.className = "mt-5 rounded-3xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100";
  result.innerHTML = `
    <div class="text-xs uppercase tracking-[0.18em] opacity-70">Brak kursu tego dnia</div>
    <div class="mt-2 text-xl font-black">${from} → ${to}</div>
    <div class="mt-2">Po godzinie <strong>${time}</strong> nie ma już kursu w zakładce <strong>${tabLabels[currentTab]}</strong>.</div>
    <div class="mt-2">Najbliższy kurs kolejnego dnia z rozkładu: <strong>${fallback.time}</strong> (${fallback.carrier}).</div>
    <div class="mt-2 text-sm opacity-80">Orientacyjnie: ${formatNextScheduleLabel(fallback.tab)}.</div>
  `;
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  document.getElementById("todayLabel").innerText = now.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("oparka-theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
  updateThemeButton();
}

function updateThemeButton() {
  const dark = document.documentElement.classList.contains("dark");
  document.getElementById("themeToggle").innerText = dark ? "Tryb dzienny" : "Tryb nocny";
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const dark = document.documentElement.classList.contains("dark");
  localStorage.setItem("oparka-theme", dark ? "dark" : "light");
  updateThemeButton();
}

function bindSuggestionInput(inputId, boxId) {
  const input = document.getElementById(inputId);
  input.addEventListener("input", () => renderSuggestions(inputId, boxId));
  input.addEventListener("focus", () => renderSuggestions(inputId, boxId));
  input.addEventListener("blur", () => {
    setTimeout(() => document.getElementById(boxId).classList.add("hidden"), 120);
  });
}

function bindLiveSearch() {
  ["from", "to", "time"].forEach((id) => {
    document.getElementById(id).addEventListener("change", search);
  });
}

applySavedTheme();
renderQuickTimes();
bindSuggestionInput("from", "fromSuggestions");
bindSuggestionInput("to", "toSuggestions");
bindLiveSearch();
updateClock();
setInterval(updateClock, 1000);

const initialTab = detectInitialTab();
const initialBtn = document.querySelector(`[onclick="showTab('${initialTab}', this)"]`);
currentTab = initialTab;
setActiveTabButton(initialTab, initialBtn);
render();
