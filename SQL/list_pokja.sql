SELECT a.pnt_nama, c.peg_nip, c.peg_nama, c.peg_email, c.idgroup
FROM panitia a
JOIN anggota_panitia b
ON a.pnt_id = b.pnt_id
JOIN pegawai c
ON b.peg_id = c.peg_id
WHERE a.pnt_id IN (11610064,11612064,10754064,11534064,11470064,11472064,11098064,11371064,11370064,11145064,10855064,10577064,
				   11161064,10141064,10844064,10957064,10664064,10682064,10631064,10523064,10525064,
				   11440064,10647064,9477064,9381064,9297064,9621064,8939064,7763064,8705064,7762064,8120064,7965064,8232064)
ORDER BY 1 ASC