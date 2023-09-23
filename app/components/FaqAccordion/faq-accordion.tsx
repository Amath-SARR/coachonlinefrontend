/**
 *
 * FaqAccordion
 *
 */

import React, { memo, useEffect, useState } from 'react';
import FaqAccordionProps from './faq-accordion.props';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { DispatchType } from '../../types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import ChevronDown from '../../images/icons/iconMoin.png';
import ChevronUp from '../../images/icons/iconPlus.png';
import makeSelectFaq from '../../store/faq/faq.selectors';
import { getCategories, getTopicByCategory } from '../../store/faq/faq.slice';
import { Topic } from '../../store/faq/faq.types';
import img from '../../images/images/background-image.jpg';

const Wrapper = styled.div`
  //background-image: url(${img});
  //background-position: center; 
`;
const AccordionSection = styled.div`
 /* display: flex;
  padding: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: abosulte; // position: relative;
  // height: 100vh;
  background: #f8f7fb;*/
  display: flex;
width: 1468px;
padding: 24px 16px 48px 16px;
flex-direction: column;
align-items: flex-start;
gap: 32px;
border-radius: 8px;
border: 1px solid var(--dark-grey-50, #C5C5C9);
background: var(--white, #FFF);
`;
const Accordion = styled.div`
border-bottom: 1px solid rgba(0, 0, 0, 0.30);
`;

const TitleFaq = styled.div`
   padding: 32px;
`;

const Container = styled.div`
 /* position: relative; // position: absolute;
  //top: 30%;
  box-shadow: 2px 10px 35px 1px rgba(153, 153, 153, 0.3);
  width: 1000px;
  @media screen and (max-width: 1014px) {
    max-width: 600px;
  }*/
display: flex;
width: 1450px;
padding: 24px 16px 48px 16px;
flex-direction: column;
align-items: flex-start;
gap: 32px;
border-radius: 8px;
border: 1px solid var(--dark-grey-50, #C5C5C9);
background: var(--white, #FFF);
  @media screen and (max-width: 500px) {
    max-width: 300px;
  }
`;

const Wrap = styled.div`
 /* background: #fff;
  color: ${colors.lilac};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: center;
  cursor: pointer;
  h1 {
    padding: 2rem;
    font-size: 25px;
  }*/
 display: flex;
padding: 16px;
justify-content: space-between;
align-items: center;
align-self: stretch;
border-bottom: 1px solid rgba(0, 0, 0, 0.30);
background: var(--white, #FFF);
span{
  margin-right:20px;

}
  @media screen and (max-width: 500px) {
    h1 {
      font-size: 18px;
      
    }
  }
`;



const Dropdown = styled.div`
  background: #f8f7fb;
  color: ${colors.lilac};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.p`
 /* font-size: 25px;
  font-weight: 600;
  text-align: start;
  margin: 20px;
  font-size: 22px;*/

 /* Coachs H5 */
  color: #000;
font-family: Montserrat;
font-size: 22px;
font-style: normal;
font-weight: 400;
line-height: normal;
  @media screen and (max-width: 920px) {
    font-size: 18px;
  }
`;

const DropdownTopic = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.lilac};
`;
const Title = styled.p`
color: var(--black-grey, #191919);

/* Coachs H2 */
font-family: Montserrat;
font-size: 40px;
font-style: normal;
font-weight: 400;
line-height: 94%; /* 37.6px */
text-transform: uppercase;
  @media screen and (max-width: 920px) {
    font-size: 20px;
    padding: 20px;
  }
`;
const Description = styled.p`
color: #000;
/* Texte général */
font-family: Montserrat;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
  @media screen and (max-width: 920px) {
    font-size: 20px;
    padding: 20px;
  }
`;
const Question = styled.p`
color: #000;

/* Coachs H5 */
font-family: Montserrat;
font-size: 21px;
font-style: normal;
font-weight: 400;
line-height: normal;
  @media screen and (max-width: 920px) {
    font-size: 20px;
    padding: 20px;
  }
`;
const TopicBody = styled.div`
  color: #000;

/* Coachs H5 */
font-family: Montserrat;
font-size: 21px;
font-style: normal;
font-weight: 400;
line-height: normal;
  @media screen and (max-width: 920px) {
    font-size: 15px;
  }
`;
const Chevron = styled.img`
@media screen and (max-width: 920px) {
 width: 25px;
`;
export interface CategoryProps {
  category: Category;
  onTopicSelect: (topic: Topic) => void;
  currentTopic: Topic | null;
}

export interface CategoriesProps extends Omit<CategoryProps, 'category'> {
  categories: Category[] | null;
}

function FaqAccordion(props: FaqAccordionProps) {
  const [clicked, setClicked] = useState(false);
  const { faq, getCategories, getTopicByCategory } = props || {};

  const [currentTopics, setCurrentTopics] = useState<Topic[] | null>([]);

  useEffect(() => {
    getCategories();
  }, []);

  // This function will execute the request to get the topic with a certain categorie
  const onTopicFetch = (id) => {
    getTopicByCategory({
      body: { id },
      actions: {
        onSuccess: (topics) => {
          // console.log('success ', topics);
          setCurrentTopics(topics);
        },
        onError: () => {
          console.log('error topics fetch');
        },
      },
    });
  };

  const toggle = (index, catId) => {
    if (clicked === index) {
      //if clicked question is already active, then close it
      return setClicked(null);
    }
    setClicked(index);

    // When the categorie is changed, we need to get the topics from this categories
    onTopicFetch(catId);
  };
  //  categories est le thème par exemple : 'Questions Fréquentes'
  //  topicName est la Question par exemple : 'Qu'est ce que Coachs Online'
  //  topicBody est le contenu de la question par exemple : 'Coachs Online est une plate-forme de streaming qui permet à quiconque de regarder,...'
  //  Need to improve the displaying aspect for the "topicBody"
  return (
    <Wrapper>
      <TitleFaq>
        <Title>Questions fréquentes</Title>
        <Description>Si vous ne trouvez pas la réponse dans la rubrique Questions fréquentes, merci de nous adresser votre message via email.</Description>
      </TitleFaq>
      <Container>

        {faq?.categories.map((item) => (
          <>

            {item.topics?.map((topic, index) => (
              <>

                <Wrap onClick={() => toggle(index, topic.topicId)} key={index}>
                  <Name>{topic.topicName}</Name>
                  <span>
                    {clicked === index ? (
                      <Chevron src={ChevronDown} />
                    ) : (
                      <Chevron src={ChevronUp} />
                    )}
                  </span>
                </Wrap>

                {clicked === index ? (
                  <Dropdown>
                    <div>
                      {item.topics?.map((index) => (
                        <>
                          <DropdownTopic key={index}>
                            <TopicBody
                              dangerouslySetInnerHTML={{
                                __html: currentTopics[index]?.topicBody?.toString(),
                              }}
                            />

                          </DropdownTopic>
                        </>
                      ))}
                    </div>
                  </Dropdown>

                ) : null}
              </>
            ))}
          </>
        ))}
      </Container>
    </Wrapper>
  );
}

function mapDispatchToProps(dispatch: DispatchType) {
  return {
    dispatch,
    getCategories: () => dispatch(getCategories()),
    getTopicByCategory: (data) => dispatch(getTopicByCategory(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  faq: makeSelectFaq(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(FaqAccordion);
