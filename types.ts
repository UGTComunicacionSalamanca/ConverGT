export enum View {
  Dashboard = 'Dashboard',
  ActivityLog = 'ActivityLog',
  Analytics = 'Analytics',
  ExternalComms = 'ExternalComms',
  SocialMedia = 'SocialMedia',
  InternalComms = 'InternalComms',
  Resources = 'Resources',
}

export enum ActivityCategory {
  InternalMeeting = 'Reunión Interna',
  ExternalCampaign = 'Campaña Externa',
  Training = 'Formación',
  SocialMedia = 'Redes Sociales',
  PressPotential = 'Potencial para Prensa',
  MemberSupport = 'Atención a Afiliados',
  Other = 'Otros',
}

export enum Secretaria {
    Local = "Local",
    Central = "Central",
    Organizacion = "Organización",
    General = "General",
    Sociosanitarios = "Sociosanitarios",
    Postal = "Postal",
    Formacion = "Formación",
    Comunicacion = "Comunicación",
    EnsenanzaPrivada = "Enseñanza Privada",
    Educacion = "Educación",
    Sanidad = "Sanidad",
    Autonomica = "Autonómica",
    Usal = "Usal",
    SaludLaboral = "Salud Laboral"
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  secretaria: Secretaria;
  relevanceTags: string[];
  observations: string;
  date: string;
}

export interface JournalistContact {
    id: string;
    name: string;
    media: string;
    phone: string;
    email: string;
    role: string;
    isFrequent: boolean;
}

export interface Channel {
    id: string;
    name: string;
    description: string;
    icon: string;
    isExternal?: boolean;
    externalContactPhone?: string;
}

export interface Message {
    id: string;
    text: string;
    author: string;
    timestamp: string;
}

export interface PressRelease {
  id: string;
  secretaria: Secretaria;
  preheadline: string;
  headline: string;
  subheadline: string;
  lead: string;
  body: string;
  contact: string;
  date: string;
}