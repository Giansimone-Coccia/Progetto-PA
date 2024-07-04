npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
docker-compose build
docker-compose up 
docker-compose down