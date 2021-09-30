SELECT
	paket_sirup.tahun AS tahun_rup,
	ukpbj.nama AS bp2jk_wil,
    	lelang_seleksi.lls_id AS kode_spse,
    	paket.pkt_nama AS nama_paket,
	paket.pkt_pagu AS pagu_pengadaan,
	CASE 
   		WHEN kategori.keterangan LIKE '%Jasa Konsultansi%' THEN 'JK'
    		WHEN kategori.keterangan LIKE '%Pekerjaan Konstruksi%' THEN 'PK'
    	ELSE 'Lainnya'
  	END AS jenis_pengadaan,
	--lelang_seleksi.lls_status,
	--lelang_seleksi.lls_penawaran_ulang,
	--lelang_seleksi.lls_evaluasi_ulang,
	CASE
		WHEN lelang_seleksi.lls_penawaran_ulang > 0 THEN 'Penawaran Ulang'
		WHEN lelang_seleksi.lls_evaluasi_ulang > 0 THEN 'Evaluasi Ulang'
		WHEN lelang_seleksi.lls_status = 2 THEN 'Tender Ulang'
		ELSE ''
	END AS status
FROM
	PUBLIC.lelang_seleksi
JOIN
	PUBLIC.paket
	ON lelang_seleksi.pkt_id = paket.pkt_id
JOIN
	PUBLIC.ukpbj
	ON paket.ukpbj_id = ukpbj.ukpbj_id
JOIN
	PUBLIC.kategori
	ON paket.kgr_id = kategori.kgr_id
JOIN
	PUBLIC.paket_satker
	ON paket.pkt_id = paket_satker.pkt_id
JOIN
	PUBLIC.paket_sirup
	ON paket_satker.rup_id = paket_sirup.id
WHERE
paket_sirup.tahun = 2021 --you can adjust year in here as depends on paket year thats regist in SIRUP
AND (lelang_seleksi.lls_penawaran_ulang = 1 OR lelang_seleksi.lls_evaluasi_ulang = 1) --as information paket thats have value 1 in this field is "p/e ulang"
ORDER BY 7 DESC, 2 ASC
