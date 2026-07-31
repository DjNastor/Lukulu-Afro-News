import { isDuplicate, normaliseImportedItem, scoreImportedItem } from './ingestion';

export const allowedSourceTypes = ['api', 'rss', 'youtube-feed', 'official-embed', 'press-release', 'manual-link'];

export function prepareIntelligenceDraft(rawItem, existingItems = []) {
  const item = normaliseImportedItem(rawItem);
  return {
    ...item,
    relevance: scoreImportedItem(item),
    duplicate: isDuplicate(item, existingItems),
    editorialStatus: 'draft-review-required',
    compliance: {
      attributionRequired: true,
      fullArticleCopyAllowed: false,
      sourceLinkRequired: true,
      socialEmbedPreferred: true,
      humanApprovalRequired: true,
    },
  };
}

export function sourceIsPermitted(source) {
  return Boolean(source?.enabled && allowedSourceTypes.includes(source.type));
}
