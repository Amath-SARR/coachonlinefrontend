/**
 *
 * ListOfCurrentCourses
 *
 */

import React, { memo, useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../Button';
// import PropTypes from 'prop-types';
import history from '../../utils/history';
import { BASE_URL } from '../../config/env';
import CourseStatus from '../CourseStatus';
import messages from '../messages';
import Image from '../Image';
import Input from '../Input';
import SelectInput from '../SelectInput';
import InputTextarea from '../InputTextarea';
import InputSubmit from '../InputSubmit';
import CategorySuggester from '../CategorySuggester';
import Table from '../Table';
import { yupValidators } from '../../utils/validate';

const StyledTable = styled.table`
  width: 100%;
  tr {
    th {
      text-align: center;
      font-size: 16px;
      color: #707070;
      padding-bottom: 10px;
    }
    td {
      text-align: center;
    }
  }
  tbody {
    tr {
      border-bottom: 1px solid #efefef;
    }
    td {
      padding: 8px 0;
      min-width: 150px;
    }
  }
`;

const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 45px 75px;
  @media screen and (max-width: 1024px) {
    padding: 20px 25px;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const TableTitle = styled.p`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  display: flex;
  @media screen and (max-width: 1024px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 590px) {
    flex-direction: column;
  }
`;

const CreateCourseButton = styled(Button)`
  font-size: 16px;
  padding: 15px 40px;
  width: 100%;
  max-width: 320px;
`;

const customStyles = {
  overlay: {
    zIndex: 999999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-40%, -50%)',
    minWidth: '300px',
    maxWidth: '25vmax',
    overflow: 'auto',
    height: '100%',
    maxHeight: '750px',
  },
};

const registerSchema = yup.object().shape({
  name: yupValidators.notEmpty,
  category: yup.object().pick(['value']).required(),
  subCategory: yup.object().pick(['value']),
  description: yupValidators.notEmpty,
});

function ListOfCurrentCourses({
  data,
  fetchCourseToEdit,
  createCourse,
  categories,
  suggestCategory,
}) {
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubcategoryVisible, setSubcategoryVisible] = useState(
    selectedCategory?.children?.length > 0,
  );
  const { register, handleSubmit, watch, errors, control } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const redirectToOffer = (offer) => {
    history.push(`/addCourse/${offer?.id}`);
  };

  const handleCreateCourse = () => {
    setAddCourseModalVisible(true);
  };

  const onSubmit = (formData) => {
    createCourse({
      data: {
        ...formData,
      },
    });
  };

  const Course = ({ course }) => (
    <>
      <td style={{ textAlign: 'left' }}>{course.name}</td>
      <td>
        <Image src={BASE_URL + course.photoUrl} style={{ maxWidth: '40px' }} alt="image" />
      </td>
      <td>{course.category?.parentName || course.category?.name}</td>
      <td>{course.category?.parentName && course.category?.name}</td>
      <td>{new Date(course.created * 1000).toLocaleDateString()}</td>
      <td>
        <CourseStatus status={course.state} />
      </td>
    </>
  );

  return (
    <Wrapper>
      <TableTitle>
        <span>
          <FormattedMessage {...messages.listOfCourses} />
        </span>
        <CreateCourseButton color="pink" onClick={handleCreateCourse}>
          <FormattedMessage {...messages.createNewCourse} />
        </CreateCourseButton>
      </TableTitle>
      <Table
        data={data}
        headers={[
          {
            label: <FormattedMessage {...messages.coursesTableName} />,
            style: { textAlign: 'left' },
          },
          {
            label: <FormattedMessage {...messages.coursesTableCover} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.coursesTableCategory} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.coursesTableSubCategory} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.coursesTableCreated} />,
            style: {},
          },
          {
            label: <FormattedMessage {...messages.coursesTableStatus} />,
            style: {},
          },
        ]}
        ItemComponent={({ item }) => <Course course={item} />}
        onItemClick={(item) => redirectToOffer(item)}
        emptyListComponent={<FormattedMessage {...messages.noCourses} />}
      />
      <Modal
        isOpen={addCourseModalVisible}
        onRequestClose={() => setAddCourseModalVisible(false)}
        style={customStyles}
        contentLabel="Example"
      >
        <TableTitle>Ajouter un nouveau cours</TableTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            inputProps={{
              ref: register,
              name: 'name',
              defaultValue: '',
            }}
            labelName={messages.courseName}
            error={errors.name?.message}
          />
          <Controller
            name="category"
            control={control}
            onSelect={(option) => {
              setSubcategoryVisible(false);
              setSelectedCategory(option);
              setTimeout(() => setSubcategoryVisible(option?.children?.length > 0), 200);
            }}
            options={categories.map((item) => ({
              value: item.id,
              label: item.name,
              children: item.children,
            }))}
            defaultValue={{ label: '', value: '' }}
            labelName={messages.category}
            error={errors.category?.message}
            as={SelectInput}
          />

          {isSubcategoryVisible && (
            <Controller
              name="subCategory"
              control={control}
              options={
                selectedCategory?.children?.length > 0 && [
                  {
                    value: '',
                    label: 'Pas de sous-catégorie', // no subcategory
                  },
                  ...selectedCategory?.children.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]
              }
              labelName={messages.subCategory}
              defaultValue={{ label: '', value: '' }}
              error={errors.subCategory?.message}
              as={SelectInput}
            />
          )}

          <CategorySuggester
            categories={categories}
            onCategorySuggest={suggestCategory}
            canAddParentCategory
          />

          <InputTextarea
            inputProps={{
              ref: register,
              name: 'description',
              defaultValue: '',
            }}
            labelName={messages.Description}
            error={errors.description?.message}
            textareaStyle={{ maxHeight: '200px' }}
          />
          <InputSubmit
            value="Ajouter un cours"
            style={{ marginBottom: '10px', width: '100%' }}
            inputStyle={{ width: '100%' }}
          />
        </form>
      </Modal>
    </Wrapper>
  );
}

ListOfCurrentCourses.propTypes = {};

export default ListOfCurrentCourses;
