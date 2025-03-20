import { generateResponse } from "../services/ai.service.js";

export const getResult = async (req, res) => {
    try {
      const { prompt } = req.query;
      if (!prompt) {
        return res.status(400).json({ error: "Empty prompt" });
      }
  
      // Pass an empty options object by default to avoid undefined reference
      const response = await generateResponse(prompt, {});
  
      return res.status(200).json({ result: response });
    } catch (error) {
      console.error("❌ Error in getResult:", error.message);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };