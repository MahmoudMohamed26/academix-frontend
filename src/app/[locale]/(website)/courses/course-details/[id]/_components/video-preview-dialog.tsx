import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { toYoutubeEmbed } from "@/helpers/to-youtube-embed"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
interface VideoPreviewDialog {
  open: boolean
  setOpen: (open: boolean) => void
  video: string
}

export default function VideoPreviewDialog({
  open,
  setOpen,
  video,
}: VideoPreviewDialog) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="md:h-[450px] h-[210px] sm:h-[350px] p-0! sm:p-6! min-w-[calc(100%-2rem)] border-none md:min-w-[750px]">
        <VisuallyHidden>
          <DialogTitle>Course video preview</DialogTitle>
          <DialogDescription>Course video preview</DialogDescription>
        </VisuallyHidden>
        <iframe
          className="w-full h-full"
          src={toYoutubeEmbed(video)}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  )
}
