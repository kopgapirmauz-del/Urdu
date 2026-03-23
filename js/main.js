function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function initLanguageMenu() {
  const toggle = document.querySelector("[data-lang-toggle]");
  const menu = document.querySelector("[data-lang-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("is-open");
  });

  document.addEventListener("click", () => menu.classList.remove("is-open"));
}

function initMobileMenu() {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    panel.classList.toggle("is-open");
  });
}

function initNavDropdowns() {
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (!dropdown.open) return;
      dropdowns.forEach((item) => {
        if (item !== dropdown) item.open = false;
      });
    });
  });

  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) dropdown.open = false;
    });
  });
}

function initFloatingTools() {
  const topButton = document.querySelector("[data-scroll-top]");
  const assistant = document.querySelector("[data-ai-assistant]");
  const launcher = document.querySelector("[data-ai-launcher]");
  const openButton = document.querySelector("[data-ai-toggle]");
  const closeButton = document.querySelector("[data-ai-close]");
  const dismissButton = document.querySelector("[data-ai-dismiss]");
  const form = document.querySelector("[data-ai-form]");
  const input = document.querySelector("[data-ai-input]");
  const messages = document.querySelector("[data-ai-messages]");

  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (!assistant || !openButton || !closeButton || !form || !input || !messages || !launcher) return;

  const replyMap = {
    qabul: "Qabul bo'yicha ma'lumotlarni `Talabalar` bo'limidan topishingiz mumkin. U yerda bakalavriat, magistratura va o'qishni ko'chirish sahifalari mavjud.",
    abituriyent: "Abituriyentlar uchun kerakli sahifalar `Talabalar` menyusi ichida jamlangan. Qabul, magistratura va kvotalar bo'yicha sahifalarni ochib ko'ring.",
    yangilik: "So'nggi yangiliklar bosh sahifadagi yangiliklar bo'limida va `Axborot xizmati` sahifalarida joylashgan.",
    universitet: "Universitet haqida ma'lumotlarni `Universitet` bo'limidan topishingiz mumkin: tarix, nizom, fakultetlar, kafedralar va boshqa sahifalar mavjud.",
    aloqa: "Aloqa ma'lumotlari sahifaning pastki qismi va tegishli bo'limlarda ko'rsatilgan. Kerak bo'lsa men sizni kerakli sahifaga yo'naltiraman.",
    default: "Rahmat! Men hozir oddiy AI assistent sifatida ishlayapman. Savolingizni aniqroq yozsangiz, sizga tegishli bo'lim yoki sahifani topishda yordam beraman."
  };

  function openAssistant() {
    assistant.hidden = false;
    input.focus();
  }

  function closeAssistant() {
    assistant.hidden = true;
  }

  function dismissLauncher() {
    assistant.hidden = true;
    launcher.hidden = true;
    window.setTimeout(() => {
      launcher.hidden = false;
    }, 300000);
  }

  function appendMessage(text, role) {
    const bubble = document.createElement("article");
    bubble.className = `ai-assistant__bubble ai-assistant__bubble--${role}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function generateReply(text) {
    const value = text.toLowerCase();
    if (value.includes("qabul") || value.includes("admission")) return replyMap.qabul;
    if (value.includes("abitur") || value.includes("student")) return replyMap.abituriyent;
    if (value.includes("yangilik") || value.includes("news")) return replyMap.yangilik;
    if (value.includes("universitet") || value.includes("university")) return replyMap.universitet;
    if (value.includes("aloqa") || value.includes("contact")) return replyMap.aloqa;
    return replyMap.default;
  }

  openButton.addEventListener("click", openAssistant);
  closeButton.addEventListener("click", closeAssistant);
  dismissButton.addEventListener("click", dismissLauncher);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    input.value = "";
    window.setTimeout(() => {
      appendMessage(generateReply(text), "bot");
    }, 450);
  });
}

function initProtectedMode() {
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  document.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (target && (target.tagName === "IMG" || target.closest("img, svg"))) {
      event.preventDefault();
    }
  });

  document.addEventListener("copy", (event) => {
    const active = document.activeElement;
    const isEditable = active && (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable
    );
    if (!isEditable) {
      event.preventDefault();
    }
  });

  document.addEventListener("selectstart", (event) => {
    const target = event.target;
    if (!target.closest("input, textarea, [contenteditable='true']")) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const withCtrl = event.ctrlKey || event.metaKey;

    if (event.key === "PrintScreen") {
      event.preventDefault();
      return;
    }

    if (event.key === "F12") {
      event.preventDefault();
      return;
    }

    if (withCtrl && ["c", "s", "u", "p", "a", "x"].includes(key)) {
      const active = document.activeElement;
      const isEditable = active && (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable
      );

      if (!isEditable || key !== "a") {
        event.preventDefault();
      }
    }

    if (withCtrl && event.shiftKey && ["i", "j", "c", "s"].includes(key)) {
      event.preventDefault();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initLanguageMenu();
  initMobileMenu();
  initNavDropdowns();
  initFloatingTools();
  initProtectedMode();
});
