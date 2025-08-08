/**
 *  General configuration for Rails Guides MCP service
 */

// Get Rails version from environment variable, default to 8.0
const getRailsVersion = (): string => {
  const envVersion = process.env.RAILS_VERSION || process.env.RAILS_GUIDES_VERSION;
  if (envVersion) {
    // Validate version format (should be like "8.0", "7.1", "4.2", etc.)
    if (/^\d+\.\d+$/.test(envVersion)) {
      return envVersion;
    }
    console.warn(`Invalid RAILS_VERSION format: ${envVersion}. Using default 8.0`);
  }
  return "8.0";
};

// Get base URL for the specified Rails version
const getBaseUrl = (version: string): string => {
  if (version === "8.0") {
    // Latest version uses the main domain
    return "https://guides.rubyonrails.org";
  } else {
    // Older versions use versioned subdomains
    return `https://guides.rubyonrails.org/v${version}`;
  }
};

const railsVersion = getRailsVersion();
const baseUrl = getBaseUrl(railsVersion);

export const mcpConfig = {
  projectName: "rails-guides-mcp",
  railsVersion,
  baseUrl,
  guidesUrl: baseUrl,
  // Note: Rails Guides doesn't have a JSON API, so we'll need to scrape HTML
  registryFileUrl: baseUrl,
};

// Export helper functions for use in other modules
export { getRailsVersion, getBaseUrl };
