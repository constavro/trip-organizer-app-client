// src/components/Trips/TripEditForm/TripItineraryReorder.jsx
import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import FormSection from './FormSection';
import './TripItineraryReorder.css';

const DraggableReorderItem = ({ item, index, provided, snapshot }) => {
  const days = parseInt(item.days) || 1;
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`reorder-item ${snapshot.isDragging ? 'is-dragging-reorder' : ''}`}
      style={{
        ...provided.draggableProps.style,
      }}
    >
      <span className="reorder-item-index">{index + 1}.</span>
      <span className="reorder-item-location">{item.location || 'Unnamed Stop'}</span>
      <span className="reorder-item-info">({days} day{days === 1 ? '' : 's'})</span>
      <span className="reorder-drag-icon">☰</span>
    </div>
  );
};

const TripItineraryReorder = ({ itinerary, onMoveItem }) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    onMoveItem(result.source.index, result.destination.index);
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <FormSection title="Reorder Itinerary Stops">
        <p>Add itinerary stops in the "Edit Itinerary Details" section above to enable reordering.</p>
      </FormSection>
    );
  }

  return (
    <FormSection title="Reorder Itinerary Stops (Drag & Drop)">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="itinerary-reorder-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="reorder-list-container"
            >
              {itinerary.map((item, index) => (
                <Draggable
                  key={item._id || `itinerary-reorder-${index}`}
                  draggableId={String(item._id || `itinerary-reorder-${index}`)}
                  index={index}
                >
                  {(providedDraggable, snapshot) => (
                    <DraggableReorderItem
                      item={item}
                      index={index}
                      provided={providedDraggable}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </FormSection>
  );
};

export default TripItineraryReorder;
