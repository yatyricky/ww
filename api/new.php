<?php
require_once 'conn.php';

$profile = preg_replace("/[^a-z,]/", '', $_GET['profile']);

$roles = explode(',', $profile);
$game = [];
$ret = [];

if (count($roles) > 0) {
    $ret['result'] = 1;
} else {
    $ret['result'] = 0;
    $ret['message'] = 'No characters';
}

foreach ($roles as $k => $v) {
    $result = $mysqli->query('INSERT INTO `role` (`id`, `code`, `cid`) VALUES (NULL, "'.$v.'", "0")');
    if ($result) {
        $game[] = $mysqli->insert_id;
    } else {
        $ret['result'] = 0;
        $ret['message'] = 'Unable to allocate roles';
        break;
    }
}

if ($ret['result'] == 1) {
    $result = $mysqli->query('INSERT INTO `game` (`id`, `roles`) VALUES (NULL, "'.implode(',', $game).'")');
    if ($result) {
        $ret['message'] = $mysqli->insert_id;
    } else {
        $ret['result'] = 0;
        $ret['message'] = 'Unable to create game';
    }
}

echo json_encode($ret);

$mysqli->close();