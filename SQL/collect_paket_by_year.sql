SELECT
	paket.lls_id,
	paket.pkt_id,
	paket.pkt_nama,
	paket.pkt_pagu,
	paket.ukpbj_id,
	ukpbj.nama,
	paket.lls_status,
	paket.lls_penawaran_ulang,
	paket.lls_evaluasi_ulang --, pnt_nama
FROM
	PUBLIC .paket
JOIN
	PUBLIC. ukpbj
ON paket.ukpbj_id = ukpbj.ukpbj_id
JOIN
	PUBLIC. lelang_seleksi
ON paket.pkt_id = lelang_seleksi.pkt_id
JOIN
	PUBLIC. panitia
ON paket.pnt_id = panitia.pnt_id
JOIN
	PUBLIC.	paket_satker
ON paket.pkt_id = paket_satker.pkt_id
JOIN
	PUBLIC.	paket_sirup
ON paket_satker.rup_id = paket_sirup.id

WHERE paket_sirup.tahun = 2021
;
