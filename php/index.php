<?php
//
function get_web_page($url){
	$user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';
	$options = array(
		CURLOPT_CUSTOMREQUEST  =>"GET",        // set request type post or get
		CURLOPT_POST           =>false,        // set to GET
		CURLOPT_USERAGENT      => $user_agent, // set user agent
		CURLOPT_COOKIEFILE     =>"cookie.txt", // set cookie file
		CURLOPT_COOKIEJAR      =>"cookie.txt", // set cookie jar
		CURLOPT_RETURNTRANSFER => true,        // return web page
		CURLOPT_HEADER         => false,       // don't return headers
		CURLOPT_FOLLOWLOCATION => true,        // follow redirects
		CURLOPT_ENCODING       => "",          // handle all encodings
		CURLOPT_AUTOREFERER    => true,        // set referer on redirect
		CURLOPT_CONNECTTIMEOUT => 120,         // timeout on connect
		CURLOPT_TIMEOUT        => 120,         // timeout on response
		CURLOPT_MAXREDIRS      => 10,          // stop after 10 redirects
	);
	//
	$ch      = curl_init( $url );
	curl_setopt_array( $ch, $options );
	$content = curl_exec( $ch );
	$err     = curl_errno( $ch );
	$errmsg  = curl_error( $ch );
	$header  = curl_getinfo( $ch );
	curl_close( $ch );
	//
	$header['errno']   = $err;
	$header['errmsg']  = $errmsg;
	$header['content'] = $content;
	return $header;
}
//
$output = [];
$api = 'https://www.balldontlie.io/api/v1/';
//
if(isset($_POST['method'])){
  // Vars
  $playersJson = '../players.json';
  $players = [];
  // If file do not exist, create
  if(!file_exists($playersJson)){
    if($fp = fopen($playersJson, 'w')){
      fwrite($fp, json_encode($players));
      fclose($fp);
    }    
  }else{
    $string = file_get_contents($playersJson);
    $players = json_decode($string, true);
  }
  // 
  switch($_POST['method']){
    case 'players':
      // API / Service
      $page = $_POST['page'];
      $per_page = 10;
      $content = get_web_page($api . 'players?page=' . $page . '&per_page=' . $per_page);
      $data = json_decode($content['content'], true);
      $arr = [];
      foreach($data['data'] as $k => $v){
        //
        if(!isset($players['player_' . $v['id']])){
          $v['new'] = true;
          $players['player_' . $v['id']] = $v;
        }else{
          $v = $players['player_' . $v['id']];
          $v['new'] = false;
        }
        // Table
        $arr[] = $v;
      }
      $data['data'] = $arr;
      // 
      $output['data'] = $data;
      $output['players'] = $players;
      //
      break;
    case 'update':
      $players['player_' . $_POST['id']]['first_name'] = $_POST['first_name'];
      $players['player_' . $_POST['id']]['last_name'] = $_POST['last_name'];
      $players['player_' . $_POST['id']]['height_feet'] = $_POST['height_feet'];
      $players['player_' . $_POST['id']]['height_inches'] = $_POST['height_inches'];
      $players['player_' . $_POST['id']]['weight_pounds'] = $_POST['weight_pounds'];
      $players['player_' . $_POST['id']]['position'] = $_POST['position'];
      $output['data'] = $players['player_' . $_POST['id']];
      break;
    case 'create':
      $id = 'new_' . mt_rand(1,10000);
      $player = array(
        'id' => $id,
        'first_name' => $_POST['first_name'],
        'last_name' => $_POST['last_name'],
        'height_feet' => $_POST['height_feet'],
        'height_inches' => $_POST['height_inches'],
        'weight_pounds' => $_POST['weight_pounds'],
        'position' => $_POST['position']
      );
      $players['player_' . $id] = $player;
      $output['data'] = $players['player_' . $id];
      break;
    case 'delete':
      unset($players['player_' . $_POST['id']]);
      break;
  }  
}
// Update / Rewrite JSON
if($fp = fopen($playersJson, 'w')){
  fwrite($fp, json_encode($players));
  fclose($fp);
}
//  
echo json_encode($output);
?>