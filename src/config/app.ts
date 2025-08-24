// config/app.ts - Application configuration and constants

// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3'),
  },

  // AWS Configuration (for Cognito integration)
  aws: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-2',
    // These will be set dynamically based on the client configuration
    userPoolId: '',
    userPoolWebClientId: '',
    identityPoolId: '',
  },

  // Application Configuration
  app: {
    name: 'OpenDKP',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    enableDebugMode: process.env.REACT_APP_DEBUG === 'true',
  },

  // Feature Flags
  features: {
    enableAuditLog: process.env.REACT_APP_ENABLE_AUDIT_LOG !== 'false',
    enableUserRequests: process.env.REACT_APP_ENABLE_USER_REQUESTS !== 'false',
    enableReports: process.env.REACT_APP_ENABLE_REPORTS !== 'false',
    enableCaching: process.env.REACT_APP_ENABLE_CACHING !== 'false',
  },

  // UI Configuration
  ui: {
    itemsPerPageOptions: [10, 25, 50, 100],
    defaultItemsPerPage: 50,
    maxCharacterNameLength: 45,
    maxRaidNameLength: 45,
    maxDescriptionLength: 255,
    dateFormat: 'MM/dd/yyyy',
    dateTimeFormat: 'MM/dd/yyyy HH:mm',
  },

  // DKP Configuration
  dkp: {
    minValue: -9999,
    maxValue: 9999,
    decimalPlaces: 1,
    defaultTickValue: 1.0,
  },
};

// Character classes (EverQuest-based)
export const CHARACTER_CLASSES = [
  'Bard',
  'Berserker',
  'Beastlord',
  'Cleric',
  'Druid',
  'Enchanter',
  'Magician',
  'Monk',
  'Necromancer',
  'Paladin',
  'Ranger',
  'Rogue',
  'Shadow Knight',
  'Shaman',
  'Warrior',
  'Wizard',
] as const;

export type CharacterClass = typeof CHARACTER_CLASSES[number];

// Character races (EverQuest-based)
export const CHARACTER_RACES = [
  'Barbarian',
  'Dark Elf',
  'Dwarf',
  'Erudite',
  'Froglok',
  'Gnome',
  'Half Elf',
  'Halfling',
  'High Elf',
  'Human',
  'Iksar',
  'Ogre',
  'Troll',
  'Vah Shir',
  'Wood Elf',
] as const;

export type CharacterRace = typeof CHARACTER_RACES[number];

// Character genders
export const CHARACTER_GENDERS = ['Male', 'Female'] as const;
export type CharacterGender = typeof CHARACTER_GENDERS[number];

// Common guild ranks
export const GUILD_RANKS = [
  'Guild Leader',
  'Officer',
  'Class Leader',
  'Veteran',
  'Member',
  'Initiate',
  'Alt',
] as const;

export type GuildRank = typeof GUILD_RANKS[number];

// Request types for user_requests table
export const REQUEST_TYPES = {
  CHARACTER_ASSOCIATION: 1,
  DKP_ADJUSTMENT: 2,
  ITEM_CORRECTION: 3,
  OTHER: 99,
} as const;

export const REQUEST_TYPE_LABELS = {
  [REQUEST_TYPES.CHARACTER_ASSOCIATION]: 'Character Association',
  [REQUEST_TYPES.DKP_ADJUSTMENT]: 'DKP Adjustment',
  [REQUEST_TYPES.ITEM_CORRECTION]: 'Item Correction',
  [REQUEST_TYPES.OTHER]: 'Other',
} as const;

// Request statuses
export const REQUEST_STATUSES = {
  PENDING: 0,
  APPROVED: 1,
  DENIED: 2,
} as const;

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUSES.PENDING]: 'Pending',
  [REQUEST_STATUSES.APPROVED]: 'Approved',
  [REQUEST_STATUSES.DENIED]: 'Denied',
} as const;

