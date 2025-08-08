import { z } from "zod";

// Schema for a Rails Guide entry
export const GuideSchema = z.object({
  name: z.string(), // e.g., "getting_started"
  title: z.string(), // e.g., "Getting Started with Rails"
  url: z.string(), // e.g., "https://guides.rubyonrails.org/getting_started.html"
  category: z.string(), // e.g., "Start Here"
  description: z.string().optional(),
});

// Schema for detailed guide content
export const GuideDetailSchema = z.object({
  name: z.string(),
  title: z.string(),
  url: z.string(),
  category: z.string(),
  description: z.string().optional(),
  content: z.string(), // Full HTML content or extracted text
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    level: z.number(), // heading level (1-6)
  })).optional(),
  tableOfContents: z.array(z.object({
    title: z.string(),
    anchor: z.string(),
    level: z.number(),
  })).optional(),
});

// Schema for Rails Guide registry/index
export const GuideRegistrySchema = z.object({
  guides: z.array(GuideSchema),
  categories: z.record(z.array(z.string())), // category name -> guide names
  version: z.string(), // Rails version (e.g., "8.0", "7.1")
  lastUpdated: z.string().optional(),
});

// Legacy schemas kept for compatibility (can be removed if not needed)
export const ComponentSchema = GuideSchema; // Alias for backward compatibility
