## 1. SUMMARY
The API should enable a client to create users (name and email address will suffice) and reservations. Users must be unique by their email address and they must be in relation with reservations. The client should be also able to fetch the list of existing reservations given a date range.
For simplicity, we assume that the restaurant has five tables each with four seats, seating time is one hour and the restaurant is opened every day between 19:00 and 24:00.

We'll use this exercise to evaluate your skills on software engineering, code quality, error handling, type safety and dependency management.

<b>Requirements</b>
- The application must be developed for Node.js. We prefer TypeScript. If you're not comfortable with it, you can use JavaScript;
- You're free to use any framework and library that you think best;
- Data must be stored in a SQL database of your choice;
- Overbooking is not allowed.

<b>Nice to have</b>
- Paginated result for the reservation list;
- We embrace functional programming paradigms, we would be happy to see how much familiar you are with it;
- A Dockerfile for the application and a docker-compose file to run the whole ecosystem;
- OpenAPI documentation;
- Feel free to add validation rules in addition to the required ones.

## 2. WHAT I DID
- A REST API app using:
  - TypeScript -> NestJs framework
  - PostgreSQL -> Using Prisma for connection and ORM
  - Docker -> Dockerfile and docker-compose for build
  - Add OpenAPI documentation with examples
- Since we can check the exact endpoints with params and example when running code and go to `http://localhost:3000/api`, I'll not write the endpoints here, but basically, we have:
  - users
    - model with simple `name` and `email`
    - `email` should be unique
    - pagination when fetching users
  - reservations
    - model with 
      - `reservatedAt` for reserved time
      - `userId` for user relation
      - `tableNumber` for reserved table number (since we don't have table model, we'll use number for simplicity)
      - `numberOfGuests` for number of guests
    - pagination when fetching reservations list
    - we can specify time range to fetch reservations
- Other things:
  - Use environment variables for configurations as you can see from .env.example
    - POSTGRES_USER -> postgres username to run docker
    - POSTGRES_PASSWORD -> postgres password to run docker
    - POSTGRES_DB -> postgres database name to run docker
    - NUMBER_OF_SEATS -> to configure max number of seats for each table. The requirement only says 4 seats for each table, but I added this for flexibility
    - SEAT_DURATION -> to configure seat duration. The requirement only says 1 hour, but I added this for flexibility
    - START_HOUR -> to configure start hour for restaurant. The requirement only says 19:00, but I added this for flexibility
    - END_HOUR -> to configure end hour for restaurant. The requirement only says 24:00, but I added this for flexibility
    - TOTAL_TABLES -> to configure total number of tables. The requirement only says 5 tables, but I added this for flexibility. Since we don't have `table` model, so I use the number for table number and to validate if the request for reservation is valid
    - DATABASE_URL -> keep it as in .env.example for prisma connection
  - Some validation rules
    - user's `email` should be in email format and be unique
    - reservation's `reservatedAt` should be in iso date format
    - reservation's `reservatedAt` should be between `START_HOUR` and (`END_HOUR` minus `SEAT_DURATION`)
    - reservation's `tableNumber` should be in range of 1 to `TOTAL_TABLES`
    - reservation's `numberOfGuests` should be in range of 1 to `NUMBER_OF_SEATS`
    - reservation's `userId` should be valid user id
    - reservation's `reservatedAt` on same table should not be overlapped with other reservations (including the seat duration)
  - Dockerfile and docker-compose for build
  - OpenAPI documentation with examples
- Notes:
  - As functional programming is embraced, but my chosen library NestJs is using OOP, so I'll try to use functional programming as much as possible