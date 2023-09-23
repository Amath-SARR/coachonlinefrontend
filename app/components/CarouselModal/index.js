/**
 *
 * Carousel
 *
 */
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Union } from '../messages';
import { Yoga } from '../messages';

const Container = styled.div`
  position: relative;
  text-align: center;
  text-transform: uppercase;
  color: white;
  //margin-left: 10px;
`;

/* Centered text */
const Centered = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(180deg, #40e0d0 0%, #ff8c00 47.4%, #ff0080 100%);
  background-clip: text;
  text-transform: uppercase;
  font-size: 40px;
  text-align: justify;
  font-style: normal;
  font-family: sans-serif;
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function CarouselModal() {
  useEffect(() => {
    let isMounted = true; // note mutable flag
    someAsyncOperation().then((data) => {
      if (isMounted) setState(data); // add conditional check
    });
    return () => {
      isMounted = false;
    }; // cleanup toggles value, if unmounted
  }, []);

  return (
    <div style={{ width: '850px' }}>
      <Carousel
        autoPlay
        infiniteLoop
        transitionTime={1000}
        showStatus={false}
        showThumbs={false}
        showArrows={false}
        interval={5000}
      >
        <Container>
          <img src={Yoga} alt="" style={{ width: 500, height: 500 }} />
          <Centered>Yoga Iyengar de tous les jours</Centered>
        </Container>
        <Container>
          <img src={Union} alt="" style={{ width: 500, height: 500 }} />
          {/* <Centered>Yoga Iyengar de tous les jours</Centered> */}
        </Container>

        {/* <Container>
      <img src={Oratoir} alt="" style={{ width: 500, height: 500 }} />
      <Centered>Parler comme Obama</Centered>
    </Container>
    <Container>
      <img src={Ia} alt="" style={{ width: 500, height: 500 }} />
      <Centered>IA, le métier d'avenir</Centered>
    </Container> */}
      </Carousel>
    </div>
  );
}

export default CarouselModal;
