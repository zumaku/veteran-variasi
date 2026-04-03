import Link from 'next/link'
import Logo from './Logo'
import { FacebookIcon, InstagramIcon, LinkedInIcon, ThreadIcon, TikTokIcon, XIcon } from './icons'
import { prisma } from '@/lib/prisma'

const links = [
    {
        title: 'Catalog',
        href: '/catalog',
    },
    {
        title: 'Tentang Kami',
        href: '#tentang-kami',
    },
    {
        title: 'FAQ',
        href: '#faq',
    },
]

export default async function Footer() {
    return (
        <footer className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit flex items-center gap-2">
                    <Logo className="text-primary" size={32} />
                    <p className='text-2xl font-bold'>Veteran Variasi</p>
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X/Twitter"
                        className="text-muted-foreground hover:text-primary block">
                        <XIcon />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-muted-foreground hover:text-primary block">
                        <LinkedInIcon />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="text-muted-foreground hover:text-primary block">
                        <FacebookIcon />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Threads"
                        className="text-muted-foreground hover:text-primary block">
                        <ThreadIcon />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-muted-foreground hover:text-primary block">
                        <InstagramIcon />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        className="text-muted-foreground hover:text-primary block">
                        <TikTokIcon />
                    </Link>
                </div>
                <span className="text-muted-foreground block text-center text-sm">Copyright © {new Date().getFullYear()} Veteran Variasi, All rights reserved</span>
            </div>
        </footer>
    )
}