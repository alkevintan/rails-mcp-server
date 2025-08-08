import { mcpConfig } from "../lib/config.js";
import { guideCategories } from "../lib/categories.js";
import {
  GuideSchema,
  GuideDetailSchema,
  GuideRegistrySchema,
} from "./schemas.js";

/**
 * Fetches all Rails Guides by scraping the main guides page
 * @returns An array of guides with their basic details
 */
export async function fetchRailsGuides() {
  try {
    // Create guides list from our predefined categories
    const guides = [];
    
    for (const [category, guideNames] of Object.entries(guideCategories)) {
      for (const guideName of guideNames) {
        // Convert guide name to URL format (e.g., "getting_started" -> "getting_started.html")
        const url = `${mcpConfig.baseUrl}/${guideName}.html`;
        
        // Convert guide name to title format
        const title = guideName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        guides.push(GuideSchema.parse({
          name: guideName,
          title: title,
          url: url,
          category: category,
          description: `${title} - Rails ${mcpConfig.railsVersion} Guide`,
        }));
      }
    }
    
    return guides;
  } catch (error) {
    console.error("Error fetching Rails guides:", error);
    return [];
  }
}

/**
 * Fetches detailed content for a specific Rails Guide by scraping its HTML page
 * @param guideName The name of the guide (e.g., "getting_started")
 * @returns The detailed guide content
 */
export async function fetchGuideDetails(guideName: string) {
  try {
    const url = `${mcpConfig.baseUrl}/${guideName}.html`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch guide ${guideName}: ${response.statusText}`
      );
    }
    
    const htmlContent = await response.text();
    
    // Find the category for this guide
    let category = "Unknown";
    for (const [cat, guides] of Object.entries(guideCategories)) {
      if (guides.includes(guideName)) {
        category = cat;
        break;
      }
    }
    
    // Convert guide name to title
    const title = guideName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return GuideDetailSchema.parse({
      name: guideName,
      title: title,
      url: url,
      category: category,
      description: `${title} - Rails ${mcpConfig.railsVersion} Guide`,
      content: htmlContent,
      // TODO: Parse sections and table of contents from HTML if needed
    });
  } catch (error) {
    console.error(`Error fetching guide details for ${guideName}:`, error);
    throw error;
  }
}

/**
 * Fetches the complete Rails Guides registry
 * @returns Complete registry with all guides and categories
 */
export async function fetchGuideRegistry() {
  try {
    const guides = await fetchRailsGuides();
    
    return GuideRegistrySchema.parse({
      guides: guides,
      categories: guideCategories,
      version: mcpConfig.railsVersion,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching guide registry:", error);
    throw error;
  }
}

// Legacy function aliases for backward compatibility
export const fetchUIComponents = fetchRailsGuides;
export const fetchComponentDetails = fetchGuideDetails;
