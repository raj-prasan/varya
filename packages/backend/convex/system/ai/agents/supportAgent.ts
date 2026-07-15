import { components } from "../../../_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { escalateConversation } from "../tools/escalateConversation";
import { resolveConversation } from "../tools/resolveConversation";

export const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions: `You are a customer support agent.Use "resolveConversation" tool to resolve the conversation when required`,
  tools: {resolveConversation, escalateConversation},
  stopWhen: stepCountIs(3),
});