// Kodingan Utama JavaScript // Memastikan DOM (struktur HTML) selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {

    // Kodingan Variabel Elemen // Mendapatkan elemen-elemen penting dari HTML, yaitu layar tampilan, gambar status, dan semua tombol.
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    // Kodingan Variabel Gambar Status // Definisi URL gambar untuk berbagai status
    const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
      Kodingan Fungsi changeImage // Fungsi ini bertanggung jawab untuk mengubah gambar status (statusImage) di bagian atas kalkulator 
      berdasarkan hasil perhitungan (sukses, error, atau normal).
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // Status default atau normal
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
      Kodingan Fungsi clearDisplay // Fungsi ini dipanggil saat tombol 'C' atau error terjadi. Tugasnya adalah mengosongkan 
      layar tampilan (display) dan mereset gambar status menjadi normal.
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**
      Kodingan Fungsi deleteLastChar // Fungsi ini dipanggil saat tombol 'DEL' (Delete) diklik. Ia akan menghapus satu karakter 
      terakhir dari string yang ada di layar tampilan.
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
      Kodingan Fungsi appendToDisplay // Fungsi ini digunakan oleh semua tombol angka dan operator. Tugasnya adalah menambahkan 
      nilai tombol yang diklik ke string ekspresi yang sedang dibangun di layar tampilan.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
      Kodingan Fungsi calculateResult // Fungsi utama perhitungan. Dipanggil saat tombol '=' ditekan.
     */
    function calculateResult() {
        // Mengecek apakah layar kosong. Jika ya, ia akan menampilkan 'Kosong!' dan meresetnya.
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // Mengosongkan display setelah 1.5 detik
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            // Melakukan perhitungan. Fungsi eval() digunakan untuk mengevaluasi string ekspresi.
            // '.replace' digunakan untuk mengubah simbol '%' menjadi '/100' agar perhitungan persen berfungsi.
            let result = eval(display.value
                .replace(/%/g, '/100') // Mengubah simbol '%' menjadi '/100'
            );

            // Memeriksa hasil perhitungan. Jika valid (bukan Infinity atau NaN), hasilnya ditampilkan.
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); // Mengubah gambar menjadi sukses
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            // Blok ini menangani error (misalnya: ekspresi salah atau pembagian dengan nol).
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); // Mengubah gambar menjadi error
            setTimeout(clearDisplay, 1500);
        }
    }


    // Kodingan Event Listener Tombol // Melakukan iterasi (loop) ke semua tombol dan menambahkan event listener 'click' pada masing-masing.
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // Menggunakan switch case untuk menentukan aksi berdasarkan nilai (data-value) tombol.
            switch (value) {
                case 'C':
                    // Kodingan Tombol C // Jika tombol 'C' diklik, panggil clearDisplay() untuk menghapus semua input.
                    clearDisplay();
                    break;
                case 'DEL':
                    // Kodingan Tombol DEL // Jika tombol 'DEL' diklik, panggil deleteLastChar() untuk menghapus karakter terakhir.
                    deleteLastChar();
                    break;
                case '=':
                    // Kodingan Tombol Equal // Jika tombol '=' diklik, panggil calculateResult() untuk menghitung hasilnya.
                    calculateResult();
                    break;
                default:
                    // Kodingan Tombol Angka/Operator // Untuk tombol angka dan operator (+, -, *, / , .), 
                    // jika status sebelumnya error/sukses, layar direset. Lalu, nilai ditambahkan ke display.
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    // Kodingan Input Keyboard // Menambahkan dukungan input dari keyboard (key binding).
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            // Tangani input angka dan operator.
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            // Tangani tombol Enter atau '=' untuk menghitung.
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            // Tangani tombol Backspace untuk menghapus karakter.
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            // Tangani tombol Escape atau 'c' untuk membersihkan display.
            clearDisplay();
            e.preventDefault();
        }
    });

});