/**
 *
 * SelectInput
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { colors } from '../../utils/colors';
import { FlexColumn } from '../../global-styles';
import Label from '../Label';
// import PropTypes from 'prop-types';

const Wrapper = styled(FlexColumn)`
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: ${(props) => (props.isDark ? colors.textDark : colors.black)};
`;

const redesignedStyles = {
  menu: (provided, state) => ({
    ...provided,
    color: colors.loginGoogleAction
  }),

  menuList: (provided, state) => ({
    ...provided,
    color: colors.lilac,
    backgroundColor: colors.inputBlue,
  }),

  input: (provided, state) => ({
    ...provided,
    color: colors.lilac,
  }),

  option: (provided) => ({
    ...provided,
    '&:hover': {
      backgroundColor: colors.backgroundDarkBlue,
    },
  }),

  control: (provided, state) => ({
    ...provided,
    color: colors.lilac,
    backgroundColor: colors.inputBlue,
    border: `none`,
    borderRadius: '5px',
    padding: '0px 10px',
  }),

  placeholder: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    color: colors.lilac,
    fontWeight: 500,
    paddingRight: 25,
  }),

  indicatorSeparator: (provided) => ({
    display: 'none',
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: colors.lilac,
    paddingRight: '10px',
    '&:hover': {
      opacity: 0.5,
    },
  }),

  valueContainer: (provided) => ({
    display: 'flex',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
      ...provided,
      opacity,
      transition,
      color: colors.lilac,
      fontSize: '16px',
      paddingRight: '45px',

      '&:before': {
        content: '""',
        backgroundImage: `url("${state.data.icon}")`,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: '16px',
        backgroundSize: 'contain',
      },
    };
  },
};

function SelectInput({
  options,
  labelName,
  label,
  error,
  onChange = null,
  onSelect = null,
  defaultValue2,
  onRemove,
  isMulti,
  wrapperStyle,
  onSelectMulti,
  colorScheme = 'light',
  placeholderProp = '',
  redesigned,
  errors,
  readOnly,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [placeholder] = useState(placeholderProp);
  const [propsOptions, setOptions] = useState(options);
  const ref = useRef();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setSelectedOption(defaultValue2);
  }, [defaultValue2?.value]);

  useEffect(() => {
    setOptions(options);
  }, [options?.length]);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      color: isDark ? colors.white : colors.black,
    }),

    input: (provided, state) => ({
      ...provided,
      color: isDark ? colors.white : colors.black,
    }),

    control: (provided, state) => ({
      ...provided,
      color: colors.lilac,
      backgroundColor: isDark ? colors.secondaryBackgroundDark : colors.secondaryBackgroundLight,
      border: `1px solid ${isDark ? colors.borderDark : colors.borderLight}`,
      borderRadius: 10,
      minHeight: '55px',
      '&:hover': {
        borderColor: isDark ? colors.borderDark : colors.borderLight,
      },
    }),

    placeholder: (provided, state) => ({
      ...provided,
      fontSize: '18px',
      fontFamily: 'Roboto',
      color: isDark ? colors.white : colors.black,
      fontWeight: 500,
      paddingRight: 25,
    }),

    indicatorSeparator: (provided) => ({
      display: 'none',
    }),

    dropdownIndicator: (provided) => ({
      ...provided,
      color: isDark ? colors.white : colors.black,
      paddingRight: '20px',
      '&:hover': {
        color: '#1E1E1E',
      },
    }),

    valueContainer: (provided) => ({
      display: 'flex',
      paddingLeft: '15px',
      flexWrap: 'wrap',
    }),

    option: (provided) => ({
      ...provided,
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return {
        ...provided,
        opacity,
        transition,
        color: isDark ? colors.lilac : colors.black,
        fontSize: '16px',
        paddingRight: '45px',

        // backgroundImage: state.data.icon,

        '&:before': {
          content: '""',
          backgroundImage: `url("${state.data.icon}")`,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: '16px',
          backgroundSize: 'contain',
        },
      };
    },
  };

  useEffect(() => {
    setOptions(options);
  }, [options]);

  const onChangeHandler = (value, event) => {
    setSelectedOption(value);
    console.log(value, event);
    onChange && onChange(value);
    switch (event.action) {
      case 'select-option':
        isMulti ? onSelectMulti && onSelectMulti(event.option, value) : onSelect && onSelect(value);
        break;
      case 'remove-value':
        onRemove && onRemove(event.removedValue);
    }
  };

  return redesigned ? (
    <Wrapper style={wrapperStyle}>
      {(!!labelName || !!label) && (
        <Label
          labelName={labelName}
          label={label}
          showIcon={!!errors?.length}
          tooltipData={errors?.map((err, i) => `${i + 1}. ${err}`)}
          dataType={'warning'}
          extraData={[errors?.length]}
        >
          <FormattedMessage {...labelName} />
        </Label>
      )}
      <Select
        ref={ref}
        isDisabled={readOnly}
        isMulti={isMulti}
        placeholder={placeholder}
        styles={redesignedStyles}
        defaultValue={selectedOption}
        value={selectedOption}
        onChange={onChangeHandler}
        options={propsOptions}
      />
    </Wrapper>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
      {!!labelName && (
        <StyledLabel isDark={isDark}>
          <FormattedMessage {...labelName} />
        </StyledLabel>
      )}
      <Select
        ref={ref}
        isMulti={isMulti}
        placeholder={placeholder}
        styles={customStyles}
        defaultValue={selectedOption}
        value={selectedOption}
        onChange={onChangeHandler}
        options={propsOptions}
      />
      {!!error && (
        <p style={{ fontSize: '13px', color: 'red', marginTop: '5px' }}>
          {error[0].toUpperCase()}
          {error.slice(1).replace('_', ' ')}
        </p>
      )}
    </div>
  );
}

SelectInput.propTypes = {};

export default SelectInput;
