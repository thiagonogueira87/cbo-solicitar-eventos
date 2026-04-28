// ============================================================
//  app.js — Lógica principal (não precisa editar)
// ============================================================

// Inicializa EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// ── Renderiza os locais ────────────────────────────────────
const locGrid = document.getElementById("locationsGrid");

LOCATIONS.forEach((loc) => {
  const card = document.createElement("label");
  card.className = "location-card";
  card.htmlFor = `loc_${loc.id}`;
  card.innerHTML = `
    <input type="checkbox" id="loc_${loc.id}" value="${loc.id}" class="loc-checkbox" />
    <div class="location-icon">${loc.icon}</div>
    <div class="location-name">${loc.label}</div>
    <div class="service-check">✓</div>
  `;
  locGrid.appendChild(card);
});

// ── Renderiza os ministérios ───────────────────────────────
const grid = document.getElementById("servicesGrid");

SERVICES.forEach((service) => {
  const card = document.createElement("label");
  card.className = "service-card";
  card.htmlFor = `svc_${service.id}`;
  card.innerHTML = `
    <input type="checkbox" id="svc_${service.id}" value="${service.id}" class="svc-checkbox" />
    <div class="service-icon">${service.icon}</div>
    <div class="service-name">${service.label}</div>
    <div class="service-leader">Líder: ${service.leaderName}</div>
    <div class="service-check">✓</div>
  `;
  grid.appendChild(card);
});

// ── Observações dinâmicas por ministério ───────────────────
document.getElementById("servicesGrid").addEventListener("change", updateNotes);

function updateNotes() {
  const selected = getSelectedServices();
  const section = document.getElementById("serviceNotesSection");
  const container = document.getElementById("serviceNotes");

  if (selected.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  // Adiciona novos campos sem remover os já existentes (preserva texto digitado)
  const existing = new Set(
    Array.from(container.querySelectorAll(".note-field")).map((el) => el.dataset.id)
  );

  // Remove os desmarcados
  container.querySelectorAll(".note-field").forEach((el) => {
    if (!selected.find((s) => s.id === el.dataset.id)) el.remove();
  });

  // Adiciona os novos
  selected.forEach((svc) => {
    if (existing.has(svc.id)) return;
    const wrap = document.createElement("div");
    wrap.className = "note-field";
    wrap.dataset.id = svc.id;
    wrap.innerHTML = `
      <label for="note_${svc.id}">${svc.icon} ${svc.label} — Orientações para ${svc.leaderName}</label>
      <textarea id="note_${svc.id}" name="note_${svc.id}" placeholder="Descreva o que o ministério de ${svc.label} precisará fazer ou preparar..."></textarea>
    `;
    container.appendChild(wrap);
  });
}

function getSelectedLocations() {
  return Array.from(document.querySelectorAll(".loc-checkbox:checked"))
    .map((cb) => LOCATIONS.find((l) => l.id === cb.value))
    .filter(Boolean);
}

function getSelectedServices() {
  return Array.from(document.querySelectorAll(".svc-checkbox:checked"))
    .map((cb) => SERVICES.find((s) => s.id === cb.value))
    .filter(Boolean);
}

// ── Submit ─────────────────────────────────────────────────
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;

  // Validação de campos obrigatórios
  const required = ["eventName", "requesterName", "requesterPhone", "eventDateStart", "eventDateEnd", "eventObjective"];
  required.forEach((id) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add("field-error");
      valid = false;
    } else {
      el.classList.remove("field-error");
    }
  });

  // Validação de locais
  const selectedLocations = getSelectedLocations();
  if (selectedLocations.length === 0) {
    document.getElementById("noLocationWarning").style.display = "block";
    document.getElementById("locationsGrid").scrollIntoView({ behavior: "smooth", block: "center" });
    valid = false;
  } else {
    document.getElementById("noLocationWarning").style.display = "none";
  }

  // Validação de ministérios
  const selected = getSelectedServices();
  if (selected.length === 0) {
    document.getElementById("noServiceWarning").style.display = "block";
    document.getElementById("servicesGrid").scrollIntoView({ behavior: "smooth", block: "center" });
    valid = false;
  } else {
    document.getElementById("noServiceWarning").style.display = "none";
  }

  if (!valid) return;

  const btn = document.getElementById("submitBtn");
  btn.classList.add("loading");
  btn.querySelector(".btn-text").textContent = "Enviando...";
  btn.disabled = true;

  // Coleta dados
  const data = {
    requesterName:    document.getElementById("requesterName").value.trim(),
    requesterEmail:   document.getElementById("requesterEmail").value.trim() || "Não informado",
    requesterPhone:   document.getElementById("requesterPhone").value.trim(),
    eventName:        document.getElementById("eventName").value.trim(),
    eventDateStart:   formatDateTime(document.getElementById("eventDateStart").value),
    eventDateEnd:     formatDateTime(document.getElementById("eventDateEnd").value),
    eventObjective:   document.getElementById("eventObjective").value.trim(),
    locationsText:    selectedLocations.map((l) => `${l.icon} ${l.label}`).join(", "),
  };

  // Envia e-mail para cada líder de ministério selecionado
  const emailPromises = selected.map((svc) => {
    const note = document.getElementById(`note_${svc.id}`)?.value.trim() || "Nenhuma orientação específica.";
    return sendEmail(svc, data, note);
  });

  // Cópia para admin
  if (APP_CONFIG.adminEmail) {
    const allMinistries = selected.map((s) => `${s.icon} ${s.label} — ${s.leaderName}`).join("\n");
    emailPromises.push(sendAdminEmail(data, allMinistries, selectedLocations));
  }

  try {
    await Promise.allSettled(emailPromises);
    showSuccess(data, selected);
  } catch (err) {
    console.error(err);
    showSuccess(data, selected);
  }
});

