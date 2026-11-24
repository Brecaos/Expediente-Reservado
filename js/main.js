"use strict";

/* ============================================================
   DATOS
   ============================================================ */

const FILES = [
  {
    code: "A01",
    route: "I",
    role: "El Analista",
    serial: "PN–01/A",
    function: "Identificar patrones, contrastar versiones y separar los hechos de las suposiciones.",
    dossier: {
      name: "Alejandro Montenegro Ruiz",
      alias: "Santo Tomás",
      identityCode: "A8K29M4X",
      birthDate: "14/08/1998",
      birthPlace: "CENSURADO",
      nationality: "Colombiana",
      sex: "Masculino",
      maritalStatus: "CENSURADO",
      bloodType: "O+",
      residence: "CENSURADO",
      crimes:
        "Fraude documental, manipulación de información confidencial, falsificación de registros y planificación de robos de alto valor.",
    },
    clue: "La Perla Negra está registrada bajo el número de inventario 27.",
    directive: "Comparte con el equipo qué patrón debería buscarse primero.",
  },
  {
    code: "C02",
    route: "II",
    role: "El Cartógrafo",
    serial: "PN–02/C",
    function: "Reconstruir recorridos, conexiones y puntos de encuentro entre las evidencias.",
    dossier: {
      name: "Nicolás Valderrama Torres",
      alias: "Estambul",
      identityCode: "C7P41L9Q",
      birthDate: "07-06-1854",
      birthPlace: "CENSURADO",
      nationality: "Colombiana",
      sex: "Masculino",
      maritalStatus: "CENSURADO",
      bloodType: "A+",
      residence: "CENSURADO",
      crimes:
        "Ingreso no autorizado a propiedades privadas, alteración de planos, vigilancia clandestina y acceso ilícito a zonas restringidas.",
    },
    clue: "Existe una ubicación restringida donde se almacenan los archivos privados del curador Adrián Valcárcel.",
    directive: "Explica al equipo cómo conectar las cuatro fuentes.",
  },
  {
    code: "R03",
    route: "III",
    role: "El Archivista",
    serial: "PN–03/R",
    function: "Ordenar los registros y detectar aquello que fue omitido, alterado o clasificado.",
    dossier: {
      name: "Valentina Salcedo Méndez",
      alias: "Lisboa",
      identityCode: "R5N82D6W",
      birthDate: "09/11/1999",
      birthPlace: "CENSURADO",
      nationality: "Venezolana",
      sex: "Femenino",
      maritalStatus: "CENSURADO",
      bloodType: "B+",
      residence: "CENSURADO",
      crimes:
        "Sustracción de documentos históricos, falsificación de archivos, apropiación de información privada y alteración de registros patrimoniales.",
    },
    clue: "Adrián Valcárcel es el responsable de la exposición y mantiene una relación directa con la Perla Negra.",
    directive: "Señala al equipo qué ausencia puede cambiar la lectura.",
  },
  {
    code: "T04",
    route: "IV",
    role: "El Especialista técnico",
    serial: "PN–04/T",
    function: "Examinar los soportes, revelar señales ocultas y validar la autenticidad del mensaje.",
    dossier: {
      name: "Jazbleidis Yonkleiberzon Azuaje",
      alias: "Kioto",
      identityCode: "T3X68B2J",
      birthDate: "17/06/1997",
      birthPlace: "CENSURADO",
      nationality: "Colombiana",
      sex: "Femenina",
      maritalStatus: "CENSURADO",
      bloodType: "AB+",
      residence: "CENSURADO",
      crimes:
        "Acceso no autorizado a sistemas informáticos, manipulación de dispositivos electrónicos, sabotaje de sistemas de vigilancia y falsificación de credenciales digitales.",
    },
    clue: "Adrián Valcárcel utiliza un sistema privado para almacenar información de la exposición y sus claves contienen caracteres especiales.",
    directive: "Indica al equipo qué método permitiría revelar lo oculto.",
  },
];

/* ============================================================
   ESTADO
   ============================================================ */

const state = {
  screen: "welcome",
  keyword: "",
  personalCode: "",
  authError: false,
  activeFile: null,
  checked: [false, false, false, false],
  differences: ["", "", "", ""],
};

const root = document.getElementById("root");
let lastScreen = null;

