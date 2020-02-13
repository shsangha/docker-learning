const getSuggestions = async (_, args, { esClient }, info) => {
  //  const status = sold ? 'sold' : 'available';

  const results = await esClient.search({
    index: 'listings',
    body: {
      query: {
        match_all: {}
      }
    }
  });
  return 'SFD';
};

module.exports = getSuggestions;
