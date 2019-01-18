# astmCobasC311
Interface para el analizador Cobas C311

*Pasos a seguir para la ejecucion de la app.*

`git clone https://github.com/RedTICS/astmCobasC311.git`

`npm i`

Crear el archivo config.private.json basandose en el config.private.json.example y configurarlo como corresponda

El proyecto usa sequelize para conectarse a la base de datos sqlite3

`sequelize db:migrate:undo:all | sequelize db:migrate`

`sequelize db:seed:undo:all | sequelize db:seed:all`
