dalej:
Po wejsciu na session page fetch całości danych
reszte dopisywac do listy co przychodzi z websocketu
i moze przy kazdym wystartowaniu najpierw fetch z bazy?

pierwszy pomysl trzymac wszystkie pomiary w tablicy
i przy ewentualnym wyborze ktoregos z czujnikow filtrować do
innej tablicy, zeby nie tracic danych zeby nie trzeba bylo refetchowac

moze ustawic interwal na 5/10 sekund defaultowy?
(mozna to ustawic jako zmienne na plytce, jako ficzer do rozszerzenia kiedys hehe)

trzeba zrobic wysylanie na start id sesji
i wyrzucenie tworzenia z backendu, tylko dopisywanie
nowych readingow z tym id
start stop ma byc samym sluchaniem i ew azpisywaniem readingow
stanem sesji zarządza fullstackowa apka.
