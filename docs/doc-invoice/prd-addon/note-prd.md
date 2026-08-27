KLIEN ALTHEA:
Pagi mas Adi maaf baru sempet respon ini. Berikut bbrp poin tambahan yg diperlukan oleh Althea ya mas:

Rekam medis
•⁠  ⁠perlu dibuatkan opsi untuk refer pasien dari psikolog 1 ke psikolog lain, dan ketika ada refer maka psikolog lain akan otomatis mendapat akses ke rekam medis buatan psikolog sebelumnya, begitupun seterusnya apabila psikolog kedua melakukan refer ke psikolog ketiga

Bukti pembayaran
•⁠  ⁠apakah nanti akan ada default di awal terkait fee psikolog & fee althea per layanan, ataukah semua harus diisi secara manual setiap mau mengirimkan bukti pembayaran?
•⁠  ⁠⁠tolong dibuatkan opsi judul “invoice” sebagai tagihan untuk pasien-pasien yang belum membayar ketika sesi usai, dan opsi judul “bukti pembayaran” sebagai bukti pasien yg sudah membayar. Maka 1 klien bisa jadi perlu mendapat keduanya karena setelah invoice dibayarkan maka perlu mengirim bukti pembayaran juga 
•⁠  ⁠⁠tolong dibuatkan opsi kirim bukti pembayaran secara manual juga, khusus untuk pasien-pasien case tertentu yang mendapat keringanan untuk membayar per sesi (hitungannya bisa cicil 25%, 8,5%, dan 4,5% per pertemuan dan kadang nominalnya nggak sesuai spesifik dengan hitungan persen tsb) 
•⁠  ⁠⁠terkait pasien case tertentu bisa ditambahkan opsi selain Lunas, Cicil 50%, ada juga Cicil Khusus, begitu ya mas
•⁠  ⁠⁠riwayat transaksi dan rekap pembayaran per klien akan tercatat dimana ya mas nantinya?

DEVELOPER:
Pagi Bu Vina, terima kasih feedback-nya. Kami rangkum ya:

Yang sudah termasuk penawaran: (a) Invoice & Bukti Pembayaran memang dua dokumen terpisah — klien yang sama akan dapat invoice saat ditagih lalu bukti bayar setelah membayar; (b) cicilan dengan nominal bebas per pembayaran (termasuk 25% / 8,5% / 4,5% atau nominal yang tidak persis persen) sudah tertampung karena sistem mencatat per nominal, bukan persen kaku; (c) riwayat transaksi & rekap tercatat di halaman detail tiap klien.

Yang kami iyakan sebagai penyesuaian kecil: opsi kirim bukti   manual, dan status tambahan "Cicil Khusus". Untuk fee psikolog & fee Althea akan kami buatkan nilai default per layanan yang otomatis terisi dan tetap bisa diubah per transaksi.

Yang perlu kami diskusikan sedikit:

1.⁠ ⁠Fitur refer antar-psikolog dengan akses rekam medis berantai belum termasuk lingkup penawaran ini (di penawaran, akses rekam medis terbatas pada psikolog penanggung jawab & Owner). Kami perlu tahu: siapa yang melakukan refer, apakah akses psikolog penerima read-only atau bisa menulis, dan apakah aksesnya permanen atau bisa dicabut. Setelah jelas, kami kirimkan estimasi penyesuaiannya.
2.⁠ ⁠Untuk default fee: apakah cukup per layanan, atau per layanan per psikolog (karena fee tiap psikolog bisa berbeda)? Dan fee Althea itu nominal tetap atau persentase?
3.⁠ ⁠Cicilan khusus itu dibayar per pertemuan/sesi ya, bukan per paket? Dan apakah jumlah cicilannya bebas (tidak dibatasi)?
4.⁠ ⁠Status "Cicil Khusus": apakah cukup sebagai penanda di dashboard, atau perlu perlakuan berbeda (misal tidak masuk pengingat tagihan otomatis)?

KLIEN ALTHEA: 
Pagi mas Adi, maaf ya mas kmrn masih liburan jd slowrespon🙏
Berikut respon dari kami yaa:

Bukti pembayaran & invoice:
Kayaknya invoice nggak harus selalu dikirim otomatis deh mas, karena proses pembayaran kami pasti langsung setelah sesi selesai, jadi nggak perlu pengiriman invoice untuk ditagihkan kepada klien. Sepertinya kami butuh pengiriman invoice itu by option aja, karena bbrp case seperti klien yg konseling secara online, atau klien yg layanan nya dibayarkan oleh pihak sekolah atau perusahaan nya, nah itu yg perlu ada opsi pengiriman invoice. Untuk klien regular hanya perlu bukti pembayaran saja.

1.⁠ ⁠setelah hasil diskusi, sepertinya untuk referal ini masih belum diperlukan mas, jd tetap ikut dengan penjelasan di proposal penawaran nya saja untuk saat ini
2.⁠ ⁠⁠cukup per layanan, fee althea nominal tetap per layanan
3.⁠ ⁠⁠iya per pertemuan, ada juga yg bayar setiap 2 pertemuan. Cicilan dibuat bebas saja di website nya, batasannya nanti biar disampaikan oleh resepsionis kpd klien
4.⁠ ⁠⁠ cukup sebagai penanda di dashboard aja