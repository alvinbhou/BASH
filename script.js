function findGetParameter(parameterName) {
  var result = null,
      tmp = [];
  location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
  return result;
}

function load_descri(malwareName){
  var dataSource = ['Self', 'Microsoft', 'F-Secure'];
  var dataSourceColor = ['purple', 'blue', 'green'];
  var malware_data = {};

  var template = '';
  for(var i = 0 ; i < dataSource.length ; ++i){
    var sourceSymbol = dataSource[i][0].toUpperCase();
    console.log(sourceSymbol);
    $.ajax({
      url: "data/malware_info_"+dataSource[i].toLowerCase()+"/"+malwareName+".json",
      dataType: 'json',
      async: false,
      success: function (data) {
        var dataNum = data['content'].length;
        for(var k = 0 ; k < dataNum ; ++k){
          var infoID = 'mal-descr-' + dataSource[i]+k.toString();
          malware_data[infoID] = data['content'][k];

          template += '<span id="'+infoID+'" class="mdl-chip mdl-chip--contact pointer mal-descri-tab">';
          template += '<span class="mdl-chip__contact mdl-color--'+dataSourceColor[i]+' mdl-color-text--white">'+sourceSymbol+'</span>';
          template += '<span class="mdl-chip__text">'+dataSource[i]+'</span>';
          template += '</span>';
        }
      }
    });
  }
  $('.mal-descri-tabs').html(template);

  

  $('.mal-descri-tabs .mal-descri-tab').click(function name(params) {
    var infoID = $(this).attr('id');
    var t = $('.mal_tech_description');
    if(malware_data[infoID]['tech']){
      t.show();
      $('.info-section .mal_tech_description_content').html(malware_data[infoID]['tech']);
    }else{
      t.hide()
    }
    t = $('.mal_symptons');
    if(malware_data[infoID]['symptoms']){
      t.show();
      $('.info-section .mal_symptons_content').html(malware_data[infoID]['symptoms']);
    }else{
      t.hide()
    }
    t = $('.mal_behaviors');
    if(malware_data[infoID]['summary']){
      t.show();
      $('.info-section .mal_behaviors_content').html(malware_data[infoID]['summary']);
    }else{
      t.hide()
    }

    
  });

  if($('.mal-descri-tab').length){
    $('.mal-descri-tab')[0].click(); // 看第一個
  }else{
    $('.info-section').hide();
  }
}


function load_tracelog(malwareName){
  var tracelogColor  ;
  $.ajax({
    url: "data/tracelogColor.json",
    dataType: 'json',
    async: false,
    success: function (data) {
      tracelogColor = data;
    }
  });
  var tracelogHighlightRule;
  $.ajax({
    url: "data/tracelogHighlightRule.json",
    dataType: 'json',
    async: false,
    success: function (data) {
      tracelogHighlightRule = data;
    }
  });


  // tracelog data
  $.ajax({
    url: "data/tracelog/"+malwareName+".json",
    dataType: 'json',
    async: false,
    success: function (data) {
      console.log(data.length);
      var $tbody = $('#tracelog-tb tbody');
      for (var i = 0; i < data.length; ++i) {
        var actionName = data[i]['action_name'];
        
        var shouldHighlight = false;
        // highlight action_name
        for(var j = 0; j <tracelogHighlightRule['action_name'].length; ++j){
          if(actionName.indexOf(tracelogHighlightRule['action_name'][j]) != -1){
            
            shouldHighlight = true;
            break;
          }
        }
        // highlight actions
        for(var k = 0; k <data[i]['actions'].length; ++k){
          for(var j = 0; j <tracelogHighlightRule['actions'].length; ++j){
            if(data[i]['actions'][k].join(' ').indexOf(tracelogHighlightRule['actions'][j]) != -1){
              
              shouldHighlight = true;
              break;
            }
          }
        }

        var backgroundColorHTML = shouldHighlight? ';background-color:'+tracelogColor[actionName]['backgroundColor']:'';
        var actionNameColorHTML = 'color: '+ tracelogColor[actionName]['color'] +';';

        var tb_row = "";
        // index
        tb_row += '<td>' + (i+1).toString() + '</td>';

        // stage
        var stage;
        if (i <= 23)
          stage = '1';
        else if (i <= 91)
          stage = '2';
        else if (i <= 96)
          stage = '3';
        else
          stage = '4';
        tb_row += '<td>' + stage + '</td>';

        // technical description
        tb_row += '<td>' + 'TD' + '</td>';

        // observed behavior
        tb_row += '<td>' + 'OB' + '</td>';
        var tracelog = "";


        

        
        tracelog += '<strong style="'+actionNameColorHTML+'">' + actionName + '</strong> <br>';

        if (data[i]['actions'].length > 0) {
          for (var j = 0; j < data[i]['actions'].length; ++j) {
            tracelog += data[i]['actions'][j][0] + ": ";
            if (data[i]['actions'][j][1].toLowerCase().includes("dll")) {
              tracelog += '<span class="dll">' + data[i]['actions'][j][1] + '</span><br>';
            }
            else{
              tracelog += data[i]['actions'][j][1] + '<br>';
              
            }
          }
        }
        tracelog += "Return:" + data[i]['return'];

        tb_row += '<td >' + tracelog + '</td>';
        var tr = "<tr style=\""+backgroundColorHTML+"\">" + tb_row + '</tr>';
        $tbody.append(tr);

      }
    },error: function(){
      $('#tracelog_top_msg').text('No Data.');
    }

  });
}

function load_summary(malwareName){
  var summaryData;
  $.ajax({
    url: "data/malware_info_summary/"+malwareName+".json",
    dataType: 'json',
    async: false,
    success: function (data) {
      summaryData = data;
      $('.mal_name').html(summaryData['name']);
      $('.mal_summary').html(summaryData['summary']);
      $('.mal_contact_type').html(summaryData['contactType'].toUpperCase());
    },error: function(){
      $('.mal_summary').html('No data.');
    }
  });
}

function dialog_registry(dll_data) {
    var dll_dialog = document.querySelector('.mdl-dialog.dll-dialog');
    if (! dll_dialog.showModal) {
        dialogPolyfill.registerDialog(dll_dialog);
      }
    dll_dialog.querySelector('.close').addEventListener('click', function () {
      dll_dialog.close();
    });
    $('.dll').click(function () {
      var dll = $(this).text().toLowerCase();
      if (dll_data[dll]) {
        // console.log(dll, dll_data[dll]);
        dll_dialog.querySelector('.mdl-dialog__title').innerHTML = dll;
        dll_dialog.querySelector('p').innerHTML = dll_data[dll];
        dll_dialog.showModal();
      }
    });
}

$(window).ready(function () {
    // animation
    var toggle = false;
    setInterval(function(){
      if(toggle) $('.animate_shining').show();
      else $('.animate_shining').hide();
      toggle = !toggle;
    }, 777);



    var malwareName = findGetParameter('name');
    if(!malwareName){
      $('.mdl-layout__tab-panel').hide();
      $('#welcomeMsg').show();
      $('.mdl-layout__tab.for_a_malware').hide();
      return;
    }else{
      malwareName = malwareName.toLowerCase();
      $("#welcomeMsg").hide()
    }

    load_tracelog(malwareName);


    load_descri(malwareName);
    load_summary(malwareName);
    

    var dll_data;
    $.ajax({
      url: "data/dll.json",
      dataType: 'json',
      async: false,
      success: function (data) {
        dll_data = data;
      }
    });
    dialog_registry(dll_data);


    // android-search-box
    $('.android-search-box').click(function(){
      $(this).addClass('is-focused');
    })
});



