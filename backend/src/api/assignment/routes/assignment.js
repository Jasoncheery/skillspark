module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/assignments',
      handler: 'assignment.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/assignments/:id',
      handler: 'assignment.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/assignments',
      handler: 'assignment.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/assignments/:id',
      handler: 'assignment.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/assignments/:id',
      handler: 'assignment.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
