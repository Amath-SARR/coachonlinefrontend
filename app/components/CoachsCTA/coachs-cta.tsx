/**
 *
 * Coach CTA
 * Banner CTA for coach
 *
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import Button from '../Button';
import CoachImg from '../../images/images/coach-photo.png';
// import { connect } from 'react-redux';
// import { compose } from '@reduxjs/toolkit';
import makeSelectHomePage from '../../containers/HomePage/selectors';
// import { getPlatformStatisticsAction } from '../../containers/HomePage/actions';
// import { DispatchType } from '../../types';
// import { createStructuredSelector } from 'reselect';
import CoachsCTAProps from './coachs-cta.props';

const Wrapper = styled.div`
  width: 100%;
  background-color: ${colors.lilac};
  padding: 100px;
`;
const Title = styled.p`
  color: white;
  font-size: 40px;
  font-weight: 700;
  @media screen and (max-width: 1200px) {
    font-size: 20px;
  }
  @media screen and (max-width: 725px) {
    font-size: 30px;
    text-align: center;
  }
`;
const Text = styled.p`
  color: white;
  font-size: 18px;
  weight: 400;
  text-align: justify;
  margin-bottom: 15px;
  line-height: 1.5;
  @media screen and (max-width: 1200px) {
    font-size: 12px;
  }
`;
const Num = styled.p`
  color: ${colors.mainGreen};
  font-size: 30px;
  font-weight: 600;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;
const Box = styled.div`
  width: 553px;
  height: 348px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //padding-top: 200px;
  @media screen and (max-width: 1200px) {
    width: 300px;
    margin-top: 40px;
  }
`;
const Numbers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RegisterButton = styled(Button)`
  width: 200px;
  margin-left: 20px;
  font-size: 18px;
  align-items: center;
  @media screen and (max-width: 920px) {
    width: 120px;
    font-size: 12px;
  }
  @media screen and (max-width: 725px) {
    margin: auto;
    margin-bottom: 40px;
  }
`;
const Links = styled.a`
  text-decoration: none;
`;
const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 400px;
  @media screen and (max-width: 725px) {
    flex-direction: column;
    
  }
  @media screen and (max-width: 725px) {
    height: 500px;
  }
`;

const CoachImage = styled.img`
  width: 400px;
  border-radius: 10px;
  //margin: auto;
  margin-right: -50px;
  margin-top: -40px;
  @media screen and (max-width: 1200px) {
    width: 200px;
  }
`;

const BoxImage = styled.div`
  border: 2px solid white;
  margin-top: 50px;
  padding-bottom: 30px;
  padding-left: 40px;
  //height: 400px;
  border-radius: 10px;
`;

// // // All the fonction is preset to work with the server and access directly to some informations
// // // For this time, the informations will be displayed by statics numbers
// // // Everything can be uncomment to work with Redux

function CoachsCTA(props: CoachsCTAProps) {
  const { homepage } = props;
  const [numberCourses, setNumberCourses] = useState(270);
  const [numberCoachs, setNumberCoachs] = useState(100);

  // useEffect(() => {
  //   setNumberCourses(homepage?.platformStatistics?.totalCourses + 1);
  //   setNumberCoachs(homepage?.platformStatistics?.totalCoaches + 1);
  // }, [homepage]);

  return (
    <div style={{ backgroundColor: '#3b3b8e' }}>
      <Wrapper>
        <Container>
          <BoxImage>
            <CoachImage src={CoachImg} alt="coach"></CoachImage>
          </BoxImage>
          <Box>
            <Row>
              <Title>Devenez Coach</Title>
            </Row>
            <Row style={{ flexDirection: 'column' }}>
              <Text>Entrez dans Coachs Online et contribuez à une nouvelle façon de former !</Text>
              <Text>
                Oui, vous pouvez vous démarquer et participer à une formidable aventure humaine.
              </Text>
            </Row>
            <Row>
              {/* <Numbers>
                <Num>400</Num>
                <Text>Utilisateurs</Text>
              </Numbers> */}
              <Numbers>
                <Num>{numberCourses}</Num>
                <Text>Formations</Text>
              </Numbers>
              <Numbers>
                <Num>{numberCoachs}</Num>
                <Text>Coachs</Text>
              </Numbers>
              <Numbers>
                <Num></Num>
                <Text></Text>
              </Numbers>
            </Row>
            <Links href="https://www.coachs-online.net/offre-d-accompagnements/" target="_blank">
              <RegisterButton
                style={{ backgroundColor: 'white', color: colors.lilac, border: 'none' }}
              >
                Devenir Coach
              </RegisterButton>
            </Links>
          </Box>
        </Container>
      </Wrapper>
    </div>
  );
}

// // // Uncomment the next code to work with Redux and connect to the server.
// // // Don't forget to comment the last lign when using redux to not create conflict.

// function mapDispatchToProps(dispatch: DispatchType) {
//   return {
//     dispatch,
//     getPlatformStatistics: () => dispatch(getPlatformStatisticsAction()),
//   };
// }

// const mapStateToProps = createStructuredSelector({
//   homepage: makeSelectHomePage(),
// });

// const withConnect = connect(mapStateToProps, mapDispatchToProps);

// export default compose(withConnect)(CoachsCTA);

export default CoachsCTA;
