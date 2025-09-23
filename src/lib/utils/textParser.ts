import { TextSegment, ParsedText } from '../../types';

class TextParserUtil {
  private static readonly FOREIGN_WORD_REGEX = /<foreign>\[([^\]]+)\]==\[([^\]]+)\]<\/foreign>/g;

  /**
   * Parses text with foreign word markup and returns structured segments
   * Format: <foreign>[word]==[translation]</foreign>
   */
  parseText(text: string, messageId?: string): ParsedText {
    
    const segments: TextSegment[] = [];
    const uniquePrefix = messageId || Date.now().toString();
    let segmentId = 0;
    
    let lastIndex = 0;
    let match;
    let hasForeignWords = false;

    // Find all foreign word matches
    while ((match = TextParserUtil.FOREIGN_WORD_REGEX.exec(text)) !== null) {
      hasForeignWords = true;
      
      // Add text before the foreign word (if any)
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        segments.push({
          id: `${uniquePrefix}_text_${segmentId++}`,
          text: beforeText,
          type: 'text'
        });
      } else if (segments.length > 0 && segments[segments.length - 1].type === 'foreign') {
        // Add space between consecutive foreign words when there's no text between them
        segments.push({
          id: `${uniquePrefix}_space_${segmentId++}`,
          text: ' ',
          type: 'text'
        });
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

    return {
      segments,
      hasForeignWords
    };
  }

  /**
   * Clean text by removing markup - useful for accessibility or fallbacks
   */
  cleanText(text: string): string {
    return text.replace(TextParserUtil.FOREIGN_WORD_REGEX, '$1');
  }

  /**
   * Extract all foreign words and their translations from text
   */
  extractVocabulary(text: string): Array<{word: string, translation: string}> {
    const vocabulary: Array<{word: string, translation: string}> = [];
    const regex = new RegExp(TextParserUtil.FOREIGN_WORD_REGEX.source, 'g');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      vocabulary.push({
        word: match[1],
        translation: match[2]
      });
    }

    return vocabulary;
  }

}

export const textParserUtil = new TextParserUtil();
