import { atom } from "jotai";
import { WidgetScreen } from "../types";
import { atomWithStorage } from "jotai/utils";
import { CONTACT_SESSION_KEY } from "../constants";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { atomFamily } from "jotai-family";
import { string } from "zod";


export const screenAtom = atom<WidgetScreen>("loading");

export const errorMessageAtom = atom<string | null>(null);

export const loadingMessageAtom = atom <string| null>(null);

export const organizationIdAtom = atom<string | null>(null);

export const contactSessionIdAtomFamily = atomFamily((organizationId : string)=> atomWithStorage<Id<"contactSessions">| null>(`${CONTACT_SESSION_KEY}_${organizationId}`, null))
export const conversationIdAtom = atom<Id<"conversations">| null>(null)

export const widgetSettingsAtom = atom<Doc<"widgetSettings"> | null>(null)

export const vapiSecretsAtom = atom<{publicApiKey : string} | null>(null)
export const hasVapiSecretsAtom = atom((get)=> get(vapiSecretsAtom) !== null)