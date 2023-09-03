/**
 *
 * CreatedLiveEvents
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import messages from '../messages';
import Button from '../Button';
import { colors } from '../../utils/colors';
import history from '../../utils/history';
import { createLiveEventSaga } from '../../containers/LiveEvents/saga';
import {
  createLiveEventAction,
  getCreatedLiveEventAction,
  getCreatedLiveEventsAction,
} from '../../containers/LiveEvents/actions';
import makeSelectLiveEvents from '../../containers/LiveEvents/selectors';
import Table from '../Table';
import Image from '../Image';
import { BASE_URL } from '../../config/env';
import CourseStatus from '../CourseStatus';
import { localizeDate } from '../../utils/localize';
import Modal from '../Modal';
import useWindowSize from '../../hooks/useWindowSize';
import { FlexRow } from '../../global-styles';
// import makeSelectAuth from '../../containers/Auth/selectors';
const LogoImg = require('../../images/logo/new_logo_solo.png');

const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 45px 75px;
  @media screen and (max-width: 1024px) {
    padding: 20px 25px;
  }
`;

const Title = styled.p`
  text-transform: uppercase;
`;

const TableTitle = styled.p`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 40px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  display: flex;
  @media screen and (max-width: 1024px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 590px) {
    flex-direction: column;
  }
`;
const CreateNewEventButton = styled(Button)`
  font-size: 16px;
  padding: 15px 40px;
  width: 100%;
  max-width: 320px;
`;
const ModalWrapper = styled(FlexRow)`
  align-items: center;
`;
const PromoText = styled.p`
  font-size: 42px;
  font-weight: 600;
  color: ${colors.mainPink};
`;
const PromoWrapper = styled.div`
  width: 100%;
  max-width: 300px;
`;
const PromoPicture = styled(Image)`
  height: auto !important;
  width: 100%;
`;

export const modalStyles = ({ width, dark }) => ({
  overlay: {
    backgroundColor: dark ? `${colors.backgroundDarkBlue}E6` : `${colors.black}E6`,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    background: dark
      ? 'linear-gradient(135deg, #1B2134 0%, #121621 100%)'
      : `linear-gradient(135deg, ${colors.white} 0%, ${colors.white} 100%)`,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    width: 675,
    maxWidth: '100%',
  },
  headerTitle: {
    // fontSize: '43px',
    fontWeight: 800,
  },
});

function CreatedLiveEvents({
  liveEvents,
  getCreatedLiveEvent,
  getCreatedLiveEvents,
  createLiveEvent,
}) {
  const { width } = useWindowSize();
  const location = useLocation();
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    getCreatedLiveEvents();
  }, []);

  const createNewLiveEvent = () => {
    setModalOpened(true);
    // createLiveEvent(location);
  };

  const getLiveEvent = (item) =>
    getCreatedLiveEvent({
      id: item.eventId,
      location,
      onSuccess: () =>
        history.push(`/live/createLiveEvent/${item.eventId}`, {
          background: location,
        }),
    });

  const Event = ({ event }) => (
    <>
      <td style={{ textAlign: 'left' }}>{event.name}</td>
      <td>
        <Image src={BASE_URL + event.coverPictrueUrl} style={{ maxWidth: '40px' }} alt="image" />
      </td>
      <td>{event.categories?.[0]?.categoryName}</td>
      <td>{localizeDate(event.startDate)}</td>
      <td>{event.personQty}</td>
      <td>
        <CourseStatus status={event.state} />
      </td>
    </>
  );

  return (
    <Wrapper>
      <TableTitle>
        <Title>
          <FormattedMessage {...messages.liveEvents} />
        </Title>
        <CreateNewEventButton
          color="pink"
          disableOnFetch
          spinnerColor={colors.mainPink}
          onClick={createNewLiveEvent}
        >
          <FormattedMessage {...messages.createNewLiveEvent} />
        </CreateNewEventButton>
      </TableTitle>
      <Table
        data={[]}
        // data={liveEvents.createdLiveEvents}
        emptyListComponent={<FormattedMessage {...messages.noLiveEvents} />}
        headers={[
          {
            label: <FormattedMessage {...messages.name} />,
            style: { textAlign: 'left' },
          },
          {
            label: <FormattedMessage {...messages.coverPhoto} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.categories} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.date} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.numberOfParticipants} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.status} />,
            style: {},
          },
        ]}
        ItemComponent={({ item }) => <Event event={item} />}
        onItemClick={(item) => getLiveEvent(item)}
      />
      <Modal
        ariaHideApp={false}
        isOpened={modalOpened}
        style={modalStyles({ width })}
        onClose={() => setModalOpened(false)}
        overlayClassName="transition"
        backButtonHidden
      >
        <ModalWrapper>
          <PromoWrapper>
            <PromoPicture src={LogoImg} />
          </PromoWrapper>
          <PromoText>La fonction live sera disponible prochainement !</PromoText>
        </ModalWrapper>
      </Modal>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCreatedLiveEvents: () => dispatch(getCreatedLiveEventsAction()),
    createLiveEvent: (location) => dispatch(createLiveEventAction(location)),
    getCreatedLiveEvent: ({ id, location, onSuccess }) =>
      dispatch(getCreatedLiveEventAction({ id, location, onSuccess })),
  };
}

const mapStateToProps = createStructuredSelector({
  liveEvents: makeSelectLiveEvents(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CreatedLiveEvents);
