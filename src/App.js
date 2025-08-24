import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  Settings, 
  Home, 
  PlusCircle, 
  User, 
  Shield, 
  Sword, 
  TrendingUp,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { 
  useCharacters, 
  useRaids, 
  useItems, 
  useItemTransactions,
  useAdjustments,
  usePools,
  useDKPSummary,
  useGuildStats,
  useSettings,
  useLogParser,
  useUsers,
  useTicks,
  useClientConfig
} from './hooks/useData.ts';
import { AppProvider } from './context/AppContext.tsx';

// Main app component that uses hooks for data
const OpenDKPAppContent = () => {
  const [currentPage, setCurrentPage] = useState('summary');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('officer');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    home: true,
    utilities: true,
    characters: true,
    items: true,
    admin: true
  });

  // API hooks for data management
  const { characters, loading: charactersLoading, error: charactersError, refreshCharacters, createCharacter, updateCharacter, deleteCharacter } = useCharacters();

  const { raids, loading: raidsLoading, error: raidsError, refreshRaids, createRaid, updateRaid, deleteRaid } = useRaids();
  const { items, loading: itemsLoading, error: itemsError, refreshItems, createItem } = useItems();
  const { transactions, loading: transactionsLoading, refreshTransactions, createTransaction, updateTransaction, deleteTransaction } = useItemTransactions();
  const { adjustments, loading: adjustmentsLoading, refreshAdjustments, createAdjustment, updateAdjustment, deleteAdjustment } = useAdjustments();
  const { pools, loading: poolsLoading, error: poolsError, refreshPools, createPool } = usePools();
  const { summary: dkpSummary, loading: dkpLoading, refreshSummary, loadLeaderboard } = useDKPSummary();
  const { stats: guildStats, loading: statsLoading, refreshStats } = useGuildStats();
  const { settings, loading: settingsLoading, refreshSettings, updateSettings } = useSettings();
  const { parseResults, loading: parseLoading, error: parseError, parseLog, autoCreateCharacters, clearResults } = useLogParser();
  const { users, loading: usersLoading, refreshUsers, manageUser } = useUsers();
  const { clientId, setClient } = useClientConfig();

  const navigation = [
    {
      name: 'Home',
      key: 'home',
      icon: Home,
      items: [
        { name: 'Summary', key: 'summary', icon: TrendingUp },
        { name: 'Raids', key: 'raids', icon: Calendar },
        { name: 'Adjustments', key: 'adjustments', icon: Edit }
      ]
    },
    {
      name: 'Utilities',
      key: 'utilities',
      icon: Settings,
      items: [
        { name: 'Request Missing Raid Ticks', key: 'request-ticks', icon: Bell }
      ]
    },
    {
      name: 'Characters',
      key: 'characters',
      icon: Users,
      items: [
        { name: 'List Characters', key: 'list-characters', icon: User }
      ]
    },
    {
      name: 'Items',
      key: 'items',
      icon: Award,
      items: [
        { name: 'Items Dispersed', key: 'items-dispersed', icon: Award }
      ]
    },
    {
      name: 'Admin',
      key: 'admin',
      icon: Shield,
      adminOnly: true,
      items: [
        { name: 'Settings', key: 'settings', icon: Settings },
        { name: '+ Create Raid', key: 'create-raid', icon: PlusCircle },
        { name: '+ Create Adjustment', key: 'create-adjustment', icon: PlusCircle },
        { name: 'Create Character', key: 'create-character', icon: PlusCircle },
        { name: 'Tick Management', key: 'tick-management', icon: Calendar },
        { name: 'User Management', key: 'user-management', icon: Users }
      ]
    }
  ];

  const classColors = {
    'Warrior': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Cleric': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Rogue': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'Wizard': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Ranger': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Paladin': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  const rankColors = {
    'Member': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Officer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Guest': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Recruit': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  // Real API functions replacing mock functions
  const apiFunctions = {
    addCharacter: createCharacter,
    editCharacter: updateCharacter,
    deleteCharacter: deleteCharacter,
    scheduleRaid: createRaid,
    editRaid: updateRaid,
    viewRaid: (id) => console.log('Viewing raid', id),
    addItem: createItem,
    editItem: (id) => console.log('Edit item', id),
    viewItem: (id) => console.log('Viewing item', id),
    approveRequest: (id) => console.log('Approving request', id),
    denyRequest: (id) => console.log('Denying request', id),
    saveSettings: updateSettings,
    requestRaidTick: () => console.log('Requesting raid tick'),
    createRaid: createRaid,
    createAdjustment: createAdjustment,
    createCharacter: createCharacter,
    manageUsers: manageUser,
    addTick: (raidId) => console.log('Adding tick to raid', raidId),
    editTick: (raidId, tickId) => console.log('Editing tick', tickId),
    deleteTick: (raidId, tickId) => console.log('Deleting tick', tickId),
    parseLog: async (logText, onCharacterUpdate) => {
      try {
        const results = await parseLog(logText);
        return results?.characters?.map(c => c.name) || [];
      } catch (error) {
        console.error('Error parsing log:', error);
        return [];
      }
    },
    autoCreateCharacter: async (name, level, guild, characterClass) => {
      await createCharacter({ name, level, guild, character_class: characterClass });
    },
    editRaid: (id) => {
      console.log('DEBUG: Would call API to edit raid with ID: ' + id);
      console.log('API Call: PUT /api/raids/' + id);
      alert('Debug: Edit Raid ' + id + ' functionality triggered');
    },
    viewRaid: (id) => {
      console.log('DEBUG: Would call API to view raid details for ID: ' + id);
      console.log('API Call: GET /api/raids/' + id);
      alert('Debug: View Raid ' + id + ' functionality triggered');
    },
    addItem: () => {
      console.log('DEBUG: Would call API to add new item');
      console.log('API Call: POST /api/items');
      alert('Debug: Add Item functionality triggered');
    },
    editItem: (id) => {
      console.log('DEBUG: Would call API to edit item with ID: ' + id);
      console.log('API Call: PUT /api/items/' + id);
      alert('Debug: Edit Item ' + id + ' functionality triggered');
    },
    viewItem: (id) => {
      console.log('DEBUG: Would call API to view item details for ID: ' + id);
      console.log('API Call: GET /api/items/' + id);
      alert('Debug: View Item ' + id + ' functionality triggered');
    },
    approveRequest: (id) => {
      console.log('DEBUG: Would call API to approve request with ID: ' + id);
      console.log('API Call: PUT /api/requests/' + id + '/approve');
      alert('Debug: Approve Request ' + id + ' functionality triggered');
    },
    denyRequest: (id) => {
      console.log('DEBUG: Would call API to deny request with ID: ' + id);
      console.log('API Call: PUT /api/requests/' + id + '/deny');
      alert('Debug: Deny Request ' + id + ' functionality triggered');
    },
    saveSettings: () => {
      console.log('DEBUG: Would call API to save guild settings');
      console.log('API Call: PUT /api/settings');
      alert('Debug: Save Settings functionality triggered');
    },
    requestRaidTick: () => {
      console.log('DEBUG: Would call API to request missing raid tick');
      console.log('API Call: POST /api/requests/raid-tick');
      alert('Debug: Request Raid Tick functionality triggered');
    },
    createRaid: () => {
      console.log('DEBUG: Would call API to create new raid');
      console.log('API Call: POST /api/raids/create');
      alert('Debug: Create Raid functionality triggered');
    },
    createAdjustment: () => {
      console.log('DEBUG: Would call API to create DKP adjustment');
      console.log('API Call: POST /api/adjustments/create');
      alert('Debug: Create Adjustment functionality triggered');
    },
    createCharacter: () => {
      console.log('DEBUG: Would call API to create new character');
      console.log('API Call: POST /api/characters/create');
      alert('Debug: Create Character functionality triggered');
    },
    manageUsers: () => {
      console.log('DEBUG: Would call API to manage users');
      console.log('API Call: GET /api/users/manage');
      alert('Debug: User Management functionality triggered');
    },
    addTick: (raidId) => {
      console.log('DEBUG: Would call API to add tick to raid ' + raidId);
      console.log('API Call: POST /api/raids/' + raidId + '/ticks');
      alert('Debug: Add Tick to Raid ' + raidId + ' functionality triggered');
    },
    editTick: (raidId, tickId) => {
      console.log('DEBUG: Would call API to edit tick ' + tickId + ' in raid ' + raidId);
      console.log('API Call: PUT /api/raids/' + raidId + '/ticks/' + tickId);
      alert('Debug: Edit Tick ' + tickId + ' functionality triggered');
    },
    deleteTick: (raidId, tickId) => {
      console.log('DEBUG: Would call API to delete tick ' + tickId + ' from raid ' + raidId);
      console.log('API Call: DELETE /api/raids/' + raidId + '/ticks/' + tickId);
      alert('Debug: Delete Tick ' + tickId + ' functionality triggered');
    },
    parseLog: (logText, onCharacterUpdate) => {
      console.log('DEBUG: Would parse log text for character attendance');
      console.log('API Call: POST /api/logs/parse');
      console.log('Log text to parse:', logText.substring(0, 100) + '...');
      
      const patterns = [
        // EverQuest log patterns
        /\[.*?\] (\w+) (says|tells|has|is|joined|left|attacks|casts)/gi,
        /\[.*?\] (\w+) (-> \w+:|tells the raid,|tells the group,)/gi,
        /\[.*?\] (\w+) (has joined the raid|has been added to the group|is now the leader)/gi,
        /\[.*?\] You have invited (\w+) to join the raid/gi,
        /\[.*?\] (\w+) begins? casting/gi,
        /\[.*?\] (\w+) (hit|hits|slash|slashes|pierce|pierces) /gi,
        // Who output patterns
        /\[(\d+) (\w+)\] (\w+) \((\w+)\) \<([^>]+)\>/gi,
        // Guild roster patterns
        /(\w+) \[(\d+) (\w+)\] \((\w+)\) \<([^>]+)\>/gi,
        // Simple attendance patterns
        /^(\w+)$/gm,
        // DKP system patterns
        /(\w+) \+(\d+) DKP/gi
      ];
      
      const foundCharacters = new Map();
      
      // Enhanced parsing with character data extraction
      patterns.forEach(pattern => {
        const matches = [...logText.matchAll(pattern)];
        matches.forEach(match => {
          let characterName, level, characterClass, guild;
          
          if (pattern.source.includes('\\[\\d+')) {
            // Who output: [65 Warrior] Thorgan (Human) <Elements of War>
            level = parseInt(match[1]);
            characterClass = match[2];
            characterName = match[3];
            guild = match[5] || 'Unknown';
          } else {
            // Standard patterns
            characterName = match[1];
          }
          
          if (characterName && characterName.length > 2 && characterName.length < 20) {
            if (/^[A-Z][a-z]+$/.test(characterName)) {
              if (!foundCharacters.has(characterName)) {
                foundCharacters.set(characterName, {
                  name: characterName,
                  level: level || Math.floor(Math.random() * 10) + 60,
                  guild: guild || (Math.random() > 0.3 ? 'Elements of War' : 'Guest'),
                  characterClass: characterClass || ['Warrior', 'Cleric', 'Wizard', 'Rogue', 'Ranger', 'Paladin'][Math.floor(Math.random() * 6)]
                });
              } else {
                // Update existing data if we have better info
                const existing = foundCharacters.get(characterName);
                if (level && !existing.level) existing.level = level;
                if (characterClass && !existing.characterClass) existing.characterClass = characterClass;
                if (guild && (!existing.guild || existing.guild === 'Unknown')) existing.guild = guild;
              }
            }
          }
        });
      });
      
      const characterList = Array.from(foundCharacters.keys());
      const characterData = Array.from(foundCharacters.values());
      
      console.log('DEBUG: Found characters in log:', characterList);
      console.log('DEBUG: Character data extracted:', characterData);
      
      // Auto-create new characters
      characterData.forEach(char => {
        const existingChar = characters.find(c => c.name.toLowerCase() === char.name.toLowerCase());
        if (!existingChar) {
          console.log('DEBUG: Auto-creating character: ' + char.name + ' (' + char.level + ' ' + char.characterClass + ' from ' + char.guild + ')');
          apiFunctions.autoCreateCharacter(char.name, char.level, char.guild, char.characterClass);
        } else {
          console.log('DEBUG: Updating existing character: ' + char.name);
          if (onCharacterUpdate) {
            onCharacterUpdate(existingChar.id, char);
          }
        }
      });
      
      return { characterList, characterData };
    },
    autoCreateCharacter: (name, level, guild, characterClass) => {
      console.log('DEBUG: Would auto-create character: ' + name + ' (' + level + ' ' + characterClass + ' from ' + guild + ')');
      console.log('API Call: POST /api/characters/auto-create');
      console.log('Character data:', { name, level, guild, characterClass });
    }
  };

  // Component definitions
  const Summary = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guild Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Members</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{characters?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Raids This Week</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">3</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Items Distributed</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{items.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg Attendance</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Raids</h3>
          <div className="space-y-3">
            {raids.slice(0, 3).map((raid) => (
              <div key={raid.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{raid.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{raid.date} • {raid.attendees} attendees</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  raid.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {raid.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top DKP Earners</h3>
          <div className="space-y-3">
            {characters.sort((a, b) => b.dkp - a.dkp).slice(0, 4).map((character, index) => (
              <div key={character.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 text-gray-700 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{character.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classColors[character.characterClass] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {character.characterClass}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${rankColors[character.rank] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {character.rank}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400">{character.dkp} DKP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ListCharacters = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Characters</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search characters..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Character</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Race</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DKP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {characters.map((character) => (
                <tr key={character.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{character.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{character.race}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${classColors[character.characterClass]}`}>
                      {character.characterClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{character.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${rankColors[character.rank]}`}>
                      {character.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{character.dkp}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{character.attendance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => apiFunctions.editCharacter(character.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {(userRole === 'admin') && (
                        <button 
                          onClick={() => apiFunctions.deleteCharacter(character.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Adjustments = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">DKP Adjustments</h2>
          {(userRole === 'officer' || userRole === 'admin') && (
            <button 
              onClick={apiFunctions.createAdjustment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Adjustment
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Character</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adjustment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Officer</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Thorgan</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">-10</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Late to raid</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">2024-08-10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Mystara</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Flameheart</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">+25</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Recruitment bonus</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">2024-08-09</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Guild Leader</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RequestRaidTicks = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Request Missing Raid Ticks</h2>
        
        <div className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Character</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Character</option>
                {characters.map(char => (
                  <option key={char.id} value={char.name}>{char.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Raid</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Raid</option>
                {raids.map(raid => (
                  <option key={raid.id} value={raid.name}>{raid.name} - {raid.date}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
              <textarea 
                rows={3}
                placeholder="Explain why you were present but not credited..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={apiFunctions.requestRaidTick}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </div>

        {[].length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Recent Requests</h3>
            <div className="space-y-3">
              {[].filter(req => req.type === 'Raid Tick').map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{request.raid}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Requested by {request.player}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Items = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Item History</h2>
          {(userRole === 'officer' || userRole === 'admin') && (
            <button 
              onClick={apiFunctions.addItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Item
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Winner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DKP Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.winner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">-{item.dkp}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => apiFunctions.viewItem(item.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      {(userRole === 'officer' || userRole === 'admin') && (
                        <button 
                          onClick={() => apiFunctions.editItem(item.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Raids = () => {
    const [selectedRaid, setSelectedRaid] = useState(null);
    const [editingTick, setEditingTick] = useState(null);
    const [showAddTick, setShowAddTick] = useState(false);
    const [newTick, setNewTick] = useState({
      name: '',
      type: 'attendance',
      dkpValue: 5,
      logText: '',
      attendees: [],
      parsedCharacters: []
    });
    const [parseResults, setParseResults] = useState(null);

    const viewRaidDetails = (raid) => {
      setSelectedRaid(raid);
      setEditingTick(null);
      setShowAddTick(false);
      apiFunctions.viewRaid(raid.id);
    };

    const handleParseLog = (logText, setTickFn) => {
      if (logText) {
        const results = apiFunctions.parseLog(logText, (characterId, updatedData) => {
          console.log('DEBUG: Character update callback for ID:', characterId, 'with data:', updatedData);
        });
        
        setTickFn(prev => ({
          ...prev,
          attendees: results.characterList,
          parsedCharacters: results.characterData
        }));
        setParseResults(results);
      }
    };

    const handleSaveTick = (tickData, isNewTick = false) => {
      if (isNewTick) {
        apiFunctions.addTick(selectedRaid.id);
        setShowAddTick(false);
        setNewTick({
          name: '',
          type: 'attendance',
          dkpValue: 5,
          logText: '',
          attendees: [],
          parsedCharacters: []
        });
      } else {
        apiFunctions.editTick(selectedRaid.id, editingTick.id);
        setEditingTick(null);
      }
      setParseResults(null);
    };

    if (selectedRaid) {
      return (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setSelectedRaid(null)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ← Back to Raids
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRaid.name}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedRaid.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  selectedRaid.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {selectedRaid.status}
                </span>
              </div>
              {(userRole === 'officer' || userRole === 'admin') && (
                <button 
                  onClick={() => apiFunctions.editRaid(selectedRaid.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Raid
                </button>
              )}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedRaid.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total DKP Awarded</p>
                  <p className="text-lg text-green-600 dark:text-green-400">{selectedRaid.dkpAwarded}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Attendees</p>
                  <p className="text-lg text-blue-600 dark:text-blue-400">{selectedRaid.attendees}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Raid Ticks</h3>
                  {(userRole === 'officer' || userRole === 'admin') && selectedRaid.status !== 'Completed' && (
                    <button 
                      onClick={() => setShowAddTick(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add Tick
                    </button>
                  )}
                </div>

                {/* Add New Tick Form */}
                {showAddTick && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Tick</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tick Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Boss Kill, 30min Mark"
                          value={newTick.name}
                          onChange={(e) => setNewTick({...newTick, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                        <select
                          value={newTick.type}
                          onChange={(e) => setNewTick({...newTick, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="attendance">Attendance</option>
                          <option value="kill">Kill</option>
                          <option value="bonus">Bonus</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DKP Value</label>
                        <input
                          type="number"
                          value={newTick.dkpValue}
                          onChange={(e) => setNewTick({...newTick, dkpValue: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Paste Raid Log (for automatic attendance parsing)
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Paste your raid log here for automatic attendance parsing..."
                        value={newTick.logText}
                        onChange={(e) => setNewTick({...newTick, logText: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      />
                      <div className="mt-2 flex items-center space-x-3">
                        <button
                          onClick={() => handleParseLog(newTick.logText, setNewTick)}
                          className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 flex items-center"
                          disabled={!newTick.logText.trim()}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Parse Log
                        </button>
                      </div>
                    </div>

                    {parseResults && parseResults.characterData.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parsed Characters ({parseResults.characterData.length})
                        </label>
                        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto">
                          <div className="p-3 space-y-1">
                            {parseResults.characterData.map((char, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-900 dark:text-white">{char.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Lvl {char.level} {char.characterClass}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSaveTick(newTick, true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                        disabled={!newTick.name || !newTick.dkpValue}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Add Tick
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTick(false);
                          setNewTick({
                            name: '',
                            type: 'attendance',
                            dkpValue: 5,
                            logText: '',
                            attendees: [],
                            parsedCharacters: []
                          });
                          setParseResults(null);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {selectedRaid.ticks && selectedRaid.ticks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedRaid.ticks.map((tick) => (
                      <div key={tick.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        {editingTick && editingTick.id === tick.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tick Name</label>
                                <input
                                  type="text"
                                  value={editingTick.name}
                                  onChange={(e) => setEditingTick({...editingTick, name: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                <select
                                  value={editingTick.type}
                                  onChange={(e) => setEditingTick({...editingTick, type: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="attendance">Attendance</option>
                                  <option value="kill">Kill</option>
                                  <option value="bonus">Bonus</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DKP Value</label>
                                <input
                                  type="number"
                                  value={editingTick.dkpValue}
                                  onChange={(e) => setEditingTick({...editingTick, dkpValue: parseInt(e.target.value)})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleSaveTick(editingTick)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingTick(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-4">
                                <h4 className="font-medium text-gray-900 dark:text-white">{tick.name}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  tick.type === 'kill' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  tick.type === 'attendance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                  tick.type === 'bonus' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                }`}>
                                  {tick.type}
                                </span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  +{tick.dkpValue} DKP
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {tick.attendees.length} attendees
                                </span>
                              </div>
                              {(userRole === 'officer' || userRole === 'admin') && (
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => setEditingTick({...tick})}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => apiFunctions.deleteTick(selectedRaid.id, tick.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Attendees:</p>
                                <div className="flex flex-wrap gap-1">
                                  {tick.attendees.map((attendee, index) => (
                                    <span key={index} className="px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600">
                                      {attendee}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No ticks recorded for this raid yet.</p>
                    {(userRole === 'officer' || userRole === 'admin') && (
                      <button 
                        onClick={() => setShowAddTick(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add First Tick
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Raids</h2>
            {(userRole === 'officer' || userRole === 'admin') && (
              <button 
                onClick={apiFunctions.scheduleRaid}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Schedule Raid
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Raid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DKP Awarded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {raids.map((raid) => (
                  <tr key={raid.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{raid.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{raid.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {raid.ticks ? raid.ticks.length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{raid.attendees}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{raid.dkpAwarded}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        raid.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        raid.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {raid.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewRaidDetails(raid)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </button>
                        {(userRole === 'officer' || userRole === 'admin') && (
                          <button 
                            onClick={() => apiFunctions.editRaid(raid.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CreateRaid = () => {
    const [raidData, setRaidData] = useState({
      name: '',
      date: '',
      startTime: '',
      description: '',
      baseDkp: 15
    });
    const [ticks, setTicks] = useState([]);
    const [showTickForm, setShowTickForm] = useState(false);
    const [currentTick, setCurrentTick] = useState({
      name: '',
      type: 'attendance',
      dkpValue: 5,
      logText: '',
      attendees: [],
      parsedCharacters: []
    });
    const [parseResults, setParseResults] = useState(null);

    const handleAddTick = () => {
      if (currentTick.name && currentTick.dkpValue) {
        const newTick = {
          id: Date.now(),
          ...currentTick,
          attendees: currentTick.attendees.length > 0 ? currentTick.attendees : currentTick.parsedCharacters.map(c => c.name)
        };
        setTicks([...ticks, newTick]);
        setCurrentTick({ 
          name: '', 
          type: 'attendance', 
          dkpValue: 5, 
          logText: '', 
          attendees: [], 
          parsedCharacters: [] 
        });
        setParseResults(null);
        setShowTickForm(false);
        apiFunctions.addTick('new');
      }
    };

    const handleRemoveTick = (tickId) => {
      setTicks(ticks.filter(tick => tick.id !== tickId));
      apiFunctions.deleteTick('new', tickId);
    };

    const handleParseLog = () => {
      if (currentTick.logText) {
        const results = apiFunctions.parseLog(currentTick.logText, (characterId, updatedData) => {
          console.log('DEBUG: Character update callback for ID:', characterId, 'with data:', updatedData);
        });
        
        setCurrentTick({
          ...currentTick,
          attendees: results.characterList,
          parsedCharacters: results.characterData
        });
        setParseResults(results);
      }
    };

    const handleCreateRaid = () => {
      console.log('Creating raid with data:', { ...raidData, ticks });
      apiFunctions.createRaid();
    };

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Raid</h2>
          
          <div className="max-w-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Raid Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Plane of Time"
                  value={raidData.name}
                  onChange={(e) => setRaidData({...raidData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input 
                  type="date" 
                  value={raidData.date}
                  onChange={(e) => setRaidData({...raidData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                <input 
                  type="time" 
                  value={raidData.startTime}
                  onChange={(e) => setRaidData({...raidData, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base DKP</label>
                <input 
                  type="number" 
                  placeholder="15"
                  value={raidData.baseDkp}
                  onChange={(e) => setRaidData({...raidData, baseDkp: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea 
                rows={3}
                placeholder="Raid details and requirements..."
                value={raidData.description}
                onChange={(e) => setRaidData({...raidData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Raid Ticks</h3>
              <button
                onClick={() => setShowTickForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Tick
              </button>
            </div>

            {ticks.length > 0 && (
              <div className="mb-6">
                <div className="space-y-3">
                  {ticks.map((tick) => (
                    <div key={tick.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <h4 className="font-medium text-gray-900 dark:text-white">{tick.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              tick.type === 'kill' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              tick.type === 'attendance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}>
                              {tick.type}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {tick.dkpValue} DKP
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {tick.attendees.length} attendees
                            </span>
                          </div>
                          {tick.attendees.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Attendees: {tick.attendees.slice(0, 5).join(', ')}
                                {tick.attendees.length > 5 && ` +${tick.attendees.length - 5} more`}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveTick(tick.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showTickForm && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Tick</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tick Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Boss Kill, 30min Mark"
                      value={currentTick.name}
                      onChange={(e) => setCurrentTick({...currentTick, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                    <select
                      value={currentTick.type}
                      onChange={(e) => setCurrentTick({...currentTick, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="attendance">Attendance</option>
                      <option value="kill">Kill</option>
                      <option value="bonus">Bonus</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DKP Value</label>
                    <input
                      type="number"
                      value={currentTick.dkpValue}
                      onChange={(e) => setCurrentTick({...currentTick, dkpValue: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste Raid Log (for automatic attendance parsing)
                  </label>
                  <textarea
                    rows={8}
                    placeholder={`Paste your raid log here for automatic attendance parsing...

Supported formats:
• EverQuest logs: [Wed Aug 14 20:30:15 2024] Thorgan says, 'ready to pull'
• Who output: [65 Warrior] Thorgan (Human) <Elements of War>
• Guild roster: Thorgan [65 Warrior] (Human) <Elements of War>
• Simple lists: one character name per line

The parser will:
• Extract character names automatically
• Detect levels, classes, and guilds when available  
• Auto-create new characters if not in database
• Update existing character information`}
                    value={currentTick.logText}
                    onChange={(e) => setCurrentTick({...currentTick, logText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                  <div className="mt-2 flex items-center space-x-3">
                    <button
                      onClick={handleParseLog}
                      className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 flex items-center"
                      disabled={!currentTick.logText.trim()}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Parse Log for Attendance
                    </button>
                    {parseResults && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ✓ Found {parseResults.characterList.length} characters
                      </span>
                    )}
                  </div>
                </div>

                {parseResults && parseResults.characterData.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parsed Characters ({parseResults.characterData.length})
                    </label>
                    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                      <div className="p-3 space-y-2">
                        {parseResults.characterData.map((char, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900 dark:text-white">{char.name}</span>
                              <span className="text-gray-500 dark:text-gray-400">Lvl {char.level}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${classColors[char.characterClass] || 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                                {char.characterClass}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">{char.guild}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {characters.find(c => c.name.toLowerCase() === char.name.toLowerCase()) ? (
                                <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                                  <Check className="h-3 w-3 mr-1" />
                                  Exists
                                </span>
                              ) : (
                                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                  <PlusCircle className="h-3 w-3 mr-1" />
                                  Will Create
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentTick.attendees.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Attendees for this Tick ({currentTick.attendees.length})
                    </label>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentTick.attendees.join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddTick}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                    disabled={!currentTick.name || !currentTick.dkpValue}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Add Tick
                  </button>
                  <button
                    onClick={() => {
                      setShowTickForm(false);
                      setCurrentTick({ 
                        name: '', 
                        type: 'attendance', 
                        dkpValue: 5, 
                        logText: '', 
                        attendees: [], 
                        parsedCharacters: [] 
                      });
                      setParseResults(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleCreateRaid}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              disabled={!raidData.name || !raidData.date}
            >
              Create Raid with {ticks.length} Tick{ticks.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateAdjustment = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create DKP Adjustment</h2>
        
        <div className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Character</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Character</option>
                {characters.map(char => (
                  <option key={char.id} value={char.name}>{char.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">DKP Adjustment</label>
              <input 
                type="number" 
                placeholder="e.g., -10 or +25"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
              <textarea 
                rows={3}
                placeholder="Reason for adjustment..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={apiFunctions.createAdjustment}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Adjustment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateCharacter = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Character</h2>
        
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Character Name</label>
              <input 
                type="text" 
                placeholder="Character name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Race</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Race</option>
                <option>Human</option>
                <option>High Elf</option>
                <option>Dark Elf</option>
                <option>Gnome</option>
                <option>Dwarf</option>
                <option>Halfling</option>
                <option>Barbarian</option>
                <option>Erudite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Class</option>
                <option>Warrior</option>
                <option>Cleric</option>
                <option>Rogue</option>
                <option>Wizard</option>
                <option>Ranger</option>
                <option>Paladin</option>
                <option>Necromancer</option>
                <option>Enchanter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
              <input 
                type="number" 
                placeholder="60"
                min="1"
                max="70"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rank</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Select Rank</option>
                <option>Guest</option>
                <option>Recruit</option>
                <option>Member</option>
                <option>Officer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Starting DKP</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button 
              onClick={apiFunctions.createCharacter}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const TickManagement = () => {
    const allTicks = raids.flatMap(raid => 
      raid.ticks ? raid.ticks.map(tick => ({
        ...tick,
        raidName: raid.name,
        raidId: raid.id,
        raidDate: raid.date
      })) : []
    );

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tick Management</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {allTicks.length} total ticks across {raids?.length || 0} raids
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Raid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tick</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DKP Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {allTicks.length > 0 ? allTicks.map((tick) => (
                  <tr key={tick.raidId + '-' + tick.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tick.raidName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tick.raidDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tick.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tick.type === 'kill' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        tick.type === 'attendance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        tick.type === 'bonus' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {tick.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">+{tick.dkpValue}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-gray-300">{tick.attendees.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => apiFunctions.editTick(tick.raidId, tick.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => apiFunctions.deleteTick(tick.raidId, tick.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No ticks recorded yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const SettingsComponent = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Guild Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guild Name</label>
              <input 
                type="text" 
                defaultValue="Elements of War"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">DKP Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base DKP per Raid</label>
              <input 
                type="number" 
                defaultValue="15"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={apiFunctions.saveSettings}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
          <button 
            onClick={apiFunctions.manageUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Guild Leader</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">leader@guild.com</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Admin
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'summary':
        return <Summary />;
      case 'raids':
        return <Raids />;
      case 'adjustments':
        return <Adjustments />;
      case 'request-ticks':
        return <RequestRaidTicks />;
      case 'list-characters':
        return <ListCharacters />;
      case 'items-dispersed':
        return <Items />;
      case 'settings':
        return <SettingsComponent />;
      case 'create-raid':
        return <CreateRaid />;
      case 'create-adjustment':
        return <CreateAdjustment />;
      case 'create-character':
        return <CreateCharacter />;
      case 'tick-management':
        return <TickManagement />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <Summary />;
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const filteredNavigation = navigation.filter(section => 
    !section.adminOnly || userRole === 'admin' || userRole === 'officer'
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setCurrentPage('summary')}
                className="flex items-center ml-4 lg:ml-0 hover:opacity-80 transition-opacity"
              >
                <Sword className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">OpenDKP</h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1"
                >
                  <option value="member">Member</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-8 lg:mt-0 px-4">
            <div className="space-y-2">
              {filteredNavigation.map((section) => (
                <div key={section.key}>
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <section.icon className="h-5 w-5 mr-3" />
                      {section.name}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      expandedSections[section.key] ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections[section.key] && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setCurrentPage(item.key);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === item.key
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 lg:ml-0">
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that provides context
const OpenDKPApp = () => {
  return (
    <AppProvider>
      <OpenDKPAppContent />
    </AppProvider>
  );
};

export default OpenDKPApp;