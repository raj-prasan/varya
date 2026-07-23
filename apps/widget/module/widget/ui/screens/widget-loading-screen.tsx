"use client"
import { useAtomValue, useSetAtom } from "jotai"
import { LoaderIcon } from "lucide-react"
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  vapiSecretsAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms"
import WidgetHeader from "../components/widget-header"
import { useEffect, useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"

type InitStep = "org" | "session" | "settings" | "vapi" | "done"

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null
}) => {
  const [step, setStep] = useState<InitStep>("org")
  const [sessionValid, setSessionValid] = useState(false)
  const setScreen = useSetAtom(screenAtom)
  const setLoadingMessage = useSetAtom(loadingMessageAtom)
  const loadingMessage = useAtomValue(loadingMessageAtom)
  const setErrorMessage = useSetAtom(errorMessageAtom)
  const setOrganization = useSetAtom(organizationIdAtom)
  const setWidgetSettings = useSetAtom(widgetSettingsAtom)
  const setVapiSecrets = useSetAtom(vapiSecretsAtom)

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  )

  //Step 1 - Validate Organization
  const validateOrganization = useAction(api.public.organizations.validate)
  useEffect(() => {
    if (step != "org") {
      return
    }
    setLoadingMessage("Finding Organization ID...")

    if (!organizationId) {
      setErrorMessage("Organization required.")
      setScreen("error")
      return
    }

    setLoadingMessage("Validating Organization...")

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganization(organizationId)
          setStep("session")
        } else {
          setErrorMessage(result.reason || "invalid configuration")
          setScreen("error")
        }
      })
      .catch((error) => {
        setErrorMessage("Unable to verify organization")
        setScreen("error")
      })
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganization,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ])

  const validateContactSession = useMutation(api.public.contactSession.validate)

  useEffect(() => {
    if (step !== "session") {
      return
    }

    setLoadingMessage("Finding Contact Session ID...")

    if (!contactSessionId) {
      setSessionValid(false)
      setStep("settings")
      return
    }

    setLoadingMessage("Validating Contact Session...")

    validateContactSession({
      contactSessionId: contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid)
        setStep("settings")
      })
      .catch((error) => {
        setSessionValid(false)
        setStep("settings")
      })
  }, [
    step,
    contactSessionId,
    validateContactSession,
    setLoadingMessage,
    setStep,
    setSessionValid,
  ])

  //Step 3 : Load Widget Settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId,
        }
      : "skip"
  )

  useEffect(() => {
    if (step !== "settings") {
      return
    }
    setLoadingMessage("Loading widget ssettings...")

    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings)
      setStep("vapi")
    }
  }, [step, widgetSettings, setWidgetSettings, setLoadingMessage, setStep])

  //Step 4 : Load Public Vapi API Key
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets)

  useEffect(() => {
    if (step !== "vapi") {
      return
    }
    if (!organizationId) {
      setErrorMessage("Organization ID is required")
      setScreen("error")
      return
    }
    setLoadingMessage("Loading Voice Features...")

    getVapiSecrets({
      organizationId,
    })
      .then((secrets) => {
        setVapiSecrets(secrets)
        setStep("done")
      })
      .catch(() => {
        setVapiSecrets(null)
        setStep("done")
      }).finally
  }, [
    step,
    organizationId,
    getVapiSecrets,
    setVapiSecrets,
    setLoadingMessage,
    setStep,
  ])

  useEffect(() => {
    if (step != "done") {
      return
    }
    const hasValidSession = contactSessionId && sessionValid
    setScreen(hasValidSession ? "selection" : "auth")
  }, [step, contactSessionId, sessionValid, setScreen, setStep])

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-2 px-2 py-6">
          <p className="text-3xl font-semibold">Hi there! 👋</p>
          <p className="text-lg font-semibold opacity-90">
            Let's get you started
          </p>
        </div>
      </WidgetHeader>
      <div className="test-muted-foreground flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  )
}
