# OpenDKP React - Comprehensive Function List

This document lists all functions, features, and capabilities of the OpenDKP React application for future testing reference.

## 1. AUTHENTICATION & CLIENT MANAGEMENT

### Authentication Functions
- **Login/Logout System**: User authentication with client ID and user credentials
- **Session Management**: Persistent authentication state stored in localStorage
- **Role-Based Access**: Member, Officer, Admin role system
- **Client Configuration**: Multi-guild client support with client ID switching

### Context & State Management
- **Global State Management**: React Context + useReducer for app-wide state
- **Preferences Management**: Theme, pagination, default pool settings
- **Local Storage Persistence**: Auto-save/restore user preferences and authentication

## 2. CHARACTER MANAGEMENT

### Character CRUD Operations
- **View Characters**: List all guild characters with pagination and search
- **Create Character**: Add new characters with class, race, level, rank
- **Update Character**: Edit character details, level, rank, guild status
- **Delete Character**: Remove characters from the guild
- **Character Details**: View individual character profiles with DKP history

### Character Features
- **DKP Tracking**: Real-time DKP totals, attendance rates, transaction history
- **Class & Race Support**: Full EverQuest class/race system (25+ classes, 16 races)
- **Level Tracking**: Character levels 1-125
- **Guild Rank Management**: Member, Officer, Guest, Recruit ranks
- **Attendance Tracking**: Raid attendance percentages and history
- **Character Search**: Name-based character filtering
- **Character Association**: Request system for linking characters to users

## 3. RAID MANAGEMENT

### Raid CRUD Operations
- **View Raids**: List all raids with status, dates, attendance
- **Create Raid**: Schedule new raids with details and configuration
- **Update Raid**: Edit raid information, status, and settings
- **Delete Raid**: Remove raids from the system
- **Raid Details**: Detailed raid view with ticks and attendance

### Raid Features
- **Raid Status Management**: Scheduled, Active, Completed status tracking
- **Tick System**: Individual DKP awards within raids (kill, attendance, bonus)
- **Attendance Tracking**: Character presence/absence for each raid
- **DKP Distribution**: Automatic DKP calculation and distribution
- **Raid History**: Historical raid data and statistics

### Tick Management
- **Create Ticks**: Add attendance/kill/bonus ticks to raids
- **Update Ticks**: Modify tick values and descriptions
- **Delete Ticks**: Remove ticks from raids
- **Tick Types**: Support for kill, attendance, bonus, and custom tick types
- **Bulk Character Selection**: Mass select characters for tick distribution

## 4. ITEM & TRANSACTION MANAGEMENT

### Item CRUD Operations
- **View Items**: List all raid items with search and filtering
- **Create Items**: Add new items with Lucy database links
- **Item History**: Track item distribution history
- **Item Search**: Name-based item filtering

### Transaction Management
- **Create Transactions**: Record item purchases with DKP costs
- **Update Transactions**: Modify DKP costs for existing transactions
- **Delete Transactions**: Remove item transactions
- **Transaction History**: Complete audit trail of all item distributions
- **Character Item History**: Per-character item acquisition records

## 5. DKP SYSTEM

### DKP Tracking
- **DKP Totals**: Real-time DKP balance calculations
- **DKP Summary**: Character DKP summaries across all pools
- **DKP Leaderboards**: Top DKP earners rankings
- **Pool Support**: Multiple DKP pools (Main, Alt, Trial, etc.)
- **DKP History**: Complete transaction and adjustment history

### DKP Adjustments
- **Manual Adjustments**: Add/subtract DKP with reasons and audit trails
- **Adjustment History**: Track all manual DKP modifications
- **Officer Approval**: Adjustment approval system for governance
- **Adjustment Reasons**: Categorized reasons for DKP changes

### Pool Management
- **Create Pools**: Set up different DKP pool categories
- **Pool Configuration**: Manage pool settings and relationships
- **Cross-Pool Tracking**: Character DKP across multiple pools

## 6. LOG PARSING & AUTOMATION

### EverQuest Log Parsing
- **Chat Log Parser**: Parse EverQuest chat logs for attendance data
- **Character Auto-Creation**: Automatically create characters from log data
- **Attendance Detection**: Identify character presence from log patterns
- **Multiple Log Formats**: Support for various EverQuest log formats
- **Parsing Feedback**: Real-time parsing results and character detection

