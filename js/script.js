/* =========================================================
   CONFIGURAÇÃO — altere aqui os dados da confeiteira.
   Todo o site é preenchido a partir deste objeto.
   ========================================================= */
const CONFIG = {
  // Número com DDI + DDD, só dígitos. Ex.: 55 + 11 + 912345678
  whatsapp: "5519988216804",
  // Texto que já vem escrito ao abrir o WhatsApp. Cada "\n" é uma quebra de linha.
  whatsappMensagem:
    "Olá, Marli! Vim pelo site e gostaria de fazer uma encomenda.\n\n" +
    "Data da festa: \n" +
    "Quantidade de pessoas: \n" +
    "Sabor (massa e recheio): \n" +
    "Tema ou decoração: \n" +
    "Retirada ou entrega: ",

  endereco: "R. Luiz Lúcio da Silva Filho, 342 - Sumaré - SP, 13178-395",
  horario: "Seg a Sáb, das 9h às 18h",
  cnpj: "26.514.793/0001-50",

  redes: {
    instagram: "marli_brianes",
  },
};

/* ========================================================= */

const redesUrl = {
  instagram: (u) => `https://www.instagram.com/${u}/`,
};

function formatarTelefone(numero) {
  // 5511999999999 -> (11) 99999-9999
  const n = numero.replace(/^55/, "");
  return n.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
}

// Links do WhatsApp
const whatsappLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMensagem)}`;
document.querySelectorAll("[data-whatsapp]").forEach((el) => (el.href = whatsappLink));
document.querySelectorAll("[data-phone]").forEach((el) => (el.textContent = formatarTelefone(CONFIG.whatsapp)));

// Redes sociais
document.querySelectorAll("[data-social]").forEach((el) => {
  const rede = el.dataset.social;
  const usuario = CONFIG.redes[rede];
  if (!usuario) {
    el.remove();
    return;
  }
  el.href = redesUrl[rede](usuario);
  el.querySelector("[data-social-handle]").textContent = `@${usuario}`;
});

// Endereço e mapa
const enderecoUrl = encodeURIComponent(CONFIG.endereco);
document.querySelectorAll("[data-address]").forEach((el) => (el.textContent = CONFIG.endereco));
document.querySelectorAll("[data-hours]").forEach((el) => (el.textContent = CONFIG.horario));
document.querySelector("[data-map]").src = `https://www.google.com/maps?q=${enderecoUrl}&output=embed`;
document.querySelector("[data-maps-link]").href = `https://www.google.com/maps/search/?api=1&query=${enderecoUrl}`;

document.querySelector("[data-year]").textContent = new Date().getFullYear();
document.querySelector("[data-cnpj]").textContent = CONFIG.cnpj;

// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const aberto = nav.classList.toggle("nav--open");
  menuToggle.setAttribute("aria-expanded", aberto);
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("nav--open");
    menuToggle.setAttribute("aria-expanded", false);
  })
);

// Balão do WhatsApp: aparece depois de alguns segundos.
// Se a pessoa fechar, não aparece de novo enquanto a aba estiver aberta.
const BALAO_ATRASO_MS = 4000;
const balao = document.querySelector(".whatsapp-balao");

function balaoFoiFechado() {
  try {
    return sessionStorage.getItem("balaoFechado") === "1";
  } catch {
    return false;
  }
}

function fecharBalao() {
  balao.classList.remove("whatsapp-balao--visivel");
  try {
    sessionStorage.setItem("balaoFechado", "1");
  } catch {}
}

if (!balaoFoiFechado()) {
  setTimeout(() => balao.classList.add("whatsapp-balao--visivel"), BALAO_ATRASO_MS);
}
balao.querySelector(".whatsapp-balao__fechar").addEventListener("click", fecharBalao);
balao.querySelector("a").addEventListener("click", fecharBalao);
document.querySelector(".whatsapp-float").addEventListener("click", fecharBalao);

// Galeria: mostra um espaço reservado se a foto ainda não existir
document.querySelectorAll(".gallery__item img").forEach((img) => {
  const marcarSemFoto = () => img.closest(".gallery__item").classList.add("gallery__item--empty");
  if (img.complete && img.naturalWidth === 0) marcarSemFoto();
  img.addEventListener("error", marcarSemFoto);
});

// Lightbox
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");

document.querySelectorAll(".gallery__item").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("gallery__item--empty")) return;
    const img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function fecharLightbox() {
  lightbox.classList.remove("lightbox--open");
  lightbox.setAttribute("aria-hidden", "true");
}
lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) fecharLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharLightbox();
});
