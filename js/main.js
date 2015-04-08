/*
    to further implement
    1. message for when no photos are available/found
    2. user input for subreddit and type
    3. user option for 1, 2 or 3 columns
    4. use bootstrap to make it pretty
*/

var appNameSpace = {};

appNameSpace.configuration = {
    ajaxUrl: function(options){
        return "https://www.reddit.com/r/"+options.subreddit+".json"
    }
};

appNameSpace.helper = {
    filterForJpg: function(data){
        var filteredData = data.data.children.filter(function(el){
           return el.data.url.indexOf(".jpg") > -1;
        });
        return this.filterNsfw(filteredData);
    },
    filterForGif: function(data){
        var filteredData = data.data.children.filter(function(el){
           return el.data.url.indexOf(".gif") > -1 && el.data.url.indexOf(".gifv") === -1;
        });
        return this.filterNsfw(filteredData);
    },
    filterNsfw: function(data){
        var filteredData = data.filter(function(el){
           return !el.data.over_18;
        });
        return filteredData;
    },
    getUrls: function(data){
        var urls = data.map(function(a){
            return a.data.url;
        });
        return urls;
    }
};

appNameSpace.createHtml = function(urls){
    $.each(urls, function(index, url) {
        var img_tag = '<img src="'+url+'"/>';
        $(".gifs").append(img_tag);
    });
}

appNameSpace.onSuccess = function(data, options){
    var filteredData, urls;
    switch (options.type){
        case 'jpg': filteredData = appNameSpace.helper.filterForJpg(data);
        break;
        case 'gif': filteredData = appNameSpace.helper.filterForGif(data);
        break;
    }
    urls = appNameSpace.helper.getUrls(filteredData);
    appNameSpace.createHtml(urls);
};

appNameSpace.ajaxCall = function(options){
    $.ajax({
        url: appNameSpace.configuration.ajaxUrl(options),
        dataType: "jsonp",
        jsonp:    "jsonp",
        success: function(data){
            appNameSpace.onSuccess(data, options);
        }
    });
};

appNameSpace.init = function(opt){
    appNameSpace.ajaxCall(opt);
};

$(document).ready(function(){
  var options = {
    subreddit: "perfectgifs",
    type: "gif"
  };

  appNameSpace.init(options);
});
