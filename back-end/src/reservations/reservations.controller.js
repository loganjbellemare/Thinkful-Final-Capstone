/**
 * List handler for reservation resources
 */
const bodyHas = require("../errors/bodyHas");
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validation middleware for POST/PUT methods

const VALID_PROPS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function bodyHasValidProps(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPS.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function hasValidMobile(req, res, next) {
  const { mobile_number = {} } = req.body.data;
  const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!phonePattern.test(mobile_number)) {
    return next({
      status: 400,
      message: `Mobile phone number invalid, must match input pattern: 'XXX-XXX-XXXX'`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { reservation_date = {} } = req.body.data;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(reservation_date)) {
    return next({
      status: 400,
      message: `Date invalid, must match input pattern: 'YYYY-MM-DD'`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time = {} } = req.body.data;
  const timePattern = /^[0-9]{2}:[0-9]{2}$/;
  if (!timePattern.test(reservation_time)) {
    return next({
      status: 400,
      message: `Time invalid, must match input patter: 'HH:MM'`,
    });
  }
  next();
}

//CRUDL middleware

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.sendStatus(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyHas(VALID_PROPS),
    bodyHasValidProps,
    hasValidMobile,
    hasValidDate,
    hasValidTime,
    asyncErrorBoundary(create),
  ],
};
