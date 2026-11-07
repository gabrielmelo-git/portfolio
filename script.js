const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const modal = document.querySelector("#paper-modal");
const modalTitle = document.querySelector("#modal-title");
const pdfIframe = document.querySelector("#pdf-iframe");

function openModal(title, pdfUrl) {
  modalTitle.textContent = title;
  pdfIframe.src = pdfUrl;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  pdfIframe.src = "";
}

document.querySelectorAll(".open-paper").forEach(button => {
  button.addEventListener("click", () => {
    const titulo = button.dataset.paper;
    const arquivoPdf = button.dataset.pdf || "./documentos/Edicao01.pdf";
    openModal(titulo, arquivoPdf);
  });
});

document.querySelectorAll(".close-modal, .modal-backdrop").forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

function loadElements() {
  fetch('./data/dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo JSON.');
      }
      return response.json();
    })
    .then(dados => {
      document.getElementById('instagram').href = dados.instagram;
      document.getElementById('youtube').href = dados.youtube;
      document.getElementById('facebook').href = dados.facebook;
      document.getElementById('whatsapp').href = dados.whatsapp;

      const linktel = document.getElementById('telefone');
      const apenasNumeros = dados.telefone.replace(/\D/g, "");
      linktel.href = `tel:+55${apenasNumeros}`;
      
      let telefoneFormatado = "";
      if (apenasNumeros.length === 11) {
        const ddd = apenasNumeros.substring(0, 2);
        const parte1 = apenasNumeros.substring(2, 7);
        const parte2 = apenasNumeros.substring(7, 11);
        telefoneFormatado = `(${ddd}) ${parte1} - ${parte2}`;
      } else if (apenasNumeros.length === 10) {
        const ddd = apenasNumeros.substring(0, 2);
        const parte1 = apenasNumeros.substring(2, 6);
        const parte2 = apenasNumeros.substring(6, 10);
        telefoneFormatado = `(${ddd}) ${parte1} - ${parte2}`;
      } else {
        telefoneFormatado = dados.telefone;
      }
      linktel.textContent = telefoneFormatado;

      const linkmail = document.getElementById('email');
      linkmail.href = `mailto:${dados.email}`;
      linkmail.textContent = dados.email;

      document.getElementById('localizacao').textContent = dados.localizacao;
    })
    .catch(error => {
      console.error('Erro:', error);
    });

  carregarJornais(dados.jornais);
}

// --- CONTROLE DO MODAL DE TODAS AS EDIÇÕES ---
const allPapersModal = document.querySelector("#all-papers-modal");
const btnTodasEdicoes = document.querySelector("#btn-todas-edicoes");
const closeAllModalElements = document.querySelectorAll("#close-all-modal-btn, #close-all-modal-bg, #close-all-modal-footer");

btnTodasEdicoes?.addEventListener("click", () => {
  allPapersModal.classList.add("open");
  allPapersModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

function closeAllModal() {
  allPapersModal.classList.remove("open");
  allPapersModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeAllModalElements.forEach(el => {
  el.addEventListener("click", closeAllModal);
});

// --- RENDERIZAÇÃO DINÂMICA DOS JORNAIS VIA JSON ---
function carregarJornais(jornais) {
  if (!jornais || jornais.length === 0) return;

  // 1. O mais recente é sempre o primeiro do array ([0])
  const maisRecente = jornais[0];
  const latestContainer = document.getElementById('latest-paper-container');
  
  latestContainer.innerHTML = `
    <article class="latest-paper">
      <div class="paper-cover cover-04">
        <span>INSTITUTO<br><strong>Hospital do Negro</strong></span>
        <b>${maisRecente.numero}</b>
        <small>${maisRecente.edicaoFormatada} • ${maisRecente.mesAno}</small>
      </div>
      <div class="paper-info">
        <p class="eyebrow">Última edição</p>
        <h3>${maisRecente.titulo}</h3>
        <p>${maisRecente.descricao}</p>
        <button class="button button-primary open-paper" data-paper="Jornal do Negro — ${maisRecente.edicaoFormatada}" data-pdf="${maisRecente.pdf}">Visualizar jornal</button>
        <span class="paper-meta">PDF • ${maisRecente.paginas} • ${maisRecente.mesAno}</span>
      </div>
    </article>
  `;

  // 2. As próximas 3 edições (índices 1, 2 e 3) vão para o arquivo menor na página principal
%  const anteriores = jornais.slice(1, 4);
  const archiveGrid = document.getElementById('archive-paper-grid');
  archiveGrid.innerHTML = "";

  anteriores.forEach(jornal => {
    archiveGrid.innerHTML += `
      <article class="paper-card">
        <div class="mini-cover cover-03"><span>JORNAL<br><strong>${jornal.numero}</strong></span></div>
        <div>
          <h4>${jornal.edicaoFormatada}</h4>
          <p>${jornal.mesAno}</p>
          <button class="mini-link open-paper" data-paper="Jornal do Negro — ${jornal.edicaoFormatada}" data-pdf="${jornal.pdf}">Ler edição →</button>
        </div>
      </article>
    `;
  });

  // 3. Preenche o modal com TODAS as edições cadastradas no JSON em formato de grid
  const modalAllGrid = document.getElementById('modal-all-grid');
  modalAllGrid.innerHTML = "";

  jornais.forEach(jornal => {
    modalAllGrid.innerHTML += `
      <div class="paper-card" style="background: var(--paper); border: 1px solid var(--line); display: grid; grid-template-columns: 90px 1fr; gap: 15px; align-items: center; padding: 12px; border-radius: 4px;">
        <div class="mini-cover" style="height: 120px; padding: 10px; background: var(--gold); color: #fff; display: flex; flex-direction: column; justify-content: flex-end;">
          <span style="font-size:9px;">JORNAL</span>
          <strong style="font-size:26px;">${jornal.numero}</strong>
        </div>
        <div>
          <span style="font-size:10px; color:var(--gold); text-transform:uppercase; font-weight:700;">${jornal.mesAno}</span>
          <h4 style="font-family:'Playfair Display'; font-size:18px; color:#fff; margin: 4px 0;">${jornal.edicaoFormatada}</h4>
          <button class="button button-primary open-paper" style="font-size:11px; padding:6px 12px; margin-top:6px;" data-paper="Jornal do Negro — ${jornal.edicaoFormatada}" data-pdf="${jornal.pdf}">Abrir PDF</button>
        </div>
      </div>
    `;
  });

  // Reatribui o evento de clique do modal de PDF para os novos botões gerados dinamicamente
  atribuirEventosBotoesPdf();
}

// Função auxiliar para reatar os ouvintes de clique nos botões gerados pelo JSON
function atribuirEventosBotoesPdf() {
  document.querySelectorAll(".open-paper").forEach(button => {
    // Remove o listener antigo para evitar duplicação e aplica o novo
    button.replaceWith(button.cloneNode(true));
  });

  document.querySelectorAll(".open-paper").forEach(button => {
    button.addEventListener("click", () => {
      const titulo = button.dataset.paper;
      const arquivoPdf = button.dataset.pdf || "./documentos/Edicao01.pdf";
      
      // Se o modal de todas as edições estiver aberto, fecha ele ao abrir o PDF
      closeAllModal(); 
      
      openModal(titulo, arquivoPdf);
    });
  });
}
