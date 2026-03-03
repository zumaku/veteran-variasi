import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  Box,
  LogIn,
  Tag,
  Headset,
  Award,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TopThreeProducts from "@/features/catalog/components/TopThreeProducts";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import FAQs from "@/features/faqs/components/FAQs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <section className="px-4 h-fit md:h-fit flex flex-col justify-between md:justify-center items-center w-full max-w-[100vw] overflow-x-hidden">
        <div className="flex flex-col items-center gap-4">
          <h1 className="pt-12 md:pt-20 text-center text-3xl sm:text-4xl lg:text-6xl font-bold font-montserrat uppercase leading-[1.2] md:leading-[1.1] tracking-tight text-foreground max-w-4xl">
            Aksesoris Modern Untuk <br className="hidden sm:block" /> Performa
            Berkendara
          </h1>

          <Button variant="dark" size="xl" className="mt-4 rounded-full px-8">
            <Box className="w-5 h-5" />
            Lihat Koleksi
          </Button>
        </div>

        <div className="md:w-full w-xl max-w-5xl mt-32 md:mt-8 md:mt-14 px-2 sm:px-0">
          <Image
            src="/hero_image.png"
            alt="Koleksi Aksesoris Mobil Premium"
            width={1000}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section id="tentang-kami" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-montserrat uppercase tracking-wide">
              Kami Siap Melayani. Jaminan Mobil Layak, Layanan Profesional
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 relative">
            {/* Left Side Reasons */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 w-full order-2 lg:order-1">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <MapPin className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Lokasi Strategis</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Berlokasi di area strategis untuk memudahkan Anda menjangkau
                  kami dengan cepat.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <Tag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Harga Terbaik</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Layanan premium kami disesuaikan dengan kebutuhan Anda dengan
                  penawaran harga terbaik.
                </p>
              </div>

              <div className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <Headset className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Dukungan Pelanggan</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Tim kami selalu siap membantu permasalahan dan memberikan
                  solusi terbaik untuk mobil Anda.
                </p>
              </div>
            </div>

            {/* Center Car Image */}
            <div className="flex-shrink-0 lg:w-96 relative order-1 lg:order-2">
              <Image
                src="/top-down-car.png"
                alt="Mobil Veteran Variasi"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Right Side Reasons */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 w-full order-3 lg:order-3">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <Clock className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Bebas Antre</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Pesan jadwal layanan secara online dan langsung dikerjakan
                  tanpa perlu menunggu antrean.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Merek Terverifikasi</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Beraneka ragam suku cadang dan produk terjamin keasliannya
                  dari merek ternama.
                </p>
              </div>

              <div className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
                <div className="inline-flex items-center justify-center bg-white dark:bg-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 rounded-2xl mb-4 text-primary">
                  <Wrench className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">Montir Ahli</h4>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Dikerjakan oleh teknisi ahli berpengalaman untuk memastikan
                  mobil Anda dalam kondisi optimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <TopThreeProducts />

      {/* 5. Location Section */}
      <section className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
                  Kunjungi Bengkel Kami
                </h2>
                <p className="text-secondary-foreground/70">
                  Datang dan konsultasikan masalah kendaraan Anda langsung
                  kepada tim ahli kami di lokasi.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">Alamat</h4>
                    <p className="text-sm text-secondary-foreground/70">
                      Jl. Veteran Selatan No.354, Mamajang Dalam, Kec. Mamajang,
                      Kota Makassar, Sulawesi Selatan 90132
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">
                      Jam Operasional
                    </h4>
                    <p className="text-sm text-secondary-foreground/70">
                      Senin - Sabtu: 09:00 - 18:00 WIB
                      <br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">Kontak</h4>
                    <p className="text-sm text-secondary-foreground/70">
                      (0411)0871660 / +62 812-3456-7890
                    </p>
                  </div>
                </div>
              </div>

              <Link href="https://wa.me/6281234567890" className="flex">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                  <WhatsappIcon className="w-6 h-6" />
                  Chat Whatsapp
                </Button>
              </Link>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] bg-secondary-foreground/5 rounded-2xl overflow-hidden border border-secondary-foreground/10 flex items-center justify-center">
              <iframe
                className="embed-map-frame w-full h-full"
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Veteran%20Variasi&t=&z=16&ie=UTF8&iwloc=B&output=embed"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 md:py-24" id="faq">
        <FAQs />
      </section>

      {/* 7. CTA Section */}
      <section className="bg-primary py-20 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6">
            Siap Merawat Mobil Kesayangan Anda?
          </h2>
          <p className="text-primary-foreground max-w-2xl mx-auto mb-8">
            Daftar sekarang untuk kemudahan pemesanan layanan, riwayat servis
            yang tercatat, serta berbagai promo menarik khusus member.
          </p>
          <Link href="/auth/login">
            <Button variant="dark" className="cursor-pointer">
              <LogIn />
              Daftar Akun Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
