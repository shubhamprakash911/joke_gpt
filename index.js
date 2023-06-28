const express = require('express');
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();

const cors = require("cors")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
  res.send({"msg":"backend of joke_gpt"})
})

// Set up OpenAI configuration
const openaiConfig = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(openaiConfig);
const history = []
// Endpoint to generate a joke based on the provided keyword
app.get('/joke', async (req, res) => {
  const user_input = `Make a funny joke  on ${req.query.keyword}`
  const messages = [];
  for (const [input_text, completion_text] of history) {
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });

  try {
      // Customize this based on your desired prompt and completion settings
      // console.log(messages);
      const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages,
      });

      const completion_text = completion.data.choices[0].message.content;
      // console.log(completion_text);
      history.push([user_input, completion_text]);
      res.json({ shayari: completion_text });
  } catch (error) {
      console.error('OpenAI API request failed:', error);
      res.status(500).json({ error: 'Failed to generate joke' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


