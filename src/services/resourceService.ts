/**
 * ZENO Resource & Event Search Engine
 * Handles Intent Query Matching, Admin Management, & Link Formatter
 */

import { SEED_RESOURCE_CATALOG, type ResourceItem } from '../data/resourceCatalog';

let inMemoryResourceCatalog: ResourceItem[] = [...SEED_RESOURCE_CATALOG];

/**
 * 1. Contextual Topic & Keyword Search Engine
 */
export function searchResourceCatalog(query: string, agentType?: string): ResourceItem[] {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);

  const matched = inMemoryResourceCatalog.filter((item) => {
    // Agent Type Match Filter (if specified)
    if (agentType && agentType !== 'general' && item.agent !== agentType) {
      // Allow academic <-> resource cross match
      if (!(agentType === 'academic' && item.agent === 'resource') && !(agentType === 'resource' && item.agent === 'academic')) {
        return false;
      }
    }

    // Match tags or title/description keywords
    const matchesTag = item.tags.some((tag) => q.includes(tag) || tokens.includes(tag));
    const matchesTitle = item.title.toLowerCase().includes(q) || tokens.some((t) => item.title.toLowerCase().includes(t));
    const matchesDesc = item.description.toLowerCase().includes(q) || tokens.some((t) => item.description.toLowerCase().includes(t));

    return matchesTag || matchesTitle || matchesDesc;
  });

  // Fallback: If no direct tag matches found for agent type, return default curated picks
  if (matched.length === 0) {
    if (agentType === 'event') {
      return inMemoryResourceCatalog.filter((i) => i.agent === 'event').slice(0, 4);
    }
    if (agentType === 'placement') {
      return inMemoryResourceCatalog.filter((i) => i.agent === 'placement').slice(0, 4);
    }
    return inMemoryResourceCatalog.filter((i) => i.agent === 'academic').slice(0, 4);
  }

  // Return top 3-5 distinct items
  return matched.slice(0, 5);
}

/**
 * 2. Button Label Resolver based on Resource Type
 */
export function getButtonLabelForType(type: ResourceItem['type'], customLabel?: string): string {
  if (customLabel) return customLabel;

  switch (type) {
    case 'pdf':
      return '📄 Open PDF ↗';
    case 'course':
      return '📚 Start Course ↗';
    case 'doc':
      return '📘 Open Documentation ↗';
    case 'youtube':
      return '▶ Watch Video ↗';
    case 'hackathon':
      return '🏆 Explore Hackathon ↗';
    case 'job':
      return '💼 View Job ↗';
    case 'internship':
      return '🚀 Apply Now ↗';
    case 'repo':
      return '💻 View Repository ↗';
    case 'website':
    default:
      return '🌐 Open Website ↗';
  }
}

/**
 * 3. Generate Structured Markdown Response with Clickable Link Cards & Sources
 */
export function formatResourceMarkdownResponse(
  agentBadge: string,
  title: string,
  intro: string,
  resources: ResourceItem[]
): string {
  let md = `✦ **${agentBadge}**\n\n### ${title}\n\n${intro}\n\n`;

  resources.forEach((res) => {
    const actionText = getButtonLabelForType(res.type, res.actionLabel);
    md += `📘 **${res.title}**  \n${res.description}  \n[ ${actionText} ](${res.url})\n\n`;
  });

  // Sources Transparency Footer
  md += `### 🔗 Verified Sources\n`;
  resources.forEach((res) => {
    md += `• **${res.source}:** [ Open Source ↗ ](${res.url})\n`;
  });

  return md;
}

/**
 * 4. Admin Resource Management Helper (Add/Update Custom College Resources)
 */
export function addResourceItem(newItem: Omit<ResourceItem, 'id'>): ResourceItem {
  const created: ResourceItem = {
    ...newItem,
    id: `res-custom-${Date.now()}`,
  };
  inMemoryResourceCatalog.unshift(created);
  return created;
}

export function getAllResourceItems(): ResourceItem[] {
  return [...inMemoryResourceCatalog];
}
