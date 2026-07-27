// ============================================================
// app.js — Sistema de solicitação de eventos
// ============================================================

// ------------------------------------------------------------
// Renderização dos locais
// ------------------------------------------------------------

const locGrid = document.getElementById("locationsGrid");

LOCATIONS.forEach((loc) => {
  const card = document.createElement("label");

  card.className = "location-card";
  card.htmlFor = `loc_${loc.id}`;

  card.innerHTML = `
    <input
      type="checkbox"
      id="loc_${loc.id}"
      value="${loc.id}"
      class="loc-checkbox"
    />

    <div class="location-icon">${loc.icon}</div>
    <div class="location-name">${loc.label}</div>
    <div class="service-check">✓</div>
  `;

  locGrid.appendChild(card);
});

// ------------------------------------------------------------
// Renderização dos ministérios
// ------------------------------------------------------------

const servicesGrid = document.getElementById("servicesGrid");

SERVICES.forEach((service) => {
  const card = document.createElement("label");

  card.className = "service-card";
  card.htmlFor = `svc_${service.id}`;

  card.innerHTML = `
    <input
      type="checkbox"
      id="svc_${service.id}"
      value="${service.id}"
      class="svc-checkbox"
    />

    <div class="service-icon">${service.icon}</div>
    <div class="service-name">${service.label}</div>
    <div class="service-leader">Líder: ${service.leaderName}</div>
    <div class="service-check">✓</div>
  `;

  servicesGrid.appendChild(card);
});

// ------------------------------------------------------------
// Observações específicas por ministério
// ------------------------------------------------------------

servicesGrid.addEventListener("change", updateNotes);

function updateNotes() {
  const selected = getSelectedServices();
  const section = document.getElementById("serviceNotesSection");
  const container = document.getElementById("serviceNotes");

  if (selected.length === 0) {
    section.style.display = "none";
    container.innerHTML = "";
    return;
  }

  section.style.display = "block";

  const existing = new Set(
    Array.from(container.querySelectorAll(".note-field")).map(
      (element) => element.dataset.id
    )
  );

  // Remove os campos de ministérios desmarcados
  container.querySelectorAll(".note-field").forEach((element) => {
    const continuaSelecionado = selected.some(
      (service) => service.id === element.dataset.id
    );

    if (!continuaSelecionado) {
      element.remove();
    }
  });

  // Adiciona campos dos novos ministérios selecionados
  selected.forEach((service) => {
    if (existing.has(service.id)) {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.className = "note-field";
    wrapper.dataset.id = service.id;

    wrapper.innerHTML = `
      <label for="note_${service.id}">
        ${service.icon} ${service.label} — Orientações para ${service.leaderName}
      </label>

      <textarea
        id="note_${service.id}"
        placeholder="Descreva o que o ministério de ${service.label} precisará fazer ou preparar..."
      ></textarea>
    `;

    container.appendChild(wrapper);
  });
}

// ------------------------------------------------------------
// Seleções
// ------------------------------------------------------------

function getSelectedLocations() {
  return Array.from(
    document.querySelectorAll(".loc-checkbox:checked")
  )
    .map((checkbox) =>
      LOCATIONS.find((location) => location.id === checkbox.value)
    )
    .filter(Boolean);
}

function getSelectedServices() {
  return Array.from(
    document.querySelectorAll(".svc-checkbox:checked")
  )
    .map((checkbox) =>
      SERVICES.find((service) => service.id === checkbox.value)
    )
    .filter(Boolean);
}

function getMinistryNotes(selectedServices) {
  const notes = {};

  selectedServices.forEach((service) => {
    const textarea = document.getElementById(`note_${service.id}`);

    notes[service.id] =
      textarea && textarea.value.trim()
        ? textarea.value.trim()
        : "Nenhuma orientação específica.";
  });

  return notes;
}

// ------------------------------------------------------------
// Envio do formulário
// ------------------------------------------------------------

document
  .getElementById("eventForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    clearSubmitError();

    const selectedLocations = getSelectedLocations();
    const selectedServices = getSelectedServices();

    if (!validateForm(selectedLocations, selectedServices)) {
      return;
    }

    setSubmitting(true);

    const payload = {
      nomeEvento: document
        .getElementById("eventName")
        .value.trim(),

      nomeResponsavel: document
        .getElementById("requesterName")
        .value.trim(),

      contato: document
        .getElementById("requesterPhone")
        .value.trim(),

      emailResponsavel:
        document
          .getElementById("requesterEmail")
          .value.trim() || "Não informado",

      // Enviamos o valor original do datetime-local.
      // O Google Apps Script fará a formatação.
      dataHoraInicio:
        document.getElementById("eventDateStart").value,

      dataHoraFim:
        document.getElementById("eventDateEnd").value,

      objetivo:
        document.getElementById("eventObjective").value.trim(),

      espacos: selectedLocations.map(
        (location) => location.id
      ),

      ministerios: selectedServices.map(
        (service) => service.id
      ),

      observacoesMinisterios:
        getMinistryNotes(selectedServices),
    };

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",

        // text/plain evita o bloqueio de preflight CORS
        // comum em chamadas para Google Apps Script.
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },

        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          "O servidor respondeu em um formato inesperado."
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Não foi possível registrar a solicitação."
        );
      }

      showSuccess(payload, selectedServices);
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);

      showSubmitError(
        error.message ||
          "Não foi possível enviar a solicitação. Tente novamente."
      );

      setSubmitting(false);
    }
  });

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