/* ============================================================
   UTILIDADES Y PIEZAS VISUALES
   ============================================================ */

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );

const arrowIcon = (direction = "right") =>
  `<svg aria-hidden="true"${direction === "left" ? ' class="icon-flip"' : ""} fill="none" height="18" viewBox="0 0 24 18" width="24"><path d="M1 9h21M15 2l7 7-7 7" stroke="currentColor" stroke-width="1.5"/></svg>`;

const lockIcon = () =>
  `<svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20"><rect height="10" rx="1" stroke="currentColor" width="14" x="3" y="8"/><path d="M6 8V5a4 4 0 0 1 8 0v3M10 12v3" stroke="currentColor"/></svg>`;

const mark = (compact = false) =>
  `<div class="brand-mark${compact ? " brand-mark--compact" : ""}" aria-hidden="true"><img alt="" src="assets/brujula-nautica.svg"></div>`;

const kicker = (text) => `<div class="kicker"><span></span>${text}</div>`;

function frame(screen, content, withBack = false) {
  const isKeyScreen = screen === "welcome" || screen === "mission";
  const leading = withBack
    ? `<button class="icon-button" type="button" data-action="back" aria-label="Volver">${arrowIcon("left")}</button>`
    : mark(true);

  return `
    <main class="app-shell${isKeyScreen ? " app-shell--wine" : ""}">
      <aside class="desktop-rail" aria-hidden="true">
        ${mark()}
        <p>OPERACIÓN</p>
        <h2>PERLA<br>NEGRA</h2>
        <div class="rail-line"></div>
        <span>ACTIVIDAD DIGITAL 02</span>
        <b>ACCESO RESTRINGIDO</b>
      </aside>

      <section class="screen">
        <header class="topbar">
          ${leading}
          <div class="topbar__title">
            <span>OPERACIÓN PERLA NEGRA</span>
            <small>ACTIVIDAD DIGITAL 02</small>
          </div>
          <span class="security-dot" aria-label="Conexión segura"></span>
        </header>

        <div class="screen__content">${content}</div>

        <footer class="system-footer">
          <span>EXPEDIENTE RESERVADO</span>
          <span>SECURE_SYS · 02</span>
        </footer>
      </section>
    </main>`;
}

/* ============================================================
   VISTAS
   ============================================================ */

function welcomeView() {
  return frame(
    "welcome",
    `
    <div class="welcome">
      <div class="classified-stamp" style="margin-left: -22px; margin-right: -22px">CONFIDENCIAL</div>
      <div class="welcome__emblem">${mark()}</div>
      ${kicker("NIVEL DE SEGURIDAD · IV")}
      <h1>Expediente<br><em>Reservado</em></h1>
      <div class="hairline"></div>
      <p class="lead">Estás ingresando a un sistema de información confidencial.</p>
      <p class="note" style="font-size: 12px">
        La consulta es personal. No compartas tu código de acceso ni abandones el sistema
        mientras el expediente esté abierto.
      </p>
      <button class="primary-button primary-button--dark" type="button" data-action="go-auth">
        <span>ACCEDER AL SISTEMA</span>${arrowIcon()}
      </button>
      <div class="welcome__status">
        <span></span>
        CANAL CIFRADO · CONEXIÓN SEGURA
      </div>
    </div>`,
  );
}

function authView() {
  const errorBlock = state.authError
    ? `
      <div class="error-message" role="alert">
        <span>!</span>
        <p>
          <strong>NO SE PUDO ACCEDER</strong>
          Palabra clave o código personal incorrectos. Revisa los datos e inténtalo de nuevo.
        </p>
      </div>`
    : "";

  return frame(
    "auth",
    `
    <div class="page">
      ${kicker("CONTROL DE ACCESO")}
      <h1 class="page-title">Verificación<br>de identidad</h1>
      <p class="page-intro">Introduce las credenciales asignadas para consultar tu ruta.</p>

      <form class="auth-form" id="auth-form">
        <label>
          <span>PALABRA CLAVE</span>
          <div class="input-wrap">
            <input
              autocapitalize="characters"
              autocomplete="off"
              data-field="keyword"
              placeholder="Introduce la palabra clave"
              type="text"
              value="${esc(state.keyword)}"
            />
            ${lockIcon()}
          </div>
        </label>
        <label>
          <span>CÓDIGO PERSONAL</span>
          <div class="input-wrap">
            <input
              autocapitalize="characters"
              autocomplete="off"
              data-field="code"
              placeholder="Introduce tu código personal"
              type="text"
              value="${esc(state.personalCode)}"
            />
            <span class="mono-mark">#</span>
          </div>
        </label>

        ${errorBlock}

        <button class="primary-button" type="submit">
          <span>${state.authError ? "REINTENTAR ACCESO" : "ENVIAR CREDENCIALES"}</span>${arrowIcon()}
        </button>
      </form>
    </div>`,
    true,
  );
}

