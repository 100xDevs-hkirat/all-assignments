import React, { useRef, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../recoil.js/atom';
import { toast } from 'react-hot-toast';

const Card = ({ course }) => {

    const navigate = useNavigate();

    return (
        <>



            <div>
                <Link to={`/courses/${course.id}`}>
                    <div className="bg-white rounded-xl shadow-md p-6 w-[400px] z-0 hover:shadow-2xl transition-all cursor-pointer">
                        <img src={course.imageUrl} alt={course.title} className="w-full h-auto mb-4 rounded-lg" />
                        <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                        <p className="text-gray-600 mb-2">{course.description}</p>
                        <p className="text-green-600 font-semibold mb-2">Price: ${course.price}</p>
                        <div className="flex flex-row gap-x-5 justify-between items-center">
                            <p className={`text-sm ${course.published ? 'text-green-600' : 'text-red-600'} flex text-center`}>
                                {course.published ? 'Published' : 'Not Published'}
                            </p>

                        </div>
                    </div>
                </Link>

            </div>
        </>
    )
}

export default Card