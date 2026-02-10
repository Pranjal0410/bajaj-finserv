require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const OFFICIAL_EMAIL = "pranjal1178.be23@chitkara.edu.in";

// ---------- Utility Functions ----------

function fibonacciSeries(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function filterPrimes(arr) {
  return arr.filter(isPrime);
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function computeLCM(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

function computeHCF(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

// ---------- AI Integration (Google Gemini) ----------

async function askAI(question) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    `Answer the following question in exactly one word. No punctuation, no explanation, just one word.\n\nQuestion: ${question}`
  );
  const response = result.response;
  const text = response.text().trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
  return text;
}

// ---------- Validation Helpers ----------

function isPositiveInteger(val) {
  return Number.isInteger(val) && val > 0;
}

function isIntegerArray(val) {
  return Array.isArray(val) && val.length > 0 && val.every((v) => Number.isInteger(v));
}

// ---------- Routes ----------

// GET /health
app.get("/health", (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// GET /bfhl
app.get("/bfhl", (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// POST /bfhl - Main endpoint
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Invalid request body",
      });
    }

    const keys = Object.keys(body);
    const validKeys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
    const matchedKeys = keys.filter((k) => validKeys.includes(k));

    if (matchedKeys.length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Missing required key. Must include one of: fibonacci, prime, lcm, hcf, AI",
      });
    }

    if (matchedKeys.length > 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI",
      });
    }

    const key = matchedKeys[0];
    const value = body[key];

    // --- fibonacci ---
    if (key === "fibonacci") {
      if (!Number.isInteger(value) || value < 1) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "fibonacci requires a positive integer",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: fibonacciSeries(value),
      });
    }

    // --- prime ---
    if (key === "prime") {
      if (!isIntegerArray(value)) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "prime requires a non-empty array of integers",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: filterPrimes(value),
      });
    }

    // --- lcm ---
    if (key === "lcm") {
      if (!isIntegerArray(value) || value.some((v) => v === 0)) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "lcm requires a non-empty array of non-zero integers",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: computeLCM(value),
      });
    }

    // --- hcf ---
    if (key === "hcf") {
      if (!isIntegerArray(value) || value.some((v) => v === 0)) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "hcf requires a non-empty array of non-zero integers",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: computeHCF(value),
      });
    }

    // --- AI ---
    if (key === "AI") {
      if (typeof value !== "string" || value.trim().length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "AI requires a non-empty string question",
        });
      }
      try {
        const answer = await askAI(value);
        return res.status(200).json({
          is_success: true,
          official_email: OFFICIAL_EMAIL,
          data: answer,
        });
      } catch (aiErr) {
        return res.status(500).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          data: "AI service unavailable",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      data: "Internal server error",
    });
  }
});

// ---------- Fallback for unknown routes ----------
app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    data: "Route not found",
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
