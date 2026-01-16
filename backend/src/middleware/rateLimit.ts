import rateLimit from "express-rate-limit";

/**
 * Auth rate limiter
 * Prevent brute-force attacks
 */

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
})

/**
 * Scan creation limiter
 * Puppeteer scans are expensive
 */

export const scanLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 scans per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Scan limit exceeded. Please wait before starting a new scan.",
  },
});