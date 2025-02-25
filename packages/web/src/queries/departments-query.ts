import { useAxios } from '@/composables/use-axios'
import type { CreateDepartmentType } from '@/schema/create-department-schema'
import type { FetchDepartmentResponseType } from '@/types/org'
import type { ResponseObject } from '@/types/utils'
import { decodeArrayBuffer } from '@/utils/resp-decode'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, watch } from 'vue'

export const departmentQueryKeys = {
  all: ['org:departments'],
  details: () => [departmentQueryKeys.all, 'detail'],
  detail: (id: string) => [departmentQueryKeys.details(), id],
  pagination: (page: number) => [departmentQueryKeys.all, 'page', page],
  search: (query: string) => [departmentQueryKeys.all, 'search', query],
  infinite: () => [departmentQueryKeys.all, 'infinite'],
}

type Options = {
  page?: number
  search?: string
}

type AddDepartmentMemberPayload = {
  users: number[]
}

type AddDepartmentRolePayload = {
  user_id: number
  title_id: number
  start_date: string
  department_id: number
}

type UpdateRecordType = [string, CreateDepartmentType]
type AddUserToDepartmentType = [number, AddDepartmentMemberPayload]
// type AddRoleToDepartmentType = [number, AddDepartmentRolePayload]
export const useDepartmentQuery = function (
  props: Options = {
    page: 1,
    search: '',
  },
) {
  const selectedDepartment = ref<FetchDepartmentResponseType['data'][number] | null>(null)
  const selectedRecordId = ref('')
  const queryClient = useQueryClient()
  type DepartmentType = FetchDepartmentResponseType['data'][number]
  const axios = useAxios()

  async function fetchRecords() {
    const resp = await axios.get<ArrayBuffer>('/departments', {
      method: 'GET',
      responseType: 'arraybuffer',
    })
    return decodeArrayBuffer<ResponseObject<DepartmentType[]>>(resp.data).data
  }

  async function createRecord(payload: CreateDepartmentType) {
    await axios.post('/departments', payload)
  }

  function updateRecord([id, payload]: UpdateRecordType) {
    return axios.put(`/departments/${id}`, payload)
  }

  function fetchSingleRecord(id: string) {
    return axios.get(`/departments/${id}`)
  }

  function setSelectedRecordId(id: string) {
    selectedRecordId.value = id
  }

  function addDepartmentMember([id, payload]: AddUserToDepartmentType) {
    return axios.post(`/departments/add-member/${id}`, payload)
  }

  function addRoleToDepartment(payload: AddDepartmentRolePayload) {
    return axios.post(`/departments-roles`, payload)
  }
  const recordsQuery = useQuery<DepartmentType[]>({
    queryKey: departmentQueryKeys.all,
    queryFn: fetchRecords,
    initialData: [],
  })

  const singleRecordQuery = useQuery({
    queryKey: departmentQueryKeys.detail(selectedRecordId.value),
    queryFn: () => fetchSingleRecord(selectedRecordId.value),
    enabled: selectedRecordId.value !== '',
  })

  const createRecordMutation = useMutation({
    mutationFn: createRecord,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentQueryKeys.all })
    },
  })

  const updateRecordMutation = useMutation({
    mutationFn: updateRecord,
    onMutate: async (payload) => {
      // await queryClient.cancelQueries({
      //   queryKey: [departmentQueryKeys.all, departmentQueryKeys.detail(payload[0])],

      // })
      const previousData = queryClient.getQueryData<DepartmentType[]>(departmentQueryKeys.all)
      queryClient.setQueryData<DepartmentType[]>(departmentQueryKeys.all, (old) => {
        return old?.map((record) => {
          if (record.uuid === payload[0]) {
            return {
              ...record,
              ...payload[1],
            }
          }
          return record
        })
      })
    },
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          departmentQueryKeys.all,
          // departmentQueryKeys.detail(payload[0]),
        ],
      })
    },
  })

  const addUserToDepartmentMutation = useMutation({
    mutationFn: addDepartmentMember,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.all,
      })
    },
  })
  const addRoleToDepartmentMutation = useMutation({
    mutationFn: addRoleToDepartment,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentQueryKeys.all,
      })
    },
  })

  function selectCurrentDepartment(id: number) {
    const found = recordsQuery.data?.value.find((record) => record.id === id) || null
    console.log('Found', found)
    selectedDepartment.value = found
  }

  return {
    recordsQuery,
    createRecordMutation,
    updateRecordMutation,
    singleRecordQuery,
    setSelectedRecordId,
    addUserToDepartmentMutation,
    addRoleToDepartmentMutation,
    selectCurrentDepartment,
    selectedDepartment,
  }
}
