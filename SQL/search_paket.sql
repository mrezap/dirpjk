SELECT
	lls_id,
	--paket.pkt_id,
	paket.pkt_nama,
	paket.pkt_pagu,
	paket.ukpbj_id,
	ukpbj.nama,
	panitia.pnt_nama
	--lls_status, lls_penawaran_ulang, lls_evaluasi_ulang
FROM
	PUBLIC.paket
JOIN
	PUBLIC.ukpbj
	ON paket.ukpbj_id = ukpbj.ukpbj_id
JOIN
	PUBLIC.lelang_seleksi
	ON paket.pkt_id = lelang_seleksi.pkt_id
JOIN
	PUBLIC.panitia
	ON paket.pnt_id = panitia.pnt_id
WHERE
paket.pkt_nama LIKE '%Preservasi%' --OR --lelang_seleksi.lls_id = 74198064
ORDER BY 1 DESC;
