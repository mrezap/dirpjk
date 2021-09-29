SELECT
	lelang_seleksi.lls_id AS kode_tender_spse,
	paket.pkt_nama AS nama_paket,
	ukpbj.nama AS bp2jk_wil,
	tahapan.thp_name AS tahapan_paket,
	date(jadwal.dtj_tglawal) AS dari_tgl,
	date(jadwal.dtj_tglakhir) AS sampai_tgl,
	lls_status AS status_lelang,
	lls_penawaran_ulang AS p_ulang,
	lls_evaluasi_ulang AS e_ulang,
	paket_sirup.tahun AS sirup_tahun
FROM
	PUBLIC. paket

JOIN
	PUBLIC. ukpbj
ON paket.ukpbj_id = ukpbj.ukpbj_id
JOIN
	PUBLIC. lelang_seleksi
ON paket.pkt_id = lelang_seleksi.pkt_id
JOIN
	PUBLIC.	paket_satker
ON paket.pkt_id = paket_satker.pkt_id
JOIN
	PUBLIC.	paket_sirup
ON paket_satker.rup_id = paket_sirup.id
JOIN
	PUBLIC.	jadwal
ON lelang_seleksi.lls_id = jadwal.lls_id
JOIN
	PUBLIC.	tahapan
ON jadwal.thp_id = tahapan.thp_id

WHERE
(lelang_seleksi.lls_status < 2 AND lelang_seleksi.lls_status > 0)
AND jadwal.thp_id = 18804
AND jadwal.dtj_tglawal IS NOT NULL
AND paket_sirup.tahun = 2021;
