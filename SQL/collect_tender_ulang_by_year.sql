WITH temp_table_satker AS (SELECT
	sk.stk_id, sk.stk_kode, sk.stk_nama, st.satminkal AS unor, st.satm
FROM
	PUBLIC.satuan_kerja sk
JOIN
	PUBLIC.satker_satm skst
	ON sk.stk_kode = skst.stk_kode
JOIN
	PUBLIC.satm st
	ON skst.satmid = st.satmid)

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
		WHEN lelang_seleksi.lls_status = 2 THEN 'Tender Ulang'
		ELSE ''
	END AS status,
	temp_table_satker.unor AS satker_unor
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
JOIN
	temp_table_satker
	ON temp_table_satker.stk_id = paket_satker.stk_id
WHERE
paket_sirup.tahun = 2022 --you can adjust year in here as depends on paket year thats regist in SIRUP
AND	lelang_seleksi.lls_status = 2 -- as information paket thats have value 2 is "tender ulang"
ORDER BY 7 DESC, 2 ASC
