import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
import { api } from '@/utils/client/api'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

const Index = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })

  const filteredTodos = todos.filter((todo) =>
    statusFilter === 'all' ? true : todo.status === statusFilter
  )

  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>

        <div className="pt-10">
          <Tabs
            defaultValue="all"
            onValueChange={(value) => setStatusFilter(value)}
          >
            <TabsList className="flex justify-start space-x-2 pb-10">
              <TabsTrigger
                value="all"
                className="h-[44px] w-[66px] rounded-full border-[1px] border-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="h-[44px] w-[104px] rounded-full border-[1px] border-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="h-[44px] w-[124px] rounded-full border-[1px] border-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TodoList todos={filteredTodos} />
            </TabsContent>
            <TabsContent value="pending">
              <TodoList
                todos={filteredTodos.filter(
                  (todo) => todo.status === 'pending'
                )}
              />
            </TabsContent>
            <TabsContent value="completed">
              <TodoList
                todos={filteredTodos.filter(
                  (todo) => todo.status === 'completed'
                )}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index
