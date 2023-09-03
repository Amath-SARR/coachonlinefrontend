import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Loader from 'react-loader-spinner';
import PdfIcon from '../../images/icons/pdf.svg';
import messages from '../messages';
import CancelIcon from '../../images/icons/cancel.svg';

const Wrapper = styled.div``;
const LoaderWrapper = styled.div`
  margin-right: 5px;
`;

function CVAttachment({
  onAttachmentAdd,
  onAttachmentRemove,
  courseId,
  episodeId,
  attachments = [],
}) {
  const multipleInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const addAttachments = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      setUploading(true);
      const file = e.target.files[i];

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const fileNameArr = file.name.split('.');
        const extension = fileNameArr.pop();
        const fileName = fileNameArr.join('.');
        const dataToSend = {
          data: reader.result.split(',')[1],
          name: fileName,
          courseId,
          episodeId,
          extension,
          onFinish: () => setUploading(false),
        };
        console.log('Attachment to send: ', dataToSend);
        onAttachmentAdd(dataToSend);
      };
    }
  };

  const renderFileList = () => {
    const removeFromFileList = (attachment) => {
      const dataToSend = {
        courseId,
        episodeId,
        attachmentId: attachment.id,
      };
      onAttachmentRemove(dataToSend);
    };

    return attachments?.map((attachment) => (
      <div
        key={attachment.hash}
        style={{
          fontSize: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 5,
        }}
      >
        <div>
          {attachment.name}.{attachment.extension}
        </div>
        <div onClick={() => removeFromFileList(attachment)} style={{ cursor: 'pointer' }}>
          <img src={CancelIcon} alt="disabled" style={{ width: '16px' }} />
        </div>
      </div>
    ));
  };

  return (
    <Wrapper>
      <div
        style={{
          width: '200px',
          display: 'flex',
          alignItems: 'center',
          marginTop: '15px',
          marginBottom: '15px',
          cursor: 'pointer',
        }}
        onClick={() => multipleInputRef?.current?.click()}
      >
        <img src={PdfIcon}  width="40px" alt="pdf icon" />
        <p style={{ fontSize: '16px', marginLeft: '5px' }}>Ajoutez votre CV</p>
      </div>

      {/* <LoaderWrapper>
        <Loader type="Oval" color="black" height={15} width={15} />
      </LoaderWrapper> */}

      <input
        type="file"
        multiple
        ref={multipleInputRef}
        onChange={addAttachments}
        style={{ display: 'none' }}
      />
    </Wrapper>
  );
}

export default CVAttachment;
