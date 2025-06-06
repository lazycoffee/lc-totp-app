import { Buffer } from 'buffer';

// Add Buffer to global scope for web environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
} 