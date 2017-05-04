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
    $row = $result->fetch_assoc();

    $findExistQuery = $mysqli->query('SELECT `code` FROM `role` WHERE `id` IN ('.$row['roles'].')');
    while ($findExistRes = $findExistQuery->fetch_assoc()) {
        $ret[] = $findExistRes['code'];
    }

}

echo json_encode($ret);

$mysqli->close();