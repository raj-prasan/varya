import Image from "next/image"

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <Image alt="logo" height={60} width={130} src={"/logo-text.svg"} />
      </div>
    </div>
  )
}
