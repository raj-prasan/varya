"use client"

import { useState } from "react"
import Image from "next/image"
import { useMutation, useQuery } from "convex/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  AudioLinesIcon,
  GlobeIcon,
  KeyRoundIcon,
  LockIcon,
  LucideIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlugIcon,
  ShieldCheckIcon,
  WorkflowIcon,
} from "lucide-react"

import { api } from "@workspace/backend/_generated/api"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { PluginCard, type Features } from "../components/plugin-card"


const VAPI_LOGO = "/vapi.jpg"
const APP_LOGO = "/logo.svg"

const vapiFeatures: Features[] = [
  {
    icon: GlobeIcon,
    label: "Web voice calls",
    description:
      "Let customers talk to your AI assistant directly from the widget — no phone required.",
  },
  {
    icon: PhoneIcon,
    label: "Dedicated numbers",
    description:
      "Provision real phone numbers so customers can reach your assistant the classic way.",
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound campaigns",
    description:
      "Trigger automated follow-ups, reminders, and proactive outreach at scale.",
  },
  {
    icon: WorkflowIcon,
    label: "Custom workflows",
    description:
      "Design multi-step conversation flows that hand off to humans when needed.",
  },
]

const connectFormSchema = z.object({
  publicApiKey: z.string().min(1, { message: "Public API Key is required" }),
  privateApiKey: z.string().min(1, { message: "Private API Key is required" }),
})

type ConnectFormValues = z.infer<typeof connectFormSchema>



interface ApiKeyFieldProps {
  id: keyof ConnectFormValues
  label: string
  placeholder: string
  icon: LucideIcon
  form: ReturnType<typeof useForm<ConnectFormValues>>
}

const ApiKeyField = ({
  id,
  label,
  placeholder,
  icon: Icon,
  form,
}: ApiKeyFieldProps) => {
  const error = form.formState.errors[id]

  return (
    <Field data-invalid={!!error}>
      <FieldLabel asChild>
        <Label htmlFor={id}>{label}</Label>
      </FieldLabel>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          id={id}
          placeholder={placeholder}
          type="password"
          {...form.register(id)}
        />
      </div>
      <FieldError errors={[error]} />
    </Field>
  )
}

interface VapiConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const VapiConnectDialog = ({ open, onOpenChange }: VapiConnectDialogProps) => {
  const upsertSecret = useMutation(api.private.secrets.upsert)

  const form = useForm<ConnectFormValues>({
    resolver: zodResolver(connectFormSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  })

  const onSubmit = async (values: ConnectFormValues) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      })
      onOpenChange(false)
      form.reset()
      toast.success("API keys saved successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.")
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        {/* Decorative header */}
        <div className="relative border-b bg-muted/50 px-6 pt-8 pb-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/12%),transparent_70%)]"
          />
          <div className="relative flex flex-col items-center text-center">
            <Image alt="Vapi logo" height={36} src={VAPI_LOGO} width={36} />
            <DialogHeader className="mt-4">
              <DialogTitle className="text-center text-xl tracking-tight">
                Connect Vapi
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your Vapi API keys to enable voice calls.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            <FieldGroup className="gap-5">
              <ApiKeyField
                form={form}
                icon={KeyRoundIcon}
                id="publicApiKey"
                label="Public API Key"
                placeholder="Your public API key"
              />
              <ApiKeyField
                form={form}
                icon={LockIcon}
                id="privateApiKey"
                label="Private API Key"
                placeholder="Your private API key"
              />
            </FieldGroup>

            <div className="mt-5 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-3.5 shrink-0 text-primary" />
              Your keys are encrypted and never shared. Find them in your Vapi
              dashboard under Settings.
            </div>
          </div>

          <DialogFooter className="border-t bg-muted/30 px-6 py-4">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={form.formState.isSubmitting} type="submit">
              <PlugIcon />
              Connect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const VapiHero = () => {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/18%),transparent_65%)]"
      />
      <div className="relative flex flex-col items-center px-6 pt-14 pb-10 text-center">
        {/* Connection visual */}
        <div className="flex items-center gap-4">
          <Image alt="App logo" height={40} src={APP_LOGO} width={40} />
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary/40" />
            <span className="size-1.5 rounded-full bg-primary/60" />
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-primary/60" />
            <span className="size-1.5 rounded-full bg-primary/40" />
          </div>
          <Image alt="Vapi logo" height={40} src={VAPI_LOGO} width={40} />
        </div>

        <Badge className="mt-8" variant="secondary">
          <AudioLinesIcon className="size-3.5" />
          Voice Plugin
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Give your assistant a voice with Vapi
        </h1>
        <p className="mt-3 max-w-md text-sm text-balance text-muted-foreground md:max-w-lg">
          Connect Vapi to handle customer conversations over the phone and the
          web powered by the same AI assistant you already trained.
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" />
          API keys are encrypted and never shared
        </div>
      </div>
    </div>
  )
}


export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" })
  const [connectOpen, setConnectOpen] = useState(false)

  const isLoading = vapiPlugin === undefined
  const isConnected = !!vapiPlugin

  return (
    <div className="h-full overflow-y-auto bg-muted p-8 pt-0">
      <VapiConnectDialog onOpenChange={setConnectOpen} open={connectOpen} />

      <div className="mx-auto w-full max-w-screen-md bg-muted">
        {!isConnected && <VapiHero />}

        <div className="mt-6">
          {isConnected ? (
            <p>Connected!!!</p>
          ) : (
            <PluginCard
              features={vapiFeatures}
              isDisabled={isLoading}
              onSubmit={() => setConnectOpen(true)}
              serviceImage={VAPI_LOGO}
              serviceName="Vapi"
            />
          )}
        </div>
      </div>
    </div>
  )
}
