exports.up = function (knex) {
  return knex.schema.alterTable("reservations", function (table) {
    table.string("last_name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("last_name");
  });
};
