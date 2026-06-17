"use client"
import {useMutation, useQuery, } from "convex/react"
import {api} from "@workspace/backend/_generated/api"
import { Button } from "@workspace/ui/components/button"
export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  return (
    <div className="flex flex-col min-h-svh p-6">
      <div>apps/web</div>
      <div>
        {JSON.stringify(users)}
        </div>
        <Button onClick={()=> addUser()}>Add</Button>
    </div>
  )
}
