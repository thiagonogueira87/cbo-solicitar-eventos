// ============================================================
// config.js — Configurações públicas do formulário
// ============================================================

// URL da implantação do Google Apps Script
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzi8rH_ynhUwMwXig9SHRuxUMEDlFa9rsPeJfukfvcDCw2m7WaybAnW1-z0yS6LPPeD/exec";

// Locais disponíveis
const LOCATIONS = [
  {
    id: "templo_maior",
    label: "Templo Maior",
    icon: "⛪",
  },
  {
    id: "templo_menor",
    label: "Templo Menor",
    icon: "🏛️",
  },
  {
    id: "sala_lideres",
    label: "Sala dos Líderes",
    icon: "👥",
  },
  {
    id: "salao_vermelho",
    label: "Salão Vermelho",
    icon: "🔴",
  },
  {
    id: "sala_azul",
    label: "Sala Azul",
    icon: "🔵",
  },
  {
    id: "sala_juventude",
    label: "Sala da Juventude",
    icon: "⚡",
  },
  {
    id: "cozinha",
    label: "Cozinha",
    icon: "🍳",
  },
  {
    id: "gramado",
    label: "Gramado",
    icon: "🌿",
  },
  {
    id: "area_lazer",
    label: "Área de Lazer",
    icon: "🎡",
  },
  {
    id: "piscina",
    label: "Piscina",
    icon: "🏊",
  },
];

// Ministérios exibidos no formulário.
//
// Os e-mails e telefones não ficam mais no GitHub.
// Eles ficarão protegidos dentro do Google Apps Script.
const SERVICES = [
  {
    id: "recepcao",
    label: "Recepção",
    icon: "🤝",
    leaderName: "Líder da Recepção",
  },
  {
    id: "sonoplastia",
    label: "Sonoplastia",
    icon: "🎵",
    leaderName: "Líder da Sonoplastia",
  },
  {
    id: "midia",
    label: "Mídia",
    icon: "📸",
    leaderName: "Líder de Mídia",
  },
  {
    id: "comunicacao",
    label: "Comunicação",
    icon: "📢",
    leaderName: "Líder de Comunicação",
  },
  {
    id: "louvor",
    label: "Louvor",
    icon: "🎶",
    leaderName: "Líder de Louvor",
  },
  {
    id: "juventude",
    label: "Juventude",
    icon: "⚡",
    leaderName: "Pr. Thiago",
  },
  {
    id: "mulheres",
    label: "Mulheres",
    icon: "🌸",
    leaderName: "Líder do Ministério de Mulheres",
  },
  {
    id: "acao_social",
    label: "Ação Social",
    icon: "❤️",
    leaderName: "Líder de Ação Social",
  },
  {
    id: "esportes",
    label: "Esportes",
    icon: "⚽",
    leaderName: "Líder de Esportes",
  },
  {
    id: "ensino",
    label: "Ensino",
    icon: "📖",
    leaderName: "Líder de Ensino",
  },
  {
    id: "mensageiras_do_rei",
    label: "Mensageiras do Rei",
    icon: "👑",
    leaderName: "Líder das Mensageiras do Rei",
  },
  {
    id: "infantil",
    label: "Infantil",
    icon: "🧸",
    leaderName: "Líder do Ministério Infantil",
  },
  {
    id: "missoes",
    label: "Missões",
    icon: "🌍",
    leaderName: "Líder de Missões",
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: "🎉",
    leaderName: "Líder de Eventos",
  },
  {
    id: "casais",
    label: "Casais",
    icon: "💍",
    leaderName: "Líder do Ministério de Casais",
  },
  {
    id: "cr",
    label: "CR",
    icon: "🕊️",
    leaderName: "Líder do CR",
  },
];

const APP_CONFIG = {
  orgName: "Comunidade Batista Oceânica",
};
