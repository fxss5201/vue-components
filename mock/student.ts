import { MockMethod } from 'vite-plugin-mock'
import { type StudentType } from '../src/types/studentType'
import { resultSuccess } from './http'

let studentList: StudentType[] = []

export default [
  {
    url: '/api/students',
    method: 'get',
    response: () => {
      return resultSuccess(studentList)
    }
  },
  {
    url: '/api/students/:id',
    method: 'get',
    response: ({ query }) => {
      return resultSuccess(studentList.find((x) => x.id === Number(query.id)))
    }
  },
  {
    url: '/api/students',
    method: 'post',
    timeout: 2000,
    response: ({ body }) => {
      let id = 1
      if (studentList.length > 0) {
        id = Number(studentList[studentList.length - 1]?.id ?? 0) + 1
      }
      studentList.push({
        ...body,
        id
      })
      return resultSuccess()
    }
  },
  {
    url: '/api/students/:id',
    method: 'put',
    response: ({ body }) => {
      const curIndex = studentList.findIndex((x) => x.id === body.id)
      studentList[curIndex] = {
        ...studentList[curIndex],
        ...body
      }
      return resultSuccess()
    }
  },
  {
    url: '/api/students/:id',
    method: 'delete',
    response: ({ query }) => {
      studentList = studentList.filter((x) => x.id !== Number(query.id))
      return resultSuccess()
    }
  }
] as MockMethod[]