// Audit action types
export const AUDIT_ACTIONS = {
  CREATE_CHARACTER: 'CREATE_CHARACTER',
  UPDATE_CHARACTER: 'UPDATE_CHARACTER',
  DELETE_CHARACTER: 'DELETE_CHARACTER',
  CREATE_RAID: 'CREATE_RAID',
  UPDATE_RAID: 'UPDATE_RAID',
  DELETE_RAID: 'DELETE_RAID',
  CREATE_TICK: 'CREATE_TICK',
  UPDATE_TICK: 'UPDATE_TICK',
  DELETE_TICK: 'DELETE_TICK',
  CREATE_ITEM_TRANSACTION: 'CREATE_ITEM_TRANSACTION',
  UPDATE_ITEM_TRANSACTION: 'UPDATE_ITEM_TRANSACTION',
  DELETE_ITEM_TRANSACTION: 'DELETE_ITEM_TRANSACTION',
  CREATE_ADJUSTMENT: 'CREATE_ADJUSTMENT',
  UPDATE_ADJUSTMENT: 'UPDATE_ADJUSTMENT',
  DELETE_ADJUSTMENT: 'DELETE_ADJUSTMENT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
} as const;

// Default pool names and descriptions
export const DEFAULT_POOLS = [
  { name: 'Main', description: 'Primary raid pool', order: 1 },
  { name: 'Alt', description: 'Alternate character pool', order: 2 },
  { name: 'Trial', description: 'Trial member pool', order: 3 },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  // Characters
  CHARACTERS: '/characters',
  CHARACTER_BY_ID: (id: number) => `/characters/${id}`,
  CHARACTER_DKP_SUMMARY: (id: number) => `/characters/${id}/dkp-summary`,
  CHARACTER_TRANSACTIONS: (id: number) => `/characters/${id}/item-transactions`,
  CHARACTER_ADJUSTMENTS: (id: number) => `/characters/${id}/adjustments`,
  
  // Raids
  RAIDS: '/raids',
  RAID_BY_ID: (id: number) => `/raids/${id}`,
  RAID_TICKS: (id: number) => `/raids/${id}/ticks`,
  
  // Items
  ITEMS: '/items',
  ITEM_BY_ID: (id: number) => `/items/${id}`,
  ITEM_HISTORY: (id: number) => `/items/${id}/history`,
  
  // Transactions
  ITEM_TRANSACTIONS: '/item-transactions',
  ITEM_TRANSACTION_BY_ID: (id: number) => `/item-transactions/${id}`,
  
  // Adjustments
  ADJUSTMENTS: '/adjustments',
  ADJUSTMENT_BY_ID: (id: number) => `/adjustments/${id}`,
  
  // Ticks
  TICKS: '/ticks',
  TICK_BY_ID: (id: number) => `/ticks/${id}`,
  
  // Pools
  POOLS: '/pools',
  POOL_BY_ID: (id: number) => `/pools/${id}`,
  
  // Reports
  DKP_SUMMARY: '/dkp-summary',
  DKP_LEADERBOARD: '/reports/leaderboard',
  ACTIVITY_REPORT: '/reports/activity',
  
  // User Requests
  USER_REQUESTS: '/user-requests',
  USER_REQUEST_BY_ID: (id: number) => `/user-requests/${id}`,
  APPROVE_REQUEST: (id: number) => `/user-requests/${id}/approve`,
  DENY_REQUEST: (id: number) => `/user-requests/${id}/deny`,
  
  // Audit
  AUDIT_LOG: '/audit',
  
  // Admin
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CLIENT_ID: 'opendkp_client_id',
  CURRENT_USER: 'opendkp_current_user',
  PREFERENCES: 'opendkp_preferences',
  AUTH_TOKEN: 'opendkp_auth_token',
  REFRESH_TOKEN: 'opendkp_refresh_token',
} as const;

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Validation rules
export const VALIDATION_RULES = {
  character: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 45,
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
    },
    level: {
      min: 1,
      max: 125, // Current EverQuest max level
    },
  },
  raid: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 45,
    },
  },
  dkp: {
    value: {
      min: -9999,
      max: 9999,
    },
  },
  item: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 255,
    },
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CHARACTER_CREATED: 'Character created successfully',
  CHARACTER_UPDATED: 'Character updated successfully',
  CHARACTER_DELETED: 'Character deleted successfully',
  RAID_CREATED: 'Raid created successfully',
  RAID_UPDATED: 'Raid updated successfully',
  RAID_DELETED: 'Raid deleted successfully',
  TICK_CREATED: 'Tick created successfully',
  ADJUSTMENT_CREATED: 'Adjustment created successfully',
  TRANSACTION_CREATED: 'Item transaction created successfully',
  SETTINGS_UPDATED: 'Settings updated successfully',
} as const;