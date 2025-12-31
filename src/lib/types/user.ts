export type User = {
  id: string
  name: string
  phone: string
  dob: any
  email: string
  role: string
  avatar_url: string | null
  links: {
    personalSite: string
    facebook: string
    github: string
    linkedin: string
    instagram: string
  }
}

export interface UserActions {
  setName: (name: string) => void
  setPhone: (phone: string) => void
  setDob: (dob: string) => void
  setEmail: (data: string) => void
  setUser: (data: User) => void
}

export type UserStore = User & UserActions

export type ProfileFormValues = {
  name: string
  phone: string
  dob: any
}

export type ChangePasswordFormValues = {
  newpassword: string
  confirmnewpassword: string
}

export type Links = {
  links: {
    personalSite: string
    facebook: string
    github: string
    linkedin: string
    instagram: string
  }
}

export type ProfileAvatar = {
  avatar: string | null
}
