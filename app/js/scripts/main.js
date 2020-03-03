(function ($) {
    'use strict';

    var rawData = [];
  
    var optionTemplate = $('<option val=""></option>');
  
    var feedTemplate = $('<div class="col-md-6">\n' +
      '      <div class="news-list-card">\n' +
      '        <a href="#" class="card-image"></a>\n' +
      '        <div class="news-details">\n' +
      '          <div class="news-title">\n' +
      '            <h2><a href="#"></a></h2>\n' +
      '          </div>\n' +
      '          <div class="tags"></div>\n' +
      '          <div class="extra">\n' +
      '           <p class="post-author"><a href="#"></a> / </p>\n' +
      '           <div class="post-date"></div>\n' +
      '          </div>\n' +
      '          <div class="post-desc"></div>\n' +
      '          <p class="link-more"><a href="#">Read More →</a></p>\n' +
      '        </div>\n' +
  
      '      </div>\n' +
      '    </div>');
  
    var feedFeaturedTemplate = $('<div class="col-12">\n' +
      '      <div href="#" class="news-list-card featuredCard">\n' +
      '        <div class="news-details">\n' +
      '           <div class="news-title">\n' +
      '            <h2><a href="#"></a></h2>\n' +
      '          </div>\n' +
      '          <div class="tags"></div>\n' +
      '          <div class="extra">\n' +
      '          <p class="post-author"><a href="#"></a> / </p>\n' +
      '          <div class="post-date"></div>\n' +
      '        </div>\n' +
      '        </div>\n' +
      '        <a href="#" class="card-image"></a>\n' +
      '      </div>\n' +
      '    </div>');
  
    let magnitt = {
      script: {
        init: function () {
          var that = this;
          that.getJson();
  
          setTimeout(function () {
            that.getCategoryList();
            that.displayContent(rawData);
          }, 500);
  
          that.filterContent();
          this.customSelect();
  
          setTimeout(function () {
            $(".post-desc").each(function () {
              $(this).text(function (index, currentText) {
                return currentText.substr(0, 175);
              });
            })
          }, 500)
  
        },
  
        getJson: function (cb) {
          var that = this;
  
          $.ajax({
            type: "GET",
            url: './js/json/data.json',
            format: "json",
            dataType: 'json',
            success: function (response) {
              rawData = response.data;
            }
          });
        },
  
        //Get all Category/Article list form array to make list
        getCategoryList: function () {
          var _category = [];
          var _articleType = [];
  
          rawData.map(function (row) {
            if (row != undefined) {
              var categories = row.category.split(',');
              var article_type = row.articleType;
              categories.map(function (cat) {
                if (jQuery.inArray(cat, _category) === -1) {
                  _category.push(cat);
                }
              });
  
              if (jQuery(article_type != undefined) && jQuery.inArray(article_type, _articleType) === -1) {
                _articleType.push(article_type);
              }
            }
          });
  
          this.generateDropdown(_category, '#category');
          this.generateDropdown(_articleType, '#articleType');
        },
  
        //function to generate the dropdown form the array list
        generateDropdown: function (optionArr, target) {
          $(target).html('<option value="">Select ' + ((target === '#category') ? 'Category' : 'Article') + ' Type...</option>');
          optionArr.map(function (row) {
            var clone = optionTemplate.clone();
            clone.attr('value', row);
            clone.html(row);
            $(target).append(clone);
          });
        },
  
        // Filter list of array according to the value changed Category/Type
        filterContent: function () {
          var _that = this;
          $('select#category').on('change', function () {
            var type = $("#articleType option:selected").val();
            var cat = $(this).val();
            _that.getFilter(cat, type)
          });
  
          $('select#articleType').on('change', function () {
            var cat = $("#category option:selected").val();
            var type = $(this).val();
            _that.getFilter(cat, type)
          });
        },
  
        //Function to do filter form the array
        getFilter: function (cat, type) {
          var _that = this;
          var filteredCat = rawData.filter(function (ele) {
            if (ele.articleType.indexOf(type) > -1 && ele.category.indexOf(cat) > -1) {
              return ele;
            }
          });
          _that.displayContent(filteredCat);
        },
  
        //Populate the content based on ajax request and filter
        displayContent: function (data) {
          var newData = [];
          var featureArr = [];
          var normalArr = [];
  
          $('#newsFeed').html('');
  
          if (data.length) {
            $('#newsFeed #errorMsg').remove();
  
            data.map(function (ele) {
              if (ele.isFeatured != undefined && ele.isFeatured.indexOf(1) > -1) {
                featureArr.push(ele);
              } else {
                normalArr.push(ele);
              }
            });
  
            if (featureArr != undefined && featureArr.length) {
              featureArr.map(function (ele) {
                var clone = feedFeaturedTemplate.clone();
  
                var cats = ele.category.split(',');
                var appendTags = []
                cats.map(function (ele) {
                  appendTags.push('<a href="#" class="badge">' + ele + '</a>');
                });
  
                clone.find('.card-image').attr('style', 'background-image:url(./' + $.trim(ele.image));
                clone.find('.news-title h2 a').html(ele.title);
                clone.find('.news-details .post-author a').html(ele.author);
                clone.find('.news-details .tags').html(appendTags);
                clone.find('.news-details .post-date').html('<p>' + ele.post_time + ' / ' + ele.post_date + '</p>');
                $('#newsFeed').append(clone);
              });
            }
  
            if (normalArr != undefined && normalArr.length) {
              normalArr.map(function (ele) {
                var clone = feedTemplate.clone();
                var cats = ele.category.split(',');
                var appendTags = []
                cats.map(function (ele) {
                  appendTags.push('<a href="#" class="badge">' + ele + '</a>');
                });
  
                clone.find('.card-image').addClass(cats).attr('style', 'background-image:url(./' + $.trim(ele.image));
                clone.find('.news-title h2 a').html(ele.title);
                clone.find('.news-details .post-desc').html(ele.description);
                clone.find('.news-details .post-author a').html(ele.author);
                clone.find('.news-details .tags').html(appendTags);
                clone.find('.news-details .post-date').html('<p>' + ele.post_time + ' / ' + ele.post_date + '</p>');
                $('#newsFeed').append(clone);
              });
            }
          } else {
            $('#newsFeed').append('<div class="col-md-12" id="errorMsg"><p>No Result Found!</p></div>')
          }
        },
  
        //Custom Dropdown
        customSelect: function () {
          $('.filter-block select').select2({
            minimumResultsForSearch: -1
          });
        },
      }
    };
  
    jQuery(function () {
      magnitt.script.init();
    });
  })(jQuery);