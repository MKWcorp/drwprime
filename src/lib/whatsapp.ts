type ReservationWhatsappPayload = {
  reservationId: string;
  treatmentName: string;
  treatmentPrice: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reservationDate: Date;
  reservationTime: string;
  patientNotes?: string | null;
  referredBy?: string | null;
};

const DEFAULT_WHATSAPP_API_URL = 'https://api.fonnte.com/send';
const DEFAULT_WHATSAPP_ADMIN_PHONE = '6281138800071';

function normalizePhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (!digits) return '';
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;

  return digits;
}

function getWhatsAppConfig() {
  const token = process.env.WHATSAPP_API_TOKEN?.trim();
  const adminPhone = normalizePhoneNumber(
    process.env.WHATSAPP_ADMIN_PHONE?.trim() || DEFAULT_WHATSAPP_ADMIN_PHONE
  );
  const apiUrl = process.env.WHATSAPP_API_URL?.trim() || DEFAULT_WHATSAPP_API_URL;

  return { token, adminPhone, apiUrl };
}

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function formatDateId(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function buildReservationMessage(payload: ReservationWhatsappPayload) {
  return [
    '*Reservasi Baru DRW Prime*',
    '',
    `ID: ${payload.reservationId}`,
    `Treatment: ${payload.treatmentName}`,
    `Harga Awal: ${formatRupiah(payload.treatmentPrice)}`,
    '',
    '*Data Pasien*',
    `Nama: ${payload.patientName}`,
    `Email: ${payload.patientEmail}`,
    `Telepon: ${payload.patientPhone}`,
    '',
    '*Jadwal*',
    `Tanggal: ${formatDateId(payload.reservationDate)}`,
    `Jam: ${payload.reservationTime}`,
    `Kode Affiliate: ${payload.referredBy || '-'}`,
    `Catatan: ${payload.patientNotes || '-'}`,
  ].join('\n');
}

export async function sendReservationToAdminWhatsApp(payload: ReservationWhatsappPayload) {
  const { token, adminPhone, apiUrl } = getWhatsAppConfig();

  if (!token || !adminPhone) {
    return;
  }

  const message = buildReservationMessage(payload);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      target: adminPhone,
      message,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} ${raw}`);
  }
}
