import React from 'react'

const Course = ({ course }) => {
    return (
        <>
            <div>
                <div className="bg-white rounded-xl shadow-md p-6 w-[400px] hover:shadow-2xl transition-all">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-auto mb-4 rounded-lg" />
                    <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                    <p className="text-gray-600 mb-2">{course.description}</p>
                    <p className="text-green-600 font-semibold mb-2">Price: ${course.price}</p>
                    <div className="flex flex-row gap-x-5 justify-between items-center">
                        <p className={`text-sm ${course.published ? 'text-green-600' : 'text-red-600'} flex text-center`}>
                            {course.published ? 'Published' : 'Not Published'}
                        </p>
                        <div className="flex flex-row gap-x-3">

                        <button
                                type="button"
                                className="w-fit px-5 text-sm bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600 transition-all"
                            >
                                Update
                        </button>
                        <button
                                type="button"
                                className="w-fit px-5 text-sm bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-500 transition-all"
                            >
                                Delete
                        </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Course