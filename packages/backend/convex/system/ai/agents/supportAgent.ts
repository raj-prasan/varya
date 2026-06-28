import { components } from "../../../_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";

export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions: "You are a customer support agent.",
  stopWhen: stepCountIs(3),
});