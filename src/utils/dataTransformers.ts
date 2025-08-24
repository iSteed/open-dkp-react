// utils/dataTransformers.ts - Utility functions for data transformation

import {
  Character,
  CharacterWithDKP,
  Raid,
  RaidWithDetails,
  ItemTransaction,
  ItemTransactionWithDetails,
  Adjustment,
  DKPSummary,
  Tick,
  TickCharacterAssociation,
} from '../types/database';

// Date formatting utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(d);
};

// DKP formatting utilities
export const formatDKP = (value: number): string => {
  return value.toFixed(1);
};

export const formatDKPChange = (value: number): string => {
  const formatted = formatDKP(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
};

// Character utilities
export const getCharacterDisplayName = (character: Character): string => {
  return character.name;
};

export const getCharacterLevel = (character: Character): string => {
  if (!character.level) return 'Unknown';
  return `Level ${character.level}`;
};

export const getCharacterClass = (character: Character): string => {
  return character.class || 'Unknown';
};

export const getCharacterRank = (character: Character): string => {
  return character.rank || 'Member';
};

// Calculate current DKP from individual components
export const calculateCurrentDKP = (
  earnedDKP: number,
  spentDKP: number,
  adjustmentsDKP: number
): number => {
  return earnedDKP - spentDKP + adjustmentsDKP;
};

// Transform character data for display
export const transformCharacterForDisplay = (character: CharacterWithDKP) => ({
  ...character,
  displayName: getCharacterDisplayName(character),
  levelText: getCharacterLevel(character),
  classText: getCharacterClass(character),
  rankText: getCharacterRank(character),
  currentDKPText: formatDKP(character.current_dkp),
  earnedDKPText: formatDKP(character.earned_dkp),
  spentDKPText: formatDKP(character.spent_dkp),
  adjustmentsDKPText: formatDKPChange(character.adjustments_dkp),
});

// Raid utilities
export const getRaidDisplayName = (raid: Raid): string => {
  return raid.name;
};

export const getRaidDateText = (raid: Raid): string => {
  return formatDateTime(raid.timestamp);
};

export const transformRaidForDisplay = (raid: RaidWithDetails) => ({
  ...raid,
  displayName: getRaidDisplayName(raid),
  dateText: getRaidDateText(raid),
  participantText: `${raid.participant_count} participants`,
  tickText: `${raid.tick_count} ticks`,
});

// Item transaction utilities
export const getTransactionDisplayText = (transaction: ItemTransactionWithDetails): string => {
  return `${transaction.character_name} received ${transaction.item_name} for ${formatDKP(transaction.dkp)} DKP`;
};

export const transformTransactionForDisplay = (transaction: ItemTransactionWithDetails) => ({
  ...transaction,
  displayText: getTransactionDisplayText(transaction),
  dkpText: formatDKP(transaction.dkp),
});

// Adjustment utilities
export const getAdjustmentDisplayText = (adjustment: Adjustment): string => {
  const valueText = formatDKPChange(adjustment.value);
  const reason = adjustment.description || adjustment.name;
  return `${valueText} DKP - ${reason}`;
};

export const transformAdjustmentForDisplay = (adjustment: Adjustment) => ({
  ...adjustment,
  displayText: getAdjustmentDisplayText(adjustment),
  valueText: formatDKPChange(adjustment.value),
  dateText: formatDateTime(adjustment.timestamp),
});

// DKP Summary utilities
export const transformDKPSummaryForDisplay = (summary: DKPSummary) => ({
  ...summary,
  currentDKPText: formatDKP(summary.current_dkp),
  earnedText: formatDKP(summary.total_earned),
  spentText: formatDKP(summary.total_spent),
  adjustmentsText: formatDKPChange(summary.total_adjustments),
  lastActivityText: formatTimeAgo(summary.last_activity),
});

// Sorting utilities
export const sortCharactersByDKP = (characters: CharacterWithDKP[], descending = true) => {
  return [...characters].sort((a, b) => {
    const comparison = a.current_dkp - b.current_dkp;
    return descending ? -comparison : comparison;
  });
};

export const sortCharactersByName = (characters: CharacterWithDKP[]) => {
  return [...characters].sort((a, b) => a.name.localeCompare(b.name));
};

export const sortRaidsByDate = (raids: RaidWithDetails[], descending = true) => {
  return [...raids].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return descending ? dateB - dateA : dateA - dateB;
  });
};

// Filtering utilities
export const filterActiveCharacters = (characters: CharacterWithDKP[]) => {
  return characters.filter(char => char.active);
};

export const filterCharactersByClass = (characters: CharacterWithDKP[], className: string) => {
  return characters.filter(char => char.class === className);
};

