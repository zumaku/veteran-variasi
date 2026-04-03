"use client";

import { useState, useEffect } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Order = {
  id: number;
  orderNumber: string;
  createdAt: Date;
  status: string;
  user?: { name: string };
  totalAmount: any;
};

interface OrderCalendarProps {
  orders: Order[];
}

export default function OrderCalendar({ orders }: OrderCalendarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date());
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Get orders for a specific date
  const getOrdersForDay = (day: Date) => {
    return orders.filter(
      order => isSameDay(new Date(order.createdAt), day)
    );
  };

  // Orders for selected date
  const selectedOrders = selectedDate ? getOrdersForDay(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-400 dark:bg-green-500/30 dark:text-green-400 border border-transparent dark:border-green-500/50";
      case "PROCESSING": return "bg-indigo-400 dark:bg-indigo-500/30 dark:text-indigo-400 border border-transparent dark:border-indigo-500/50";
      case "PAID": return "bg-blue-400 dark:bg-blue-500/30 dark:text-blue-400 border border-transparent dark:border-blue-500/50";
      case "PENDING": return "bg-orange-400 dark:bg-orange-500/30 dark:text-orange-400 border border-transparent dark:border-orange-500/50";
      case "CANCELLED": return "bg-red-400 dark:bg-red-500/30 dark:text-red-400 border border-transparent dark:border-red-500/50";
      default: return "bg-gray-400 dark:bg-gray-500/30 dark:text-gray-400 border border-transparent dark:border-gray-500/50";
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <CalendarIcon className="w-8 h-8 text-primary/50 mb-2" />
          <p className="text-muted-foreground text-sm">Memuat Kalender...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" /> Kalender Pesanan Masuk
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Klik pada tanggal untuk melihat detail pesanan pada hari tersebut.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-xl border border-border/50">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-lg cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-bold text-sm min-w-[120px] text-center capitalize">
            {format(currentDate, dateFormat, { locale: localeId })}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-lg cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border border-border/40 rounded-2xl overflow-hidden bg-muted/10">
        {/* Days Header */}
        <div 
          className="bg-muted/30 border-b border-border/40" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }} 
          className="auto-rows-fr"
        >
          {days.map((day, dayIdx) => {
            const dayOrders = getOrdersForDay(day);
            const isSelectedMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={day.toString()}
                onClick={() => {
                  if (dayOrders.length > 0) setSelectedDate(day);
                }}
                className={`
                  min-h-[100px] p-2 border-border/40 transition-colors relative
                  ${!isSelectedMonth ? 'bg-muted/30 text-muted-foreground/50' : 'bg-transparent text-foreground hover:bg-muted/20'}
                  ${dayOrders.length > 0 ? 'cursor-pointer hover:bg-primary/5' : ''}
                `}
                style={{
                  borderRightWidth: dayIdx % 7 === 6 ? '0px' : '1px',
                  borderBottomWidth: '1px'
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`
                    text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                    ${isTodayDate ? 'bg-primary text-primary-foreground shadow-sm' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  {dayOrders.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md hidden sm:inline-block">
                      {dayOrders.length} Pesanan
                    </span>
                  )}
                </div>

                {/* Day Orders Indicators */}
                <div className="flex flex-col gap-1.5 mt-2">
                  {dayOrders.slice(0, 3).map((order) => (
                    <div 
                      key={order.id} 
                      className={`text-[10px] flex flex-col justify-center px-2 py-1 rounded-sm w-full overflow-hidden text-black font-bold ${getStatusColor(order.status)}`}
                      title={`#${order.orderNumber} - ${order.user?.name || 'Anonim'} - Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`}
                    >
                      <span className="truncate tracking-tight mb-0.5">#{order.orderNumber}</span>
                      <span className="opacity-95 truncate text-[9px] leading-tight">
                        {order.user?.name?.split(' ')[0] || 'Anonim'}
                      </span>
                    </div>
                  ))}
                  {dayOrders.length > 3 && (
                    <div className="text-[10px] font-bold px-1.5 py-1 rounded-sm bg-muted text-muted-foreground text-center">
                      +{dayOrders.length - 3} Lainnya
                    </div>
                  )}
                  {/* For mobile view order count dot */}
                  {dayOrders.length > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto sm:hidden mt-2"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Pesanan pada {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: localeId }) : ""}
            </DialogTitle>
            <DialogDescription>
              Terdapat {selectedOrders.length} pesanan yang masuk pada tanggal ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {selectedOrders.map(order => (
              <Link 
                href={`/dashboard/admin/orders/${order.id}`} 
                key={order.id}
                className="flex flex-col sm:flex-row gap-4 p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-muted/10 transition-colors group cursor-pointer"
                onClick={() => setSelectedDate(null)} 
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">#{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground/80">{order.user?.name || "Anonim"}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end text-sm">
                  <div className="font-mono font-bold text-primary">
                    Rp {Number(order.totalAmount).toLocaleString('id-ID')}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
