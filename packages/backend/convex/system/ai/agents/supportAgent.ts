import { components } from "../../../_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { SUPPORT_AGENT_PROMPT } from "../../../constants";


export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-3.1-flash-lite"),
  instructions: SUPPORT_AGENT_PROMPT,
  
});