/**
 *
 * AddCourseMainColumn
 *
 */

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import AddIcon from '../../images/icons/add.svg';
import DisabledIcon from '../../images/icons/disabled.svg';
import DraggableEpisode from '../DraggableEpisode';
import messages from '../messages';
import CourseStatus from '../CourseStatus';

// import PropTypes from 'prop-types';

const ColumnWrapper = styled.div`
  padding: 0 45px;
  flex: 3;

  @media screen and (max-width: 1024px) {
    padding: 0 15px;
  }
`;
const AddNewEpisodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;
const AddNewEpisodeWrapper = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
const EpisodesBox = styled.div`
  padding: 35px 30px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;
const BoxHeader = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

function AddCourseMainColumn({
  dashboard,
  addPromoEpisode,
  editPromoEpisodes,
  addEpisode,
  setLastAddedEpisodeId,
  editEpisodes,
  addAttachment,
  removeAttachment,
  removeEpisode,
  removeMedia,
}) {
  // const [episodesList, setEpisodesList] = useState(dashboard.episodes);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      dashboard.episodes,
      result.source.index,
      result.destination.index,
    );

    editEpisodes(items);
  };

  const addPromo = () => {
    addPromoEpisode({ courseId: dashboard.currentCourseId });
  };

  const addNewItem = () => {
    addEpisode({ courseId: dashboard.currentCourseId });
  };

  const removeItem = id => {
    removeEpisode({ courseId: dashboard.currentCourseId, episodeId: id });
  };

  const editItem = (index, key, value) => {
    const items = Array.from(dashboard.episodes);
    items[index][key] = value;
    editEpisodes(items);
  };

  const editPromo = (index, key, value) => {
    const items = Array.from(dashboard.promoEpisodes);
    items[index][key] = value;
    editPromoEpisodes(items);
  };

  const rejectionReason =
    !!dashboard?.courseData?.rejectionsHistory?.length &&
    dashboard?.courseData?.rejectionsHistory[
      dashboard?.courseData?.rejectionsHistory?.length - 1
    ]?.reason;

  return (
    <ColumnWrapper>
      <div
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}
      >
        <FormattedMessage {...messages.createCourse} />
        <CourseStatus
          status={dashboard?.courseData?.state}
          tooltip={dashboard?.courseData?.state === 1 && rejectionReason}
          style={{ border: 'none', cursor: 'unset' }}
        />
        <p style={{ fontSize: '15px', marginBottom: '10px', color: 'red' }}>
          {dashboard?.courseData?.state === 1 && rejectionReason}
        </p>
      </div>
      <p style={{ fontSize: '15px', marginBottom: '40px' }}>
        <FormattedMessage {...messages.createCourseDesc} />
      </p>

      <EpisodesBox>
        <AddNewEpisodeHeader>
          <BoxHeader>
            <FormattedMessage {...messages.editPromoEpisode} />
          </BoxHeader>
          {!dashboard.promoEpisodes.length && (
            <div style={{ display: 'flex' }}>
              <AddNewEpisodeWrapper onClick={addPromo}>
                <p style={{ marginRight: '10px' }}>
                  <FormattedMessage {...messages.addNewEpisode} />
                </p>
                <img src={AddIcon} alt="add" />
              </AddNewEpisodeWrapper>
            </div>
          )}
        </AddNewEpisodeHeader>
        {dashboard.promoEpisodes.map((item, index) => (
          <DraggableEpisode
            item={item}
            key={item.id}
            index={index}
            editItem={editPromo}
            removeItem={() => removeItem(item.id)}
            dashboard={dashboard}
            setLastAddedEpisodeId={setLastAddedEpisodeId}
            removeMedia={() =>
              removeMedia({
                episodeId: item.id,
                courseId: dashboard.currentCourseId,
              })
            }
          />
        ))}
      </EpisodesBox>

      <EpisodesBox>
        <AddNewEpisodeHeader>
          <BoxHeader>
            <FormattedMessage {...messages.editYourCourse} />
          </BoxHeader>
          <div style={{ display: 'flex' }}>
            <AddNewEpisodeWrapper onClick={addNewItem}>
              <p style={{ marginRight: '10px' }}>
                <FormattedMessage {...messages.addNewEpisode} />
              </p>
              <img src={AddIcon} alt="add" />
            </AddNewEpisodeWrapper>
          </div>
        </AddNewEpisodeHeader>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="123">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {dashboard.episodes.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <DraggableEpisode
                          item={item}
                          index={index}
                          editItem={editItem}
                          removeItem={() => removeItem(item.id)}
                          dashboard={dashboard}
                          addAttachment={addAttachment}
                          removeAttachment={removeAttachment}
                          setLastAddedEpisodeId={setLastAddedEpisodeId}
                          removeMedia={() =>
                            removeMedia({
                              episodeId: item.id,
                              courseId: dashboard.currentCourseId,
                            })
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </EpisodesBox>
    </ColumnWrapper>
  );
}

AddCourseMainColumn.propTypes = {};

export default AddCourseMainColumn;
