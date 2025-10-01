import { FrameActionPayload } from 'frames.js';

/**
 * Validate frame message signature
 * Based on Farcaster Frame specification
 */
export async function validateFrameMessage(payload: any): Promise<{
  isValid: boolean;
  message?: FrameActionPayload;
  error?: string;
}> {
  try {
    // Basic validation
    if (!payload) {
      return { isValid: false, error: 'No payload provided' };
    }

    // Check required fields
    if (!payload.untrustedData) {
      return { isValid: false, error: 'Missing untrustedData' };
    }

    // In production, verify the signature with Farcaster Hub
    // For now, basic structure validation
    const requiredFields = ['fid', 'url', 'messageHash', 'timestamp', 'network'];
    for (const field of requiredFields) {
      if (!payload.untrustedData[field]) {
        return {
          isValid: false,
          error: `Missing required field: ${field}`
        };
      }
    }

    return {
      isValid: true,
      message: payload as FrameActionPayload,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}

/**
 * Sanitize redirect URLs
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[] = ['riddlen.com', 'frames.riddlen.com']): string {
  try {
    const parsed = new URL(url);

    // Check protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Check domain whitelist
    const isAllowed = allowedDomains.some(domain =>
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed) {
      throw new Error('Unauthorized domain');
    }

    return url;
  } catch (error) {
    throw new Error(`Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  if (!existing || existing.resetAt < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count++;
  return true;
}

/**
 * Extract user info from validated frame message
 */
export function extractUserInfo(message: FrameActionPayload) {
  return {
    fid: message.untrustedData.fid,
    address: message.untrustedData.address,
    network: message.untrustedData.network,
    timestamp: message.untrustedData.timestamp,
  };
}
