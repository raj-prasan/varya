"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { usePaginatedQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { PublicFile } from "@workspace/backend/private/files"
import { Button } from "@workspace/ui/components/button"
import {
  FilesIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { UploadDialog } from "../components/upload-dialog"
import { DeleteFileDialog } from "../components/delete-file-dialog"
import { useState } from "react"
export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    {
      initialNumItems: 10,
    }
  )

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  })
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null)

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file)
    setDeleteDialogOpen(true)
  }

  const handleFileDeleted = () => {
    setSelectedFile(null)
  }
  return (
    <>
      <UploadDialog
      onOpenChange={setUploadDialogOpen}
      open={uploadDialogOpen}
      />
      <DeleteFileDialog
      file={selectedFile}
      onDeleted={handleFileDeleted}
      onOpenChange={setDeleteDialogOpen}
      open={deleteDialogOpen}
      />
      <div className="flex h-full min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Upload and manage documents for your AI Assistant
            </p>
          </div>

          <div className="mt-8 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-6 py-4">
              <Button onClick={()=> setUploadDialogOpen(true)}>
                <PlusIcon />
                Add New
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                  <TableHead className="px-6 py-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          Loading Files...
                        </TableCell>
                      </TableRow>
                    )
                  }
                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          No Files Found
                        </TableCell>
                      </TableRow>
                    )
                  }

                  return files.results.map((file) => (
                    <TableRow className="hover:bg-muted/50" key={file.id}>
                      <TableCell className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <FilesIcon />
                          {file.name}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 font-medium">
                        <Badge className="uppercase" variant={"outline"}>
                          <FilesIcon />
                          {file.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                        <Badge className="uppercase" variant={"outline"}>
                          <FilesIcon />
                          {file.size}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              size={"sm"}
                              variant={"ghost"}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(file)}
                            >
                              <TrashIcon className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t">
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
