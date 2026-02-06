# Cassina Backend API

Strategic collection game backend with 250 unique items, daily spin mechanics, and progression system.

## 🎮 Game Overview

**Cassina** is a strategic collection game featuring:
- **250 unique items** across 10 themes, 5 equipment slots, and 5 rarity tiers
- **Daily spin system** with 24-hour cooldown and progressive wheel tiers
- **Set bonus mechanics** - equip 5 items of the same theme for 2x multiplier
- **Character customization** with Head, Eye, Torso, Leg, and Foot slots

## 🗄️ Database Schema

### Dimension Tables
- `dim_stats` - 10 game themes (Samuraj, Cyberpunk, Viking, etc.)
- `dim_slots` - 5 equipment slots
- `dim_rarities` - 5 rarity levels with multipliers (1x to 20x)

### Core Tables
- `items` - All 250 unique items
- `users` - User accounts and profiles
- `user_inventory` - Items owned by users
- `user_equipped_items` - Currently equipped loadout

### Spin System
- `wheel_tiers` - 4 wheel types (Common, Silver, Gold, Celestial)
- `wheel_drop_rates` - Rarity distribution per wheel
- `user_spins` - Spin history log
- `user_progression` - Daily streaks, cooldowns, wheel tier access

## 🚀 Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
npm install

# Configure database connection
# Create .env file with:
PGURI=postgresql://username:password@localhost:5432/cassina

# Initialize database
psql -U username -d cassina -f init.sql

# Start development server
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:userId` - Get user profile

### Items
- `GET /api/items` - Get all items (supports filtering by `stat_id`, `slot_id`, `rarity_id`)
- `GET /api/items/:itemId` - Get single item details

### Inventory
- `GET /api/inventory/:userId` - Get user's inventory
- `GET /api/inventory/:userId/equipped` - Get equipped items
- `PUT /api/inventory/:userId/equip/:itemId` - Equip an item
- `DELETE /api/inventory/:userId/unequip/:slotId` - Unequip from slot

### Spin
- `POST /api/spin/:userId` - Perform daily spin
- `GET /api/spin/:userId/status` - Check spin availability

### Stats
- `GET /api/stats/:userId/active` - Get active stat bonuses
- `GET /api/stats/:userId/bonuses` - Get set bonuses
- `GET /api/stats/:userId/effective` - Get effective stats with bonuses applied

### Health
- `GET /api/health` - API health check

## 🎯 Game Mechanics

### Themes & Stats
| Theme | Stat | Effect |
|-------|------|--------|
| Samuraj | Purity | Reduces duplicates |
| Cyberpunk | Insight | Previews future spins |
| Viking | Multiplier | Increases rewards |
| Steampunk | Magnetism | Attracts rare items |
| Astronom | Fortune | Pure luck bonus |
| Kunglig | Charisma | Passive income |
| Äventyrare | Speed | Reduces cooldown |
| Magiker | Reroll | Grants reroll points |
| Undervatten | Storage | More buff slots |
| Retro | Combo | Daily streak bonus |

### Rarity System
- **Common** (1x multiplier) - 60% drop rate
- **Uncommon** (2.5x) - 25%
- **Rare** (5x) - 10%
- **Legendary** (10x) - 4%
- **Mythical** (20x) - 1%

### Wheel Progression
1. **Common Wheel** - Available from start
2. **Silver Wheel** - Unlock with 10 Rare items
3. **Gold Wheel** - Unlock with 5 Legendary items
4. **Celestial Wheel** - Complete a full Mythical set

## 📊 Example API Usage

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"secret123"}'
```

### Perform Spin
```bash
curl -X POST http://localhost:3000/api/spin/1
```

### View Inventory
```bash
curl http://localhost:3000/api/inventory/1
```

### Equip Item
```bash
curl -X PUT http://localhost:3000/api/inventory/1/equip/42
```

### Check Stats
```bash
curl http://localhost:3000/api/stats/1/effective
```

## 🏗️ Project Structure

```
cassina-backend/
├── database/
│   ├── schema/          # 11 table definitions
│   └── seeds/           # Dimension data + 250 items
├── src/
│   ├── controllers/     # 5 API controllers
│   ├── routes/          # 5 route modules
│   ├── services/        # 5 business logic services
│   ├── database.ts      # PostgreSQL connection
│   ├── types.ts         # TypeScript type definitions
│   └── index.ts         # Express app entry point
├── init.sql             # Master database initialization
└── package.json
```

## 🔧 Development Notes

- **Password Security**: Currently using plain text passwords. TODO: Implement bcrypt hashing
- **Authentication**: JWT tokens not yet implemented
- **Wheel Tier Unlocking**: Logic exists but auto-unlock not implemented
- **TypeScript**: Some strict-mode lints exist but don't affect functionality

## 📝 License

MIT
