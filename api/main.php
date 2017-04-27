<?php
require_once 'conn.php';

try {
    $game = intval($_GET['game']);
} catch (Throwable $t) {
    return '[]';
    exit(0);
}

$result = $mysqli->query('SELECT `roles` FROM `game` WHERE `id`='.$game);

$ret = [];
if($result->num_rows > 0) {
    // fetch result as associative array
    $row = $result->fetch_assoc();

    // process
    $roles = explode(',', $row['roles']);
    $cid = $_GET['cid'];

    // define player
    if ($cid == '0') {
        $newPlayerQuery = $mysqli->query('SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "werewolf" AND TABLE_NAME = "player"');
        $cid = ($newPlayerQuery->fetch_row())[0];
        $ret['assignedID'] = $cid;

        $mysqli->query('INSERT INTO `player` (`id`) VALUES (NULL)');
    }

    // if player already assigned
    $findExistQuesy = $mysqli->query('SELECT * FROM `role` WHERE `cid` = "'.$cid.'" AND `id` IN ('.$row['roles'].')');
    if ($findExistQuesy->num_rows > 0) {
        // old player, refreshing
        $findExistRes = $findExistQuesy->fetch_assoc();
        $ret['result'] = 'Success';
        $ret['message'] = $findExistRes['code'];
    } else {
        // new player
        $findPlayerQuery = $mysqli->query('SELECT * FROM `role` WHERE `cid` = "0" AND `id` IN ('.$row['roles'].')');
        $findPlayerRes = $findPlayerQuery->fetch_all(MYSQLI_ASSOC);
        if (count($findPlayerRes) > 0) {
            $arrange = rand(0, count($findPlayerRes) - 1);
            $ret['result'] = 'Success';
            $ret['message'] = $findPlayerRes[$arrange]['code'];
            $mysqli->query('UPDATE `role` SET `cid` = '.$cid.' WHERE `role`.`id` = '.$findPlayerRes[$arrange]['id']);
        } else {
            $ret['result'] = 'Fail';
            $ret['message'] = 'Game already full';
        }
    }

} else {
    $ret['result'] = 'Fail';
    $ret['message'] = 'Game does not exist';
}

echo json_encode($ret);

$mysqli->close();