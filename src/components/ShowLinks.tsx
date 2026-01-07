import { ShowLinks } from "@/lib/types/user"
import {
  Facebook,
  Github,
  Instagram,
  Link as LinkIcon,
  Linkedin,
} from "lucide-react"
import Link from "next/link"

type ShowLinksProps = {
  links: ShowLinks
  size?: number
}

export default function ShowLinksComponent({links, size}: ShowLinksProps) {
  return (
    <ul className="flex gap-2 mt-2 text-[#666]">
      {links.personalSite && (
        <li className="relative group">
          <span className="absolute py-1 px-3 bg-[#333] text-white -top-5">
            Personal site
          </span>
          <Link aria-label="Personal website" href={`${links.personalSite}`}>
            <LinkIcon size={size ? size : 16} />
          </Link>
        </li>
      )}
      {links.github && (
        <li className="relative group">
          <span className="absolute left-1/2 before:hidden hidden group-hover:block group-hover:before:block -translate-x-1/2 py-1 px-3 bg-[#333] text-white -top-8 text-[10px] rounded-sm before:absolute before:w-0 before:h-0 before:border-7 before:border-t-[#333] before:top-[23px] before:left-1/2 before:-translate-x-1/2 before:border-b-transparent before:border-l-transparent before:border-r-transparent w-fit whitespace-nowrap">
            github
          </span>
          <Link aria-label="Github" href={`${links.github}`}>
            <Github size={size ? size : 16} />
          </Link>
        </li>
      )}
      {links.linkedin && (
        <li className="relative group">
          <span className="absolute left-1/2 before:hidden hidden group-hover:block group-hover:before:block -translate-x-1/2 py-1 px-3 bg-[#333] text-white -top-8 text-[10px] rounded-sm before:absolute before:w-0 before:h-0 before:border-7 before:border-t-[#333] before:top-[23px] before:left-1/2 before:-translate-x-1/2 before:border-b-transparent before:border-l-transparent before:border-r-transparent w-fit whitespace-nowrap">
            linkedin
          </span>
          <Link aria-label="Linkedin" href={`${links.linkedin}`}>
            <Linkedin size={size ? size : 16} />
          </Link>
        </li>
      )}
      {links.facebook && (
        <li className="relative group">
          <span className="absolute left-1/2 before:hidden hidden group-hover:block group-hover:before:block -translate-x-1/2 py-1 px-3 bg-[#333] text-white -top-8 text-[10px] rounded-sm before:absolute before:w-0 before:h-0 before:border-7 before:border-t-[#333] before:top-[23px] before:left-1/2 before:-translate-x-1/2 before:border-b-transparent before:border-l-transparent before:border-r-transparent w-fit whitespace-nowrap">
            facebook
          </span>
          <Link aria-label="Facebook" href={`${links.facebook}`}>
            <Facebook size={size ? size : 16} />
          </Link>
        </li>
      )}
      {links.instagram && (
        <li className="relative group">
          <span className="absolute left-1/2 before:hidden hidden group-hover:block group-hover:before:block -translate-x-1/2 py-1 px-3 bg-[#333] text-white -top-8 text-[10px] rounded-sm before:absolute before:w-0 before:h-0 before:border-7 before:border-t-[#333] before:top-[23px] before:left-1/2 before:-translate-x-1/2 before:border-b-transparent before:border-l-transparent before:border-r-transparent w-fit whitespace-nowrap">
            instagram
          </span>
          <Link aria-label="Instagram" href={`${links.instagram}`}>
            <Instagram size={size ? size : 16} />
          </Link>
        </li>
      )}
    </ul>
  )
}
