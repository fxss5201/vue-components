import httpAxios from './index'
import type { StudentType } from '@/types/studentType'
import type { HttpResponseType } from '@/types/response'
import type { AxiosResponse } from 'axios'

interface StudentListHttpResponse extends HttpResponseType {
  result: StudentType[]
}
export function studentListHttp(): Promise<AxiosResponse<StudentListHttpResponse>> {
  return httpAxios.get('/api/students')
}

export function addStudentHttp(data: StudentType): Promise<AxiosResponse<HttpResponseType>> {
  return httpAxios.post('/api/students', data)
}

export function putStudentHttp(data: StudentType): Promise<AxiosResponse<HttpResponseType>> {
  return httpAxios.put(`/api/students/${data.id}`, data)
}

interface StudentByIdHttpResponse extends HttpResponseType {
  result: StudentType
}
export function getStudentByIdHttp(id: number): Promise<AxiosResponse<StudentByIdHttpResponse>> {
  return httpAxios.get(`/api/students/${id}`)
}

export function delStudentHttp(id: number): Promise<AxiosResponse<HttpResponseType>> {
  return httpAxios.delete(`/api/students/${id}`)
}
