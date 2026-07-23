"use client"

import {
  ChevronRightIcon,
  EyeIcon,
  MessageSquareIcon,
  MicIcon,
  PhoneIcon,
  RotateCcwIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Spinner } from "@workspace/ui/components/spinner"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useEffect } from "react"

import { VapiFormFields } from "../components/vapi-form-fields"

const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greeting message is required."),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
})

export type WidgetSettingsFormValues = z.infer<typeof widgetSettingsSchema>

const GREET_MESSAGE_MAX = 200

const SUGGESTION_FIELDS = [
  {
    name: "defaultSuggestions.suggestion1",
    id: "suggestion1",
    placeholder: "e.g., How do I get started?",
  },
  {
    name: "defaultSuggestions.suggestion2",
    id: "suggestion2",
    placeholder: "e.g., What are your pricing plans?",
  },
  {
    name: "defaultSuggestions.suggestion3",
    id: "suggestion3",
    placeholder: "e.g., I need help with my account",
  },
] as const

const CustomizationViewSkeleton = () => (
  <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
    <div className="space-y-6">
      {[0, 1].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Skeleton className="hidden h-120 rounded-xl lg:block" />
  </div>
)

const WidgetPreview = ({
  greetMessage,
  suggestions,
  phoneNumber,
  hasVoice,
}: {
  greetMessage: string
  suggestions: string[]
  phoneNumber?: string
  hasVoice: boolean
}) => (
  <div className="overflow-hidden rounded-2xl border bg-background shadow-xl">
    {/* Widget header */}
    <div className="bg-linear-to-br from-primary to-primary/70 p-5 text-primary-foreground">
      <p className="text-xl font-semibold">Hi there! 👋</p>
      <p className="text-sm opacity-90">Let&apos;s get you started</p>
    </div>

    {/* Chat body */}
    <div className="flex min-h-65 flex-col gap-3 bg-muted/40 p-4">
      <div className="flex max-w-[85%] items-start gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="size-3.5 text-primary" />
        </div>
        <div className="rounded-2xl rounded-tl-sm border bg-background px-3.5 py-2.5 text-sm shadow-sm">
          {greetMessage || (
            <span className="text-muted-foreground italic">
              Your greeting message...
            </span>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-auto flex flex-col items-end gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              className="flex items-center gap-1 rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs text-primary shadow-sm transition-colors hover:bg-primary/5"
              key={suggestion}
              type="button"
            >
              {suggestion}
              <ChevronRightIcon className="size-3" />
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Voice / phone rows */}
    {(hasVoice || phoneNumber) && (
      <div className="space-y-2 border-t bg-background p-3">
        {hasVoice && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs">
            <MicIcon className="size-3.5 text-primary" />
            <span className="font-medium">Voice call</span>
            <span className="ml-auto text-muted-foreground">Available</span>
          </div>
        )}
        {phoneNumber && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs">
            <PhoneIcon className="size-3.5 text-primary" />
            <span className="font-medium">{phoneNumber}</span>
            <span className="ml-auto text-muted-foreground">Call us</span>
          </div>
        )}
      </div>
    )}

    {/* Composer mock */}
    <div className="flex items-center gap-2 border-t bg-background p-3">
      <div className="flex-1 rounded-full border bg-muted/40 px-3.5 py-2 text-xs text-muted-foreground">
        Type a message...
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <SendIcon className="size-3.5" />
      </div>
    </div>
  </div>
)

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne)
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert)
  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  })
  const form = useForm<WidgetSettingsFormValues>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: "Hello, how can I help you today?",
      defaultSuggestions: {
        suggestion1: "",
        suggestion2: "",
        suggestion3: "",
      },
      vapiSettings: {
        assistantId: "",
        phoneNumber: "",
      },
    },
  })

  useEffect(() => {
    if (!widgetSettings) return

    form.reset({
      greetMessage: widgetSettings.greetMessage,
      defaultSuggestions: widgetSettings.defaultSuggestions,
      vapiSettings: widgetSettings.vapiSettings,
    })
  }, [widgetSettings, form])

  const isLoading = widgetSettings === undefined || vapiPlugin === undefined

  const greetMessage = form.watch("greetMessage")
  const watchedSuggestions = form.watch("defaultSuggestions")
  const watchedVapi = form.watch("vapiSettings")
  const previewSuggestions = [
    watchedSuggestions?.suggestion1,
    watchedSuggestions?.suggestion2,
    watchedSuggestions?.suggestion3,
  ].filter((s): s is string => Boolean(s?.trim()))

  const greetMessageError = form.formState.errors.greetMessage

  const onSubmit = async (values: WidgetSettingsFormValues) => {
    try {
      await upsertWidgetSettings(values)
      form.reset(values)
      toast.success("Widget settings saved")
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  const { isDirty, isSubmitting } = form.formState

  return (
    <div className="flex h-full min-h-screen flex-col overflow-y-auto bg-muted">
      <div className="mx-auto w-full max-w-6xl p-8 pb-28">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Widget Customization
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Customize how your chat widget looks and behaves for your
              customers
            </p>
          </div>
          {vapiPlugin && (
            <Badge className="gap-1.5" variant="secondary">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Vapi connected
            </Badge>
          )}
        </div>

        {isLoading ? (
          <CustomizationViewSkeleton />
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
              {/* Settings column */}
              <div className="space-y-6">
                <Card className="gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-md">
                  {/* Accent header strip */}
                  <CardHeader className="border-b bg-linear-to-r from-primary/10 via-primary/5 to-transparent py-5 [.border-b]:pb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background shadow-sm">
                        <MessageSquareIcon className="size-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <CardTitle className="text-base">
                          General Chat Settings
                        </CardTitle>
                        <CardDescription>
                          The greeting and quick replies your customers see
                          first
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-8 p-6">
                    <FieldGroup>
                      <Field data-invalid={!!greetMessageError}>
                        <div className="flex items-center justify-between">
                          <FieldLabel asChild>
                            <Label
                              className="gap-2"
                              htmlFor="greetMessage"
                            >
                              <WandSparklesIcon className="size-3.5 text-primary" />
                              Greeting Message
                            </Label>
                          </FieldLabel>
                          <span
                            className={cn(
                              "text-xs tabular-nums text-muted-foreground",
                              (greetMessage?.length ?? 0) > GREET_MESSAGE_MAX &&
                                "text-destructive"
                            )}
                          >
                            {greetMessage?.length ?? 0}/{GREET_MESSAGE_MAX}
                          </span>
                        </div>
                        <Textarea
                          className="resize-none rounded-xl bg-muted/30 transition-colors focus-visible:bg-background"
                          id="greetMessage"
                          maxLength={GREET_MESSAGE_MAX}
                          placeholder="Hello, how can I help you today?"
                          rows={3}
                          {...form.register("greetMessage")}
                        />
                        {greetMessageError ? (
                          <p className="text-sm text-destructive">
                            {greetMessageError.message}
                          </p>
                        ) : (
                          <FieldDescription>
                            The first message customers see when they open the
                            chat widget
                          </FieldDescription>
                        )}
                      </Field>
                    </FieldGroup>

                    <div className="rounded-xl border bg-muted/30 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold">
                            Default Suggestions
                          </h3>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            Quick replies to help customers get started
                          </p>
                        </div>
                        <Badge
                          className="tabular-nums"
                          variant={
                            previewSuggestions.length > 0
                              ? "default"
                              : "outline"
                          }
                        >
                          {previewSuggestions.length}/3
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-3">
                        {SUGGESTION_FIELDS.map((suggestion, index) => (
                          <div
                            className="group flex items-center gap-3"
                            key={suggestion.id}
                          >
                            <div
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                                previewSuggestions.length > index
                                  ? "border-primary/30 bg-primary/10 text-primary"
                                  : "bg-background text-muted-foreground"
                              )}
                            >
                              {index + 1}
                            </div>
                            <Input
                              aria-label={`Suggestion ${index + 1}`}
                              className="rounded-full bg-background px-4 shadow-none transition-shadow focus-visible:shadow-sm"
                              id={suggestion.id}
                              placeholder={suggestion.placeholder}
                              {...form.register(suggestion.name)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {vapiPlugin && (
                  <VapiFormFields disabled={isSubmitting} form={form} />
                )}
              </div>

              {/* Live preview column */}
              <div className="sticky top-8 hidden lg:block">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <EyeIcon className="size-4" />
                  Live Preview
                </div>
                <WidgetPreview
                  greetMessage={greetMessage}
                  hasVoice={Boolean(watchedVapi?.assistantId)}
                  phoneNumber={watchedVapi?.phoneNumber || undefined}
                  suggestions={previewSuggestions}
                />
              </div>
            </div>

            {/* Sticky save bar */}
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 backdrop-blur transition-transform duration-300",
                isDirty ? "translate-y-0" : "translate-y-full"
              )}
            >
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-8 py-3">
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => form.reset()}
                    type="button"
                    variant="ghost"
                  >
                    <RotateCcwIcon />
                    Discard
                  </Button>
                  <Button disabled={isSubmitting || !isDirty} type="submit">
                    {isSubmitting ? <Spinner /> : <SaveIcon />}
                    {isSubmitting ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
