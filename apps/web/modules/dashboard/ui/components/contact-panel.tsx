"use client"
import Bowser from "bowser"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils"
import { api } from "@workspace/backend/_generated/api"
import { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { Badge } from "@workspace/ui/components/badge"
import { useQuery } from "convex/react"
import {
  ClockIcon,
  GlobeIcon,
  MailIcon,
  MonitorIcon,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo } from "react"

type InfoItem = {
  label : string,
  value : string | React.ReactNode,
  className? : string
};

type InfoSection = {
  id : string,
  icon : React.ComponentType<{className ? : string}>;
  title : string,
  items : InfoItem[]
}

const valueClassName = "text-sm font-medium text-foreground"

const formatValue = (value: string | number | boolean | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "Unknown"
  }

  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled"
  }

  return String(value)
}

export const ContactPanel = () => {
  const params = useParams()
  const conversationId = params.conversationId as Id<"conversations"> | null

  const contactSession = useQuery(
    api.private.contactSessions.getOneByConversationId,
    conversationId
      ? {
          conversationId,
        }
      : "skip"
  )

  const parseUserAgent = useMemo(()=>{
    return(userAgent?: string)=>{
      if(!userAgent){
        return {browser : "Unknown", os : "Unknown", device: "Unknown"}
      }
      const browser= Bowser.getParser(userAgent);
      const result = browser.getResult()

      return{
        browser: result.browser.name || "Unknown",
        browserVersion : result.browser.version || "Unknown",
        os : result.os.name || "Unknown",
        device: result.platform.type || "desktop",
        deviceVendor: result.platform.vendor || "",
        deviceModel: result.platform.model || "",
      }
    }
  },[])

  const userAgentInfo = useMemo(()=> parseUserAgent(contactSession?.metaData?.userAgent),[contactSession?.metaData?.userAgent, parseUserAgent])

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metaData?.timezone)
  }, [contactSession?.metaData?.timezone]);

  const accordianSection = useMemo<InfoSection[]>(()=>{
    if(!contactSession || !contactSession.metaData){
      return[]
    };

    const metaData = contactSession.metaData

    const createdAgo = formatDistanceToNow(new Date(contactSession._creationTime), {
      addSuffix: true,
    })

    const expiresAgo = formatDistanceToNow(new Date(contactSession.expiresAt), {
      addSuffix: true,
    })

    return[
      {
        id : "session-overview",
        icon : ClockIcon,
        title: "Session",
        items : [
          {
            label: "Name",
            value: contactSession.name,
          },
          {
            label: "Email",
            value: (
              <Link
                className="font-medium text-foreground underline-offset-4 hover:underline"
                href={`mailto:${contactSession.email}`}
              >
                {contactSession.email}
              </Link>
            ),
          },
          {
            label: "Created",
            value : createdAgo,
          },
          {
            label: "Expires",
            value: expiresAgo,
          },
          {
            label: "Location",
            value: countryInfo?.name || "Unknown",
          },
        ]
      },
      {
        id : "device-info",
        icon : MonitorIcon,
        title: "Device Information",
        items : [
          {
            label: "Browser",
            value : `${formatValue(userAgentInfo.browser)}${userAgentInfo.browserVersion ? ` ${userAgentInfo.browserVersion}` : ""}`
          },
          {
            label : "Operating System",
            value: formatValue(userAgentInfo.os),
          },
          {
            label: "Device Type",
            value: formatValue(userAgentInfo.device),
          },
          {
            label: "Vendor",
            value: formatValue(userAgentInfo.deviceVendor),
          },
          {
            label: "Model",
            value: formatValue(userAgentInfo.deviceModel),
          },
        ]
      },
      {
        id : "environment-info",
        icon : GlobeIcon,
        title: "Environment",
        items : [
          {
            label: "Language",
            value: formatValue(metaData.language || metaData.languages),
          },
          {
            label: "Platform",
            value: formatValue(metaData.platform),
          },
          {
            label: "Timezone",
            value: formatValue(metaData.timezone),
          },
          {
            label: "Timezone Offset",
            value: formatValue(metaData.timezoneOffset),
          },
          {
            label: "Screen Resolution",
            value: formatValue(metaData.screenResolution),
          },
          {
            label: "Viewport Size",
            value: formatValue(metaData.viewportSize),
          },
          {
            label: "Referrer",
            value: formatValue(metaData.referrer),
          },
          {
            label: "Current URL",
            value: formatValue(metaData.currentUrl),
          },
          {
            label: "Cookies",
            value: formatValue(metaData.cookieEnabled),
          },
        ]
      }
    ]
  },[contactSession, countryInfo?.name, userAgentInfo.browser, userAgentInfo.browserVersion, userAgentInfo.device, userAgentInfo.deviceModel, userAgentInfo.deviceVendor, userAgentInfo.os])

  if (contactSession === undefined || contactSession === null) {
    return null
  }
  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <div className="border-b px-4 py-4">
        <div className="flex items-start gap-3">
          <DicebearAvatar
            size={48}
            seed={contactSession._id}
            badgeImageeUrl={
              countryInfo?.code
                ? getCountryFlagUrl(countryInfo.code)
                : undefined
            }
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-base font-semibold">{contactSession.name}</h4>
              {countryInfo?.code && (
                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[11px] font-medium">
                  {countryInfo.name}
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">{contactSession.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(contactSession._creationTime), { addSuffix: true })} · Expires {formatDistanceToNow(new Date(contactSession.expiresAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button asChild className="mt-4 w-full gap-2" size={"lg"} >
          <Link href={`mailto:${contactSession.email}`}>
            <MailIcon className="size-4" />
            <span>Send Email</span>
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <Accordion type="multiple" className="gap-1">
          {accordianSection.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b border-border/60 last:border-b-0"
            >
              <AccordionTrigger className="rounded-none px-0 py-3 no-underline hover:no-underline">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <section.icon className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium tracking-tight text-foreground">{section.title}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-3">
                <div className="grid gap-0.5">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-4 py-2 ">
                      <div className="text-xs font-medium text-muted-foreground">
                        {item.label}
                      </div>
                      <div className={item.className ?? `${valueClassName} max-w-[70%] text-right wrap-break-word`}>
                        {item.value}
                      </div>
                      
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
