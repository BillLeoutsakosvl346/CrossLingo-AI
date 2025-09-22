export interface TextSegment {
  id: string;
  text: string;
  type: 'text' | 'foreign';
  translation?: string;
}

export interface ParsedText {
  segments: TextSegment[];
  hasForeignWords: boolean;
}

export class TextParserService {
  private static instance: TextParserService;
  private parseCache = new Map<string, ParsedText>();

  public static getInstance(): TextParserService {
    if (!TextParserService.instance) {
      TextParserService.instance = new TextParserService();
    }
    return TextParserService.instance;
  }

  /**
   * Parses text with foreign word markup and returns structured segments
   * Format: <foreign>[word]==[translation]</foreign>
   */
  public parseText(text: string, messageId?: string): ParsedText {
    // Return cached result if available
    if (messageId && this.parseCache.has(messageId)) {
      return this.parseCache.get(messageId)!;
    }
    
    const segments: TextSegment[] = [];
    const uniquePrefix = messageId || Date.now().toString();
    let segmentId = 0;

    // Regex to match foreign word markup
    const foreignWordRegex = /<foreign>\[([^\]]+)\]==\[([^\]]+)\]<\/foreign>/g;
    
    let lastIndex = 0;
    let match;
    let hasForeignWords = false;

    // Find all foreign word matches
    while ((match = foreignWordRegex.exec(text)) !== null) {
      hasForeignWords = true;
      
      // Add text before the foreign word (if any)
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        if (beforeText.trim()) {
          segments.push({
            id: `${uniquePrefix}_text_${segmentId++}`,
            text: beforeText,
            type: 'text'
          });
        }
      }

      // Add the foreign word segment
      const foreignWord = match[1]; // The Spanish word
      const translation = match[2]; // The English translation
      
      segments.push({
        id: `${uniquePrefix}_foreign_${segmentId++}`,
        text: foreignWord,
        type: 'foreign',
        translation: translation
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last foreign word
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText.trim()) {
        segments.push({
          id: `${uniquePrefix}_text_${segmentId++}`,
          text: remainingText,
          type: 'text'
        });
      }
    }

    // If no foreign words found, return the entire text as one segment
    if (!hasForeignWords && segments.length === 0) {
      segments.push({
        id: `${uniquePrefix}_text_0`,
        text: text,
        type: 'text'
      });
    }

    const result = {
      segments,
      hasForeignWords
    };

    // Cache result for reuse
    if (messageId) {
      this.parseCache.set(messageId, result);
    }
    
    return result;
  }

  /**
   * Clean text by removing markup - useful for accessibility or fallbacks
   */
  public cleanText(text: string): string {
    return text.replace(/<foreign>\[([^\]]+)\]==\[([^\]]+)\]<\/foreign>/g, '$1');
  }

  /**
   * Extract all foreign words and their translations from text
   */
  public extractVocabulary(text: string): Array<{word: string, translation: string}> {
    const vocabulary: Array<{word: string, translation: string}> = [];
    const foreignWordRegex = /<foreign>\[([^\]]+)\]==\[([^\]]+)\]<\/foreign>/g;
    
    let match;
    while ((match = foreignWordRegex.exec(text)) !== null) {
      vocabulary.push({
        word: match[1],
        translation: match[2]
      });
    }

    return vocabulary;
  }
}

export default TextParserService;
