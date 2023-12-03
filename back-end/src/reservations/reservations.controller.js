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
  const { data } = req.body;
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
  const { mobile_number } = req.body.data;
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
  const { reservation_date } = req.body.data;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date invalid, must match input pattern: 'YYYY-MM-DD'`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const timePattern = /^[0-9]{2}:[0-9]{2}$/;
  if (!timePattern.test(reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time invalid, must match input patter: 'HH:MM'`,
    });
  }
  next();
}

function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;
  if (!Number.isInteger(people)) {
    return next({
      status: 400,
      message: `people invalid, must be an integer received: ${people}`,
    });
  }
  next();
}

//US-02 validation middleware, checks for valid date inputs
function dateOccursInPast(req, res, next) {
  const { reservation_date } = req.body.data;
  const today = new Date();
  const dateString = reservation_date.split("-");
  const dateFromReq = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (dateFromReq >= today) {
    return next();
  } else if (dateFromReq.getDay() === 2 && dateFromReq < today) {
    return next({
      status: 400,
      message: `Sorry, we're closed Tuesdays! Resevations can only be made for future dates`,
    });
  } else {
    return next({
      status: 400,
      message: `Reservations can only be made for future dates`,
    });
  }
}

function occursOnTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateString = reservation_date.split("-");
  const today = new Date();
  const dateFromReq = new Date(
    Number(dateString[0]),
    Number(dateString[1]) - 1,
    Number(dateString[2]),
    0,
    0,
    1
  );
  if (dateFromReq.getDay() === 2) {
    return next({
      status: 400,
      message: `Sorry, we're closed Tuesdays!`,
    });
  }
  next();
}

//US-03 validation middleware, validate time inputs
function timeWithinBusinessHours(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeFromReq = reservation_time.split(":");
  const hour = Number(timeFromReq[0]);
  const minute = Number(timeFromReq[1]);
  if (hour >= 10) {
    if (hour === 10) {
      if (minute >= 30) {
        return next();
      }
    }
    if (hour <= 21) {
      if (hour === 21) {
        if (minute <= 30) {
          return next();
        }
      }
      return next();
    }
  }
  if (hour <= 10 && minute < 30) {
    return next({
      status: 400,
      message: `Reservations must be made within business hours`,
    });
  }
  return next({
    status: 400,
    message: `Seating ends at 9:30 PM!`,
  });
}

//US-4 read validation middleware
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);
  if (data) {
    res.locals.reservation = data;
    return next();
  }
  return next({
    status: 404,
    message: `reservation_id not found`,
  });
}

//CRUDL middleware

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}

async function update(req, res, next) {
  const { reservation } = res.locals;
  const data = await service.update(reservation);
  res.status(200).json({ data });
}

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    bodyHas(...VALID_PROPS),
    //bodyHasValidProps,
    hasValidMobile,
    hasValidDate,
    dateOccursInPast,
    occursOnTuesday,
    hasValidTime,
    timeWithinBusinessHours,
    peopleIsNumber,
    asyncErrorBoundary(create),
  ],
};
