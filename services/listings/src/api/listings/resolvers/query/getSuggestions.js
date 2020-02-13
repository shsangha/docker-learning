const getSuggestions = async (_, { input, size, sold }, { esClient }, info) => {
  const formatQuery = field => {
    const status = sold ? 'sold' : 'available';

    return {
      size: 0,
      query: {
        bool: {
          must: [{ match: { [`${field}`]: input } }],
          must_not: [{ term: { status } }]
        }
      },
      aggs: {
        aggregated_results: {
          terms: {
            field: `${field}.raw`,
            size,
            order: {
              max_score: 'desc'
            }
          },
          aggs: {
            top_hit: { top_hits: { size: 1 } },
            max_score: { max: { script: '_score' } }
          }
        }
      }
    };
  };

  const searchResults = await esClient.msearch({
    body: [
      { index: 'listings', type: 'listings' },
      formatQuery('designer'),
      { index: 'listings', type: 'listings' },
      formatQuery('name')
    ]
  });

  return ['results', 'from ', 'server'];
};

module.exports = getSuggestions;
