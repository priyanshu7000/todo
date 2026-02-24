import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTodoSchema, CreateTodoInput } from '../utils/validation';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (data: CreateTodoInput) => void;
  isLoading?: boolean;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, isLoading = false }) => {
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(CreateTodoSchema),
  });

  const onSubmit = (data: CreateTodoInput) => {
    onAdd(data);
    reset();
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
      >
        <Plus size={20} />
        Add New Todo
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-lg border space-y-4">
      <div>
        <input
          {...register('title')}
          type="text"
          placeholder="Todo title"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      <div>
        <input
          {...register('dueDate')}
          type="datetime-local"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            reset();
          }}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