function validateForm(selectedLocations, selectedServices) {
  let valid = true;

  const requiredFields = [
    "eventName",
    "requesterName",
    "requesterPhone",
    "eventDateStart",
    "eventDateEnd",
    "eventObjective",
  ];

  requiredFields.forEach((id) => {
    const element = document.getElementById(id);

    if (!element.value.trim()) {
      element.classList.add("field-error");
      valid = false;
    } else {
      element.classList.remove("field-error");
    }
  });

  const emailInput =
    document.getElementById("requesterEmail");

  if (
    emailInput.value.trim() &&
    !emailInput.checkValidity()
  ) {
    emailInput.classList.add("field-error");
    valid = false;
  }

  const startValue =
    document.getElementById("eventDateStart").value;

  const endValue =
    document.getElementById("eventDateEnd").value;

  if (startValue && endValue) {
    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    if (endDate <= startDate) {
      document
        .getElementById("eventDateEnd")
        .classList.add("field-error");

      showSubmitError(
        "A data e a hora do fim precisam ser posteriores ao início."
      );

      valid = false;
    }
  }

  const locationWarning =
    document.getElementById("noLocationWarning");

  if (selectedLocations.length === 0) {
    locationWarning.style.display = "block";

    document
      .getElementById("locationsGrid")
      .scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    valid = false;
  } else {
    locationWarning.style.display = "none";
  }

  const serviceWarning =
    document.getElementById("noServiceWarning");

  if (selectedServices.length === 0) {
    serviceWarning.style.display = "block";

    document
      .getElementById("servicesGrid")
      .scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    valid = false;
  } else {
    serviceWarning.style.display = "none";
  }

  return valid;
}

// ------------------------------------------------------------
// Estado do botão
// ------------------------------------------------------------

function setSubmitting(isSubmitting) {
  const button = document.getElementById("submitBtn");
  const buttonText = button.querySelector(".btn-text");

  if (isSubmitting) {
    button.classList.add("loading");
    button.disabled = true;
    buttonText.textContent = "Enviando...";
  } else {
    button.classList.remove("loading");
    button.disabled = false;
    buttonText.textContent = "Enviar Solicitação";
  }
}

// ------------------------------------------------------------
// Mensagens de erro
// ------------------------------------------------------------

function showSubmitError(message) {
  const errorBox =
    document.getElementById("submitError");

  errorBox.textContent = `⚠️ ${message}`;
  errorBox.style.display = "block";

  errorBox.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function clearSubmitError() {
  const errorBox =
    document.getElementById("submitError");

  errorBox.textContent = "";
  errorBox.style.display = "none";
}

// ------------------------------------------------------------
// Tela de sucesso
// ------------------------------------------------------------

function showSuccess(data, selectedServices) {
  document.getElementById("eventForm").style.display =
    "none";

  const screen =
    document.getElementById("successScreen");

  screen.style.display = "flex";

  document.getElementById(
    "successMessage"
  ).textContent =
    `A solicitação para "${data.nomeEvento}" foi registrada. ` +
    `${selectedServices.length} ministério(s) foram acionados.`;

  screen.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// ------------------------------------------------------------
// Limpeza de erros ao digitar
// ------------------------------------------------------------

document
  .querySelectorAll("input, textarea")
  .forEach((element) => {
    element.addEventListener("input", () => {
      element.classList.remove("field-error");
      clearSubmitError();
    });
  });

// ------------------------------------------------------------
// Reiniciar formulário
// ------------------------------------------------------------

function resetForm() {
  const form = document.getElementById("eventForm");

  form.reset();
  form.style.display = "block";

  document.getElementById(
    "successScreen"
  ).style.display = "none";

  document.getElementById(
    "serviceNotesSection"
  ).style.display = "none";

  document.getElementById(
    "serviceNotes"
  ).innerHTML = "";

  document.getElementById(
    "noLocationWarning"
  ).style.display = "none";

  document.getElementById(
    "noServiceWarning"
  ).style.display = "none";

  document
    .querySelectorAll(".field-error")
    .forEach((element) => {
      element.classList.remove("field-error");
    });

  clearSubmitError();
  setSubmitting(false);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
