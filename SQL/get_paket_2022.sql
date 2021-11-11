SELECT
	lelang_seleksi.lls_id AS kode_spse,
	--lelang_seleksi.lls_id AS kode_spse,
	paket_satker.rup_id AS kode_rup,
	paket.pkt_nama AS nama_paket,
	paket_sirup.tahun AS tahun_rup,
	lelang_seleksi.lls_status AS status,
	lelang_seleksi.auditupdate AS last_update
FROM
	public.lelang_seleksi
JOIN
	public.paket
	ON lelang_seleksi.pkt_id = paket.pkt_id
JOIN
	public.paket_satker
	ON paket.pkt_id = paket_satker.pkt_id
JOIN
	public.paket_sirup
	ON paket_satker.rup_id = paket_sirup.id
WHERE
paket_sirup.tahun = 2022 AND lelang_seleksi.lls_id IS NOT NULL AND lelang_seleksi.lls_status >= 1
ORDER BY 5 DESC,6 DESC
