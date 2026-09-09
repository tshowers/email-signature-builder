export interface CommandPaletteEntry {
  id: string;
  label: string;
  group: string;
  /** Absolute https:// URL to another Taliferro app. */
  path: string;
  keywords: string[];
  /** Path to an icon image, relative to /assets. Omit for a label-only row. */
  icon?: string;
  /** Open in a new tab instead of the current one. */
  newTab?: boolean;
}

export const COMMAND_PALETTE_ENTRIES: CommandPaletteEntry[] = [
  // --- Other Apps -----------------------------------------------------------
  { id: 'app-maya', label: 'Maya', group: 'Other Apps', path: 'https://maya.taliferro.tech', icon: 'assets/find/entities/maya/logo-bw-icon.png', keywords: ['maya', 'marketing director'] },
  { id: 'app-todd', label: 'Ask TODD', group: 'Other Apps', path: 'https://ask.taliferro.tech', icon: 'assets/find/entities/todd/logo-bw-icon.png', keywords: ['todd', 'ask todd', 'assistant', 'chat'] },
  { id: 'app-docs', label: 'Docs', group: 'Other Apps', path: 'https://docs.taliferro.tech', icon: 'assets/find/entities/docs/logo-bw-icon.png', keywords: ['docs', 'documents', 'proposals', 'contracts'] },
  { id: 'app-find', label: 'Find', group: 'Other Apps', path: 'https://find.taliferro.tech', icon: 'assets/find/entities/find/logo-bw-icon.png', keywords: ['find', 'ask a question'] },
  { id: 'app-lead-vault', label: 'Lead Vault', group: 'Other Apps', path: 'https://lead-vault.taliferro.tech', icon: 'assets/find/entities/lead-vault/logo-bw-icon.png', keywords: ['lead vault', 'leads', 'purchased leads'] },
  { id: 'app-moves', label: 'Moves', group: 'Other Apps', path: 'https://moves.taliferro.tech', icon: 'assets/find/entities/moves/logo-bw-icon.png', keywords: ['moves', 'tasks', 'projects', 'to-dos'] },
  { id: 'app-network', label: 'Network', group: 'Other Apps', path: 'https://network.taliferro.tech', icon: 'assets/find/entities/network/logo-bw-icon.png', keywords: ['network', 'contacts', 'crm', 'relationships'] },
  { id: 'app-outreach', label: 'Outreach', group: 'Other Apps', path: 'https://outreach.taliferro.tech', icon: 'assets/find/entities/outreach/logo-bw-icon.png', keywords: ['outreach', 'campaigns', 'sequences', 'email marketing'] },
  { id: 'app-pulse', label: 'Pulse', group: 'Other Apps', path: 'https://pulse.taliferro.tech', icon: 'assets/find/entities/pulse/logo-bw-icon.png', keywords: ['pulse', 'surveys', 'feedback', 'nps'] },
  { id: 'app-sayit', label: 'SayIt', group: 'Other Apps', path: 'https://sayit.taliferro.tech', icon: 'assets/find/entities/sayit/logo-bw-icon.png', keywords: ['sayit', 'say it'] },
  { id: 'app-social', label: 'Social', group: 'Other Apps', path: 'https://social.taliferro.tech', icon: 'assets/find/entities/social/logo-bw-icon.png', keywords: ['social', 'social media'] },
  { id: 'app-music', label: 'Taliferro Music', group: 'Other Apps', path: 'https://music.taliferro.com', icon: 'assets/find/entities/music/logo-bw-icon.png', newTab: true, keywords: ['music', 'stream music'] },
];
