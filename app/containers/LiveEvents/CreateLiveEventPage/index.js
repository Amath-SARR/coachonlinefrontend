/**
 *
 * CreateLiveEventPage
 *
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import history from '../../../utils/history';
import Modal from '../../../components/Modal';
import { colors } from '../../../utils/colors';
import messages from '../messages';
import Tabs from '../../../components/Tabs';
import Input from '../../../components/Input';
import useWindowSize from '../../../hooks/useWindowSize';
import InputTextarea from '../../../components/InputTextarea';
import CategorySelector from '../../../components/CategorySelector';
import makeSelectDashboard from '../../Dashboard/selectors';
import { getCategoriesAction } from '../../Dashboard/actions';
import DatePicker from '../../../components/DatePicker';
import FileInput from '../../../components/FileInput';
import IncrementableInput from '../../../components/IncrementableInput';
import makeSelectLiveEvents from '../selectors';
import {
  getCreatedLiveEventAction,
  publishLiveEventAction,
  setCreatedLiveEventAction,
  setCurrentTabAction,
  updateCreatedLiveEventAction,
} from '../actions';
import MultiFileInput from '../../../components/MultiFileInput';
import validate from '../../../utils/validate';
import { localizeDate } from '../../../utils/localize';
import { FlexRow } from '../../../global-styles';
import ShareButtons from '../../../components/ShareButtons';
import { APPLICATION_URL } from '../../../config/env';
import { fullName } from '../../../utils/formatters';

const PeopleIcon = require('../../../images/icons/people.svg');
const HandWithCoinsIcon = require('../../../images/icons/hand-with-coins.svg');
const ClockIcon = require('../../../images/icons/clock.svg');
const CalendarIcon = require('../../../images/icons/calendar.svg');

const TabBody = styled.div`
  padding: 20px;
  min-width: 100%;
  width: 388px;
  ${(props) => props.style};
`;

const Text = styled.p`
  color: ${colors.white};
  margin-bottom: 15px;
`;
const CoachName = styled(Text)`
  font-size: 46px;
  font-weight: bold;
  text-align: center;
`;
const EventName = styled(Text)`
  text-transform: uppercase;
  font-size: 18px;
  text-align: center;
`;
const OverlayContainer = styled.div`
  position: relative;
`;
const AllSetText = styled(Text)`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;
const ColorOverlay = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  background: linear-gradient(125deg, #fcd862 0%, #fb774e 70%);
  width: 100%;
  height: 100%;
  mix-blend-mode: darken;
  pointer-events: none;
`;
const Category = styled.div`
  font-size: 12px;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  background-color: ${colors.inputBlue};
  padding: 5px;
  border-radius: 5px;
  margin: 0 5px 10px 0;
  width: fit-content;
`;

const Icon = styled.img`
  width: 100%;
  height: auto;
`;

const DateBox = styled.div`
  display: flex;
  border-radius: 10px;
  background-color: white;
  padding: 5px;
  color: black;
  font-size: 14px;
  align-items: center;
  margin-bottom: 20px;
`;
const IconWrapper = styled.div`
  width: 16px;
  height: 16px;
  filter: invert(1);
  margin-left: 5px;
`;

const modalStyles = (width) => ({
  overlay: {
    backgroundColor: colors.backgroundDarkBlue,
  },
  content: {
    inset: width < 693 ? '50% auto auto 40%' : '50% auto auto 50%',
    transform: width < 693 ? 'translate(-40%, -50%)' : 'translate(-50%, -50%)',
    backgroundColor: colors.backgroundBlue,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: 24,
    width: 696,
    maxWidth: '100%',
  },
});

export function CreateLiveEventPage({
  dashboard,
  liveEvents,
  getCategories,
  getCreatedLiveEvent,
  setCurrentTab,
  setSelectedEvent,
  updateEvent,
  publishEvent,
}) {
  const { modalType, id } = useParams();
  const { width } = useWindowSize();
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState(liveEvents.currentTab || 0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState(null);
  const [dataToSend, setDataToSend] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => () => setSelectedEvent(null), []);

  useEffect(() => {
    getCreatedLiveEvent({
      id,
      onSuccess: onGetEventSuccess,
    });
  }, [id]);

  useEffect(() => {
    setOpened(modalType === 'createLiveEvent');
  }, [modalType]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setActiveTab(liveEvents?.currentTab);
  }, [liveEvents?.currentTab]);

  const onGetEventSuccess = (data) => {
    setForm(data);
    setSelectedCategory({
      id: data?.categories?.[0]?.categoryId,
    });
    if (data?.statusStr === 'CREATED') {
      setCurrentTab(3);
    } else {
      setCurrentTab(0);
    }
  };

  const closeModal = () => {
    setOpened(false);
    setTimeout(() => history.goBack(), 100);
  };

  const onTabChange = (index) => {
    updateEvent({
      id,
      data: dataToSend,
      onSuccess: () => {
        setCurrentTab(index);
        setDataToSend({});
      },
    });
  };

  const onFieldChange = (data = {}) => {
    console.log('Fields updated', data);
    setForm({ ...form, ...data });
    setDataToSend({ ...dataToSend, ...data });
  };

  const onBlur = (fieldName, value) => {
    setErrors({
      ...errors,
      [fieldName]: validate([{ fieldName, value }])?.[fieldName],
    });
  };

  const publishLiveEvent = (nextTab) => {
    publishEvent({ id, onSuccess: () => setCurrentTab(nextTab) });
  };

  const flattenCategories = () => {
    const categories = [];
    dashboard.categories?.forEach((cat) => {
      categories.push(cat);
      if (cat?.children) {
        cat?.children?.forEach((child) => categories.push(child));
      }
    });
    return categories;
  };

  const renderTimeValues = () => {
    const startTime = new Date(liveEvents.selectedEvent?.startDate);
    const endTime = new Date(liveEvents.selectedEvent?.endDate);
    return `${startTime.getHours()}:${startTime.getMinutes()}-${endTime.getHours()}:${endTime.getMinutes()}`;
  };

  const modalStyle = modalStyles(width);
  return (
    <Modal
      ariaHideApp={false}
      isOpened={opened}
      style={modalStyle}
      onBackPress={() => onTabChange(activeTab - 1)}
      onClose={closeModal}
      overlayClassName="transition"
      withHeader
      backButtonHidden={activeTab === 0}
      headerTitle={<FormattedMessage {...messages.createNewEvent} />}
    >
      <Tabs
        onTabChange={onTabChange}
        activeIndex={activeTab}
        tabs={[
          { label: <FormattedMessage {...messages.mainInfo} /> },
          { label: <FormattedMessage {...messages.schedule} /> },
          { label: <FormattedMessage {...messages.summary} /> },
          { label: <FormattedMessage {...messages.allSet} />, locked: true },
        ]}
      >
        <TabBody>
          <Input
            redesigned
            labelName={messages.title}
            inputProps={{
              onBlur: (ev) => onBlur('name', ev.target?.value),
              onChange: (ev) => onFieldChange({ name: ev.target.value }),
              value: form?.name,
            }}
            errors={errors.name}
          />
          <InputTextarea
            redesigned
            labelName={messages.description}
            inputProps={{
              onBlur: (ev) => onBlur('description', ev.target?.value),
              onChange: (ev) =>
                onFieldChange({
                  description: ev.target.value,
                }),
              value: form?.description,
            }}
            errors={errors.description}
          />
          <CategorySelector
            labelTx={messages.category}
            categories={flattenCategories()}
            selected={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              onFieldChange({
                categories: [{ categoryId: category?.id }],
              });
            }}
          />
          <DatePicker
            initDates={[liveEvents.selectedEvent?.startDate, liveEvents.selectedEvent?.endDate]}
            onChange={(dates) => {
              const [startDate, endDate] = dates;
              onFieldChange({ startDate, endDate });
            }}
          />
          <FileInput
            imagePreview={form?.coverPictrueUrl}
            onInput={(file) => onFieldChange({ coverPictrueBase64: file })}
            label={<FormattedMessage {...messages.coverPictureLabel} />}
          />
        </TabBody>
        <TabBody>
          <IncrementableInput
            value={form?.personQty}
            onChange={(val) => onFieldChange({ personQty: val })}
            icon={PeopleIcon}
            label={<FormattedMessage {...messages.participantsLimit} />}
          />
          <IncrementableInput
            value={form?.price}
            onChange={(val) => onFieldChange({ price: val })}
            icon={HandWithCoinsIcon}
            units="€"
            label={<FormattedMessage {...messages.ticketPrice} />}
          />
          <MultiFileInput />
          <FileInput fileInfoText=" " label={<FormattedMessage {...messages.attachments} />} />
        </TabBody>
        <TabBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '400px',
            justifyContent: 'center',
          }}
          onChange={publishLiveEvent}
        >
          <CoachName>{fullName(liveEvents.selectedEvent?.coach)}</CoachName>
          <EventName>{liveEvents.selectedEvent?.name}</EventName>
          <Category>{liveEvents.selectedEvent?.categories?.[0]?.categoryName}</Category>
          <DateBox>
            <IconWrapper>
              <Icon src={CalendarIcon} />
            </IconWrapper>
            {localizeDate(liveEvents.selectedEvent?.startDate)} |
            <IconWrapper>
              <Icon src={ClockIcon} />
            </IconWrapper>
            {renderTimeValues()}
          </DateBox>
          <FlexRow>
            <IncrementableInput
              boxStyle={{ marginRight: '10px' }}
              value={form?.personQty}
              icon={PeopleIcon}
              label={<FormattedMessage {...messages.participantsLimit} />}
            />
            <IncrementableInput
              value={form?.price}
              icon={HandWithCoinsIcon}
              units="€"
              label={<FormattedMessage {...messages.ticketPrice} />}
            />
          </FlexRow>
        </TabBody>
        <TabBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '400px',
            justifyContent: 'center',
          }}
        >
          <OverlayContainer>
            <AllSetText>
              <FormattedMessage {...messages.yourStreamIsLive} />
            </AllSetText>
            <ColorOverlay />
          </OverlayContainer>
          <Text>
            <FormattedMessage {...messages.shareOnSocialMedia} />
          </Text>
          <ShareButtons url={APPLICATION_URL} />
        </TabBody>
      </Tabs>
    </Modal>
  );
}
const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
  liveEvents: makeSelectLiveEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCategories: () => dispatch(getCategoriesAction()),
    setCurrentTab: (index) => dispatch(setCurrentTabAction(index)),
    setSelectedEvent: (data) => dispatch(setCreatedLiveEventAction(data)),
    updateEvent: ({ id, data, onSuccess }) =>
      dispatch(updateCreatedLiveEventAction({ id, data, onSuccess })),
    getCreatedLiveEvent: ({ id, onSuccess }) =>
      dispatch(getCreatedLiveEventAction({ id, onSuccess })),
    publishEvent: ({ id, onSuccess }) => dispatch(publishLiveEventAction({ id, onSuccess })),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CreateLiveEventPage);
