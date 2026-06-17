"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

function Content() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  return <div>
    <div>Authenticated content: {JSON.stringify(users)}
      <Button onClick={()=> addUser()}>Add</Button>
    </div>;
    </div>
}
