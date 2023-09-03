/**
 *
 * Tabs
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { FormattedMessage } from 'react-intl';
import { colors } from '../../utils/colors';
import Button from '../Button';
import messages from '../messages';
// import makeSelectAuth from '../../containers/Auth/selectors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TabsHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
`;
const Tab = styled.div`
  cursor: ${(props) => (props.locked ? 'not-allowed' : 'pointer')};
  position: relative;
  padding: 12px 15px;
  flex: 1;
  border-bottom: 3px solid white;
  ${({ style }) => style}
`;
const TabText = styled.div`
  font-size: 14px;
  opacity: ${(props) => (!props.isActive && !props.isBeforeActive ? 0.3 : 1)};
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};
  color: black;
  height: 100%;
  text-align: center;
`;
const TabBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const ColorOverlay = styled.div`
  position: absolute;
  z-index: 1;
  background: linear-gradient(125deg, #fcd862 0%, #fb774e 70%);
  width: 100%;
  height: 100%;
  mix-blend-mode: darken;
  pointer-events: none;
`;
const TabColorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: ${colors.backgroundBlue};
  width: 100%;
  height: 100%;
  mix-blend-mode: color;
  pointer-events: none;
`;
const TabBorderOverlay = styled(TabColorOverlay)`
  top: unset;
  bottom: -3.2px;
  opacity: 0.7;
  background: black;
  mix-blend-mode: unset;
  height: 3.7px;
`;
const TabTextOverlay = styled(TabColorOverlay)`
  bottom: 0;
  opacity: 0.7;
`;

const NextButton = styled(Button)`
  width: 130px;
  padding: 10px 20px;
  font-size: 12px;
  text-transform: none;
  box-shadow: 0px 6px 4px ${colors.mainGold}30;
  &:active {
    box-shadow: none;
  }
`;
function Tabs({
  activeIndex,
  tabs = [],
  onTabChange = (index, tab) => null,
  children,
  nextButton,
  useColorOverlays = true,
  hideNextButton,
  styles,
}) {
  const [activeTab, setActiveTab] = useState(activeIndex || 0);

  useEffect(() => {
    setActiveTab(activeIndex);
  }, [activeIndex]);

  const onChange = (index, tab) => {
    onTabChange(index, tab);
  };

  const renderTabs = () =>
    tabs.map((tab, i) => (
      <Tab
        key={i}
        className={tab.className}
        isActive={activeTab === i}
        isBeforeActive={i < activeTab}
        onClick={() => !tab.locked && onChange(i, tab)}
        locked={tab.locked}
        style={
          activeTab === i ? { ...styles?.tabStyle, ...styles?.activeTabStyle } : styles?.tabStyle
        }
      >
        <TabText
          style={styles?.tabTextStyle}
          isActive={activeTab === i}
          isBeforeActive={i < activeTab}
        >
          {tab.label}
        </TabText>
        {useColorOverlays && (
          <>
            {activeTab === i && <TabColorOverlay />}
            {activeTab < i && <TabBorderOverlay />}
            {activeTab < i && <TabTextOverlay />}
          </>
        )}
      </Tab>
    ));

  return (
    <Wrapper style={styles.wrapper}>
      <TabsHeader style={styles.header}>
        {renderTabs()}
        {useColorOverlays && <ColorOverlay />}
      </TabsHeader>
      <TabBody>
        {children?.length ? children?.[activeTab] : children}
        {children?.[activeTab]?.props?.nextButton ||
          (!hideNextButton && !(activeTab >= tabs?.length - 1) && (
            <NextButton
              onClick={() => (children?.[activeTab]?.props?.onChange || onChange)(activeTab + 1)}
              color="gold"
            >
              <FormattedMessage {...messages.next} />
            </NextButton>
          ))}
      </TabBody>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  // auth: makeSelectAuth()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Tabs);