function fileView() {
  const f = state.activeFile;
  const d = f.dossier;
  const fields = [
    ["NOMBRE", d.name],
    ["ALIAS", d.alias],
    ["CÓDIGO", d.identityCode],
    ["FECHA DE NACIMIENTO", d.birthDate],
    ["LUGAR DE NACIMIENTO", d.birthPlace],
    ["NACIONALIDAD", d.nationality],
    ["SEXO", d.sex],
    ["ESTADO CIVIL", d.maritalStatus],
    ["TIPO DE SANGRE", d.bloodType],
    ["VIVIENDA", d.residence],
  ];

  return frame(
    "file",
    `
    <div class="page file-page">
      <div class="file-meta">
        <div><span>RUTA</span><strong>${esc(f.route)}</strong></div>
        <div><span>N.º EXPEDIENTE</span><b>${esc(f.serial)}</b></div>
      </div>

      ${kicker("ACCESO AUTORIZADO")}
      <h1 class="role-title">${esc(f.role)}</h1>

      <section class="dossier-card" aria-label="Expediente de ${esc(f.role)}">
        <div class="dossier-card__header">
          ${lockIcon()}
          <span>EXPEDIENTE</span>
          <b>${esc(d.identityCode)}</b>
        </div>
        <dl class="dossier-card__details">
          ${fields
            .map(
              ([label, value]) => `
            <div>
              <dt>${label}</dt>
              <dd class="${value === "CENSURADO" ? "is-redacted" : ""}">${esc(value)}</dd>
            </div>`,
            )
            .join("")}
          <div class="dossier-card__crimes">
            <dt>DELITOS</dt>
            <dd>${esc(d.crimes)}</dd>
          </div>
        </dl>
      </section>

      <div class="role-function">
        <span>FUNCIÓN ASIGNADA</span>
        <p>${esc(f.function)}</p>
      </div>

      <article class="clue-card">
        <div class="clue-card__header">
          ${lockIcon()}
          <span>PISTA CONFIDENCIAL</span>
          <b>01/01</b>
        </div>
        <p>“${esc(f.clue)}”</p>
        <div class="clue-card__directive">
          <span>DIRECTIVA</span>
          ${esc(f.directive)}
        </div>
        <div class="clue-watermark">CONFIDENCIAL</div>
      </article>

      <p class="privacy-note">
        ${lockIcon()}
        Esta información pertenece únicamente a tu ruta. Memorízala antes de finalizar.
      </p>

      <button class="primary-button" type="button" data-action="go-confirmed">
        <span>FINALIZAR CONSULTA</span>${arrowIcon()}
      </button>
    </div>`,
  );
}

function confirmedView() {
  return frame(
    "confirmed",
    `
    <div class="center-page">
      <div class="success-seal">
        <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" stroke="currentColor"/>
          <path d="m14 25 7 7 14-16" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      ${kicker("CONSULTA COMPLETADA")}
      <h1 class="page-title">Expediente consultado correctamente.</h1>
      <p class="page-intro">Comparte la información con el equipo.</p>
      <div class="instruction-card">
        <span>PROTOCOLO SIGUIENTE</span>
        <p>No muestres la pantalla. Explica tu pista con tus propias palabras.</p>
      </div>
      <button class="primary-button" type="button" data-action="go-group">
        <span>CERRAR EXPEDIENTE</span>${arrowIcon()}
      </button>
    </div>`,
  );
}

