import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import WidgetHeader from "../components/widdget-header";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";


const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
})

const WidgetAuthScreen  = () => {
    const organizationId = useAtomValue(organizationIdAtom);
    const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""))
    const setScreen = useSetAtom(screenAtom)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
            email:""
        }
    })
    const createContactSession = useMutation(api.public.contactSession.create);

    const onSubmit = async(values: z.infer<typeof formSchema>)=>{
        if(!organizationId){
            return;
        };
        const metaData: Doc<"contactSessions">["metaData"]  = {
            userAgent: navigator.userAgent,
            language: navigator.languages?.join(","),
            platform: navigator.platform,
            vendor: navigator.vendor,
            screenResolution: `${screen.width}x${screen.height}`,            
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,     
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            cookieEnabled: navigator.cookieEnabled,
            referrer: document.referrer|| "direct",
            currentUrl: window.location.href,

        };
        const contactSessionId = await createContactSession({
            ...values,
            organizationId,
            metaData
        })
        console.log(contactSessionId)
        setContactSessionId(contactSessionId)
        setScreen("selection")
    }
    return ( 
        <div className="flex flex-col flex-1">
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-2 px-2 py-6">
                    <p className="font-semibold text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="font-semibold text-lg opacity-90">
                        Let's get you started
                    </p>
                </div>
            </WidgetHeader>
            <form className="flex flex-1 flex-col gap-y-9 p-4  max-h-lg items-center" onSubmit={form.handleSubmit(onSubmit)}>
                <Field data-invalid={!!form.formState.errors.name}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input 
                        className="h-10 text-sm bg-background rounded-sm"
                        id="name" 
                        placeholder="John Doe" 
                        {...form.register("name")} 
                    />
                    <FieldError errors={[form.formState.errors.name]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input 
                        className="h-10 text-sm bg-background rounded-sm"
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        {...form.register("email")} 
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Button type="submit" className="w-full mt-2 cursor-pointer bg-accent-foreground rounded-md">
                    Continue
                </Button>
            </form>
        </div>
     );
}
 
export default WidgetAuthScreen;