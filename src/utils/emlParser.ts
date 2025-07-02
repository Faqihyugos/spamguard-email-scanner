export interface ParsedEmail {
  sender: string;
  subject: string;
  content: string;
  headers: Record<string, string>;
}

export function parseEmlFile(emlContent: string): ParsedEmail {
  const lines = emlContent.split('\n');
  let headerSection = true;
  let headers: Record<string, string> = {};
  let content = '';
  let currentHeader = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (headerSection) {
      // Empty line indicates end of headers
      if (line.trim() === '') {
        headerSection = false;
        continue;
      }
      
      // Check if this is a continuation of the previous header
      if (line.startsWith(' ') || line.startsWith('\t')) {
        if (currentHeader) {
          headers[currentHeader] += ' ' + line.trim();
        }
        continue;
      }
      
      // Parse header
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const headerName = line.substring(0, colonIndex).toLowerCase().trim();
        const headerValue = line.substring(colonIndex + 1).trim();
        headers[headerName] = headerValue;
        currentHeader = headerName;
      }
    } else {
      // This is the email body
      content += line + '\n';
    }
  }
  
  // Extract key information
  const sender = headers['from'] || headers['sender'] || '';
  const subject = headers['subject'] || '';
  
  // Clean up content (remove quoted-printable encoding, HTML tags, etc.)
  let cleanContent = content
    .replace(/=\r?\n/g, '') // Remove quoted-printable line breaks
    .replace(/=[0-9A-F]{2}/g, (match) => {
      // Decode quoted-printable characters
      const hex = match.substring(1);
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return {
    sender: extractEmailAddress(sender),
    subject,
    content: cleanContent,
    headers
  };
}

function extractEmailAddress(fromField: string): string {
  // Extract email from "Name <email@domain.com>" format
  const emailMatch = fromField.match(/<([^>]+)>/);
  if (emailMatch) {
    return emailMatch[1];
  }
  
  // If no angle brackets, check if it's just an email
  const directEmailMatch = fromField.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (directEmailMatch) {
    return directEmailMatch[1];
  }
  
  return fromField.trim();
}

export function validateEmlFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.eml') || file.type === 'message/rfc822';
}