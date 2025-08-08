#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  fetchRailsGuides,
  fetchGuideDetails,
  fetchGuideRegistry,
} from "./utils/index.js";
import { guideCategories } from "./lib/categories.js";
import { mcpConfig } from "./lib/config.js";

// Initialize the Rails Guides MCP Server
const server = new McpServer({
  name: "rails-guides-mcp-server",
  version: "1.0.0",
});

// Register the main tool for getting all Rails Guides
server.tool(
  "getRailsGuides",
  `Provides a comprehensive list of all Rails ${mcpConfig.railsVersion} Guides with their categories and basic information.`,
  {},
  async () => {
    try {
      const railsGuides = await fetchRailsGuides();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(railsGuides, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch Rails Guides",
          },
        ],
        isError: true,
      };
    }
  }
);

// Register tool for getting complete guide registry
server.tool(
  "getGuideRegistry",
  `Provides the complete Rails ${mcpConfig.railsVersion} Guides registry with categories and metadata.`,
  {},
  async () => {
    try {
      const registry = await fetchGuideRegistry();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(registry, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to fetch Rails Guides registry",
          },
        ],
        isError: true,
      };
    }
  }
);

// Register tool for getting a specific guide's content
server.tool(
  "getGuideContent",
  `Fetches the complete content of a specific Rails ${mcpConfig.railsVersion} Guide.`,
  {
    guideName: {
      type: "string",
      description: "The name of the guide (e.g., 'getting_started', 'active_record_basics')",
    },
  },
  async (args) => {
    try {
      const guideDetails = await fetchGuideDetails(args.guideName as string);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(guideDetails, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch guide content for: ${args.guideName}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Registers tools for each Rails Guide category
async function registerGuideCategoryTools() {
  try {
    const allGuides = await fetchRailsGuides();

    for (const [category, guideNames] of Object.entries(guideCategories)) {
      // Create category-specific tool name (replace spaces and special chars)
      const toolName = `get${category.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}Guides`;
      const guideNamesString = guideNames.join(", ");

      server.tool(
        toolName,
        `Provides Rails ${mcpConfig.railsVersion} Guides for the ${category} category: ${guideNamesString}`,
        {},
        async () => {
          try {
            // Filter guides for this category
            const categoryGuides = allGuides.filter(guide => guide.category === category);

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(categoryGuides, null, 2),
                },
              ],
            };
          } catch (error) {
            let errorMessage = `Error fetching ${category} guides`;
            if (error instanceof Error) {
              errorMessage += `: ${error.message}`;
            }
            return {
              content: [{ type: "text", text: errorMessage }],
              isError: true,
            };
          }
        }
      );
    }
  } catch (error) {
    console.error("Error registering guide category tools:", error);
  }
}

// Start the Rails Guides MCP server
async function startServer() {
  try {
    // Initialize Rails Guide category tools first
    await registerGuideCategoryTools();
    console.log(`✅ Rails ${mcpConfig.railsVersion} Guides category tools registered`);
    
    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log(`✅ Rails ${mcpConfig.railsVersion} Guides MCP server started successfully`);
  } catch (error) {
    console.error("❌ Error starting Rails Guides MCP server:", error);

    // Try to start server anyway with basic functionality
    try {
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("⚠️ Rails Guides MCP server started with limited functionality");
    } catch (connectionError) {
      console.error("❌ Failed to connect to transport:", connectionError);
      process.exit(1);
    }
  }
}

// Start the server
startServer();
