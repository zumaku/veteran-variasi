import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="bg-primary text-primary-foreground font-bold font-montserrat px-3 py-1.5 rounded-md inline-block mb-4">
              Veteran Variasi
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mt-4 leading-relaxed">
              Solusi terbaik untuk perawatan dan perbaikan kendaraan Anda. Kami
              hadir dengan pelayanan prima dan fasilitas lengkap.
            </p>
          </div>
          <div>
            <h4 className="font-bold font-montserrat mb-4">Layanan</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Tune Up
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Ganti Oli
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Service Berkala
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Variasi & Audio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold font-montserrat mb-4">Perusahaan</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Veteran Variasi. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
