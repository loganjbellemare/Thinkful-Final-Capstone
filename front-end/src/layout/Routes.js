import React, { useState } from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "./reservations/ReservationForm";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservation, setReservation] = useState("");
  const [dateState, setDateState] = useState(today);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const history = useHistory();

  useEffect(updateDate, [dateState]);

  function updateDate() {
    if (date) {
      return;
    }
    updateQueryParam(today());
  }

  function updateQueryParam(newDate) {
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date : today} setDateState={setDateState} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
