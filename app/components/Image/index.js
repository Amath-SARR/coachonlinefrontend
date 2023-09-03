/**
 *
 * Image
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
const LogoShortImg = require('../../images/logo/new_logo_solo.png');

const StyledImage = styled.img`
  filter: ${(props) => (props.loaded ? 'none' : 'blur(10px)')};
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: all 0.4s ease-in-out;
`;

function Image({ src, className, style = {}, ...rest }) {
  const [source, setSource] = useState(src);
  const [isError, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSource(src);
  }, [src]);

  const onError = () => {
    setSource(LogoShortImg);
    setError(true);
  };

  return (
    <StyledImage
      className={className}
      src={source}
      onError={onError}
      loaded={loaded}
      onLoad={() => setLoaded(true)}
      alt="No image"
      style={
        isError
          ? {
              opacity: 0.5,
              maxWidth: 120,
              padding: '30px',
              ...style,
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }
          : { opacity: 1, ...style }
      }
      {...rest}
    />
  );
}

Image.propTypes = {};

export default Image;
