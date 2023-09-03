/**
 *
 * InputTextarea
 *
 */

import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import './style.css';
import { colors } from '../../utils/colors';
import Label from '../Label';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const LabelStyled = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
`;

const TextArea = styled.textarea`
  width: 100%;
  //border: 1px solid black;
  background-color: #fff;
  padding: 17px 20px;
  border-radius: 10px;
  min-height: 200px;
  color: black;
  resize: none;
  outline: none;
`;

const TextInput = styled.textarea`
  width: 100%;
  background-color: ${colors.white};
  //border: 1px solid ${colors.lilac};
  color: ${colors.lilac};
  border-radius: 5px;
  padding: 5px 10px;
  min-height: 62px;
  outline: none;
  border: none;
`;
const TextInputLabel = styled.label`
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 5px;
  color: ${colors.lilac};
  padding-left: 10px;
`;

const editorStyle = {
  width: '100%',
  //border: '1px solid black',
  //backgroundColor: '${colors.lilac}',
  minHeight: '170px',
  overflow: 'auto',
};

const inputEditorStyle = {
  backgroundColor: colors.inputBlue,
  minHeight: '62px',
  outline: 'none',
  color: colors.lilac,
  border: 'none',
  overflow: 'auto',
};

const RedesignedInput = ({
  inputProps,
  labelName,
  textareaStyle,
  error,
  errors,
  editor,
  ckEditorConfig = {},
  editorClassName,
  style,
}) => {
  const { ref, value, defaultValue, onChange, name } = inputProps || {};
  return (
    <Wrapper style={style}>
      {!!labelName && (
        <Label
          labelName={labelName}
          showIcon={!!errors?.length}
          tooltipData={errors?.map((err, i) => `${i + 1}. ${err}`)}
          dataType={'warning'}
          extraData={[errors?.length]}
        />
      )}
      {editor ? (
        <div style={{ ...inputEditorStyle, ...(textareaStyle || {}) }}>
          <CKEditor
            className={editorClassName}
            editor={editor}
            config={{
              toolbar: ['heading', '|', 'link', 'bold', 'italic', 'bulletedList', 'numberedList'],
              ...ckEditorConfig,
            }}
            ref={ref}
            data={value || defaultValue || ''}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange && onChange(data);
            }}
            onBlur={(event, editor) => {}}
            onFocus={(event, editor) => {}}
          />
        </div>
      ) : (
        <TextInput
          name={name || labelName}
          defaultValue={defaultValue}
          style={{ ...textareaStyle }}
          {...inputProps}
        />
      )}
      {error && (
        <p style={{ fontSize: '13px', color: 'red', marginTop: '5px' }}>
          {error[0].toUpperCase()}
          {error.slice(1).replace('_', ' ')}
        </p>
      )}
    </Wrapper>
  );
};

function InputTextarea({
  inputProps,
  labelName,
  textareaStyle,
  colorScheme = 'light',
  error,
  errors,
  editor,
  ckEditorConfig = {},
  redesigned,
  editorClassName,
  style,
}) {
  const isDark = colorScheme === 'dark';
  const { ref, value, defaultValue, onChange, name } = inputProps || {};
  const [hasEditor, setHasEditor] = useState(false);

  useEffect(() => {
    setHasEditor(!!editor);
    return () => setHasEditor(false);
  }, []);

  return redesigned ? (
    <RedesignedInput
      inputProps={inputProps}
      labelName={labelName}
      textareaStyle={textareaStyle}
      error={error}
      editor={editor}
      ckEditorConfig={ckEditorConfig}
      editorClassName={editorClassName}
      style={style}
    />
  ) : (
    <Wrapper>
      <LabelStyled isDark={isDark}>
        <FormattedMessage {...labelName} />
      </LabelStyled>
      {hasEditor ? (
        <div style={{ ...editorStyle, ...(textareaStyle || {}) }}>
          <CKEditor
            className="ck-content"
            editor={editor}
            config={{
              // plugins: [alignment],
              toolbar: ['heading', '|', 'link', 'bold', 'italic', 'bulletedList', 'numberedList'],
              ...ckEditorConfig,
            }}
            ref={ref}
            data={value || defaultValue || ''}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange && onChange(data);
            }}
          />
        </div>
      ) : (
        <TextArea
          isDark={isDark}
          name={name || labelName}
          value={value}
          ref={ref}
          defaultValue={defaultValue}
          onChange={onChange}
          style={{ ...textareaStyle }}
        />
      )}
      {error && (
        <p style={{ fontSize: '13px', color: 'red', marginTop: '5px' }}>
          {error[0].toUpperCase()}
          {error.slice(1).replace('_', ' ')}
        </p>
      )}
    </Wrapper>
  );
}

InputTextarea.propTypes = {};

export default InputTextarea;
