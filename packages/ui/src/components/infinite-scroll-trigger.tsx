import { forwardRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  loadMoreText?: string
  noMoreText?: string
  className?: string
}

export const InfiniteScrollTrigger = forwardRef<
  HTMLDivElement,
  InfiniteScrollTriggerProps
>(function InfiniteScrollTrigger(
  {
    canLoadMore,
    isLoadingMore,
    onLoadMore,
    loadMoreText = "Load More",
    noMoreText = "No more content",
    className,
  },
  ref
) {
  let text = loadMoreText
  if (isLoadingMore) {
    text = "Loading..."
  } else if (!canLoadMore) {
    text = noMoreText
  }

  return (
    <div className={cn("p-y-2 flex w-full justify-center", className)} ref={ref}>
      <Button disabled={!canLoadMore || isLoadingMore} onClick={onLoadMore} size={"sm"} variant={"ghost"}>
        {text}
      </Button>
    </div>
  )
})
