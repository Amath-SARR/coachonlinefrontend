/**
 *
 * CategorySuggester
 *
 */

import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import messages from '../messages';
import Button from '../Button';
import SelectInput from '../SelectInput';
import Input from '../Input';

const Wrapper = styled.div`
  margin: 10px 0;
`;
const Text = styled.span`
  font-size: 16px;
`;
const TextUnderline = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;
const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const CheckboxWrapper = styled.div`
  margin-bottom: 10px;
`;
const customStyles = {
  overlay: {
    zIndex: 9999999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '320px',
    height: 'fit-content',
    zIndex: 999,
  },
};
function CategorySuggester({
  categories,
  onCategorySuggest,
  canAddParentCategory = true,
}) {
  const [isModalVisible, setModalVisible] = useState();
  const [parentCategoriesShown, showParentCategories] = useState(false);
  const [parentCategory, setParentCategory] = useState(null);
  const [suggestedCategoryInput, setSuggestedCategoryInput] = useState('');
  const [errors, setErrors] = useState(null);

  const submit = () => {
    setErrors(null);
    if (!suggestedCategoryInput) {
      setErrors({
        ...(errors || {}),
        category: 'Please provide a category name',
      });
      return;
    }
    if (parentCategoriesShown && !parentCategory?.value) {
      setErrors({
        ...(errors || {}),
        parentCategory: 'Please select a parent category',
      });
      return;
    }
    const data = {
      categoryName: suggestedCategoryInput,
      parentId: parentCategory?.value,
      hasParent: parentCategoriesShown,
      adultOnly: false,
    };
    onCategorySuggest(data);
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const onCheckboxChange = ev => {
    const value = ev.target.checked;
    showParentCategories(value);
    if (!value) {
      setParentCategory(null);
    }
  };

  return (
    <Wrapper>
      <Text>
        <FormattedMessage {...messages.cantFindCategory} />{' '}
        <TextUnderline onClick={openModal}>
          <FormattedMessage {...messages.suggestCategory} />
        </TextUnderline>{' '}
        <FormattedMessage {...messages.adminWillReviewIt} />
      </Text>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example"
      >
        <h2 style={{ textAlign: 'center', width: '100%' }}>
          <FormattedMessage {...messages.suggestNewCategory} />
        </h2>
        <ModalWrapper>
          {canAddParentCategory && (
            <CheckboxWrapper>
              <input
                style={{ marginRight: 10 }}
                type="checkbox"
                id="privacy_policy"
                onChange={onCheckboxChange}
                value={parentCategoriesShown}
              />
              <label htmlFor="privacy_policy">
                <FormattedMessage {...messages.useParentCategory} />
              </label>
            </CheckboxWrapper>
          )}
          {parentCategoriesShown && (
            <SelectInput
              onSelect={option => {
                setParentCategory(option);
              }}
              options={
                categories?.map(item => ({
                  value: item.id,
                  label: item.name,
                  children: item.children,
                })) || []
              }
              labelName={messages.category}
              error={errors?.parentCategory}
            />
          )}
          <Input
            inputProps={{
              defaultValue: suggestedCategoryInput,
              onChange: ev => {
                setSuggestedCategoryInput(ev.target.value);
              },
            }}
            error={errors?.category}
          />
          <Button
            onClick={submit}
            style={{ fontSize: 13, padding: '15px 40px', margin: '0 5px' }}
          >
            <FormattedMessage {...messages.submitButton} />
          </Button>
        </ModalWrapper>
      </Modal>
    </Wrapper>
  );
}

export default CategorySuggester;
