function tutupOnboarding() {
    var overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.style.display = 'none';
}

const hariArray = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const pasaranArray = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const neptuHariMap = {0: 5, 1: 4, 2: 3, 3: 7, 4: 8, 5: 6, 6: 9};
const neptuPasaranMap = {0: 5, 1: 9, 2: 7, 3: 4, 4: 8}; 
const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function getInfoWetonUtama(tglString) {
    const dateObj = new Date(tglString);
    const utcMs = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const dayOfWeek = new Date(utcMs).getUTCDay(); 
    const daysSinceEpoch = Math.floor(utcMs / 86400000);
    const pasaranIndex = (((daysSinceEpoch % 5) + 5) % 5 + 3) % 5;
    return {
        dayIndex: dayOfWeek, pasaranIndex: pasaranIndex,
        namaHari: hariArray[dayOfWeek], namaPasaran: pasaranArray[pasaranIndex],
        nHari: neptuHariMap[dayOfWeek], nPasaran: neptuPasaranMap[pasaranIndex],
        totalNeptu: neptuHariMap[dayOfWeek] + neptuPasaranMap[pasaranIndex]
    };
}

function formatTanggalIndo(dateObj) {
    return `${dateObj.getUTCDate()} ${namaBulan[dateObj.getUTCMonth()]} ${dateObj.getUTCFullYear()}`;
}