export const filterCharactersByRank = (characters: CharacterWithDKP[], rank: string) => {
  return characters.filter(char => char.rank === rank);
};

export const filterTransactionsByDateRange = (
  transactions: ItemTransactionWithDetails[],
  startDate: Date,
  endDate: Date
) => {
  return transactions.filter(transaction => {
    // Note: You'll need to get the transaction date from the raid or add a timestamp to transactions
    // For now, this is a placeholder
    return true;
  });
};

// Search utilities
export const searchCharacters = (characters: CharacterWithDKP[], query: string) => {
  const lowerQuery = query.toLowerCase();
  return characters.filter(char => 
    char.name.toLowerCase().includes(lowerQuery) ||
    (char.class && char.class.toLowerCase().includes(lowerQuery)) ||
    (char.rank && char.rank.toLowerCase().includes(lowerQuery))
  );
};

export const searchRaids = (raids: RaidWithDetails[], query: string) => {
  const lowerQuery = query.toLowerCase();
  return raids.filter(raid =>
    raid.name.toLowerCase().includes(lowerQuery) ||
    (raid.pool_name && raid.pool_name.toLowerCase().includes(lowerQuery))
  );
};

// Validation utilities
export const validateCharacterName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Character name is required';
  }
  if (name.length > 45) {
    return 'Character name must be 45 characters or less';
  }
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Character name must start with a letter and contain only letters and numbers';
  }
  return null;
};

export const validateDKPValue = (value: number): string | null => {
  if (isNaN(value)) {
    return 'DKP value must be a number';
  }
  if (value < -9999 || value > 9999) {
    return 'DKP value must be between -9999 and 9999';
  }
  return null;
};

export const validateRaidName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Raid name is required';
  }
  if (name.length > 45) {
    return 'Raid name must be 45 characters or less';
  }
  return null;
};

// Data aggregation utilities
export const aggregateDKPByClass = (characters: CharacterWithDKP[]) => {
  const classStats = new Map<string, { count: number; totalDKP: number; avgDKP: number }>();
  
  characters.forEach(char => {
    const className = char.class || 'Unknown';
    const existing = classStats.get(className) || { count: 0, totalDKP: 0, avgDKP: 0 };
    
    existing.count += 1;
    existing.totalDKP += char.current_dkp;
    existing.avgDKP = existing.totalDKP / existing.count;
    
    classStats.set(className, existing);
  });
  
  return Array.from(classStats.entries()).map(([className, stats]) => ({
    className,
    ...stats,
  }));
};

export const aggregateDKPByRank = (characters: CharacterWithDKP[]) => {
  const rankStats = new Map<string, { count: number; totalDKP: number; avgDKP: number }>();
  
  characters.forEach(char => {
    const rank = char.rank || 'Member';
    const existing = rankStats.get(rank) || { count: 0, totalDKP: 0, avgDKP: 0 };
    
    existing.count += 1;
    existing.totalDKP += char.current_dkp;
    existing.avgDKP = existing.totalDKP / existing.count;
    
    rankStats.set(rank, existing);
  });
  
  return Array.from(rankStats.entries()).map(([rank, stats]) => ({
    rank,
    ...stats,
  }));
};

// Export all utilities as a single object for easier importing
export const dataUtils = {
  format: {
    date: formatDate,
    dateTime: formatDateTime,
    timeAgo: formatTimeAgo,
    dkp: formatDKP,
    dkpChange: formatDKPChange,
  },
  character: {
    displayName: getCharacterDisplayName,
    level: getCharacterLevel,
    class: getCharacterClass,
    rank: getCharacterRank,
    transform: transformCharacterForDisplay,
  },
  raid: {
    displayName: getRaidDisplayName,
    dateText: getRaidDateText,
    transform: transformRaidForDisplay,
  },
  transaction: {
    displayText: getTransactionDisplayText,
    transform: transformTransactionForDisplay,
  },
  adjustment: {
    displayText: getAdjustmentDisplayText,
    transform: transformAdjustmentForDisplay,
  },
  sort: {
    charactersByDKP: sortCharactersByDKP,
    charactersByName: sortCharactersByName,
    raidsByDate: sortRaidsByDate,
  },
  filter: {
    activeCharacters: filterActiveCharacters,
    charactersByClass: filterCharactersByClass,
    charactersByRank: filterCharactersByRank,
  },
  search: {
    characters: searchCharacters,
    raids: searchRaids,
  },
  validate: {
    characterName: validateCharacterName,
    dkpValue: validateDKPValue,
    raidName: validateRaidName,
  },
  aggregate: {
    dkpByClass: aggregateDKPByClass,
    dkpByRank: aggregateDKPByRank,
  },
};
