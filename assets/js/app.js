//
var endpoint = 'php/',
players = '',
current = 1;
// 
function getPlayers(page = 1){
  current = page;
  let send = {
    method: 'players',
    page: page
  };
  $.post(endpoint, send, function(res){
    // console.log('Players', res.players);
    players = res.players;
    // console.log('Result', res.data.data);
    $('table tbody').empty();
    $.each(res.data.data, function (i, d){
      let height = ((d.height_feet) ? d.height_feet + "'" : '') + ((d.height_inches) ? d.height_inches + "''" : ''),
      weight = (d.weight_pounds) ? d.weight_pounds : '',
      row = '<tr>\
        <td>' + ((page == 1) ? i + 1 : page * 10 + (i + 1) - 10) + '</td>\
        <td><a href="#" class="btn btn-info btn-sm" data-toggle="modal" data-target="#playerModal" data-id="player_' + d.id + '">Editar</a></td>\
        <td>' + d.first_name + '</td>\
        <td>' + d.last_name + '</td>\
        <td>' + height + '</td>\
        <td>' + weight + '</td>\
        <td>' + d.position + '</td>\
        <td>' + d.team.name + '</td>\
        <td>' + d.team.conference + '</td>\
        <td>' + d.team.division + '</td>\
      </tr>';
      $('table tbody').append(row);
    });
    // console.log('Meta', res.data.meta);
    let meta = res.data.meta,
    disabled = '<li class="page-item disabled">\
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">...</a>\
    </li>',
    total = meta.total_pages,
    current = meta.current_page,
    prev = (current == 1) ? '<li class="page-item disabled">\
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">\
        <span aria-hidden="true">&laquo;</span>\
      </a>\
    </li>' : '<li class="page-item">\
      <a class="page-link" href="#" aria-label="Anterior" onclick="getPlayers(' + (current - 1) + ');">\
        <span aria-hidden="true">&laquo;</span>\
      </a>\
    </li>',
    middle = '',
    next = (current == total) ? '<li class="page-item disabled">\
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">\
        <span aria-hidden="true">&raquo;</span>\
      </a>\
    </li>' : '<li class="page-item">\
      <a class="page-link" href="#" aria-label="Siguiente" onclick="getPlayers(' + (current + 1) + ');">\
        <span aria-hidden="true">&raquo;</span>\
      </a>\
    </li>',
    first = (current == 1) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">1</a></li>' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(1);">1</a></li>'
    last = (current == total) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' + total + '</a></li>' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + total + ');">' + total  + '</a></li>';
    //
    if(current == 1){
      middle += '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(2);">2</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(3);">3</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(4);">4</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(5);">5</a></li>\
      ' + disabled;
    }else if(current > 1 && current < 5){
      middle += ((current == 2) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(2);">') + '2</a></li>\
      ' + ((current == 3) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(3);">') + '3</a></li>\
      ' + ((current == 4) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(4);">') + '4</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(5);">5</a></li>\
      ' + disabled;
    }else if(current > (total - 4) && current < total){
      middle += disabled + ((current == (total - 4)) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 4) + ');">') + (total - 4) + '</a></li>\
      ' + ((current == (total - 3)) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 3) + ');">') + (total - 3) + '</a></li>\
      ' + ((current == (total - 2)) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 2) + ');">') + (total - 2) + '</a></li>\
      ' + ((current == (total - 1)) ? '<li class="page-item active" aria-current="page"><a class="page-link" href="#">' : '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 1) + ');">') + (total - 1) + '</a></li>';
    }else if(current == total){
      middle += disabled + '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 4) + ');">' + (total - 4) + '</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 3) + ');">' + (total - 3) + '</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 2) + ');">' + (total - 2) + '</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (total - 1) + ');">' + (total - 1) + '</a></li>';
    }else{
      middle += disabled + '<li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (current - 1) + ');">' + (current - 1) + '</a></li>\
      <li class="page-item active" aria-current="page"><a class="page-link" href="#">' + current + '</a></li>\
      <li class="page-item"><a class="page-link" href="#" onclick="getPlayers(' + (current + 1) + ');">' + (current + 1) + '</a></li>\
      ' + disabled;
    }
    //
    let pagination = '<ul class="pagination">\
      ' + prev + '\
      ' + first + '\
      ' + middle + '\
      ' + last + '\
      ' + next + '\
    </ul>';
    $('table tfoot nav, table thead nav').html(pagination);
  }, 'json');
}
// 
$(document).ready(function(){
  // Initial Load
  getPlayers();
  // Modal
  $('#playerModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget),
    player = button.data('id'),
    data = (player != '') ? players[player] : '';
    // console.log('player modal', player, data);
    //
    let modal = $(this);
    if(data != ''){
      modal.find('.modal-title').html('Jugador: <b>' + data.first_name + ' ' + data.last_name + '</b>');
      modal.find('.modal-footer .btn-danger').html('Eliminar').data('confirm', false).show();
      //
      $('#player_id').val(data.id);
      $('#player_first_name').val(data.first_name);
      $('#player_last_name').val(data.last_name);
      $('#player_feets').val(data.height_feet);
      $('#player_inches').val(data.height_inches);
      $('#player_weight').val(data.weight_pounds);
      $('#player_position').val(data.position);
      //
      if(data.team){
        let team = '<h4>' + data.team.name + '<br><small>' + data.team.city + '</small></h4>';
        $('#teamDetails').html(team);
      }else{
        $('#teamDetails').html('-');
      }
    }else{
      modal.find('.modal-title').html('Agregar Nuevo Jugador');
      modal.find('.modal-footer .btn-danger').hide();
      $('#playerForm input').val('');
      $('#teamDetails').html('<i>- No Disponible -</i>');
    }
  });
  // Form
  $('#playerForm').submit(function(e){
    e.preventDefault();
    let send = {
      method: ($('#player_id').val() != '') ? 'update' : 'create',
      id: $('#player_id').val(),
      first_name: $('#player_first_name').val(),
      last_name: $('#player_last_name').val(),
      height_feet: $('#player_feets').val(),
      height_inches: $('#player_inches').val(),
      weight_pounds: $('#player_weight').val(),
      position: $('#player_position').val()
    }
    $.post(endpoint, send, function(res){
      $('#playerModal').modal('hide');
      if($('#player_id').val() != ''){
        getPlayers(current);
      }else{
        console.log('new added', res);
      }
    }, 'json');
  });
  // Delete
  $('#playerModal .modal-footer .btn-danger').on('click', function (e){
    let confirm = $(this).data('confirm');
    if(confirm == true){
      let send = {
        method:'delete',
        id: $('#player_id').val(),
      }
      $.post(endpoint, send, function(res){
        $('#playerModal').modal('hide');
        getPlayers(current);
      }, 'json');
    }else{
      $(this).html('Seguro? (Click para Confirmar)').data('confirm', true);
    }
  });
  // Filter
    $('#filterForm').submit(function(e){
      e.preventDefault();
      let first = $('#filter_first').val(),
      last = $('#filter_last').val(),
      position = $('#filter_position').val(),
      team = $('#filter_team').val(),
      conference = $('#filter_conference').val(),
      division = $('#filter_division').val();
      if(first == '' && last == '' && position == '' && team == '' && conference == '' && division == ''){
        // console.log('no filters');
        let button = $(this).find('.btn-primary');
        button.html('No hay Filtros escritos');
        setTimeout(function(){
          button.html('Filtrar');
        }, 2500);
      }else{
        // console.log('Filtering', position, team, conference, division, players.length);
        let results = [];
        $.each(players, function(i, d){
          // console.log(i);
          let filter = '';
          if(
            (first != '' && d.first_name.toLowerCase() == first.toLowerCase()) ||
            (last != '' && d.last_name.toLowerCase() == last.toLowerCase()) ||
            (position != '' && d.position.toLowerCase() == position.toLowerCase()) ||
            ((d.team) && team != '' && d.team.name.toLowerCase() == team.toLowerCase()) ||
            ((d.team) && conference != '' && d.team.conference.toLowerCase() == conference.toLowerCase()) ||
            ((d.team) && division != '' && d.team.division.toLowerCase() == division.toLowerCase())
          ){
            results.push(d);
            // filter += d.position ==
          }
        });
        //
        $('table tbody').empty();
        if(results.length > 0){
          $.each(results, function (i, d){
            let team = (d.team) ? d.team.name : '-',
            conference = (d.team) ? d.team.conference : '-',
            division = (d.team) ? d.team.division : '-';
            let height = ((d.height_feet) ? d.height_feet + "'" : '') + ((d.height_inches) ? d.height_inches + "''" : ''),
            weight = (d.weight_pounds) ? d.weight_pounds : '',
            row = '<tr>\
              <td>' + (i + 1) + '</td>\
              <td><a href="#" class="btn btn-info btn-sm" data-toggle="modal" data-target="#playerModal" data-id="player_' + d.id + '">Editar</a></td>\
              <td>' + d.first_name + '</td>\
              <td>' + d.last_name + '</td>\
              <td>' + height + '</td>\
              <td>' + weight + '</td>\
              <td>' + d.position + '</td>\
              <td>' + team + '</td>\
              <td>' + conference + '</td>\
              <td>' + division + '</td>\
            </tr>';
            $('table tbody').append(row);
          });
        }else{
          let empty = '<tr>\
            <td colspan="10"><div class="text-center">- No hay Resultados con los Filtros escritos. Intente primero buscar mas jugadores para poder filtrarlos -<hr><button type="button" class="btn btn-warning" onclick="$(\'.btn-clear\').click();">Mostrar listado de Jugadores</button></div></td>\
          </tr>';
          $('table tbody').append(empty);
        }
      }
    });
  // Clear Filter
  $('.btn-clear').on('click', function (e){
    $('#filterForm input').val('');
    getPlayers(current);
  });
});