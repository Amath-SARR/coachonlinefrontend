import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageContainer from '../../components/PageContainer';
import Tabs from '../../components/Tabs';
import history from '../../utils/history';
import { colors } from '../../utils/colors';
import { Contracts } from './index';
import { readFromStorage, writeToStorage } from '../../utils/storage';

const Wrapper = styled.div``;
const TabBody = styled.div`
  width: 100%;
  padding: 10px;
`;

const TABS = [
  {
    label: 'Contrats',
    id: 'contracts',
  },
  { label: 'FAQ', id: 'faq', locked: true },
];
export function ArticlesPage(props) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const storageTab = readFromStorage('articlesTab');
    typeof storageTab === 'number' && setActiveTab(storageTab);
  }, []);

  const onTabChange = (index: number, tab: typeof TABS[number]) => {
    setActiveTab(index);
    writeToStorage('articlesTab', index);
    history.replace(`/articles/${tab.id}`);
  };

  return (
    <Wrapper>
      <PageContainer withPanel>
        <Tabs
          hideNextButton
          useColorOverlays={false}
          onTabChange={onTabChange}
          activeIndex={activeTab}
          styles={{
            tabStyle: {
              borderBottom: `1px solid #00000050`,
              color: colors.black,
            },
            activeTabStyle: {
              borderBottom: `1px solid ${colors.mainPink}`,
              color: `${colors.mainPink} !important`,
              padding: '12px',
            },
          }}
          tabs={TABS}
        >
          <TabBody>
            <Contracts />
          </TabBody>
          <TabBody></TabBody>
        </Tabs>
      </PageContainer>
    </Wrapper>
  );
}

export default ArticlesPage;
