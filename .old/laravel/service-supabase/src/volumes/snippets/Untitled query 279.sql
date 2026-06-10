SELECT setval(
  pg_get_serial_sequence('mdb_movie', 'id'),
  COALESCE((SELECT max(id) FROM mdb_movie), 0) + 1,
  false
);
