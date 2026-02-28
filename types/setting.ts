export interface Setting {
    id: number;
    topProducts: number[];
    whyChooseUs: { title: string; description: string }[];
    alamat: string;
    jamBuka: string;
    jamTutup: string;
    kontak: string;
    whatsapp: string;
    socialMedia: { platform: string; url: string }[];
    updatedAt: Date;
}