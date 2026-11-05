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
  pdfIframe.src = pdfUrl; // Carrega o PDF apenas ao abrir
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  pdfIframe.src = ""; // Limpa o PDF ao fechar
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
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

function loadElements(){
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
      linkmail.textContent = `${dados.email}`;

      document.getElementById('localizacao').textContent = dados.localizacao;
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}
