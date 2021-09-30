SELECT
	paket_sirup.tahun,
	ukpbj.nama, 
    	lelang_seleksi.lls_id, 
    	paket.pkt_nama, 
	paket.pkt_pagu,
	kategori.keterangan,
	--lelang_seleksi.lls_status,
	--lelang_seleksi.lls_penawaran_ulang,
	--lelang_seleksi.lls_evaluasi_ulang,
	CASE
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
AND	lelang_seleksi.lls_status = 2 -- as information paket thats have value 2 is "tender ulang"
ORDER BY 7 DESC, 2 ASC
