/* ============================================================================
   PT Tarik Data Digital — interaksi situs
   Tanpa dependensi. Semua fitur di sini adalah progressive enhancement:
   halaman tetap terbaca dan bisa dipakai bila JS gagal dimuat.
   ========================================================================= */

(function () {
  'use strict';

  /* ---------- Navigasi desktop (dropdown) --------------------------------
     <details> adalah fallback semantik tanpa JS. Enhancement ini hanya
     membatasi satu panel terbuka, klik luar, dan Escape. */

  var navItems = Array.prototype.slice.call(
    document.querySelectorAll('[data-nav-item]')
  );

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  function closeAllPanels(except) {
    navItems.forEach(function (item) {
      if (item !== except) item.open = false;
    });
  }

  navItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) closeAllPanels(item);
    });

    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) item.open = false;
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-nav-item]')) closeAllPanels(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openItem = navItems.filter(function (item) { return item.open; })[0];
    if (openItem) {
      openItem.open = false;
      openItem.querySelector('[data-nav-toggle]').focus();
    }
  });

  /* ---------- Navigasi mobile -------------------------------------------- */

  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    function setMobileMenu(isOpen, shouldRestoreFocus) {
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('data-open', String(isOpen));
      menuBtn.querySelector('[data-menu-label]').textContent = isOpen ? 'Tutup' : 'Menu';
      if (shouldRestoreFocus) menuBtn.focus();
    }

    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen, false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMobileMenu(false, true);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000) setMobileMenu(false, false);
    });
  }

  /* ---------- Form kontak ------------------------------------------------
     Validasi ditulis supaya pesan error menjelaskan CARA MEMPERBAIKI,
     bukan sekadar menyatakan "tidak valid". */

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var WA_NUMBER = '6285607550989';
  var EMAIL = 'halo@tarikdata.digital';

  // Pilihan kebutuhan berubah mengikuti sektor yang dipilih (brief §7)
  var NEEDS = {
    kesehatan: [
      'Rekam medis elektronik (RME)',
      'Integrasi SATUSEHAT',
      'Bridging BPJS Kesehatan',
      'Sistem informasi klinik',
      'Pelaporan SIRS / RL',
      'Belum tahu, ingin diskusi dulu'
    ],
    pendidikan: [
      'Administrasi akademik',
      'Penerimaan murid baru (SPMB)',
      'Keuangan & SPP',
      'Pelaporan Dapodik / PDDikti / EMIS',
      'Sistem pesantren (asrama, hafalan, tabungan santri)',
      'Belum tahu, ingin diskusi dulu'
    ],
    bisnis: [
      'ERP — akuntansi & buku besar',
      'ERP — persediaan & gudang',
      'ERP — penjualan & pembelian',
      'Manufaktur (produksi, OEE, mutu)',
      'Absensi & manajemen kerja',
      'Dashboard & pelaporan',
      'Belum tahu, ingin diskusi dulu'
    ],
    lainnya: [
      'Pengembangan sistem khusus',
      'Integrasi antar sistem',
      'Konsultasi teknologi',
      'Belum tahu, ingin diskusi dulu'
    ]
  };

  var sektor = form.querySelector('#sektor');
  var kebutuhan = form.querySelector('#kebutuhan');

  function refreshNeeds() {
    if (!sektor || !kebutuhan) return;
    var opts = NEEDS[sektor.value] || NEEDS.lainnya;
    kebutuhan.innerHTML = '';

    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = sektor.value ? 'Pilih kebutuhan utama' : 'Pilih sektor terlebih dahulu';
    kebutuhan.appendChild(blank);

    opts.forEach(function (label) {
      var o = document.createElement('option');
      o.value = label;
      o.textContent = label;
      kebutuhan.appendChild(o);
    });

    kebutuhan.disabled = !sektor.value;
  }

  if (sektor) {
    var requestedSector = new URLSearchParams(window.location.search).get('sektor');
    if (requestedSector && Object.prototype.hasOwnProperty.call(NEEDS, requestedSector)) {
      sektor.value = requestedSector;
    }
    sektor.addEventListener('change', refreshNeeds);
    refreshNeeds();
  }

  function showError(field, message) {
    var box = form.querySelector('[data-error-for="' + field.id + '"]');
    field.setAttribute('aria-invalid', 'true');
    if (box) {
      box.textContent = message;
      box.setAttribute('data-show', 'true');
    }
  }

  function clearError(field) {
    var box = form.querySelector('[data-error-for="' + field.id + '"]');
    field.removeAttribute('aria-invalid');
    if (box) box.setAttribute('data-show', 'false');
  }

  // Setiap aturan menyebutkan bentuk yang benar, bukan hanya menolak.
  var RULES = [
    {
      id: 'nama',
      test: function (v) { return v.trim().length >= 2; },
      msg: 'Tulis nama Anda, minimal 2 huruf. Contoh: Budi Santoso.'
    },
    {
      id: 'institusi',
      test: function (v) { return v.trim().length >= 3; },
      msg: 'Tulis nama institusi Anda. Contoh: RS Harapan Bunda, atau SMK Negeri 2 Malang.'
    },
    {
      id: 'email',
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      msg: 'Alamat email perlu memuat tanda @ dan nama domain. Contoh: nama@instansi.co.id.'
    },
    {
      id: 'whatsapp',
      optional: true,
      test: function (v) {
        var d = v.replace(/[^0-9]/g, '');
        return d.length === 0 || (d.length >= 9 && d.length <= 15);
      },
      msg: 'Nomor WhatsApp terdiri dari 9–15 angka. Contoh: 0812 3456 7890.'
    },
    {
      id: 'sektor',
      test: function (v) { return v !== ''; },
      msg: 'Pilih salah satu sektor supaya kami bisa menyiapkan orang yang tepat.'
    },
    {
      id: 'pesan',
      test: function (v) { return v.trim().length >= 10; },
      msg: 'Ceritakan kebutuhan Anda minimal satu kalimat, supaya kami bisa menjawab dengan tepat.'
    }
  ];

  RULES.forEach(function (rule) {
    var field = form.querySelector('#' + rule.id);
    if (!field) return;
    // Validasi ulang saat pengguna memperbaiki — hanya setelah error tampil,
    // supaya tidak menegur saat orang masih mengetik pertama kali.
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true' && rule.test(field.value)) {
        clearError(field);
      }
    });
    field.addEventListener('change', function () {
      if (rule.test(field.value)) clearError(field);
    });
  });

  function validate() {
    var firstBad = null;

    RULES.forEach(function (rule) {
      var field = form.querySelector('#' + rule.id);
      if (!field) return;
      if (rule.test(field.value)) {
        clearError(field);
      } else {
        showError(field, rule.msg);
        if (!firstBad) firstBad = field;
      }
    });

    return firstBad;
  }

  function buildMessage() {
    function val(id) {
      var el = form.querySelector('#' + id);
      return el && el.value.trim() ? el.value.trim() : '-';
    }

    return [
      'Halo PT Tarik Data Digital, saya ingin menjadwalkan demo.',
      '',
      'Nama      : ' + val('nama'),
      'Jabatan   : ' + val('jabatan'),
      'Institusi : ' + val('institusi'),
      'Sektor    : ' + val('sektor'),
      'Kebutuhan : ' + val('kebutuhan'),
      'Email     : ' + val('email'),
      'WhatsApp  : ' + val('whatsapp'),
      '',
      'Pesan:',
      val('pesan')
    ].join('\n');
  }

  var status = form.querySelector('[data-form-status]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var bad = validate();
    if (bad) {
      if (status) {
        status.textContent = 'Ada ' + form.querySelectorAll('[data-show="true"]').length +
          ' isian yang perlu diperbaiki. Keterangannya ada di bawah masing-masing isian.';
        status.setAttribute('data-show', 'true');
      }
      bad.focus();
      return;
    }

    if (status) {
      status.textContent = 'Membuka WhatsApp dengan pesan yang sudah terisi. ' +
        'Bila WhatsApp tidak terbuka, gunakan tombol kirim lewat email di bawah.';
      status.setAttribute('data-show', 'true');
    }

    var text = encodeURIComponent(buildMessage());
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + text, '_blank', 'noopener,noreferrer');
  });

  // Jalur alternatif: banyak pembeli institusi tidak memakai WhatsApp
  // untuk urusan resmi, jadi email harus setara mudahnya.
  var mailBtn = form.querySelector('[data-send-email]');
  if (mailBtn) {
    mailBtn.addEventListener('click', function () {
      var bad = validate();
      if (bad) {
        if (status) {
          status.textContent = 'Lengkapi dulu isian yang ditandai, lalu kirim ulang.';
          status.setAttribute('data-show', 'true');
        }
        bad.focus();
        return;
      }

      var subject = encodeURIComponent(
        'Permintaan demo — ' + (form.querySelector('#institusi').value.trim() || 'institusi')
      );
      window.location.href = 'mailto:' + EMAIL + '?subject=' + subject +
        '&body=' + encodeURIComponent(buildMessage());
    });
  }
})();
