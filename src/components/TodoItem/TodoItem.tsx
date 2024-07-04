import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const { editingId } = useGlobalState();
  const dispatch = useDispatch();

  const isEditing = todo.id === editingId;

  const deleteTodo = (item: Todo) => {
    dispatch({ type: Type.DeleteTodo, payload: item });
  };

  const updateTodo = (updatedTodo: Todo) => {
    if (updatedTodo.title) {
      dispatch({ type: Type.UpdateTodo, payload: updatedTodo });
    } else {
      deleteTodo(updatedTodo);
    }
  };

  const updateTodoCheckStatus = (updatedTodo: Todo) => {
    dispatch({ type: Type.UpdateTodoCheckStatus, payload: updatedTodo });
  };

  const handleDoubleClick = (editedTodo: Todo) => {
    dispatch({ type: Type.setEditingId, payload: editedTodo.id });
  };

  const updateTitle = () => {
    const trimmedTitle = newTitle.trim();

    setNewTitle(trimmedTitle);

    updateTodo({ ...todo, title: trimmedTitle });
    dispatch({ type: Type.setEditingId, payload: undefined });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTitle();
  };

  const checkEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEsc = e.key === 'Escape' ? true : false;

    if (isEsc) {
      dispatch({ type: Type.setEditingId, payload: undefined });
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={'todo ' + (todo.completed ? 'completed' : '')}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e =>
            updateTodoCheckStatus({ ...todo, completed: e.target.checked })
          }
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyUp={checkEsc}
            onBlur={updateTitle}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};