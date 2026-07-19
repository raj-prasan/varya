import { Vapi, VapiClient } from "@vapi-ai/server-sdk"
import { internal } from "../_generated/api"
import { action } from "../_generated/server"
import { getSecretValue, parseSecretString } from "../lib/secrets"
import { ConvexError } from "convex/values"

export const getAssistants = action({
  args: {},
  handler: async (ctx) : Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Identity not found",
      })
    }
    const organization = identity.o

    const orgId =
      typeof organization === "object" &&
      organization !== null &&
      !Array.isArray(organization) &&
      "id" in organization &&
      typeof organization.id === "string"
        ? organization.id
        : undefined

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Organization not found",
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      })
    }
    const secretName = plugin.secretName
    const secret = await getSecretValue(secretName)
    const secretValue = parseSecretString<{
      privateApiKey: string
      publicApiKey: string
    }>(secret)

    if (!secretValue) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Connot get secret keys",
      })
    }

    if (!secretValue.privateApiKey || !secretValue.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials Incomplete.",
      })
    }

    const vapiClient = new VapiClient({
      token: secretValue.privateApiKey
    });

    const assistants =  await vapiClient.assistants.list();
    return assistants;
  },
})
export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.ListPhoneNumbersResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Identity not found",
      })
    }
    const organization = identity.o

    const orgId =
      typeof organization === "object" &&
      organization !== null &&
      !Array.isArray(organization) &&
      "id" in organization &&
      typeof organization.id === "string"
        ? organization.id
        : undefined

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Organization not found",
      })
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      })
    }
    const secretName = plugin.secretName
    const secret = await getSecretValue(secretName)
    const secretValue = parseSecretString<{
      privateApiKey: string
      publicApiKey: string
    }>(secret)

    if (!secretValue) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Connot get secret keys",
      })
    }

    if (!secretValue.privateApiKey || !secretValue.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials Incomplete.",
      })
    }

    const vapiClient = new VapiClient({
      token: secretValue.privateApiKey
    });

    const phoneNumbers =  await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
})
