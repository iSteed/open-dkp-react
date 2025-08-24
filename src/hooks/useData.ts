// hooks/useData.ts - React hooks for data management

import { useState, useEffect, useCallback } from 'react';
import {
  CharacterWithDKP,
  RaidWithDetails,
  Item,
  ItemTransactionWithDetails,
  Adjustment,
  Pool,
  DKPSummary,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CreateRaidRequest,
  CreateTickRequest,
  CreateItemTransactionRequest,
  CreateAdjustmentRequest,
  ApiResponse,
} from '../types/database';
import {
  characterService,
  raidService,
  itemService,
  transactionService,
  adjustmentService,
  poolService,
  dkpService,
  logService,
  guildService,
  userService,
  apiClient,
} from '../api/services';

// Generic hook for API state management
function useApiState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, setData };
}

// Characters hook
export function useCharacters() {
  const { data, loading, error, execute, setData } = useApiState<CharacterWithDKP[]>();

  const fetchCharacters = useCallback(() => {
    execute(characterService.getAll);
  }, [execute]);

  const createCharacter = useCallback(async (character: CreateCharacterRequest) => {
    const response = await characterService.create(character);
    if (response.success) {
      fetchCharacters(); // Refresh the list
    }
    return response;
  }, [fetchCharacters]);

  const updateCharacter = useCallback(async (character: UpdateCharacterRequest) => {
    const response = await characterService.update(character);
    if (response.success) {
      fetchCharacters(); // Refresh the list
    }
    return response;
  }, [fetchCharacters]);

  const deleteCharacter = useCallback(async (id: number) => {
    const response = await characterService.delete(id);
    if (response.success) {
      fetchCharacters(); // Refresh the list
    }
    return response;
  }, [fetchCharacters]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters: data || [],
    loading,
    error,
    refreshCharacters: fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
}

// Single character hook
export function useCharacter(id: number) {
  const { data, loading, error, execute } = useApiState<CharacterWithDKP>();

  const fetchCharacter = useCallback(() => {
    if (id) {
      execute(() => characterService.getById(id));
    }
  }, [id, execute]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  return {
    character: data,
    loading,
    error,
    refreshCharacter: fetchCharacter,
  };
}

// Raids hook
export function useRaids() {
  const { data, loading, error, execute, setData } = useApiState<RaidWithDetails[]>();

  const fetchRaids = useCallback(() => {
    execute(raidService.getAll);
  }, [execute]);

  const createRaid = useCallback(async (raid: CreateRaidRequest) => {
    const response = await raidService.create(raid);
    if (response.success) {
      fetchRaids(); // Refresh the list
    }
    return response;
  }, [fetchRaids]);

  const updateRaid = useCallback(async (id: number, raid: Partial<CreateRaidRequest>) => {
    const response = await raidService.update(id, raid);
    if (response.success) {
      fetchRaids(); // Refresh the list
    }
    return response;
  }, [fetchRaids]);

  const deleteRaid = useCallback(async (id: number) => {
    const response = await raidService.delete(id);
    if (response.success) {
      fetchRaids(); // Refresh the list
    }
    return response;
  }, [fetchRaids]);

  useEffect(() => {
    fetchRaids();
  }, [fetchRaids]);

  return {
    raids: data || [],
    loading,
    error,
    refreshRaids: fetchRaids,
    createRaid,
    updateRaid,
    deleteRaid,
  };
}

// Items hook
export function useItems() {
  const { data, loading, error, execute } = useApiState<Item[]>();

  const fetchItems = useCallback(() => {
    execute(itemService.getAll);
  }, [execute]);

  const createItem = useCallback(async (name: string, lucylink?: string) => {
    const response = await itemService.create(name, lucylink);
    if (response.success) {
      fetchItems(); // Refresh the list
    }
    return response;
  }, [fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items: data || [],
    loading,
    error,
    refreshItems: fetchItems,
    createItem,
  };
}

// Item transactions hook
export function useItemTransactions(characterId?: number) {
  const { data, loading, error, execute } = useApiState<ItemTransactionWithDetails[]>();

  const fetchTransactions = useCallback(() => {
    if (characterId) {
      execute(() => transactionService.getByCharacter(characterId));
    } else {
      execute(transactionService.getAll);
    }
  }, [characterId, execute]);

  const createTransaction = useCallback(async (transaction: CreateItemTransactionRequest) => {
    const response = await transactionService.create(transaction);
    if (response.success) {
      fetchTransactions(); // Refresh the list
    }
    return response;
  }, [fetchTransactions]);

  const updateTransaction = useCallback(async (id: number, dkp: number) => {
    const response = await transactionService.update(id, dkp);
    if (response.success) {
      fetchTransactions(); // Refresh the list
    }
    return response;
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    const response = await transactionService.delete(id);
    if (response.success) {
      fetchTransactions(); // Refresh the list
    }
    return response;
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: data || [],
    loading,
    error,
    refreshTransactions: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

// Adjustments hook
export function useAdjustments(characterId?: number) {
  const { data, loading, error, execute } = useApiState<Adjustment[]>();

  const fetchAdjustments = useCallback(() => {
    if (characterId) {
      execute(() => adjustmentService.getByCharacter(characterId));
    } else {
      execute(adjustmentService.getAll);
    }
  }, [characterId, execute]);

  const createAdjustment = useCallback(async (adjustment: CreateAdjustmentRequest) => {
    const response = await adjustmentService.create(adjustment);
    if (response.success) {
      fetchAdjustments(); // Refresh the list
    }
    return response;
  }, [fetchAdjustments]);

  const updateAdjustment = useCallback(async (id: number, adjustment: Partial<CreateAdjustmentRequest>) => {
    const response = await adjustmentService.update(id, adjustment);
    if (response.success) {
      fetchAdjustments(); // Refresh the list
    }
    return response;
  }, [fetchAdjustments]);

  const deleteAdjustment = useCallback(async (id: number) => {
    const response = await adjustmentService.delete(id);
    if (response.success) {
      fetchAdjustments(); // Refresh the list
    }
    return response;
  }, [fetchAdjustments]);

  useEffect(() => {
    fetchAdjustments();
  }, [fetchAdjustments]);

  return {
    adjustments: data || [],
    loading,
    error,
    refreshAdjustments: fetchAdjustments,
    createAdjustment,
    updateAdjustment,
    deleteAdjustment,
  };
}

// DKP pools hook
export function usePools() {
  const { data, loading, error, execute } = useApiState<Pool[]>();

  const fetchPools = useCallback(() => {
    execute(poolService.getAll);
  }, [execute]);

  const createPool = useCallback(async (name: string, description?: string, order?: number) => {
    const response = await poolService.create(name, description, order);
    if (response.success) {
      fetchPools(); // Refresh the list
    }
    return response;
  }, [fetchPools]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return {
    pools: data || [],
    loading,
    error,
    refreshPools: fetchPools,
    createPool,
  };
}

// DKP Summary hook
export function useDKPSummary() {
  const { data, loading, error, execute } = useApiState<DKPSummary[]>();

  const fetchSummary = useCallback(() => {
    execute(dkpService.getSummary);
  }, [execute]);

  const fetchLeaderboard = useCallback(() => {
    execute(dkpService.getLeaderboard);
  }, [execute]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary: data || [],
    loading,
    error,
    refreshSummary: fetchSummary,
    loadLeaderboard: fetchLeaderboard,
  };
}

// Ticks management hook
export function useTicks(raidId?: number) {
  const [ticks, setTicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicks = useCallback(async () => {
    if (!raidId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getRaidTicks(raidId);
      if (response.success && response.data) {
        setTicks(response.data);
      } else {
        setError(response.error || 'Failed to fetch ticks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [raidId]);

  const createTick = useCallback(async (tick: CreateTickRequest) => {
    const response = await apiClient.createTick(tick);
    if (response.success) {
      fetchTicks(); // Refresh the list
    }
    return response;
  }, [fetchTicks]);

  const updateTick = useCallback(async (id: number, value: number, description?: string) => {
    const response = await apiClient.updateTick(id, value, description);
    if (response.success) {
      fetchTicks(); // Refresh the list
    }
    return response;
  }, [fetchTicks]);

  const deleteTick = useCallback(async (id: number) => {
    const response = await apiClient.deleteTick(id);
    if (response.success) {
      fetchTicks(); // Refresh the list
    }
    return response;
  }, [fetchTicks]);

  useEffect(() => {
    fetchTicks();
  }, [fetchTicks]);

  return {
    ticks,
    loading,
    error,
    refreshTicks: fetchTicks,
    createTick,
    updateTick,
    deleteTick,
  };
}

// Client configuration hook
export function useClientConfig() {
  const [clientId, setClientId] = useState<string>('');

  const setClient = useCallback((id: string) => {
    setClientId(id);
    apiClient.setClientId(id);
    // Store in localStorage for persistence
    localStorage.setItem('opendkp_client_id', id);
  }, []);

  useEffect(() => {
    // Load from localStorage on mount
    const storedClientId = localStorage.getItem('opendkp_client_id');
    if (storedClientId) {
      setClient(storedClientId);
    }
  }, [setClient]);

  return {
    clientId,
    setClient,
  };
}

// Guild statistics hook
export function useGuildStats() {
  const { data, loading, error, execute } = useApiState<any>();

  const fetchStats = useCallback(() => {
    execute(guildService.getStats);
  }, [execute]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats: data,
    loading,
    error,
    refreshStats: fetchStats,
  };
}

// Settings hook
export function useSettings() {
  const { data, loading, error, execute } = useApiState<any>();

  const fetchSettings = useCallback(() => {
    execute(guildService.getSettings);
  }, [execute]);

  const updateSettings = useCallback(async (settings: any) => {
    const response = await guildService.updateSettings(settings);
    if (response.success) {
      fetchSettings(); // Refresh settings
    }
    return response;
  }, [fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings: data,
    loading,
    error,
    refreshSettings: fetchSettings,
    updateSettings,
  };
}

// Log parsing hook
export function useLogParser() {
  const [parseResults, setParseResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseLog = useCallback(async (logText: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await logService.parseLog(logText);
      if (response.success && response.data) {
        setParseResults(response.data);
      } else {
        setError(response.error || 'Failed to parse log');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const autoCreateCharacters = useCallback(async (characters: any[]) => {
    const response = await logService.autoCreateCharacters(characters);
    return response;
  }, []);

  return {
    parseResults,
    loading,
    error,
    parseLog,
    autoCreateCharacters,
    clearResults: () => setParseResults(null),
  };
}

// User management hook
export function useUsers() {
  const { data, loading, error, execute } = useApiState<any[]>();

  const fetchUsers = useCallback(() => {
    execute(userService.getAll);
  }, [execute]);

  const manageUser = useCallback(async (userId: string, action: string) => {
    const response = await userService.manage(userId, action);
    if (response.success) {
      fetchUsers(); // Refresh users list
    }
    return response;
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users: data || [],
    loading,
    error,
    refreshUsers: fetchUsers,
    manageUser,
  };
}
