# OpenDKP Database System Context

## System Overview
OpenDKP is a **multi-tenant Dragon Kill Points (DKP) management system** for gaming guilds (primarily EverQuest). DKP is a point-based loot distribution system where players earn points for raid participation and spend them on items.

**Architecture**: Multi-tenant SaaS with MySQL database, React frontend, AWS Cognito authentication

## Core Business Logic
- **DKP Calculation**: `current_dkp = earned_dkp - spent_dkp + adjustments_dkp`
- **Earned DKP**: Sum of all tick values a character received from raids
- **Spent DKP**: Sum of all item transaction costs
- **Adjustments**: Manual corrections by administrators

## Database Schema Summary

### Core Tables & Relationships

```
clients (Multi-tenant root)
├── characters (Guild members)
│   ├── items_x_characters (Item purchases: -DKP)
│   ├── ticks_x_characters (Raid participation: +DKP)  
│   ├── adjustments (Manual DKP changes)
│   └── user_x_character (User ownership)
├── raids (Raid events)
│   ├── ticks (DKP awards per raid)
│   └── items_x_characters (Items awarded)
└── pools (DKP categories: Main, Alt, Trial)
```

### Table Details

**clients** - Multi-tenant configuration
- `clientId` (PK) - Unique tenant identifier
- AWS Cognito integration fields (userPool, webClientId, etc.)
- Guild info (name, subdomain, website, forums)

**characters** - Player characters  
- `id_character` (PK), `clientId` (FK)
- Basic info: name, class, race, level, rank, guild
- `active` - Whether character is current member
- `id_associated` - Links alt characters to mains

**raids** - Raid events
- `id_raid` (PK), `clientId` (FK), `id_pool` (FK)  
- `name`, `timestamp`, tracking fields

**ticks** - DKP awards within raids
- `tick_id` (PK), `raid_id` (FK), `clientId` (FK)
- `value` (DKP amount), `description`

**ticks_x_characters** - Who received which ticks
- Links `id_character` ↔ `id_tick`
- This is how characters earn DKP

**items** - Game item database
- `id_item` (PK), `name`, `lucylink` (external reference)

**items_x_characters** - Item purchases  
- `transaction_id` (PK), links character/item/raid
- `dkp` - How much DKP was spent (negative for spending)

**adjustments** - Manual DKP corrections
- Links to character, has value (+/-), reason, timestamp

**pools** - DKP categories
- `id_pool` (PK), `name` (Main/Alt/Trial), `description`, `order`

**Support Tables**:
- `user_x_character` - Maps authenticated users to their characters
- `user_requests` - Approval workflow (character associations, adjustments)
- `admin_settings` - Per-client configuration  
- `audit` - Change tracking for compliance
- `cache` - Application-level caching

## Key Constraints & Rules

1. **Multi-tenancy**: All data tables include `clientId` foreign key
2. **Character Names**: Unique globally across all clients
3. **DKP Values**: Stored as `double`, typically -9999 to +9999 range
4. **Soft Deletes**: Characters have `active` flag rather than hard deletion
5. **Audit Trail**: All changes tracked in audit table
6. **Cascade Deletes**: When client deleted, all related data cascades

## Common Queries Needed

```sql
-- Character DKP Summary
SELECT c.name, 
  COALESCE(earned.total, 0) as earned_dkp,
  COALESCE(spent.total, 0) as spent_dkp, 
  COALESCE(adj.total, 0) as adjustments_dkp,
  (COALESCE(earned.total, 0) - COALESCE(spent.total, 0) + COALESCE(adj.total, 0)) as current_dkp
FROM characters c
LEFT JOIN (SELECT character_id, SUM(t.value) as total FROM ticks_x_characters tx JOIN ticks t ON tx.id_tick = t.tick_id WHERE t.clientId = ? GROUP BY character_id) earned ON c.id_character = earned.character_id
LEFT JOIN (SELECT character_id, SUM(dkp) as total FROM items_x_characters WHERE clientId = ? GROUP BY character_id) spent ON c.id_character = spent.character_id  
LEFT JOIN (SELECT id_character, SUM(value) as total FROM adjustments WHERE clientId = ? GROUP BY id_character) adj ON c.id_character = adj.id_character
WHERE c.clientId = ? AND c.active = 1;

-- Raid Participation
SELECT r.name, r.timestamp, COUNT(tx.id_character) as participants
FROM raids r 
LEFT JOIN ticks t ON r.id_raid = t.raid_id
LEFT JOIN ticks_x_characters tx ON t.tick_id = tx.id_tick
WHERE r.clientId = ? 
GROUP BY r.id_raid;
```

## Domain Context
- **DKP System**: Points-based loot distribution for MMO raids
- **Ticks**: DKP awarded for time spent in raid (e.g., 1 DKP per hour)
- **Loot**: Items cost DKP, creates competitive bidding system  
- **Pools**: Separate DKP economies (mains vs alts vs trials)
- **Raids**: Organized group content requiring coordination
- **Guild Ranks**: Member hierarchy (Guild Leader > Officer > Member > Initiate)

## Technical Notes
- Database: MySQL 8.0.41
- Character encoding: UTF8MB4  
- All timestamps in UTC
- Auto-increment IDs for most primary keys
- Foreign key constraints enforced
- Built for AWS RDS deployment

## API Expectations
RESTful endpoints for:
- `GET/POST/PUT/DELETE /characters`
- `GET/POST /raids` with nested ticks
- `POST /item-transactions` for loot awards
- `GET /dkp-summary` for leaderboards
- Multi-tenant via clientId in headers/auth

Use this context when working with OpenDKP-related projects.