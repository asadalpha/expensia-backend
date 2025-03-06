import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req,{requested:1}); // number of requests to be made

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Bot detected",
        });
      }
      return res.status(403).json({ error: "Acess Denied" });
    }
    next(); // If the request is allowed, continue to the next middleware
  } catch (err) {
    console.log(`Arcjet middleware error:${err.message}`);
  }
};

export default arcjetMiddleware;
