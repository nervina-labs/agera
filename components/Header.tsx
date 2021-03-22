import Link from 'next/link'
import Image from 'next/image'
import { EXPLORER_TITLE, IMG_URL } from 'utils'

const Header = () => (
  <header className="fixed t-0 l-0 w-full h-14 bg-black flex z-50">
    <div className="main-container flex-row items-center">
      <Image src={`${IMG_URL}nervina-logo.svg`} loading="lazy" width="31" height="20" layout="fixed" alt="logo" />
      <Link href="/">
        <a title={EXPLORER_TITLE} className="text-xl leading-default text-white font-bold ml-2">
          {EXPLORER_TITLE}
        </a>
      </Link>
    </div>
  </header>
)
export default Header
