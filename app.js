const config = window.MEETING_CONFIG;
const form = document.querySelector("#lookupForm");
const nameInput = document.querySelector("#guestName");
const submitButton = form.querySelector("button");
const statusMessage = document.querySelector("#statusMessage");
const resultPanel = document.querySelector("#resultPanel");
const candidatePanel = document.querySelector("#candidatePanel");

function normalizeName(value) {
  return value.trim().replace(/\s+/g, "").toLocaleLowerCase("ko-KR");
}

function configurePage() {
  const eventMeta = document.querySelector("#eventMeta");
  const dateLine = document.createElement("span");
  const placeLine = document.createElement("span");
  dateLine.textContent = config.EVENT_DATE;
  placeLine.textContent = config.EVENT_PLACE;
  eventMeta.replaceChildren(dateLine, placeLine);
  setLink("#instagramLink", config.INSTAGRAM_URL);
  setLink("#kakaoLink", config.KAKAO_CHANNEL_URL);
  setLink("#scheduleLink", config.SCHEDULE_URL);
  setLink("#tourLink", config.ULSAN_TOUR_URL);
}

function setLink(selector, url) {
  const element = document.querySelector(selector);
  element.href = url || "#";
  if (!url || url === "#") {
    element.addEventListener("click", event => {
      event.preventDefault();
      alert("연결 주소가 준비되면 이용할 수 있어요.");
    });
  }
}

async function findGuests(name) {
  if (config.DATA_MODE === "sample") {
    const key = normalizeName(name);
    const matches = window.SAMPLE_GUESTS.filter(guest => normalizeName(guest.name) === key);
    return matches.map(guest => ({
      ...guest,
      regionGuests: window.SAMPLE_GUESTS
        .filter(person => person.region === guest.region && person.id !== guest.id)
        .map(person => ({ name: person.name, room: person.room }))
    }));
  }

  if (!config.API_URL) throw new Error("조회 시스템 주소가 설정되지 않았습니다.");
  const url = new URL(config.API_URL);
  url.searchParams.set("name", name.trim());
  const response = await fetch(url.toString(), { method: "GET", redirect: "follow" });
  if (!response.ok) throw new Error("숙소 정보를 불러오지 못했습니다.");
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.message || "조회 중 오류가 발생했습니다.");
  return payload.guests || [];
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  clearPanels();
  if (!name) {
    showStatus("성함을 입력해 주세요.");
    nameInput.focus();
    return;
  }

  setLoading(true);
  try {
    const guests = await findGuests(name);
    if (guests.length === 0) {
      showStatus("입력하신 성함을 찾지 못했어요. 성함을 다시 확인해 주세요.");
    } else if (guests.length === 1) {
      showGuest(guests[0]);
    } else {
      showCandidates(guests);
    }
  } catch (error) {
    showStatus(error.message || "잠시 후 다시 시도해 주세요.");
  } finally {
    setLoading(false);
  }
});

function showGuest(guest) {
  candidatePanel.hidden = true;
  document.querySelector("#resultName").textContent = guest.name;
  document.querySelector("#resultRoom").textContent = guest.room || "미정";
  document.querySelector("#resultRoommates").textContent =
    guest.roommates?.length ? guest.roommates.map(name => `${name} 님`).join(", ") : "1인실";
  document.querySelector("#resultRegion").textContent = `${guest.region || "소속 지역"} 참가자`;

  const list = document.querySelector("#regionGuests");
  list.replaceChildren();
  const regionGuests = guest.regionGuests || [];
  if (regionGuests.length === 0) {
    const item = document.createElement("li");
    item.textContent = "같은 지역의 다른 참가자 정보가 없습니다.";
    list.append(item);
  } else {
    regionGuests.forEach(person => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const room = document.createElement("strong");
      name.textContent = `${person.name} 님`;
      room.textContent = `${person.room || "미정"}호`;
      item.append(name, room);
      list.append(item);
    });
  }

  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showCandidates(guests) {
  const container = document.querySelector("#candidateButtons");
  container.replaceChildren();
  guests.forEach(guest => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${guest.name} · ${guest.region}`;
    button.addEventListener("click", () => showGuest(guest));
    container.append(button);
  });
  candidatePanel.hidden = false;
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function clearPanels() {
  statusMessage.textContent = "";
  resultPanel.hidden = true;
  candidatePanel.hidden = true;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "찾고 있어요…" : "숙소 확인하기";
}

document.querySelector("#resetButton").addEventListener("click", () => {
  clearPanels();
  nameInput.value = "";
  nameInput.focus();
  form.scrollIntoView({ behavior: "smooth", block: "center" });
});

const helperBubble = document.querySelector("#helperBubble");
document.querySelector("#closeHelper").addEventListener("click", () => {
  helperBubble.hidden = true;
});
document.querySelector("#helperButton").addEventListener("click", () => {
  helperBubble.hidden = !helperBubble.hidden;
});

configurePage();

// 전체 일정 팝업
const scheduleLink = document.getElementById("scheduleLink");
const scheduleModal = document.getElementById("scheduleModal");
const scheduleClose = document.getElementById("scheduleClose");
const scheduleBackdrop = scheduleModal?.querySelector("[data-close-schedule]");

function openSchedule(event) {
  event.preventDefault();

  scheduleModal.hidden = false;
  document.body.classList.add("schedule-open");
  scheduleClose.focus();
}

function closeSchedule() {
  scheduleModal.hidden = true;
  document.body.classList.remove("schedule-open");
  scheduleLink.focus();
}

scheduleLink?.addEventListener("click", openSchedule);
scheduleClose?.addEventListener("click", closeSchedule);
scheduleBackdrop?.addEventListener("click", closeSchedule);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && scheduleModal && !scheduleModal.hidden) {
    closeSchedule();
  }
});
