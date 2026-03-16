import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/solid'; // Heroicons PencilIcon

const TodoItems = ({ text, id, isComplete, toggleComplete, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      updateTodo(id, trimmed);
    } else {
      setEditText(text); // boş bırakılırsa eski metin geri gelir
    }
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center my-3 gap-3 p-3 rounded-lg transition-shadow 
      ${isComplete ? 'bg-gray-100' : 'bg-white'} hover:shadow-md`}>

      {/* Tik butonu */}
      <button
        onClick={() => toggleComplete(id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
          ${isComplete ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}
      >
        ✓
      </button>

      {/* Görev metni / edit modu */}
      {isEditing ? (
        <input
          className='flex-1 text-[17px] px-2 py-1 border rounded outline-none'
          value={editText}
          autoFocus
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
      ) : (
        <p
          className={`flex-1 text-[17px] transition-colors ${isComplete ? 'line-through text-gray-400' : 'text-slate-800'}`}
        >
          {text}
        </p>
      )}

      {/* Edit butonu*/}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-300 
                     text-gray-600 hover:bg-blue-500 hover:text-white hover:scale-110 hover:shadow-md transition-all"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
      )}

      {/* Silme butonu */}
      <button
        onClick={() => deleteTodo(id)}
        className='text-red-500 font-bold hover:text-red-700 transition-colors'
      >
        X
      </button>
    </div>
  );
};

export default TodoItems;