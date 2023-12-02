const knex = require("../db/connection");

async function create(reservation) {
  try {
    const createdRecords = await knex("reservations")
      .insert({ ...reservation })
      .returning("*");
    return createdRecords[0];
  } catch (error) {
    throw error;
  }
}

async function read(reservation_id) {
  try {
    return await knex("reservations")
      .select("*")
      .where({ reservation_id })
      .first();
  } catch (error) {
    throw error;
  }
}

async function update(reservation) {
  const { reservation_id } = reservation;
  return await knex("reservations")
    .where({ reservation_id })
    .update({ ...reservation })
    .returning("*");
}

async function list(reservation_date) {
  try {
    return await knex("reservations")
      .where({ reservation_date })
      .select("*")
      .orderBy("reservation_time");
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create,
  read,
  list,
};
