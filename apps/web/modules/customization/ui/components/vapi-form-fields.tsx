"use client"

import { Controller, type UseFormReturn } from "react-hook-form"
import { BotIcon, MicIcon, PhoneIcon } from "lucide-react"

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
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/use-vapi-data"
import type { WidgetSettingsFormValues } from "../views/customization-view"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"

interface VapiFormFieldsProps {
  form: UseFormReturn<WidgetSettingsFormValues>
  disabled?: boolean
}

export const VapiFormFields = ({ form, disabled }: VapiFormFieldsProps) => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne)
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants()
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers()

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-md">
      {/* Accent header strip */}
      <CardHeader className="border-b bg-linear-to-r from-primary/10 via-primary/5 to-transparent py-5 [.border-b]:pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background shadow-sm">
            <BotIcon className="size-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <CardTitle className="text-base">
              Voice Assistant Settings
            </CardTitle>
            <CardDescription>
              The Vapi assistant and phone number used by the widget
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <FieldGroup>
          {widgetSettings && (
            <Field>
              <FieldLabel asChild>
                <Label className="gap-2" htmlFor="assistantId">
                  <MicIcon className="size-3.5 text-primary" />
                  Voice Assistant
                </Label>
              </FieldLabel>
              <Controller
                control={form.control}
                name="vapiSettings.assistantId"
                render={({ field }) => (
                  <Select
                    disabled={disabled || assistantsLoading}
                    key={form.getValues("vapiSettings.assistantId")}
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className="w-full max-w-xs rounded-xl bg-muted/30"
                      id="assistantId"
                    >
                      <SelectValue
                        placeholder={
                          assistantsLoading
                            ? "Loading assistants..."
                            : "Select an assistant"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {assistants.map((assistant) => (
                        <SelectItem key={assistant.id} value={assistant.id}>
                          {`${assistant.name} - ${assistant.model?.model}` ||
                            "Unnamed Assistant"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                The Vapi assistant used for web voice calls
              </FieldDescription>
            </Field>
          )}

          {widgetSettings && (
            <Field>
              <FieldLabel asChild>
                <Label className="gap-2" htmlFor="phoneNumber">
                  <PhoneIcon className="size-3.5 text-primary" />
                  Display Phone Number
                </Label>
              </FieldLabel>
              <Controller
                control={form.control}
                name="vapiSettings.phoneNumber"
                render={({ field }) => (
                  <Select
                    disabled={disabled || phoneNumbersLoading}
                    key={form.getValues("vapiSettings.phoneNumber")}
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className="w-full max-w-xs rounded-xl bg-muted/30"
                      id="phoneNumber"
                    >
                      <SelectValue
                        placeholder={
                          phoneNumbersLoading
                            ? "Loading phone numbers..."
                            : "Select a phone number"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {phoneNumbers.map((phoneNumber) => (
                        <SelectItem
                          key={phoneNumber.id}
                          value={phoneNumber.number || phoneNumber.id}
                        >
                          <PhoneIcon className="size-3.5" />
                          {`${phoneNumber.number} - ${phoneNumber.name}` ||
                            "Unknown Number"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                The phone number displayed in the widget for customers to call
              </FieldDescription>
            </Field>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
