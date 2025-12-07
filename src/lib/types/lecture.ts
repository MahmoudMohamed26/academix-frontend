export type Lecture = {
  id: string
  title: string
  video: {
    url: string
  }
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