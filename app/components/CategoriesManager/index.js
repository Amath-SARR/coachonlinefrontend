/**
 *
 * CategoriesManager
 *
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import messages from '../messages';
import SelectInput from '../SelectInput';
import CategorySuggester from '../CategorySuggester';

const Wrapper = styled.div``;
function CategoriesManager({ control, categories, category, suggestCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isSubcategoryVisible, setSubcategoryVisible] = useState(false);

  useEffect(() => {
    setInitValues();
  }, [categories?.length, category?.id]);

  const getInitValues = () => {
    const { id, parentId } = category || {};
    const parentCategory = categories?.filter(cat =>
      parentId ? cat.id === parentId : cat.id === id,
    )?.[0];
    const childCategory = parentCategory?.children?.filter(
      cat => cat.id === id,
    )?.[0];
    console.log(childCategory);
    return { parentCategory, childCategory };
  };

  const setInitValues = () => {
    const { parentCategory, childCategory } = getInitValues();
    setSelectedCategory(parentCategory);
    setSelectedSubCategory(childCategory);
    !!parentCategory?.children?.length && setSubcategoryVisible(true);
  };

  const mapCategoryOptions = () =>
    categories?.map(item => ({
      value: item.id,
      label: item.name,
      children: item.children,
    })) || [];

  const mapSubcategoryOptions = () => [
    {
      value: '',
      label: 'Pas de sous-catégorie', // no subcategory
    },
    ...(selectedCategory?.children.map(item => ({
      value: item.id,
      label: item.name,
    })) || []),
  ];

  const onCategoryChange = option => {
    setSubcategoryVisible(false);
    setSelectedCategory({ ...option, id: option.value, name: option.label });
    setSelectedSubCategory({
      value: '',
      label: 'Pas de sous-catégorie', // no subcateogry
    });
    setTimeout(() => setSubcategoryVisible(option?.children?.length > 0), 200);
  };

  const onSubCategoryChange = option => {
    setSelectedSubCategory({ ...option, id: option.value, name: option.label });
  };

  return (
    <Wrapper>
      <Controller
        name="category"
        control={control}
        onSelect={onCategoryChange}
        options={mapCategoryOptions()}
        labelName={messages.category}
        placeholderProp={selectedCategory?.name}
        defaultValue={{
          value: selectedCategory?.id,
          label: selectedCategory?.name,
        }}
        defaultValue2={{
          value: selectedCategory?.id,
          label: selectedCategory?.name,
        }}
        as={SelectInput}
      />

      {isSubcategoryVisible && (
        <Controller
          name="subCategory"
          control={control}
          onSelect={onSubCategoryChange}
          options={mapSubcategoryOptions()}
          defaultValue={{
            value: selectedSubCategory?.id,
            label: selectedSubCategory?.name,
          }}
          defaultValue2={{
            value: selectedSubCategory?.id,
            label: selectedSubCategory?.name,
          }}
          labelName={messages.subCategory}
          as={SelectInput}
        />
      )}
      <CategorySuggester
        categories={categories}
        onCategorySuggest={suggestCategory}
      />
    </Wrapper>
  );
}

CategoriesManager.propTypes = {};

export default CategoriesManager;
