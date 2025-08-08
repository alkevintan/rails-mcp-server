# Rails Guides MCP Server

A **Model Context Protocol (MCP) server** that provides access to Ruby on Rails documentation and guides. This server allows AI assistants like Claude to access, search, and reference Rails Guides content programmatically, making it easier to get Rails development help and documentation.

## 🚀 Features

- **Complete Rails Guides access** - All official Rails documentation categories
- **Version support** - Support for multiple Rails versions (8.0, 7.1, 4.2, etc.)
- **Categorized organization** - Guides organized by topic (Models, Views, Controllers, etc.)
- **Dynamic version switching** - Environment variable support for different Rails versions
- **TypeScript implementation** with Zod schema validation
- **Development tools** including hot reload and inspector
- **Ready for Claude integration** with simple setup commands

## 📋 Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Claude desktop app (for integration)

## 🤝 Intended Use Cases

This MCP server is perfect for:

- **Rails developers** seeking quick access to official documentation
- **AI-assisted Rails development** with Claude or other MCP-compatible tools
- **Learning Rails** with contextual documentation access
- **Code review and debugging** with instant access to Rails conventions
- **Teams** wanting consistent Rails documentation access across projects

## 🚀 Quick Start with Claude

### Option 1: Add to Claude Project (Recommended)

```bash
# Navigate to your Rails project directory
cd your-rails-project

# Add the Rails Guides MCP server to your project
claude mcp add rails-guides npx rails-mcp-server

# For specific Rails version
claude mcp add rails-guides npx rails-mcp-server -e RAILS_VERSION=7.1
```

### Option 2: Add Globally

```bash
# Add globally for all Claude sessions
claude mcp add rails-guides npx rails-mcp-server --scope user

# With specific Rails version
claude mcp add rails-guides npx rails-mcp-server --scope user -e RAILS_VERSION=7.1
```

### Option 3: Add Locally

```bash
# Add for local Claude sessions only
claude mcp add rails-guides npx rails-mcp-server --scope local
```

## 🔧 Rails Version Support

The server defaults to **Rails 8.0** documentation but supports multiple versions:

### Supported Versions

- **Rails 8.0** (default) - `https://guides.rubyonrails.org`
- **Rails 7.1** - `https://guides.rubyonrails.org/v7.1`
- **Rails 4.2** - `https://guides.rubyonrails.org/v4.2`
- **Other versions** - Follow the pattern `v{major}.{minor}`

### Setting Rails Version

Use the `RAILS_VERSION` environment variable:

```bash
# Default (Rails 8.0)
claude mcp add rails-guides npx rails-mcp-server

# Rails 7.1
claude mcp add rails-guides npx rails-mcp-server -e RAILS_VERSION=7.1

# Rails 4.2
claude mcp add rails-guides npx rails-mcp-server -e RAILS_VERSION=4.2

# Rails 6.0
claude mcp add rails-guides npx rails-mcp-server -e RAILS_VERSION=6.0
```

### Alternative Environment Variable

You can also use `RAILS_GUIDES_VERSION`:

```bash
claude mcp add rails-guides npx rails-mcp-server -e RAILS_GUIDES_VERSION=7.1
```

## 🛠️ Manual Installation (Development)

If you want to modify or contribute to this server:

1. Clone the repository:

```bash
git clone https://github.com/your-username/rails-mcp-server.git
cd rails-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Test locally:

```bash
node dist/server.js
```

## 🏃‍♂️ Development

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Inspect MCP Server

```bash
npm run inspect
```

This opens the MCP Inspector to test your server tools interactively.

## 📚 Available Tools

The Rails Guides MCP server provides the following tools:

### Core Tools

- **`getRailsGuides`** - Returns a comprehensive list of all Rails Guides with categories and metadata
- **`getGuideRegistry`** - Complete registry with all guides, categories, and version info  
- **`getGuideContent`** - Fetches the full HTML content of a specific Rails Guide

### Category-specific Tools

Dynamic tools are created for each Rails Guide category:

- **`getStartHereGuides`** - Getting Started, Installation guides
- **`getModelsGuides`** - Active Record, Migrations, Validations, Associations, etc.
- **`getViewsGuides`** - Action View, Layouts, Helpers, Form Helpers
- **`getControllersGuides`** - Action Controller, Routing, Advanced Topics
- **`getOtherComponentsGuides`** - Active Support, Action Mailer, Active Job, etc.
- **`getDiggingDeeperGuides`** - I18n, Testing, Debugging, Configuration, etc.
- **`getGoingToProductionGuides`** - Caching, Security, Performance
- **`getAdvancedActiveRecordGuides`** - PostgreSQL, Multiple DBs, Encryption
- **`getExtendingRailsGuides`** - Plugins, Rack, Generators, Engines
- **`getContributingGuides`** - Contributing, API docs, Development setup

### Example Usage

Once added to Claude, you can ask questions like:

- "Show me the Rails guides for Models"
- "Get the Getting Started guide content"
- "What Rails guides are available for testing?"
- "Fetch the Active Record associations guide"

## 🏗️ Project Structure

```
rails-mcp-server/
├── src/
│   ├── server.ts              # Main Rails Guides MCP server
│   ├── lib/
│   │   ├── config.ts          # Configuration with version support
│   │   └── categories.ts      # Rails Guides categories
│   └── utils/
│       ├── api.ts             # Rails Guides fetching utilities
│       ├── formatters.ts      # Data formatting helpers
│       ├── schemas.ts         # Zod validation schemas
│       └── index.ts           # Utility exports
├── dist/                      # Built files
├── package.json
└── README.md
```

## 🔧 Customization

### Adding New Rails Guide Categories

To add new guide categories, update `src/lib/categories.ts`:

```typescript
export const guideCategories = {
  // Existing categories...
  "Custom Category": [
    "custom_guide_1",
    "custom_guide_2", 
  ],
};
```

The server will automatically create category-specific tools.

### Supporting Different Rails Versions

The server automatically handles different Rails versions through URL patterns:

- **Rails 8.0+**: `https://guides.rubyonrails.org/{guide}.html`
- **Older versions**: `https://guides.rubyonrails.org/v{version}/{guide}.html`

### Customizing Guide Processing

Modify `src/utils/api.ts` to customize how guides are processed:

```typescript
export async function fetchGuideDetails(guideName: string) {
  // Add custom processing logic
  // Parse HTML sections, extract code examples, etc.
}
```

## 🚀 Deployment

### Publishing as NPM Package

To make this server available via `npx`, publish it to npm:

1. Update `package.json` with your details:

```json
{
  "name": "rails-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for Rails Guides documentation",
  "bin": {
    "rails-mcp-server": "./dist/server.js"
  }
}
```

2. Build and publish:

```bash
npm run build
npm publish
```

3. Then users can add it with:

```bash
claude mcp add rails-guides npx rails-mcp-server
```

### Manual Installation

For development or custom deployments:

```bash
# Clone and build
git clone https://github.com/your-username/rails-mcp-server.git
cd rails-mcp-server
npm install && npm run build

# Add to Claude with local path
claude mcp add rails-guides node /path/to/rails-mcp-server/dist/server.js
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Rails Guides content from [Ruby on Rails](https://rubyonrails.org/)
- Inspired by the need for better AI-assisted Rails development
- Thanks to the MCP and Rails communities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/rails-mcp-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/rails-mcp-server/discussions)
- **Rails Guides**: [Official Rails Guides](https://guides.rubyonrails.org/)

---

**✨ Happy Rails development with AI assistance!**
