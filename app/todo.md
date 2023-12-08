roadmap:
dodac do schemy wedzenia pola finished: bool,
to wtedy:

- zmienic handler start na BE, ze jak przekaze sie param sesji to się ją wznawia
  i wysyla dane do bazy o danym id i ustawia ją jako current
- stop bez zmian
- trzeba zrobic serwer akcje na zapisanie do bazy ze jest finished po przyjsciu
  zwrotki z sukcesem z expressowego handlera stop

DUZY PLUS: na FE jest wtedy wspólny dynamiczny route z [id],
jezeli nie jest zakonczona to wyswietla sie panel
start, pause, finish

pause jedynie stopuje zapis do bazy ale nie ma finished true