function groupView() {
  const count = countChecked();
  const checklist = FILES.map(
    (file, i) => `
      <label class="${state.checked[i] ? "is-checked" : ""}">
        <input type="checkbox" data-index="${i}"${state.checked[i] ? " checked" : ""} />
        <span class="custom-check">
          <svg aria-hidden="true" fill="none" viewBox="0 0 14 14">
            <path d="m2 7 3 3 7-7" stroke="currentColor"/>
          </svg>
        </span>
        <b>RUTA ${file.route}</b>
        <p>${esc(file.role)}</p>
      </label>`,
  ).join("");

  return frame(
    "group",
    `
    <div class="page group-page">
      ${kicker("PROTOCOLO DE EQUIPO")}
      <h1 class="page-title">Reunir y relacionar las cuatro pistas</h1>
      <p class="page-intro">
        Cada integrante debe compartir su hallazgo. Marca las rutas manualmente a medida que
        sean presentadas.
      </p>

      <div class="progress-heading">
        <span>PISTAS REUNIDAS</span>
        <strong data-count>${count}<i>/4</i></strong>
      </div>
      <div class="progress-line">
        <span data-progress style="width: ${count * 25}%"></span>
      </div>

      <div class="route-checklist">${checklist}</div>

      <button class="primary-button" type="button" data-action="relate" data-relate ${count < 4 ? "disabled" : ""}>
        <span>${relateLabel(count)}</span>${arrowIcon()}
      </button>
    </div>`,
  );
}

function reviewView() {
  const complete = reviewComplete();
  const fields = state.differences
    .map(
      (value, i) => `
        <label>
          <span>DIFERENCIA ${i + 1}</span>
          <textarea
            aria-label="Diferencia ${i + 1}"
            data-diff="${i}"
            placeholder="Escribe la diferencia encontrada..."
            rows="3"
          >${esc(value)}</textarea>
        </label>`,
    )
    .join("");

  return frame(
    "review",
    `
    <div class="page review-page">
      ${kicker("REVISIÓN DEL ANALISTA · 4/4 PISTAS REUNIDAS")}
      <h1 class="page-title">Revisa los expedientes</h1>
      <p class="page-intro">
        Los expedientes han sido comprometidos. Verifícalos con los documentos que tiene el
        Archivista. Con ellos deben encontrar las pequeñas diferencias que hay y escribirlas.
      </p>

      <form class="review-form" id="review-form">
        <div class="difference-grid">${fields}</div>

        <button class="primary-button" type="submit" data-review-submit ${complete ? "" : "disabled"}>
          <span>${reviewLabel(complete)}</span>${arrowIcon()}
        </button>
      </form>
    </div>`,
  );
}

function architectView() {
  return frame(
    "architect",
    `
    <div class="page architect-page">
      ${kicker("TRANSMISIÓN INTERCEPTADA")}
      <h1 class="page-title">Las piezas encajan.</h1>
      <article class="architect-message">
        <div class="architect-message__meta">
          <span>REMITENTE</span>
          <b>ARQ_00</b>
        </div>
        <h2>El Arquitecto</h2>
        <p>
          “La información pública solo revela una parte de la historia. El curador conserva los registros más importantes en sus archivos personales. Existe una comunicación que podría revelar cómo encontrar el acceso a esa información. No todo lo escrito puede leerse a simple vista.”
        </p>
        <div class="message-signature">— E. A.</div>
        <div class="classified-stamp classified-stamp--message">CLASIFICADO</div>
      </article>
      <button class="primary-button" type="button" data-action="go-mission">
        <span>CONTINUAR</span>${arrowIcon()}
      </button>
    </div>`,
  );
}

function missionView() {
  return frame(
    "mission",
    `
    <div class="mission-page">
      ${kicker("SIGUIENTE MISIÓN")}
      <span class="mission-number">03</span>
      <h1 style="font-size: 47px">La comunicación<br><em>oculta</em></h1>
      <div class="hairline"></div>
      <p class="lead">
      "Logramos localizar el auto de uno de sus secuaces con la placa HPZ078 de color gris."
      </p>
      <button class="primary-button primary-button--dark" type="button" data-action="reset">
        <span>FINALIZAR OPERACIÓN</span>${arrowIcon()}
      </button>
    </div>`,
  );
}

