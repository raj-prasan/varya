"use client"

import Image from "next/image"
import {
  BotIcon,
  CopyIcon,
  PhoneIcon,
  SettingsIcon,
  UnplugIcon,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { useVapiAssistants, useVapiPhoneNumbers } from "../../use-vapi-data"
import Link from "next/link"
import { toast } from "sonner"

const TableRowsSkeleton = ({ columns }: { columns: number }) => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full max-w-40" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

interface EmptyTableRowProps {
  columns: number
  message: string
}

const EmptyTableRow = ({ columns, message }: EmptyTableRowProps) => {
  return (
    <TableRow>
      <TableCell
        className="h-24 text-center text-muted-foreground"
        colSpan={columns}
      >
        {message}
      </TableCell>
    </TableRow>
  )
}

const VapiAssistantsTable = () => {
  const { data: assistants, isLoading, error } = useVapiAssistants()

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assistant</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>First message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRowsSkeleton columns={3} />
          ) : error ? (
            <EmptyTableRow columns={3} message="Failed to load assistants." />
          ) : assistants.length === 0 ? (
            <EmptyTableRow columns={3} message="No assistants found." />
          ) : (
            assistants.map((assistant) => (
              <TableRow key={assistant.id}>
                <TableCell className="font-medium">
                  {assistant.name || "Unnamed assistant"}
                </TableCell>
                <TableCell>
                  {assistant.model?.model ? (
                    <Badge variant="secondary">{assistant.model.model}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground">
                  {assistant.firstMessage || "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const VapiPhoneNumbersTable = () => {
  const { data: phoneNumbers, isLoading, error } = useVapiPhoneNumbers()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Text copied successfully")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRowsSkeleton columns={3} />
          ) : error ? (
            <EmptyTableRow
              columns={3}
              message="Failed to load phone numbers."
            />
          ) : phoneNumbers.length === 0 ? (
            <EmptyTableRow columns={3} message="No phone numbers found." />
          ) : (
            phoneNumbers.map((phoneNumber) => (
              <TableRow key={phoneNumber.id}>
                <TableCell className="font-medium">
                  {"number" in phoneNumber && phoneNumber.number
                    ? phoneNumber.number
                    : "—"}
                
                    <Button
                    variant={"transparent"}
                      size="xs"
                      onClick={() => copyToClipboard(phoneNumber.number || "")}
                    >
                      <CopyIcon />
                    </Button>
          
                </TableCell>
                <TableCell>{phoneNumber.name || "Unnamed"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      phoneNumber.status === "active" ? "default" : "secondary"
                    }
                  >
                    {phoneNumber.status || "unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

interface VapiConnectedViewProps {
  onDisconnect?: () => void
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex items-center justify-between rounded-lg border bg-background p-6">
        <div className="flex items-center gap-4">
          <Image alt="Vapi logo" height={40} src="/vapi.jpg" width={40} />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Vapi</p>
              <Badge variant="secondary">
                <span className="mr-1 size-1.5 rounded-full bg-emerald-500" />
                Connected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your Vapi account is linked and ready for voice calls.
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              <UnplugIcon />
              Disconnect
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect Vapi?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the Vapi plugin and disconnect your account.
                Voice calls will stop working until you reconnect.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDisconnect}>
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-md border bg-muted">
                <SettingsIcon className="size-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  Set up voice calls for your chat wiget
                </CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href={"/customization"}>
                <SettingsIcon />
                Configure
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="assistants">
        <TabsList className="gap-5">
          <TabsTrigger value="assistants" className="p-3.5">
            <BotIcon className="size-4" />
            Assistants
          </TabsTrigger>
          <TabsTrigger value="phone-numbers" className="p-3.5">
            <PhoneIcon className="size-4" />
            Phone numbers
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="assistants">
          <VapiAssistantsTable />
        </TabsContent>
        <TabsContent className="mt-4" value="phone-numbers">
          <VapiPhoneNumbersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
