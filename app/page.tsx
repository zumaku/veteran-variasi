import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, MapPin, Clock, Phone, Box, LogIn } from "lucide-react";
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

      {/* 3. Services Section */}
      <TopThreeProducts />

      {/* 4. Why Choose Us Section */}
      <section id="tentang-kami" className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-square md:aspect-[4/3] rounded-2xl bg-muted overflow-hidden">
              <Image
                src="/images/why-choose-us-veteran-variasi.png"
                alt="Mengapa Memilih Veteran Variasi"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
                  Mengapa Memilih Veteran Variasi?
                </h2>
                <p className="text-muted-foreground">
                  Kami berkomitmen memberikan kualitas pelayanan terbaik dengan
                  menggunakan peralatan modern dan ditangani langsung oleh
                  montir profesional.
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-md shrink-0">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Bebas Antre dengan Booking Pasti
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pesan jadwal online, langsung dikerjakan tanpa antre.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-md shrink-0">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Harga Transparan & Pasti
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Harga tertera sudah termasuk semua biaya pemasangan.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-2 rounded-md shrink-0">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Variasi & Servis AC Terpadu
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pasang aksesoris dan servis AC dalam satu kunjungan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
