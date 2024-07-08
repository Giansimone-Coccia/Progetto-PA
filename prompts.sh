npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-datasets
npx sequelize-cli migration:generate --name create-contents
npx sequelize-cli migration:generate --name create-inferences
docker-compose build
docker-compose up 
docker-compose down