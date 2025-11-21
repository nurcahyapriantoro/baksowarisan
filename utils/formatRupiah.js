// Utility: Format angka ke Rupiah tanpa desimal
export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(num) || 0);
}
