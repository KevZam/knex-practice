require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function getAllText(searchTerm) {
  if (typeof searchTerm !== typeof "") {
    return console.log("No");
  }
  knexInstance
    .select("*")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// getAllText("Fish");

function getAllPaginated(pageNum) {
  knexInstance
    .select("*")
    .from("shopping_list")
    .limit(6)
    .offset(6 * (pageNum - 1))
    .then(result => {
      console.log(result);
    });
}

// getAllPaginated(2);

function getAllItemsAfterDate(daysAgo) {
  knexInstance
    .select("*")
    .count("date_added AS added")
    .where(
      "added",
      ">",
      knexInstance.raw(`now() - '?? daysAgo'::INTERVAL`, daysAgo)
    )
    .from("shopping_list")
    .orderBy([{ column: "added", order: "DESC" }])
    .then(result => {
      console.log(result);
    });
}

function getTotalCost() {
  knexInstance
    .select("category")
    .sum("price")
    .from("shopping_list")
    .groupBy("category")
    .then(results => {
      console.log(results);
    });
}

getTotalCost();
