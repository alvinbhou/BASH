

function dialog_registry(dll_data) {
    var dll_dialog = document.querySelector('.mdl-dialog.dll-dialog');
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
    $.ajax({
      url: "data/tracelog.json",
      dataType: 'json',
      async: false,
      success: function (data) {
        console.log(data.length);
        var $tbody = $('#tracelog-tb tbody');
        for (var i = 0; i < data.length; ++i) {

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

          tracelog += '<strong>' + data[i]['action_name'] + '</strong> <br>';

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
          var tr = "<tr>" + tb_row + '</tr>';
          $tbody.append(tr);

        }
      }

    });
    var dll_data;
    $.ajax({
      url: "data/dll.json",
      dataType: 'json',
      async: false,
      success: function (data) {
        dll_data = data;
      }
    });
    var malware_data;
    $.ajax({
      url: "data/ms_malware_info.json",
      dataType: 'json',
      async: false,
      success: function (data) {
        malware_data = data;
        // malware_data = malware_data['allaple'];
        malware_data = malware_data[0]['content'][1];
      }
    });
    $('.ms-tab').click(function name(params) {
      $('.info-section .mal_tech_description_content').html(malware_data['tech']);
      $('.info-section .mal_symptons_content').html(malware_data['symptoms']);

      console.log($(this));
    });
    
    dialog_registry(dll_data);
});



