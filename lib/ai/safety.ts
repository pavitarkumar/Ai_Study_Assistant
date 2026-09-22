export interface SafetyCheckResult {
  isSafe: boolean;
  sanitizedText: string;
  flaggedReason?: string;
}

export function sanitizeAndCheckSafety(input: string): SafetyCheckResult {
  if (!input || typeof input !== 'string') {
    return { isSafe: true, sanitizedText: '' };
  }

  // Detect basic prompt injection patterns
  const injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /system prompt override/i,
    /reveal system prompt/i,
    /reveal api keys/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        sanitizedText: input.replace(pattern, '[Sanitized Security Pattern]'),
        flaggedReason: 'Detected potential prompt injection pattern. Neutralized safely.',
      };
    }
  }

  return {
    isSafe: true,
    sanitizedText: input,
  };
}
