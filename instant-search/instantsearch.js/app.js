/* global instantsearch */

opts = {
  appId: '98SAHNRE8Y',
  apiKey: '1a963f40dcd174f37febe3e188e27299',
  indexName: 'LinkedinUser'
};

custom_searchable = ['skills', 'locality', 'current_company'];
client = algoliasearch(opts['appId'], opts['apiKey']);
index = client.initIndex(opts['indexName']);
helper = algoliasearchHelper(client, opts['indexName'], {disjunctiveFacets: custom_searchable});
app({
  appId: '98SAHNRE8Y',
  apiKey: '1a963f40dcd174f37febe3e188e27299',
  indexName: 'LinkedinUser'
});

function app(opts) {
  var and_filter = ['skills'];
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true
  });

  var widgets = [
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for products'
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 10,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results')
      }
    }),
    instantsearch.widgets.stats({
      container: '#stats'
    }),
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [{
        name: opts.indexName, label: 'Most relevant'
      }, {
        name: opts.indexName + '_price_asc', label: 'Lowest price'
      }, {
        name: opts.indexName + '_price_desc', label: 'Highest price'
      }]
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input'
    }),
    instantsearch.widgets.refinementList({
      showMore: true,
      container: '#skills',
      attributeName: 'skills',
      limit: 10,
      operator: 'and',
      templates: {
        header: getHeader('skills')
      }
    }),
    instantsearch.widgets.refinementList({
      container: '#locality',
      attributeName: 'locality',
      limit: 10,
      operator: 'or',
      templates: {
        header: getHeader('locality')
      }
    }),
    instantsearch.widgets.refinementList({
      container: '#current_company',
      attributeName: 'current_company',
      limit: 10,
      operator: 'or',
      templates: {
        header: getHeader('current_company')
      }
    }),
    instantsearch.widgets.refinementList({
      container: '#industry',
      attributeName: 'industry',
      limit: 10,
      operator: 'or',
      templates: {
        header: getHeader('industry')
      }
    }),
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'engineerrank_percentile',
      templates: {
        header: getHeader('engineerrank_percentile')
      }
    }),
    instantsearch.widgets.rangeSlider({
      container: '#yoos',
      attributeName: 'years_out_of_school',
      templates: {
        header: getHeader('years_out_of_school')
      }
    }),
    instantsearch.widgets.refinementList({
      container: '#type',
      attributeName: 'classification',
      limit: 10,
      operator: 'and',
      templates: {
        header: getHeader('classification')
      }
    })
  ];

  widgets.forEach(search.addWidget, search);
  search.start();

    search.once('render', function() {

  for (var i = 0; i < custom_searchable.length; i++) {
    s = custom_searchable[i];
    autocomplete('#' + custom_searchable[i] + ' .searchbox', {hint: false}, [
      {
        source: function(query, cb) {
          cb([query]);
        }, //autocomplete.sources.hits(index, {hitsPerPage: 5}),
        //displayKey: custom_searchable[i],
        templates: {
          suggestion: function(suggestion) {
            return suggestion;
          }
        }
      }
    ]).on('autocomplete:selected', function(event, suggestion, dataset) {
      s = $(event.target).attr('searchkey');
      console.log(s);
      h = search.helper;
      if (and_filter.indexOf(s) > -1) {
        h.addFacetRefinement(s, suggestion).search();
      } else {
        h.addDisjunctiveFacetRefinement(s, suggestion).search();
      }
    });
    $('#' + custom_searchable[i] + ' .searchbox').attr('searchkey', custom_searchable[i]);
  }
    });
}

function getTemplate(templateName) {
  return document.querySelector('#' + templateName + '-template').innerHTML;
}

function getHeader(title) {
  var html = '<h5>' + title + '</h5>';
  if (custom_searchable.indexOf(title) > -1) {
   html += '<input type="text" class="searchbox" />';
  }
  return html;
}
