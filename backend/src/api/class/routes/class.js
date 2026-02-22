module.exports = {
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
      path: '/classes/:id',
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
      path: '/classes/:id',
      handler: 'class.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/classes/:id',
      handler: 'class.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
