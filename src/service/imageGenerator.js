// src/services/imageGenerator.js

import 'dotenv/config';
import fetch from 'node-fetch';

const generateImage = async (prompt) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  // API 키가 올바르게 참조되고 있는지 확인
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        size: "1432x1824",
        n: 1,
        response_format: "url"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const responseData = await response.json();
    const imageUrl = responseData.data[0].url;

    return imageUrl;
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};

export { generateImage };