// ── Envia e-mail para um líder de ministério ───────────────
function sendEmail(service, data, note) {
  return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
    to_email:           service.email,
    to_name:            service.leaderName,
    ministry_name:      service.label,
    org_name:           APP_CONFIG.orgName,
    event_name:         data.eventName,
    event_date_start:   data.eventDateStart,
    event_date_end:     data.eventDateEnd,
    event_locations:    data.locationsText,
    event_objective:    data.eventObjective,
    requester_name:     data.requesterName,
    requester_email:    data.requesterEmail,
    requester_phone:    data.requesterPhone,
    ministry_notes:     note,
  });
}

// ── Envia e-mail de resumo para o admin ───────────────────
function sendAdminEmail(data, allMinistries, locations) {
  const locText = locations.map((l) => `${l.icon} ${l.label}`).join(", ");
  return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
    to_email:           APP_CONFIG.adminEmail,
    to_name:            "Administrador",
    ministry_name:      "RESUMO — Todos os ministérios notificados",
    org_name:           APP_CONFIG.orgName,
    event_name:         data.eventName,
    event_date_start:   data.eventDateStart,
    event_date_end:     data.eventDateEnd,
    event_locations:    locText,
    event_objective:    data.eventObjective,
    requester_name:     data.requesterName,
    requester_email:    data.requesterEmail,
    requester_phone:    data.requesterPhone,
    ministry_notes:     allMinistries,
  });
}

// ── Tela de sucesso + links WhatsApp ──────────────────────
function showSuccess(data, selected) {
  document.getElementById("eventForm").style.display = "none";
  const screen = document.getElementById("successScreen");
  screen.style.display = "flex";

  document.getElementById("successMessage").textContent =
    `Solicitação para "${data.eventName}" enviada com sucesso! Os líderes de ${selected.length} ministério(s) foram notificados por e-mail.`;

  // Gera links WhatsApp
  const linksDiv = document.getElementById("whatsappLinks");
  const withWA = selected.filter((s) => s.whatsapp);
  if (withWA.length > 0) {
    linksDiv.innerHTML = `<p class="wa-label">📲 Envie também pelo WhatsApp (opcional):</p>`;
    withWA.forEach((svc) => {
      const msg = buildWAMessage(svc, data);
      const url = `https://wa.me/${svc.whatsapp}?text=${encodeURIComponent(msg)}`;
      const btn = document.createElement("a");
      btn.href = url;
      btn.target = "_blank";
      btn.className = "btn-wa";
      btn.innerHTML = `${svc.icon} Avisar ${svc.leaderName} — ${svc.label}`;
      linksDiv.appendChild(btn);
    });
  }

  screen.scrollIntoView({ behavior: "smooth" });
}

function buildWAMessage(service, data) {
  return APP_CONFIG.whatsappMessage
    .replace("{lider}", service.leaderName)
    .replace("{evento}", data.eventName)
    .replace("{inicio}", data.eventDateStart)
    .replace("{fim}", data.eventDateEnd)
    .replace("{responsavel}", data.requesterName);
}

function formatDateTime(iso) {
  if (!iso) return "";
  const dt = new Date(iso);
  const date = dt.toLocaleDateString("pt-BR");
  const time = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} às ${time}`;
}

// Remove destaque de erro ao digitar
document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => el.classList.remove("field-error"));
});

function resetForm() {
  document.getElementById("eventForm").reset();
  document.getElementById("eventForm").style.display = "block";
  document.getElementById("successScreen").style.display = "none";
  document.getElementById("serviceNotesSection").style.display = "none";
  document.getElementById("serviceNotes").innerHTML = "";
  document.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
