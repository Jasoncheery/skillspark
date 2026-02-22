export default {
  routes: [
    {
      method: 'GET',
      path: '/classes',
      handler: 'class.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/classes/:documentId',
      handler: 'class.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/classes',
      handler: 'class.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/classes/:documentId',
      handler: 'class.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/classes/:documentId',
      handler: 'class.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
