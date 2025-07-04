# Active Context - Production Database Persistence Issue 🚨

## NEW CRITICAL ISSUE IDENTIFIED
**Problem**: Data disappears on Render deployment, not locally
**Root Cause**: Production database falling back to ephemeral SQLite storage

### Issue Analysis
- ✅ **Local**: SQLite (`wedding.db`) persists data correctly
- ❌ **Render**: PostgreSQL connection fails → SQLite fallback → ephemeral storage → data loss
- **Evidence**: User can create weddings, but they disappear after deployments/restarts

### Production Database Flow
1. App tries PostgreSQL connection (DATABASE_URL)
2. Connection fails (`PostgreSQL not available`)
3. Falls back to SQLite in ephemeral storage
4. Data gets wiped on Render restarts

## Immediate Action Plan

### 1. Set Up PostgreSQL on Render
- Create PostgreSQL database addon on Render
- Configure DATABASE_URL environment variable
- Test connection

### 2. Fix Database Dependencies
- Ensure `pg` package is properly installed for production
- Fix PostgreSQL connection logic
- Add proper error handling

### 3. Data Migration
- Export existing local data
- Import to production PostgreSQL
- Verify persistence

## Current Status
- **Local Environment**: ✅ Working with SQLite persistence
- **Production Environment**: ❌ Ephemeral storage causing data loss
- **User Impact**: Can create weddings but they disappear

## Next Steps
1. Set up Render PostgreSQL database
2. Configure environment variables
3. Test database persistence
4. Migrate existing wedding data

## Key Learnings
- Data was never lost - only authentication tokens cleared
- localStorage clearing appears as "data disappearing" to users
- Better user communication needed for session vs. data storage
- Preventive measures can avoid future confusion 