module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/submissions',
      handler: 'submission.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/submissions/:id',
      handler: 'submission.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/submissions',
      handler: 'submission.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/submissions/:id',
      handler: 'submission.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/submissions/:id',
      handler: 'submission.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
