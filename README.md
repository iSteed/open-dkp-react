# OpenDKP - Guild Management System

A modern, responsive guild DKP (Dragon Kill Points) management system built for EverQuest and other MMORPGs. Features automated log parsing, character management, raid tracking, and comprehensive DKP calculations.

![OpenDKP Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=OpenDKP+Guild+Management)

## 🚀 Features

### Core Functionality
- **Smart Log Parsing** - Automatically parse EverQuest raid logs to extract attendance
- **Character Auto-Creation** - Creates missing characters from log data with level/class detection
- **Raid Management** - Full CRUD operations for raids with tick-based DKP system
- **Real-time Updates** - Live parsing feedback and character creation previews
- **Role-Based Access** - Member, Officer, and Admin permission levels

### Advanced Features
- **Multiple Log Formats** - Supports EverQuest logs, who output, guild rosters, and simple lists
- **Dark Mode** - Complete dark/light theme support
- **Responsive Design** - Mobile-friendly interface
- **Tick Management** - Granular DKP tracking per raid event
- **Item Distribution** - Track DKP spending on raid loot
- **Attendance Tracking** - Comprehensive raid attendance reports

### Log Parser Capabilities
```
Supported Formats:
• EverQuest chat logs: [Wed Aug 14 20:30:15 2024] Thorgan says, 'ready to pull'
• Who output: [65 Warrior] Thorgan (Human) <Elements of War>
• Guild rosters: Thorgan [65 Warrior] (Human) <Elements of War>
• Simple lists: one character name per line
• DKP patterns: Character +15 DKP
```

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **State Management**: React Context + useState

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/opendkp-app.git
cd opendkp-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Production Build
```bash
npm run build
```

## 🎮 Usage Guide

### Getting Started
1. **Set Your Role** - Use the role selector in the top-right to simulate different permission levels
2. **Create a Raid** - Navigate to Admin > Create Raid
3. **Add Ticks** - Use the log parser to automatically extract attendance from raid logs
4. **Manage Characters** - View auto-created characters or manually add new ones

### Log Parsing Workflow
1. Go to **Admin > Create Raid**
2. Click **Add Tick**
3. Paste your raid log in the text area
4. Click **Parse Log for Attendance**
5. Review detected characters and their information
6. Click **Add Tick** to save

### Character Management
- Characters are automatically created from parsed logs
- Levels, classes, and guilds are detected when available
- Existing characters are updated with new information
- Manual character creation available via **Admin > Create Character**

## 🏗️ Project Structure

```
opendkp-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json
├── README.md
└── .gitignore
```

## 🎨 Component Architecture

### Main Components
- **Summary** - Dashboard overview with guild statistics
- **Raids** - Raid management with detailed tick system
- **Characters** - Character listing and management
- **Items** - DKP item distribution tracking
- **Admin Tools** - Settings, user management, creation forms

### Key Features
- **CreateRaid** - Advanced raid creation with log parsing
- **Tick Management** - Granular DKP event tracking
- **Smart Parsing** - Multi-format log analysis
- **Auto-Creation** - Intelligent character database population

## 🔧 Configuration

### Mock Data
The application currently uses mock data for demonstration. Key mock objects include:
- `mockCharacters` - Sample character roster
- `mockRaids` - Example raids with tick data
- `mockItems` - DKP item distribution history
- `mockFunctions` - API simulation functions

### Customization
- Modify `classColors` and `rankColors` for different styling
- Update `navigation` structure for custom menu items
- Adjust `mockFunctions` to integrate with your backend API

## 🚀 Deployment Options

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

### GitHub Pages
1. Install: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://yourusername.github.io/opendkp-app"`
3. Deploy: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Maintain responsive design principles
- Include console logging for API simulation
- Test across different screen sizes

## 📝 API Integration

The application includes mock functions that simulate API calls. To integrate with a real backend:

1. Replace `mockFunctions` with actual API calls
2. Update state management to handle async operations
3. Add error handling and loading states
4. Implement authentication/authorization

### Example API Endpoints
```javascript
// Replace mock functions with real API calls
const api = {
  createRaid: (data) => fetch('/api/raids', { method: 'POST', body: JSON.stringify(data) }),
  parseLog: (logText) => fetch('/api/logs/parse', { method: 'POST', body: logText }),
  createCharacter: (char) => fetch('/api/characters', { method: 'POST', body: JSON.stringify(char) })
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **EverQuest Community** - For inspiring guild management solutions
- **Tailwind CSS** - For the excellent utility-first CSS framework
- **Lucide** - For the beautiful icon set
- **React Team** - For the amazing framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/opendkp-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/opendkp-app/discussions)
- **Wiki**: [Project Wiki](https://github.com/yourusername/opendkp-app/wiki)

---

**Made with ❤️ for the EverQuest community**