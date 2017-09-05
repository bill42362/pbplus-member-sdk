// CalendarContainer.js
import { connect } from 'react-redux';
import React from 'react';
import Calendar from './Calendar.js';
import { PbplusCalendar } from 'pbplus-member-ui';

const CalendarContainer = connect(
    (state, ownProps) => { return Object.assign({}, state.pbplusMemberCenter.calendar); },
    (dispatch, ownProps) => {
        return {
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
