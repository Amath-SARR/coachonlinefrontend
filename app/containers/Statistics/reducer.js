/*
 *
 * Statistics reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  SET_COACH_RANKINGS,
  SET_MONTH_BALANCE,
  SET_MONTH_MINUTES,
  SET_MONTH_STATISTICS
} from './constants';

export const initialState = {
  monthStatistics: {
    /**
     * "month": "2021-05-01T00:00:00",
     * "totalBalance": 238.49,
     * "currency": "pln",
     * "totalWatchedMinutes": 4.64,
     * "dayBalances": [
     *  {
     *    "day": "2021-05-01T00:00:00",
     *    "dayBalance": 0.0,
     *    "totalWatchedMinutes": 0.0
     *  }
     * ]
     */
  },
  monthBalance: {
    /**
     * "month": "2021-05-01T00:00:00",
     * "totalBalanceToWithdrawCurrentMonth": 238.49,
     * "totalBalanceToWithdrawPreviousMonth": 238.49,
     * "totalBalanceCurrentMonth": 238.49,
     * "totalBalancePreviousMonth": 238.49,
     * "currency": "pln",
     * */
  },
  monthMinutes: {
    /**
     * "month": "2021-05-01T00:00:00",
     * "totalWatchedMinutesCurrentMonth": 4.49,
     * "totalWatchedMinutesPreviousMonth": 0.0,
     * */
  },
  ranking: [
    /**
     *  {
     * "month": "2021-05-01T00:00:00",
     * "coachId": 4,
     *  "rankPosition": 1,
     * "totalMinutes": 4.64,
     * "name": "Jan Kołcz Dzbanov",
     *  "category": "",
     * "joinDate": "2021-05-02T00:00:00",
     * "isMe": true
     *  }
     */
  ]
};

/* eslint-disable default-case, no-param-reassign */
const statisticsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MONTH_STATISTICS:
        draft.monthStatistics = action.payload;
        break;
      case SET_MONTH_BALANCE:
        draft.monthBalance = action.payload;
        break;
      case SET_MONTH_MINUTES:
        draft.monthMinutes = action.payload;
        break;
      case SET_COACH_RANKINGS:
        draft.ranking = action.payload;
        break;
    }
  });

export default statisticsReducer;
