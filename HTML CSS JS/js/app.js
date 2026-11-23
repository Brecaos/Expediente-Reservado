const files = [
  {
    code: "A01",
    route: "I",
    role: "El Analista",
    serial: "PN–01/A",
    function: "Identificar patrones, contrastar versiones y separar los hechos de las suposiciones.",
    clue: "Toda comunicación deja un patrón. Observa las palabras que se repiten y el orden en que aparecen.",
    directive: "Comparte con el equipo qué patrón debería buscarse primero.",
  },
  {
    code: "C02",
    route: "II",
    role: "El Cartógrafo",
    serial: "PN–02/C",
    function: "Reconstruir recorridos, conexiones y puntos de encuentro entre las evidencias.",
    clue: "La ubicación no siempre es un lugar. Traza la relación entre el origen, el destino y los puntos intermedios.",
    directive: "Explica al equipo cómo conectar las cuatro fuentes.",
  },
  {
    code: "R03",
    route: "III",
    role: "El Archivista",
    serial: "PN–03/R",
    function: "Ordenar los registros y detectar aquello que fue omitido, alterado o clasificado.",
    clue: "El dato ausente también es evidencia. Compara fechas, firmas y espacios en blanco antes de concluir.",
    directive: "Señala al equipo qué ausencia puede cambiar la lectura.",
  },
  {
    code: "T04",
    route: "IV",
    role: "El Especialista técnico",
    serial: "PN–04/T",
    function: "Examinar los soportes, revelar señales ocultas y validar la autenticidad del mensaje.",
    clue: "Algunos mensajes solo aparecen bajo las condiciones correctas. La superficie visible es apenas una capa.",
    directive: "Indica al equipo qué método permitiría revelar lo oculto.",
  },
];

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

/* ---------- utilidades ---------- */

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const arrowIcon = (direction = "right") => `
  <svg aria-hidden="true" class="${direction === "left" ? "rotate-180" : ""}" fill="none" height="18" viewBox="0 0 24 18" width="24">
    <path d="M1 9h21M15 2l7 7-7 7" stroke="currentColor" stroke-width="1.5" />
  </svg>`;

const lockIcon = () => `
  <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
    <rect height="10" rx="1" stroke="currentColor" width="14" x="3" y="8" />
    <path d="M6 8V5a4 4 0 0 1 8 0v3M10 12v3" stroke="currentColor" />
  </svg>`;

const mark = (compact = false) => `
  <div class="brand-mark${compact ? " brand-mark--compact" : ""}" aria-hidden="true">
    <img alt="" src="assets/brujula-nautica.svg" />
  </div>`;

const kicker = (text) => `<div class="kicker"><span></span>${text}</div>`;

const reviewComplete = () => state.differences.every((d) => d.trim().length > 0);

/* ---------- marco común ---------- */

