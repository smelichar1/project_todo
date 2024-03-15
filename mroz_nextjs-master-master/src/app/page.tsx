import Todo from "../components/todo";
import Link from "next/link";
import { prisma } from "./db";
import { revalidatePath } from "../../node_modules/next/cache";

export type TodoType = {
    id: string;
    title: string;
    complete: boolean;
    deleted: boolean;
};

export default async function Page() {
    const todos = await prisma.todo.findMany();

    async function addTodo(formData: FormData) {
        "use server";
        const message = formData.get("createTodo");
        await prisma.todo.create({
            data: {
                content: message?.toString(),
            },
        });
        revalidatePath("/");
    }
    async function delTodo(formData: FormData) {
        "use server";
        const id = formData.get("todoId");
        await prisma.todo.delete({
            where: {
                id: parseInt(id),
            },
        });
        revalidatePath("/");
    }

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Moje Todo</h1>
            <form action={addTodo} className="flex w-full gap-4">
                <input
                    name="createTodo"
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 px-4 py-2"
                    type="text"
                    placeholder="Přidat novou položku"
                />
                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-sm px-5 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                    Přidat
                </button>
            </form>
            <div className="mt-8">
                {todos.map((todo: any) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-4"
                    >
                        <p className="text-lg">{todo.content}</p>
                        <form action={delTodo}>
                            <input type="hidden" name="todoId" value={todo.id} />
                            <button
                                type="submit"
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                X
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}