### Automation Features
- **Batch Character Creation**: Mass create characters from parsed logs
- **Attendance Import**: Import attendance data from log files
- **Log Pattern Recognition**: Intelligent character name extraction
- **Parsing Error Handling**: Robust error detection and reporting

## 7. REPORTING & ANALYTICS

### Guild Statistics
- **Active Member Count**: Real-time guild membership statistics
- **Raid Activity**: Weekly/monthly raid participation metrics
- **Item Distribution**: Item dispersal statistics and trends
- **Attendance Analytics**: Guild-wide attendance averages and trends

### Reports
- **DKP Leaderboards**: Top earners and spenders reports
- **Activity Reports**: Date-range activity summaries
- **Audit Reports**: Complete audit trail reports
- **Character Reports**: Individual character performance metrics

## 8. USER INTERFACE FEATURES

### Navigation & Layout
- **Responsive Design**: Mobile-friendly adaptive layout
- **Sidebar Navigation**: Collapsible sidebar with organized menu structure
- **Page Routing**: Client-side navigation between different sections
- **Breadcrumb Navigation**: Clear navigation hierarchy

### Theme & Customization
- **Dark/Light Mode**: Toggle between dark and light themes (defaults to dark)
- **Theme Persistence**: Save theme preference to localStorage
- **Responsive Tables**: Adaptive table layouts for different screen sizes
- **Loading States**: Loading indicators for all async operations
- **Error Handling**: User-friendly error messages and states

### Data Display
- **Pagination**: Configurable items per page (default 50)
- **Search Functionality**: Real-time search across multiple data types
- **Sorting**: Column-based sorting for tables
- **Filtering**: Advanced filtering options for characters, items, raids
- **Data Refresh**: Manual and automatic data refresh capabilities

## 9. ADMINISTRATION

### User Management
- **User Roles**: Manage user permissions and access levels
- **User Requests**: Handle character association and access requests
- **User Administration**: User account management and permissions

### System Settings
- **Guild Configuration**: Guild-specific settings and preferences
- **System Settings**: Application-wide configuration options
- **Client Management**: Multi-guild client switching and configuration

### Audit & Security
- **Audit Logging**: Complete audit trail for all DKP-related changes
- **Change Tracking**: Track who made what changes when
- **Data Integrity**: Validation and error checking for all operations
- **Security Headers**: Client-specific API authentication

## 10. API INTEGRATION

### Backend Communication
- **RESTful API Client**: Comprehensive API client with typed responses
- **Error Handling**: Robust API error handling and retry logic
- **Client Headers**: Multi-tenancy support with client-specific headers
- **Response Validation**: Type-safe API response handling

### Data Synchronization
- **Real-time Updates**: Live data updates across the application
- **Optimistic Updates**: Immediate UI updates with backend sync
- **Conflict Resolution**: Handle concurrent data modifications
- **Cache Management**: Intelligent data caching and invalidation

## 11. TESTING CATEGORIES FOR FUTURE REFERENCE

### Unit Tests
- [x] Context state management and reducers
- [ ] Custom hooks functionality
- [ ] API client methods
- [ ] Data transformation utilities
- [ ] Theme switching logic

### Integration Tests
- [ ] Character CRUD operations
- [ ] Raid management workflows
- [ ] DKP calculation accuracy
- [ ] Log parsing functionality
- [ ] Authentication flows

### End-to-End Tests
- [ ] Complete user workflows
- [ ] Multi-page navigation
- [ ] Data persistence
- [ ] Error handling scenarios
- [ ] Theme and preference management

### Performance Tests
- [ ] Large data set handling
- [ ] Search and filtering performance
- [ ] Pagination efficiency
- [ ] API response times
- [ ] Memory usage optimization

## 12. SPECIALIZED EVERQUEST FEATURES

### Game-Specific Data
- **EverQuest Classes**: Support for all 25+ EverQuest classes with appropriate styling
- **EverQuest Races**: Complete race system with 16+ races
- **Level Cap**: Support for levels 1-125 (current EverQuest level cap)
- **Guild Ranks**: Traditional EverQuest guild hierarchy

### DKP System Features
- **Dragon Kill Points**: Traditional DKP system for raid loot distribution
- **Tick-Based Attendance**: EverQuest-style attendance tracking
- **Item Links**: Integration with Lucy (EverQuest database) for item information
- **Raid Zones**: Zone-specific raid tracking and organization

This comprehensive list covers all major functions and features of the OpenDKP React application, organized by functional area for easy reference during future testing initiatives.