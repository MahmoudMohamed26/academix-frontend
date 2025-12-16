export type Lecture = {
  title: string
  content: string
  position: number
  duration: number
  video_url: string
}

export type LocalLecture = {
  id: string
  title: string
  url: string
}

export type ExistingLectureFormValues = Record<string, {
  title: string
  url: string
}>