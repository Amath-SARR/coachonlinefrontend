/**
 *
 * CategoryCard
 *
 */

import React, { memo, useEffect, useMemo, useRef } from 'react';
import CategoryCardProps from './category-card.props';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import makeSelectDashboard from '../../containers/Dashboard/selectors';
import { getCategoriesAction } from '../../containers/Dashboard/actions';

import { Carousel } from 'react-responsive-carousel';
import {
  ArrowLeft,
  ArrowLeftWrapper,
  ArrowRight,
  ArrowRightWrapper,
  Icon,
} from '../HomepageCarousel';
import ChevronRightIcon from '../../images/icons/chevron-right--violet.svg';
import { colors } from '../../utils/colors';
import useWindowSize from '../../hooks/useWindowSize';
//import makeSelectAuth from '../../containers/Auth/selectors';
const SINGLE_ITEM_WIDTH = 300;

const Wrapper = styled.div`
  background-color: #f8f7fb;
  padding: 50px;
`;

const WrapperCarousel = styled.div`
  width: 85%;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 100px;
  .carousel.carousel-slider .control-arrow:hover {
    background-color: unset;
  }
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${SINGLE_ITEM_WIDTH}px;
  height: 104.19px;
  background: linear-gradient(
    90deg,
    rgba(59, 59, 142, 0.7091430322128851) 6%,
    rgba(229, 19, 125, 1) 100%
  );
  border-radius: 15px;
  @media screen and (max-width: 500px) {
    padding: 5px;
  }
`;
const InfoWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 292px;
  height: 94.19px;
  background: white;
  border-radius: 11px;
  @media screen and (max-width: 500px) {
    padding: 5px;
  }
`;
const Name = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: black;
  @media screen and (max-width: 500px) {
    font-size: 15px;
  }
`;
const CategoryContainer = styled.div`
  justify-content: center;
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 80px;
  margin-top: 50px;
 
`;
const Title = styled.p`
  display: flex;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-top: 30px;
  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;
const Subtitle = styled.p`
  display: flex;
  margin-right: 200px;
  margin-left: 200px;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  margin-bottom: 15px;
  @media screen and (max-width: 500px) {
    margin-right: 10px;
    margin-left: 10px;
    font-size: 11px;
  }
`;
const Indicator = styled.div`
  width: 30px;
  border-bottom: 3px solid ${(props) => (props.selected ? colors.lilac : colors.borderDark)};
  margin: 0 2px;
  cursor: pointer;
`;
function CategoryCard(props: CategoryCardProps) {
  const { getCategories, dashboard } = props;
  const wrapperRef = useRef();
  const { width } = useWindowSize();
  // useEffect(() => {
  //   getCategories();
  // }, []);

  const CategoryItem = ({ category }) => (
    <CategoryContainer>
      <InfoWrapper key={category?.id}>
        <InfoWrapper2>
          <Name>{category?.name}</Name>
        </InfoWrapper2>
      </InfoWrapper>
    </CategoryContainer>
  );

  const renderCategory = () =>
    // eslint-disable-next-line react/jsx-key
    dashboard?.categories?.map((category) => (
      <CategoryItem key={category.id} category={category} />
    ));
  const calcSingleItemMinWidth = () => {
    const wrapperWidth = wrapperRef.current?.offsetWidth;
    // 10 is the margin
    return ((SINGLE_ITEM_WIDTH + 5) * 100) / wrapperWidth;
  };

  return (
    <Wrapper>
      <Title>Nos Catégories</Title>
      <Subtitle>
        {' '}
        Découvrez 31 catégories variées, du developpement personnel à la bureautique, en passant par
        la communication et le sport, lancez vous vers de nouveaux horizons !
      </Subtitle>
      <Subtitle>
        {' '}
        Acquérir le savoir est une chose essentielle. Évoluez, changez et transformez-vous !{' '}
      </Subtitle>
      <WrapperCarousel style={{ display: 'flex', justifyContent: 'center' }}>
        <Carousel
          swipeable={width <= 600}
          width="700px"
          className="category-list"
          //swipeable={width <= 600}
          autoPlay
          infiniteLoop
          transitionTime={1000}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          //centerSlidePercentage={calcSingleItemMinWidth()}
          //selectedItem={currentIndex}
          centerMode
          // renderIndicator={(clickHandler, selected) => (
          //   <Indicator selected={selected} onClick={clickHandler} />
          // )}
          renderArrowPrev={(clickHandler, hasPrev) =>
            hasPrev && (
              <ArrowLeftWrapper style={{ position: 'absolute ' }}>
                <ArrowLeft onClick={clickHandler}>
                  <Icon src={ChevronRightIcon} />
                </ArrowLeft>
              </ArrowLeftWrapper>
            )
          }
          renderArrowNext={(clickHandler, hasNext) =>
            hasNext && (
              <ArrowRightWrapper style={{ position: 'absolute ' }}>
                <ArrowRight onClick={clickHandler}>
                  <Icon src={ChevronRightIcon} />
                </ArrowRight>
              </ArrowRightWrapper>
            )
          }
        >
          {renderCategory()}
          {/* What was the objectif of the next line ? */}
          {/* {useMemo(renderCategory, [dashboard?.category?.length])} */}
        </Carousel>
      </WrapperCarousel>
    </Wrapper>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // getCategories: () => dispatch(getCategoriesAction()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, memo)(CategoryCard);
