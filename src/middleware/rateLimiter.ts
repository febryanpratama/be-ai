import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json(
      {
        errorCode: 429,
        message: "Too many requests, please try again later.",
        additionalInfo: null,
      },
    );
  },
});