const views = {
  welcome: welcomeView,
  auth: authView,
  file: fileView,
  confirmed: confirmedView,
  group: groupView,
  review: reviewView,
  architect: architectView,
  mission: missionView,
};

/* ============================================================
   LÓGICA
   ============================================================ */

function countChecked() {
  return state.checked.filter(Boolean).length;
}

function reviewComplete() {
  return state.differences.every((difference) => difference.trim().length > 0);
}

function relateLabel(count) {
  return count < 4 ? `FALTAN ${4 - count} PISTAS` : "RELACIONAR LAS PISTAS";
}

function reviewLabel(complete) {
  return complete ? "FINALIZAR REVISIÓN" : "COMPLETA LAS 4 DIFERENCIAS";
}

function render() {
  root.innerHTML = views[state.screen]();
  if (state.screen !== lastScreen) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    lastScreen = state.screen;
  }
}

function go(screen) {
  state.screen = screen;
  render();
}

function resetAll() {
  Object.assign(state, {
    keyword: "",
    personalCode: "",
    authError: false,
    activeFile: null,
    checked: [false, false, false, false],
    differences: ["", "", "", ""],
  });
  go("welcome");
}

function authenticate() {
  const code = state.personalCode.trim().toUpperCase().replace(/\s/g, "");
  const matchingFile = FILES.find((file) => file.dossier.identityCode === code);
  const validKeyword = state.keyword.trim().toUpperCase() === "EXPEDIENTE";

  if (!validKeyword || !matchingFile) {
    state.authError = true;
    render();
    return;
  }

  state.authError = false;
  state.activeFile = matchingFile;
  go("file");
}

// Quita el error al escribir, sin volver a dibujar la pantalla (para no perder el foco).
function clearAuthError() {
  if (!state.authError) return;
  state.authError = false;
  document.querySelector(".error-message")?.remove();
  const label = document.querySelector("#auth-form .primary-button span");
  if (label) label.textContent = "ENVIAR CREDENCIALES";
}

// Actualiza progreso y botón sin redibujar, para que la transición de la barra se vea.
function updateGroupProgress() {
  const count = countChecked();
  const progress = document.querySelector("[data-progress]");
  const total = document.querySelector("[data-count]");
  const relate = document.querySelector("[data-relate]");

  if (progress) progress.style.width = `${count * 25}%`;
  if (total) total.innerHTML = `${count}<i>/4</i>`;
  if (relate) {
    relate.disabled = count < 4;
    relate.querySelector("span").textContent = relateLabel(count);
  }
}

function toggleRoute(index) {
  state.checked[index] = !state.checked[index];

  const input = document.querySelector(`input[data-index="${index}"]`);
  input.checked = state.checked[index];
  input.closest("label").classList.toggle("is-checked", state.checked[index]);

  updateGroupProgress();
}

// Actualiza solo el botón de revisión mientras se escribe.
function updateReviewButton() {
  const button = document.querySelector("[data-review-submit]");
  if (!button) return;
  const complete = reviewComplete();
  button.disabled = !complete;
  button.querySelector("span").textContent = reviewLabel(complete);
}

/* ============================================================
   ACCIONES Y EVENTOS
   ============================================================ */

const actions = {
  back: () => go("welcome"),
  "go-auth": () => go("auth"),
  "go-confirmed": () => go("confirmed"),
  "go-group": () => go("group"),
  relate: () => go(state.activeFile?.code === "A01" ? "review" : "architect"),
  "go-mission": () => go("mission"),
  reset: () => resetAll(),
};

root.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;
  actions[button.dataset.action]?.();
});

root.addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.id === "auth-form") {
    authenticate();
  }

  if (event.target.id === "review-form" && reviewComplete()) {
    go("architect");
  }
});

root.addEventListener("input", (event) => {
  const target = event.target;

  if (target.dataset.field === "keyword") {
    state.keyword = target.value;
    clearAuthError();
  } else if (target.dataset.field === "code") {
    state.personalCode = target.value;
    clearAuthError();
  } else if (target.dataset.diff !== undefined) {
    state.differences[Number(target.dataset.diff)] = target.value;
    updateReviewButton();
  }
});

root.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches('input[type="checkbox"][data-index]')) {
    toggleRoute(Number(target.dataset.index));
  }
});

/* ============================================================
   INICIO
   ============================================================ */

render();
