export interface Lecture {
  id: string
  type: "lecture"
  title: string
  content: string
  position: number
  duration: number
  video_url: string
  created: string
  updated: string
}

export type LocalLecture = {
  id: string
  title: string
  url: string
}

export interface LectureUrl {
  video_url: string
}

export type ExistingLectureFormValues = Record<string, {
  title: string
  url: string
}>