// Database types based on OpenDKP schema

// Core API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Client (Multi-tenant root)
export interface Client {
  clientId: string;
  name: string;
  subdomain?: string;
  website?: string;
  forums?: string;
  userPoolId?: string;
  userPoolWebClientId?: string;
  identityPoolId?: string;
  awsRegion?: string;
  created?: Date;
  updated?: Date;
}

// Character
export interface Character {
  id_character: number;
  clientId: string;
  name: string;
  character_class?: string;
  race?: string;
  level?: number;
  rank?: string;
  guild?: string;
  active: boolean;
  id_associated?: number; // Links alt characters to mains
  created?: Date;
  updated?: Date;
}

// Character with DKP calculation
export interface CharacterWithDKP extends Character {
  earned_dkp: number;
  spent_dkp: number;
  adjustments_dkp: number;
  current_dkp: number;
  attendance?: string; // Calculated percentage
}

// Pool (DKP categories)
export interface Pool {
  id_pool: number;
  clientId: string;
  name: string;
  description?: string;
  order: number;
  created?: Date;
  updated?: Date;
}

// Raid
export interface Raid {
  id_raid: number;
  clientId: string;
  id_pool: number;
  name: string;
  timestamp: Date;
  created?: Date;
  updated?: Date;
}

// Raid with details (includes ticks and attendance)
export interface RaidWithDetails extends Raid {
  ticks: Tick[];
  attendee_count: number;
  total_dkp_awarded: number;
  pool_name?: string;
}

// Tick (DKP awards within raids)
export interface Tick {
  tick_id: number;
  raid_id: number;
  clientId: string;
  value: number;
  description?: string;
  created?: Date;
  updated?: Date;
}

// Tick with attendance
export interface TickWithAttendance extends Tick {
  attendees: string[]; // Character names who received this tick
}

// Ticks x Characters (junction table for tick attendance)
export interface TickAttendance {
  id_character: number;
  id_tick: number;
  created?: Date;
}

// Item
export interface Item {
  id_item: number;
  name: string;
  lucylink?: string;
  created?: Date;
  updated?: Date;
}

// Item Transaction (Item purchases)
export interface ItemTransaction {
  transaction_id: number;
  character_id: number;
  item_id: number;
  raid_id: number;
  clientId: string;
  dkp: number; // Amount spent (negative for spending)
  created?: Date;
  updated?: Date;
}

// Item Transaction with details
export interface ItemTransactionWithDetails extends ItemTransaction {
  character_name: string;
  item_name: string;
  raid_name: string;
  lucylink?: string;
}

// Adjustment (Manual DKP corrections)
export interface Adjustment {
  id_adjustment: number;
  id_character: number;
  clientId: string;
  value: number; // Can be positive or negative
  reason: string;
  created_by: string;
  created?: Date;
  updated?: Date;
}

// Adjustment with details
export interface AdjustmentWithDetails extends Adjustment {
  character_name: string;
}

// DKP Summary (calculated values)
export interface DKPSummary {
  id_character: number;
  character_name: string;
  earned_dkp: number;
  spent_dkp: number;
  adjustments_dkp: number;
  current_dkp: number;
  attendance_percentage?: number;
  last_raid?: Date;
}

// User x Character association
export interface UserCharacterAssociation {
  user_id: string;
  id_character: number;
  created?: Date;
}

// User Request (approval workflow)
export interface UserRequest {
  id_request: number;
  clientId: string;
  requestor: string;
  request_type: number; // 1=character association, 2=dkp adjustment, 3=item correction, 99=other
  request_details: string;
  status: number; // 0=pending, 1=approved, 2=denied
  approver?: string;
  created?: Date;
  updated?: Date;
}

// Audit entry
export interface AuditEntry {
  id_audit: number;
  clientId: string;
  table_name: string;
  action: string;
  record_id: string;
  old_values?: string;
  new_values?: string;
  changed_by: string;
  created?: Date;
}

// Admin Settings
export interface AdminSetting {
  id_setting: number;
  clientId: string;
  setting_key: string;
  setting_value: string;
  created?: Date;
  updated?: Date;
}

// Cache entry
export interface CacheEntry {
  cache_key: string;
  cache_value: string;
  expires_at: Date;
  created?: Date;
}

// Request/Response types for API calls

// Character requests
export interface CreateCharacterRequest {
  name: string;
  character_class?: string;
  race?: string;
  level?: number;
  rank?: string;
  guild?: string;
  id_associated?: number;
}

export interface UpdateCharacterRequest extends CreateCharacterRequest {
  id_character: number;
  active?: boolean;
}

// Raid requests
export interface CreateRaidRequest {
  name: string;
  id_pool: number;
  timestamp?: Date;
}

// Tick requests
export interface CreateTickRequest {
  raid_id: number;
  value: number;
  description?: string;
  attendees?: number[]; // Array of character IDs
}

// Item transaction requests
export interface CreateItemTransactionRequest {
  character_id: number;
  item_id: number;
  raid_id: number;
  dkp: number;
}

// Adjustment requests
export interface CreateAdjustmentRequest {
  id_character: number;
  value: number;
  reason: string;
  created_by: string;
}

// Log parsing response
export interface ParsedCharacter {
  name: string;
  level?: number;
  character_class?: string;
  race?: string;
  guild?: string;
  isNew: boolean; // Whether this character needs to be created
}

export interface LogParseResult {
  characters: ParsedCharacter[];
  totalFound: number;
  newCharacters: number;
  existingCharacters: number;
}

// Statistics/Dashboard types
export interface GuildStats {
  total_characters: number;
  active_characters: number;
  total_raids: number;
  recent_raids: number;
  total_items_awarded: number;
  total_dkp_in_circulation: number;
}

// Search/Filter types
export interface CharacterFilter {
  name?: string;
  character_class?: string;
  rank?: string;
  active?: boolean;
  min_dkp?: number;
  max_dkp?: number;
}

export interface RaidFilter {
  name?: string;
  id_pool?: number;
  start_date?: Date;
  end_date?: Date;
}