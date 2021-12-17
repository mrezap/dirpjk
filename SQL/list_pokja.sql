SELECT a.pnt_nama, c.peg_nip, c.peg_nama, c.peg_email, c.idgroup
FROM panitia a
JOIN anggota_panitia b
ON a.pnt_id = b.pnt_id
JOIN pegawai c
ON b.peg_id = c.peg_id
ORDER BY 1 ASC
