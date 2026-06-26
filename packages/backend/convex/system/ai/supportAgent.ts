import { components } from "./_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: "You are a weather forecaster.",
  tools: { getWeather, getGeocoding },
  stopWhen: stepCountIs(3),
});