// api/services.ts - Updated API services to match database schema

import {
  Character,
  CharacterWithDKP,
  Raid,
  RaidWithDetails,
  Item,
  ItemTransaction,
  ItemTransactionWithDetails,
  Tick,
  TickWithAttendance,
  Adjustment,
  AdjustmentWithDetails,
  Pool,
  DKPSummary,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CreateRaidRequest,
  CreateTickRequest,
  CreateItemTransactionRequest,
  CreateAdjustmentRequest,
  ApiResponse,
  UserRequest,
  AuditEntry,
  LogParseResult,
  ParsedCharacter,
  GuildStats
} from '../types/database';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private clientId: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.clientId = ''; // Will be set after authentication
  }

  setClientId(clientId: string) {
    this.clientId = clientId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Client-ID': this.clientId,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Character API methods
  async getCharacters(): Promise<ApiResponse<CharacterWithDKP[]>> {
    return this.request<CharacterWithDKP[]>('/characters');
  }

  async getCharacter(id: number): Promise<ApiResponse<CharacterWithDKP>> {
    return this.request<CharacterWithDKP>(`/characters/${id}`);
  }

  async createCharacter(character: CreateCharacterRequest): Promise<ApiResponse<Character>> {
    return this.request<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(character),
    });
  }

  async updateCharacter(character: UpdateCharacterRequest): Promise<ApiResponse<Character>> {
    return this.request<Character>(`/characters/${character.id_character}`, {
      method: 'PUT',
      body: JSON.stringify(character),
    });
  }

  async deleteCharacter(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/characters/${id}`, {
      method: 'DELETE',
    });
  }

  // Raid API methods
  async getRaids(): Promise<ApiResponse<RaidWithDetails[]>> {
    return this.request<RaidWithDetails[]>('/raids');
  }

  async getRaid(id: number): Promise<ApiResponse<RaidWithDetails>> {
    return this.request<RaidWithDetails>(`/raids/${id}`);
  }

  async createRaid(raid: CreateRaidRequest): Promise<ApiResponse<Raid>> {
    return this.request<Raid>('/raids', {
      method: 'POST',
      body: JSON.stringify(raid),
    });
  }

  async updateRaid(id: number, raid: Partial<CreateRaidRequest>): Promise<ApiResponse<Raid>> {
    return this.request<Raid>(`/raids/${id}`, {
      method: 'PUT',
      body: JSON.stringify(raid),
    });
  }

  async deleteRaid(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/raids/${id}`, {
      method: 'DELETE',
    });
  }

  // Tick API methods
  async getRaidTicks(raidId: number): Promise<ApiResponse<Tick[]>> {
    return this.request<Tick[]>(`/raids/${raidId}/ticks`);
  }

  async createTick(tick: CreateTickRequest): Promise<ApiResponse<Tick>> {
    return this.request<Tick>('/ticks', {
      method: 'POST',
      body: JSON.stringify(tick),
    });
  }

  async updateTick(id: number, value: number, description?: string): Promise<ApiResponse<Tick>> {
    return this.request<Tick>(`/ticks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ value, description }),
    });
  }

  async deleteTick(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/ticks/${id}`, {
      method: 'DELETE',
    });
  }

  // Item API methods
  async getItems(): Promise<ApiResponse<Item[]>> {
    return this.request<Item[]>('/items');
  }

  async getItem(id: number): Promise<ApiResponse<Item>> {
    return this.request<Item>(`/items/${id}`);
  }

  async createItem(name: string, lucylink?: string): Promise<ApiResponse<Item>> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify({ name, lucylink }),
    });
  }

  // Item Transaction API methods
  async getItemTransactions(): Promise<ApiResponse<ItemTransactionWithDetails[]>> {
    return this.request<ItemTransactionWithDetails[]>('/item-transactions');
  }

  async getCharacterItemTransactions(characterId: number): Promise<ApiResponse<ItemTransactionWithDetails[]>> {
    return this.request<ItemTransactionWithDetails[]>(`/characters/${characterId}/item-transactions`);
  }

  async createItemTransaction(transaction: CreateItemTransactionRequest): Promise<ApiResponse<ItemTransaction>> {
    return this.request<ItemTransaction>('/item-transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateItemTransaction(id: number, dkp: number): Promise<ApiResponse<ItemTransaction>> {
    return this.request<ItemTransaction>(`/item-transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ dkp }),
    });
  }

  async deleteItemTransaction(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/item-transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Adjustment API methods
  async getAdjustments(): Promise<ApiResponse<Adjustment[]>> {
    return this.request<Adjustment[]>('/adjustments');
  }

  async getCharacterAdjustments(characterId: number): Promise<ApiResponse<Adjustment[]>> {
    return this.request<Adjustment[]>(`/characters/${characterId}/adjustments`);
  }

  async createAdjustment(adjustment: CreateAdjustmentRequest): Promise<ApiResponse<Adjustment>> {
    return this.request<Adjustment>('/adjustments', {
      method: 'POST',
      body: JSON.stringify(adjustment),
    });
  }

  async updateAdjustment(id: number, adjustment: Partial<CreateAdjustmentRequest>): Promise<ApiResponse<Adjustment>> {
    return this.request<Adjustment>(`/adjustments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adjustment),
    });
  }

  async deleteAdjustment(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/adjustments/${id}`, {
      method: 'DELETE',
    });
  }

  // Pool API methods
  async getPools(): Promise<ApiResponse<Pool[]>> {
    return this.request<Pool[]>('/pools');
  }

  async createPool(name: string, description?: string, order?: number): Promise<ApiResponse<Pool>> {
    return this.request<Pool>('/pools', {
      method: 'POST',
      body: JSON.stringify({ name, description, order }),
    });
  }

  // DKP Summary methods
  async getDKPSummary(): Promise<ApiResponse<DKPSummary[]>> {
    return this.request<DKPSummary[]>('/dkp-summary');
  }

  async getCharacterDKPSummary(characterId: number): Promise<ApiResponse<DKPSummary>> {
    return this.request<DKPSummary>(`/characters/${characterId}/dkp-summary`);
  }

  // User Request methods
  async getUserRequests(): Promise<ApiResponse<UserRequest[]>> {
    return this.request<UserRequest[]>('/user-requests');
  }

  async createUserRequest(request: {
    requestor: string;
    request_type: number;
    request_details: string;
  }): Promise<ApiResponse<UserRequest>> {
    return this.request<UserRequest>('/user-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async approveUserRequest(id: number, approver: string): Promise<ApiResponse<UserRequest>> {
    return this.request<UserRequest>(`/user-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approver }),
    });
  }

  async denyUserRequest(id: number, approver: string): Promise<ApiResponse<UserRequest>> {
    return this.request<UserRequest>(`/user-requests/${id}/deny`, {
      method: 'POST',
      body: JSON.stringify({ approver }),
    });
  }

  // Audit methods
  async getAuditLog(): Promise<ApiResponse<AuditEntry[]>> {
    return this.request<AuditEntry[]>('/audit');
  }

  // Reports and Analytics
  async getDKPLeaderboard(): Promise<ApiResponse<DKPSummary[]>> {
    return this.request<DKPSummary[]>('/reports/leaderboard');
  }

  async getActivityReport(startDate: Date, endDate: Date): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
    return this.request<any>(`/reports/activity?${params}`);
  }

  async getItemHistory(itemId: number): Promise<ApiResponse<ItemTransactionWithDetails[]>> {
    return this.request<ItemTransactionWithDetails[]>(`/items/${itemId}/history`);
  }

  // Log parsing methods
  async parseLog(logText: string): Promise<ApiResponse<LogParseResult>> {
    return this.request<LogParseResult>('/logs/parse', {
      method: 'POST',
      body: JSON.stringify({ logText }),
    });
  }

  async autoCreateCharacters(characters: ParsedCharacter[]): Promise<ApiResponse<Character[]>> {
    return this.request<Character[]>('/characters/auto-create', {
      method: 'POST',
      body: JSON.stringify({ characters }),
    });
  }

  // Guild statistics
  async getGuildStats(): Promise<ApiResponse<GuildStats>> {
    return this.request<GuildStats>('/stats/guild');
  }

  // User management
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/users');
  }

  async manageUser(userId: string, action: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${userId}/${action}`, {
      method: 'POST',
    });
  }

  // Settings
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request<any>('/settings');
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual service functions for compatibility
export const characterService = {
  getAll: () => apiClient.getCharacters(),
  getById: (id: number) => apiClient.getCharacter(id),
  create: (character: CreateCharacterRequest) => apiClient.createCharacter(character),
  update: (character: UpdateCharacterRequest) => apiClient.updateCharacter(character),
  delete: (id: number) => apiClient.deleteCharacter(id),
};

export const raidService = {
  getAll: () => apiClient.getRaids(),
  getById: (id: number) => apiClient.getRaid(id),
  create: (raid: CreateRaidRequest) => apiClient.createRaid(raid),
  update: (id: number, raid: Partial<CreateRaidRequest>) => apiClient.updateRaid(id, raid),
  delete: (id: number) => apiClient.deleteRaid(id),
};

export const itemService = {
  getAll: () => apiClient.getItems(),
  getById: (id: number) => apiClient.getItem(id),
  create: (name: string, lucylink?: string) => apiClient.createItem(name, lucylink),
};

export const transactionService = {
  getAll: () => apiClient.getItemTransactions(),
  getByCharacter: (characterId: number) => apiClient.getCharacterItemTransactions(characterId),
  create: (transaction: CreateItemTransactionRequest) => apiClient.createItemTransaction(transaction),
  update: (id: number, dkp: number) => apiClient.updateItemTransaction(id, dkp),
  delete: (id: number) => apiClient.deleteItemTransaction(id),
};

export const adjustmentService = {
  getAll: () => apiClient.getAdjustments(),
  getByCharacter: (characterId: number) => apiClient.getCharacterAdjustments(characterId),
  create: (adjustment: CreateAdjustmentRequest) => apiClient.createAdjustment(adjustment),
  update: (id: number, adjustment: Partial<CreateAdjustmentRequest>) => apiClient.updateAdjustment(id, adjustment),
  delete: (id: number) => apiClient.deleteAdjustment(id),
};

export const poolService = {
  getAll: () => apiClient.getPools(),
  create: (name: string, description?: string, order?: number) => apiClient.createPool(name, description, order),
};

export const dkpService = {
  getSummary: () => apiClient.getDKPSummary(),
  getCharacterSummary: (characterId: number) => apiClient.getCharacterDKPSummary(characterId),
  getLeaderboard: () => apiClient.getDKPLeaderboard(),
};

export const reportService = {
  getActivity: (startDate: Date, endDate: Date) => apiClient.getActivityReport(startDate, endDate),
  getItemHistory: (itemId: number) => apiClient.getItemHistory(itemId),
};

export const logService = {
  parseLog: (logText: string) => apiClient.parseLog(logText),
  autoCreateCharacters: (characters: ParsedCharacter[]) => apiClient.autoCreateCharacters(characters),
};

export const guildService = {
  getStats: () => apiClient.getGuildStats(),
  getSettings: () => apiClient.getSettings(),
  updateSettings: (settings: any) => apiClient.updateSettings(settings),
};

export const userService = {
  getAll: () => apiClient.getUsers(),
  manage: (userId: string, action: string) => apiClient.manageUser(userId, action),
};

export default apiClient;
