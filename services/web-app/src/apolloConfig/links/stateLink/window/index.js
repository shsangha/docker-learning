const defaults = {
  windowWidth: window.innerWidth
};

const resolvers = {
  Mutation: {
    handleWindowResize: (_, { windowWidth }, { cache }) => {
      console.log('called');
      const data = {
        windowWidth,
        __typename: 'window_width'
      };
      cache.writeData({ data });
      return null;
    }
  }
};

export default {
  defaults,
  resolvers
};
