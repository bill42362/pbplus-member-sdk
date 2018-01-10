// CalendarContainer.js
import { connect } from 'react-redux';
import React from 'react';
import Calendar from './Calendar.js';
import { PbplusCalendar } from 'pbplus-member-ui';

const CalendarContainer = connect(
    (state, ownProps) => {
        const { calendar } = state.pbplusMemberCenter;
        const eventsWithDate = calendar.events
        .map(event => Object.assign({}, event, {date: new Date(event.event_start_date)}));
        const promotionsWithDate = calendar.promotions
        .map(promotion => Object.assign({}, promotion, {date: new Date(promotion.event_start_date)}));
        return Object.assign({}, calendar, {events: eventsWithDate, promotions: promotionsWithDate});
    },
    (dispatch, ownProps) => {
        const { memberCenterBaseUrl } = ownProps;
        return {
            fetchCommingEvents: () => {
                return dispatch(Calendar.Actions.fetchCommingEvents({ memberCenterBaseUrl }));
            },
            selectDate: ({ date }) => { dispatch(Calendar.Actions.updateSelectedDate({ date })); },
            goThisMonth: () => {
                const today = new Date();
                dispatch(Calendar.Actions.updateMonth({month: today.getMonth(), year: today.getFullYear()}));
            },
            goPreviousMonth: ({ currentYear, currentMonth }) => {
                const previousMonthDate = new Date(currentYear, currentMonth - 1);
                dispatch(Calendar.Actions.updateMonth({
                    month: previousMonthDate.getMonth(),
                    year: previousMonthDate.getFullYear()
                }));
            },
            goNextMonth: ({ currentYear, currentMonth }) => {
                const nextMonthDate = new Date(currentYear, currentMonth + 1);
                dispatch(Calendar.Actions.updateMonth({
                    month: nextMonthDate.getMonth(),
                    year: nextMonthDate.getFullYear()
                }));
            },
        };
    }
)(PbplusCalendar);

export default CalendarContainer;
