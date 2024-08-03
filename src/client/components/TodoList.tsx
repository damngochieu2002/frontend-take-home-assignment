import type { SVGProps } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Checkbox from '@radix-ui/react-checkbox'

import { api } from '@/utils/client/api'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

type Todo = {
  id: number
  body: string
  status: 'completed' | 'pending'
}

type TodoListProps = {
  todos: Todo[]
}

export const TodoList = ({ todos }: TodoListProps) => {
  const { refetch } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo.mutateAsync({ id })
    } catch (error) {
      alert('Failed to delete todo. Please try again.')
    }
  }

  const updateTodoStatus = api.todoStatus.update.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleStatusChange = async (id: number, completed: boolean) => {
    try {
      await updateTodoStatus.mutateAsync({
        todoId: id,
        status: completed ? 'completed' : 'pending',
      })
    } catch (error) {
      alert('Failed to update todo status. Please try again.')
    }
  }

  const [parent] = useAutoAnimate<HTMLUListElement>()

  return (
    <ul ref={parent} className="grid grid-cols-1 gap-y-3">
      {todos.map((todo) => (
        <li key={todo.id}>
          <div
            className={`flex items-center rounded-12 border px-4 py-3 shadow-sm ${
              todo.status === 'completed'
                ? 'border-gray-300 bg-gray-100'
                : 'border-gray-200'
            }`}
          >
            <Checkbox.Root
              id={String(todo.id)}
              checked={todo.status === 'completed'}
              onCheckedChange={(checked) =>
                handleStatusChange(todo.id, checked === true)
              }
              className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
            >
              <Checkbox.Indicator>
                <CheckIcon className="h-4 w-4 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <label
              className={`block pl-3 font-medium ${
                todo.status === 'completed' ? 'text-gray-500 line-through' : ''
              }`}
              htmlFor={String(todo.id)}
            >
              {todo.body}
            </label>
            <button
              onClick={() => handleDelete(todo.id)}
              aria-label="Delete todo"
              className="ml-auto"
            >
              <XMarkIcon className="text-red-500 hover:text-red-700 h-6 w-6 " />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}