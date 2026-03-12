import createAxiosInstance from '../index'

export const Api = {
  auth: {
    login: (identifier: string, password: string) => {
      return createAxiosInstance().post('/auth/local', {
        identifier,
        password
      })
    },
    get: () => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).get('/users/me', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
    },
    emailConfirmation: (email: string) => {
      return createAxiosInstance().post('/auth/send-email-confirmation', {
        email
      })
    }
  },
  activities: {
    list: () => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).get('/activities', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
    }
  },
  sessions: {
    get: (id: string) => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).get(`/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        params: {
          populate: '*'
        }
      })
    }
  },
  registrations: {
    create: (data: any) => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).post('/registrations', {
        data
      }, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
    },
    downloadBySession: (sessionId: string) => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).get('/registration/all', {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        params: {
          format: 'csv',
          sessionid: sessionId
        },
        responseType: 'blob'
      })
    },
    downloadByActivity: (activityId: string) => {
      const jwt = localStorage.getItem('user.jwt')
      return createAxiosInstance({ requiresAuth: true }).get('/registration/all', {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        params: {
          format: 'csv',
          activityid: activityId
        },
        responseType: 'blob'
      })
    }
  }
}
