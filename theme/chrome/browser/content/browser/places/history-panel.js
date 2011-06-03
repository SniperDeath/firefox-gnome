//@line 40 "/builddir/build/BUILD/firefox-4.0.1/mozilla-2.0/browser/components/places/content/history-panel.js"

var gHistoryTree;
var gSearchBox;
var gHistoryGrouping = "";
var gSearching = false;

function HistorySidebarInit()
{
  gHistoryTree = document.getElementById("historyTree");
  gSearchBox = document.getElementById("search-box");

  gHistoryGrouping = document.getElementById("viewButton").
                              getAttribute("selectedsort");

  if (gHistoryGrouping == "site")
    document.getElementById("bysite").setAttribute("checked", "true");
  else if (gHistoryGrouping == "visited") 
    document.getElementById("byvisited").setAttribute("checked", "true");
  else if (gHistoryGrouping == "lastvisited")
    document.getElementById("bylastvisited").setAttribute("checked", "true");
  else if (gHistoryGrouping == "dayandsite")
    document.getElementById("bydayandsite").setAttribute("checked", "true");
  else
    document.getElementById("byday").setAttribute("checked", "true");
  
  searchHistory("");
}

function GroupBy(groupingType)
{
  gHistoryGrouping = groupingType;
  searchHistory(gSearchBox.value);
}

function searchHistory(aInput)
{
  var query = PlacesUtils.history.getNewQuery();
  var options = PlacesUtils.history.getNewQueryOptions();

  const NHQO = Ci.nsINavHistoryQueryOptions;
  var sortingMode;
  var resultType;

  switch (gHistoryGrouping) {
    case "visited":
      resultType = NHQO.RESULTS_AS_URI;
      sortingMode = NHQO.SORT_BY_VISITCOUNT_DESCENDING;
      break; 
    case "lastvisited":
      resultType = NHQO.RESULTS_AS_URI;
      sortingMode = NHQO.SORT_BY_DATE_DESCENDING;
      break; 
    case "dayandsite":
      resultType = NHQO.RESULTS_AS_DATE_SITE_QUERY;
      break;
    case "site":
      resultType = NHQO.RESULTS_AS_SITE_QUERY;
      sortingMode = NHQO.SORT_BY_TITLE_ASCENDING;
      break;
    case "day":
    default:
      resultType = NHQO.RESULTS_AS_DATE_QUERY;
      break;
  }

  if (aInput) {
    query.searchTerms = aInput;
    if (gHistoryGrouping != "visited" && gHistoryGrouping != "lastvisited") {
      sortingMode = NHQO.SORT_BY_TITLE_ASCENDING;
      resultType = NHQO.RESULTS_AS_URI;
    }
  }

  options.sortingMode = sortingMode;
  options.resultType = resultType;

  // call load() on the tree manually
  // instead of setting the place attribute in history-panel.xul
  // otherwise, we will end up calling load() twice
  gHistoryTree.load([query], options);
}

window.addEventListener("SidebarFocused",
                        function()
                          gSearchBox.focus(),
                        false);