function frame(screen, content, backAction = null) {
  const isKeyScreen = screen === "welcome" || screen === "mission";
  const left = backAction
    ? `<button class="icon-button" type="button" data-action="${backAction}" aria-label="Volver">${arrowIcon("left")}</button>`
    : mark(true);

  return `
    <main class="app-shell${isKeyScreen ? " app-shell--wine" : ""}">
      <aside class="desktop-rail" aria-hidden="true">
        ${mark()}
        <p>OPERACIÓN</p>
        <h2>PERLA<br />NEGRA</h2>
        <div class="rail-line"></div>
        <span>ACTIVIDAD DIGITAL 02</span>
        <b>ACCESO RESTRINGIDO</b>
      </aside>

      <section class="screen">
        <header class="topbar">
          ${left}
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

/* ---------- pantallas ---------- */

function welcome() {
  return frame("welcome", `
    <div class="welcome">
      <div class="classified-stamp" style="margin-left: -22px; margin-right: -22px;">CONFIDENCIAL</div>
      <div class="welcome__emblem">${mark()}</div>
      ${kicker("NIVEL DE SEGURIDAD · IV")}
      <h1>Expediente<br /><em>Reservado</em></h1>
      <div class="hairline"></div>
      <p class="lead">Estás ingresando a un sistema de información confidencial.</p>
      <p class="note" style="font-size: 12px;">
        La consulta es personal. No compartas tu código de acceso ni abandones el sistema
        mientras el expediente esté abierto.
      </p>
      <button class="primary-button primary-button--dark" data-action="start">
        <span>ACCEDER AL SISTEMA</span>${arrowIcon()}
      </button>
      <div class="welcome__status">
        <span></span>
        CANAL CIFRADO · CONEXIÓN SEGURA
      </div>
    </div>`);
}

function auth() {
  const errorHtml = state.authError
    ? `<div class="error-message" id="auth-error" role="alert">
         <span>!</span>
         <p>
           <strong>NO SE PUDO ACCEDER</strong>
           Palabra clave o código personal incorrectos. Revisa los datos e inténtalo de nuevo.
         </p>
       </div>`
    : "";

  return frame("auth", `
    <div class="page">
      ${kicker("CONTROL DE ACCESO")}
      <h1 class="page-title">Verificación<br />de identidad</h1>
      <p class="page-intro">Introduce las credenciales asignadas para consultar tu ruta.</p>

      <form class="auth-form" id="auth-form">
        <label>
          <span>PALABRA CLAVE</span>
          <div class="input-wrap">
            <input name="keyword" autocapitalize="characters" autocomplete="off"
              placeholder="Introduce la palabra clave" type="text" value="${esc(state.keyword)}" />
            ${lockIcon()}
          </div>
        </label>
        <label>
          <span>CÓDIGO PERSONAL</span>
          <div class="input-wrap">
            <input name="personalCode" autocapitalize="characters" autocomplete="off"
              placeholder="Ej. A01" type="text" value="${esc(state.personalCode)}" />
            <span class="mono-mark">#</span>
          </div>
        </label>

        ${errorHtml}

        <button class="primary-button" id="auth-submit" type="submit">
          <span>${state.authError ? "REINTENTAR ACCESO" : "ENVIAR CREDENCIALES"}</span>${arrowIcon()}
        </button>
      </form>
    </div>`, "back-welcome");
}

function file() {
  const f = state.activeFile;
  return frame("file", `
    <div class="page file-page">
      <div class="file-meta">
        <div><span>RUTA</span><strong>${f.route}</strong></div>
        <div><span>N.º EXPEDIENTE</span><b>${f.serial}</b></div>
      </div>

      ${kicker("ACCESO AUTORIZADO")}
      <h1 class="role-title">${f.role}</h1>
      <div class="role-function">
        <span>FUNCIÓN ASIGNADA</span>
        <p>${f.function}</p>
      </div>

      <article class="clue-card">
        <div class="clue-card__header">
          ${lockIcon()}
          <span>PISTA CONFIDENCIAL</span>
          <b>01/01</b>
        </div>
        <p>“${f.clue}”</p>
        <div class="clue-card__directive">
          <span>DIRECTIVA</span>
          ${f.directive}
        </div>
        <div class="clue-watermark">CONFIDENCIAL</div>
      </article>

      <p class="privacy-note">
        ${lockIcon()}
        Esta información pertenece únicamente a tu ruta. Memorízala antes de finalizar.
      </p>

      <button class="primary-button" data-action="finish-consult">
        <span>FINALIZAR CONSULTA</span>${arrowIcon()}
      </button>
    </div>`);
}

function confirmed() {
  return frame("confirmed", `
    <div class="center-page">
      <div class="success-seal">
        <svg aria-hidden="true" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" stroke="currentColor" />
          <path d="m14 25 7 7 14-16" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </div>
      ${kicker("CONSULTA COMPLETADA")}
      <h1 class="page-title">Expediente consultado correctamente.</h1>
      <p class="page-intro">Comparte la información con el equipo.</p>
      <div class="instruction-card">
        <span>PROTOCOLO SIGUIENTE</span>
        <p>No muestres la pantalla. Explica tu pista con tus propias palabras.</p>
      </div>
      <button class="primary-button" data-action="to-group">
        <span>CERRAR EXPEDIENTE</span>${arrowIcon()}
      </button>
    </div>`);
}

function group() {
  const count = state.checked.filter(Boolean).length;
  const rows = files
    .map(
      (f, i) => `
        <label class="${state.checked[i] ? "is-checked" : ""}">
          <input data-check="${i}" type="checkbox" ${state.checked[i] ? "checked" : ""} />
          <span class="custom-check">
            <svg aria-hidden="true" fill="none" viewBox="0 0 14 14">
              <path d="m2 7 3 3 7-7" stroke="currentColor" />
            </svg>
          </span>
          <b>RUTA ${f.route}</b>
          <p>${f.role}</p>
        </label>`,
    )
    .join("");

  return frame("group", `
    <div class="page group-page">
      ${kicker("PROTOCOLO DE EQUIPO")}
      <h1 class="page-title">Reunir y relacionar las cuatro pistas</h1>
      <p class="page-intro">
        Cada integrante debe compartir su hallazgo. Marca las rutas manualmente a medida que
        sean presentadas.
      </p>

      <div class="progress-heading">
        <span>PISTAS REUNIDAS</span>
        <strong>${count}<i>/4</i></strong>
      </div>
      <div class="progress-line">
        <span style="width: ${count * 25}%;"></span>
      </div>

      <div class="route-checklist">${rows}</div>

      <button class="primary-button" data-action="group-next" ${count < 4 ? "disabled" : ""}>
        <span>${count < 4 ? `FALTAN ${4 - count} PISTAS` : "RELACIONAR LAS PISTAS"}</span>${arrowIcon()}
      </button>
    </div>`);
}

function review() {
  const complete = reviewComplete();
  const fields = state.differences
    .map(
      (d, i) => `
        <label>
          <span>DIFERENCIA ${i + 1}</span>
          <textarea aria-label="Diferencia ${i + 1}" data-diff="${i}"
            placeholder="Escribe la diferencia encontrada..." rows="3">${esc(d)}</textarea>
        </label>`,
    )
    .join("");

  return frame("review", `
    <div class="page review-page">
      ${kicker("REVISIÓN DEL ANALISTA · 4/4 PISTAS REUNIDAS")}
      <h1 class="page-title">Revisa los expedientes</h1>
      <p class="page-intro">
        Los expedientes han sido comprometidos. Verifícalos con los documentos que tiene el
        Archivista. Con ellos deben encontrar las pequeñas diferencias que hay y escribirlas.
      </p>

      <form class="review-form" id="review-form">
        <div class="difference-grid">${fields}</div>
        <button class="primary-button" id="review-submit" type="submit" ${complete ? "" : "disabled"}>
          <span>${complete ? "FINALIZAR REVISIÓN" : "COMPLETA LAS 4 DIFERENCIAS"}</span>${arrowIcon()}
        </button>
      </form>
    </div>`);
}

function architect() {
  return frame("architect", `
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
          “Habéis observado, conectado, ordenado y revelado. Cuatro miradas sobre un mismo
          mensaje; ninguna bastaba por sí sola.”
        </p>
        <p>
          “La información más importante aún no está en la pantalla. Vuestra siguiente misión
          comienza donde termina lo visible.”
        </p>
        <div class="message-signature">— E. A.</div>
        <div class="classified-stamp classified-stamp--message">CLASIFICADO</div>
      </article>
      <button class="primary-button" data-action="to-mission">
        <span>CONTINUAR</span>${arrowIcon()}
      </button>
    </div>`);
}

function mission() {
  return frame("mission", `
    <div class="mission-page">
      ${kicker("SIGUIENTE MISIÓN")}
      <span class="mission-number">03</span>
      <h1 style="font-size: 47px;">La comunicación<br /><em>oculta</em></h1>
      <div class="hairline"></div>
      <p class="lead">
        Busca una carta física. A simple vista parecerá vacía, pero contiene un mensaje escrito
        con tinta invisible.
      </p>
      <div class="mission-order">
        <span>OBJETIVO</span>
        <p>Localizar la carta, revelar el contenido y descifrar la instrucción.</p>
      </div>
      <button class="primary-button primary-button--dark" data-action="reset">
        <span>FINALIZAR OPERACIÓN</span>${arrowIcon()}
      </button>
    </div>`);
}

/* ---------- render y lógica ---------- */

function screenHtml() {
  const s = state.screen;
  if (s === "welcome") return welcome();
  if (s === "auth") return auth();
  if (s === "file" && state.activeFile) return file();
  if (s === "confirmed") return confirmed();
  if (s === "group") return group();
  if (s === "review" && state.activeFile?.code === "A01") return review();
  if (s === "architect") return architect();
  return mission();
}

function render() {
  root.innerHTML = screenHtml();
  if (lastScreen !== state.screen) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  lastScreen = state.screen;
}

function go(screen) {
  state.screen = screen;
  render();
}

function reset() {
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

function authenticate(form) {
  state.keyword = form.elements.namedItem("keyword").value;
  state.personalCode = form.elements.namedItem("personalCode").value;

  const code = state.personalCode.trim().toUpperCase().replace(/\s/g, "");
  const match = files.find((f) => f.code === code);
  const validKeyword = state.keyword.trim().toUpperCase() === "PERLA NEGRA";

  if (!validKeyword || !match) {
    state.authError = true;
    render();
    return;
  }

  state.authError = false;
  state.activeFile = match;
  go("file");
}

// Limpia el error sin re-renderizar, para no perder el foco al escribir
function clearAuthError() {
  if (!state.authError) return;
  state.authError = false;
  document.getElementById("auth-error")?.remove();
  const label = document.querySelector("#auth-submit span");
  if (label) label.textContent = "ENVIAR CREDENCIALES";
}

// Actualiza solo el botón de revisión, sin re-renderizar el formulario
function updateReviewButton() {
  const btn = document.getElementById("review-submit");
  if (!btn) return;
  const complete = reviewComplete();
  btn.disabled = !complete;
  btn.querySelector("span").textContent = complete
    ? "FINALIZAR REVISIÓN"
    : "COMPLETA LAS 4 DIFERENCIAS";
}

/* ---------- eventos (delegados) ---------- */

root.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;

  switch (el.dataset.action) {
    case "start":
      go("auth");
      break;
    case "back-welcome":
      go("welcome");
      break;
    case "finish-consult":
      go("confirmed");
      break;
    case "to-group":
      go("group");
      break;
    case "group-next":
      go(state.activeFile?.code === "A01" ? "review" : "architect");
      break;
    case "to-mission":
      go("mission");
      break;
    case "reset":
      reset();
      break;
  }
});

root.addEventListener("change", (event) => {
  if (event.target.matches("[data-check]")) {
    const index = Number(event.target.dataset.check);
    state.checked[index] = !state.checked[index];
    render();
  }
});

root.addEventListener("input", (event) => {
  const el = event.target;
  if (el.name === "keyword") {
    state.keyword = el.value;
    clearAuthError();
  } else if (el.name === "personalCode") {
    state.personalCode = el.value;
    clearAuthError();
  } else if (el.matches("[data-diff]")) {
    state.differences[Number(el.dataset.diff)] = el.value;
    updateReviewButton();
  }
});

root.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "auth-form") {
    authenticate(event.target);
  } else if (event.target.id === "review-form" && reviewComplete()) {
    go("architect");
  }
});

render();