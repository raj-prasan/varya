import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { StorageActionWriter } from "convex/server"
import { assert } from "convex-helpers"
import { Id } from "../_generated/dataModel"

const AI_MODELS = {
  image: google("gemini-2.5-flash"),
  pdf: google("gemini-3.5-flash"),
  html: google("gemini-2.5-flash"),
} as const

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const

const SYSTEM_PROMPTS = {
  image:
    "You turn images into text. If it is a photo of document , transcribe it.If it is not a document, then describe it",
  pdf: "You transform PDF Files into text",
  html: "Tou transform content into markdown",
} as const

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">
  filename: string
  bytes?: ArrayBuffer
  mimeType: string
}

export const extractTextContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> => {
  const { storageId, filename, bytes, mimeType } = args

  const url = await ctx.storage.getUrl(storageId)
  assert(url, "Failed to get storage URL.")

  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url)
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, filename)
  }
  if(mimeType.toLowerCase().includes("text")){
    return extractTextFileContent(ctx, storageId, bytes, mimeType)
  }
  throw new Error(`Unsupported Mime Type: ${mimeType}`)
  
}

const extractImageText = async (url: string): Promise<string> => {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  })
  return result.text
}
const extractPdfText = async (
  url: string,
  mimeType: string,
  filename: string
): Promise<string> => {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [{ type: "file", data: new URL(url), mediaType: mimeType, filename}],
      },
    ],
  })
  return result.text
}

export const extractTextFileContent = async(
  ctx: {storage : StorageActionWriter},
  storageId : Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> =>{

  const arrayBuffer  = bytes || (await(await ctx.storage.get(storageId))?.arrayBuffer());

  if(!arrayBuffer){
    throw new Error("Failed to get file.")
  }
  const text = new TextDecoder().decode(arrayBuffer);

  if(mimeType.toLowerCase() !== "text/plain"){
    const result = await generateText({
    model: AI_MODELS.html,
    system: SYSTEM_PROMPTS.html,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text},
          {
            type: "text",
            text: "Extract the test and prrint it in markdown format without intrto and outro or without explainig that you will do so."
          }
        ],
      },
    ],
  })
  return result.text;
  }
  return text;
}