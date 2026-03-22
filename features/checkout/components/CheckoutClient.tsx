"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { rupiahConverter } from "@/features/catalog/lib";
import {
  submitCheckoutAction,
  checkAvailability,
  getMonthlyAvailability,
} from "../actions";
import { toast } from "@/lib/toast-store";
import {
  PackageOpen,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Wallet,
  Store,
  ChevronRight,
  CarFront,
  Check,
  ChevronDown,
  ChevronUp,
  QrCode,
} from "lucide-react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { format } from "date-fns";

const PAYMENT_CATEGORIES = [
  {
    id: "ewallet",
    title: "1. E-Wallet (Dompet Digital)",
    icon: <Wallet className="w-5 h-5" />,
    methods: [
      {
        id: "GOPAY",
        name: "GoPay",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg",
      },
      {
        id: "OVO",
        name: "OVO",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg",
      },
      {
        id: "DANA",
        name: "DANA",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",
      },
      {
        id: "SHOPEEPAY",
        name: "ShopeePay",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
      },
      {
        id: "LINKAJA",
        name: "LinkAja",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg",
      },
    ],
  },
  {
    id: "va",
    title: "2. Virtual Account (VA) & Bank Transfer",
    icon: <CreditCard className="w-5 h-5" />,
    methods: [
      {
        id: "VA_BCA",
        name: "BCA Virtual Account",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
      },
      {
        id: "VA_MANDIRI",
        name: "Mandiri Virtual Account",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
      },
      {
        id: "VA_BNI",
        name: "BNI Virtual Account",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg",
      },
      {
        id: "VA_BRI",
        name: "BRI Virtual Account (BRIVA)",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
      },
      {
        id: "VA_PERMATA",
        name: "Permata Virtual Account",
        image:
          "https://upload.wikimedia.org/wikipedia/id/4/48/PermataBank_logo.svg",
      },
      {
        id: "VA_CIMB",
        name: "CIMB Niaga Virtual Account",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg",
      },
      {
        id: "VA_BSI",
        name: "BSI (Bank Syariah Indonesia) VA",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/6/69/Bank_Syariah_Indonesia.jpg",
      },
    ],
  },
  {
    id: "qris",
    title: "3. QRIS",
    icon: <QrCode className="w-5 h-5" />,
    methods: [
      {
        id: "QRIS",
        name: "QRIS",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg",
      },
    ],
  },
  {
    id: "otc",
    title: "4. Over-the-Counter (OTC) / Gerai Retail",
    icon: <Store className="w-5 h-5" />,
    methods: [
      {
        id: "OTC_INDOMARET",
        name: "Indomaret",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
      },
      {
        id: "OTC_ALFAMART",
        name: "Alfamart Group",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg",
      },
    ],
  },
  {
    id: "credit_card",
    title: "5. Kartu Kredit & Debit Online",
    icon: <CreditCard className="w-5 h-5" />,
    methods: [
      {
        id: "CC_VISA",
        name: "Visa",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg",
      },
      {
        id: "CC_MASTERCARD",
        name: "Mastercard",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      },
      {
        id: "CC_JCB",
        name: "JCB",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
      },
      {
        id: "CC_AMEX",
        name: "American Express (Amex)",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
      },
    ],
  },
];
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutClient({
  item,
  cars,
}: {
  item: any;
  cars: any[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [monthlyAvailability, setMonthlyAvailability] = useState<
    Record<string, number>
  >({});

  const selectedDateStr = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const res = await getMonthlyAvailability(year, month);
        setMonthlyAvailability(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMonthly();
  }, [calendarMonth]);

  useEffect(() => {
    if (!selectedDateStr) {
      setBookedSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsCheckingSlots(true);
      setSelectedTimeSlot("");
      try {
        const slots = await checkAvailability(selectedDateStr);
        setBookedSlots(slots);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDateStr]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (cars.length === 0) {
      toast.error("Silakan tambahkan mobil terlebih dahulu di Garasi.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("itemId", item.id.toString());

    const res = await submitCheckoutAction(formData);

    // If it returns a response, it means there was an error
    // because success redirects
    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    }
  };

  const total = item.quantity * item.product.price;

  const selectedCarObj = cars.find((c) => c.id.toString() === selectedCar);
  const timeSlotLabel =
    selectedTimeSlot === "1"
      ? "09:00 - 12:00"
      : selectedTimeSlot === "2"
        ? "12:00 - 15:00"
        : selectedTimeSlot === "3"
          ? "15:00 - 18:00"
          : null;
  const selectedPaymentObj = PAYMENT_CATEGORIES.flatMap((c) => c.methods).find(
    (m) => m.id === selectedPayment,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative"
    >
      {/* Kolom Kiri: Produk, Mobil, Waktu Kedatangan */}
      <div className="w-full lg:w-[60%] space-y-6">
        {/* Total Product Section */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-montserrat flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-[#FFB800]" />
            Produk Pesanan
          </h2>

          <div className="flex bg-background rounded-lg border border-border/80 p-4 rounded-[16px] items-center gap-4 transition-all hover:border-[#FFB800]/50 hover:shadow-sm">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border flex items-center justify-center">
              {item.product.images?.[0]?.url ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <PackageOpen className="w-8 h-8 text-muted-foreground/30" />
              )}
            </div>

            <div className="flex flex-col flex-1">
              <span className="font-bold text-[17px] leading-tight line-clamp-2">
                {item.product.name}
              </span>
              <span className="text-muted-foreground font-medium text-sm mt-1">
                {item.quantity} x {rupiahConverter(item.product.price)}
              </span>
            </div>

            <div className="font-bold text-[#FFB800] text-lg font-montserrat tracking-tight">
              {rupiahConverter(total)}
            </div>
          </div>
        </section>

        {/* Car Selection Section */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-montserrat flex items-center gap-2">
            <CarFront className="w-5 h-5 text-[#FFB800]" />
            Mobil (Kendaraan)
          </h2>

          {cars.length > 0 ? (
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                Pilih dari Garasi Anda
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cars.map((c) => {
                  const isSelected = selectedCar === c.id.toString();
                  return (
                    <label
                      key={c.id}
                      className={`relative flex flex-col h-full overflow-hidden bg-background border-2 rounded-xl cursor-pointer hover:border-[#FFB800] hover:shadow-sm transition-all group ${
                        isSelected
                          ? "border-[#FFB800] ring-1 ring-[#FFB800] bg-[#FFB800]/5 shadow-md"
                          : "border-border/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="carId"
                        value={c.id.toString()}
                        required
                        className="peer sr-only"
                        checked={isSelected}
                        onChange={(e) => setSelectedCar(e.target.value)}
                      />

                      {/* Image container */}
                      <div className="relative w-full h-24 bg-muted/50 flex items-center justify-center border-b border-border/50 overflow-hidden">
                        {c.image ? (
                          <Image
                            src={c.image}
                            alt={`${c.brand} ${c.model}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <CarFront className="w-10 h-10 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Car details */}
                      <div className="p-3 flex flex-col items-center text-center mt-auto">
                        <span className="font-bold text-[15px] leading-tight text-foreground line-clamp-1">
                          {c.brand} {c.model}
                        </span>
                        <span className="text-muted-foreground font-semibold text-[11px] mt-1.5 px-2 py-0.5 bg-background border-border/60 rounded-md border tracking-wider">
                          {c.licensePlate}
                        </span>
                      </div>

                      {/* Checked indicator */}
                      <div
                        className={`absolute top-2 right-2 bg-[#FFB800] text-black w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
                          isSelected
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                        }`}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 text-sm font-medium">
              Anda belum memiliki mobil di garasi. Silakan tambahkan terlebih
              dahulu.{" "}
              <Link
                href="/dashboard/user/garage"
                className="underline font-bold text-orange-900 dark:text-orange-100 pl-1"
              >
                Ke Halaman Garasi
              </Link>
            </div>
          )}
        </section>

        {/* Arrival Time Section */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-montserrat flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FFB800]" />
            Waktu Kedatangan
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
            <div className="space-y-4 w-full">
              <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />{" "}
                Tanggal
              </label>
              <Card className="mx-auto w-full p-0 overflow-hidden border-border/60 shadow-sm">
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    defaultMonth={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      const dateStr = format(date, "yyyy-MM-dd");
                      const taken = monthlyAvailability[dateStr] || 0;
                      return taken >= 3;
                    }}
                    className="w-full flex justify-center py-8 bg-background/50"
                    components={{
                      DayButton: ({ children, modifiers, day, ...props }) => {
                        const dateStr = format(day.date, "yyyy-MM-dd");
                        const taken = monthlyAvailability[dateStr] || 0;
                        const available = Math.max(0, 3 - taken);
                        const isPast =
                          day.date < new Date(new Date().setHours(0, 0, 0, 0));

                        return (
                          <CalendarDayButton
                            day={day}
                            modifiers={modifiers}
                            {...props}
                            className={`p-1`}
                          >
                            <div
                              className={`flex flex-col rounded-sm pb-4  hover:bg-primary/90 ${modifiers.selected && "bg-primary text-black"}`}
                            >
                              <span className="text-sm sm:text-base font-medium p-4">
                                {children}
                              </span>
                              {!modifiers.outside && !isPast && (
                                <span
                                  className={`text-[11px] sm:text-xs font-bold -mt-4 ${
                                    modifiers.selected
                                      ? "text-black/80"
                                      : available === 0
                                        ? "text-red-500"
                                        : "text-gray-400 dark:text-gray-300"
                                  }`}
                                >
                                  {/* {available > 0 ? `${taken}/3` : "Penuh"} */}
                                  {available > 0 && `${taken}/3`}
                                </span>
                              )}
                            </div>
                          </CalendarDayButton>
                        );
                      },
                    }}
                  />
                </CardContent>
              </Card>
              <input type="hidden" name="bookingDate" value={selectedDateStr} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="timeSlot"
                  className="text-sm font-semibold flex items-center gap-1.5 text-foreground"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" /> Jam
                  Kedatangan
                </label>
                {selectedDate && !isCheckingSlots && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    Sisa: {3 - bookedSlots.length} Slot
                  </span>
                )}
              </div>
              <Select
                name="timeSlot"
                required
                disabled={
                  !selectedDate || isCheckingSlots || bookedSlots.length === 3
                }
                value={selectedTimeSlot}
                onValueChange={setSelectedTimeSlot}
              >
                <SelectTrigger
                  id="timeSlot"
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm font-medium focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer data-[disabled]:opacity-50"
                >
                  <SelectValue
                    placeholder={
                      !selectedDate
                        ? "Pilih tanggal dulu"
                        : isCheckingSlots
                          ? "Mengecek jadwal..."
                          : bookedSlots.length === 3
                            ? "Jadwal penuh"
                            : "Pilih Jam"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" disabled={bookedSlots.includes(1)}>
                    09:00 - 12:00 {bookedSlots.includes(1) && "(Penuh)"}
                  </SelectItem>
                  <SelectItem value="2" disabled={bookedSlots.includes(2)}>
                    12:00 - 15:00 {bookedSlots.includes(2) && "(Penuh)"}
                  </SelectItem>
                  <SelectItem value="3" disabled={bookedSlots.includes(3)}>
                    15:00 - 18:00 {bookedSlots.includes(3) && "(Penuh)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-montserrat flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#FFB800]" />
            Metode Pembayaran
          </h2>

          <div className="space-y-4">
            {PAYMENT_CATEGORIES.map((category, index) => {
              const isExpanded = expandedCategory === index;
              const hasSelectedMethod = category.methods.some(
                (m) => m.id === selectedPayment,
              );

              return (
                <div
                  key={category.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "border-[#FFB800] bg-background shadow-sm"
                      : "border-border/60 bg-background/50 hover:border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                          hasSelectedMethod || isExpanded
                            ? "bg-[#FFB800]/20 text-[#FFB800]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {category.icon}
                      </div>
                      <span
                        className={`font-bold text-sm sm:text-base text-left ${isExpanded ? "text-foreground" : "text-foreground/80"}`}
                      >
                        {category.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-border/50 bg-muted/5 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex flex-col gap-3 mt-4">
                        {category.methods.map((method) => {
                          const isSelected = selectedPayment === method.id;
                          return (
                            <label
                              key={method.id}
                              className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:border-[#FFB800] hover:shadow-sm transition-all border-2 bg-background group w-full ${
                                isSelected
                                  ? "border-[#FFB800] ring-[#FFB800] bg-[#FFB800]/5 shadow-sm"
                                  : "border-border/60"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                required
                                className="peer sr-only"
                                checked={isSelected}
                                onChange={(e) =>
                                  setSelectedPayment(e.target.value)
                                }
                              />

                              <div
                                className="bg-white rounded-md border border-border/50 flex items-center justify-center overflow-hidden p-[4px] relative"
                                style={{ width: 64, height: 40, flexShrink: 0 }}
                              >
                                <Image
                                  src={method.image}
                                  alt={method.name}
                                  fill
                                  sizes="64px"
                                  className="object-contain p-1"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextElementSibling) {
                                      (
                                        e.currentTarget
                                          .nextElementSibling as HTMLElement
                                      ).style.display = "flex";
                                    }
                                  }}
                                />
                                <div
                                  className="hidden absolute inset-0 items-center justify-center bg-muted text-[10px] font-bold text-center leading-none px-1 overflow-hidden"
                                  style={{ width: "100%", height: "100%" }}
                                >
                                  {method.name.slice(0, 3).toUpperCase()}...
                                </div>
                              </div>

                              <span className="font-semibold text-base leading-tight text-foreground flex-1">
                                {method.name}
                              </span>

                              <div
                                className={`mt-0.5 ml-auto bg-[#FFB800] text-black w-5 h-5 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                  isSelected
                                    ? "opacity-100 scale-100"
                                    : "bg-transparent border-2 border-border opacity-50"
                                }`}
                              >
                                {isSelected && (
                                  <Check
                                    className="w-3.5 h-3.5"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Kolom Kanan: Summary & Submit Container */}
      {/* <div className="bg-red-600 w-full lg:w-[40%] space-y-6 border border-border/60 rounded-2xl p-6 shadow-sm sticky top-[96px] self-start"> */}
      <div
        style={{ top: "24px" }}
        className="w-full lg:w-[40%] space-y-6 border border-border/60 rounded-2xl p-6 shadow-sm sticky self-start"
      >
        <h2 className="text-xl font-bold font-montserrat border-b border-border/50 pb-4 mb-4">
          Ringkasan Pesanan
        </h2>

        <div className="space-y-4 text-sm">
          {/* Mobil */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-medium">Kendaraan</span>
            {selectedCarObj ? (
              <span className="font-semibold">
                {selectedCarObj.brand} {selectedCarObj.model} (
                {selectedCarObj.licensePlate})
              </span>
            ) : (
              <span className="text-red-500 font-medium text-xs">
                Belum dipilih
              </span>
            )}
          </div>

          {/* Jadwal */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-medium">
              Jadwal Kedatangan
            </span>
            {selectedDate && selectedTimeSlot ? (
              <span className="font-semibold">
                {format(selectedDate, "dd MMM yyyy")} • {timeSlotLabel}
              </span>
            ) : (
              <span className="text-red-500 font-medium text-xs">
                Belum dipilih
              </span>
            )}
          </div>

          {/* Pembayaran */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-medium">
              Metode Pembayaran
            </span>
            {selectedPaymentObj ? (
              <span className="font-semibold">{selectedPaymentObj.name}</span>
            ) : (
              <span className="text-red-500 font-medium text-xs">
                Belum dipilih
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 mt-6 border-t border-border/60">
          <div className="flex justify-between items-center mb-6 bg-muted/30 p-4 rounded-xl">
            <span className="font-bold text-[17px]">Total Pembayaran</span>
            <span className="font-bold text-2xl font-montserrat tracking-tight text-[#FFB800]">
              {rupiahConverter(total)}
            </span>
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              !selectedCar ||
              !selectedDate ||
              !selectedTimeSlot ||
              !selectedPayment
            }
            className="w-full text-base h-14 font-bold cursor-pointer transition-all active:scale-[0.98] bg-[#FFB800] text-black hover:bg-[#FFB800]/90 shadow hover:shadow-md rounded-xl flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                Lanjut Pembayaran <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
