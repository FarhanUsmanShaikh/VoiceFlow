const chrono = require('chrono-node');

/**
 * NLPParser - parses natural language transcript into a structured task object
 */
class NLPParser {
  // Parse transcript into task fields
  parseTranscript(text) {
    if (!text || typeof text !== 'string') {
      return this.getDefaultParsedTask();
    }

    const transcript = text.trim();
    
    const dueDate = this.extractDueDate(transcript);
    const priority = this.extractPriority(transcript);
    const status = this.extractStatus(transcript);
    const description = this.extractDescription(transcript);
    const title = this.extractTitle(transcript);
    
    return {
      title: title,
      description: description,
      priority: priority,
      status: status,
      dueDate: dueDate,
      // confidence scores for each extracted field
      confidence: {
        title: title && title.length > 3 ? 0.9 : 0.5,
        dueDate: dueDate ? 0.95 : 0,
        priority: this.hasPriorityKeyword(transcript) ? 0.9 : 0.6,
        status: this.hasStatusKeyword(transcript) ? 0.9 : 0.7
      }
    };
  }

  hasPriorityKeyword(text) {
    const lowerText = text.toLowerCase();
    return /\b(urgent|critical|asap|immediately|high|low|medium|important|priority)\b/.test(lowerText);
  }

  hasStatusKeyword(text) {
    const lowerText = text.toLowerCase();
    return /\b(in\s+progress|working\s+on|started|done|completed|finished|todo|to\s+do)\b/.test(lowerText);
  }

  extractDescription(text) {
    const lowerText = text.toLowerCase();
    
    const descriptionPatterns = [
      /\b(?:description|details?|notes?|about|regarding):\s*(.+)/i,
      /\b(?:with|including|contains?)\s+(.+?)(?:\s+(?:due|by|priority|urgent|high|low|medium)|\s*$)/i
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let desc = match[1].trim();
        desc = desc.replace(/\s+/g, ' ').trim();
        if (desc.length > 10) {
          return desc.substring(0, 500);
        }
      }
    }
    
    return null;
  }

  // Extract a concise title by removing dates, priorities, statuses and filler
  extractTitle(text) {
    let title = text;
    
    title = title.replace(/\b(due|by|before|on|until|deadline)\s+(on\s+)?(tomorrow|today|tonight|next\s+\w+|this\s+\w+|\d+)/gi, '');
    title = title.replace(/\b(in|within)\s+\d+\s+(day|days|week|weeks|month|months|hour|hours)/gi, '');
    title = title.replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d+/gi, '');
    title = title.replace(/\b\d+\s*(st|nd|rd|th)\s+(of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)/gi, '');
    title = title.replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '');
    title = title.replace(/\bat\s+\d+:\d+/gi, '');
    
    title = title.replace(/\b(urgent|critical|asap|immediately|high\s+priority|low\s+priority|medium\s+priority|important|priority)\b/gi, '');
    title = title.replace(/\b(in\s+progress|working\s+on|started|done|completed|finished|todo|to\s+do)\b/gi, '');
    title = title.replace(/\b(description|details?|notes?|about|regarding):.*/gi, '');
    title = title.replace(/\b(with|including|contains?)\s+.*/gi, '');
    
    title = title.replace(/^(remind\s+me\s+to|i\s+need\s+to|i\s+have\s+to|i\s+want\s+to|i\s+should|please|hey|ok|okay|um|uh|so)\s+/gi, '');
    title = title.replace(/\s+(due|by|before|priority|urgent|high|low|medium)\s*$/gi, '');
    
    title = title.replace(/\s+/g, ' ').trim();
    title = title.replace(/^[,.\s]+|[,.\s]+$/g, '');
    
    if (!title || title.length < 3) {
      const actionMatch = text.match(/\b(create|write|send|review|complete|finish|update|call|email|meet|schedule|prepare|submit|fix|debug|test|deploy)\s+[^,.!?]+/i);
      if (actionMatch) {
        title = actionMatch[0];
      } else {
        const sentences = text.split(/[.!?]/);
        title = sentences[0].trim();
      }
    }
    
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }
    
    if (title) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
    return title || text.substring(0, 50);
  }

  // Parse dates using chrono; adjust end-of-day and avoid past dates
  extractDueDate(text) {
    try {
      const results = chrono.parse(text, new Date(), { forwardDate: true });
      
      if (results && results.length > 0) {
        let date = results[0].start.date();
        
        const lowerText = text.toLowerCase();
        if (lowerText.includes('end of') || lowerText.includes('tonight')) {
          date.setHours(23, 59, 59, 999);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (date < today) {
          date.setFullYear(today.getFullYear() + 1);
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }

  extractPriority(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(urgent|critical|asap|immediately|emergency|crucial|vital)\b/)) {
      return 'urgent';
    }
    
    if (lowerText.match(/\b(low\s+priority|low|minor|whenever|optional|nice\s+to\s+have|if\s+time)\b/)) {
      return 'low';
    }
    
    if (lowerText.match(/\b(high\s+priority|important|high|must\s+do|essential)\b/)) {
      return 'high';
    }
    
    if (lowerText.match(/\b(medium\s+priority|medium|normal|regular|standard)\b/)) {
      return 'medium';
    }
    
    if (lowerText.match(/\b(soon|quickly|fast|hurry)\b/)) {
      return 'high';
    }
    
    if (lowerText.match(/\b(later|eventually|sometime|no\s+rush)\b/)) {
      return 'low';
    }
    
    return 'medium';
  }

  // Determine task status; default is 'todo'
  extractStatus(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(in\s+progress|working\s+on|started|currently\s+doing|ongoing|active)\b/)) {
      return 'in_progress';
    }
    
    if (lowerText.match(/\b(done|completed|finished|accomplished|achieved)\b/)) {
      return 'done';
    }
    
    if (lowerText.match(/\b(todo|to\s+do|need\s+to|have\s+to|should|must)\b/)) {
      return 'todo';
    }
    
    return 'todo';
  }

  // Default structure returned when parsing fails or input invalid
  getDefaultParsedTask() {
    return {
      title: '',
      description: null,
      priority: 'medium',
      status: 'todo',
      dueDate: null,
      confidence: {
        title: 0,
        dueDate: 0,
        priority: 0,
        status: 0
      }
    };
  }
}

module.exports = new NLPParser();