function switchTab(tabId) {
    document.querySelectorAll('.app-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('section' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).classList.add('active');
    document.getElementById('btnTab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).classList.add('active');

    if (tabId === 'kalender' && document.getElementById('gridHeaderKalender').innerHTML === '') {
        renderHeaderKalender();
        renderKalenderPro();
    }
}

const neptuMapAksara = {'h':1,'d':1,'p':1,'m':1,'f':1,'v':1,'n':2,'t':2,'dh':2,'g':2,'c':3,'s':3,'j':3,'b':3,'z':3,'r':4,'w':4,'y':4,'th':4,'k':5,'l':5,'ny':5,'ng':5,'q':5,'':1};
const maknaNama = {
    1: { gelar: "Sri (Sisa 1)", arti: "Sangat Baik. Diramalkan dilimpahi keselamatan dan rezeki." },
    2: { gelar: "Lungguh (Sisa 2)", arti: "Baik. Diramalkan memiliki kedudukan tinggi dan dihormati." },
    3: { gelar: "Gedhong (Sisa 3)", arti: "Baik. Diramalkan akan kaya raya dan hidup berkecukupan." },
    4: { gelar: "Loro (Sisa 4)", arti: "Kurang Baik. Diramalkan sering menemui kesulitan atau masalah." },
    0: { gelar: "Pati (Sisa 0/5)", arti: "Buruk. Dipercaya rentan tertimpa musibah atau kesulitan berat." }
};
const dbNama = ["Agung","Baskara","Cahya","Darma","Eka","Fajar","Galih","Hadi","Indra","Jaya","Kusuma","Lestari","Mulya","Nugraha","Purnomo","Rahayu","Surya","Tri","Utama","Wibowo","Bima","Lintang","Mahardika","Nanda","Prabu","Ratna","Suci","Bayu","Yoga","Widodo","Santoso","Putra","Putri","Bagus"];

function hitungNeptuKata(teks) {
    let total = 0;
    teks.toLowerCase().trim().split(/\s+/).forEach(kata => {
        let match; const regex = /(dh|th|ny|ng|[a-z])?([aiueo])/gi; 
        while ((match = regex.exec(kata)) !== null) total += (neptuMapAksara[match[1] || ''] !== undefined ? neptuMapAksara[match[1] || ''] : 1);
    });
    return total;
}

function hitungNama() {
    const inputNama = document.getElementById('namaInput').value.toLowerCase().trim();
    if (!inputNama) { alert("Silakan masukkan nama!"); return; }
    let totalNeptu = 0, arrayRincian = [];
    inputNama.split(/\s+/).forEach(kata => {
        let match, rincianKata = []; const regex = /(dh|th|ny|ng|[a-z])?([aiueo])/gi; 
        while ((match = regex.exec(kata)) !== null) {
            let kons = match[1] || '', nilai = neptuMapAksara[kons] !== undefined ? neptuMapAksara[kons] : 1;
            totalNeptu += nilai; rincianKata.push(`<b>${kons + match[2]}</b>(${nilai})`);
        }
        if (rincianKata.length > 0) arrayRincian.push(rincianKata.join("+"));
    });
    if (totalNeptu === 0) return;
    let sisa = totalNeptu % 5;
    document.getElementById('rincianTeks').innerHTML = `<strong>Rincian:</strong> ${arrayRincian.join(" | ")} <br><strong>Hitungan:</strong> ${totalNeptu} ÷ 5 = sisa <strong>${sisa}</strong>`;
    const card = document.getElementById('hasilCard');
    card.className = `hasil-card sisa-${sisa}`;
    document.getElementById('hasilGelar').innerText = `Jatuh pada: ${maknaNama[sisa].gelar}`;
    document.getElementById('hasilDeskripsi').innerText = maknaNama[sisa].arti;

    if (sisa === 0 || sisa === 4) {
        let saranHtml = "", count = 0;
        let shuffled = [...dbNama].sort(() => 0.5 - Math.random());
        for (let i = 0; i < shuffled.length; i++) {
            let sBaru = (totalNeptu + hitungNeptuKata(shuffled[i])) % 5;
            if (sBaru >= 1 && sBaru <= 3) {
                saranHtml += `<div class="saran-item"><b>${shuffled[i]}</b><span>Jadi ${maknaNama[sBaru].gelar.split(" ")[0]}</span></div>`;
                if (++count >= 15) break;
            }
        }
        document.getElementById('saranGrid').innerHTML = saranHtml;
        document.getElementById('saranArea').style.display = "block";
    } else { document.getElementById('saranArea').style.display = "none"; }
    document.getElementById('resultAreaNama').style.display = "block";
}

function hitungWeton() {
    const tgl = document.getElementById('tanggalInput').value, jam = document.getElementById('jamInput').value;
    if (!tgl) { alert("Pilih tanggal lahir!"); return; }
    let utcMs = Date.UTC(new Date(tgl).getFullYear(), new Date(tgl).getMonth(), new Date(tgl).getDate());
    if (jam && parseInt(jam.split(':')[0]) >= 18) {
        utcMs += 86400000; 
        document.getElementById('alertMaghrib').style.display = "block";
    } else { document.getElementById('alertMaghrib').style.display = "none"; }

    const d = new Date(utcMs);
    const res = getInfoWetonUtama(`${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+d.getUTCDate()).slice(-2)}`);
    document.getElementById('wetonResult').innerText = `${res.namaHari} ${res.namaPasaran}`;
    document.getElementById('neptuResult').innerHTML = `Neptu: ${res.nHari} + ${res.nPasaran} = <b>${res.totalNeptu}</b>`;
    
    const watakWeton = {
        7: "Sempit rezekinya, suka menyendiri.", 8: "Cenderung emosi, namun teguh pendirian.",
        9: "Mudah bergaul, lincah, mudah dipengaruhi.", 10: "Penyabar, tenang, penyimpan rahasia.",
        11: "Berani, mandiri, berjiwa pemimpin.", 12: "Cinta damai, suka mengalah, pemaaf.",
        13: "Kharismatik, berjiwa petualang.", 14: "Pekerja keras, cekatan, pelindung.",
        15: "Tegas, berwibawa, pantang dilecehkan.", 16: "Sabar, ramah, dan bisa diandalkan.",
        17: "Pekerja ulet, pendiam, teguh.", 18: "Berwibawa tinggi, berpotensi jadi tokoh."
    };
    
    document.getElementById('watakResult').innerHTML = `<strong>Karakter Umum (Neptu ${res.totalNeptu}):</strong><br>${watakWeton[res.totalNeptu] || "Karakter unik."}`;
    document.getElementById('resultAreaWeton').style.display = "block";
}

const maknaNikah = {
    1: { gelar: "Sandang (Sisa 1)", arti: "Sangat Baik. Rezeki pakaian & pangan cukup." },
    2: { gelar: "Pangan (Sisa 2)", arti: "Sangat Baik. Tidak akan pernah kelaparan." },
    3: { gelar: "Gedhong (Sisa 3)", arti: "Paling Baik. Diramalkan sukses, banyak aset." },
    4: { gelar: "Loro (Sisa 4)", arti: "Buruk. Rentan terhadap penyakit/masalah." },
    0: { gelar: "Pati (Sisa 5/0)", arti: "Sangat Buruk. Pantang dipilih, bawa perpisahan." }
};

function hitungNikah() {
    const tglS = document.getElementById('tglSuami').value, tglI = document.getElementById('tglIstri').value, tglN = document.getElementById('tglNikah').value;
    if (!tglS || !tglI || !tglN) { alert("Lengkapi ketiga tanggal!"); return; }

    const nS = getInfoWetonUtama(tglS), nI = getInfoWetonUtama(tglI), nN = getInfoWetonUtama(tglN);
    let sisa = (nS.totalNeptu + nI.totalNeptu + nN.totalNeptu) % 5;

    document.getElementById('pasanganTeks').innerHTML = `<div><b>Suami</b><br>${nS.namaHari} ${nS.namaPasaran} (${nS.totalNeptu})</div><div class="plus">➕</div><div><b>Istri</b><br>${nI.namaHari} ${nI.namaPasaran} (${nI.totalNeptu})</div>`;
    document.getElementById('rincianNikah').innerHTML = `Total Neptu Pasangan: <b>${nS.totalNeptu + nI.totalNeptu}</b><br>Neptu Hari Nikah: <b>${nN.totalNeptu}</b><br>Total Keseluruhan: <b>${nS.totalNeptu + nI.totalNeptu + nN.totalNeptu}</b> ÷ 5 = Sisa <b>${sisa}</b>`;
    document.getElementById('hasilCardNikah').className = `hasil-card sisa-${sisa}`;
    document.getElementById('hasilGelarNikah').innerText = `Jatuh pada: ${maknaNikah[sisa].gelar}`;
    document.getElementById('hasilDeskripsiNikah').innerText = maknaNikah[sisa].arti;

    if (sisa === 0 || sisa === 4) {
        const dateN = new Date(tglN), thn = dateN.getFullYear(), bln = dateN.getMonth();
        const jmlHari = new Date(thn, bln + 1, 0).getDate();
        document.getElementById('judulRek').innerText = `Rekomendasi Hari di Bulan ${namaBulan[bln]} ${thn}:`;
        let rekHtml = "";
        for (let d = 1; d <= jmlHari; d++) {
            const nLoop = getInfoWetonUtama(`${thn}-${('0'+(bln+1)).slice(-2)}-${('0'+d).slice(-2)}`);
            const sisaLoop = (nS.totalNeptu + nI.totalNeptu + nLoop.totalNeptu) % 5;
            if (sisaLoop >= 1 && sisaLoop <= 3) {
                rekHtml += `<div class="rek-item ${sisaLoop===3?'gedhong':''}"><span><b>${d} ${namaBulan[bln]}</b> (${nLoop.namaHari} ${nLoop.namaPasaran})</span><span>${sisaLoop===3?'💎':'✨'} ${maknaNikah[sisaLoop].gelar.split(" ")[0]}</span></div>`;
            }
        }
        document.getElementById('rekList').innerHTML = rekHtml;
        document.getElementById('rekArea').style.display = "block";
    } else { document.getElementById('rekArea').style.display = "none"; }
    document.getElementById('resultAreaNikah').style.display = "block";
}

function hitungNaas() {
    const tgl = document.getElementById('tglNaas').value, jam = document.getElementById('jamNaas').value;
    if (!tgl) { alert("Pilih tanggal lahir Anda!"); return; }
    let utcMs = Date.UTC(new Date(tgl).getFullYear(), new Date(tgl).getMonth(), new Date(tgl).getDate());
    if (jam && parseInt(jam.split(':')[0]) >= 18) {
        utcMs += 86400000; 
        document.getElementById('alertMaghribNaas').style.display = "block";
    } else { document.getElementById('alertMaghribNaas').style.display = "none"; }

    const d = new Date(utcMs);
    const res = getInfoWetonUtama(`${d.getUTCFullYear()}-${('0'+(d.getUTCMonth()+1)).slice(-2)}-${('0'+d.getUTCDate()).slice(-2)}`);
    document.getElementById('naasKelahiran').innerText = `${res.namaHari} ${res.namaPasaran}`;
    document.getElementById('naasWasTiga').innerText = `${hariArray[(res.dayIndex + 2) % 7]} ${pasaranArray[(res.pasaranIndex + 2) % 5]}`;
    document.getElementById('naasWasPapat').innerText = `${hariArray[(res.dayIndex + 3) % 7]} ${pasaranArray[(res.pasaranIndex + 3) % 5]}`;
    document.getElementById('resultAreaNaas').style.display = "block";
}

function hitungSelamatan() {
    const tgl = document.getElementById('tglMati').value, jam = document.getElementById('jamMati').value;
    if (!tgl) { alert("Pilih tanggal wafat!"); return; }
    let utcMs = Date.UTC(new Date(tgl).getFullYear(), new Date(tgl).getMonth(), new Date(tgl).getDate());
    if (jam && parseInt(jam.split(':')[0]) >= 18) {
        utcMs += 86400000; 
        document.getElementById('alertMaghribMati').style.display = "block";
    } else { document.getElementById('alertMaghribMati').style.display = "none"; }

    const tglAwal = new Date(utcMs);
    const resAwal = getInfoWetonUtama(`${tglAwal.getUTCFullYear()}-${('0'+(tglAwal.getUTCMonth()+1)).slice(-2)}-${('0'+tglAwal.getUTCDate()).slice(-2)}`);
    document.getElementById('geblagTeks').innerText = `${formatTanggalIndo(tglAwal)} (${resAwal.namaHari} ${resAwal.namaPasaran})`;

    const siklusMati = [
        { judul: "Nelung Dina (3 Hari)", tambahHari: 2 },
        { judul: "Mitung Dina (7 Hari)", tambahHari: 6 },
        { judul: "Matang Puluh (40 Hari)", tambahHari: 39 },
        { judul: "Nyatus (100 Hari)", tambahHari: 99 },
        { judul: "Mendhak Pisan (1 Tahun)", tambahHari: 354 },
        { judul: "Mendhak Pindho (2 Tahun)", tambahHari: 708 },
        { judul: "Nyewu (1000 Hari)", tambahHari: 999 }
    ];

    const sekarangMs = new Date().getTime(); 
    const selisihHari = Math.floor((sekarangMs - utcMs) / 86400000);
    let nHaul = Math.floor(selisihHari / 354) + 1;
    if (nHaul < 3) nHaul = 3;

    siklusMati.push({ judul: `📍 Haul Ke-${nHaul} (Terdekat)`, tambahHari: nHaul * 354 });
    siklusMati.push({ judul: `Haul Ke-${nHaul + 1} (Selanjutnya)`, tambahHari: (nHaul + 1) * 354 });

    let htmlMati = "";
    siklusMati.forEach(item => {
        let msTarget = utcMs + (item.tambahHari * 86400000);
        let tglTarget = new Date(msTarget);
        let resTarget = getInfoWetonUtama(`${tglTarget.getUTCFullYear()}-${('0'+(tglTarget.getUTCMonth()+1)).slice(-2)}-${('0'+tglTarget.getUTCDate()).slice(-2)}`);
        let highlightInline = item.judul.includes("Terdekat") ? 'style="background-color: #fff8e1; border-left-color: #fbc02d;"' : '';
        htmlMati += `<div class="rek-item mati-item" ${highlightInline}><span><b>${item.judul}</b><br><span style="font-size:12px; color:#666;">${formatTanggalIndo(tglTarget)}</span></span><span style="text-align:right; font-weight:bold; color:var(--primary-mati);">${resTarget.namaHari} <br> ${resTarget.namaPasaran}</span></div>`;
    });
    document.getElementById('listSelamatan').innerHTML = htmlMati;
    document.getElementById('resultAreaMati').style.display = "block";
}

const tahunAbogeMap = {
    'Alip': { hari: 3, pasaran: 3, nama: 'Aboge (Rebo Wage)' },
    'Ehe': { hari: 0, pasaran: 2, nama: 'Ekatpon (Ahad Pon)' },
    'Jimawal': { hari: 5, pasaran: 2, nama: 'Walmahpon (Jumat Pon)' },
    'Je': { hari: 2, pasaran: 1, nama: 'Jesoing (Selasa Pahing)' },
    'Dal': { hari: 6, pasaran: 0, nama: 'Daltugi (Sabtu Legi)' },
    'Be': { hari: 4, pasaran: 0, nama: 'Bemisgi (Kamis Legi)' },
    'Wawu': { hari: 1, pasaran: 4, nama: 'Wunenwon (Senin Kliwon)' },
    'Jimakhir': { hari: 5, pasaran: 3, nama: 'Kirmahge (Jumat Wage)' }
};

const rumusBulanAboge = [
    { bulan: "1. Sura", rumusNama: "Ram-ji-ji (1-1)", offsetHari: 0, offsetPasaran: 0 },
    { bulan: "2. Sapar", rumusNama: "Par-lu-ji (3-1)", offsetHari: 2, offsetPasaran: 0 },
    { bulan: "3. Mulud", rumusNama: "Ngual-pat-ma (4-5)", offsetHari: 3, offsetPasaran: 4 },
    { bulan: "4. Bakda Mulud", rumusNama: "Ngukhir-nem-mo (6-5)", offsetHari: 5, offsetPasaran: 4 },
    { bulan: "5. Jumadil Awal", rumusNama: "Diwal-tu-pat (7-4)", offsetHari: 6, offsetPasaran: 3 },
    { bulan: "6. Jumadil Akhir", rumusNama: "Dikher-ro-pat (2-4)", offsetHari: 1, offsetPasaran: 3 },
    { bulan: "7. Rejeb", rumusNama: "Jab-lu-lu (3-3)", offsetHari: 2, offsetPasaran: 2 },
    { bulan: "8. Ruwah", rumusNama: "Ban-mo-lu (5-3)", offsetHari: 4, offsetPasaran: 2 },
    { bulan: "9. Pasa / Ramadhan", rumusNama: "Dhon-nem-ro (6-2)", offsetHari: 5, offsetPasaran: 1 },
    { bulan: "10. Sawal / Lebaran", rumusNama: "Wal-ji-ro (1-2)", offsetHari: 0, offsetPasaran: 1 },
    { bulan: "11. Dulkangidah", rumusNama: "Dah-ro-ji (2-1)", offsetHari: 1, offsetPasaran: 0 },
    { bulan: "12. Besar / Haji", rumusNama: "Jah-pat-ji (4-1)", offsetHari: 3, offsetPasaran: 0 }
];

function hitungAbogeLama() {
    const tahunKey = document.getElementById('tahunAbogeSelect').value;
    const infoTahun = tahunAbogeMap[tahunKey];

    document.getElementById('namaTahunAboge').innerText = `Tahun ${tahunKey}`;
    document.getElementById('rumusAwalAboge').innerText = `1 Sura: ${infoTahun.nama}`;

    let gridHtml = '';
    rumusBulanAboge.forEach(bln => {
        const hIndex = (infoTahun.hari + bln.offsetHari) % 7;
        const pIndex = (infoTahun.pasaran + bln.offsetPasaran) % 5;
        const isHighlight = ['9. Pasa / Ramadhan', '10. Sawal / Lebaran', '12. Besar / Haji'].includes(bln.bulan);
        gridHtml += `<div class="${isHighlight ? 'aboge-bulan highlight' : 'aboge-bulan'}"><b>${bln.bulan}</b><br><span style="font-size:10px; color:#777;">${bln.rumusNama}</span><span class="weton">${hariArray[hIndex]} ${pasaranArray[pIndex]}</span></div>`;
    });
    document.getElementById('abogeGrid').innerHTML = gridHtml;
    document.getElementById('resultAreaAboge').style.display = 'block';
}

function transliterasiKeJawa(input) {
    let str = input.replace(/E/g, 'é').toLowerCase()
        .replace(/nj/g, 'Yj') 
        .replace(/nc/g, 'Yc') 
        .replace(/ng/g, 'N')
        .replace(/ny/g, 'Y')
        .replace(/th/g, 'T')
        .replace(/dh/g, 'D');

    const aksara = {
        'h':'ꦲ', 'n':'ꦤ', 'c':'ꦕ', 'r':'ꦫ', 'k':'ꦏ',
        'd':'ꦢ', 't':'ꦠ', 's':'ꦱ', 'w':'ꦮ', 'l':'ꦭ',
        'p':'ꦥ', 'j':'ꦗ', 'y':'ꦪ', 'm':'ꦩ', 'g':'ꦒ',
        'b':'ꦧ', 'T':'ꦛ', 'D':'ꦝ', 'Y':'ꦚ', 'N':'ꦔ'
    };
    const sandhangan = {
        'a':'', 'i':'ꦶ', 'u':'ꦸ', 
        'e':'ꦼ', 'x':'ꦼ', 
        'é':'ꦺ', 'è':'ꦺ', 
        'o':'ꦺꦴ'
    };
    const sigeg = { 'N':'ꦁ', 'r':'ꦂ', 'h':'ꦃ' }; 
    const angka = {'0':'꧐','1':'꧑','2':'꧒','3':'꧓','4':'꧔','5':'꧕','6':'꧖','7':'꧗','8':'꧘','9':'꧙'};
    const pangkon = '꧀';

    let res = "";
    let i = 0;
    
    while (i < str.length) {
        let c = str[i];
        let next1 = str[i+1];

        if (aksara[c]) {
            if (next1 && sandhangan[next1] !== undefined) {
                res += aksara[c] + sandhangan[next1];
                i += 2;
            } else {
                let isSpecialSigeg = false;
                if (c === 'r' || c === 'h') isSpecialSigeg = true;
                if (c === 'N' && next1 !== 'g' && next1 !== 'k') isSpecialSigeg = true;

                if (isSpecialSigeg) {
                    res += sigeg[c];
                } else {
                    res += aksara[c] + pangkon;
                }
                i++;
            }
        } else if (sandhangan[c] !== undefined) {
            res += aksara['h'] + sandhangan[c];
            i++;
        } else if (angka[c]) {
            res += angka[c];
            i++;
        } else {
            res += c;
            i++;
        }
    }
    return res;
}

function salinAksara() {
    const outputText = document.getElementById('aksaraOutput').innerText;
    if (!outputText.trim()) { alert("Belum ada teks aksara yang bisa disalin!"); return; }
    navigator.clipboard.writeText(outputText).then(() => {
        const btn = document.getElementById('btnSalinAksara');
        const originalText = btn.innerHTML;
        btn.innerHTML = "✅ Berhasil Disalin!";
        btn.style.backgroundColor = "#059669"; 
        setTimeout(() => { btn.innerHTML = originalText; btn.style.backgroundColor = "var(--accent-aksara)"; }, 2000);
    }).catch(err => { alert("Gagal menyalin teks: " + err); });
}

const kalNamaBulanJawa = ['Sura', 'Sapar', 'Mulud', 'Bakda Mulud', 'Jumadil Awal', 'Jumadil Akhir', 'Rejeb', 'Ruwah', 'Pasa', 'Sawal', 'Dulkangidah', 'Besar'];
const kalWinduNames = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakhir']; 

const KAL_ANCHOR_MS = Date.UTC(2021, 7, 11); 
const KAL_WINDU_DAYS = 2835; 
const kalYearOffsets = [0, 354, 709, 1063, 1417, 1772, 2126, 2480]; 
const kalIsLeap = [false, true, false, false, true, false, false, true]; 

const kalNagaMap = { 
    0: 'Ngalor, ngulon', 1: 'Ngetan, ngulon, ngalor', 2: 'Ngidul ngetan, ngulon', 
    3: 'Ngulon, ngidul', 4: 'Ngulon, ngalor', 5: 'Ngetan, ngulon, ngidul', 6: 'Ngidul, ngetan, ngalor' 
};
const kalArahMap = { 
    0: 'Ngidul ngulon', 1: 'Ngidul', 2: 'Ngalor', 
    3: 'Ngalor ngetan', 4: 'Ngidul ngetan', 5: 'Ngalor', 6: 'Ngulon' 
};
const kalSaatMap = {
    0: '06.00', 1: '08.00-09.00', 2: '10.00-11.11', 
    3: '06.00-12.00', 4: '08.00-09.00', 5: '09.00-10.00', 6: '08.00-09.00'
};

function getKalAboge(utcDate) {
    let diffMs = utcDate.getTime() - KAL_ANCHOR_MS;
    let dayDiff = Math.floor(diffMs / 86400000);
    let winduCycles = Math.floor(dayDiff / KAL_WINDU_DAYS);
    let daysInWindu = dayDiff - (winduCycles * KAL_WINDU_DAYS);
    let yearIdx = 0;
    for (let i = 7; i >= 0; i--) { if (daysInWindu >= kalYearOffsets[i]) { yearIdx = i; break; } }
    let daysInYear = daysInWindu - kalYearOffsets[yearIdx];
    let isLeap = kalIsLeap[yearIdx];
    const monthOffsets = isLeap ? [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325] : [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 324];
    let monthIdx = 0;
    for (let i = 11; i >= 0; i--) { if (daysInYear >= monthOffsets[i]) { monthIdx = i; break; } }
    let javaDay = daysInYear - monthOffsets[monthIdx] + 1;
    let javaYear = 1955 + (winduCycles * 8) + yearIdx;
    return { javaDay, javaMonth: kalNamaBulanJawa[monthIdx], javaYear, namaTahun: kalWinduNames[yearIdx] };
}

function getKalSiklus(utcDate) {
    const daysSinceEpoch = Math.floor(utcDate.getTime() / 86400000);
    let dWeek = new Date(utcDate).getUTCDay(); 
    let pasaranIdx = (((daysSinceEpoch % 5) + 5) % 5 + 3) % 5; 
    let neptuTot = neptuHariMap[dWeek] + neptuPasaranMap[pasaranIdx];
    return {
        hariIdx: dWeek, namaHari: hariArray[dWeek],
        pasIdx: pasaranIdx, namaPasaran: pasaranArray[pasaranIdx],
        totalNeptu: neptuTot,
        nagaHari: kalNagaMap[dWeek], arahBaik: kalArahMap[dWeek], saatHari: kalSaatMap[dWeek]
    };
}

let globalKalData = {}; 

function renderHeaderKalender() {
    const h = document.getElementById('gridHeaderKalender');
    h.innerHTML = '';
    hariArray.forEach((hari, i) => {
        h.innerHTML += `<div class="kalender-day-name ${i===0?'sunday':''}">${hari}</div>`;
    });
}

function renderKalenderPro() {
    const bln = parseInt(document.getElementById('bulanInputKalender').value);
    const thn = parseInt(document.getElementById('tahunInputKalender').value);
    if(thn < 1900) { alert("Minimal tahun 1900 ke atas!"); return; }

    const grid = document.getElementById('calendarGridKalender');
    grid.innerHTML = '';
    globalKalData = {};

    const firstDay = new Date(thn, bln, 1).getDay();
    const daysInMonth = new Date(thn, bln + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) {
        grid.innerHTML += `<div class="kalender-cell empty"></div>`;
    }

    for(let d=1; d<=daysInMonth; d++) {
        let utcTarget = new Date(Date.UTC(thn, bln, d));
        let aboge = getKalAboge(utcTarget);
        let siklus = getKalSiklus(utcTarget);

        let isSunday = siklus.hariIdx === 0;
        let divId = `kal_${d}`;

        globalKalData[divId] = {
            masehi: `${d} ${namaBulan[bln]} ${thn}`,
            jawaStr: `${siklus.namaHari} ${siklus.namaPasaran}, ${aboge.javaDay} ${aboge.javaMonth} ${aboge.javaYear} J`,
            neptu: `${siklus.totalNeptu}`,
            naga: siklus.nagaHari,
            arah: siklus.arahBaik,
            saat: siklus.saatHari,
            tahunJawa: `${aboge.namaTahun}`
        };

        grid.innerHTML += `
            <div class="kalender-cell" onclick="openModalKalender('${divId}')">
                <div class="kal-date-masehi ${isSunday?'sunday':''}">${d}</div>
                <div>
                    <div class="kal-jawa-info">${siklus.namaPasaran}</div>
                    <div class="kal-jawa-date">${aboge.javaDay} ${aboge.javaMonth}</div>
                </div>
            </div>
        `;
    }
}

function openModalKalender(id) {
    const data = globalKalData[id];
    document.getElementById('kalModalMasehi').innerText = data.masehi;
    document.getElementById('kalModalJawa').innerText = data.jawaStr;
    document.getElementById('kNeptu').innerText = data.neptu;
    document.getElementById('kSaat').innerText = data.saat;
    document.getElementById('kNaga').innerText = data.naga;
    document.getElementById('kArah').innerText = data.arah;
    document.getElementById('kTahunJawa').innerText = data.tahunJawa;
    document.getElementById('modalDetailKalender').style.display = 'flex';
}

function closeModalKalender(e) {
    if (e === true || e.target.id === 'modalDetailKalender') {
        document.getElementById('modalDetailKalender').style.display = 'none';
    }
}

const dbName = "PrimbonData";
const storeName = "userInputs";
let db;

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadInputsFromDB();
    setupInputListeners();
};

function saveInputToDB(id, value) {
    if (!db) return;
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.put(value, id);
}

function loadInputsFromDB() {
    if (!db) return;
    const inputIds = [
        'namaInput', 'tanggalInput', 'jamInput', 
        'tglSuami', 'tglIstri', 'tglNikah', 
        'tglNaas', 'jamNaas', 
        'tglMati', 'jamMati', 'tahunAbogeSelect', 'aksaraInput'
    ];
    
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    
    inputIds.forEach(id => {
        const request = store.get(id);
        request.onsuccess = function() {
            if (request.result !== undefined) {
                const el = document.getElementById(id);
                if (el) {
                    el.value = request.result;
                    if(id === 'aksaraInput') {
                        document.getElementById('aksaraOutput').innerHTML = transliterasiKeJawa(request.result);
                    }
                }
            }
        };
    });
}

function setupInputListeners() {
    const inputIds = [
        'namaInput', 'tanggalInput', 'jamInput', 
        'tglSuami', 'tglIstri', 'tglNikah', 
        'tglNaas', 'jamNaas', 
        'tglMati', 'jamMati', 'tahunAbogeSelect', 'aksaraInput'
    ];
    
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => saveInputToDB(id, e.target.value));
            el.addEventListener('input', (e) => saveInputToDB(id, e.target.value));
        }
    });
    
    const aksaraInputEl = document.getElementById('aksaraInput');
    if (aksaraInputEl) {
        aksaraInputEl.addEventListener('input', function() {
            document.getElementById('aksaraOutput').innerHTML = transliterasiKeJawa(this.value);
        });
    }
}
