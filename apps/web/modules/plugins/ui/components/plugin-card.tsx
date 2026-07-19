import { LucideIcon, PlugIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export interface Features {
  icon: LucideIcon
  label: string
  description: string
}
interface PluginCardProps {
  isDisabled?: boolean
  serviceName: string
  serviceImage: string
  features: Features[]
  onSubmit: () => void
}
export const PluginCard = ({
  isDisabled = false,
  serviceImage,
  serviceName,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-lg border bg-background p-8">
      <div className="mb-6 text-center">
        <p className="text-lg">Connect your {serviceName} Account</p>
      </div>
      <div className="mb-6">
        <div className="space-y-6">
          {features.map((feature) => {
            return (
              <div className="flex items-center gap-3" key={feature.label}>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <feature.icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Button
        className="w-full"
        disabled={isDisabled}
        onClick={onSubmit}
        size="lg"
      >
        <PlugIcon />
        Connect
      </Button>
    </div>
  )
}
