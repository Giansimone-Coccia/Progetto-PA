npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
docker-compose build
docker-compose up 
docker-compose down
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-datasets
npx sequelize-cli migration:generate --name create-contents
npx sequelize-cli migration:generate --name create-inferences