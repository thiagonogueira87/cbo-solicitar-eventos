// ============================================================
//  ⚙️  ARQUIVO DE CONFIGURAÇÃO — EDITE AQUI
//  Instruções completas no README.md
// ============================================================

// --- EmailJS ---
// Crie conta gratuita em https://emailjs.com
// Preencha os 3 valores abaixo após criar sua conta
const EMAILJS_CONFIG = {
  publicKey:  "_9AZxEYMoE9DNWHvD",      // Account > API Keys
  serviceId:  "service_oyvsa1v",      // Email Services > Service ID
  templateId: "template_35rd8cs",     // Email Templates > Template ID
};

// --- LOCAIS DISPONÍVEIS ---
// Espaços que podem ser selecionados no formulário
// Para adicionar um local: copie um bloco { id, label, icon } e preencha
const LOCATIONS = [
  { id: "templo_maior",    label: "Templo Maior",      icon: "⛪" },
  { id: "templo_menor",    label: "Templo Menor",       icon: "🏛️" },
  { id: "sala_lideres",    label: "Sala dos Líderes",   icon: "👥" },
  { id: "salao_vermelho",  label: "Salão Vermelho",     icon: "🔴" },
  { id: "sala_azul",       label: "Sala Azul",          icon: "🔵" },
  { id: "sala_juventude",  label: "Sala da Juventude",  icon: "⚡" },
  { id: "cozinha",         label: "Cozinha",            icon: "🍳" },
  { id: "gramado",         label: "Gramado",            icon: "🌿" },
  { id: "area_lazer",      label: "Área de Lazer",      icon: "🎡" },
  { id: "piscina",         label: "Piscina",            icon: "🏊" },
];

// --- MINISTÉRIOS ---
// Cada objeto representa um ministério. Campos:
//   id          → identificador único (sem espaços)
//   label       → nome exibido no formulário
//   icon        → emoji do ministério
//   leaderName  → nome do líder (aparece nas notificações)
//   email       → e-mail do líder (receberá notificação)
//   whatsapp    → número com DDI, SEM símbolos (ex: 5521999990000)
//                 deixe "" para não gerar link de WhatsApp

const SERVICES = [
  {
    id:          "recepcao",
    label:       "Recepção",
    icon:        "🤝",
    leaderName:  "Líder da Recepção",
    email:       "recepcao@suaigreja.com",
    whatsapp:    "5521999990001",
  },
  {
    id:          "sonoplastia",
    label:       "Sonoplastia",
    icon:        "🎵",
    leaderName:  "Líder da Sonoplastia",
    email:       "sonoplastia@suaigreja.com",
    whatsapp:    "5521999990002",
  },
  {
    id:          "midia",
    label:       "Mídia",
    icon:        "📸",
    leaderName:  "Líder de Mídia",
    email:       "midia@suaigreja.com",
    whatsapp:    "5521999990003",
  },
  {
    id:          "comunicacao",
    label:       "Comunicação",
    icon:        "📢",
    leaderName:  "Líder de Comunicação",
    email:       "comunicacao@suaigreja.com",
    whatsapp:    "5521999990004",
  },
  {
    id:          "louvor",
    label:       "Louvor",
    icon:        "🎶",
    leaderName:  "Líder de Louvor",
    email:       "louvor@suaigreja.com",
    whatsapp:    "5521999990005",
  },
  {
    id:          "juventude",
    label:       "Juventude",
    icon:        "⚡",
    leaderName:  "Líder da Juventude",
    email:       "juventude@suaigreja.com",
    whatsapp:    "5521999990006",
  },
  {
    id:          "mulheres",
    label:       "Mulheres",
    icon:        "🌸",
    leaderName:  "Líder do Ministério de Mulheres",
    email:       "mulheres@suaigreja.com",
    whatsapp:    "5521999990007",
  },
  {
    id:          "acao_social",
    label:       "Ação Social",
    icon:        "❤️",
    leaderName:  "Líder de Ação Social",
    email:       "acaosocial@suaigreja.com",
    whatsapp:    "5521999990008",
  },
  {
    id:          "esportes",
    label:       "Esportes",
    icon:        "⚽",
    leaderName:  "Líder de Esportes",
    email:       "esportes@suaigreja.com",
    whatsapp:    "5521999990009",
  },
  {
    id:          "ensino",
    label:       "Ensino",
    icon:        "📖",
    leaderName:  "Líder de Ensino",
    email:       "ensino@suaigreja.com",
    whatsapp:    "5521999990010",
  },
  {
    id:          "infantil",
    label:       "Infantil",
    icon:        "🧸",
    leaderName:  "Líder do Ministério Infantil",
    email:       "infantil@suaigreja.com",
    whatsapp:    "5521999990011",
  },
  {
    id:          "mensageiras",
    label:       "Mensageiras do Rei",
    icon:        "👑",
    leaderName:  "Líder das Mensageiras do Rei",
    email:       "mensageiras@suaigreja.com",
    whatsapp:    "5521999990012",
  },
  {
    id:          "missoes",
    label:       "Missões",
    icon:        "🌍",
    leaderName:  "Líder de Missões",
    email:       "missoes@suaigreja.com",
    whatsapp:    "5521999990013",
  },
  {
    id:          "eventos",
    label:       "Eventos",
    icon:        "🎉",
    leaderName:  "Líder de Eventos",
    email:       "eventos@suaigreja.com",
    whatsapp:    "5521999990014",
  },
  {
    id:          "casais",
    label:       "Casais",
    icon:        "💍",
    leaderName:  "Líder do Ministério de Casais",
    email:       "casais@suaigreja.com",
    whatsapp:    "5521999990015",
  },
  {
    id:          "cr",
    label:       "CR",
    icon:        "🕊️",
    leaderName:  "Líder do CR",
    email:       "cr@suaigreja.com",
    whatsapp:    "5521999990016",
  },
];

// --- CONFIGURAÇÕES GERAIS ---
const APP_CONFIG = {
  // Nome da organização (aparece nos e-mails e no site)
  orgName: "Nossa Igreja",

  // E-mail que recebe CÓPIA de todas as solicitações (pode deixar vazio "")
  adminEmail: "admin@suaigreja.com",

  // Mensagem padrão no WhatsApp
  // Variáveis disponíveis: {lider}, {evento}, {inicio}, {fim}, {responsavel}
  whatsappMessage:
    "Olá {lider}! 👋 Você recebeu uma nova solicitação de evento.\n\n📋 *Evento:* {evento}\n📅 *Início:* {inicio}\n🔚 *Fim:* {fim}\n👤 *Responsável:* {responsavel}\n\nAcesse o e-mail para ver os detalhes completos e as observações específicas para seu ministério.",
};
